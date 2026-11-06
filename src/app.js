(function(){
/* ===== konfigurasi ===== */
const SB_URL="https://mpyspcofrekhnbkxzucr.supabase.co";
const SB_KEY="sb_publishable_cFs5F-kTzR39URtsdFKhGg_mXN7cObN";
const SITE={name:"Nusantara Property",adminPhone:"0812868080",
  tagline:"Jual beli tanah, rumah, villa, dan properti komersial di Bali dan seluruh Indonesia, langsung dari agen properti terverifikasi. Hubungi agennya lewat WhatsApp."};
const TYPES=["Tanah","Rumah","Villa","Apartemen","Ruko","Gudang","Komersial"];
const STATUS=["Dijual","Disewakan"];
const PROVS=["Aceh","Sumatera Utara","Sumatera Barat","Riau","Kepulauan Riau","Jambi","Sumatera Selatan","Kepulauan Bangka Belitung","Bengkulu","Lampung","DKI Jakarta","Jawa Barat","Banten","Jawa Tengah","DI Yogyakarta","Jawa Timur","Bali","Nusa Tenggara Barat","Nusa Tenggara Timur","Kalimantan Barat","Kalimantan Tengah","Kalimantan Selatan","Kalimantan Timur","Kalimantan Utara","Sulawesi Utara","Gorontalo","Sulawesi Tengah","Sulawesi Barat","Sulawesi Selatan","Sulawesi Tenggara","Maluku","Maluku Utara","Papua","Papua Barat","Papua Barat Daya","Papua Tengah","Papua Pegunungan","Papua Selatan"];
const CERTS=["SHM","SHGB","Hak Pakai","Leasehold"];
const ZONES={"Pariwisata":"--z-pariwisata","Permukiman":"--z-permukiman","Pertanian":"--z-pertanian","Perdagangan & Jasa":"--z-dagang"};
const UNITS={total:"",are:"/ are",m2:"/ m²",tahun:"/ tahun",are_tahun:"/ are / tahun"};
const FACING=["Utara","Timur Laut","Timur","Tenggara","Selatan","Barat Daya","Barat","Barat Laut"];
const ROOM_TYPES=["Rumah","Villa","Apartemen","Ruko"];
const hasBuilding=t=>t&&t!=="Tanah";
const SPEC=["Tanah","Rumah","Villa","Apartemen","Ruko","Gudang","Komersial","Sewa"];
const AGENT_COLS="id,name,agency,phone,prov,kab,areas,since,specialties,arebi,bio,photo_url,status,is_admin,created_at";
const BASE=location.origin+location.pathname;
const MAX_PHOTOS=5;
const FROM_LINK=/access_token/.test(location.hash)&&!/type=recovery/.test(location.hash);

const I=window.NP_I18N||{lang:"id",locale:"id-ID",t:x=>x,translate(){},set(){}};
const T=x=>I.t(x);
const TT=x=>I.title?I.title(x):x;
const mt=x=>EN()?` data-mt="${esc(x)}" data-noi18n`:"";
const EN=()=>I.lang==="en";
const app=document.getElementById('app');
let sb=null;
try{sb=window.supabase.createClient(SB_URL,SB_KEY)}catch(e){}

/* ===== state ===== */
let S={agents:[],listings:[],idx:new Map(),loaded:false,error:"",facets:[],live:0,home:[],mine:[],totalAll:null,noTotal:false,
  page:{items:[],total:0,loading:false,done:false,key:null},all:{items:[],total:0,loading:false,done:false,started:false},byAgent:{},missing:{},fetching:{}};
const PAGE=24,ALL_PAGE=50;
let session=null,me=null,recovery=false;
const F={q:"",type:"",status:"",prov:"",kab:"",agent:"",sort:"new",budget:"",bed:"",facing:""};
const BUDGETS=[["0-500000000","Di bawah Rp500 jt"],["500000000-1000000000","Rp500 jt – 1 M"],["1000000000-2000000000","Rp1 – 2 M"],["2000000000-5000000000","Rp2 – 5 M"],["5000000000-10000000000","Rp5 – 10 M"],["10000000000-","Di atas Rp10 M"]];
function totalPrice(l){if(l.price==null||l.price==="")return null;const v=Number(l.price);return (l.unit==="are"||l.unit==="are_tahun")&&l.size?v*l.size/100:l.unit==="m2"&&l.size?v*l.size:v}
const REG={data:{},errors:{},done:false,busy:false,msg:null};
const AUTH={busy:false,msg:null,email:""};
let DS={tab:"mine",form:null,confirm:null,busy:false,msg:null,profile:null};

/* ===== helpers ===== */
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const num=n=>Number(n).toLocaleString(I.locale);
const agentOf=id=>S.agents.find(a=>a.id===id);
const initials=n=>String(n||"?").trim().split(/\s+/).slice(0,2).map(w=>w[0]).join("").toUpperCase();
const pubAgents=()=>S.agents.filter(a=>a.status==="approved");
const EXPIRE_DAYS=60,WARN_DAYS=7,SOLD_DAYS=7;
const DAY=86400000;
const fmtD=d=>d?new Date(d).toLocaleDateString(I.locale,{day:"numeric",month:"short",year:"numeric"}):"";
const daysLeft=l=>EXPIRE_DAYS-Math.floor((Date.now()-new Date(l.updated_at||l.created_at).getTime())/DAY);
const isSold=l=>!!(l&&l.sold_at);
const isLive=l=>l.published&&!isSold(l)&&daysLeft(l)>0;
const needsRenew=l=>l.published&&!isSold(l)&&daysLeft(l)<=WARN_DAYS;
const soldLeft=l=>Math.max(0,SOLD_DAYS-Math.floor((Date.now()-new Date(l.sold_at).getTime())/DAY));
const soldWord=l=>l.status==="Disewakan"?"Tersewa":"Terjual";
const getL=id=>S.idx.get(id);
function merge(rows){(rows||[]).forEach(r=>{if(S.idx.has(r.id)){const i=S.listings.findIndex(x=>x.id===r.id);if(i>=0)S.listings[i]=r}else S.listings.push(r);S.idx.set(r.id,r)});return rows||[]}
const kabsIn=p=>[...new Set(S.facets.filter(l=>!p||l.prov===p).map(l=>l.kab).filter(Boolean))].sort();
const cutoff=()=>new Date(Date.now()-EXPIRE_DAYS*DAY).toISOString();
const approvedIds=()=>{const ids=S.agents.filter(a=>a.status==="approved").map(a=>a.id);return ids.length?ids:["00000000-0000-0000-0000-000000000000"]};
const liveQ=(cols,opts)=>{let q=sb.from('listings').select(cols,opts).eq('published',true).gte('updated_at',cutoff()).in('agent_id',approvedIds());if(!S.noSold)q=q.is('sold_at',null);return q};
function rupiah(v){
  if(v==null||v==="")return "";v=Number(v);
  const L=I.locale,e=EN();
  if(v>=1e12)return "Rp "+(v/1e12).toLocaleString(L,{maximumFractionDigits:2})+" T";
  if(v>=1e9)return "Rp "+(v/1e9).toLocaleString(L,{maximumFractionDigits:2})+(e?" B":" M");
  if(v>=1e6)return "Rp "+(v/1e6).toLocaleString(L,{maximumFractionDigits:1})+(e?" M":" jt");
  return "Rp "+num(v);
}
function wa(p){let d=String(p||"").replace(/\D/g,"");if(d.startsWith("0"))d="62"+d.slice(1);return d}
function waLink(a,l){
  const t=EN()?(l?`Hello ${a.name}, I'm interested in your listing "${l.title}" (${l.place||l.kab}) on ${SITE.name}. Could you share more details?`:`Hello ${a.name}, I found you on ${SITE.name}.`)
    :l?`Halo ${a.name}, saya tertarik dengan listing "${l.title}" (${l.place||l.kab}) di ${SITE.name}. Boleh minta info detail?`:`Halo ${a.name}, saya menemukan Anda di ${SITE.name}.`;
  return `https://wa.me/${wa(a.phone)}?text=${encodeURIComponent(t)}`;
}
function ava(a,cls){return `<span class="ava ${cls||""}">${a&&a.photo_url?`<img src="${esc(a.photo_url)}" alt="">`:esc(initials(a&&a.name))}</span>`}
function zoneHtml(z){if(!z)return "";return `<span class="zone"><i style="background:var(${ZONES[z]||"--z-lain"})"></i>Zona ${esc(z)}</span>`}
function priceHtml(l,cls){
  if(l.price==null||l.price==="")return `<div class="${cls||"price"} ask">Harga: tanya agen</div>`;
  const extra=l.unit==="total"&&l.size&&l.type==="Tanah"?` <small>· ${rupiah(l.price/(l.size/100))}/are</small>`:"";
  return `<div class="${cls||"price"}">${rupiah(l.price)} <small>${UNITS[l.unit]||""}</small>${extra}</div>`;
}
const WM_OV=`<span class="wm-ov" aria-hidden="true"><img src="/assets/np-mark-light.png" alt="">Nusantara Property</span>`;
const wmOv=u=>u&&!/\/lw-/.test(u)?WM_OV:"";
function mediaHtml(l){
  const p=l.photos||[];
  if(p.length)return `<img src="${esc(p[0])}" alt="${esc(l.title)}" loading="lazy">${wmOv(p[0])}`;
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
// Listing terjual/tersewa dihapus permanen SOLD_DAYS hari setelah ditandai.
// Utamanya dikerjakan server (pg_cron, schema.sql bagian 12); ini cadangan saat agen/admin membuka dasbor.
async function purgeSold(){
  try{
    let q=sb.from('listings').delete().not('sold_at','is',null).lt('sold_at',new Date(Date.now()-SOLD_DAYS*DAY).toISOString());
    if(!me.is_admin)q=q.eq('agent_id',me.id);
    await q;
    if(me.is_admin){
      const t=await sb.from('photo_trash').select('path').limit(500);
      const paths=(t.data||[]).map(r=>r.path);
      if(paths.length){const {error}=await sb.storage.from('listing-photos').remove(paths);if(!error)await sb.from('photo_trash').delete().in('path',paths)}
    }
  }catch(e){}
}
async function load(){
  if(!sb){S.error="Layanan data tidak termuat. Muat ulang halaman.";S.loaded=true;render();return}
  if(S.noSold==null){const pr=await sb.from('listings').select('sold_at').limit(1);S.noSold=!!(pr.error&&/sold_at/.test(pr.error.message||""))}
  const a=await sb.from('agents').select(AGENT_COLS);
  if(a.error){S.error=errMsg(a.error);S.loaded=true;render();return}
  S.agents=a.data||[];
  if(session)me=agentOf(session.user.id)||me;
  if(me&&!S.noSold)await purgeSold();
  const jobs=[liveQ('type,status,prov,kab,agent_id').limit(1000),liveQ('id',{count:'exact',head:true}),liveQ('*').order('created_at',{ascending:false}).limit(6),
    me?sb.from('listings').select('*').eq('agent_id',me.id).order('created_at',{ascending:false}).limit(1000):null,
    me&&me.is_admin?sb.from('listings').select('id',{count:'exact',head:true}):null];
  const [f,c,h,m,t]=await Promise.all(jobs);
  const bad=[f,c,h,m,t].find(x=>x&&x.error);
  S.error=bad?errMsg(bad.error):"";
  S.facets=(f&&f.data)||[];S.live=(c&&c.count)??S.facets.length;S.home=merge(h&&h.data);S.mine=m?merge(m.data):[];S.totalAll=t?t.count:null;
  S.loaded=true;S.page.key=null;S.all={items:[],total:0,loading:false,done:false,started:false};S.byAgent={};S.missing={};
  render();
}
function fkey(){return JSON.stringify([F.q.trim(),F.type,F.status,F.prov,F.kab,F.agent,F.sort,F.budget,F.bed,F.facing])}
async function fetchPage(reset){
  const P=S.page,key=fkey();
  if(P.loading&&!reset)return;
  if(reset){P.items=[];P.total=0;P.done=false;P.key=key}
  P.loading=true;const tok=P.tok=(P.tok||0)+1;
  if(reset)paintResults();
  const tp=S.noTotal?'price':'total_price',from=P.items.length;
  let q=liveQ('*',{count:'exact'});
  if(F.type)q=q.eq('type',F.type);if(F.status)q=q.eq('status',F.status);if(F.prov)q=q.eq('prov',F.prov);if(F.kab)q=q.eq('kab',F.kab);
  if(F.agent)q=q.eq('agent_id',F.agent);if(F.facing)q=q.ilike('facing',`%${F.facing}%`);if(F.bed)q=q.gte('bedrooms',Number(F.bed));
  if(F.budget){const [mn,mx]=F.budget.split("-").map(x=>x===""?null:Number(x));q=q.gte(tp,mn);if(mx!=null)q=q.lte(tp,mx)}
  const qq=F.q.trim().replace(/[,()%*"\\]/g," ").replace(/\s+/g," ").trim();
  if(qq)q=q.or(["title","place","kab","prov","description"].map(c=>`${c}.ilike."*${qq}*"`).join(","));
  if(F.sort==="cheap")q=q.order(tp,{ascending:true,nullsFirst:false});
  else if(F.sort==="pricey")q=q.order(tp,{ascending:false,nullsFirst:false});
  else if(F.sort==="big")q=q.order('size',{ascending:false,nullsFirst:false});
  else if(F.sort==="small")q=q.order('size',{ascending:true,nullsFirst:false});
  q=q.order('created_at',{ascending:false}).range(from,from+PAGE-1);
  const {data,error,count}=await q;
  if(tok!==P.tok)return;
  P.loading=false;
  if(error){
    if(!S.noTotal&&/total_price/.test(error.message||"")){S.noTotal=true;return fetchPage(true)}
    S.error=errMsg(error);paintResults();return}
  P.items=P.items.concat(merge(data));P.total=count??P.items.length;P.done=P.items.length>=P.total||(data||[]).length<PAGE;
  paintResults();
}
async function fetchAll(more){
  const A=S.all;if(A.loading||(A.done&&more))return;
  A.loading=true;A.started=true;
  const from=A.items.length;
  const {data,error,count}=await sb.from('listings').select('*',{count:'exact'}).order('created_at',{ascending:false}).range(from,from+ALL_PAGE-1);
  A.loading=false;
  if(error){DS.msg={text:errMsg(error),err:true};render();return}
  A.items=A.items.concat(merge(data));A.total=count??A.items.length;A.done=A.items.length>=A.total;
  render();
}
async function fetchOne(id){
  if(S.fetching[id])return;S.fetching[id]=1;
  const {data}=await sb.from('listings').select('*').eq('id',id).maybeSingle();
  delete S.fetching[id];
  if(data)merge([data]);else S.missing[id]=1;
  render();
}
async function fetchAgentListings(id){
  if(S.fetching["a"+id])return;S.fetching["a"+id]=1;
  const {data}=await liveQ('*').eq('agent_id',id).order('created_at',{ascending:false}).limit(120);
  delete S.fetching["a"+id];S.byAgent[id]=merge(data);render();
}
function ensureRoute(){
  if(!sb||!S.loaded)return;
  const r=route();
  if(r==="listing"&&S.page.key!==fkey())fetchPage(true);
  else if(r.startsWith("agen-")&&!S.byAgent[r.slice(5)]&&agentOf(r.slice(5)))fetchAgentListings(r.slice(5));
  else if(/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(r)&&!getL(r)&&!S.missing[r])fetchOne(r);
  else if(r==="dasbor"&&me&&me.is_admin&&DS.tab==="all"&&!S.all.started)fetchAll(false);
}
function resultsHtml(){
  const P=S.page;
  if(!S.loaded||(P.loading&&!P.items.length))return `<div class="empty">Memuat listing…</div>`;
  if(S.error&&!P.items.length)return `<div class="empty">${esc(S.error)}</div>`;
  if(!P.items.length)return S.live?`<div class="empty">Belum ada listing yang cocok. Coba hapus beberapa filter.</div>`:`<div class="empty">Belum ada listing yang tayang. Agen yang sudah terdaftar bisa memasang listing dari dasbor.</div>`;
  return P.items.map(card).join("");
}
function moreHtml(){
  const P=S.page;if(!P.items.length)return "";
  return `<p class="hint res-count">${resCount(P.items.length,P.total)}</p>${P.done?"":`<button class="btn btn-line" data-act="more" ${P.loading?"disabled":""}>${P.loading?"Memuat…":"Muat lebih banyak"}</button>`}`;
}
function resCount(n,t){return EN()?`Showing ${n} of ${t} listings`:`Menampilkan ${n} dari ${t} listing`}
function paintResults(){
  const r=document.getElementById('results'),m=document.getElementById('more');
  if(!r||!m){render();return}
  r.innerHTML=resultsHtml();m.innerHTML=moreHtml();I.translate(r);I.translate(m);if(I.upgrade)I.upgrade(r);fillViews();
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

/* ===== cards ===== */
/* ===== bagikan link iklan ===== */
const SHARE_IC=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4"/></svg>`;
const LINK_IC=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.1 0l3-3a5 5 0 0 0-7.1-7.1l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.1 0l-3 3a5 5 0 0 0 7.1 7.1l1.7-1.7"/></svg>`;
const listingUrl=l=>`${location.origin}/#${l.id}`;
async function copyText(txt){
  try{await navigator.clipboard.writeText(txt);return true}catch(e){}
  try{const ta=document.createElement('textarea');ta.value=txt;ta.setAttribute('readonly','');ta.style.cssText='position:fixed;top:0;left:0;opacity:0';document.body.appendChild(ta);ta.select();ta.setSelectionRange(0,txt.length);const ok=document.execCommand('copy');ta.remove();return ok}catch(e){return false}
}
function flash(btn,txt){const sp=btn.querySelector('span');if(!sp)return;const old=sp.textContent;sp.textContent=T(txt);btn.classList.add('is-done');setTimeout(()=>{sp.textContent=old;btn.classList.remove('is-done')},2200)}
async function shareListing(l,btn,copyOnly){
  const url=listingUrl(l),title=TT(l.title),price=l.price!=null&&l.price!==""?`${rupiah(l.price)} ${UNITS[l.unit]||""}`.trim():"";
  const text=[title,[l.place,l.kab,l.prov].filter(Boolean).join(", "),price].filter(Boolean).join("\n");
  if(!copyOnly&&navigator.share){try{await navigator.share({title,text,url});return}catch(e){if(e&&e.name==="AbortError")return}}
  const ok=await copyText(url);
  flash(btn,ok?"Link tersalin":"Gagal menyalin");
}

/* ===== jumlah dilihat ===== */
const EYE=`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>`;
const VIEWS={},VQ=new Set();let noViews=false,vTimer=null;
function vw(l,long){const n=VIEWS[l.id];return `<span class="views" data-vid="${esc(l.id)}"${long?' data-long="1"':""}${n==null?" hidden":""}>${EYE}<span>${n==null?"":viewTxt(n,long)}</span></span>`}
const viewTxt=(n,long)=>long?`${num(n)} kali dilihat`:num(n);
function paintViews(){document.querySelectorAll('[data-vid]').forEach(el=>{const n=VIEWS[el.dataset.vid];if(n==null)return;el.hidden=false;el.lastElementChild.textContent=viewTxt(n,!!el.dataset.long);I.translate(el)})}
function fillViews(){
  if(noViews||!sb)return;
  document.querySelectorAll('[data-vid]').forEach(el=>{if(VIEWS[el.dataset.vid]==null)VQ.add(el.dataset.vid)});
  if(!VQ.size)return;clearTimeout(vTimer);
  vTimer=setTimeout(async()=>{const ids=[...VQ];VQ.clear();
    for(let i=0;i<ids.length;i+=100){const part=ids.slice(i,i+100);
      const {data,error}=await sb.from('listing_views').select('listing_id,views').in('listing_id',part);
      if(error){noViews=true;return}
      part.forEach(id=>VIEWS[id]=0);(data||[]).forEach(r=>VIEWS[r.listing_id]=Number(r.views)||0)}
    paintViews()},60);
}
async function countView(l){
  if(noViews||!sb||!l||(session&&l.agent_id===session.user.id))return;
  const k="np-seen-"+l.id;
  try{const t=Number(localStorage.getItem(k)||0);if(Date.now()-t<12*3600*1000)return;localStorage.setItem(k,String(Date.now()))}catch(e){}
  const {data,error}=await sb.rpc('add_listing_view',{lid:l.id});
  if(error){if(/add_listing_view|listing_views/.test(error.message||""))noViews=true;return}
  if(data!=null){VIEWS[l.id]=Number(data);paintViews()}
}
function card(l){
  const a=agentOf(l.agent_id)||{name:"Agen"};
  return `<a class="card" href="#${esc(l.id)}">
    <div class="media">${mediaHtml(l)}<div class="tags"><span class="tag">${esc(l.type)}</span>${l.status==="Disewakan"?`<span class="tag sewa">Disewakan</span>`:""}</div></div>
    <div class="card-body">
      <h3${mt(l.title)}>${esc(TT(l.title))}</h3>
      <div class="loc">${[l.place,l.kab,l.prov].filter(Boolean).map(esc).join(", ")}</div>
      <div class="specs">${hasBuilding(l.type)
        ?`${l.size?`<span>LT <b>${num(l.size)}</b> m²</span>`:""}${l.building_size?`<span>LB <b>${num(l.building_size)}</b> m²</span>`:""}${l.bedrooms!=null?`<span><b>${l.bedrooms}</b> KT</span>`:""}${l.bathrooms!=null?`<span><b>${l.bathrooms}</b> KM</span>`:""}`
        :`${l.size?`<span><b>${num(l.size)}</b> m²</span><span><b>${num(Math.round(l.size)/100)}</b> are</span>`:""}`}${l.cert?`<span><b>${esc(l.cert)}</b></span>`:""}${l.facing?`<span>Hadap <b>${esc(l.facing)}</b></span>`:""}</div>
      ${zoneHtml(l.zone)}${priceHtml(l)}
      <div class="card-date"><span>${l.updated_at&&new Date(l.updated_at)-new Date(l.created_at)>DAY?"Diperbarui":"Tayang"} ${fmtD(l.updated_at||l.created_at)}</span>${vw(l)}</div>
      <div class="card-foot"><span class="who">${ava(a)}<span>${esc(a.name)}${a.agency?` · ${esc(a.agency)}`:""}</span></span></div>
    </div></a>`;
}

/* ===== views ===== */
const NAV=[["","Beranda"],["listing","Listing"],["berita","Berita"],["panduan","Panduan"],["tentang","Tentang kami"],["faq","FAQ"]];
let MENU=false;
function bar(){
  const r=route();
  const cur=k=>(k===r||(k==="listing"&&S.idx.has(r)))?' aria-current="page"':"";
  const links=NAV.map(([k,t])=>`<a href="#${k}"${cur(k)}>${t}</a>`).join("");
  const acct=session?`<a href="#dasbor" class="btn btn-primary btn-sm">Dasbor</a>`:`<a href="#masuk" class="nav-login">Masuk</a><a href="#daftar" class="btn btn-line btn-sm" style="color:var(--ink)">Daftar agen</a>`;
  return `<header class="bar"><div class="wrap">
    <a class="brand" href="#"><picture><source srcset="/assets/np-mark-light.png?v=2" media="(prefers-color-scheme: dark)"><img class="brand-mark" src="/assets/np-mark.png?v=2" alt="" width="30" height="30"></picture>${esc(SITE.name)}</a>
    <nav class="mainnav" aria-label="Menu utama">${links}</nav>
    <div class="nav"><div class="lang" role="group" aria-label="Bahasa"><button data-lang="id" aria-pressed="${!EN()}">ID</button><button data-lang="en" aria-pressed="${EN()}">EN</button></div>${acct}<button class="menu-btn" data-act="menu" aria-expanded="${MENU}" aria-controls="mnav" aria-label="Menu"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">${MENU?'<path d="M6 6l12 12M18 6L6 18"/>':'<path d="M4 7h16M4 12h16M4 17h16"/>'}</svg></button></div>
  </div>
  <nav class="mnav" id="mnav" ${MENU?"":"hidden"} aria-label="Menu utama"><div class="wrap">${links}${session?`<a href="#dasbor">Dasbor</a>`:`<a href="#masuk">Masuk</a><a href="#daftar">Daftar agen</a>`}</div></nav>
  </header>`;
}
function home(){
  const P=window.NP_PAGES;const all=S.facets;const latest=S.home;
  const provCount=new Set(all.map(l=>l.prov).filter(Boolean)).size,kabCount=new Set(all.map(l=>l.kab).filter(Boolean)).size;
  const typeCounts=TYPES.map(t=>[t,all.filter(l=>l.type===t).length]).filter(x=>x[1]);
  return `<section class="wrap hero">
      <h1>Properti Indonesia, <em>langsung dari agennya.</em></h1>
      <p>${esc(SITE.tagline)}</p>
      <form class="search home-search" id="hs" role="search"><input id="h-q" type="search" placeholder="Cari kota atau lokasi, mis. Jakarta Selatan, Sleman, Canggu…" aria-label="Cari listing"><button class="btn btn-primary">Cari</button></form>
      <div class="chips" style="margin-top:12px">${typeCounts.map(([t,n])=>`<button class="chip" data-go-type="${t}">${t}<span class="n">${n}</span></button>`).join("")}</div>
    </section>
    <section class="wrap"><div class="section-head"><div><div class="label">Baru tayang</div><h2>Listing terbaru</h2></div><a class="btn btn-line btn-sm" href="#listing">Lihat semua listing</a></div>
      <div class="grid">${!S.loaded?`<div class="empty">Memuat listing…</div>`:S.error?`<div class="empty">${esc(S.error)}</div>`:latest.length?latest.map(card).join(""):`<div class="empty">Belum ada listing yang tayang.</div>`}</div></section>
    ${P?`<section class="wrap"><div class="section-head"><div><div class="label">Berita</div><h2>Kabar properti terbaru</h2></div><a class="btn btn-line btn-sm" href="#berita">Semua berita</a></div>
      <div class="news-list news-row" data-noi18n>${P.NEWS.slice(0,3).map(P.newsCard).join("")}</div></section>
    <section class="wrap"><div class="guide-band"><div><div class="label">Panduan</div><h2>Mau beli properti? Periksa ini dulu.</h2><p>Jenis sertifikat, cek legalitas di BPN, hitungan pajak BPHTB dan PPh, sampai alur AJB dan balik nama.</p></div><a class="btn btn-primary" href="#panduan">Baca panduan</a></div></section>`:""}
    ${session?"":`<section class="wrap"><div class="cta-band"><p><b>Anda agen properti?</b> Buat akun, pasang listing Anda di ${esc(SITE.name)}, dan terima calon pembeli langsung ke WhatsApp Anda.</p><a class="btn btn-primary" href="#daftar">Daftar sebagai agen</a></div></section>`}`;
}
function listingPage(){
  const all=S.facets;
  const provCount=new Set(all.map(l=>l.prov).filter(Boolean)).size,kabCount=new Set(all.map(l=>l.kab).filter(Boolean)).size;
  const typeCounts=TYPES.map(t=>[t,all.filter(l=>l.type===t).length]).filter(x=>x[1]);
  return `<section class="wrap page-head" style="padding-bottom:6px"><div class="label">Listing</div><h1>Semua listing</h1>
    </section>
    <section class="wrap tools" aria-label="Cari dan saring">
      <div class="search"><input id="f-q" type="search" placeholder="Cari kota atau lokasi, mis. Jakarta Selatan, Sleman, Canggu…" value="${esc(F.q)}" aria-label="Cari listing"></div>
      <div class="chips" role="group" aria-label="Jenis properti">
        <button class="chip" data-type="" aria-pressed="${!F.type}">Semua<span class="n">${S.live}</span></button>
        ${typeCounts.map(([t,n])=>`<button class="chip" data-type="${t}" aria-pressed="${F.type===t}">${t}<span class="n">${n}</span></button>`).join("")}
      </div>
      <div class="selects">
        <select id="f-status" aria-label="Status"><option value="">Dijual & disewakan</option>${opt(STATUS,F.status)}</select>
        <select id="f-prov" aria-label="Provinsi"><option value="">Semua provinsi</option>${opt(PROVS,F.prov)}</select>
        <select id="f-kab" aria-label="Kota/kabupaten"><option value="">Semua kota/kabupaten</option>${opt(kabsIn(F.prov),F.kab)}</select>
        <select id="f-budget" aria-label="Budget"><option value="">Semua budget</option>${opt(BUDGETS,F.budget)}</select>
        <select id="f-bed" aria-label="Kamar tidur"><option value="">Kamar tidur</option>${opt([["1","1+ KT"],["2","2+ KT"],["3","3+ KT"],["4","4+ KT"],["5","5+ KT"]],F.bed)}</select>
        <select id="f-facing" aria-label="Hadap"><option value="">Semua arah hadap</option>${opt(FACING.map(f=>[f,"Hadap "+f]),F.facing)}</select>
        <select id="f-sort" aria-label="Urutkan">${opt([["new","Terbaru"],["cheap","Harga terendah"],["pricey","Harga tertinggi"],["big","Luas terbesar"],["small","Luas terkecil"]],F.sort)}</select>
      
        ${(F.type||F.status||F.prov||F.kab||F.agent||F.budget||F.bed||F.facing||F.q)?`<button class="btn-ghost btn-sm" data-act="reset-filter">Hapus filter</button>`:""}
      </div>
    </section>
    <section class="wrap grid" id="results">${resultsHtml()}</section>
    <section class="wrap more" id="more">${moreHtml()}</section>`;
}
function agentsSection(){
  const ag=pubAgents();
  return `<section class="wrap" id="agen-list"><div class="section-head"><div><div class="label">Tim agen</div><h2>Agen kami</h2></div></div>
    <div class="agents">${ag.length?ag.map(a=>{const n=S.facets.filter(l=>l.agent_id===a.id).length;
      return `<a class="agent" href="#agen-${esc(a.id)}">${ava(a,"lg")}<div><h3>${esc(a.name)}</h3><p>${esc(a.agency||"Agen independen")}</p><p>${esc([a.kab,a.prov].filter(Boolean).join(", "))}</p><p class="mono">${n} listing</p></div></a>`}).join("")
      :`<div class="empty">${S.loaded?"Belum ada agen yang tayang.":"Memuat agen…"}</div>`}</div>
    ${session?"":`<div class="cta-band"><p><b>Anda agen properti?</b> Buat akun, pasang listing Anda di ${esc(SITE.name)}, dan terima calon pembeli langsung ke WhatsApp Anda.</p><a class="btn btn-primary" href="#daftar">Daftar sebagai agen</a></div>`}</section>`;
}
const SH=()=>({num,rupiah,wa,hasBuilding,units:UNITS,T,en:EN(),locale:I.locale});
function detail(l){
  const a=agentOf(l.agent_id)||{name:"Agen",phone:""};
  const pics=l.photos||[];
  const rows=[["Jenis",`${esc(l.type)} · ${esc(l.status)}`],[hasBuilding(l.type)?"Luas tanah":"Luas",l.size?`${num(l.size)} m² (${num(Math.round(l.size)/100)} are)`:"—"],
    ...(hasBuilding(l.type)?[["Luas bangunan",l.building_size?`${num(l.building_size)} m²`:"—"]]:[]),
    ...(ROOM_TYPES.includes(l.type)?[["Kamar tidur",l.bedrooms??"—"],["Kamar mandi",l.bathrooms??"—"]]:[]),
    ["Hadap",esc(l.facing)||"—"],["Sertifikat",esc(l.cert)||"—"],
    ["Zonasi",l.zone?zoneHtml(l.zone):"—"],["Lokasi",esc(l.place)||"—"],["Kota/kabupaten",esc(l.kab)||"—"],["Provinsi",esc(l.prov)||"—"],
    ["Harga",l.price==null?"Tanya agen":`${rupiah(l.price)} ${UNITS[l.unit]||""}`]];
  if(l.price&&l.unit==="total"&&l.size&&l.type==="Tanah")rows.push(["Harga per are",rupiah(l.price/(l.size/100))]);
  if(l.price&&(l.unit==="are"||l.unit==="m2")&&l.size)rows.push(["Harga total",rupiah(totalPrice(l))]);
  if(l.price&&l.unit==="are_tahun"&&l.size)rows.push(["Sewa total per tahun",rupiah(totalPrice(l))]);
  rows.push(["Tanggal tayang",fmtD(l.created_at)]);
  if(l.updated_at&&new Date(l.updated_at)-new Date(l.created_at)>DAY)rows.push(["Terakhir diperbarui",fmtD(l.updated_at)]);
  const mine=session&&(l.agent_id===session.user.id||(me&&me.is_admin));
  if(isSold(l))return `<div class="wrap"><a class="back" href="#listing">← Semua listing</a>
    <div class="sold-hero"><span class="sold-stamp">${soldWord(l)}</span><div><h1 class="d-title">${esc(TT(l.title))}</h1>
      <p>${[l.place,l.kab,l.prov].filter(Boolean).map(esc).join(", ")}</p>
      <p class="hint">Properti ini sudah ${soldWord(l).toLowerCase()} pada ${fmtD(l.sold_at)}. Cari properti serupa yang masih tersedia.</p>
      <div class="phone"><button class="btn btn-primary" data-similar="${esc(l.id)}">Lihat properti serupa</button>${mine?`<button class="btn btn-line" data-unsold="${esc(l.id)}">Batalkan ${soldWord(l).toLowerCase()}</button>`:""}</div></div></div></div>`;
  return `<div class="wrap"><a class="back" href="#listing">← Semua listing</a>
    ${!l.published?`<div class="note err" style="margin-bottom:14px">Listing ini belum tayang. Hanya Anda yang bisa melihatnya.</div>`
      :daysLeft(l)<=0?`<div class="note err renew-note" style="margin-bottom:14px"><span>Listing ini sudah diturunkan karena tidak diperbarui selama ${EXPIRE_DAYS} hari. Pembeli tidak bisa melihatnya.</span>${mine?`<button class="btn btn-primary btn-sm" data-renew="${esc(l.id)}">Tayangkan ulang</button>`:""}</div>`
      :mine&&needsRenew(l)?`<div class="note renew-note" style="margin-bottom:14px"><span>Listing ini akan diturunkan dalam ${daysLeft(l)} hari.</span><button class="btn btn-primary btn-sm" data-renew="${esc(l.id)}">Tayangkan ulang</button></div>`:""}
    <div class="detail"><div>
        <div class="gallery"><div class="main" id="g-main">${pics.length?`<img src="${esc(pics[0])}" alt="${esc(l.title)}">${wmOv(pics[0])}`:mediaHtml(l)}</div>
          ${pics.length>1?`<div class="thumbs">${pics.map((p,i)=>`<button data-thumb="${i}" aria-current="${i===0}" aria-label="Foto ${i+1}"><img src="${esc(p)}" alt=""></button>`).join("")}</div>`:""}</div>
        <div class="label" style="margin-top:22px">${[l.place,l.kab,l.prov].filter(Boolean).map(esc).join(" · ")}</div>
        <h1 class="d-title"${mt(l.title)}>${esc(TT(l.title))}</h1>
        ${priceHtml(l,"d-price")}
        <div class="d-views">${vw(l,true)}</div>
        <table class="facts"><tbody>${rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
        ${l.description?`<p class="desc">${esc(l.description)}</p>`:""}
        ${l.maps_url&&/^https:\/\//.test(l.maps_url)?`<a class="btn btn-line maps-btn" href="${esc(l.maps_url)}" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/></svg>Lihat lokasi di Google Maps</a>`:""}
      </div>
      <aside class="side">
        <div class="panel"><div class="label">Agen listing ini</div>
          <a class="who" href="#agen-${esc(a.id)}" style="text-decoration:none">${ava(a,"lg")}<span><b style="font-size:17px">${esc(a.name)}</b><br><span style="color:var(--muted)">${esc(a.agency||"")}</span></span></a>
          ${a.phone?`<a class="btn btn-wa" href="${waLink(a,l)}" target="_blank" rel="noopener">Tanya via WhatsApp</a>`:""}
        </div>
        <div class="panel"><div class="label">Bagikan listing</div>
          <div class="share-row"><button class="btn btn-line" data-share="${esc(l.id)}">${SHARE_IC}<span>Bagikan</span></button><button class="btn btn-line" data-copy="${esc(l.id)}">${LINK_IC}<span>Salin link</span></button></div>
          <button class="btn btn-primary" data-pdf="${esc(l.id)}">Download brosur PDF</button>
          ${mine?`<button class="btn btn-line btn-sm" data-edit-listing="${esc(l.id)}" style="justify-self:start">Edit listing ini</button>`:""}</div>
        ${mine?"":`<a class="report-link" href="https://wa.me/${wa(SITE.adminPhone)}?text=${encodeURIComponent(`Halo admin ${SITE.name}, saya ingin melaporkan listing "${l.title}" (${BASE}#${l.id}). Alasan: `)}" target="_blank" rel="noopener">Laporkan listing ini</a>`}
      </aside></div></div>`;
}
function agentPage(a){
  const list=S.byAgent[a.id];
  if(!list)return `<div class="wrap"><a class="back" href="#agen">← Semua agen</a><div class="empty" style="margin-top:20px">Memuat listing…</div></div>`;
  return `<div class="wrap"><a class="back" href="#agen">← Semua agen</a>
    <div class="agent-hero">${ava(a,"lg")}<div style="min-width:0"><div class="label">${esc(a.agency||"Agen independen")}</div><h1>${esc(a.name)}</h1><div style="color:var(--muted)">${esc([a.areas,[a.kab,a.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</div></div></div>
    ${a.bio?`<p class="desc" style="margin-top:0">${esc(a.bio)}</p>`:""}
    ${a.phone?`<div class="phone" style="margin-block:16px 26px"><a class="btn btn-wa" href="${waLink(a)}" target="_blank" rel="noopener">WhatsApp ${esc(a.name)}</a></div>`:""}
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
      <label class="agree"><input type="checkbox" id="r-agree" name="agree" ${d.agree?"checked":""}><span>Saya menyatakan data diri ini benar. Setiap listing yang saya pasang saya terima langsung dari pemilik properti dan dapat saya pertanggungjawabkan. Saya memahami listing yang tidak sesuai dapat diturunkan oleh admin.</span></label>${E("agree")}
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
    ${!DS.form&&DS.tab!=="mine"&&S.mine.some(l=>needsRenew(l))?`<div class="note err renew-note"><span>Ada listing Anda yang sudah atau akan segera diturunkan.</span><button class="btn btn-line btn-sm" data-dtab="mine">Lihat listing saya</button></div>`:""}
    ${me.status==="rejected"?`<div class="note err">Pendaftaran Anda belum disetujui. Hubungi admin lewat WhatsApp untuk informasi lebih lanjut.</div> <a class="btn btn-wa btn-sm" style="justify-self:start" href="https://wa.me/${wa(SITE.adminPhone)}" target="_blank" rel="noopener">WhatsApp admin</a>`:""}
    ${DS.form?"":`<div class="tabs dash-tabs" role="tablist">${tabs.map(([k,t])=>`<button role="tab" aria-selected="${DS.tab===k}" data-dtab="${k}">${t}</button>`).join("")}</div>`}
    ${devNotice()}
    ${capacityNote()}
    ${note(DS.msg)}
    ${body}</div>`;
}
// Pemberitahuan pengembangan website: tampil di semua dasbor sampai tanggal berikut, lalu hilang otomatis
const DEV_NOTICE_UNTIL=new Date("2026-11-13T12:30:00+08:00");
function devNotice(){
  if(Date.now()>DEV_NOTICE_UNTIL.getTime())return "";
  return `<div class="note dev-note"><b>Pemberitahuan</b><span>Tim developer sedang melakukan pengembangan website secara berkala. Selama proses ini, sistem tetap berjalan normal dan Anda bisa memasang, mengubah, serta mengelola listing seperti biasa.</span></div>`;
}
function listingPill(l){
  if(isSold(l)){const d=soldLeft(l);return `<span class="pill pill-sold">${soldWord(l)} · ${fmtD(l.sold_at)}</span> <span class="pill pill-rejected">${d<=1?"Dihapus permanen hari ini":`Dihapus permanen dalam ${d} hari`}</span>`}
  if(!l.published)return `<span class="pill pill-pending">Draf</span>`;
  const d=daysLeft(l);
  if(d<=0)return `<span class="pill pill-rejected">Diturunkan</span>`;
  if(d<=WARN_DAYS)return `<span class="pill pill-pending">Turun dalam ${d} hari</span>`;
  return `<span class="pill pill-approved">Tayang · sisa ${d} hari</span>`;
}
function renewBanner(list,own){
  const exp=list.filter(l=>l.published&&daysLeft(l)<=0),soon=list.filter(l=>l.published&&daysLeft(l)>0&&daysLeft(l)<=WARN_DAYS);
  if(!exp.length&&!soon.length)return "";
  const ids=[...exp,...soon].map(l=>l.id).join(",");
  if(EN())return `<div class="note ${exp.length?"err":""} renew-note" data-noi18n><span>${exp.length?`<b>${exp.length} ${own?"of your ":""}listing(s) taken down</b> because they weren't updated for ${EXPIRE_DAYS} days. `:""}${soon.length?`<b>${soon.length} listing(s)</b> will be taken down within ${WARN_DAYS} days. `:""}${own?"If the property is still available, republish it so buyers can keep seeing it.":"The owning agent needs to republish these listings."}</span>
    ${own?`<button class="btn btn-primary btn-sm" data-renew="${ids}">Republish all</button>`:""}</div>`;
  return `<div class="note ${exp.length?"err":""} renew-note"><span>${exp.length?`<b>${exp.length} listing${own?" Anda":""} sudah diturunkan</b> karena tidak diperbarui selama ${EXPIRE_DAYS} hari. `:""}${soon.length?`<b>${soon.length} listing</b> akan diturunkan dalam ${WARN_DAYS} hari. `:""}${own?"Jika properti masih tersedia, tayangkan ulang agar tetap terlihat pembeli.":"Agen pemilik perlu menayangkan ulang listingnya."}</span>
    ${own?`<button class="btn btn-primary btn-sm" data-renew="${ids}">Tayangkan ulang semua</button>`:""}</div>`;
}
function rowItem(l,showAgent){
  const a=agentOf(l.agent_id)||{};const c=DS.confirm===l.id,cs=DS.confirmSold===l.id;
  return `<div class="item">${l.photos&&l.photos[0]?`<img class="thumb" src="${esc(l.photos[0])}" alt="">`:`<span class="thumb"></span>`}
    <div><b>${esc(l.title)}</b><small>${esc([showAgent?a.name:"",l.type,[l.kab,l.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</small>
      <small>${listingPill(l)} ${l.price!=null?rupiah(l.price):"Harga: tanya agen"}</small>
      <small>Tayang ${fmtD(l.created_at)}${l.updated_at?` · diperbarui ${fmtD(l.updated_at)}`:""} ${vw(l,true)}</small></div>
    ${cs?`<span class="confirm sold-confirm">Tandai "${esc(l.title)}" sebagai ${soldWord(l).toLowerCase()}? Listing hilang dari pencarian dan dihapus permanen ${SOLD_DAYS} hari kemudian. <button class="btn btn-primary btn-sm" data-sold="${esc(l.id)}">Ya, ${soldWord(l).toLowerCase()}</button><button class="btn btn-line btn-sm" data-act="cancel">Batal</button></span>`
      :c?`<span class="confirm">Hapus listing ini? <button class="btn btn-danger btn-sm" data-del-listing="${esc(l.id)}">Ya, hapus</button><button class="btn btn-line btn-sm" data-act="cancel">Batal</button></span>`
      :`<span class="item-acts">${needsRenew(l)?`<button class="btn btn-primary btn-sm" data-renew="${esc(l.id)}">Tayangkan ulang</button>${showAgent&&l.agent_id!==me.id&&a.phone?`<a class="btn-ghost btn-sm" target="_blank" rel="noopener" href="https://wa.me/${wa(a.phone)}?text=${encodeURIComponent(`Halo ${a.name}, listing Anda "${l.title}" di ${SITE.name} ${daysLeft(l)<=0?"sudah diturunkan":"akan diturunkan dalam "+daysLeft(l)+" hari"} karena belum diperbarui ${EXPIRE_DAYS} hari. Silakan masuk ke dasbor dan ketuk Tayangkan ulang bila properti masih tersedia. Terima kasih.`)}">Ingatkan via WA</a>`:""}`:""}${S.noSold?"":isSold(l)?`<button class="btn btn-line btn-sm" data-unsold="${esc(l.id)}">Batalkan ${soldWord(l).toLowerCase()}</button>`:l.published?`<button class="btn btn-sold btn-sm" data-ask-sold="${esc(l.id)}">Tandai ${soldWord(l).toLowerCase()}</button>`:""}<a class="btn-ghost btn-sm" href="#${esc(l.id)}">Lihat</a><button class="btn btn-line btn-sm" data-edit-listing="${esc(l.id)}">Edit</button><button class="btn-ghost btn-sm" data-ask="${esc(l.id)}">Hapus</button></span>`}</div>`;
}
function myListings(){
  const mine=S.mine;const sold=mine.filter(isSold).length,liveN=mine.filter(isLive).length;
  return `<div class="dash-bar"><span class="label">${mine.length} listing</span>${sold?`<span class="dash-stats"><span class="pill pill-approved">${liveN} tayang</span> <span class="pill pill-sold">${sold} terjual/tersewa</span></span>`:""}
      <button class="btn btn-primary btn-sm" data-act="new-listing" ${me.status==="approved"?"":"disabled title=\"Menunggu persetujuan admin\""}>Tambah listing</button></div>
    ${renewBanner(mine,true)}
    <p class="hint" style="margin:0">Listing otomatis diturunkan bila tidak diperbarui selama ${EXPIRE_DAYS} hari. Menyimpan perubahan atau mengetuk Tayangkan ulang akan memulai hitungan dari awal.</p>
    <div class="list">${mine.length?mine.map(l=>rowItem(l,false)).join(""):`<div class="empty">Belum ada listing. ${me.status==="approved"?"Ketuk Tambah listing untuk memasang yang pertama.":"Anda bisa memasang listing setelah akun disetujui."}</div>`}</div>`;
}
function adminListings(){
  const A=S.all;
  if(!A.started||(A.loading&&!A.items.length))return `<div class="empty">Memuat listing…</div>`;
  return `<div class="dash-bar"><span class="label">${A.total} listing dari semua agen</span></div>
    ${renewBanner(A.items,false)}
    <div class="list">${A.items.length?A.items.map(l=>rowItem(l,true)).join(""):`<div class="empty">Belum ada listing.</div>`}</div>
    ${A.done?"":`<button class="btn btn-line" data-act="more-all" ${A.loading?"disabled":""}>${A.loading?"Memuat…":"Muat lebih banyak"}</button>`}`;
}
function capacityNote(){
  if(!me||!me.is_admin||S.totalAll==null)return "";
  const n=S.totalAll;
  if(n<400)return "";
  return `<div class="note ${n>=550?"err":""}" data-noi18n><b>Kapasitas paket gratis hampir penuh: ${n} listing.</b> Penyimpanan foto Supabase gratis cukup untuk sekitar 600 listing. ${n>=550?"Segera":"Mulai siapkan"} upgrade ke Supabase Pro (Organization → Billing → Upgrade) agar unggah foto tidak gagal.</div>`;
}
function adminAgents(){
  const order={pending:0,approved:1,rejected:2};
  const ag=[...S.agents].sort((a,b)=>order[a.status]-order[b.status]||String(b.created_at).localeCompare(String(a.created_at)));
  return `<div class="list">${ag.map(a=>`<div class="item agent-item">${ava(a)}<div><b>${esc(a.name)} ${a.is_admin?`<span class="pill pill-approved">Admin</span>`:""}</b>
      <small>${esc([a.agency||"Independen",[a.kab,a.prov].filter(Boolean).join(", ")].filter(Boolean).join(" · "))}</small>
      <small>WA ${esc(a.phone)}${a.arebi?` · AREBI ${esc(a.arebi)}`:""}${a.since?` · agen sejak ${esc(a.since)}`:""}</small>
      <small>${statusPill(a.status)} ${S.facets.filter(l=>l.agent_id===a.id).length} listing tayang</small></div>
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
  const f=DS.form,l=f.data;
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
    <div class="row"><div class="field"><label for="l-size">${hasBuilding(l.type)?"Luas tanah (m²)":"Luas (m²)"}</label><input id="l-size" name="size" inputmode="numeric" value="${esc(l.size??"")}" placeholder="500"><span class="hint" id="h-size"></span></div>
      ${hasBuilding(l.type)?`<div class="field"><label for="l-bsize">Luas bangunan (m²)</label><input id="l-bsize" name="building_size" inputmode="numeric" value="${esc(l.building_size??"")}" placeholder="150"></div>`:`<div class="field"><label for="l-cert">Sertifikat</label><select id="l-cert" name="cert">${opt([["","—"],...CERTS],l.cert)}</select></div>`}</div>
    ${ROOM_TYPES.includes(l.type)?`<div class="row"><div class="field"><label for="l-bed">Kamar tidur</label><input id="l-bed" name="bedrooms" type="number" min="0" max="99" inputmode="numeric" value="${esc(l.bedrooms??"")}" placeholder="3"></div>
      <div class="field"><label for="l-bath">Kamar mandi</label><input id="l-bath" name="bathrooms" type="number" min="0" max="99" inputmode="numeric" value="${esc(l.bathrooms??"")}" placeholder="2"></div></div>`:""}
    <div class="row">${hasBuilding(l.type)?`<div class="field"><label for="l-cert">Sertifikat</label><select id="l-cert" name="cert">${opt([["","—"],...CERTS],l.cert)}</select></div>`:""}
      <div class="field"><label for="l-facing">Hadap / orientasi</label><input id="l-facing" name="facing" list="facing-list" maxlength="60" value="${esc(l.facing)}" placeholder="Timur, atau Hook Timur & Selatan"><datalist id="facing-list">${FACING.map(f=>`<option value="${esc(f)}">`).join("")}</datalist><span class="hint">Tulis bebas, misalnya posisi hook dua arah.</span></div>${hasBuilding(l.type)?"":"<div></div>"}</div>
    <div class="row"><div class="field"><label for="l-price">Harga publik (Rp)</label><input id="l-price" name="price" inputmode="numeric" value="${l.price!=null&&l.price!==""?esc(dots(l.price)):""}" placeholder="Kosongkan = tanya agen"><span class="hint" id="h-price"></span></div>
      <div class="field"><label for="l-unit">Satuan harga</label><select id="l-unit" name="unit">${opt([["total","Total"],["are","Per are"],["m2","Per m²"],["tahun","Per tahun (sewa)"],["are_tahun","Per are per tahun (sewa tanah)"]],l.unit)}</select></div></div>
    <div class="field"><label for="l-zone">Zonasi</label><select id="l-zone" name="zone">${opt([["","—"],...Object.keys(ZONES)],l.zone)}</select></div>
    ${l.type==="Tanah"?`<div class="field"><label for="l-maps">Lokasi Google Maps</label><input id="l-maps" name="maps_url" type="url" inputmode="url" value="${esc(l.maps_url)}" placeholder="https://maps.app.goo.gl/…">
      <span class="hint">Buka lokasi tanah di aplikasi Google Maps, ketuk Bagikan, lalu salin link dan tempel di sini. Tombol Lihat lokasi akan tampil di halaman listing.</span></div>`:""}
    <div class="field"><label for="l-desc">Deskripsi</label><textarea id="l-desc" name="description" placeholder="Akses jalan, view, fasilitas sekitar…">${esc(l.description)}</textarea></div>
    ${(()=>{const n=(l.photos||[]).length,full=n>=MAX_PHOTOS;return `<div class="field"><label for="l-photos">Foto <span class="pill ${full?"pill-pending":"pill-approved"}">${n} / ${MAX_PHOTOS}</span></label>
      <div class="photo-limit">Maksimal ${MAX_PHOTOS} foto per listing. Foto pertama jadi foto sampul.</div>
      <div class="pick-row">
        <label class="btn btn-line btn-sm pick ${f.uploading||full?"is-off":""}"><input id="l-photos" type="file" accept="image/*" multiple ${f.uploading||full?"disabled":""}>Galeri / kamera HP</label>
        <label class="btn btn-line btn-sm pick ${f.uploading||full?"is-off":""}"><input id="l-photos-file" type="file" multiple ${f.uploading||full?"disabled":""}>Google Drive / file</label>
      </div>
      <span class="hint">Tombol Google Drive / file membuka pemilih file; pilih Drive di menu samping (☰). Pastikan aplikasi Google Drive sudah masuk ke akun Anda.</span>
      <span class="hint">${f.uploading?"Mengunggah foto…":full?`Batas ${MAX_PHOTOS} foto sudah tercapai. Hapus salah satu foto untuk menggantinya.`:`Anda masih bisa menambah ${MAX_PHOTOS-n} foto.`}</span>`})()}
      <div class="pics">${(l.photos||[]).map((u,i)=>`<div class="pic"><img src="${esc(u)}" alt=""><button type="button" data-rmpic="${i}" aria-label="Hapus foto">×</button></div>`).join("")}</div></div>
    <div class="rules"><b>Sebelum menayangkan listing</b>
      <ul><li>Pastikan properti ini Anda terima langsung dari pemiliknya (Direct Owner), dan pemilik sudah mengizinkan Anda memasarkannya.</li>
      <li>Mohon tidak memasang listing titipan dari makelar lain, termasuk DKO, atau menyalin iklan, foto, dan deskripsi dari situs lain.</li>
      <li>Pastikan harga, luas, sertifikat, dan lokasi sesuai keadaan sebenarnya.</li></ul>
      <span>Dengan begitu setiap listing di Nusantara Property dapat dipertanggungjawabkan kepada pembeli. Listing yang tidak sesuai akan kami turunkan.</span></div>
    <label class="agree"><input type="checkbox" id="l-own" name="own" ${f.own?"checked":""}><span>Saya memastikan listing ini saya terima langsung dari pemilik properti, datanya benar, dan dapat saya pertanggungjawabkan.</span></label>
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
  if(DS.form&&document.getElementById('lf')){snapForm();writeDraft()}
  if(location.hash==="#"&&history.replaceState)history.replaceState(null,"",location.pathname+location.search);
  const r=route();let main;
  if(recovery)main=resetPage();
  else if(r==="daftar")main=session?dashboard():registerPage();
  else if(r==="masuk")main=session?dashboard():loginPage();
  else if(r==="dasbor"){restoreDraft();main=dashboard()}
  else{
    const l=getL(r);const a=r.startsWith("agen-")&&agentOf(r.slice(5));
    const pendingId=!l&&/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(r)&&!S.missing[r];
    if(l&&(isLive(l)||(isSold(l)&&l.published)||(session&&(l.agent_id===session.user.id||(me&&me.is_admin)))))main=detail(l);
    else if(pendingId)main=`<div class="wrap"><div class="empty" style="margin-top:28px">Memuat listing…</div></div>`;
    else if(a&&(a.status==="approved"||(me&&me.is_admin)))main=agentPage(a);
    else if(r==="listing")main=listingPage();
    else if(r==="agen")main=`<div class="page">${agentsSection()}</div>`;
    else if(r==="berita"&&window.NP_PAGES)main=NP_PAGES.news();
    else if(r==="panduan"&&window.NP_PAGES)main=NP_PAGES.guide();
    else if(r==="faq"&&window.NP_PAGES)main=NP_PAGES.faq(SITE);
    else if(r==="tentang"&&window.NP_PAGES){main=NP_PAGES.about(SITE,{listings:S.live,agents:pubAgents().length,provs:new Set(S.facets.map(l=>l.prov).filter(Boolean)).size})}
    else main=home();
  }
  app.innerHTML=bar()+`<main>${main}</main>`+footer();
  setTitle(r);
  I.translate(app);
  if(I.upgrade)I.upgrade(app);
  hints();
  setTimeout(ensureRoute,0);
  fillViews();
  if(main&&getL(r)&&document.querySelector('.d-views'))countView(getL(r));
}
function setTitle(r){
  const e=EN(),l=getL(r),ag=r.startsWith("agen-")&&agentOf(r.slice(5));
  const base=e?"Nusantara Property – Land, Houses & Villas in Bali and Across Indonesia":"Nusantara Property – Jual Beli Tanah, Rumah & Villa di Bali dan Seluruh Indonesia";
  const map={listing:e?"All property listings":"Semua listing properti",berita:e?"Indonesian property news":"Berita properti Indonesia",panduan:e?"Guide to buying property in Indonesia":"Panduan membeli properti di Indonesia",
    tentang:e?"About us":"Tentang kami",faq:"FAQ",daftar:e?"Join as an agent":"Daftar sebagai agen",masuk:e?"Agent sign in":"Masuk agen",dasbor:e?"Agent dashboard":"Dasbor agen",agen:e?"Our agents":"Agen kami"};
  let t=base;
  if(l)t=`${TT(l.title)} – ${[l.kab,l.prov].filter(Boolean).join(", ")} | Nusantara Property`;
  else if(ag)t=`${ag.name} – ${e?"Property agent":"Agen properti"} | Nusantara Property`;
  else if(map[r])t=`${map[r]} | Nusantara Property`;
  document.title=t;
}
function hints(){
  [["l-size","h-size",v=>`= ${num(v/100)} are`],["l-price","h-price",rupiah]].forEach(([i,h,f])=>{
    const a=document.getElementById(i),b=document.getElementById(h);if(a&&b){const v=Number(String(a.value).replace(/\D/g,""));b.textContent=v?f(v):""}});
}
const dots=v=>{const d=String(v??"").replace(/\D/g,"");return d?d.replace(/\B(?=(\d{3})+(?!\d))/g,"."):""};
const digits=v=>{const d=String(v||"").replace(/\D/g,"");return d?Number(d):null};
function readForm(form){const o={};new FormData(form).forEach((v,k)=>{if(k in o){o[k]=[].concat(o[k],String(v))}else o[k]=String(v).trim()});return o}
const DRAFT_KEY="np-listing-draft";
function saveDraft(){snapForm();writeDraft()}
function writeDraft(){try{if(DS.form&&me)localStorage.setItem(DRAFT_KEY,JSON.stringify({uid:me.id,ts:Date.now(),data:DS.form.data,own:!!DS.form.own}))}catch(e){}}
function clearDraft(){try{localStorage.removeItem(DRAFT_KEY)}catch(e){}}
function restoreDraft(){
  if(DS.form||!me)return;
  try{const d=JSON.parse(localStorage.getItem(DRAFT_KEY)||"null");
    if(d&&d.uid===me.id&&Date.now()-d.ts<3*DAY){DS.form={data:d.data,own:d.own};DS.msg={text:"Isian listing yang belum tersimpan sudah dipulihkan. Lanjutkan lalu simpan."}}}catch(e){}
}
function snapForm(){const f=document.getElementById('lf');if(f&&DS.form){const o=readForm(f);
  ["title","type","status","prov","kab","place","size","price","unit","cert","zone","description","maps_url","building_size","bedrooms","bathrooms","facing"].forEach(k=>DS.form.data[k]=o[k]??DS.form.data[k]);
  DS.form.data.published=!!o.published;DS.form.own=!!o.own;}}

/* watermark logo di tengah foto listing (tertanam di file foto) */
let WM_LOGO=null;
function wmLogo(){
  if(!WM_LOGO)WM_LOGO=new Promise(r=>{const i=new Image();i.onload=()=>r(i);i.onerror=()=>r(null);i.src="/assets/np-mark-light.png"});
  return WM_LOGO;
}
async function drawWatermark(x,w,h){
  const logo=await wmLogo();
  try{await document.fonts.load('700 40px "Plus Jakarta Sans"')}catch(e){}
  const s=Math.min(w,h),fs=Math.max(14,Math.round(s*.062)),lh=Math.round(fs*1.9),gap=Math.round(fs*.3),text=SITE.name;
  x.save();x.font=`700 ${fs}px "Plus Jakarta Sans",system-ui,sans-serif`;x.textBaseline="middle";
  const lw=logo?logo.width*lh/logo.height:0,tw=x.measureText(text).width,total=lw+(logo?gap:0)+tw;
  const x0=(w-total)/2,cy=h/2;
  x.globalAlpha=.6;x.shadowColor="rgba(0,0,0,.45)";x.shadowBlur=Math.max(2,s*.012);
  if(logo)x.drawImage(logo,x0,cy-lh/2,lw,lh);
  x.fillStyle="#fff";x.fillText(text,x0+lw+(logo?gap:0),cy+fs*.05);
  x.restore();
}
function shrink(file,max,q,wm){
  return new Promise((res,rej)=>{const url=URL.createObjectURL(file);const img=new Image();img.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("Foto tidak bisa dibaca"))};
    img.onload=async()=>{const k=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.round(img.width*k);c.height=Math.round(img.height*k);
      const x=c.getContext('2d');x.drawImage(img,0,0,c.width,c.height);URL.revokeObjectURL(url);
      if(wm){try{await drawWatermark(x,c.width,c.height)}catch(e){}}
      c.toBlob(b=>b?res(b):rej(new Error("Foto gagal diproses")),'image/jpeg',q||.74)};img.src=url});
}
async function uploadPhoto(file,prefix,max,wm){
  const blob=await shrink(file,max,0,wm);
  const path=`${session.user.id}/${prefix}${Date.now()}-${Math.random().toString(36).slice(2,7)}.jpg`;
  const {error}=await sb.storage.from('listing-photos').upload(path,blob,{contentType:'image/jpeg',upsert:false});
  if(error)throw error;
  return sb.storage.from('listing-photos').getPublicUrl(path).data.publicUrl;
}

/* ===== events ===== */
app.addEventListener('click',async e=>{
  const t=e.target.closest('button,a[data-act],a[data-goto]');if(!t)return;
  const act=t.dataset.act;
  if(t.dataset.lang){I.set(t.dataset.lang);MENU=false;render();return}
  if(act==="menu"){MENU=!MENU;render();return}
  if(act==="more"){fetchPage(false);return}
  if(act==="more-all"){fetchAll(true);return}
  if(act==="reset-filter"){Object.assign(F,{q:"",type:"",status:"",prov:"",kab:"",agent:"",budget:"",bed:"",facing:""});render();return}
  if(t.dataset.goType){F.type=t.dataset.goType;location.hash="listing";return}
  if(t.dataset.goto){e.preventDefault();const el=document.getElementById("g-"+t.dataset.goto);if(el)el.scrollIntoView({behavior:"smooth",block:"start"});return}
  if(t.classList.contains('chip')){F.type=t.dataset.type;render();return}
  if(t.dataset.thumb!==undefined){const l=getL(route());const i=Number(t.dataset.thumb);
    document.getElementById('g-main').innerHTML=`<img src="${esc(l.photos[i])}" alt="${esc(l.title)}">${wmOv(l.photos[i])}`;
    document.querySelectorAll('[data-thumb]').forEach(b=>b.setAttribute('aria-current',b===t));return}
  if(t.dataset.share||t.dataset.copy){const l=getL(t.dataset.share||t.dataset.copy);if(l)shareListing(l,t,!!t.dataset.copy);return}
  if(t.dataset.pdf){const l=getL(t.dataset.pdf),old=t.textContent;t.disabled=true;t.textContent=T("Menyiapkan PDF…");
    try{await NP_SHARE.pdf(EN()?{...l,title:TT(l.title)}:l,agentOf(l.agent_id),SITE,BASE+"#"+l.id,SH());t.textContent=T("PDF terunduh")}catch(err){t.textContent=T("Gagal membuat PDF, coba lagi")}
    setTimeout(()=>{t.textContent=old;t.disabled=false},2500);return}
  if(t.dataset.copy){const v=t.dataset.copy,old=t.textContent;try{await navigator.clipboard.writeText(v);t.textContent=T("Tersalin")}catch(_){t.textContent=T("Salin manual: "+v)}setTimeout(()=>t.textContent=old,2500);return}
  if(act==="logout"){await sb.auth.signOut();me=null;DS={tab:"mine",form:null,confirm:null,busy:false,msg:null,profile:null};location.hash="";render();return}
  if(act==="forgot"){
    const em=(document.getElementById('g-email')||{}).value||"";AUTH.email=em.trim();
    if(!/^\S+@\S+\.\S+$/.test(AUTH.email)){AUTH.msg={text:"Isi email Anda dulu, lalu ketuk Lupa password.",err:true};render();return}
    AUTH.busy=true;render();
    const {error}=await sb.auth.resetPasswordForEmail(AUTH.email,{redirectTo:BASE});
    AUTH.busy=false;AUTH.msg=error?{text:errMsg(error),err:true}:{text:`Tautan untuk mengatur ulang password sudah dikirim ke ${AUTH.email}.`};render();return}
  if(t.dataset.dtab){DS.tab=t.dataset.dtab;DS.msg=null;DS.confirm=null;DS.profile=null;render();return}
  if(act==="new-listing"){DS.form={data:blankListing()};DS.msg=null;render();window.scrollTo(0,0);return}
  if(act==="close-form"){e.preventDefault();DS.form=null;clearDraft();render();return}
  if(act==="cancel"){DS.confirm=null;DS.confirmSold=null;render();return}
  if(t.dataset.askSold){DS.confirmSold=t.dataset.askSold;DS.confirm=null;render();return}
  if(t.dataset.sold||t.dataset.unsold){
    const id=t.dataset.sold||t.dataset.unsold,l=getL(id),on=!!t.dataset.sold;t.disabled=true;
    const {error}=await sb.from('listings').update({sold_at:on?new Date().toISOString():null}).eq('id',id);
    DS.confirmSold=null;DS.msg=error?{text:errMsg(error),err:true}:{text:on?`Listing ditandai ${soldWord(l).toLowerCase()}. Selamat! Listing tidak lagi tampil di pencarian dan akan dihapus permanen dalam ${SOLD_DAYS} hari.`:"Tanda terjual dibatalkan. Listing tampil lagi di website."};
    await load();return}
  if(t.dataset.similar){const l=getL(t.dataset.similar);Object.assign(F,{q:"",type:l.type,status:l.status,prov:l.prov||"",kab:"",agent:"",budget:"",bed:"",facing:""});location.hash="listing";return}
  if(t.dataset.ask){DS.confirm=t.dataset.ask;render();return}
  if(t.dataset.editListing){
    const l=getL(t.dataset.editListing);if(!l)return;
    DS.form={data:JSON.parse(JSON.stringify(l))};DS.msg=null;
    if(route()!=="dasbor")location.hash="dasbor";else render();window.scrollTo(0,0);return}
  if(t.dataset.renew){
    const ids=t.dataset.renew.split(",").filter(Boolean);t.disabled=true;
    const {error}=await sb.from('listings').update({published:true}).in('id',ids);
    DS.msg=error?{text:errMsg(error),err:true}:{text:ids.length>1?`${ids.length} listing ditayangkan ulang untuk ${EXPIRE_DAYS} hari ke depan.`:`Listing ditayangkan ulang untuk ${EXPIRE_DAYS} hari ke depan.`};
    await load();return}
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
  if(id==="f-q"){F.q=e.target.value;clearTimeout(window.__npq);window.__npq=setTimeout(()=>{if(S.page.key!==fkey())fetchPage(true)},350);return}
  if(id==="l-price"){const el=e.target,pos=el.selectionStart,before=el.value.slice(0,pos).replace(/\D/g,"").length;
    el.value=dots(el.value);let i=0,n=0;while(i<el.value.length&&n<before){if(/\d/.test(el.value[i]))n++;i++}try{el.setSelectionRange(i,i)}catch(_){}}
  if(/^(l-size|l-price)$/.test(id))hints();
  if(e.target.closest&&e.target.closest('#lf'))saveDraft();
});
app.addEventListener('change',async e=>{
  const id=e.target.id;
  if(e.target.closest&&e.target.closest('#lf')&&!/^l-photos/.test(id)&&id!=="l-type")saveDraft();
  if(id==="f-prov"){F.prov=e.target.value;F.kab="";render();return}
  if(id==="l-type"){snapForm();render();const el=document.getElementById('l-type');if(el)el.focus();return}
  const map={"f-status":"status","f-kab":"kab","f-agent":"agent","f-sort":"sort","f-budget":"budget","f-bed":"bed","f-facing":"facing"};
  if(map[id]){F[map[id]]=e.target.value;render();return}
  if(id==="l-photos"||id==="l-photos-file"){
    snapForm();const all=[...e.target.files],picked=all.filter(f=>/^image\//.test(f.type)||/\.(jpe?g|png|webp|gif|heic|heif)$/i.test(f.name));
    if(picked.length<all.length)DS.msg={text:`${all.length-picked.length} file bukan foto sehingga dilewati.`,err:true};
    const room=MAX_PHOTOS-(DS.form.data.photos||[]).length,files=picked.slice(0,Math.max(0,room));
    if(picked.length>files.length)DS.msg={text:`Maksimal ${MAX_PHOTOS} foto per listing. ${picked.length-files.length} foto tidak diunggah.`,err:true};
    if(!files.length){render();return}
    DS.form.uploading=true;render();
    for(const f of files){try{DS.form.data.photos.push(await uploadPhoto(f,"lw-",1280,true))}catch(err){DS.msg={text:"Satu foto gagal diunggah: "+errMsg(err),err:true}}}
    DS.form.uploading=false;render();return}
  if(id==="p-photo"){
    const f=e.target.files[0];if(!f)return;const pf=document.getElementById('pf');DS.profile=Object.assign({},me||{},readForm(pf));
    DS.busy=true;render();
    try{DS.profile.photo_url=await uploadPhoto(f,"avatar-",400)}catch(err){DS.msg={text:"Foto gagal diunggah: "+errMsg(err),err:true}}
    DS.busy=false;render();return}
});
app.addEventListener('submit',async e=>{
  e.preventDefault();const form=e.target;
  if(form.id==="hs"){F.q=(document.getElementById('h-q').value||"").trim();location.hash="listing";return}
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
    snapForm();const d=DS.form.data;
    if(!d.title){DS.msg={text:"Isi judul listing.",err:true};render();return}
    if(!d.prov||!d.kab){DS.msg={text:"Pilih provinsi dan isi kota/kabupaten.",err:true};render();return}
    if(!DS.form.own){DS.msg={text:"Mohon centang pernyataan bahwa listing ini dapat Anda pertanggungjawabkan.",err:true};render();const c=document.getElementById('l-own');if(c)c.scrollIntoView({block:"center"});return}
    const maps=d.type==="Tanah"?String(d.maps_url||"").trim():"";
    if(maps&&!/^https:\/\/([a-z0-9-]+\.)*(google\.[a-z.]+|goo\.gl)\//i.test(maps)){DS.msg={text:"Link lokasi harus link Google Maps, misalnya https://maps.app.goo.gl/… atau https://www.google.com/maps/…",err:true};render();return}
    const row={title:d.title,type:d.type,status:d.status,prov:d.prov,kab:d.kab,place:d.place||null,size:digits(d.size),price:digits(d.price),unit:d.unit,
      cert:d.cert||null,zone:d.zone||null,description:d.description||null,photos:d.photos||[],published:!!d.published,maps_url:maps||null,facing:d.facing||null,
      building_size:hasBuilding(d.type)?digits(d.building_size):null,bedrooms:ROOM_TYPES.includes(d.type)?digits(d.bedrooms):null,bathrooms:ROOM_TYPES.includes(d.type)?digits(d.bathrooms):null};
    DS.busy=true;DS.msg=null;render();
    let id=d.id,error;
    if(id)({error}=await sb.from('listings').update(row).eq('id',id));
    else{const r=await sb.from('listings').insert(row).select('id').single();error=r.error;id=r.data&&r.data.id}
    DS.busy=false;
    if(error&&/maps_url|facing|building_size|bedrooms|bathrooms/.test(error.message||"")){DS.msg={text:"Kolom baru belum ada di database. Admin perlu menjalankan SQL tambahan di Supabase.",err:true};render();return}
    if(error){DS.msg={text:errMsg(error),err:true};render();return}
    DS.form=null;clearDraft();DS.msg={text:row.published?"Listing tersimpan dan tayang.":"Listing tersimpan sebagai draf."};await load();window.scrollTo(0,0);return;
  }
});
window.addEventListener('hashchange',()=>{MENU=false;if(route()!=="dasbor")DS.form=null;REG.done=REG.done&&route()==="daftar";render();window.scrollTo(0,0)});

/* ===== start ===== */
render();
if(sb){
  sb.auth.onAuthStateChange((ev,s)=>{
    const same=session&&s&&session.user.id===s.user.id;
    session=s;
    if(ev==="PASSWORD_RECOVERY")recovery=true;
    // Token diperbarui / tab kembali aktif: jangan muat ulang halaman supaya isian form tidak hilang
    if(same&&(ev==="TOKEN_REFRESHED"||ev==="SIGNED_IN"||ev==="USER_UPDATED"))return;
    setTimeout(async()=>{await ensureAgent();await load();
      if(FROM_LINK&&ev==="SIGNED_IN"&&s&&!recovery&&route()!=="dasbor")location.hash="dasbor"},0);
  });
  load();
}else{S.loaded=true;S.error="Layanan data tidak termuat. Muat ulang halaman.";render()}
})();
