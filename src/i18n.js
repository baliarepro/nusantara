/* Terjemahan antarmuka Indonesia -> English.
   Teks yang diketik agen (judul, deskripsi, nama, lokasi) tidak diterjemahkan. */
window.NP_I18N=(function(){
let LANG="id";
try{const s=localStorage.getItem("np-lang");if(s==="en"||s==="id")LANG=s}catch(e){}
const D={
// data values
"Tanah":"Land","Rumah":"House","Villa":"Villa","Apartemen":"Apartment","Ruko":"Shophouse","Gudang":"Warehouse","Komersial":"Commercial","Sewa":"Rental",
"Dijual":"For sale","Disewakan":"For rent","Pariwisata":"Tourism","Permukiman":"Residential","Pertanian":"Agricultural","Perdagangan & Jasa":"Trade & services",
"Utara":"North","Timur Laut":"Northeast","Timur":"East","Tenggara":"Southeast","Selatan":"South","Barat Daya":"Southwest","Barat":"West","Barat Laut":"Northwest",
"Hak Pakai":"Right of Use","Total":"Total","Per are":"Per are","Per tahun (sewa)":"Per year (rent)","/ tahun":"/ year","/ are":"/ are",
// nav & umum
"Beranda":"Home","Listing":"Listings","Berita":"News","Panduan":"Guide","Tentang kami":"About us","FAQ":"FAQ","Masuk":"Sign in","Daftar agen":"Agent sign-up","Dasbor":"Dashboard","Menu":"Menu","Menu utama":"Main menu","Bahasa":"Language",
"Properti Indonesia,":"Indonesian property,","langsung dari agennya.":"straight from the agent.",
"Tanah, rumah, villa dan properti komersial di seluruh Indonesia dari agen-agen terpercaya. Hubungi agennya langsung lewat WhatsApp.":"Land, houses, villas and commercial property across Indonesia from trusted agents. Contact the agent directly on WhatsApp.",
"Cari":"Search","Cari kota atau lokasi, mis. Jakarta Selatan, Sleman, Canggu…":"Search a city or area, e.g. South Jakarta, Sleman, Canggu…","Cari listing":"Search listings","Cari dan saring":"Search and filter",
"listing":"listings","agen":"agents","provinsi":"provinces","kota/kabupaten":"cities/regencies",
"Baru tayang":"Just listed","Listing terbaru":"Latest listings","Lihat semua listing":"View all listings","Memuat listing…":"Loading listings…","Belum ada listing yang tayang.":"No listings yet.",
"Kabar properti terbaru":"Latest property news","Semua berita":"All news","Mau beli properti? Periksa ini dulu.":"Buying property? Check these first.",
"Jenis sertifikat, cek legalitas di BPN, hitungan pajak BPHTB dan PPh, sampai alur AJB dan balik nama.":"Title types, legal checks at the land office, BPHTB and income tax, through to the deed of sale and title transfer.",
"Baca panduan":"Read the guide","Semua listing":"All listings","Jenis properti":"Property type","Semua":"All",
"Dijual & disewakan":"For sale & for rent","Semua provinsi":"All provinces","Semua kota/kabupaten":"All cities/regencies","Semua agen":"All agents","Semua budget":"Any budget","Kamar tidur":"Bedrooms","Semua arah hadap":"Any facing","Urutkan":"Sort","Status":"Status","Provinsi":"Province","Kota/kabupaten":"City/regency","Agen":"Agent","Budget":"Budget","Hadap":"Facing",
"Di bawah Rp500 jt":"Under Rp500M","Rp500 jt – 1 M":"Rp500M – 1B","Rp1 – 2 M":"Rp1 – 2B","Rp2 – 5 M":"Rp2 – 5B","Rp5 – 10 M":"Rp5 – 10B","Di atas Rp10 M":"Above Rp10B",
"1+ KT":"1+ bed","2+ KT":"2+ bed","3+ KT":"3+ bed","4+ KT":"4+ bed","5+ KT":"5+ bed",
"Terbaru":"Newest","Harga terendah":"Lowest price","Harga tertinggi":"Highest price","Luas terbesar":"Largest","Luas terkecil":"Smallest","Hapus filter":"Clear filters",
"Belum ada listing yang cocok. Coba hapus beberapa filter.":"No matching listings. Try removing some filters.","Belum ada listing yang cocok. Coba kata lain atau hapus filter.":"No matching listings. Try another word or clear the filters.",
"Belum ada listing yang tayang. Agen yang sudah terdaftar bisa memasang listing dari dasbor.":"No listings yet. Registered agents can post listings from their dashboard.",
"Tim agen":"Agent team","Agen kami":"Our agents","Agen independen":"Independent agent","Belum ada agen yang tayang.":"No agents listed yet.","Memuat agen…":"Loading agents…",
"Anda agen properti?":"Are you a property agent?","Daftar sebagai agen":"Join as an agent",
"Buat akun, pasang listing Anda di Nusantara Property, dan terima calon pembeli langsung ke WhatsApp Anda.":"Create an account, post your listings on Nusantara Property, and receive buyers directly on your WhatsApp.",
// kartu & detail
"LT":"Land","LB":"Bldg","KT":"bed","KM":"bath","Harga: tanya agen":"Price on request","Tanya agen":"On request","Diperbarui":"Updated",
"← Semua listing":"← All listings","← Semua agen":"← All agents","Jenis":"Type","Luas":"Size","Luas tanah":"Land size","Luas bangunan":"Building size","Kamar mandi":"Bathrooms","Sertifikat":"Title","Zonasi":"Zoning","Lokasi":"Location","Harga":"Price","Harga per are":"Price per are","Tanggal tayang":"Listed on","Terakhir diperbarui":"Last updated",
"Listing ini belum tayang. Hanya Anda yang bisa melihatnya.":"This listing is not published. Only you can see it.",
"Tayangkan ulang":"Republish","Lihat lokasi di Google Maps":"View location on Google Maps","Agen listing ini":"Listing agent","Tanya via WhatsApp":"Ask on WhatsApp",
"Brosur listing":"Listing brochure","Download brosur PDF":"Download PDF brochure","Edit listing ini":"Edit this listing","Agen ini belum punya listing yang tayang.":"This agent has no live listings yet.",
"Informasi listing dari masing-masing agen.":"Listing information is provided by each agent.","Warna zonasi":"Zoning colours",
// daftar & masuk
"Akun dibuat":"Account created","Cek email Anda":"Check your email","Kami mengirim tautan konfirmasi ke":"We sent a confirmation link to",
". Klik tautan itu, lalu masuk ke dasbor. Tidak ada di kotak masuk? Periksa folder Spam atau Promosi.":". Click the link, then sign in to your dashboard. Not in your inbox? Check Spam or Promotions.",
"Setelah email dikonfirmasi, admin akan meninjau akun Anda. Agar lebih cepat, kabari admin lewat WhatsApp.":"After you confirm your email, an admin will review your account. To speed things up, let the admin know on WhatsApp.",
"Kabari admin via WhatsApp":"Message the admin on WhatsApp","Ke halaman masuk":"Go to sign in","Buat akun agen":"Create an agent account","Email":"Email","Password":"Password","Minimal 8 karakter.":"At least 8 characters.",
"Nama lengkap":"Full name","Kantor / agensi":"Office / agency","Kosongkan jika independen":"Leave blank if independent","No. WhatsApp":"WhatsApp number","Aktif sebagai agen sejak":"Agent since","Pilih provinsi":"Choose a province","Kota / kabupaten":"City / regency",
"Area spesialis":"Specialist areas","Jenis properti yang Anda pasarkan":"Property types you market","No. anggota AREBI (opsional)":"AREBI member no. (optional)","No. anggota AREBI":"AREBI member no.","Profil singkat":"Short bio","Pengalaman, keahlian, bahasa yang dikuasai…":"Experience, expertise, languages spoken…",
"Saya menyatakan data ini benar, dan setiap listing yang saya pasang adalah properti yang berhak saya pasarkan.":"I confirm this information is correct, and that every listing I post is a property I am entitled to market.",
"Membuat akun…":"Creating account…","Buat akun":"Create account","Sudah punya akun?":"Already have an account?","Masuk di sini":"Sign in here","← Kembali ke listing":"← Back to listings","Untuk agen properti":"For property agents","Daftar sebagai agen":"Join as an agent",
"Kelola listing Anda sendiri dari dasbor pribadi. Setiap pertanyaan pembeli langsung masuk ke WhatsApp Anda.":"Manage your own listings from a private dashboard. Every buyer enquiry goes straight to your WhatsApp.",
"Buat akun":"Create account","Isi data diri dan area kerja Anda.":"Fill in your details and working area.","Konfirmasi email":"Confirm your email","Klik tautan yang kami kirim ke email Anda.":"Click the link we send to your email.",
"Persetujuan admin":"Admin approval","Setelah disetujui, profil Anda tayang dan Anda bisa memasang listing.":"Once approved, your profile goes live and you can post listings.",
"Area agen":"Agent area","Masuk…":"Signing in…","Lupa password?":"Forgot password?","Belum punya akun?":"No account yet?","Atur ulang password":"Reset password","Password baru":"New password","Simpan password":"Save password",
"Isi alamat email yang valid.":"Enter a valid email address.","Password minimal 8 karakter.":"Password must be at least 8 characters.","Isi nama lengkap Anda.":"Enter your full name.","Isi nomor WhatsApp yang aktif.":"Enter an active WhatsApp number.","Pilih provinsi.":"Choose a province.","Isi kota atau kabupaten.":"Enter a city or regency.","Centang pernyataan ini untuk melanjutkan.":"Tick this statement to continue.",
"Email atau password salah.":"Wrong email or password.","Email belum dikonfirmasi. Buka email dari Supabase dan klik tautan konfirmasinya.":"Email not confirmed yet. Open the confirmation email and click its link.",
"Email ini sudah terdaftar. Silakan masuk, atau pakai Lupa password.":"This email is already registered. Sign in, or use Forgot password.","Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi.":"Too many attempts. Wait a few minutes and try again.",
"Anda tidak punya izin untuk perubahan ini.":"You don't have permission to make this change.","Tidak bisa terhubung ke server. Periksa koneksi internet Anda.":"Can't reach the server. Check your internet connection.","Terjadi kesalahan. Coba lagi.":"Something went wrong. Please try again.",
"Isi email Anda dulu, lalu ketuk Lupa password.":"Enter your email first, then tap Forgot password.","Password baru tersimpan.":"New password saved.","Layanan data tidak termuat. Muat ulang halaman.":"Data service didn't load. Reload the page.",
// dasbor
"Disetujui":"Approved","Ditolak":"Rejected","Menunggu persetujuan":"Awaiting approval","Profil agen Anda belum ada. Lengkapi profil untuk melanjutkan.":"Your agent profile doesn't exist yet. Complete your profile to continue.",
"Listing saya":"My listings","Profil":"Profile","Semua listing":"All listings","Dasbor agen":"Agent dashboard","Dasbor agen · Admin":"Agent dashboard · Admin","Keluar":"Sign out",
"Akun Anda sedang ditinjau admin. Sambil menunggu, lengkapi profil Anda. Listing bisa dipasang setelah akun disetujui.":"Your account is being reviewed by an admin. Meanwhile, complete your profile. You can post listings once approved.",
"Ada listing Anda yang sudah atau akan segera diturunkan.":"Some of your listings have expired or will expire soon.","Lihat listing saya":"View my listings",
"Draf":"Draft","Diturunkan":"Expired","Tambah listing":"Add listing","Menunggu persetujuan admin":"Awaiting admin approval",
"Listing otomatis diturunkan bila tidak diperbarui selama 60 hari. Menyimpan perubahan atau mengetuk Tayangkan ulang akan memulai hitungan dari awal.":"Listings are taken down automatically if not updated for 60 days. Saving changes or tapping Republish restarts the count.",
"Ketuk Tambah listing untuk memasang yang pertama.":"Tap Add listing to post your first one.","Anda bisa memasang listing setelah akun disetujui.":"You can post listings once your account is approved.","Belum ada listing.":"No listings yet.",
"Hapus listing ini?":"Delete this listing?","Ya, hapus":"Yes, delete","Batal":"Cancel","Lihat":"View","Edit":"Edit","Hapus":"Delete","Ingatkan via WA":"Remind on WhatsApp","Tayangkan ulang semua":"Republish all",
"Setujui":"Approve","Tolak":"Reject","Nonaktifkan":"Deactivate","WhatsApp":"WhatsApp","Independen":"Independent","Admin":"Admin",
"Profil publik Anda":"Your public profile","Agen sejak":"Agent since","Foto profil":"Profile photo","Menyimpan…":"Saving…","Simpan profil":"Save profile",
"← Kembali ke daftar":"← Back to list","Edit listing":"Edit listing","Listing baru":"New listing","Judul":"Title","Rumah 2 lantai dekat stasiun MRT":"2-storey house near an MRT station",
"Kecamatan / kelurahan / perumahan":"District / village / estate","Luas (m²)":"Size (m²)","Luas tanah (m²)":"Land size (m²)","Luas bangunan (m²)":"Building size (m²)","Hadap / orientasi":"Facing / orientation",
"Harga publik (Rp)":"Public price (Rp)","Kosongkan = tanya agen":"Leave blank = on request","Satuan harga":"Price unit","Lokasi Google Maps":"Google Maps location",
"Buka lokasi tanah di aplikasi Google Maps, ketuk Bagikan, lalu salin link dan tempel di sini. Tombol Lihat lokasi akan tampil di halaman listing.":"Open the land's location in Google Maps, tap Share, copy the link and paste it here. A View location button will appear on the listing page.",
"Deskripsi":"Description","Akses jalan, view, fasilitas sekitar…":"Road access, views, nearby amenities…","Foto":"Photos","Mengunggah foto…":"Uploading photos…","Hapus foto":"Remove photo",
"Tayangkan listing ini di website":"Publish this listing on the website","Simpan perubahan":"Save changes","Simpan listing":"Save listing",
"Profil tersimpan.":"Profile saved.","Nama dan nomor WhatsApp wajib diisi.":"Name and WhatsApp number are required.","Isi judul listing.":"Enter a listing title.","Pilih provinsi dan isi kota/kabupaten.":"Choose a province and enter a city/regency.",
"Link lokasi harus link Google Maps, misalnya https://maps.app.goo.gl/… atau https://www.google.com/maps/…":"The location must be a Google Maps link, e.g. https://maps.app.goo.gl/… or https://www.google.com/maps/…",
"Kolom baru belum ada di database. Admin perlu menjalankan SQL tambahan di Supabase.":"New fields are missing in the database. The admin needs to run the extra SQL in Supabase.",
"Listing tersimpan dan tayang.":"Listing saved and published.","Listing tersimpan sebagai draf.":"Listing saved as a draft.","Listing dihapus.":"Listing deleted.",
"Agen disetujui. Profilnya sekarang tayang.":"Agent approved. Their profile is now live.","Status agen diperbarui.":"Agent status updated.",
"Menyiapkan PDF…":"Preparing PDF…","PDF terunduh":"PDF downloaded","Gagal membuat PDF, coba lagi":"Couldn't create the PDF, try again","Tersalin":"Copied","Pendaftaran Anda belum disetujui. Hubungi admin lewat WhatsApp untuk informasi lebih lanjut.":"Your registration has not been approved. Contact the admin on WhatsApp for more information.","WhatsApp admin":"WhatsApp admin",
// pdf
"BROSUR LISTING":"LISTING BROCHURE","SPESIFIKASI":"SPECIFICATIONS","DESKRIPSI":"DESCRIPTION","INFO & JADWAL SURVEI":"INFO & SITE VISITS","Chat via WhatsApp":"Chat on WhatsApp","Ketuk tombol untuk langsung chat":"Tap the button to chat directly",
"Harga: hubungi agen":"Price: contact the agent","Hubungi agen":"Contact the agent","Lokasi Google Maps:":"Google Maps location:","per are":"per are"
};
const P=[
 [/^Zona (.+)$/,m=>"Zone: "+(D[m[1]]||m[1])],
 [/^Hadap (.+)$/,m=>"Facing "+(D[m[1]]||m[1])],
 [/^Tayang · sisa (\d+) hari$/,m=>`Live · ${m[1]} days left`],
 [/^Tayang (.+?) · diperbarui (.+)$/,m=>`Listed ${m[1]} · updated ${m[2]}`],
 [/^Tayang (.+)$/,m=>"Listed "+m[1]],
 [/^Diperbarui (.+)$/,m=>"Updated "+m[1]],
 [/^Turun dalam (\d+) hari$/,m=>`Expires in ${m[1]} days`],
 [/^(\d+) listing$/,m=>`${m[1]} listing${m[1]==="1"?"":"s"}`],
 [/^(\d+) listing dari semua agen$/,m=>`${m[1]} listings from all agents`],
 [/^Agen \((\d+) baru\)$/,m=>`Agents (${m[1]} new)`],
 [/^Maksimal (\d+) foto per listing\. Foto pertama jadi foto sampul\.$/,m=>`Up to ${m[1]} photos per listing. The first photo is the cover.`],
 [/^Anda masih bisa menambah (\d+) foto\.$/,m=>`You can add ${m[1]} more photo${m[1]==="1"?"":"s"}.`],
 [/^Batas (\d+) foto sudah tercapai\. Hapus salah satu foto untuk menggantinya\.$/,m=>`The ${m[1]}-photo limit is reached. Remove a photo to replace it.`],
 [/^Maksimal (\d+) foto per listing\. (\d+) foto tidak diunggah\.$/,m=>`Up to ${m[1]} photos per listing. ${m[2]} photo(s) were not uploaded.`],
 [/^Satu foto gagal diunggah: (.*)$/,m=>"A photo failed to upload: "+m[1]],
 [/^Foto gagal diunggah: (.*)$/,m=>"Photo upload failed: "+m[1]],
 [/^(\d+) listing ditayangkan ulang untuk (\d+) hari ke depan\.$/,m=>`${m[1]} listings republished for the next ${m[2]} days.`],
 [/^Listing ditayangkan ulang untuk (\d+) hari ke depan\.$/,m=>`Listing republished for the next ${m[1]} days.`],
 [/^Tautan untuk mengatur ulang password sudah dikirim ke (.+)\.$/,m=>`A password reset link has been sent to ${m[1]}.`],
 [/^Pendaftaran Anda belum disetujui\. Hubungi admin di WhatsApp (\S+) untuk informasi lebih lanjut\.$/,m=>`Your registration has not been approved. Contact the admin on WhatsApp ${m[1]} for more information.`],
 [/^Listing ini sudah diturunkan karena tidak diperbarui selama (\d+) hari\. Pembeli tidak bisa melihatnya\.$/,m=>`This listing was taken down because it wasn't updated for ${m[1]} days. Buyers can't see it.`],
 [/^Listing ini akan diturunkan dalam (\d+) hari\.$/,m=>`This listing will be taken down in ${m[1]} days.`],
 [/^ · milik (.+)$/,m=>" · owned by "+m[1]],
 [/^WhatsApp (.+)$/,m=>"WhatsApp "+m[1]],
 [/^agen sejak (\d+)$/,m=>"agent since "+m[1]],
 [/^Foto (\d+)$/,m=>"Photo "+m[1]],
 [/^Salin manual: (.+)$/,m=>"Copy manually: "+m[1]]
];
function t(s){
  if(LANG!=="en"||s==null)return s;
  const str=String(s),core=str.trim();if(!core)return str;
  const lead=str.slice(0,str.indexOf(core)),trail=str.slice(str.indexOf(core)+core.length);
  if(D[core]!=null)return lead+D[core]+trail;
  for(const [re,fn] of P){const m=core.match(re);if(m)return lead+fn(m)+trail}
  if(core.includes(" · ")){const parts=core.split(" · ");const tr=parts.map(p=>D[p]!=null?D[p]:p);if(tr.some((x,i)=>x!==parts[i]))return lead+tr.join(" · ")+trail}
  return str;
}
const SKIP={SCRIPT:1,STYLE:1,TEXTAREA:1,CODE:1,PRE:1};
function translate(root){
  if(LANG!=="en"||!root)return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode&&!SKIP[n.parentNode.nodeName]&&!n.parentNode.closest("[data-noi18n]")?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT});
  const nodes=[];while(w.nextNode())nodes.push(w.currentNode);
  nodes.forEach(n=>{const v=t(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v});
  root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(el=>{["placeholder","aria-label","title"].forEach(a=>{if(el.hasAttribute(a)){const v=t(el.getAttribute(a));if(v!==el.getAttribute(a))el.setAttribute(a,v)}})});
}

/* ===== terjemahan otomatis judul listing =====
   1) kamus istilah properti (langsung tampil), 2) mesin terjemahan MyMemory (disimpan di browser). */
const G=[
 [/\bkolam renang\b/gi,"swimming pool"],[/\bview laut\b/gi,"sea view"],[/\bpemandangan laut\b/gi,"sea view"],[/\bview sawah\b/gi,"rice field view"],
 [/\bsiap huni\b/gi,"move-in ready"],[/\bpinggir jalan\b/gi,"roadside"],[/\bjalan utama\b/gi,"main road"],[/\bdi bawah harga pasar\b/gi,"below market price"],
 [/\btanah hook\b/gi,"corner land"],[/\btanah gandeng\b/gi,"adjacent land plots"],[/\btanah kavling\b/gi,"land plot"],
 [/\b(\d+)\s*lantai\b/gi,"$1-storey"],[/\b(\d+)\s*kamar tidur\b/gi,"$1-bedroom"],[/\b(\d+)\s*KT\b/g,"$1 bed"],[/\b(\d+)\s*KM\b/g,"$1 bath"]
];
const PLACE=[[/(?<!Jl\.\s|Jalan\s)\bPantai\s+([A-Z][\w'-]*(?:\s+[A-Z][\w'-]*)?)/g,"$1 Beach"],[/\bGunung\s+([A-Z][\w'-]*)/g,"Mount $1"],[/\bDanau\s+([A-Z][\w'-]*)/g,"Lake $1"],[/(?<!Jl\.\s|Jalan\s)\bPura\s+([A-Z][\w'-]*)/g,"$1 Temple"]];
const W={tanah:"land",rumah:"house",villa:"villa",vila:"villa",apartemen:"apartment",ruko:"shophouse",gudang:"warehouse",kos:"boarding house",kost:"boarding house",hotel:"hotel",
 dekat:"near",di:"in",dan:"and",dengan:"with",untuk:"for",ke:"to",dari:"from",atau:"or",
 dijual:"for sale",jual:"for sale",disewakan:"for rent",sewa:"for rent",murah:"affordable",strategis:"strategic",luas:"spacious",besar:"large",kecil:"small",
 baru:"new",mewah:"luxury",minimalis:"minimalist",modern:"modern",cantik:"beautiful",asri:"green",tenang:"quiet",nyaman:"comfortable",eksklusif:"exclusive",
 kavling:"plot",gandeng:"adjacent",hook:"corner",pojok:"corner",jalan:"road",utama:"main",kota:"city",pusat:"center",kawasan:"area",lingkungan:"neighbourhood",
 pantai:"beach",laut:"sea",sawah:"rice field",tebing:"cliff",bukit:"hill",gunung:"mountain",sungai:"river",danau:"lake",hutan:"forest",
 kamar:"room",lantai:"floor",kolam:"pool",taman:"garden",garasi:"garage",dapur:"kitchen",
 investasi:"investment",bisnis:"business",usaha:"business",cocok:"suitable",bonus:"bonus",furnished:"furnished",full:"full",semi:"semi",
 sertifikat:"certificate",pariwisata:"tourism",permukiman:"residential",pertanian:"agricultural",nego:"negotiable",stasiun:"station",cepat:"quick",bandara:"airport",kampus:"campus",sekolah:"school",tol:"toll road",pasar:"market"};
function gloss(text){
  let s=String(text||"");
  PLACE.forEach(([re,r])=>s=s.replace(re,r));
  G.forEach(([re,r])=>s=s.replace(re,r));
  s=s.replace(/[A-Za-zÀ-ÿ]+/g,w=>{const k=w.toLowerCase();if(!(k in W))return w;const v=W[k];return w[0]===w[0].toUpperCase()&&w[0]!==w[0].toLowerCase()?v.charAt(0).toUpperCase()+v.slice(1):v});
  return s.charAt(0).toUpperCase()+s.slice(1);
}
const CK="np-mt:";
function cached(text){try{return localStorage.getItem(CK+text)}catch(e){return null}}
const pending=new Map();
function machine(text){
  const c=cached(text);if(c)return Promise.resolve(c);
  if(pending.has(text))return pending.get(text);
  const pr=fetch("https://api.mymemory.translated.net/get?langpair=id|en&q="+encodeURIComponent(text))
    .then(r=>r.ok?r.json():null).then(j=>{
      const out=j&&j.responseStatus==200&&j.responseData&&j.responseData.translatedText;
      if(out&&!/MYMEMORY WARNING|INVALID|QUERY LENGTH/i.test(out)){const v=out.replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&amp;/g,"&");try{localStorage.setItem(CK+text,v)}catch(e){}return v}
      return null}).catch(()=>null);
  pending.set(text,pr);return pr;
}
function title(text){return LANG==="en"?(cached(text)||gloss(text)):text}
function upgrade(root){
  if(LANG!=="en"||!root)return;
  root.querySelectorAll("[data-mt]").forEach(el=>{
    const src=el.getAttribute("data-mt");if(!src||cached(src))return;
    machine(src).then(v=>{if(v&&LANG==="en"&&el.isConnected&&el.getAttribute("data-mt")===src)el.textContent=v});
  });
}
return {
  get lang(){return LANG},
  set(l){LANG=l==="en"?"en":"id";try{localStorage.setItem("np-lang",LANG)}catch(e){}document.documentElement.lang=LANG},
  get locale(){return LANG==="en"?"en-GB":"id-ID"},
  t,translate,title,upgrade,gloss
};
})();
document.documentElement.lang=window.NP_I18N.lang;
