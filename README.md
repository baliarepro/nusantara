# Nusantara Property

Website listing properti multi-agen untuk seluruh Indonesia.

Data listing dan agen ada di `index.html`, di dalam tag `<script id="np-data">`.

## SEO & GEO
- `scripts/build.mjs` membangun halaman statis dari Supabase: `/listing/<slug>/`, `/en/listing/<slug>/`, halaman kategori `/properti/…` dan `/en/property/…`, Panduan, FAQ, Tentang, Berita (ID & EN), `sitemap.xml`, `llms.txt`, dan isi awal `index.html`.
- Dijalankan otomatis oleh GitHub Actions (`.github/workflows/build-pages.yml`) setiap push dan setiap 3 jam.
- Uji lokal: `MOCK=1 node scripts/build.mjs` (memakai `scripts/mock.json`; jangan commit hasilnya).
