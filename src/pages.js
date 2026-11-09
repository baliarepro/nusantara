/* Konten halaman statis Nusantara Property: Berita, Panduan, Tentang Kami, FAQ.
   Berita: tambahkan item baru di PALING ATAS array NEWS. */
window.NP_PAGES=(function(){
const NEWS_ID=[
  {date:"2026-11-06",tag:"Harga rumah",title:"Survei BI: harga rumah primer naik 0,58% di kuartal III 2026, penjualan turun 8,43%",
   summary:"Survei Harga Properti Residensial Bank Indonesia mencatat Indeks Harga Properti Residensial di pasar primer tumbuh 0,58% (yoy) pada kuartal III 2026, melambat dari 0,69% di kuartal II. Penjualan rumah primer terkontraksi 8,43% (yoy) dan turun di semua tipe. Hanya rumah tipe kecil yang harganya tumbuh lebih cepat, yaitu 0,55% dari 0,49%. KPR masih menjadi skema pembelian utama dengan porsi 70,68%, sementara pengembang mengandalkan dana internal untuk 73,94% kebutuhan pembiayaan.",
   source:"ANTARA",url:"https://www.antaranews.com/berita/5836051/survei-bi-harga-properti-residensial-kuartal-iii-2026-tumbuh-terbatas"},
  {date:"2026-11-06",tag:"Jakarta",title:"REI: hanya sekitar 116 unit apartemen Jakarta terserap di kuartal III 2026",
   summary:"Wakil Ketua Umum DPP REI Bambang Ekajaya menyebut, menurut survei terakhir, hanya sekitar 116 unit apartemen di Jakarta terserap pasar selama kuartal III 2026. Ia memperkirakan stok apartemen belum terjual di DKI Jakarta mencapai 20.000 hingga 25.000 unit, dengan segmen atas dan premium paling lesu. REI mengusulkan insentif seperti PPN DTP, pembebasan BPHTB, dan keringanan IPL. Ini masih berupa usulan asosiasi, bukan kebijakan pemerintah.",
   source:"Kontan",url:"https://industri.kontan.co.id/news/penjualan-apartemen-jakarta-lesu-hanya-116-unit-terserap-pada-kuartal-iii-2026"},
  {date:"2026-11-05",tag:"Ekonomi",title:"BPS: ekonomi Indonesia tumbuh 5,47% di kuartal III 2026",
   summary:"Badan Pusat Statistik mencatat ekonomi Indonesia tumbuh 5,47% (yoy) pada kuartal III 2026 dan 1,59% dibanding kuartal sebelumnya, dengan pertumbuhan kumulatif 5,45%. Deputi Bidang Neraca dan Analisis Statistik BPS M Edy Mahmud menyebut belanja modal pemerintah untuk konstruksi naik 63,65% (yoy), sementara realisasi investasi PMDN dan PMA tumbuh 7,59%.",
   source:"Kontan",url:"https://nasional.kontan.co.id/news/ekonomi-ri-tumbuh-547-di-kuartal-iii-2026-bps-ungkap-pendorong-utamanya"},
  {date:"2026-11-03",tag:"Rumah subsidi",title:"Penyaluran KPR FLPP 2026 capai 197.048 unit, akad massal disiapkan Desember",
   summary:"BP Tapera mencatat realisasi KPR FLPP mencapai 194.360 unit senilai Rp24,22 triliun hingga 31 Oktober 2026, hampir 54% dari target 360.000 unit tahun ini. Per 2 November angkanya naik menjadi 197.048 unit senilai Rp24,55 triliun. Bank BTN menyalurkan terbanyak (85.341 unit), dan Jawa Barat menjadi provinsi dengan realisasi tertinggi. Akad massal 71.000 unit pada 17 Desember dan 30.000 unit pada 21 Desember sedang disiapkan.",
   source:"CNBC Indonesia",url:"https://www.cnbcindonesia.com/news/20261103102709-4-781809/2026-kurang-dari-2-bulan-penyaluran-rumah-subsidi-flpp-baru-segini"},
  {date:"2026-11-02",tag:"Rumah subsidi",title:"Kementerian PKP berencana targetkan KPR FLPP untuk 40 ribu rusun subsidi",
   summary:"Dirjen Perumahan Perkotaan Kementerian PKP, Sri Haryati, menyebut target penyaluran KPR FLPP untuk 40.000 unit rumah susun. Ini masih berupa rencana dan target. Menurutnya, dalam lima tahun terakhir produksi rusun subsidi di bawah 200 unit. Proyek yang disebut antara lain rusun di Meikarta, hunian TOD Manggarai, dan rusun Alonia Kemayoran 609 unit yang ditargetkan mulai dibangun awal Januari 2027.",
   source:"ANTARA",url:"https://www.antaranews.com/berita/5827415/pkp-berencana-targetkan-flpp-untuk-40-ribu-rusun-subsidi-baru"},
  {date:"2026-10-28",tag:"Kredit",title:"Kredit properti tumbuh 16,4% per September 2026, KPR naik tipis",
   summary:"Menurut data uang beredar Bank Indonesia, kredit properti tumbuh 16,4% (yoy) menjadi Rp1.703,7 triliun pada September 2026, melambat dari 18,3% di bulan sebelumnya. Penyaluran KPR dan KPA justru naik tipis menjadi 4,3% (yoy) dengan nilai Rp863,1 triliun, berlawanan dengan kredit konsumsi lain yang melemah. Kredit konstruksi masih tumbuh 42,3%.",
   source:"Kontan",url:"https://keuangan.kontan.co.id/news/kredit-properti-tumbuh-164-yoy-september-2026"},
  {date:"2026-10-27",tag:"Sertifikat",title:"ATR/BPN telah menerbitkan hampir 10 juta sertipikat elektronik",
   summary:"Kementerian ATR/BPN mencatat 9.774.933 sertipikat elektronik terbit sejak layanan dimulai 4 Desember 2023 hingga Oktober 2026, termasuk hasil alih media dari sertipikat analog. Sepanjang 2026 hingga Oktober tercatat 3.077.397 sertipikat. Sertipikat analog dan elektronik memiliki kekuatan hukum yang sama, dan syarat serta biaya alih media bisa dicek di aplikasi Sentuh Tanahku.",
   source:"ANTARA",url:"https://jogja.antaranews.com/berita/863327/sejak-diluncurkan-pada-2023-kementerian-atrbpnterbitkan-hampir-10-juta-sertipikat-elektronik"},
  {date:"2026-10-21",tag:"Suku bunga",title:"Bank Indonesia menahan BI Rate di 5,75% pada RDG Oktober 2026",
   summary:"Bank Indonesia mempertahankan suku bunga acuan di 5,75%. Sepanjang 2026, BI Rate sudah naik 100 basis poin dari 4,75% sejak pertengahan Mei untuk menjaga stabilitas rupiah. Bagi pembeli dengan KPR berbunga mengambang, ini berarti cicilan belum turun dalam waktu dekat, sehingga KPR dengan bunga tetap lebih lama layak dipertimbangkan.",
   source:"Bisnis.com",url:"https://finansial.bisnis.com/read/20261021/11/2014506/bi-rate-ditahan-575-pada-oktober-intip-historis-lengkapnya-sepanjang-2026"},
  {date:"2026-08-07",tag:"Harga rumah",title:"Harga rumah primer naik 0,69% di kuartal II 2026, penjualan mulai pulih",
   summary:"Survei Harga Properti Residensial Bank Indonesia mencatat Indeks Harga Properti Residensial naik 0,69% (yoy) pada kuartal II 2026. Penjualan rumah di pasar primer masih turun 2,36% (yoy), jauh membaik dibanding kontraksi 25,67% di kuartal I, dan naik 9,39% dibanding kuartal sebelumnya.",
   source:"Industry.co.id",url:"https://www.industry.co.id/read/154227/harga-rumah-di-pasar-primer-naik-terbatas-pada-kuartal-ii-2026-penjualan-mulai-pulih"},
  {date:"2026-01-05",tag:"Pajak",title:"PPN rumah ditanggung pemerintah 100% sepanjang 2026",
   summary:"Lewat PMK Nomor 90 Tahun 2025, pemerintah menanggung 100% PPN untuk bagian harga sampai Rp2 miliar atas pembelian rumah tapak atau satuan rumah susun dengan harga jual paling banyak Rp5 miliar. Insentif berlaku untuk penyerahan Januari sampai Desember 2026, dan hanya untuk pembelian dari pengembang yang dikenai PPN.",
   source:"Suara Surabaya",url:"https://www.suarasurabaya.net/ekonomibisnis/2026/pemerintah-beri-ppn-dtp-100-persen-untuk-pembelian-rumah-sepanjang-2026/"}
];

const GUIDE_ID=[
 {id:"sertifikat",title:"Kenali jenis hak atas tanah",html:`
  <p>Status hak menentukan siapa yang boleh memiliki, berapa lama, dan seberapa mudah properti dijual kembali atau dijaminkan ke bank.</p>
  <dl class="terms">
   <dt>SHM (Sertifikat Hak Milik)</dt><dd>Hak terkuat dan penuh, tanpa batas waktu. Hanya bisa dimiliki WNI perorangan dan badan tertentu.</dd>
   <dt>SHGB (Hak Guna Bangunan)</dt><dd>Hak mendirikan dan memiliki bangunan di atas tanah dengan jangka waktu, umumnya untuk perumahan dari pengembang dan badan usaha. Jangka waktunya bisa diperpanjang dan diperbarui. Untuk rumah tinggal WNI, SHGB umumnya bisa ditingkatkan menjadi SHM.</dd>
   <dt>Hak Pakai</dt><dd>Hak menggunakan tanah dengan jangka waktu. Bentuk hak yang bisa dimiliki WNA untuk rumah tinggal, dengan syarat tertentu.</dd>
   <dt>SHM Sarusun</dt><dd>Sertifikat kepemilikan unit apartemen (strata title), termasuk bagian bersama gedung dan tanahnya.</dd>
   <dt>Girik, Petok D, letter C</dt><dd>Bukan sertifikat, melainkan bukti pembayaran pajak tanah adat. Harus didaftarkan ke Kantor Pertanahan sebelum aman ditransaksikan atau dijaminkan.</dd>
   <dt>Leasehold</dt><dd>Sewa jangka panjang yang dicatat dalam akta notaris, umum di Bali. Pembeli memegang hak sewa selama jangka waktu yang disepakati, bukan hak milik atas tanah.</dd>
  </dl>`},
 {id:"cek-legalitas",title:"Periksa legalitas sebelum membayar",html:`
  <ul class="checks-list">
   <li><b>Cek sertifikat di Kantor Pertanahan (BPN)</b> melalui PPAT/notaris. Pengecekan memastikan sertifikat asli, nama pemegang hak sesuai, dan tidak sedang diblokir, disita, atau dijaminkan.</li>
   <li><b>Cocokkan data fisik</b>: luas, batas, dan letak tanah di lapangan harus sama dengan gambar di sertifikat. Minta pengukuran ulang jika ragu.</li>
   <li><b>Cek zonasi tata ruang</b> (RTRW/RDTR) di situs GISTARU Kementerian ATR/BPN atau dinas tata ruang setempat, supaya rencana pemakaian sesuai, misalnya hunian, pariwisata, atau komersial.</li>
   <li><b>Pastikan PBB lunas</b> sampai tahun berjalan. Minta salinan SPPT dan bukti bayarnya.</li>
   <li><b>Untuk bangunan</b>, minta PBG (Persetujuan Bangunan Gedung, pengganti IMB) dan SLF bila ada.</li>
   <li><b>Pastikan penjual berhak menjual</b>. Jika tanah warisan, semua ahli waris harus setuju. Jika penjual sudah menikah, umumnya perlu persetujuan pasangan.</li>
  </ul>`},
 {id:"biaya",title:"Hitung biaya transaksi",html:`
  <p>Selain harga properti, siapkan dana untuk pajak dan biaya resmi berikut.</p>
  <div class="table-wrap"><table class="facts guide-table"><thead><tr><th>Biaya</th><th>Ditanggung</th><th>Besaran umum</th></tr></thead><tbody>
   <tr><td>BPHTB</td><td>Pembeli</td><td>5% × (nilai transaksi − NPOPTKP daerah)</td></tr>
   <tr><td>PPh final pengalihan</td><td>Penjual</td><td>2,5% dari nilai transaksi</td></tr>
   <tr><td>Honor PPAT</td><td>Sesuai kesepakatan</td><td>Paling banyak 1% dari nilai transaksi</td></tr>
   <tr><td>PPN</td><td>Pembeli</td><td>Hanya untuk pembelian dari pengembang. Di 2026 ada insentif PPN ditanggung pemerintah</td></tr>
   <tr><td>Balik nama & pengecekan BPN</td><td>Pembeli</td><td>Biaya PNBP sesuai tarif resmi</td></tr>
  </tbody></table></div>
  <p class="hint">Tarif NPOPTKP berbeda tiap kabupaten/kota. Tanyakan angka pastinya ke PPAT sebelum transaksi.</p>`},
 {id:"proses",title:"Alur jual beli",html:`
  <ol class="flow">
   <li><b>Survei dan negosiasi</b><span>Lihat lokasi langsung, cek akses jalan, air, listrik, dan lingkungan sekitar.</span></li>
   <li><b>Tanda jadi</b><span>Bayar tanda jadi dengan kuitansi yang menyebut properti, harga, dan batas waktu pelunasan.</span></li>
   <li><b>Pengecekan sertifikat</b><span>Dilakukan PPAT di Kantor Pertanahan sebelum akta ditandatangani.</span></li>
   <li><b>PPJB</b><span>Perjanjian pengikatan jual beli dibuat bila pembayaran bertahap atau dokumen masih diproses.</span></li>
   <li><b>AJB di hadapan PPAT</b><span>Akta jual beli ditandatangani setelah pajak BPHTB dan PPh dibayar.</span></li>
   <li><b>Balik nama</b><span>PPAT mendaftarkan peralihan hak ke Kantor Pertanahan hingga sertifikat atas nama pembeli.</span></li>
  </ol>`},
 {id:"kpr",title:"Membeli dengan KPR",html:`
  <ul class="checks-list">
   <li><b>Uang muka</b> ditentukan bank dan kebijakan Bank Indonesia. Beberapa program memberi DP rendah untuk rumah pertama.</li>
   <li><b>Bunga tetap vs mengambang</b>: promo bunga tetap biasanya hanya beberapa tahun pertama. Tanyakan perkiraan bunga mengambang sesudahnya, karena itu yang menentukan cicilan jangka panjang.</li>
   <li><b>Cicilan sehat</b>: idealnya tidak lebih dari sekitar 30% penghasilan bulanan.</li>
   <li><b>Properti seken</b>: bank akan menilai (appraisal) properti. Nilai taksiran bisa lebih rendah dari harga jual, dan selisihnya menambah uang muka.</li>
  </ul>`},
 {id:"wna",title:"Pembeli warga negara asing",html:`
  <p>WNA tidak dapat memiliki tanah berstatus Hak Milik. Pilihan yang sah:</p>
  <ul class="checks-list">
   <li><b>Hak Pakai</b> atas rumah tapak atau unit apartemen untuk tempat tinggal, dengan batas harga minimum yang ditetapkan per daerah.</li>
   <li><b>Melalui PT PMA</b> dengan Hak Guna Bangunan untuk kegiatan usaha.</li>
   <li><b>Leasehold</b> (sewa jangka panjang) melalui akta notaris.</li>
  </ul>
  <p><b>Hindari skema pinjam nama (nominee)</b>, yaitu tanah atas nama WNI tetapi dibiayai dan dikuasai WNA. Perjanjian seperti ini tidak sah menurut hukum pertanahan Indonesia dan berisiko kehilangan properti.</p>`},
 {id:"satuan",title:"Satuan luas tanah",html:`
  <p><b>1 are = 100 m²</b> dan <b>1 hektare = 100 are = 10.000 m²</b>. Satuan are umum dipakai dalam jual beli tanah di Bali dan sebagian Jawa, termasuk untuk harga, misalnya "Rp 500 juta per are". Setiap listing tanah di Nusantara Property menampilkan luas dalam m² dan are.</p>`}
];

const FAQ_ID=[
 {group:"Untuk pembeli",items:[
  ["Apakah Nusantara Property menjual properti sendiri?","Tidak. Setiap listing dipasang oleh agen properti yang terdaftar. Anda berhubungan dan bertransaksi langsung dengan agen tersebut."],
  ["Bagaimana cara menanyakan sebuah listing?","Buka halaman listing, lalu ketuk Tanya via WhatsApp. Pesan berisi judul dan lokasi listing akan terisi otomatis ke WhatsApp agennya."],
  ["Kenapa sebagian listing bertuliskan \"Harga: tanya agen\"?","Agen memilih tidak menampilkan harga di website. Tanyakan harga terbaru langsung ke agennya."],
  ["Apa arti warna zona pada listing tanah?","Warna mengikuti kebiasaan peta tata ruang: merah muda untuk pariwisata, kuning untuk permukiman, hijau untuk pertanian, dan merah untuk perdagangan dan jasa. Selalu pastikan zonasi resmi ke dinas tata ruang setempat sebelum membeli."],
  ["Apakah listing di sini sudah pasti aman secara hukum?","Agen diverifikasi admin sebelum bisa memasang listing, tetapi pemeriksaan legalitas properti tetap menjadi tanggung jawab pembeli. Ikuti langkah di halaman Panduan dan gunakan PPAT/notaris."]
 ]},
 {group:"Untuk agen",items:[
  ["Bagaimana cara mendaftar sebagai agen?","Ketuk Daftar agen, isi data diri dan buat password, lalu konfirmasi email Anda. Setelah admin menyetujui akun Anda, profil Anda tayang dan Anda bisa memasang listing dari Dasbor."],
  ["Saya tidak menerima email konfirmasi.","Periksa folder Spam atau Promosi. Jika masih tidak ada setelah beberapa menit, hubungi admin lewat WhatsApp."],
  ["Saya lupa password.","Buka halaman Masuk, isi email Anda, lalu ketuk Lupa password. Tautan untuk membuat password baru akan dikirim ke email Anda."],
  ["Bisakah agen lain mengubah listing saya?","Tidak. Setiap listing hanya bisa diubah atau dihapus oleh agen pemiliknya dan admin."],
  ["Kenapa listing saya tidak tampil lagi?","Listing otomatis diturunkan bila tidak diperbarui selama 60 hari, supaya pembeli hanya melihat properti yang masih tersedia. Seminggu sebelumnya, peringatan muncul di Dasbor. Ketuk Tayangkan ulang di Dasbor, dan listing tampil lagi untuk 60 hari berikutnya."],
  ["Bagaimana menyembunyikan listing tanpa menghapusnya?","Edit listing, hilangkan centang Tayangkan listing ini di website, lalu simpan. Listing menjadi draf dan bisa ditayangkan lagi kapan saja."],
  ["Berapa foto yang bisa diunggah?","Maksimal 5 foto per listing. Foto pertama menjadi foto sampul, dan ukurannya otomatis dikecilkan agar website tetap cepat."]
 ]}
];

const NEWS_EN=[
  {date:"2026-11-06",tag:"House prices",title:"BI survey: primary house prices up 0.58% in Q3 2026, sales down 8.43%",
   summary:"Bank Indonesia's Residential Property Price Survey recorded 0.58% (yoy) growth in the primary-market residential price index in Q3 2026, slowing from 0.69% in Q2. Primary home sales contracted 8.43% (yoy) and fell across all house types. Only small houses saw faster price growth, at 0.55% from 0.49%. Mortgages remained the main purchase scheme with a 70.68% share, while developers relied on internal funds for 73.94% of their financing needs.",
   source:"ANTARA",url:NEWS_ID[0].url},
  {date:"2026-11-06",tag:"Jakarta",title:"REI: only about 116 Jakarta apartment units sold in Q3 2026",
   summary:"Bambang Ekajaya, Deputy Chairman of the Indonesian Real Estate Association (REI), said that according to the latest survey only about 116 apartment units in Jakarta were absorbed by the market in Q3 2026. He estimated unsold apartment stock in Jakarta at 20,000 to 25,000 units, with the upper and premium segments the weakest. REI has proposed incentives such as government-borne VAT, a BPHTB exemption and relief on service charges (IPL). These are still association proposals, not government policy.",
   source:"Kontan",url:NEWS_ID[1].url},
  {date:"2026-11-05",tag:"Economy",title:"Statistics Indonesia: the economy grew 5.47% in Q3 2026",
   summary:"Statistics Indonesia (BPS) recorded 5.47% (yoy) economic growth in Q3 2026 and 1.59% on the previous quarter, with cumulative growth of 5.45%. BPS Deputy for Balance Sheets and Statistical Analysis M Edy Mahmud said government capital spending on construction rose 63.65% (yoy), while domestic and foreign investment realisation grew 7.59%.",
   source:"Kontan",url:NEWS_ID[2].url},
  {date:"2026-11-03",tag:"Subsidised housing",title:"FLPP subsidised mortgages reach 197,048 units in 2026, mass signings planned for December",
   summary:"BP Tapera recorded 194,360 FLPP mortgages worth Rp24.22 trillion as of 31 October 2026, nearly 54% of this year's 360,000-unit target. By 2 November the figure had risen to 197,048 units worth Rp24.55 trillion. Bank BTN disbursed the most (85,341 units), and West Java recorded the highest total of any province. Mass signings of 71,000 units on 17 December and 30,000 units on 21 December are being prepared.",
   source:"CNBC Indonesia",url:NEWS_ID[3].url},
  {date:"2026-11-02",tag:"Subsidised housing",title:"Housing ministry plans to target FLPP mortgages for 40,000 subsidised apartments",
   summary:"Sri Haryati, Director General of Urban Housing at the Ministry of Housing and Settlement Areas (PKP), said the target is FLPP mortgage disbursement for 40,000 apartment units. This is still a plan and a target. She said subsidised apartment output over the past five years was under 200 units. Projects named include apartments at Meikarta, TOD housing at Manggarai, and the 609-unit Alonia Kemayoran apartments, with construction targeted to start in early January 2027.",
   source:"ANTARA",url:NEWS_ID[4].url},
  {date:"2026-10-28",tag:"Credit",title:"Property lending grew 16.4% in September 2026, mortgages edged up",
   summary:"According to Bank Indonesia's money supply data, property lending grew 16.4% (yoy) to Rp1,703.7 trillion in September 2026, slowing from 18.3% the month before. House and apartment mortgages rose slightly to 4.3% (yoy) at Rp863.1 trillion, against the trend of weaker consumer lending. Construction lending still grew 42.3%.",
   source:"Kontan",url:NEWS_ID[5].url},
  {date:"2026-10-27",tag:"Land titles",title:"ATR/BPN has issued nearly 10 million electronic land certificates",
   summary:"The Ministry of Agrarian Affairs and Spatial Planning (ATR/BPN) recorded 9,774,933 electronic certificates issued from the service launch on 4 December 2023 to October 2026, including analog certificates converted to electronic form. From January to October 2026, 3,077,397 were issued. Analog and electronic certificates have the same legal force, and conversion requirements and fees can be checked in the Sentuh Tanahku app.",
   source:"ANTARA",url:NEWS_ID[6].url},
  {date:"2026-10-21",tag:"Interest rates",title:"Bank Indonesia holds the BI Rate at 5.75% in October 2026",
   summary:"Bank Indonesia kept its benchmark rate at 5.75%. Over 2026 the BI Rate has risen 100 basis points from 4.75% since mid-May to keep the rupiah stable. For buyers on floating-rate mortgages, instalments are unlikely to fall soon, so a longer fixed-rate period is worth considering.",
   source:"Bisnis.com",url:NEWS_ID[7].url},
  {date:"2026-08-07",tag:"House prices",title:"Primary house prices up 0.69% in Q2 2026 as sales start to recover",
   summary:"Bank Indonesia's Residential Property Price Survey recorded a 0.69% (yoy) rise in its residential price index in Q2 2026. Primary-market sales were still down 2.36% (yoy), a big improvement on the 25.67% contraction in Q1, and up 9.39% on the previous quarter.",
   source:"Industry.co.id",url:NEWS_ID[8].url},
  {date:"2026-01-05",tag:"Tax",title:"Government covers 100% of VAT on homes throughout 2026",
   summary:"Under Finance Minister Regulation No. 90 of 2025, the government covers 100% of VAT on the portion of the price up to Rp2 billion for landed houses or apartment units priced up to Rp5 billion. The incentive applies to handovers from January to December 2026, and only to purchases from developers that charge VAT.",
   source:"Suara Surabaya",url:NEWS_ID[9].url}
];
const GUIDE_EN=[
 {id:"sertifikat",title:"Know the types of land title",html:`
  <p>The title type decides who may own the property, for how long, and how easily it can be resold or used as bank collateral.</p>
  <dl class="terms">
   <dt>SHM (Hak Milik, freehold)</dt><dd>The strongest, full ownership right with no time limit. Only Indonesian citizens and certain entities may hold it.</dd>
   <dt>SHGB (Hak Guna Bangunan, right to build)</dt><dd>The right to build on and own buildings on land for a set term, common for developer housing and companies. The term can be extended and renewed. For Indonesian homeowners, SHGB can usually be upgraded to SHM.</dd>
   <dt>Hak Pakai (right of use)</dt><dd>A right to use land for a set term. This is the title foreigners can hold for a residence, under certain conditions.</dd>
   <dt>SHM Sarusun (strata title)</dt><dd>Ownership certificate for an apartment unit, including a share of the common areas and land.</dd>
   <dt>Girik, Petok D, letter C</dt><dd>Not certificates, but proof of tax payment on customary land. They must be registered at the Land Office before they can be safely sold or mortgaged.</dd>
   <dt>Leasehold</dt><dd>A long-term lease recorded in a notarial deed, common in Bali. The buyer holds the lease for the agreed term, not ownership of the land.</dd>
  </dl>`},
 {id:"cek-legalitas",title:"Check the paperwork before you pay",html:`
  <ul class="checks-list">
   <li><b>Check the certificate at the Land Office (BPN)</b> through a PPAT/notary. This confirms the certificate is genuine, the holder's name matches, and it is not blocked, seized or mortgaged.</li>
   <li><b>Match the physical land</b>: size, boundaries and position on site must match the certificate plan. Ask for a re-survey if in doubt.</li>
   <li><b>Check the spatial zoning</b> (RTRW/RDTR) on the ATR/BPN GISTARU website or with the local planning office, so your intended use fits, for example residential, tourism or commercial.</li>
   <li><b>Make sure land tax (PBB) is paid</b> up to the current year. Ask for the SPPT and payment receipts.</li>
   <li><b>For buildings</b>, ask for the PBG (building approval, which replaced the IMB) and the SLF if available.</li>
   <li><b>Make sure the seller is entitled to sell</b>. For inherited land, all heirs must agree. If the seller is married, the spouse's consent is usually required.</li>
  </ul>`},
 {id:"biaya",title:"Budget for transaction costs",html:`
  <p>On top of the price, set aside funds for these taxes and official fees.</p>
  <div class="table-wrap"><table class="facts guide-table"><thead><tr><th>Cost</th><th>Paid by</th><th>Typical amount</th></tr></thead><tbody>
   <tr><td>BPHTB (acquisition duty)</td><td>Buyer</td><td>5% × (transaction value − local NPOPTKP allowance)</td></tr>
   <tr><td>Final income tax on transfer</td><td>Seller</td><td>2.5% of the transaction value</td></tr>
   <tr><td>PPAT fee</td><td>As agreed</td><td>At most 1% of the transaction value</td></tr>
   <tr><td>VAT</td><td>Buyer</td><td>Only for purchases from developers. A government VAT incentive applies in 2026</td></tr>
   <tr><td>Title transfer & BPN check</td><td>Buyer</td><td>Official PNBP fees</td></tr>
  </tbody></table></div>
  <p class="hint">The NPOPTKP allowance differs by regency/city. Ask your PPAT for the exact figures before the transaction.</p>`},
 {id:"proses",title:"How a sale works",html:`
  <ol class="flow">
   <li><b>Site visit and negotiation</b><span>See the site in person and check road access, water, electricity and the surroundings.</span></li>
   <li><b>Booking deposit</b><span>Pay the deposit against a receipt stating the property, price and settlement deadline.</span></li>
   <li><b>Certificate check</b><span>Done by the PPAT at the Land Office before any deed is signed.</span></li>
   <li><b>PPJB</b><span>A conditional sale agreement, used when paying in stages or while documents are still being processed.</span></li>
   <li><b>AJB before a PPAT</b><span>The deed of sale is signed after BPHTB and the seller's income tax are paid.</span></li>
   <li><b>Title transfer</b><span>The PPAT registers the transfer at the Land Office until the certificate is in the buyer's name.</span></li>
  </ol>`},
 {id:"kpr",title:"Buying with a mortgage (KPR)",html:`
  <ul class="checks-list">
   <li><b>Down payment</b> is set by the bank and Bank Indonesia policy. Some programmes offer low down payments for first homes.</li>
   <li><b>Fixed vs floating rate</b>: fixed-rate promotions usually last only the first few years. Ask for the expected floating rate afterwards, because that sets your long-term instalment.</li>
   <li><b>Healthy instalment</b>: ideally no more than about 30% of monthly income.</li>
   <li><b>Resale property</b>: the bank will appraise it. The valuation can be lower than the price, and the gap adds to your down payment.</li>
  </ul>`},
 {id:"wna",title:"Foreign buyers",html:`
  <p>Foreigners cannot hold land under freehold (Hak Milik). The legal options are:</p>
  <ul class="checks-list">
   <li><b>Hak Pakai</b> (right of use) on a landed house or apartment unit as a residence, subject to a minimum price set per region.</li>
   <li><b>Through a PT PMA</b> (foreign-owned company) holding HGB for business use.</li>
   <li><b>Leasehold</b> (long-term lease) through a notarial deed.</li>
  </ul>
  <p><b>Avoid nominee arrangements</b>, where land is in an Indonesian's name but paid for and controlled by a foreigner. Such agreements are not valid under Indonesian land law and put the property at risk.</p>`},
 {id:"satuan",title:"Land area units",html:`
  <p><b>1 are = 100 m²</b> and <b>1 hectare = 100 are = 10,000 m²</b>. The are is widely used for land deals in Bali and parts of Java, including for prices, for example "Rp 500 million per are". Every land listing on Nusantara Property shows size in m² and are.</p>`}
];
const FAQ_EN=[
 {group:"For buyers",items:[
  ["Does Nusantara Property sell property itself?","No. Every listing is posted by a registered property agent. You deal and transact directly with that agent."],
  ["How do I ask about a listing?","Open the listing page and tap Ask on WhatsApp. A message with the listing title and location is filled in automatically to the agent's WhatsApp."],
  ["Why do some listings say \"Price on request\"?","The agent chose not to show the price on the website. Ask the agent for the latest price."],
  ["What do the zone colours on land listings mean?","The colours follow spatial planning maps: pink for tourism, yellow for residential, green for agricultural and red for trade and services. Always confirm the official zoning with the local planning office before buying."],
  ["Are the listings here guaranteed to be legally sound?","Agents are verified by an admin before they can post, but checking a property's legal status remains the buyer's responsibility. Follow the steps in our Guide and use a PPAT/notary."]
 ]},
 {group:"For agents",items:[
  ["How do I sign up as an agent?","Tap Agent sign-up, fill in your details and create a password, then confirm your email. Once an admin approves your account, your profile goes live and you can post listings from the Dashboard."],
  ["I didn't receive the confirmation email.","Check your Spam or Promotions folder. If it still hasn't arrived after a few minutes, contact the admin on WhatsApp."],
  ["I forgot my password.","Open the Sign in page, enter your email and tap Forgot password. A link to set a new password will be sent to your email."],
  ["Can other agents change my listings?","No. Each listing can only be edited or deleted by its own agent and the admin."],
  ["Why is my listing no longer showing?","Listings are taken down automatically if not updated for 60 days, so buyers only see properties that are still available. A warning appears on your Dashboard a week before. Tap Republish on the Dashboard and the listing shows again for the next 60 days."],
  ["How do I hide a listing without deleting it?","Edit the listing, untick Publish this listing on the website, and save. It becomes a draft you can publish again at any time."],
  ["How many photos can I upload?","Up to 5 photos per listing. The first photo is the cover, and photos are resized automatically to keep the website fast."]
 ]}
];
const EN=()=>!!(window.NP_I18N&&NP_I18N.lang==="en");
const NEWS=new Proxy([],{get:(_,k)=>{const a=EN()?NEWS_EN:NEWS_ID;const v=a[k];return typeof v==="function"?v.bind(a):v}});

const IC={
 search:'<path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.5-4.5"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 check:'<path d="M5 12l4 4 10-10"/>'
};
const svg=k=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const fmtDate=d=>new Date(d+"T00:00:00").toLocaleDateString(EN()?'en-GB':'id-ID',{day:"numeric",month:"long",year:"numeric"});

function newsCard(n){
  return `<article class="news-card">
    <div class="news-meta"><span class="pill pill-approved">${n.tag}</span><time datetime="${n.date}">${fmtDate(n.date)}</time></div>
    <h3>${n.title}</h3><p>${n.summary}</p>
    <a class="news-src" href="${n.url}" target="_blank" rel="noopener">${EN()?"Read on":"Baca di"} ${n.source} ↗</a></article>`;
}

const LEGAL_DATE="2026-11-09";
const PRIVACY_ID=[
 ["Ringkasan","Nusantara Property adalah platform listing properti. Kami hanya mengumpulkan data yang diperlukan agar agen bisa menayangkan listing dan pembeli bisa menghubungi agen. Kami tidak menjual data pribadi kepada siapa pun. Kebijakan ini disusun dengan memperhatikan Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi."],
 ["Data yang kami kumpulkan",`<ul><li><b>Dari agen:</b> nama, nama kantor/agensi, nomor WhatsApp, email, provinsi dan kota, area kerja, jenis properti yang dipasarkan, nomor anggota AREBI (bila diisi), profil singkat, foto profil, serta isi listing (judul, lokasi, luas, harga, deskripsi, foto, dan link Google Maps).</li><li><b>Dari pengunjung:</b> kami tidak meminta data pribadi. Kami hanya menghitung secara anonim berapa kali sebuah iklan dilihat dan berapa kali tombol WhatsApp di iklan tersebut diketuk, tanpa menyimpan identitas pengunjung.</li><li><b>Di perangkat Anda:</b> pilihan bahasa, isian form yang belum tersimpan, dan penanda iklan yang sudah dilihat disimpan di browser Anda sendiri, bukan di server kami.</li></ul>`],
 ["Untuk apa data digunakan",`<ul><li>Menampilkan listing dan profil agen kepada pembeli di website.</li><li>Menghubungkan pembeli dengan agen lewat WhatsApp.</li><li>Mempromosikan listing di akun media sosial resmi Nusantara Property (misalnya Instagram), lengkap dengan nama dan link WhatsApp agen.</li><li>Mengirim email layanan kepada agen, misalnya pengingat listing yang akan turun dan konfirmasi akun.</li><li>Meninjau pendaftaran agen dan menjaga kualitas listing.</li></ul>`],
 ["Data yang tampil untuk publik","Nama agen, kantor, area kerja, profil, foto, dan seluruh isi listing yang ditayangkan bersifat publik dan bisa dilihat siapa saja. Nomor WhatsApp agen dipakai untuk tombol hubungi agen. Email agen tidak ditampilkan kepada publik."],
 ["Penyimpanan dan pihak ketiga",`Data disimpan di layanan database Supabase. Email layanan dikirim melalui Resend. Website di-host di GitHub Pages. Listing yang dipromosikan diunggah ke Instagram milik Meta. Masing-masing layanan memiliki kebijakan privasinya sendiri. Kami tidak membagikan data pribadi kepada pihak lain di luar keperluan tersebut, kecuali diwajibkan oleh hukum.`],
 ["Berapa lama data disimpan",`<ul><li>Listing yang tidak diperbarui 60 hari diturunkan dari tampilan publik.</li><li>Listing yang ditandai terjual atau tersewa dihapus permanen 7 hari setelah ditandai, beserta fotonya.</li><li>Data akun agen disimpan selama akun aktif dan dihapus bila agen meminta penghapusan akun.</li></ul>`],
 ["Hak Anda","Sebagai pemilik data, Anda berhak meminta salinan data Anda, memperbaiki data yang keliru, menarik persetujuan, dan meminta data serta akun Anda dihapus. Sebagian besar data bisa Anda ubah sendiri lewat dasbor agen. Untuk permintaan lain, hubungi admin lewat WhatsApp."],
 ["Keamanan","Akses ke data dibatasi: setiap agen hanya bisa mengubah listing miliknya sendiri, dan hanya admin yang bisa mengelola seluruh data. Meski demikian, tidak ada sistem yang sepenuhnya kebal. Bila terjadi kebocoran data yang berdampak pada Anda, kami akan memberi tahu sesuai ketentuan yang berlaku."],
 ["Perubahan kebijakan","Kebijakan ini dapat diperbarui sewaktu-waktu. Tanggal berlaku terbaru selalu tercantum di halaman ini."]
];
const PRIVACY_EN=[
 ["Summary","Nusantara Property is a property listing platform. We only collect the data needed for agents to publish listings and for buyers to contact agents. We never sell personal data. This policy was written with reference to Indonesia's Personal Data Protection Law (Law No. 27 of 2022)."],
 ["Data we collect",`<ul><li><b>From agents:</b> name, office/agency, WhatsApp number, email, province and city, working area, property types, AREBI membership number (if provided), short bio, profile photo, and listing content (title, location, size, price, description, photos and Google Maps link).</li><li><b>From visitors:</b> we do not ask for personal data. We only count, anonymously, how many times a listing is viewed and how many times its WhatsApp button is tapped, without storing who the visitor is.</li><li><b>On your device:</b> your language choice, unsaved form drafts and a marker of listings you have viewed are kept in your own browser, not on our servers.</li></ul>`],
 ["How we use data",`<ul><li>To show listings and agent profiles to buyers on the website.</li><li>To connect buyers with agents on WhatsApp.</li><li>To promote listings on Nusantara Property's official social media accounts (such as Instagram), including the agent's name and WhatsApp link.</li><li>To send service emails to agents, such as reminders before a listing expires and account confirmations.</li><li>To review agent registrations and keep listing quality high.</li></ul>`],
 ["What is public","Agent names, offices, working areas, bios, photos and all published listing content are public. Agents' WhatsApp numbers power the contact buttons. Agents' email addresses are never shown publicly."],
 ["Storage and third parties","Data is stored with the Supabase database service. Service emails are sent through Resend. The website is hosted on GitHub Pages. Promoted listings are uploaded to Instagram, owned by Meta. Each service has its own privacy policy. We do not share personal data with anyone else, except where required by law."],
 ["How long we keep data",`<ul><li>Listings not updated for 60 days are removed from public view.</li><li>Listings marked sold or rented are permanently deleted 7 days later, with their photos.</li><li>Agent account data is kept while the account is active and deleted when the agent asks for the account to be removed.</li></ul>`],
 ["Your rights","As the data owner you may request a copy of your data, correct inaccurate data, withdraw consent, and ask for your data and account to be deleted. Most data can be changed yourself in the agent dashboard. For anything else, contact the admin on WhatsApp."],
 ["Security","Access is restricted: each agent can only change their own listings, and only the admin can manage all data. No system is completely immune, however. If a data breach affects you, we will notify you as required by law."],
 ["Changes","This policy may be updated from time to time. The latest effective date is always shown on this page."]
];
const TERMS_ID=[
 ["Tentang layanan ini","Nusantara Property (nusantara.properties) adalah platform tempat agen properti menayangkan listing dan pembeli menghubungi agen secara langsung. Nusantara Property bukan pihak dalam transaksi jual beli atau sewa, dan tidak menerima pembayaran untuk properti yang ditayangkan agen. Dengan menggunakan website ini, Anda menyetujui syarat berikut."],
 ["Kewajiban agen",`<ul><li>Hanya memasang properti yang diterima langsung dari pemiliknya (Direct Owner), dengan izin pemilik untuk memasarkannya.</li><li>Tidak memasang listing titipan dari makelar lain, termasuk DKO, dan tidak menyalin iklan, foto, atau deskripsi milik orang lain.</li><li>Memastikan harga, luas, sertifikat, zonasi, dan lokasi sesuai keadaan sebenarnya, serta segera memperbarui atau menandai terjual bila keadaan berubah.</li><li>Memiliki hak atas foto dan materi yang diunggah.</li><li>Bertanggung jawab penuh atas isi listingnya dan atas komunikasi serta transaksi dengan pembeli.</li></ul>`],
 ["Izin penggunaan materi","Dengan mengunggah listing, agen memberi Nusantara Property izin untuk menampilkan, memberi watermark, mengubah ukuran, dan mempromosikan listing tersebut di website dan media sosial resmi Nusantara Property selama listing tayang. Hak cipta atas foto tetap milik pemiliknya."],
 ["Peninjauan dan penurunan listing","Akun agen ditinjau admin sebelum tayang. Admin berhak menolak pendaftaran, menurunkan atau menghapus listing yang tidak sesuai syarat ini, dan menonaktifkan akun yang melanggar. Listing yang tidak diperbarui 60 hari turun otomatis, dan listing yang ditandai terjual atau tersewa dihapus permanen 7 hari kemudian."],
 ["Untuk pembeli dan penyewa",`<ul><li>Informasi listing berasal dari masing-masing agen. Nusantara Property tidak menjamin kebenaran, kelengkapan, atau ketersediaan setiap properti.</li><li>Sebelum membayar apa pun, periksa sendiri legalitas properti: cek sertifikat di Kantor Pertanahan (BPN), tata ruang, dan identitas pemilik, serta lakukan transaksi melalui PPAT atau notaris.</li><li>Isi website, termasuk Panduan dan Berita, adalah informasi umum, bukan nasihat hukum, pajak, atau investasi.</li></ul>`],
 ["Larangan","Dilarang memasang informasi palsu atau menyesatkan, properti yang bukan hak untuk dipasarkan, konten yang melanggar hukum atau hak orang lain, serta menggunakan website untuk penipuan, spam, atau mengambil data secara massal."],
 ["Batas tanggung jawab","Sejauh diizinkan hukum, Nusantara Property tidak bertanggung jawab atas kerugian yang timbul dari isi listing, dari transaksi antara pembeli dan agen, atau dari gangguan layanan. Sengketa mengenai properti diselesaikan langsung antara pihak-pihak yang bertransaksi."],
 ["Laporan","Bila Anda menemukan listing yang keliru, disalin, atau mencurigakan, gunakan tombol Laporkan listing ini di halaman iklan atau hubungi admin lewat WhatsApp."],
 ["Hukum yang berlaku dan perubahan","Syarat ini tunduk pada hukum Republik Indonesia. Syarat dapat diperbarui sewaktu-waktu, dan tanggal berlaku terbaru selalu tercantum di halaman ini."]
];
const TERMS_EN=[
 ["About this service","Nusantara Property (nusantara.properties) is a platform where property agents publish listings and buyers contact agents directly. Nusantara Property is not a party to any sale or rental and does not take payments for properties listed by agents. By using this website you agree to the terms below."],
 ["Agent obligations",`<ul><li>Only list properties received directly from their owner (Direct Owner), with the owner's permission to market them.</li><li>Do not list properties passed on by other brokers, including DKO, and do not copy other people's ads, photos or descriptions.</li><li>Make sure price, size, land title, zoning and location are accurate, and update or mark the listing sold as soon as anything changes.</li><li>Hold the rights to the photos and material you upload.</li><li>Take full responsibility for your listing content and for your communication and transactions with buyers.</li></ul>`],
 ["Licence to use material","By uploading a listing, the agent allows Nusantara Property to display, watermark, resize and promote it on the website and on Nusantara Property's official social media while the listing is live. Copyright in the photos stays with its owner."],
 ["Review and removal","Agent accounts are reviewed by the admin before going live. The admin may refuse a registration, take down or delete listings that break these terms, and deactivate accounts that violate them. Listings not updated for 60 days are removed automatically, and listings marked sold or rented are permanently deleted 7 days later."],
 ["For buyers and tenants",`<ul><li>Listing information comes from each agent. Nusantara Property does not guarantee that any listing is accurate, complete or still available.</li><li>Before paying anything, check the property's legal status yourself: verify the certificate at the land office (BPN), the zoning and the owner's identity, and complete the transaction through a PPAT or notary.</li><li>Website content, including the Guide and News, is general information, not legal, tax or investment advice.</li></ul>`],
 ["Prohibited use","Do not post false or misleading information, properties you have no right to market, content that breaks the law or other people's rights, and do not use the website for fraud, spam or bulk data scraping."],
 ["Limitation of liability","To the extent permitted by law, Nusantara Property is not liable for losses arising from listing content, from transactions between buyers and agents, or from service interruptions. Disputes about a property are settled directly between the parties to the transaction."],
 ["Reports","If you find a listing that is wrong, copied or suspicious, use the Report this listing link on the listing page or contact the admin on WhatsApp."],
 ["Governing law and changes","These terms are governed by the laws of the Republic of Indonesia. They may be updated from time to time, and the latest effective date is always shown on this page."]
];
function legalPage(e,label,title,lead,secs,site){
 const d=new Date(LEGAL_DATE+"T00:00:00").toLocaleDateString(e?'en-GB':'id-ID',{day:"numeric",month:"long",year:"numeric"});
 return `<div class="wrap page narrow-page" data-noi18n>${head(label,title,lead)}
  <p class="legal-date">${e?"Effective date":"Berlaku sejak"}: ${d}</p>
  <div class="prose legal">${secs.map(([h,b],i)=>`<section><h2>${i+1}. ${h}</h2>${b.startsWith("<")?b:`<p>${b}</p>`}</section>`).join("")}
   <section><h2>${e?"Contact":"Kontak"}</h2><p>${e?"Questions about this page? Message the admin on WhatsApp.":"Ada pertanyaan tentang halaman ini? Hubungi admin lewat WhatsApp."}</p>
   <a class="btn btn-wa" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a></section></div></div>`;
}
function head(label,title,lead){return `<header class="page-head" data-noi18n><div class="label">${label}</div><h1>${title}</h1>${lead?`<p>${lead}</p>`:""}</header>`}

return {
 NEWS,newsCard,DATA:{NEWS_ID,NEWS_EN,GUIDE_ID,GUIDE_EN,FAQ_ID,FAQ_EN},
 privacy(site){const e=EN();return legalPage(e,e?"Privacy":"Privasi",e?"Privacy policy":"Kebijakan privasi",e?"What data Nusantara Property collects, how it is used, and your rights over it.":"Data apa yang dikumpulkan Nusantara Property, untuk apa digunakan, dan hak Anda atas data tersebut.",e?PRIVACY_EN:PRIVACY_ID,site)},
 terms(site){const e=EN();return legalPage(e,e?"Terms":"Syarat",e?"Terms of use":"Syarat & ketentuan",e?"The rules for agents, buyers and visitors using Nusantara Property.":"Aturan bagi agen, pembeli, dan pengunjung yang menggunakan Nusantara Property.",e?TERMS_EN:TERMS_ID,site)},
 news(){const e=EN();return `<div class="wrap page" data-noi18n>${head(e?"News":"Berita",e?"Indonesian property news":"Kabar properti Indonesia",e?"Summaries of market, interest-rate, lending and policy news that affects property deals. Each item links to its original source.":"Ringkasan kabar pasar, suku bunga, kredit, dan kebijakan yang berpengaruh pada jual beli properti. Setiap berita menautkan ke sumber aslinya.")}
   <div class="news-list">${NEWS.map(newsCard).join("")}</div></div>`},
 guide(){const e=EN(),G=e?GUIDE_EN:GUIDE_ID;return `<div class="wrap page" data-noi18n>${head(e?"Guide":"Panduan",e?"Guide to buying property in Indonesia":"Panduan membeli properti di Indonesia",e?"What to check before you pay, from title types to the title transfer. This is general guidance, not legal advice. Always use a PPAT or notary for the transaction.":"Hal-hal yang perlu diperiksa sebelum membayar, dari jenis sertifikat sampai balik nama. Ini panduan umum, bukan nasihat hukum. Untuk transaksi, selalu gunakan PPAT atau notaris.")}
   <div class="guide">
    <nav class="toc" aria-label="${e?"Guide contents":"Isi panduan"}"><div class="label">${e?"Contents":"Isi panduan"}</div>${G.map(g=>`<a href="#panduan" data-goto="${g.id}">${g.title}</a>`).join("")}</nav>
    <div class="prose">${G.map(g=>`<section id="g-${g.id}"><h2>${g.title}</h2>${g.html}</section>`).join("")}
     <div class="cta-band"><p>${e?"<b>Found a property you like?</b> Ask the agent for its legal documents directly on WhatsApp.":"<b>Sudah menemukan properti incaran?</b> Tanyakan dokumen legalitasnya langsung ke agen lewat WhatsApp."}</p><a class="btn btn-primary" href="#listing">${e?"View listings":"Lihat listing"}</a></div></div>
   </div></div>`},
 faq(site){const e=EN(),Q=e?FAQ_EN:FAQ_ID;return `<div class="wrap page narrow-page" data-noi18n>${head("FAQ",e?"Frequently asked questions":"Pertanyaan yang sering diajukan","")}
   ${Q.map(g=>`<section class="faq"><h2>${g.group}</h2>${g.items.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`).join("")}
   <div class="panel" style="margin-top:28px"><b>${e?"Question not answered?":"Pertanyaan Anda belum terjawab?"}</b><span>${e?"Message the admin directly on WhatsApp.":"Hubungi admin langsung lewat WhatsApp."}</span>
     <a class="btn btn-wa" style="justify-self:start" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a></div></div>`},
 about(site,stats){
  const e=EN();
  const field=e?[
   ["Listings scattered across groups","One property circulates in dozens of WhatsApp groups with different prices and details, until buyers can't tell which is right.","Every listing has one page and one responsible agent. Buyers know exactly who to contact."],
   ["Old ads never come down","The property sold long ago, but the ad keeps circulating for months, wasting buyers' and agents' time.","Listings not updated for 60 days are taken down automatically. Agents are reminded a week before to republish if the property is still available."],
   ["Key details are often missing","A buyer's first questions on site are always the same: what title, what zoning, which way it faces, where exactly it is.","The listing form asks for what buyers actually ask: title, zoning, size in m² and are, facing, building size, rooms, and a Google Maps pin for land."],
   ["Hard to judge the agent","Buyers can't tell a serious agent from an unclear middleman.","Every agent is reviewed by an admin before their profile and listings go live, complete with office, working area and experience."]
  ]:[
   ["Listing tersebar di banyak grup","Satu properti beredar di puluhan grup WhatsApp dengan harga dan keterangan berbeda, sampai pembeli tidak tahu mana yang benar.","Setiap listing punya satu halaman dan satu agen yang bertanggung jawab. Pembeli tahu persis siapa yang harus dihubungi."],
   ["Iklan lama tidak pernah turun","Properti sudah terjual, tapi iklannya masih beredar berbulan-bulan dan membuang waktu pembeli maupun agen.","Listing yang tidak diperbarui selama 60 hari otomatis diturunkan. Agen diingatkan seminggu sebelumnya untuk menayangkan ulang bila properti masih tersedia."],
   ["Informasi penting sering tidak lengkap","Pertanyaan pertama pembeli di lapangan selalu sama: sertifikatnya apa, zonasinya apa, hadap ke mana, lokasinya persis di mana.","Formulir listing meminta data yang memang ditanyakan pembeli: sertifikat, zonasi, luas dalam m² dan are, arah hadap, luas bangunan, kamar, dan titik Google Maps untuk tanah."],
   ["Sulit menilai siapa agennya","Pembeli tidak bisa membedakan agen yang serius dari perantara yang tidak jelas.","Setiap agen ditinjau admin sebelum profil dan listingnya tayang, lengkap dengan kantor, area kerja, dan pengalaman."]
  ];
  const T=e?{l:"About us",h:"A property platform born from field experience",
     lead:`${site.name} wasn't designed behind a desk. It was built from years of taking buyers on site visits, checking certificates, negotiating with landowners and seeing deals through to the signed deed. Every feature here answers a problem agents and buyers really meet in the field.`,
     s:["live listings","verified agents","provinces"],sec:"Problems in the field, and our answers",often:"What often happens",at:`On ${site.name}`,
     origin:"Started in Bali, for all of Indonesia",
     p1:`${site.name} was founded by a property practitioner active in Bali since 2009, focused on land and property in South and North Kuta. More than 15 years in the field, from land plots on the Bukit to villas in Canggu, shaped how this platform works: information must be honest, complete and current.`,
     p2:"That experience is now open to agents in other regions. Any property agent who works the same way can join, manage their own listings, and connect directly with buyers across Indonesia.",
     contact:"Contact us",join:"Join as an agent"}
   :{l:"Tentang kami",h:"Platform properti yang lahir dari pengalaman lapangan",
     lead:`${site.name} tidak dirancang dari balik meja. Platform ini dibangun dari pengalaman bertahun-tahun mengantar pembeli survei lokasi, mengecek sertifikat, bernegosiasi dengan pemilik tanah, dan mendampingi transaksi sampai akta ditandatangani. Setiap fitur di sini menjawab masalah yang benar-benar ditemui agen dan pembeli di lapangan.`,
     s:["listing tayang","agen terverifikasi","provinsi"],sec:"Masalah di lapangan, dan jawaban kami",often:"Yang sering terjadi",at:`Di ${site.name}`,
     origin:"Berawal dari Bali, untuk seluruh Indonesia",
     p1:`${site.name} didirikan oleh praktisi properti yang aktif di Bali sejak 2009, dengan fokus pada tanah dan properti di Kuta Selatan dan Kuta Utara. Lebih dari 15 tahun di lapangan, dari tanah kavling di Bukit sampai villa di Canggu, membentuk cara platform ini bekerja: informasi harus jujur, lengkap, dan masih berlaku.`,
     p2:"Pengalaman itu kini dibuka untuk agen dari daerah lain. Siapa pun agen properti yang bekerja dengan cara yang sama bisa bergabung, mengelola listingnya sendiri, dan terhubung langsung dengan pembeli dari seluruh Indonesia.",
     contact:"Hubungi kami",join:"Daftar sebagai agen"};
  return `<div class="wrap page" data-noi18n>${head(T.l,T.h,T.lead)}
   <div class="about-stats"><div><b>${stats.listings}</b><span>${T.s[0]}</span></div><div><b>${stats.agents}</b><span>${T.s[1]}</span></div><div><b>${stats.provs}</b><span>${T.s[2]}</span></div></div>
   <section class="prose" style="max-width:none"><h2>${T.sec}</h2></section>
   <div class="field-list">${field.map(([h,prob,ans])=>`<div class="field-item"><h3>${h}</h3><div class="field-cols"><div><span class="label">${T.often}</span><p>${prob}</p></div><div><span class="label">${T.at}</span><p>${ans}</p></div></div></div>`).join("")}</div>
   <section class="prose" style="margin-top:36px"><h2>${T.origin}</h2>
    <p>${T.p1}</p>
    <p>${T.p2}</p>
    <h2>${T.contact}</h2>
    <p>${e?"Questions about the platform or joining as an agent? Message the admin on WhatsApp.":"Ada pertanyaan tentang platform atau ingin bergabung sebagai agen? Hubungi admin lewat WhatsApp."}</p>
    <div class="phone"><a class="btn btn-wa" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a><a class="btn btn-line" href="#daftar">${T.join}</a></div>
   </section></div>`}
};
})();
