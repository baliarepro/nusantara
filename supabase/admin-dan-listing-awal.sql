-- Jalankan SEKALI, setelah Anda daftar dan masuk ke dasbor website.
-- Menjadikan agen pertama yang terdaftar sebagai admin + memasukkan 5 listing awal.
do $$
declare uid uuid;
begin
  select id into uid from public.agents order by created_at limit 1;
  if uid is null then raise exception 'Belum ada agen terdaftar.'; end if;

  update public.agents set is_admin = true, status = 'approved' where id = uid;

  insert into public.listings (agent_id, title, type, status, prov, kab, place, size, cert, zone, description, created_at) values
  (uid, 'Tanah dekat Pantai Balangan', 'Tanah', 'Dijual', 'Bali', 'Badung', 'Balangan, Jimbaran, Kuta Selatan', 6000, 'SHM', 'Pariwisata',
   'Tanah luas dekat Pantai Balangan, zonasi pariwisata. Cocok untuk investor serius: villa resort, hotel butik, atau beach club.', '2026-10-20'),
  (uid, 'Tanah hook Jl. Tulip / Jl. Pura Masuka', 'Tanah', 'Dijual', 'Bali', 'Badung', 'Ungasan, Kuta Selatan', 300, null, null,
   'Tanah posisi hook (sudut) di pertemuan Jl. Tulip dan Jl. Pura Masuka, Ungasan. Dua sisi jalan.', '2026-10-22'),
  (uid, 'Tanah gandeng Labuan Sait', 'Tanah', 'Dijual', 'Bali', 'Badung', 'Labuan Sait, Pecatu, Kuta Selatan', 395, null, null,
   'Dua bidang bersebelahan: 214 m² + 181 m², total 395 m². Kawasan Labuan Sait dekat Pantai Padang Padang dan Uluwatu.', '2026-10-24'),
  (uid, 'Tanah 90 are Labuan Sait', 'Tanah', 'Dijual', 'Bali', 'Badung', 'Labuan Sait, Pecatu, Kuta Selatan', 9025, null, null,
   'Lahan besar 9.025 m² di kawasan Labuan Sait, Pecatu–Uluwatu.', '2026-10-24'),
  (uid, 'Tanah dekat Pantai Pandawa', 'Tanah', 'Dijual', 'Bali', 'Badung', 'Kutuh, Kuta Selatan', 5300, null, null,
   'Tanah 5.300 m² dekat Pantai Pandawa, Kuta Selatan.', '2026-10-28');
end $$;
