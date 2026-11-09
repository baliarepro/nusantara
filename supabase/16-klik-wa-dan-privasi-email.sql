-- 16. KLIK WHATSAPP PER LISTING + LINDUNGI EMAIL AGEN DARI PUBLIK
-- Jalankan sekali di Supabase → SQL Editor → New query → Run

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