// Membangun halaman statis untuk SEO & GEO dari database Supabase.
// Dijalankan oleh GitHub Actions (lihat .github/workflows/build-pages.yml).
// Uji lokal tanpa internet:  MOCK=1 node scripts/build.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SITE_URL = "https://nusantara.properties";
const SB_URL = "https://mpyspcofrekhnbkxzucr.supabase.co";
const SB_KEY = "sb_publishable_cFs5F-kTzR39URtsdFKhGg_mXN7cObN";
const EXPIRE_DAYS = 60;
const NOW = new Date();
const CSSV = Date.now().toString(36);

/* ---------- muat i18n.js & pages.js di sandbox ---------- */
function loadPages(lang) {
  const store = { "np-lang": lang };
  const ctx = {
    localStorage: { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; } },
    document: { documentElement: {} }, fetch: () => Promise.reject(new Error("offline")),
    console
  };
  ctx.window = ctx;
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "src/i18n.js"), "utf8"), ctx);
  vm.runInContext(fs.readFileSync(path.join(ROOT, "src/pages.js"), "utf8"), ctx);
  return { I: ctx.NP_I18N, P: ctx.NP_PAGES };
}
const L = { id: loadPages("id"), en: loadPages("en") };

/* ---------- data ---------- */
async function getData() {
  if (process.env.MOCK) return JSON.parse(fs.readFileSync(path.join(ROOT, "scripts/mock.json"), "utf8"));
  const h = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };
  const get = async q => {
    const out = [];
    for (let from = 0; ; from += 1000) {
      const r = await fetch(`${SB_URL}/rest/v1/${q}`, { headers: { ...h, Range: `${from}-${from + 999}`, "Range-Unit": "items" } });
      if (!r.ok && r.status !== 206) throw new Error(`${q}: ${r.status} ${await r.text()}`);
      const rows = await r.json(); out.push(...rows);
      if (rows.length < 1000) break;
    }
    return out;
  };
  const agents = await get("agents?select=id,name,agency,phone,prov,kab,areas,since,bio,photo_url,status&status=eq.approved");
  const listings = await get("listings?select=*&published=eq.true&order=created_at.desc");
  return { agents, listings };
}

/* ---------- helpers ---------- */
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70) || "x";
const num = (n, lang) => Number(n).toLocaleString(lang === "en" ? "en-GB" : "id-ID");
function rupiah(v, lang) {
  if (v == null || v === "") return ""; v = Number(v); const e = lang === "en", Lc = e ? "en-GB" : "id-ID";
  if (v >= 1e12) return "Rp " + (v / 1e12).toLocaleString(Lc, { maximumFractionDigits: 2 }) + " T";
  if (v >= 1e9) return "Rp " + (v / 1e9).toLocaleString(Lc, { maximumFractionDigits: 2 }) + (e ? " B" : " M");
  if (v >= 1e6) return "Rp " + (v / 1e6).toLocaleString(Lc, { maximumFractionDigits: 1 }) + (e ? " M" : " jt");
  return "Rp " + num(v, lang);
}
const wa = p => { let d = String(p || "").replace(/\D/g, ""); if (d.startsWith("0")) d = "62" + d.slice(1); return d; };
const tr = (s, lang) => (lang === "en" ? L.en.I.t(s) : s);
const titleOf = (l, lang) => (lang === "en" ? L.en.I.gloss(l.title) : l.title);
const fmtDate = (d, lang) => new Date(d).toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", { day: "numeric", month: "long", year: "numeric" });
const hasBuilding = t => t && t !== "Tanah";
const ROOM = ["Rumah", "Villa", "Apartemen", "Ruko"];
const UNITS = { total: "", are: "/ are", tahun: "/ tahun" };
const loc = l => [l.place, l.kab, l.prov].filter(Boolean).join(", ");
const clip = (s, n) => { s = String(s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : s; };
const isLive = l => l.published && !l.sold_at && (NOW - new Date(l.updated_at || l.created_at)) / 864e5 < EXPIRE_DAYS;

const listingSlug = l => `${slug(l.title)}-${String(l.id).slice(0, 6)}`;
const listingPath = (l, lang) => (lang === "en" ? `/en/listing/${listingSlug(l)}/` : `/listing/${listingSlug(l)}/`);
const catKey = l => `${l.type}|${l.status}|${l.prov}`;
function catPath(type, status, prov, lang) {
  if (lang === "en") return `/en/property/${slug(tr(type, "en"))}-${slug(tr(status, "en"))}-${slug(prov)}/`;
  return `/properti/${slug(type)}-${slug(status)}-${slug(prov)}/`;
}
function catTitle(type, status, prov, lang) {
  if (lang === "en") return `${tr(type, "en")} ${status === "Disewakan" ? "for Rent" : "for Sale"} in ${prov}`;
  return `${type} ${status} di ${prov}`;
}
function priceText(l, lang) {
  if (l.price == null || l.price === "") return lang === "en" ? "Price on request" : "Harga: tanya agen";
  return `${rupiah(l.price, lang)}${UNITS[l.unit] ? " " + tr(UNITS[l.unit], lang) : ""}`;
}

/* ---------- layout ---------- */
const NAV = {
  id: [["/", "Beranda"], ["/listing/", "Listing"], ["/berita/", "Berita"], ["/panduan/", "Panduan"], ["/tentang/", "Tentang kami"], ["/faq/", "FAQ"]],
  en: [["/en/", "Home"], ["/en/listings/", "Listings"], ["/en/news/", "News"], ["/en/guide/", "Guide"], ["/en/about/", "About us"], ["/en/faq/", "FAQ"]]
};
function layout({ lang, title, desc, pathId, pathEn, body, jsonld = [], image, type = "website", noindex = false }) {
  const url = SITE_URL + (lang === "en" ? pathEn : pathId);
  const nav = NAV[lang].map(([h, t]) => `<a href="${h}">${t}</a>`).join("");
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<link rel="alternate" hreflang="id" href="${SITE_URL}${pathId}">
<link rel="alternate" hreflang="en" href="${SITE_URL}${pathEn}">
<link rel="alternate" hreflang="x-default" href="${SITE_URL}${pathId}">
<meta name="robots" content="${noindex ? "noindex,follow" : "index,follow,max-image-preview:large"}">
<meta name="theme-color" content="#0A2845">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="Nusantara Property">
<meta property="og:locale" content="${lang === "en" ? "en_US" : "id_ID"}">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${esc(image || SITE_URL + "/assets/og-image.png?v=2")}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico?v=2" sizes="any"><link rel="icon" href="/assets/favicon.png?v=2" type="image/png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png?v=2">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>:root{color-scheme:light}body{margin:0}img{max-width:100%}</style>
<link rel="stylesheet" href="/assets/site.css?v=${CSSV}">
${jsonld.map(j => `<script type="application/ld+json">${JSON.stringify(j).replace(/</g, "\\u003c")}</script>`).join("\n")}
</head>
<body>
<header class="bar"><div class="wrap">
  <a class="brand" href="${lang === "en" ? "/en/" : "/"}"><picture><source srcset="/assets/np-mark-light.png?v=2" media="(prefers-color-scheme: dark)"><img class="brand-mark" src="/assets/np-mark.png?v=2" alt="" width="30" height="30"></picture>Nusantara Property</a>
  <nav class="mainnav static-nav" aria-label="${lang === "en" ? "Main menu" : "Menu utama"}">${nav}</nav>
  <div class="nav"><div class="lang"><a href="${pathId}" ${lang === "id" ? 'aria-current="true"' : ""}>ID</a><a href="${pathEn}" ${lang === "en" ? 'aria-current="true"' : ""}>EN</a></div></div>
</div></header>
<main>${body}</main>
<footer class="foot"><div class="wrap"><span>© ${NOW.getFullYear()} Nusantara Property · ${lang === "en" ? "Listing information is provided by each agent." : "Informasi listing dari masing-masing agen."}</span>
<span class="static-links">${NAV[lang].map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")}</span></div></footer>
</body>
</html>`;
}

/* ---------- listing pages ---------- */
function specRows(l, lang) {
  const T = s => tr(s, lang), r = [];
  r.push([T("Jenis"), `${T(l.type)} · ${T(l.status)}`]);
  if (l.size) r.push([T(hasBuilding(l.type) ? "Luas tanah" : "Luas"), `${num(l.size, lang)} m² (${num(Math.round(l.size) / 100, lang)} are)`]);
  if (hasBuilding(l.type) && l.building_size) r.push([T("Luas bangunan"), `${num(l.building_size, lang)} m²`]);
  if (ROOM.includes(l.type) && l.bedrooms != null) r.push([T("Kamar tidur"), String(l.bedrooms)]);
  if (ROOM.includes(l.type) && l.bathrooms != null) r.push([T("Kamar mandi"), String(l.bathrooms)]);
  if (l.facing) r.push([T("Hadap"), T(l.facing)]);
  if (l.cert) r.push([T("Sertifikat"), T(l.cert)]);
  if (l.zone) r.push([T("Zonasi"), T(l.zone)]);
  if (l.place) r.push([T("Lokasi"), l.place]);
  if (l.kab) r.push([T("Kota/kabupaten"), l.kab]);
  if (l.prov) r.push([T("Provinsi"), l.prov]);
  r.push([T("Harga"), priceText(l, lang)]);
  if (l.price && l.unit === "total" && l.size && l.type === "Tanah") r.push([T("Harga per are"), rupiah(l.price / (l.size / 100), lang)]);
  r.push([T("Tanggal tayang"), fmtDate(l.created_at, lang)]);
  return r;
}
function metaDesc(l, lang) {
  const e = lang === "en";
  const parts = [e ? `${tr(l.type, "en")} ${l.status === "Disewakan" ? "for rent" : "for sale"} in ${loc(l)}.` : `${l.type} ${l.status.toLowerCase()} di ${loc(l)}.`];
  if (l.size) parts.push(`${e ? "Size" : "Luas"} ${num(l.size, lang)} m² (${num(Math.round(l.size) / 100, lang)} are).`);
  if (hasBuilding(l.type) && l.building_size) parts.push(`${e ? "Building" : "Bangunan"} ${num(l.building_size, lang)} m².`);
  if (l.bedrooms != null && ROOM.includes(l.type)) parts.push(`${l.bedrooms} ${e ? "bed" : "KT"}${l.bathrooms != null ? `, ${l.bathrooms} ${e ? "bath" : "KM"}` : ""}.`);
  if (l.cert) parts.push(`${l.cert}.`);
  if (l.zone) parts.push(`${e ? "Zoning" : "Zona"} ${tr(l.zone, lang).toLowerCase()}.`);
  parts.push(priceText(l, lang) + ".");
  return clip(parts.join(" "), 160);
}
function schemaFor(l, ag, lang, url) {
  const e = lang === "en";
  const placeType = { Tanah: "Place", Rumah: "SingleFamilyResidence", Villa: "House", Apartemen: "Apartment", Ruko: "Place", Gudang: "Place", Komersial: "Place" }[l.type] || "Place";
  const item = {
    "@type": placeType, name: titleOf(l, lang),
    address: { "@type": "PostalAddress", streetAddress: l.place || undefined, addressLocality: l.kab || undefined, addressRegion: l.prov || undefined, addressCountry: "ID" }
  };
  if (hasBuilding(l.type) && l.building_size) item.floorSize = { "@type": "QuantitativeValue", value: Number(l.building_size), unitCode: "MTK" };
  if (ROOM.includes(l.type) && l.bedrooms != null) item.numberOfBedrooms = Number(l.bedrooms);
  if (ROOM.includes(l.type) && l.bathrooms != null) item.numberOfBathroomsTotal = Number(l.bathrooms);
  if (l.maps_url) item.hasMap = l.maps_url;
  const add = [];
  if (l.size) add.push({ "@type": "PropertyValue", name: e ? "Land size" : "Luas tanah", value: Number(l.size), unitCode: "MTK" });
  if (l.cert) add.push({ "@type": "PropertyValue", name: e ? "Land title" : "Sertifikat", value: l.cert });
  if (l.zone) add.push({ "@type": "PropertyValue", name: e ? "Zoning" : "Zonasi", value: tr(l.zone, lang) });
  if (l.facing) add.push({ "@type": "PropertyValue", name: e ? "Facing" : "Hadap", value: tr(l.facing, lang) });
  if (add.length) item.additionalProperty = add;
  const offer = { "@type": "Offer", priceCurrency: "IDR", availability: "https://schema.org/InStock",
    businessFunction: l.status === "Disewakan" ? "http://purl.org/goodrelations/v1#LeaseOut" : "http://purl.org/goodrelations/v1#Sell",
    offeredBy: ag ? { "@type": "RealEstateAgent", name: ag.name, ...(ag.agency ? { parentOrganization: { "@type": "Organization", name: ag.agency } } : {}) } : undefined };
  if (l.price) offer.price = Number(l.price);
  return [{
    "@context": "https://schema.org", "@type": "RealEstateListing", url, name: titleOf(l, lang), inLanguage: lang,
    description: clip(l.description || metaDesc(l, lang), 500), datePosted: l.created_at, dateModified: l.updated_at || l.created_at,
    image: (l.photos || []).slice(0, 5), about: item, offers: offer,
    isPartOf: { "@type": "WebSite", "@id": SITE_URL + "/#website" }, provider: { "@id": SITE_URL + "/#org" }
  }, breadcrumbs(lang, [[lang === "en" ? "Listings" : "Listing", lang === "en" ? "/en/listings/" : "/listing/"], [catTitle(l.type, l.status, l.prov, lang), catPath(l.type, l.status, l.prov, lang)], [titleOf(l, lang), listingPath(l, lang)]])];
}
function breadcrumbs(lang, items) {
  const home = [[lang === "en" ? "Home" : "Beranda", lang === "en" ? "/en/" : "/"]];
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [...home, ...items].map(([n, p], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: SITE_URL + p })) };
}
function crumbsHtml(lang, items) {
  const home = [[lang === "en" ? "Home" : "Beranda", lang === "en" ? "/en/" : "/"]];
  return `<nav class="crumbs" aria-label="Breadcrumb">${[...home, ...items].map(([n, p], i, a) => i === a.length - 1 ? `<span aria-current="page">${esc(n)}</span>` : `<a href="${p}">${esc(n)}</a>`).join(" › ")}</nav>`;
}
function cardHtml(l, lang) {
  const img = (l.photos || [])[0];
  const spec = [l.size ? `${num(l.size, lang)} m²` : "", hasBuilding(l.type) && l.building_size ? `${lang === "en" ? "Bldg" : "LB"} ${num(l.building_size, lang)} m²` : "", l.cert || ""].filter(Boolean).join(" · ");
  return `<a class="card" href="${listingPath(l, lang)}"><div class="media">${img ? `<img src="${esc(img)}" alt="${esc(titleOf(l, lang))}" loading="lazy">` : `<div class="plot" aria-hidden="true"><div class="shape" style="width:60%;aspect-ratio:1.3"><div><div class="big">${l.size ? num(Math.round(l.size) / 100, lang) + " are" : esc(tr(l.type, lang))}</div></div></div></div>`}<div class="tags"><span class="tag">${esc(tr(l.type, lang))}</span>${l.status === "Disewakan" ? `<span class="tag sewa">${esc(tr("Disewakan", lang))}</span>` : ""}</div></div>
  <div class="card-body"><h3>${esc(titleOf(l, lang))}</h3><div class="loc">${esc(loc(l))}</div><div class="specs">${esc(spec)}</div><div class="price${l.price ? "" : " ask"}">${esc(priceText(l, lang))}</div></div></a>`;
}
function listingPage(l, ag, all, lang) {
  const e = lang === "en", T = s => tr(s, lang);
  const pid = listingPath(l, "id"), pen = listingPath(l, "en"), url = SITE_URL + (e ? pen : pid);
  const pics = l.photos || [];
  const related = all.filter(x => x.id !== l.id && x.prov === l.prov).slice(0, 3);
  const waText = e ? `Hello ${ag ? ag.name : ""}, I'm interested in your listing "${titleOf(l, lang)}" (${l.place || l.kab}) on Nusantara Property. Could you share more details?`
    : `Halo ${ag ? ag.name : ""}, saya tertarik dengan listing "${l.title}" (${l.place || l.kab}) di Nusantara Property. Boleh minta info detail?`;
  const crumbs = [[e ? "Listings" : "Listing", e ? "/en/listings/" : "/listing/"], [catTitle(l.type, l.status, l.prov, lang), catPath(l.type, l.status, l.prov, lang)], [titleOf(l, lang), e ? pen : pid]];
  const body = `<div class="wrap">${crumbsHtml(lang, crumbs)}
  <article class="detail"><div>
    <div class="gallery"><div class="main">${pics.length ? `<img src="${esc(pics[0])}" alt="${esc(titleOf(l, lang))}">` : `<div class="plot" aria-hidden="true"><div class="shape" style="width:55%;aspect-ratio:1.4"><div><div class="big">${l.size ? num(Math.round(l.size) / 100, lang) + " are" : esc(T(l.type))}</div></div></div></div>`}</div>
      ${pics.length > 1 ? `<div class="thumbs static-thumbs">${pics.slice(1).map((p, i) => `<img src="${esc(p)}" alt="${esc(titleOf(l, lang))} – ${e ? "photo" : "foto"} ${i + 2}" loading="lazy">`).join("")}</div>` : ""}</div>
    <div class="label" style="margin-top:22px">${esc([l.place, l.kab, l.prov].filter(Boolean).join(" · "))}</div>
    <h1 class="d-title">${esc(titleOf(l, lang))}</h1>
    ${e && titleOf(l, lang) !== l.title ? `<p class="hint" style="margin:6px 0 0">${esc(l.title)}</p>` : ""}
    <div class="d-price${l.price ? "" : " ask"}">${esc(priceText(l, lang))}</div>
    <table class="facts"><tbody>${specRows(l, lang).map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</tbody></table>
    ${l.description ? `<h2 class="sub">${e ? "Description" : "Deskripsi"}</h2><p class="desc" style="margin-top:6px">${esc(l.description)}</p>` : ""}
    ${l.maps_url && /^https:\/\//.test(l.maps_url) ? `<a class="btn btn-line maps-btn" href="${esc(l.maps_url)}" target="_blank" rel="noopener">${e ? "View location on Google Maps" : "Lihat lokasi di Google Maps"}</a>` : ""}
  </div>
  <aside class="side">
    <div class="panel"><div class="label">${e ? "Listing agent" : "Agen listing ini"}</div>
      <div class="who">${ag && ag.photo_url ? `<span class="ava lg"><img src="${esc(ag.photo_url)}" alt=""></span>` : `<span class="ava lg">${esc(String(ag ? ag.name : "A").slice(0, 1))}</span>`}<span><b style="font-size:17px">${esc(ag ? ag.name : "")}</b><br><span style="color:var(--muted)">${esc(ag && ag.agency || "")}</span></span></div>
      ${ag && ag.phone ? `<a class="btn btn-wa" href="https://wa.me/${wa(ag.phone)}?text=${encodeURIComponent(waText)}" target="_blank" rel="noopener">${e ? "Ask on WhatsApp" : "Tanya via WhatsApp"}</a>` : ""}
      <a class="btn btn-line" href="/#${esc(l.id)}">${e ? "Open in the app (PDF brochure)" : "Buka di aplikasi (brosur PDF)"}</a>
    </div>
  </aside></article>
  ${related.length ? `<section class="section-head"><h2>${e ? `More listings in ${esc(l.prov)}` : `Listing lain di ${esc(l.prov)}`}</h2><a class="btn btn-line btn-sm" href="${catPath(l.type, l.status, l.prov, lang)}">${esc(catTitle(l.type, l.status, l.prov, lang))}</a></section><div class="grid">${related.map(x => cardHtml(x, lang)).join("")}</div>` : ""}
  </div>`;
  return layout({ lang, title: `${titleOf(l, lang)} – ${[l.kab, l.prov].filter(Boolean).join(", ")} | Nusantara Property`, desc: metaDesc(l, lang), pathId: pid, pathEn: pen, body, jsonld: schemaFor(l, ag, lang, url), image: pics[0], type: "article" });
}

/* ---------- index & category pages ---------- */
function catalogPage(list, lang, { title, h1, intro, pathId, pathEn, crumbs }) {
  const e = lang === "en";
  const byProv = {};
  list.forEach(l => { (byProv[l.prov || "-"] ||= []).push(l); });
  const cats = {};
  list.forEach(l => { cats[catKey(l)] = (cats[catKey(l)] || 0) + 1; });
  const catLinks = Object.entries(cats).map(([k, n]) => { const [t, s, p] = k.split("|"); return `<a class="chip" href="${catPath(t, s, p, lang)}">${esc(catTitle(t, s, p, lang))}<span class="n">${n}</span></a>`; }).join("");
  const body = `<div class="wrap page">${crumbsHtml(lang, crumbs)}<header class="page-head"><div class="label">${e ? "Listings" : "Listing"}</div><h1>${esc(h1)}</h1><p>${esc(intro)}</p></header>
   ${catLinks ? `<div class="chips" style="margin-bottom:22px">${catLinks}</div>` : ""}
   ${list.length ? `<div class="grid">${list.map(l => cardHtml(l, lang)).join("")}</div>` : `<div class="empty">${e ? "No listings yet." : "Belum ada listing."}</div>`}
   <div class="cta-band" style="margin-top:28px"><p>${e ? "<b>Search and filter all listings</b> by budget, bedrooms, facing and more." : "<b>Cari dan saring semua listing</b> berdasarkan budget, kamar tidur, arah hadap, dan lainnya."}</p><a class="btn btn-primary" href="/#listing">${e ? "Open the listing search" : "Buka pencarian listing"}</a></div></div>`;
  const itemList = { "@context": "https://schema.org", "@type": "ItemList", name: h1, numberOfItems: list.length, itemListElement: list.map((l, i) => ({ "@type": "ListItem", position: i + 1, url: SITE_URL + listingPath(l, lang), name: titleOf(l, lang) })) };
  return layout({ lang, title, desc: clip(intro, 160), pathId, pathEn, body, jsonld: [itemList, breadcrumbs(lang, crumbs.map(c => c))] });
}

/* ---------- content pages from pages.js ---------- */
function fixLinks(html) {
  return html.replace(/href="#panduan" data-goto="([^"]+)"/g, 'href="#g-$1"')
    .replace(/href="#(listing|daftar|masuk|dasbor|agen|berita|panduan|tentang|faq)?"/g, (m, r) => `href="/#${r || ""}"`);
}
function contentPages(stats) {
  const out = [];
  const defs = [
    ["guide", "/panduan/", "/en/guide/", { id: ["Panduan membeli properti di Indonesia | Nusantara Property", "Cara membeli tanah dan rumah di Indonesia: jenis sertifikat SHM, SHGB, Hak Pakai, cek legalitas di BPN, biaya BPHTB dan PPh, alur AJB, KPR, dan aturan untuk WNA."],
      en: ["Guide to buying property in Indonesia | Nusantara Property", "How to buy land and houses in Indonesia: SHM, SHGB and Hak Pakai titles, legal checks at the land office, BPHTB and income tax, the deed of sale, mortgages, and rules for foreign buyers."] }],
    ["faq", "/faq/", "/en/faq/", { id: ["FAQ – Pertanyaan yang sering diajukan | Nusantara Property", "Jawaban untuk pembeli dan agen: cara menghubungi agen, arti warna zonasi, cara daftar sebagai agen, aturan 60 hari, dan batas foto listing."],
      en: ["FAQ – Frequently asked questions | Nusantara Property", "Answers for buyers and agents: contacting agents, zoning colours, joining as an agent, the 60-day rule and listing photo limits."] }],
    ["about", "/tentang/", "/en/about/", { id: ["Tentang Nusantara Property – Platform properti dari pengalaman lapangan", "Nusantara Property adalah platform listing properti multi-agen untuk seluruh Indonesia, dibangun dari pengalaman lapangan sejak 2009 di Bali."],
      en: ["About Nusantara Property – A property platform built from field experience", "Nusantara Property is a multi-agent property listing platform for all of Indonesia, built from field experience in Bali since 2009."] }],
    ["news", "/berita/", "/en/news/", { id: ["Berita properti Indonesia | Nusantara Property", "Ringkasan berita pasar properti Indonesia: suku bunga BI Rate, kredit KPR, harga rumah, dan insentif pajak PPN."],
      en: ["Indonesian property news | Nusantara Property", "Indonesian property market news: BI Rate, mortgage lending, house prices and VAT incentives."] }]
  ];
  for (const [kind, pid, pen, meta] of defs) {
    for (const lang of ["id", "en"]) {
      const { P } = L[lang];
      const site = { name: "Nusantara Property", adminPhone: "0812868080" };
      let html = kind === "guide" ? P.guide() : kind === "faq" ? P.faq(site) : kind === "about" ? P.about(site, stats) : P.news();
      html = fixLinks(html);
      const jsonld = [breadcrumbs(lang, [[meta[lang][0].split(" | ")[0].split(" – ")[0], lang === "en" ? pen : pid]])];
      if (kind === "faq") {
        const F = lang === "en" ? P.DATA.FAQ_EN : P.DATA.FAQ_ID;
        jsonld.push({ "@context": "https://schema.org", "@type": "FAQPage", inLanguage: lang, mainEntity: F.flatMap(g => g.items.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))) });
      }
      if (kind === "guide") jsonld.push({ "@context": "https://schema.org", "@type": "Article", headline: meta[lang][0].split(" | ")[0], inLanguage: lang, author: { "@id": SITE_URL + "/#org" }, publisher: { "@id": SITE_URL + "/#org" }, dateModified: NOW.toISOString().slice(0, 10) });
      if (kind === "news") { const N = lang === "en" ? P.DATA.NEWS_EN : P.DATA.NEWS_ID; jsonld.push(...N.map(n => ({ "@context": "https://schema.org", "@type": "NewsArticle", headline: n.title, datePublished: n.date, description: n.summary, inLanguage: lang, isBasedOn: n.url, publisher: { "@id": SITE_URL + "/#org" } }))); }
      out.push([lang === "en" ? pen : pid, layout({ lang, title: meta[lang][0], desc: meta[lang][1], pathId: pid, pathEn: pen, body: html, jsonld })]);
    }
  }
  return out;
}

/* ---------- home prerender & EN home ---------- */
function homeBlock(list, lang) {
  const e = lang === "en";
  return `<section class="wrap hero"><h1>${e ? "Indonesian property, <em>straight from the agent.</em>" : "Properti Indonesia, <em>langsung dari agennya.</em>"}</h1>
  <p>${e ? "Land, houses, villas and commercial property for sale or rent in Bali and across Indonesia, straight from verified property agents. Contact the agent on WhatsApp." : "Jual beli tanah, rumah, villa, dan properti komersial di Bali dan seluruh Indonesia, langsung dari agen properti terverifikasi. Hubungi agennya lewat WhatsApp."}</p></section>
  <section class="wrap"><div class="section-head"><div><div class="label">${e ? "Just listed" : "Baru tayang"}</div><h2>${e ? "Latest listings" : "Listing terbaru"}</h2></div><a class="btn btn-line btn-sm" href="${e ? "/en/listings/" : "/listing/"}">${e ? "View all listings" : "Lihat semua listing"}</a></div>
  <div class="grid">${list.slice(0, 9).map(l => cardHtml(l, lang)).join("")}</div></section>
  <section class="wrap"><nav class="static-links" style="padding-block:20px">${NAV[lang].map(([h, t]) => `<a href="${h}">${t}</a>`).join(" · ")}</nav></section>`;
}

/* ---------- main ---------- */
const { agents, listings } = await getData();
const agentOf = id => agents.find(a => a.id === id);
const live = listings.filter(l => isLive(l) && agentOf(l.agent_id));
console.log(`agen: ${agents.length}, listing tayang: ${live.length}`);

for (const d of ["listing", "en", "properti", "panduan", "faq", "tentang", "berita"]) fs.rmSync(path.join(ROOT, d), { recursive: true, force: true });
const files = [];
const write = (p, html) => { const f = path.join(ROOT, p, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); files.push(p); };

for (const l of live) for (const lang of ["id", "en"]) write(listingPath(l, lang), listingPage(l, agentOf(l.agent_id), live, lang));

const groups = {};
live.forEach(l => (groups[catKey(l)] ||= []).push(l));
for (const [k, list] of Object.entries(groups)) {
  const [t, s, p] = k.split("|");
  for (const lang of ["id", "en"]) {
    const h1 = catTitle(t, s, p, lang);
    const kabs = [...new Set(list.map(l => l.kab).filter(Boolean))].join(", ");
    const intro = lang === "en" ? `${list.length} ${tr(t, "en").toLowerCase()} listing${list.length > 1 ? "s" : ""} ${s === "Disewakan" ? "for rent" : "for sale"} in ${p}${kabs ? ` (${kabs})` : ""}, posted directly by verified agents on Nusantara Property. Each listing shows the land title, zoning, size in m² and are, and a WhatsApp contact.`
      : `${list.length} listing ${t.toLowerCase()} ${s.toLowerCase()} di ${p}${kabs ? ` (${kabs})` : ""}, dipasang langsung oleh agen terverifikasi di Nusantara Property. Setiap listing mencantumkan sertifikat, zonasi, luas dalam m² dan are, serta kontak WhatsApp agen.`;
    write(catPath(t, s, p, lang), catalogPage(list, lang, { title: `${h1} | Nusantara Property`, h1, intro, pathId: catPath(t, s, p, "id"), pathEn: catPath(t, s, p, "en"), crumbs: [[lang === "en" ? "Listings" : "Listing", lang === "en" ? "/en/listings/" : "/listing/"], [h1, catPath(t, s, p, lang)]] }));
  }
}
for (const lang of ["id", "en"]) {
  const e = lang === "en";
  const provs = [...new Set(live.map(l => l.prov).filter(Boolean))];
  const h1 = e ? "Property listings across Indonesia" : "Listing properti di seluruh Indonesia";
  const intro = e ? `${live.length} live listings of land, houses, villas and commercial property${provs.length ? ` in ${provs.join(", ")}` : ""}, from verified agents. Listings not updated for ${EXPIRE_DAYS} days are removed automatically, so everything here is current.`
    : `${live.length} listing tanah, rumah, villa, dan properti komersial yang sedang tayang${provs.length ? ` di ${provs.join(", ")}` : ""}, dari agen terverifikasi. Listing yang tidak diperbarui ${EXPIRE_DAYS} hari otomatis diturunkan, jadi semua yang tampil di sini masih berlaku.`;
  write(e ? "/en/listings/" : "/listing/", catalogPage(live, lang, { title: `${h1} | Nusantara Property`, h1, intro, pathId: "/listing/", pathEn: "/en/listings/", crumbs: [[e ? "Listings" : "Listing", e ? "/en/listings/" : "/listing/"]] }));
}
const stats = { listings: live.length, agents: agents.length, provs: new Set(live.map(l => l.prov).filter(Boolean)).size };
for (const [p, html] of contentPages(stats)) write(p, html);

// EN home (static, links into the app)
write("/en/", layout({ lang: "en", title: "Nusantara Property – Land, Houses & Villas for Sale in Bali and Across Indonesia", desc: "Find land, houses, villas and commercial property for sale or rent in Bali and across Indonesia, with land title, zoning and size, straight from verified agents.", pathId: "/", pathEn: "/en/",
  body: homeBlock(live, "en") + `<div class="wrap"><div class="cta-band"><p><b>Search, filter and contact agents</b> in the full app.</p><a class="btn btn-primary" href="/#listing">Open Nusantara Property</a></div></div>` }));

// prerender block in index.html
const idx = path.join(ROOT, "index.html");
let ih = fs.readFileSync(idx, "utf8");
ih = ih.replace(/<!--PRERENDER-->[\s\S]*?<!--\/PRERENDER-->/, `<!--PRERENDER--><div class="prerender">${homeBlock(live, "id")}</div><!--/PRERENDER-->`);
fs.writeFileSync(idx, ih);

// sitemap
const urls = [["/", 1.0], ...files.map(f => [f, f.includes("/listing/") && f.split("/").filter(Boolean).length > 1 ? 0.8 : 0.7])];
const lastmod = NOW.toISOString().slice(0, 10);
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, p]) => `<url><loc>${SITE_URL}${u}</loc><lastmod>${lastmod}</lastmod><priority>${p.toFixed(1)}</priority></url>`).join("\n")}
</urlset>
`);

// llms.txt
const line = (l, lang) => `- [${titleOf(l, lang)}](${SITE_URL}${listingPath(l, lang)}): ${tr(l.type, lang)} · ${tr(l.status, lang)} · ${loc(l)}${l.size ? ` · ${num(l.size, lang)} m²` : ""}${l.cert ? ` · ${l.cert}` : ""} · ${priceText(l, lang)}`;
fs.writeFileSync(path.join(ROOT, "llms.txt"), `# Nusantara Property

> Nusantara Property (${SITE_URL}) adalah platform listing properti multi-agen untuk seluruh Indonesia: tanah, rumah, villa, apartemen, ruko, gudang, dan properti komersial, dijual maupun disewakan. Setiap agen diverifikasi admin, setiap listing mencantumkan sertifikat, zonasi, luas (m² dan are), dan kontak WhatsApp agen. Listing yang tidak diperbarui ${EXPIRE_DAYS} hari otomatis diturunkan.
> English: a multi-agent property listing platform for Indonesia (land, houses, villas, commercial), with verified agents, land title and zoning on every listing, and listings removed automatically after ${EXPIRE_DAYS} days without an update.

Diperbarui / updated: ${lastmod}. Jumlah listing tayang / live listings: ${live.length}.

## Halaman utama / Key pages
- [Semua listing](${SITE_URL}/listing/) · [All listings (English)](${SITE_URL}/en/listings/)
- [Panduan membeli properti di Indonesia](${SITE_URL}/panduan/): sertifikat SHM/SHGB/Hak Pakai, cek BPN, BPHTB & PPh, alur AJB, KPR, aturan WNA
- [Guide to buying property in Indonesia](${SITE_URL}/en/guide/)
- [FAQ](${SITE_URL}/faq/) · [FAQ (English)](${SITE_URL}/en/faq/)
- [Tentang kami](${SITE_URL}/tentang/) · [About us](${SITE_URL}/en/about/)
- [Berita properti](${SITE_URL}/berita/) · [Property news](${SITE_URL}/en/news/)

## Kategori / Categories
${Object.keys(groups).map(k => { const [t, s, p] = k.split("|"); return `- [${catTitle(t, s, p, "id")}](${SITE_URL}${catPath(t, s, p, "id")}) · [${catTitle(t, s, p, "en")}](${SITE_URL}${catPath(t, s, p, "en")})`; }).join("\n")}

## Listing
${live.map(l => line(l, "id")).join("\n")}

## Listings (English)
${live.map(l => line(l, "en")).join("\n")}
`);
console.log(`halaman dibuat: ${files.length}`);
