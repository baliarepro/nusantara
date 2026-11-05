/* Konten halaman statis Nusantara Property: Berita, Panduan, Tentang Kami, FAQ.
   Berita: tambahkan item baru di PALING ATAS array NEWS. */
window.NP_PAGES=(function(){
const NEWS=[
  {date:"2026-10-28",tag:"Kredit",title:"Kredit properti tumbuh 16,4% per September 2026, KPR naik tipis",
   summary:"Menurut data uang beredar Bank Indonesia, kredit properti tumbuh 16,4% (yoy) menjadi Rp1.703,7 triliun pada September 2026, melambat dari 18,3% di bulan sebelumnya. Penyaluran KPR dan KPA justru naik tipis menjadi 4,3% (yoy) dengan nilai Rp863,1 triliun, berlawanan dengan kredit konsumsi lain yang melemah. Kredit konstruksi masih tumbuh 42,3%.",
   source:"Kontan",url:"https://keuangan.kontan.co.id/news/kredit-properti-tumbuh-164-yoy-september-2026"},
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

const GUIDE=[
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

const FAQ=[
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
  ["Siapa yang bisa melihat data pribadi listing?","Alamat persis, harga net, dan catatan di bagian Data pribadi hanya bisa dilihat oleh Anda dan admin. Data ini tidak pernah tampil di website."],
  ["Bagaimana menyembunyikan listing tanpa menghapusnya?","Edit listing, hilangkan centang Tayangkan listing ini di website, lalu simpan. Listing menjadi draf dan bisa ditayangkan lagi kapan saja."],
  ["Berapa foto yang bisa diunggah?","Sampai 6 foto per listing. Foto pertama menjadi foto sampul, dan ukurannya otomatis dikecilkan agar website tetap cepat."]
 ]}
];

const IC={
 search:'<path d="M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM21 21l-4.5-4.5"/>',
 chat:'<path d="M4 5h16v11H9l-5 4z"/>',
 check:'<path d="M5 12l4 4 10-10"/>'
};
const svg=k=>`<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[k]}</svg>`;
const fmtDate=d=>new Date(d+"T00:00:00").toLocaleDateString('id-ID',{day:"numeric",month:"long",year:"numeric"});

function newsCard(n){
  return `<article class="news-card">
    <div class="news-meta"><span class="pill pill-approved">${n.tag}</span><time datetime="${n.date}">${fmtDate(n.date)}</time></div>
    <h3>${n.title}</h3><p>${n.summary}</p>
    <a class="news-src" href="${n.url}" target="_blank" rel="noopener">Baca di ${n.source} ↗</a></article>`;
}
function head(label,title,lead){return `<header class="page-head"><div class="label">${label}</div><h1>${title}</h1>${lead?`<p>${lead}</p>`:""}</header>`}

return {
 NEWS,newsCard,
 news(){return `<div class="wrap page">${head("Berita","Kabar properti Indonesia","Ringkasan kabar pasar, suku bunga, kredit, dan kebijakan yang berpengaruh pada jual beli properti. Setiap berita menautkan ke sumber aslinya.")}
   <div class="news-list">${NEWS.map(newsCard).join("")}</div></div>`},
 guide(){return `<div class="wrap page">${head("Panduan","Panduan membeli properti di Indonesia","Hal-hal yang perlu diperiksa sebelum membayar, dari jenis sertifikat sampai balik nama. Ini panduan umum, bukan nasihat hukum. Untuk transaksi, selalu gunakan PPAT atau notaris.")}
   <div class="guide">
    <nav class="toc" aria-label="Isi panduan"><div class="label">Isi panduan</div>${GUIDE.map(g=>`<a href="#panduan" data-goto="${g.id}">${g.title}</a>`).join("")}</nav>
    <div class="prose">${GUIDE.map(g=>`<section id="g-${g.id}"><h2>${g.title}</h2>${g.html}</section>`).join("")}
     <div class="cta-band"><p><b>Sudah menemukan properti incaran?</b> Tanyakan dokumen legalitasnya langsung ke agen lewat WhatsApp.</p><a class="btn btn-primary" href="#listing">Lihat listing</a></div></div>
   </div></div>`},
 faq(site){return `<div class="wrap page narrow-page">${head("FAQ","Pertanyaan yang sering diajukan","")}
   ${FAQ.map(g=>`<section class="faq"><h2>${g.group}</h2>${g.items.map(([q,a])=>`<details><summary>${q}</summary><p>${a}</p></details>`).join("")}</section>`).join("")}
   <div class="panel" style="margin-top:28px"><b>Pertanyaan Anda belum terjawab?</b><span>Hubungi admin lewat WhatsApp di <code>${site.adminPhone}</code>.</span>
     <a class="btn btn-wa" style="justify-self:start" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a></div></div>`},
 about(site,stats){return `<div class="wrap page">${head("Tentang kami",`Satu tempat untuk listing properti dari agen di seluruh Indonesia`,`${site.name} mempertemukan pembeli dengan agen properti yang terverifikasi, dari tanah kavling di Bali sampai rumah di Jabodetabek. Setiap listing dikelola langsung oleh agennya, sehingga informasi yang Anda terima datang dari orang yang benar-benar memasarkan properti itu.`)}
   <div class="about-stats"><div><b>${stats.listings}</b><span>listing tayang</span></div><div><b>${stats.agents}</b><span>agen terverifikasi</span></div><div><b>${stats.provs}</b><span>provinsi</span></div></div>
   <div class="about-grid">
    <div class="about-card">${svg("search")}<h3>Untuk pembeli</h3><p>Cari berdasarkan jenis properti, provinsi, kota, dan agen. Lihat luas dalam m² dan are, sertifikat, serta zonasi, lalu hubungi agennya langsung lewat WhatsApp.</p></div>
    <div class="about-card">${svg("chat")}<h3>Untuk agen</h3><p>Setiap agen punya dasbor sendiri untuk memasang dan mengelola listing. Data sensitif seperti alamat persis dan harga net tersimpan privat, hanya untuk agen dan admin.</p></div>
    <div class="about-card">${svg("check")}<h3>Terverifikasi</h3><p>Setiap agen baru ditinjau admin sebelum profil dan listingnya tayang, supaya pembeli berhubungan dengan agen yang jelas identitasnya.</p></div>
   </div>
   <section class="prose" style="margin-top:36px"><h2>Di balik ${site.name}</h2>
    <p>${site.name} dikelola oleh Bagoes, agen properti di Bali sejak 2009 dan pendiri Bali Are Property, agensi independen yang berfokus pada tanah dan properti di Kuta Selatan dan Kuta Utara. Pengalaman memasarkan properti di Bali selama lebih dari 15 tahun menjadi dasar platform ini: memudahkan pembeli menemukan properti, dan memudahkan agen dari berbagai daerah memasarkannya.</p>
    <h2>Hubungi kami</h2>
    <p>WhatsApp admin: <code>${site.adminPhone}</code></p>
    <div class="phone"><a class="btn btn-wa" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a><a class="btn btn-line" href="#daftar">Daftar sebagai agen</a></div>
   </section></div>`}
};
})();
