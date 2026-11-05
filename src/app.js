(function(){
/* ===== konfigurasi ===== */
const SB_URL="https://mpyspcofrekhnbkxzucr.supabase.co";
const SB_KEY="sb_publishable_cFs5F-kTzR39URtsdFKhGg_mXN7cObN";
const SITE={name:"Nusantara Property",adminPhone:"0812868080",
  tagline:"Tanah, rumah, villa dan properti komersial di seluruh Indonesia dari agen-agen terpercaya. Hubungi agennya langsung lewat WhatsApp."};
const TYPES=["Tanah","Rumah","Villa","Apartemen","Ruko","Gudang","Komersial"];
const STATUS=["Dijual","Disewakan"];
const PROVS=["Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi","Sumatera Selatan","Kepulauan Bangka Belitung","Bengkulu","Lampung","DKI Jakarta","Jawa Barat","Banten","Jawa Tengah","DI Yogyakarta","Jawa Timur","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara","Gorontalo","Sulawesi Tengah","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tenggara","Maluku","Maluku Utara","Papua","Papua Barat","Papua Barat Daya","Papua Tengah","Papua Pegunungan","Papua Selatan"];
const CERTS=["SHM","SHGB","Hak Pakai","Leasehold"];
const ZONES={"Pariwisata":"--z-pariwisata","Permukiman":"--z-permukiman","Pertanian":"--z-pertanian","Perdagangan & Jasa":"--z-dagang"};
const UNITS={total:"",are:"/ are",tahun:"/ tahun"};
const SPEC=["Tanah","Rumah","Villa","Apartemen","Ruko","Gudang","Komersial","Sewa"];
const AGENT_COLS="id,name,agency,phone,prov,kab,areas,since,specialties,arebi,bio,photo_url,status,is_admin,created_at";
const BASE=location.origin+location.pathname;
const FROM_LINK=/access_token/.test(location.hash)&&!/type=recovery/.test(location.hash);

const app=document.getElementById('app');
let sb=null;
try{sb=window.supabase.createClient(SB_URL,SB_KEY)}catch(e){}

/* ===== state ===== */
let S={agents:[],listings:[],loaded:false,error:""};
let session=null,me=null,recovery=false;
const F={q:"",type:"",status:"",prov:"",kab:"",agent:"",sort:"new"};
const REG={data:{},errors:{},done:false,busy:false,msg:null};
const AUTH={busy:false,msg:null,email:""};
let DS={tab:"mine",form:null,confirm:null,busy:false,msg:null,profile:null};

/* ===== helpers ===== */
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>Number(n).toLocaleString('id-ID');
const agentOf=id=>S.agents.find(a=>a.id===id);
const initials=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const pubAgents=()=>S.agents.filter(a=>a.status==="approved");
const pubListings=()=>S.listings.filter(l=>l.published&&(agentOf(l.agent_id)||{}).status==="approved");
const kabsIn=p=>[...new Set(pubListings().filter(l=>!p||l.prov===p).map(l=>l.kab).filter(Boolean))].sort();
function rupiah(v){
  if(v==null||v==="")return "";v=Number(v);
  if(v>=1e12)return "Rp "+(v/1e12).toLocaleString('id-ID',{maximumFractionDigits:2})+" T";
  if(v>=1e9)return "Rp "+(v/1e9).toLocaleString('id-ID',{maximumFractionDigits:2})+" M";
  if(v>=1e6)return "Rp "+(v/1e6).toLocaleString('id-ID',{maximumFractionDigits:1})+" jt";
  return "Rp "+num(v);
}
function wa(p){let d=String(p||"").replace(/\D/g,"");if(d.startsWith("0"))d="62"+d.slice(1);return d}
function waLink(a,l){
  const t=l?`Halo ${a.name}, saya tertarik dengan listing "${l.title}" (${l.place||l.kab}) di ${SITE.name}. Boleh minta info detail?`:`Halo ${a.name}, saya menemukan Anda di ${SITE.name}.`;
  return `https://wa.me/${wa(a.phone)}?text=${encodeURIComponent(t)}`;
}
function ava(a,cls){return `<span class="ava ${cls||""}">${a&&a.photo_url?`<img src="${esc(a.photo_url)}" alt="">`:esc(initials(a&&a.name))}</span>`}
function zoneHtml(z){if(!z)return "";return `<span class="zone"><i style="background:var(${ZONES[z]||"--z-lain"})"></i>Zona ${esc(z)}</span>`}
function priceHtml(l,cls){
  if(l.price==null||l.price==="")return `<div class="${cls||"price"} ask">Harga: tanya agen</div>`;
  const extra=l.unit==="total"&&l.size&&l.type==="Tanah"?` <small>· ${rupiah(l.price/(l.size/100))}/are</small>`:"";
  return `<div class="${cls||"price"}">${rupiah(l.price)} <small>${UNITS[l.unit]||""}</small>${extra}</div>`;
}
function mediaHtml(l){
  const p=l.photos||[];
  if(p.length)return `<img src="${esc(p[0])}" alt="${esc(l.title)}" loading="lazy">`;
  const w=Math.max(34,Math.min(78,22+Math.sqrt(l.size||100)*.6));
  return `<div class="plot" aria-hidden="true"><div class="shape" style="width:${w}%;aspect-ratio:${l.size>2000?'1.5':'1.15'}"><div><div class="big">${l.size?num(Math.round(l.size)/100)+" are":esc(l.type)}</div><div class="small">${l.size?num(l.size)+" m²":""}</div></div></div></div>`;
}
function opt(list,v){return list.map(x=>{const [val,lab]=Array.isArray(x)?x:[x,x];return `<option value="${esc(val)}" ${String(v??"")===String(val)?"selected":""}>${esc(lab)}</option>`}).join("")}
function note(m){return m?`<div class="note ${m.err?"err":""}" role="status">${esc(m.text)}</div>`:""}
function errMsg(e){
  const m=String(e&&(e.message||e.error_description)||e||"");
  if(/Invalid login credentials/i.test(m))return "Email atau password salah.";
  if(/Email not confirmed/i.test(m))return "Email belum dikonfirmasi. Buka email dari Supabase dan klik tautan konfirmasinya.";
  if(/already registered|already been registered/i.test(m))return "Email ini sudah terdaftar. Silakan masuk, atau pakai Lupa password.";
  if(/Password should be at least/i.test(m))return "Password minimal 8 karakter.";
  if(/rate limit|too many/i.test(m))return "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi.";
  if(/row-level security|permission denied/i.test(m))return "Anda tidak punya izin untuk perubahan ini.";
  if(/Failed to fetch|NetworkError/i.test(m))return "Tidak bisa terhubung ke server. Periksa koneksi internet Anda.";
  return m||"Terjadi kesalahan. Coba lagi.";
}

/* ===== data ===== */
async function load(){
  if(!sb){S.error="Layanan data tidak termuat. Muat ulang halaman.";S.loaded=true;render();return}
  const [a,l]=await Promise.all([
    sb.from('agents').select(AGENT_COLS),
    sb.from('listings').select('*').order('created_at',{ascending:false})
  ]);
  if(a.error||l.error){S.error=errMsg(a.error||l.error)}else{S.agents=a.data||[];S.listings=l.data||[];S.error=""}
  S.loaded=true;
  if(session)me=agentOf(session.user.id)||me;
  render();
}
async function ensureAgent(){
  if(!session){me=null;return}
  const uid=session.user.id;
  let {data}=await sb.from('agents').select(AGENT_COLS).eq('id',uid).maybeSingle();
  if(!data){
    const p=(session.user.user_metadata||{}).profile;
    if(p){
      const row={id:uid,name:p.name,agency:p.agency||null,phone:p.phone,email:session.user.email,prov:p.prov||null,kab:p.kab||null,
        areas:p.areas||null,since:p.since?Number(p.since)||null:null,specialties:p.spec||[],arebi:p.arebi||null,bio:p.bio||null};
      const r=await sb.from('agents').insert(row).select(AGENT_COLS).single();
      data=r.data||null;
    }
  }
  me=data;
}

/* ===== filters & cards ===== */
function filtered(){
  const q=F.q.trim().toLowerCase();
  let r=pubListings().filter(l=>(!F.type||l.type===F.type)&&(!F.status||l.status===F.status)&&(!F.prov||l.prov===F.prov)&&(!F.kab||l.kab===F.kab)&&(!F.agent||l.agent_id===F.agent)
    &&(!q||[l.title,l.place,l.kab,l.prov,l.description,l.cert,l.zone,(agentOf(l.agent_id)||{}).name].join(" ").toLowerCase().includes(q)));
  const p=l=>l.price==null?null:Number(l.price);
  if(F.sort==="new")r.sort((a,b)=>String(b.created_at).localeCompare(String(a.created_at)));
  if(F.sort==="big")r.sort((a,b)=>(b.size||0)-(a.size||0));
  if(F.sort==="small")r.sort((a,b)=>(a.size||0)-(b.size||0));
  if(F.sort==="cheap")r.sort((a,b)=>(p(a)??Infinity)-(p(b)??Infinity));
  if(F.sort==="pricey")r.sort((a,b)=>(p(b)??-1)-(p(a)??-1));
  return r;
}
function card(l){
  const a=agentOf(l.agent_id)||{name:"Agen"};
  return `<a class="card" href="#${esc(l.id)}">
    <div class="media">${mediaHtml(l)}<div class="tags"><span class="tag">${esc(l.type)}</span>${l.status==="Disewakan"?`<span class="tag sewa">Disewakan</span>`:""}</div></div>
    <div class="card-body">
      <h3>${esc(l.title)}</h3>
      <div class="loc">${[l.place,l.kab,l.prov].filter(Boolean).map(esc).join(", ")}</div>
      <div class="specs">${l.size?`<span><b>${num(l.size)}</b> m²</span>`:""}${l.type==="Tanah"&&l.size?`<span><b>${num(Math.round(l.size)/100)}</b> are</span>`:""}${l.cert?`<span><b>${esc(l.cert)}</b></span>`:""}</div>
      ${zoneHtml(l.zone)}${priceHtml(l)}
      <div class="card-foot"><span class="who">${ava(a)}<span>${esc(a.name)}${a.agency?` · ${esc(a.agency)}`:""}</span></span></div>
    </div></a>`;
}

/* ===== views ===== */
function bar(){
  const acct=session?`<a href="#dasbor" class="btn btn-primary btn-sm">Dasbor</a>`:`<a href="#masuk" class="nav-listing">Masuk</a><a href="#daftar" class="btn btn-line btn-sm" style="color:var(--ink)">Daftar agen</a>`;
  return `<header class="bar"><div class="wrap">
    <a class="brand" href="#"><svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true"><rect x="1" y="1" width="24" height="24" rx="5" fill="var(--jade)"/><path d="M5 18 L10 11 L13.5 15 L17 9 L21 18 Z" fill="var(--on-jade)"/></svg>${esc(SITE.name)}</a>
    <nav class="nav"><a href="#" class="nav-listing">Listing</a><a href="#agen">Agen</a>${acct}</nav>
  </div></header>`;
}
function home(){
  const all=pubListings(),list=filtered();
  const provCount=new Set(all.map(l=>l.prov).filter(Boolean)).size,kabCount=new Set(all.map(l=>l.kab).filter(Boolean)).size;
  const typeCounts=TYPES.map(t=>[t,all.filter(l=>l.type===t).length]).filter(x=>x[1]);
  const grid=!S.loaded?`<div class="empty">Memuat listing…</div>`:S.error?`<div class="empty">${esc(S.error)}</div>`
    :list.length?list.map(card).join(""):all.length?`<div class="empty">Belum ada listing yang cocok. Coba hapus beberapa filter.</div>`
    :`<div class="empty">Belum ada listing yang tayang. Agen yang sudah terdaftar bisa memasang listing dari dasbor.</div>`;
  return `<section class="wrap hero">
      <h1>Properti Indonesia, <em>langsung dari agennya.</em></h1>
      <p>${esc(SITE.tagline)}</p>
      <div class="stats"><span><b>${all.length}</b>listing</span><span><b>${pubAgents().length}</b>agen</span><span><b>${provCount}</b>provinsi</span><span><b>${kabCount}</b>kota/kabupaten</span></div>
    </section>
    <section class="wrap tools" aria-label="Cari dan saring">
      <div class="search"><input id="f-q" type="search" placeholder="Cari kota atau lokasi, mis. Jakarta Selatan, Sleman, Canggu…" value="${esc(F.q)}" aria-label="Cari listing"></div>
      <div class="chips" role="group" aria-label="Jenis properti">
        <button class="chip" data-type="" aria-pressed="${!F.type}">Semua<span class="n">${all.length}</span></button>
        ${typeCounts.map(([t,n])=>`<button class="chip" data-type="${t}" aria-pressed="${F.type===t}">${t}<span class="n">${n}</span></button>`).join("")}
      </div>
      <div class="selects">
        <select id="f-status" aria-label="Status"><option value="">Dijual & disewakan</option>${opt(STATUS,F.status)}</select>
        <select id="f-prov" aria-label="Provinsi"><option value="">Semua provinsi</option>${opt(PROVS,F.prov)}</select>
        <select id="f-kab" aria-label="Kota/kabupaten"><option value="">Semua kota/kabupaten</option>${opt(kabsIn(F.prov),F.kab)}</select>
        <select id="f-agent" aria-label="Agen"><option value="">Semua agen</option>${opt(pubAgents().map(a=>[a.id,a.name]),F.agent)}</select>
        <select id="f-sort" aria-label="Urutkan">${opt([["new","Terbaru"],["cheap","Harga terendah"],["pricey","Harga tertinggi"],["big","Luas terbesar"],["small","Luas terkecil"]],F.sort)}</select>
      </div>
    </section>
    <section class="wrap grid" id="results">${grid}</section>
    ${agentsSection()}`;
}
function agentsSection(){
  const ag=pubAgents();
  return `<section class="wrap" id="agen-list"><div class="section-head"><div><div class="label">Tim agen</div><h2>Agen kami</h2></div></div>
    <div class="agents">${ag.length?ag.map(a=>{const n=pubListings().filter(l=>l.agent_id===a.id).length;
      return `<a class="agent" href="#agen-${esc(a.id)}">${ava(a,"lg")}<div><h3>${esc(a.name)}</h3><p>${esc(a.agency||"Agen independen")}</p><p>${esc([a.kab,a.prov].filter(Boolean).join(", "))}</p><p class="mono">${n} listing</p></div></a>`}).join("")
      :`<div class="empty">${S.loaded?"Belum ada agen yang tayang.":"Memuat agen…"}</div>`}</div>
    ${session?"":`<div class="cta-band"><p><b>Anda agen properti?</b> Buat akun, pasang listing Anda di ${esc(SITE.name)}, dan terima calon pembeli langsung ke WhatsApp Anda.</p><a class="btn btn-primary" href="#daftar">Daftar sebagai agen</a></div>`}</section>`;
}
function detail(l){
  const a=agentOf(l.agent_id)||{name:"Agen",phone:""};
  const pics=l.photos||[];
  const rows=[["Jenis",`${esc(l.type)} · ${esc(l.status)}`],["Luas",l.size?`${num(l.size)} m² (${num(Math.round(l.size)/100)} are)`:"—"],["Sertifikat",esc(l.cert)||"—"],
    ["Zonasi",l.zone?zoneHtml(l.zone):"—"],["Lokasi",esc(l.place)||"—"],["Kota/kabupaten",esc(l.kab)||"—"],["Provinsi",esc(l.prov)||"—"],
    ["Harga",l.price==null?"Tanya agen":`${rupiah(l.price)} ${UNITS[l.unit]||""}`]];
  if(l.price&&l.unit==="total"&&l.size)rows.push(["Harga per are",rupiah(l.price/(l.size/100))]);
  const mine=session&&(l.agent_id===session.user.id||(me&&me.is_admin));
  return `<div class="wrap"><a class="back" href="#">← Semua listing</a>
    ${!l.published?`<div class="note err" style="margin-bottom:14px">Listing ini belum tayang. Hanya Anda yang bisa melihatnya.</div>`:""}
    <div class="detail"><div>
        <div class="gallery"><div class="main" id="g-main">${pics.length?`<img src="${esc(pics[0])}" alt="${esc(l.title)}">`:mediaHtml(l)}</div>
          ${pics.length>1?`<div class="thumbs">${pics.map((p,i)=>`<button data-thumb="${i}" aria-current="${i===0}" aria-label="Foto ${i+1}"><img src="${esc(p)}" alt=""></button>`).join("")}</div>`:""}</div>
        <div class="label" style="margin-top:22px">${[l.place,l.kab,l.prov].filter(Boolean).map(esc).join(" · ")}</div>
        <h1 class="d-title">${esc(l.title)}</h1>
        ${priceHtml(l,"d-price")}
        <table class="facts"><tbody>${rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
        ${l.description?`<p class="desc">${esc(l.description)}</p>`:""}
      </div>
      <aside class="side">
        <div class="panel"><div class="label">Agen listing ini</div>
          <a class="who" href="#agen-${esc(a.id)}" style="text-decoration:none">${ava(a,"lg")}<span><b style="font-size:17px">${esc(a.name)}</b><br><span style="color:var(--muted)">${esc(a.agency||"")}</span></span></a>
          ${a.phone?`<a class="btn btn-wa" href="${waLink(a,l)}" target="_blank" rel="noopener">Tanya via WhatsApp</a>
          <div class="phone"><code>${esc(a.phone)}</code><button class="btn btn-line btn-sm" data-copy="${esc(a.phone)}">Salin nomor</button></div>`:""}
        </div>
        <div class="panel"><div class="label">Bagikan listing</div><div class="phone"><button class="btn btn-line btn-sm" data-copy="${esc(BASE+"#"+l.id)}">Salin tautan listing</button></div>
          ${mine?`<button class="btn btn-line btn-sm" data-edit-listing="${esc(l.id)}" style="justify-self:start">Edit listing ini</button>`:""}</div>
      </aside></div></div>`;
}
function agentPage(a){
  const list=pubListings().filter(l=>l.agent_id===a.id);
  return `<div class="wrap"><a class="back" href="#agen">← Semua agen</a>
    <div class="agent-hero">${ava(a,"lg")}<div style="min-width:0"><div class="label">${esc(a.agency||"Agen independen")}</div><h1>${esc(a.name)}</h1><div style="color:var(--muted)">${esc([a.areas,[a.kab,a.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</div></div></div>
    ${a.bio?`<p class="desc" style="margin-top:0">${esc(a.bio)}</p>`:""}
    ${a.phone?`<div class="phone" style="margin-block:16px 26px"><a class="btn btn-wa" href="${waLink(a)}" target="_blank" rel="noopener">WhatsApp ${esc(a.name)}</a><code>${esc(a.phone)}</code><button class="btn btn-line btn-sm" data-copy="${esc(a.phone)}">Salin nomor</button></div>`:""}
    <div class="section-head"><h2>${list.length} listing</h2></div>
    <div class="grid">${list.length?list.map(card).join(""):`<div class="empty">Agen ini belum punya listing yang tayang.</div>`}</div></div>`;
}

/* ===== daftar ===== */
function registerPage(){
  const d=REG.data,er=REG.errors,v=k=>esc(d[k]||""),E=k=>er[k]?`<span class="err-text">${er[k]}</span>`:"";
  const right=REG.done?`<div class="form done">
      <div class="label">Akun dibuat</div><h2 style="font-size:24px">Cek email Anda</h2>
      <p style="margin:0">Kami mengirim tautan konfirmasi ke <b>${esc(d.email)}</b>. Klik tautan itu, lalu masuk ke dasbor. Tidak ada di kotak masuk? Periksa folder Spam atau Promosi.</p>
      <p style="margin:0;color:var(--muted)">Setelah email dikonfirmasi, admin akan meninjau akun Anda. Agar lebih cepat, kabari admin lewat WhatsApp.</p>
      <a class="btn btn-wa" style="justify-self:start" href="https://wa.me/${wa(SITE.adminPhone)}?text=${encodeURIComponent(`Halo admin ${SITE.name}, saya ${d.name} (${d.email}) baru mendaftar sebagai agen. Mohon ditinjau.`)}" target="_blank" rel="noopener">Kabari admin via WhatsApp</a>
      <a class="btn btn-line" style="justify-self:start" href="#masuk">Ke halaman masuk</a></div>`
  :`<form class="form" id="rf" novalidate>
      <div class="label">Buat akun agen</div>
      ${note(REG.msg)}
      <div class="row"><div class="field"><label for="r-email">Email</label><input id="r-email" name="email" type="email" autocomplete="email" value="${v("email")}">${E("email")}</div>
        <div class="field"><label for="r-pass">Password</label><input id="r-pass" name="password" type="password" autocomplete="new-password" minlength="8"><span class="hint">Minimal 8 karakter.</span>${E("password")}</div></div>
      <div class="row"><div class="field"><label for="r-name">Nama lengkap</label><input id="r-name" name="name" autocomplete="name" value="${v("name")}">${E("name")}</div>
        <div class="field"><label for="r-agency">Kantor / agensi</label><input id="r-agency" name="agency" value="${v("agency")}" placeholder="Kosongkan jika independen"></div></div>
      <div class="row"><div class="field"><label for="r-phone">No. WhatsApp</label><input id="r-phone" name="phone" inputmode="tel" autocomplete="tel" value="${v("phone")}" placeholder="0812…">${E("phone")}</div>
        <div class="field"><label for="r-since">Aktif sebagai agen sejak</label><input id="r-since" name="since" inputmode="numeric" maxlength="4" value="${v("since")}" placeholder="2018"></div></div>
      <div class="row"><div class="field"><label for="r-prov">Provinsi</label><select id="r-prov" name="prov">${opt([["","Pilih provinsi"],...PROVS],d.prov||"")}</select>${E("prov")}</div>
        <div class="field"><label for="r-kab">Kota / kabupaten</label><input id="r-kab" name="kab" value="${v("kab")}" placeholder="Surabaya">${E("kab")}</div></div>
      <div class="field"><label for="r-areas">Area spesialis</label><input id="r-areas" name="areas" value="${v("areas")}" placeholder="Citraland, Pakuwon"></div>
      <div class="field"><span class="flabel">Jenis properti yang Anda pasarkan</span>
        <div class="checks">${SPEC.map(s=>`<label><input type="checkbox" name="spec" value="${s}" ${(d.spec||[]).includes(s)?"checked":""}>${s}</label>`).join("")}</div></div>
      <div class="field"><label for="r-arebi">No. anggota AREBI (opsional)</label><input id="r-arebi" name="arebi" value="${v("arebi")}"></div>
      <div class="field"><label for="r-bio">Profil singkat</label><textarea id="r-bio" name="bio" placeholder="Pengalaman, keahlian, bahasa yang dikuasai…">${v("bio")}</textarea></div>
      <label class="agree"><input type="checkbox" id="r-agree" name="agree" ${d.agree?"checked":""}><span>Saya menyatakan data ini benar, dan setiap listing yang saya pasang adalah properti yang berhak saya pasarkan.</span></label>${E("agree")}
      <button class="btn btn-primary" style="justify-self:start" ${REG.busy?"disabled":""}>${REG.busy?"Membuat akun…":"Buat akun"}</button>
      <span class="hint">Sudah punya akun? <a href="#masuk">Masuk di sini</a>.</span>
    </form>`;
  return `<div class="wrap"><a class="back" href="#">← Kembali ke listing</a>
    <div class="reg"><div class="reg-intro">
        <div class="label">Untuk agen properti</div>
        <h1>Daftar sebagai agen <em>${esc(SITE.name)}</em></h1>
        <p>Kelola listing Anda sendiri dari dasbor pribadi. Setiap pertanyaan pembeli langsung masuk ke WhatsApp Anda.</p>
        <ol class="steps">
          <li><div><b>Buat akun</b><span>Isi data diri dan area kerja Anda.</span></div></li>
          <li><div><b>Konfirmasi email</b><span>Klik tautan yang kami kirim ke email Anda.</span></div></li>
          <li><div><b>Persetujuan admin</b><span>Setelah disetujui, profil Anda tayang dan Anda bisa memasang listing.</span></div></li>
        </ol>
        <p class="hint" style="margin-top:22px">Data pemilik, alamat persis, dan harga net yang Anda simpan hanya bisa dilihat oleh Anda dan admin.</p>
      </div>${right}</div></div>`;
}

/* ===== masuk / reset ===== */
function loginPage(){
  return `<div class="wrap narrow"><a class="back" href="#">← Kembali ke listing</a>
    <form class="form" id="lgf" novalidate>
      <div class="label">Area agen</div><h1 style="font-size:30px">Masuk</h1>
      ${note(AUTH.msg)}
      <div class="field"><label for="g-email">Email</label><input id="g-email" name="email" type="email" autocomplete="email" value="${esc(AUTH.email)}" required></div>
      <div class="field"><label for="g-pass">Password</label><input id="g-pass" name="password" type="password" autocomplete="current-password"></div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">
        <button class="btn btn-primary" ${AUTH.busy?"disabled":""}>${AUTH.busy?"Masuk…":"Masuk"}</button>
        <button type="button" class="btn-ghost" data-act="forgot">Lupa password?</button></div>
      <span class="hint">Belum punya akun? <a href="#daftar">Daftar sebagai agen</a>.</span>
    </form></div>`;
}
function resetPage(){
  return `<div class="wrap narrow" style="padding-top:24px"><form class="form" id="rsf" novalidate>
      <div class="label">Atur ulang password</div><h1 style="font-size:28px">Password baru</h1>
      ${note(AUTH.msg)}
      <div class="field"><label for="n-pass">Password baru</label><input id="n-pass" name="password" type="password" autocomplete="new-password" minlength="8"><span class="hint">Minimal 8 karakter.</span></div>
      <button class="btn btn-primary" style="justify-self:start" ${AUTH.busy?"disabled":""}>Simpan password</button>
    </form></div>`;
}

/* ===== dasbor ===== */
function statusPill(s){return `<span class="pill pill-${s}">${s==="approved"?"Disetujui":s==="rejected"?"Ditolak":"Menunggu persetujuan"}</span>`}
function dashboard(){
  if(!session)return loginPage();
  if(!me)return `<div class="wrap narrow"><div class="form" style="margin-top:28px"><div class="label">Dasbor</div>
      <p style="margin:0">Profil agen Anda belum ada. Lengkapi profil untuk melanjutkan.</p>${profileForm(true)}</div></div>`;
  const tabs=[["mine","Listing saya"],["profile","Profil"]];
  if(me.is_admin){const n=S.agents.filter(a=>a.status==="pending").length;tabs.push(["agents",`Agen${n?` (${n} baru)`:""}`],["all","Semua listing"])}
  let body="";
  if(DS.form)body=listingForm();
  else if(DS.tab==="mine")body=myListings();
  else if(DS.tab==="profile")body=profileForm(false);
  else if(DS.tab==="agents"&&me.is_admin)body=adminAgents();
  else if(DS.tab==="all"&&me.is_admin)body=adminListings();
  return `<div class="wrap dash">
    <div class="dash-head">${ava(me,"lg")}<div style="min-width:0;flex:1"><div class="label">Dasbor agen${me.is_admin?" · Admin":""}</div><h1>${esc(me.name)}</h1>${statusPill(me.status)}</div>
      <button class="btn btn-line btn-sm" data-act="logout">Keluar</button></div>
    ${me.status==="pending"?`<div class="note">Akun Anda sedang ditinjau admin. Sambil menunggu, lengkapi profil Anda. Listing bisa dipasang setelah akun disetujui.</div>`:""}
    ${me.status==="rejected"?`<div class="note err">Pendaftaran Anda belum disetujui. Hubungi admin di WhatsApp ${esc(SITE.adminPhone)} untuk informasi lebih lanjut.</div>`:""}
    ${DS.form?"":`<div class="tabs dash-tabs" role="tablist">${tabs.map(([k,t])=>`<button role="tab" aria-selected="${DS.tab===k}" data-dtab="${k}">${t}</button>`).join("")}</div>`}
    ${note(DS.msg)}
    ${body}</div>`;
}
function rowItem(l,showAgent){
  const a=agentOf(l.agent_id)||{};const c=DS.confirm===l.id;
  return `<div class="item">${l.photos&&l.photos[0]?`<img class="thumb" src="${esc(l.photos[0])}" alt="">`:`<span class="thumb"></span>`}
    <div><b>${esc(l.title)}</b><small>${esc([showAgent?a.name:"",l.type,[l.kab,l.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</small>
      <small>${l.published?`<span class="pill pill-approved">Tayang</span>`:`<span class="pill pill-pending">Draf</span>`} ${l.price!=null?rupiah(l.price):"Harga: tanya agen"}</small></div>
    ${c?`<span class="confirm">Hapus listing ini? <button class="btn btn-danger btn-sm" data-del-listing="${esc(l.id)}">Ya, hapus</button><button class="btn btn-line btn-sm" data-act="cancel">Batal</button></span>`
      :`<span class="item-acts"><a class="btn-ghost btn-sm" href="#${esc(l.id)}">Lihat</a><button class="btn btn-line btn-sm" data-edit-listing="${esc(l.id)}">Edit</button><button class="btn-ghost btn-sm" data-ask="${esc(l.id)}">Hapus</button></span>`}</div>`;
}
function myListings(){
  const mine=S.listings.filter(l=>l.agent_id===me.id);
  return `<div class="dash-bar"><span class="label">${mine.length} listing</span>
      <button class="btn btn-primary btn-sm" data-act="new-listing" ${me.status==="approved"?"":"disabled title=\"Menunggu persetujuan admin\""}>Tambah listing</button></div>
    <div class="list">${mine.length?mine.map(l=>rowItem(l,false)).join(""):`<div class="empty">Belum ada listing. ${me.status==="approved"?"Ketuk Tambah listing untuk memasang yang pertama.":"Anda bisa memasang listing setelah akun disetujui."}</div>`}</div>`;
}
function adminListings(){
  return `<div class="dash-bar"><span class="label">${S.listings.length} listing dari semua agen</span></div>
    <div class="list">${S.listings.length?S.listings.map(l=>rowItem(l,true)).join(""):`<div class="empty">Belum ada listing.</div>`}</div>`;
}
function adminAgents(){
  const order={pending:0,approved:1,rejected:2};
  const ag=[...S.agents].sort((a,b)=>order[a.status]-order[b.status]||String(b.created_at).localeCompare(String(a.created_at)));
  return `<div class="list">${ag.map(a=>`<div class="item agent-item">${ava(a)}<div><b>${esc(a.name)} ${a.is_admin?`<span class="pill pill-approved">Admin</span>`:""}</b>
      <small>${esc([a.agency||"Independen",[a.kab,a.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</small>
      <small>WA ${esc(a.phone)}${a.arebi?` · AREBI ${esc(a.arebi)}`:""}${a.since?` · agen sejak ${esc(a.since)}`:""}</small>
      <small>${statusPill(a.status)} ${S.listings.filter(l=>l.agent_id===a.id).length} listing</small></div>
      <span class="item-acts">${a.status!=="approved"?`<button class="btn btn-primary btn-sm" data-agent-status="approved" data-id="${esc(a.id)}">Setujui</button>`:""}
        ${a.status!=="rejected"&&!a.is_admin?`<button class="btn btn-line btn-sm" data-agent-status="rejected" data-id="${esc(a.id)}">${a.status==="approved"?"Nonaktifkan":"Tolak"}</button>`:""}
        <a class="btn-ghost btn-sm" href="https://wa.me/${wa(a.phone)}" target="_blank" rel="noopener">WhatsApp</a></span></div>`).join("")}</div>`;
}
function profileForm(isNew){
  const p=DS.profile||me||{name:"",phone:""};
  return `<form class="form" id="pf" novalidate>
    ${isNew?"":`<div class="label">Profil publik Anda</div>`}
    <div class="row"><div class="field"><label for="p-name">Nama lengkap</label><input id="p-name" name="name" value="${esc(p.name)}" required></div>
      <div class="field"><label for="p-agency">Kantor / agensi</label><input id="p-agency" name="agency" value="${esc(p.agency)}"></div></div>
    <div class="row"><div class="field"><label for="p-phone">No. WhatsApp</label><input id="p-phone" name="phone" inputmode="tel" value="${esc(p.phone)}" required></div>
      <div class="field"><label for="p-since">Agen sejak</label><input id="p-since" name="since" inputmode="numeric" maxlength="4" value="${esc(p.since)}"></div></div>
    <div class="row"><div class="field"><label for="p-prov">Provinsi</label><select id="p-prov" name="prov">${opt([["","Pilih provinsi"],...PROVS],p.prov)}</select></div>
      <div class="field"><label for="p-kab">Kota / kabupaten</label><input id="p-kab" name="kab" value="${esc(p.kab)}"></div></div>
    <div class="field"><label for="p-areas">Area spesialis</label><input id="p-areas" name="areas" value="${esc(p.areas)}"></div>
    <div class="field"><label for="p-arebi">No. anggota AREBI</label><input id="p-arebi" name="arebi" value="${esc(p.arebi)}"></div>
    <div class="field"><label for="p-bio">Profil singkat</label><textarea id="p-bio" name="bio">${esc(p.bio)}</textarea></div>
    <div class="field"><label for="p-photo">Foto profil</label><div class="phone">${ava({name:p.name,photo_url:p.photo_url},"lg")}<input id="p-photo" type="file" accept="image/*"></div></div>
    <button class="btn btn-primary" style="justify-self:start" ${DS.busy?"disabled":""}>${DS.busy?"Menyimpan…":"Simpan profil"}</button>
  </form>`;
}
function blankListing(){return {id:"",agent_id:me.id,title:"",type:"Tanah",status:"Dijual",prov:me.prov||"",kab:me.kab||"",place:"",size:"",price:"",unit:"total",cert:"",zone:"",description:"",photos:[],published:true}}
function listingForm(){
  const f=DS.form,l=f.data,p=f.priv||{};
  const other=me.is_admin&&l.agent_id!==me.id;
  return `<a class="back" href="#dasbor" data-act="close-form">← Kembali ke daftar</a>
  <form class="form" id="lf" novalidate>
    <div class="label">${l.id?"Edit listing":"Listing baru"}${other?` · milik ${esc((agentOf(l.agent_id)||{}).name)}`:""}</div>
    <div class="field"><label for="l-title">Judul</label><input id="l-title" name="title" required maxlength="90" value="${esc(l.title)}" placeholder="Rumah 2 lantai dekat stasiun MRT"></div>
    <div class="row"><div class="field"><label for="l-type">Jenis</label><select id="l-type" name="type">${opt(TYPES,l.type)}</select></div>
      <div class="field"><label for="l-status">Status</label><select id="l-status" name="status">${opt(STATUS,l.status)}</select></div></div>
    <div class="row"><div class="field"><label for="l-prov">Provinsi</label><select id="l-prov" name="prov">${opt([["","Pilih provinsi"],...PROVS],l.prov)}</select></div>
      <div class="field"><label for="l-kab">Kota / kabupaten</label><input id="l-kab" name="kab" value="${esc(l.kab)}" placeholder="Jakarta Selatan"></div></div>
    <div class="field"><label for="l-place">Kecamatan / kelurahan / perumahan</label><input id="l-place" name="place" value="${esc(l.place)}" placeholder="Kebayoran Baru"></div>
    <div class="row"><div class="field"><label for="l-size">Luas (m²)</label><input id="l-size" name="size" inputmode="numeric" value="${esc(l.size??"")}" placeholder="500"><span class="hint" id="h-size"></span></div>
      <div class="field"><label for="l-cert">Sertifikat</label><select id="l-cert" name="cert">${opt([["","—"],...CERTS],l.cert)}</select></div></div>
    <div class="row"><div class="field"><label for="l-price">Harga publik (Rp)</label><input id="l-price" name="price" inputmode="numeric" value="${esc(l.price??"")}" placeholder="Kosongkan = tanya agen"><span class="hint" id="h-price"></span></div>
      <div class="field"><label for="l-unit">Satuan harga</label><select id="l-unit" name="unit">${opt([["total","Total"],["are","Per are"],["tahun","Per tahun (sewa)"]],l.unit)}</select></div></div>
    <div class="field"><label for="l-zone">Zonasi</label><select id="l-zone" name="zone">${opt([["","—"],...Object.keys(ZONES)],l.zone)}</select></div>
    <div class="field"><label for="l-desc">Deskripsi</label><textarea id="l-desc" name="description" placeholder="Akses jalan, view, fasilitas sekitar…">${esc(l.description)}</textarea></div>
    <div class="field"><label for="l-photos">Foto (maks. 6)</label><input id="l-photos" type="file" accept="image/*" multiple ${f.uploading?"disabled":""}>
      <span class="hint">${f.uploading?"Mengunggah foto…":"Foto pertama jadi foto sampul."}</span>
      <div class="pics">${(l.photos||[]).map((u,i)=>`<div class="pic"><img src="${esc(u)}" alt=""><button type="button" data-rmpic="${i}" aria-label="Hapus foto">×</button></div>`).join("")}</div></div>
    <fieldset class="private">
      <legend>Data pribadi <span class="pill pill-pending">Tidak tampil ke publik</span></legend>
      <p class="hint" style="margin:0">Hanya Anda${other?", agen pemilik,":""} dan admin yang bisa melihat data ini.</p>
      <div class="row"><div class="field"><label for="v-owner">Nama pemilik</label><input id="v-owner" name="owner_name" value="${esc(p.owner_name)}"></div>
        <div class="field"><label for="v-ophone">No. pemilik</label><input id="v-ophone" name="owner_phone" inputmode="tel" value="${esc(p.owner_phone)}"></div></div>
      <div class="field"><label for="v-addr">Alamat persis / titik lokasi</label><input id="v-addr" name="exact_address" value="${esc(p.exact_address)}" placeholder="Alamat lengkap atau link Google Maps"></div>
      <div class="row"><div class="field"><label for="v-net">Harga net pemilik (Rp)</label><input id="v-net" name="net_price" inputmode="numeric" value="${esc(p.net_price??"")}"><span class="hint" id="h-net"></span></div><div></div></div>
      <div class="field"><label for="v-notes">Catatan</label><textarea id="v-notes" name="notes" placeholder="Komisi, status dokumen, jadwal survei…">${esc(p.notes)}</textarea></div>
    </fieldset>
    <label class="agree"><input type="checkbox" id="l-pub" name="published" ${l.published?"checked":""}><span>Tayangkan listing ini di website</span></label>
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-primary" ${DS.busy||f.uploading?"disabled":""}>${DS.busy?"Menyimpan…":l.id?"Simpan perubahan":"Simpan listing"}</button>
      <button type="button" class="btn btn-line" data-act="close-form">Batal</button></div>
  </form>`;
}

/* ===== render ===== */
function route(){const h=decodeURIComponent((location.hash||"").slice(1));return /access_token|error_description|type=/.test(h)?"":h}
function footer(){
  return `<footer class="foot"><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(SITE.name)} · Informasi listing dari masing-masing agen.</span>
  <span class="swatches" aria-label="Warna zonasi">${Object.entries(ZONES).map(([z,v])=>`<span class="zone"><i style="background:var(${v})"></i>${z}</span>`).join("")}</span></div></footer>`;
}
function render(){
  const r=route();let main;
  if(recovery)main=resetPage();
  else if(r==="daftar")main=session?dashboard():registerPage();
  else if(r==="masuk")main=session?dashboard():loginPage();
  else if(r==="dasbor")main=dashboard();
  else{
    const l=S.listings.find(x=>x.id===r);const a=r.startsWith("agen-")&&agentOf(r.slice(5));
    if(l&&(l.published||(session&&(l.agent_id===session.user.id||(me&&me.is_admin)))))main=detail(l);
    else if(a&&(a.status==="approved"||(me&&me.is_admin)))main=agentPage(a);
    else main=home();
  }
  app.innerHTML=bar()+`<main>${main}</main>`+footer();
  hints();
  if(r==="agen"){const el=document.getElementById('agen-list');if(el)el.scrollIntoView()}
}
function hints(){
  [["l-size","h-size",v=>`= ${num(v/100)} are`],["l-price","h-price",rupiah],["v-net","h-net",rupiah]].forEach(([i,h,f])=>{
    const a=document.getElementById(i),b=document.getElementById(h);if(a&&b){const v=Number(String(a.value).replace(/\D/g,""));b.textContent=v?f(v):""}});
}
const digits=v=>{const d=String(v||"").replace(/\D/g,"");return d?Number(d):null};
function readForm(form){const o={};new FormData(form).forEach((v,k)=>{if(k in o){o[k]=[].concat(o[k],String(v))}else o[k]=String(v).trim()});return o}
function snapForm(){const f=document.getElementById('lf');if(f&&DS.form){const o=readForm(f);
  ["title","type","status","prov","kab","place","size","price","unit","cert","zone","description"].forEach(k=>DS.form.data[k]=o[k]??DS.form.data[k]);
  DS.form.data.published=!!o.published;
  DS.form.priv=Object.assign(DS.form.priv||{},{owner_name:o.owner_name,owner_phone:o.owner_phone,exact_address:o.exact_address,net_price:o.net_price,notes:o.notes})}}

function shrink(file,max,q){
  return new Promise((res,rej)=>{const url=URL.createObjectURL(file);const img=new Image();img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("Foto tidak bisa dibaca"))};
    img.onload=()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
      c.getContext('2d').drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);c.toBlob(b=>b?res(b):rej(new Error("Foto gagal diproses")),'image/jpeg',q||.8)};img.src=url});
}
async function uploadPhoto(file,prefix,max){
  const blob=await shrink(file,max);
  const path=`${session.user.id}/${prefix}${Date.now()}-${Math.random().toString(36).slice(2,7)}.jpg`;
  const {error}=await sb.storage.from('listing-photos').upload(path,blob,{contentType:'image/jpeg',upsert:false});
  if(error)throw error;
  return sb.storage.from('listing-photos').getPublicUrl(path).data.publicUrl;
}

/* ===== events ===== */
app.addEventListener('click',async e=>{
  const t=e.target.closest('button,a[data-act]');if(!t)return;
  const act=t.dataset.act;
  if(t.classList.contains('chip')){F.type=t.dataset.type;render();return}
  if(t.dataset.thumb!==undefined){const l=S.listings.find(x=>x.id===route());const i=Number(t.dataset.thumb);
    document.getElementById('g-main').innerHTML=`<img src="${esc(l.photos[i])}" alt="${esc(l.title)}">`;
    document.querySelectorAll('[data-thumb]').forEach(b=>b.setAttribute('aria-current',b===t));return}
  if(t.dataset.copy){const v=t.dataset.copy,old=t.textContent;try{await navigator.clipboard.writeText(v);t.textContent="Tersalin"}catch(_){t.textContent="Salin manual: "+v}setTimeout(()=>t.textContent=old,2500);return}
  if(act==="logout"){await sb.auth.signOut();me=null;DS={tab:"mine",form:null,confirm:null,busy:false,msg:null,profile:null};location.hash="";render();return}
  if(act==="forgot"){
    const em=(document.getElementById('g-email')||{}).value||"";AUTH.email=em.trim();
    if(!/^\S+@\S+\.\S+$/.test(AUTH.email)){AUTH.msg={text:"Isi email Anda dulu, lalu ketuk Lupa password.",err:true};render();return}
    AUTH.busy=true;render();
    const {error}=await sb.auth.resetPasswordForEmail(AUTH.email,{redirectTo:BASE});
    AUTH.busy=false;AUTH.msg=error?{text:errMsg(error),err:true}:{text:`Tautan untuk mengatur ulang password sudah dikirim ke ${AUTH.email}.`};render();return}
  if(t.dataset.dtab){DS.tab=t.dataset.dtab;DS.msg=null;DS.confirm=null;DS.profile=null;render();return}
  if(act==="new-listing"){DS.form={data:blankListing(),priv:{}};DS.msg=null;render();window.scrollTo(0,0);return}
  if(act==="close-form"){e.preventDefault();DS.form=null;render();return}
  if(act==="cancel"){DS.confirm=null;render();return}
  if(t.dataset.ask){DS.confirm=t.dataset.ask;render();return}
  if(t.dataset.editListing){
    const l=S.listings.find(x=>x.id===t.dataset.editListing);if(!l)return;
    const {data}=await sb.from('listing_private').select('*').eq('listing_id',l.id).maybeSingle();
    DS.form={data:JSON.parse(JSON.stringify(l)),priv:data||{}};DS.msg=null;
    if(route()!=="dasbor")location.hash="dasbor";else render();window.scrollTo(0,0);return}
  if(t.dataset.delListing){
    const {error}=await sb.from('listings').delete().eq('id',t.dataset.delListing);
    DS.confirm=null;DS.msg=error?{text:errMsg(error),err:true}:{text:"Listing dihapus."};await load();return}
  if(t.dataset.rmpic!==undefined){snapForm();DS.form.data.photos.splice(Number(t.dataset.rmpic),1);render();return}
  if(t.dataset.agentStatus){
    const {error}=await sb.from('agents').update({status:t.dataset.agentStatus}).eq('id',t.dataset.id);
    DS.msg=error?{text:errMsg(error),err:true}:{text:t.dataset.agentStatus==="approved"?"Agen disetujui. Profilnya sekarang tayang.":"Status agen diperbarui."};await load();return}
});
app.addEventListener('input',e=>{
  const id=e.target.id;
  if(id==="f-q"){F.q=e.target.value;const r=document.getElementById('results');const list=filtered();
    r.innerHTML=list.length?list.map(card).join(""):`<div class="empty">Belum ada listing yang cocok. Coba kata lain atau hapus filter.</div>`;return}
  if(/^(l-size|l-price|v-net)$/.test(id))hints();
});
app.addEventListener('change',async e=>{
  const id=e.target.id;
  if(id==="f-prov"){F.prov=e.target.value;F.kab="";render();return}
  const map={"f-status":"status","f-kab":"kab","f-agent":"agent","f-sort":"sort"};
  if(map[id]){F[map[id]]=e.target.value;render();return}
  if(id==="l-photos"){
    snapForm();const files=[...e.target.files].slice(0,6-(DS.form.data.photos||[]).length);if(!files.length)return;
    DS.form.uploading=true;render();
    for(const f of files){try{DS.form.data.photos.push(await uploadPhoto(f,"l-",1600))}catch(err){DS.msg={text:"Satu foto gagal diunggah: "+errMsg(err),err:true}}}
    DS.form.uploading=false;render();return}
  if(id==="p-photo"){
    const f=e.target.files[0];if(!f)return;const pf=document.getElementById('pf');DS.profile=Object.assign({},me||{},readForm(pf));
    DS.busy=true;render();
    try{DS.profile.photo_url=await uploadPhoto(f,"avatar-",400)}catch(err){DS.msg={text:"Foto gagal diunggah: "+errMsg(err),err:true}}
    DS.busy=false;render();return}
});
app.addEventListener('submit',async e=>{
  e.preventDefault();const form=e.target;
  if(form.id==="rf"){
    const o=readForm(form);o.spec=[].concat(o.spec||[]);o.agree=!!o.agree;const er={};
    if(!/^\S+@\S+\.\S+$/.test(o.email||""))er.email="Isi alamat email yang valid.";
    if((o.password||"").length<8)er.password="Password minimal 8 karakter.";
    if(!o.name)er.name="Isi nama lengkap Anda.";
    if(String(o.phone||"").replace(/\D/g,"").length<9)er.phone="Isi nomor WhatsApp yang aktif.";
    if(!o.prov)er.prov="Pilih provinsi.";
    if(!o.kab)er.kab="Isi kota atau kabupaten.";
    if(!o.agree)er.agree="Centang pernyataan ini untuk melanjutkan.";
    const pw=o.password;delete o.password;REG.data=o;REG.errors=er;REG.msg=null;
    if(Object.keys(er).length){render();const f=document.querySelector('.err-text');if(f)f.scrollIntoView({block:"center"});return}
    REG.busy=true;render();
    const profile={name:o.name,agency:o.agency,phone:o.phone,prov:o.prov,kab:o.kab,areas:o.areas,since:o.since,spec:o.spec,arebi:o.arebi,bio:o.bio};
    const {data,error}=await sb.auth.signUp({email:o.email,password:pw,options:{data:{profile},emailRedirectTo:BASE}});
    REG.busy=false;
    if(error){REG.msg={text:errMsg(error),err:true};render();return}
    if(data.session){session=data.session;await ensureAgent();await load();location.hash="dasbor";return}
    if(data.user&&Array.isArray(data.user.identities)&&!data.user.identities.length){REG.msg={text:"Email ini sudah terdaftar. Silakan masuk, atau pakai Lupa password.",err:true};render();return}
    REG.done=true;render();window.scrollTo(0,0);return;
  }
  if(form.id==="lgf"){
    const o=readForm(form);AUTH.email=o.email;AUTH.busy=true;AUTH.msg=null;render();
    const {error}=await sb.auth.signInWithPassword({email:o.email,password:o.password||""});
    AUTH.busy=false;
    if(error){AUTH.msg={text:errMsg(error),err:true};render();return}
    location.hash="dasbor";return;
  }
  if(form.id==="rsf"){
    const o=readForm(form);if((o.password||"").length<8){AUTH.msg={text:"Password minimal 8 karakter.",err:true};render();return}
    AUTH.busy=true;render();const {error}=await sb.auth.updateUser({password:o.password});AUTH.busy=false;
    if(error){AUTH.msg={text:errMsg(error),err:true};render();return}
    recovery=false;AUTH.msg=null;DS.msg={text:"Password baru tersimpan."};location.hash="dasbor";render();return;
  }
  if(form.id==="pf"){
    const o=readForm(form);
    if(!o.name||String(o.phone).replace(/\D/g,"").length<9){DS.msg={text:"Nama dan nomor WhatsApp wajib diisi.",err:true};render();return}
    const row={name:o.name,agency:o.agency||null,phone:o.phone,prov:o.prov||null,kab:o.kab||null,areas:o.areas||null,since:digits(o.since),arebi:o.arebi||null,bio:o.bio||null,
      photo_url:(DS.profile&&DS.profile.photo_url)||(me&&me.photo_url)||null};
    DS.busy=true;render();
    const q=me?sb.from('agents').update(row).eq('id',me.id):sb.from('agents').insert({...row,id:session.user.id,email:session.user.email});
    const {error}=await q;DS.busy=false;
    if(error){DS.msg={text:errMsg(error),err:true};render();return}
    DS.profile=null;DS.msg={text:"Profil tersimpan."};await ensureAgent();await load();return;
  }
  if(form.id==="lf"){
    snapForm();const d=DS.form.data,p=DS.form.priv||{};
    if(!d.title){DS.msg={text:"Isi judul listing.",err:true};render();return}
    if(!d.prov||!d.kab){DS.msg={text:"Pilih provinsi dan isi kota/kabupaten.",err:true};render();return}
    const row={title:d.title,type:d.type,status:d.status,prov:d.prov,kab:d.kab,place:d.place||null,size:digits(d.size),price:digits(d.price),unit:d.unit,
      cert:d.cert||null,zone:d.zone||null,description:d.description||null,photos:d.photos||[],published:!!d.published};
    DS.busy=true;DS.msg=null;render();
    let id=d.id,error;
    if(id)({error}=await sb.from('listings').update(row).eq('id',id));
    else{const r=await sb.from('listings').insert(row).select('id').single();error=r.error;id=r.data&&r.data.id}
    if(!error){
      const pv={listing_id:id,agent_id:d.agent_id||me.id,owner_name:p.owner_name||null,owner_phone:p.owner_phone||null,exact_address:p.exact_address||null,net_price:digits(p.net_price),notes:p.notes||null};
      ({error}=await sb.from('listing_private').upsert(pv,{onConflict:'listing_id'}));
    }
    DS.busy=false;
    if(error){DS.msg={text:errMsg(error),err:true};render();return}
    DS.form=null;DS.msg={text:row.published?"Listing tersimpan dan tayang.":"Listing tersimpan sebagai draf."};await load();window.scrollTo(0,0);return;
  }
});
window.addEventListener('hashchange',()=>{if(route()!=="dasbor")DS.form=null;REG.done=REG.done&&route()==="daftar";render();window.scrollTo(0,0)});

/* ===== start ===== */
render();
if(sb){
  sb.auth.onAuthStateChange((ev,s)=>{
    session=s;
    if(ev==="PASSWORD_RECOVERY")recovery=true;
    setTimeout(async()=>{await ensureAgent();await load();
      if(FROM_LINK&&ev==="SIGNED_IN"&&s&&!recovery&&route()!=="dasbor")location.hash="dasbor"},0);
  });
  load();
}else{S.loaded=true;S.error="Layanan data tidak termuat. Muat ulang halaman.";render()}
})();
