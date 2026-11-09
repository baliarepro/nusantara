# Nusantara Property

Website listing properti multi-agen untuk seluruh Indonesia.

Data listing dan agen ada di `index.html`, di dalam tag `<script id="np-data">`.

## SEO & GEO
- `scripts/build.mjs` membangun halaman statis dari Supabase: `/listing/<slug>/`, `/en/listing/<slug>/`, halaman kategori `/properti/…` dan `/en/property/…`, Panduan, FAQ, Tentang, Berita (ID & EN), `sitemap.xml`, `llms.txt`, dan isi awal `index.html`.
- Dijalankan otomatis oleh GitHub Actions (`.github/workflows/build-pages.yml`) setiap push dan setiap 3 jam.
- Uji lokal: `MOCK=1 node scripts/build.mjs` (memakai `scripts/mock.json`; jangan commit hasilnya).

## Otomatisasi (GitHub Actions)

| Workflow | Jadwal | Fungsi | Secret yang dibutuhkan |
|---|---|---|---|
| `build-pages.yml` | tiap 3 jam & setiap push | Halaman statis SEO, link bagikan `/l/<id>/`, sitemap, llms.txt | – |
| `ig-post.yml` | tiap 3 jam | Posting listing baru ke Instagram; postingan listing terjual/tidak tersedia dihapus atau diberi komentar | `IG_TOKEN` |
| `notify.yml` | tiap 4 jam | Email: pengingat 7 & 1 hari sebelum listing turun, agen baru (ke admin), akun disetujui (ke agen), postingan IG yang perlu diarsipkan | `SUPABASE_SERVICE_KEY`, `RESEND_API_KEY` |
| `backup.yml` | tiap Senin 02.41 WITA | Cadangan terenkripsi agen, listing & statistik (artifact 90 hari) | `SUPABASE_SERVICE_KEY`, `BACKUP_PASSWORD` |

Membuka cadangan: unduh artifact dari tab **Actions → Cadangan data mingguan**, lalu
`openssl enc -d -aes-256-cbc -pbkdf2 -in nusantara-backup.json.gz.enc -out nusantara-backup.json.gz -pass pass:<BACKUP_PASSWORD>`
dan `gunzip nusantara-backup.json.gz`.
