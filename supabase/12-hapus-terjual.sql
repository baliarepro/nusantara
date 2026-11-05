-- 12. HAPUS OTOMATIS LISTING TERJUAL / TERSEWA 7 HARI SETELAH DITANDAI
-- Jalankan sekali di Supabase → SQL Editor → New query → Run

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
-- selesai