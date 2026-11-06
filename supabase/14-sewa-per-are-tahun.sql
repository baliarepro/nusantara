-- 14. SATUAN SEWA TANAH PER ARE PER TAHUN (untuk filter budget & urutan harga)
-- Jalankan sekali di Supabase → SQL Editor → New query → Run
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