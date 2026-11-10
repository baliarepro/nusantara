-- Nusantara Property: tabel agen & listing + aturan privasi per agen
-- Jalankan sekali di Supabase → SQL Editor → New query → Run

-- 1. PROFIL AGEN (1 baris per akun login)
create table if not exists public.agents (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  agency text,
  phone text not null,
  email text,
  prov text,
  kab text,
  areas text,
  since int,
  specialties text[] default '{}',
  arebi text,
  bio text,
  photo_url text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

-- 2. LISTING (data publik)
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null default auth.uid() references public.agents(id) on delete cascade,
  title text not null,
  type text not null default 'Tanah',
  status text not null default 'Dijual',
  prov text,
  kab text,
  place text,
  size numeric,
  price numeric,
  unit text default 'total',
  cert text,
  zone text,
  description text,
  photos text[] default '{}',
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. DATA PRIBADI LISTING (hanya agen pemilik & admin)
create table if not exists public.listing_private (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  agent_id uuid not null default auth.uid() references public.agents(id) on delete cascade,
  owner_name text,
  owner_phone text,
  exact_address text,
  net_price numeric,
  notes text
);

-- 4. FUNGSI BANTU
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select is_admin from public.agents where id = auth.uid()), false)
$$;

create or replace function public.is_approved() returns boolean
language sql stable security definer set search_path = public as $$
  select coalesce((select status = 'approved' from public.agents where id = auth.uid()), false)
$$;

-- Agen tidak bisa menyetujui dirinya sendiri atau menjadi admin
create or replace function public.protect_agent_fields() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
      new.is_admin := false;
    else
      new.status := old.status;
      new.is_admin := old.is_admin;
    end if;
  end if;
  return new;
end $$;
drop trigger if exists agents_protect on public.agents;
create trigger agents_protect before insert or update on public.agents
  for each row execute function public.protect_agent_fields();

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$ begin new.updated_at := now(); return new; end $$;
drop trigger if exists listings_touch on public.listings;
create trigger listings_touch before update on public.listings
  for each row execute function public.touch_updated_at();

-- 5. ATURAN AKSES (Row Level Security)
alter table public.agents enable row level security;
alter table public.listings enable row level security;
alter table public.listing_private enable row level security;

-- Agen: publik melihat agen yang sudah disetujui; agen melihat & mengubah profilnya sendiri; admin semua
drop policy if exists agents_read on public.agents;
create policy agents_read on public.agents for select
  using (status = 'approved' or id = auth.uid() or public.is_admin());
drop policy if exists agents_insert on public.agents;
create policy agents_insert on public.agents for insert to authenticated
  with check (id = auth.uid());
drop policy if exists agents_update on public.agents;
create policy agents_update on public.agents for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());
drop policy if exists agents_delete on public.agents;
create policy agents_delete on public.agents for delete to authenticated
  using (public.is_admin());

-- Listing: publik melihat listing tayang dari agen yang disetujui; agen hanya mengelola miliknya; admin semua
drop policy if exists listings_read on public.listings;
create policy listings_read on public.listings for select
  using (
    (published and exists (select 1 from public.agents a where a.id = agent_id and a.status = 'approved'))
    or agent_id = auth.uid() or public.is_admin()
  );
drop policy if exists listings_insert on public.listings;
create policy listings_insert on public.listings for insert to authenticated
  with check ((agent_id = auth.uid() and public.is_approved()) or public.is_admin());
drop policy if exists listings_update on public.listings;
create policy listings_update on public.listings for update to authenticated
  using (agent_id = auth.uid() or public.is_admin())
  with check ((agent_id = auth.uid() and public.is_approved()) or public.is_admin());
drop policy if exists listings_delete on public.listings;
create policy listings_delete on public.listings for delete to authenticated
  using (agent_id = auth.uid() or public.is_admin());

-- Data pribadi: hanya pemilik listing & admin
drop policy if exists private_all on public.listing_private;
create policy private_all on public.listing_private for all to authenticated
  using (agent_id = auth.uid() or public.is_admin())
  with check (agent_id = auth.uid() or public.is_admin());

-- 6. FOTO LISTING (penyimpanan)
insert into storage.buckets (id, name, public) values ('listing-photos', 'listing-photos', true)
  on conflict (id) do nothing;
drop policy if exists photos_upload on storage.objects;
create policy photos_upload on storage.objects for insert to authenticated
  with check (bucket_id = 'listing-photos' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists photos_delete on storage.objects;
create policy photos_delete on storage.objects for delete to authenticated
  using (bucket_id = 'listing-photos' and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin()));

-- 7. TAMBAHAN: link Google Maps untuk listing tanah
alter table public.listings add column if not exists maps_url text;

-- 8. TAMBAHAN: hadap, luas bangunan, kamar tidur, kamar mandi
alter table public.listings
  add column if not exists facing text,
  add column if not exists building_size numeric,
  add column if not exists bedrooms int,
  add column if not exists bathrooms int;

-- 9. TAMBAHAN: listing yang tidak diperbarui 60 hari otomatis tidak tampil ke publik
drop policy if exists listings_read on public.listings;
create policy listings_read on public.listings for select
  using (
    (published and updated_at > now() - interval '60 days'
      and exists (select 1 from public.agents a where a.id = agent_id and a.status = 'approved'))
    or agent_id = auth.uid() or public.is_admin()
  );

-- 10. SKALA RIBUAN LISTING: harga total (untuk filter budget & urutan harga) + indeks pencarian
alter table public.listings add column if not exists total_price numeric
  generated always as (case when unit = 'are' and size is not null then price * size / 100 else price end) stored;
create index if not exists listings_live_idx on public.listings (published, updated_at desc);
create index if not exists listings_agent_idx on public.listings (agent_id);
create index if not exists listings_prov_kab_idx on public.listings (prov, kab);
create index if not exists listings_type_status_idx on public.listings (type, status);
create index if not exists listings_total_price_idx on public.listings (total_price);
create index if not exists listings_created_idx on public.listings (created_at desc);

-- 11. TANDAI TERJUAL / TERSEWA
alter table public.listings add column if not exists sold_at timestamptz;
create index if not exists listings_sold_idx on public.listings (sold_at);

-- 12. HAPUS OTOMATIS LISTING TERJUAL / TERSEWA 7 HARI SETELAH DITANDAI

-- a. Antrean foto yang perlu dihapus dari penyimpanan (dibersihkan otomatis saat admin membuka dasbor)
create table if not exists public.photo_trash (
  path text primary key,
  queued_at timestamptz not null default now()
);
alter table public.photo_trash enable row level security;
drop policy if exists trash_admin on public.photo_trash;
create policy trash_admin on public.photo_trash for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- b. Setiap listing yang dihapus: foto-fotonya masuk antrean hapus
create or replace function public.queue_listing_photos() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.photo_trash (path)
  select substring(u from '/listing-photos/([^?]+)')
  from unnest(coalesce(old.photos, '{}')) as u
  where u like '%/listing-photos/%'
  on conflict do nothing;
  return old;
end $$;
drop trigger if exists listings_trash_photos on public.listings;
create trigger listings_trash_photos after delete on public.listings
  for each row execute function public.queue_listing_photos();

-- c. Fungsi hapus permanen listing yang ditandai terjual/tersewa lebih dari 7 hari
create or replace function public.purge_sold_listings() returns integer
language plpgsql security definer set search_path = public as $$
declare n integer;
begin
  delete from public.listings
  where sold_at is not null and sold_at < now() - interval '7 days';
  get diagnostics n = row_count;
  return n;
end $$;
revoke all on function public.purge_sold_listings() from public, anon, authenticated;

-- d. Jalankan otomatis setiap jam (pg_cron)
create extension if not exists pg_cron;
select cron.schedule('hapus-listing-terjual', '23 * * * *', 'select public.purge_sold_listings()');


-- 13. SATUAN HARGA PER m² (untuk filter budget & urutan harga)
drop index if exists public.listings_total_price_idx;
alter table public.listings drop column if exists total_price;
alter table public.listings add column total_price numeric
  generated always as (
    case
      when unit = 'are' and size is not null then price * size / 100
      when unit = 'm2' and size is not null then price * size
      else price
    end
  ) stored;
create index if not exists listings_total_price_idx on public.listings (total_price);
-- selesai

-- 14. SATUAN SEWA TANAH PER ARE PER TAHUN (untuk filter budget & urutan harga)
drop index if exists public.listings_total_price_idx;
alter table public.listings drop column if exists total_price;
alter table public.listings add column total_price numeric
  generated always as (
    case
      when unit in ('are', 'are_tahun') and size is not null then price * size / 100
      when unit = 'm2' and size is not null then price * size
      else price
    end
  ) stored;
create index if not exists listings_total_price_idx on public.listings (total_price);
-- selesai

-- 15. JUMLAH IKLAN DILIHAT
create table if not exists public.listing_views (
  listing_id uuid primary key references public.listings(id) on delete cascade,
  views bigint not null default 0
);
alter table public.listing_views enable row level security;
drop policy if exists views_read on public.listing_views;
create policy views_read on public.listing_views for select using (true);

-- Pengunjung menambah hitungan lewat fungsi ini (tabel tidak bisa diubah langsung)
create or replace function public.add_listing_view(lid uuid) returns bigint
language plpgsql security definer set search_path = public as $$
declare n bigint;
begin
  if not exists (select 1 from public.listings where id = lid and published) then
    return null;
  end if;
  insert into public.listing_views (listing_id, views) values (lid, 1)
  on conflict (listing_id) do update set views = public.listing_views.views + 1
  returning views into n;
  return n;
end $$;
grant execute on function public.add_listing_view(uuid) to anon, authenticated;
-- selesai

-- 16. KLIK WHATSAPP PER LISTING + LINDUNGI EMAIL AGEN DARI PUBLIK

-- a. Hitung berapa kali tombol WhatsApp di iklan diketuk
alter table public.listing_views add column if not exists wa_clicks bigint not null default 0;

create or replace function public.add_listing_wa(lid uuid) returns bigint
language plpgsql security definer set search_path = public as $$
declare n bigint;
begin
  if not exists (select 1 from public.listings where id = lid and published) then
    return null;
  end if;
  insert into public.listing_views (listing_id, views, wa_clicks) values (lid, 0, 1)
  on conflict (listing_id) do update set wa_clicks = public.listing_views.wa_clicks + 1
  returning wa_clicks into n;
  return n;
end $$;
grant execute on function public.add_listing_wa(uuid) to anon, authenticated;

-- b. Email agen tidak bisa dibaca publik maupun agen lain (kolom lain tetap seperti biasa)
revoke select on public.agents from anon, authenticated;
grant select (id, name, agency, phone, prov, kab, areas, since, specialties, arebi, bio, photo_url, status, is_admin, created_at)
  on public.agents to anon, authenticated;
-- selesai

-- 17. LISTING UNGGULAN (SOROTAN 30 HARI)
alter table public.listings add column if not exists featured_until timestamptz;
create index if not exists listings_featured_idx on public.listings (featured_until);

-- Hanya admin yang boleh menyorot, dan maksimal 4 listing unggulan sekaligus
create or replace function public.protect_listing_featured() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is not null and not public.is_admin() then
    if tg_op = 'INSERT' then
      new.featured_until := null;
    else
      new.featured_until := old.featured_until;
    end if;
  end if;
  if new.featured_until is not null and new.featured_until > now()
     and (tg_op = 'INSERT' or old.featured_until is null or old.featured_until <= now()) then
    if (select count(*) from public.listings
        where featured_until > now() and sold_at is null and id <> new.id) >= 4 then
      raise exception 'FEATURED_FULL: maksimal 4 listing unggulan sekaligus';
    end if;
  end if;
  return new;
end $$;
drop trigger if exists listings_protect_featured on public.listings;
create trigger listings_protect_featured before insert or update on public.listings
  for each row execute function public.protect_listing_featured();
-- selesai