/* Konten halaman statis Nusantara Property: Berita, Panduan, Tentang Kami, FAQ.
   Berita: tambahkan item baru di PALING ATAS array NEWS. */
window.NP_PAGES=(function(){
const NEWS_ID=[
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
  {date:"2026-10-28",tag:"Credit",title:"Property lending grew 16.4% in September 2026, mortgages edged up",
   summary:"According to Bank Indonesia's money supply data, property lending grew 16.4% (yoy) to Rp1,703.7 trillion in September 2026, slowing from 18.3% the month before. House and apartment mortgages rose slightly to 4.3% (yoy) at Rp863.1 trillion, against the trend of weaker consumer lending. Construction lending still grew 42.3%.",
   source:"Kontan",url:NEWS_ID[0].url},
  {date:"2026-10-21",tag:"Interest rates",title:"Bank Indonesia holds the BI Rate at 5.75% in October 2026",
   summary:"Bank Indonesia kept its benchmark rate at 5.75%. Over 2026 the BI Rate has risen 100 basis points from 4.75% since mid-May to keep the rupiah stable. For buyers on floating-rate mortgages, instalments are unlikely to fall soon, so a longer fixed-rate period is worth considering.",
   source:"Bisnis.com",url:NEWS_ID[1].url},
  {date:"2026-08-07",tag:"House prices",title:"Primary house prices up 0.69% in Q2 2026 as sales start to recover",
   summary:"Bank Indonesia's Residential Property Price Survey recorded a 0.69% (yoy) rise in its residential price index in Q2 2026. Primary-market sales were still down 2.36% (yoy), a big improvement on the 25.67% contraction in Q1, and up 9.39% on the previous quarter.",
   source:"Industry.co.id",url:NEWS_ID[2].url},
  {date:"2026-01-05",tag:"Tax",title:"Government covers 100% of VAT on homes throughout 2026",
   summary:"Under Finance Minister Regulation No. 90 of 2025, the government covers 100% of VAT on the portion of the price up to Rp2 billion for landed houses or apartment units priced up to Rp5 billion. The incentive applies to handovers from January to December 2026, and only to purchases from developers that charge VAT.",
   source:"Suara Surabaya",url:NEWS_ID[3].url}
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
function head(label,title,lead){return `<header class="page-head" data-noi18n><div class="label">${label}</div><h1>${title}</h1>${lead?`<p>${lead}</p>`:""}</header>`}

return {
 NEWS,newsCard,
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
   <div class="panel" style="margin-top:28px"><b>${e?"Question not answered?":"Pertanyaan Anda belum terjawab?"}</b><span>${e?"Contact the admin on WhatsApp at":"Hubungi admin lewat WhatsApp di"} <code>${site.adminPhone}</code>.</span>
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
    <p>WhatsApp admin: <code>${site.adminPhone}</code></p>
    <div class="phone"><a class="btn btn-wa" href="https://wa.me/62${site.adminPhone.replace(/^0/,"")}" target="_blank" rel="noopener">WhatsApp admin</a><a class="btn btn-line" href="#daftar">${T.join}</a></div>
   </section></div>`}
};
})();
