-- 17. LISTING UNGGULAN (SOROTAN 30 HARI)
-- Jalankan sekali di Supabase → SQL Editor → New query → Run
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