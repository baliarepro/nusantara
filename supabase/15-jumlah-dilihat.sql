-- 15. JUMLAH IKLAN DILIHAT
-- Jalankan sekali di Supabase → SQL Editor → New query → Run
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