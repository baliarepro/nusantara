#!/usr/bin/env python3
"""Posting otomatis listing Nusantara Property ke Instagram.

Dijalankan oleh GitHub Actions (.github/workflows/ig-post.yml) dalam dua tahap:
  python3 scripts/ig_post.py prepare   -> siapkan gambar 1080x1350 di folder ig/<id>/ (lalu di-push)
  python3 scripts/ig_post.py publish   -> posting ke Instagram, catat hasil di data/ig-posted.json

Uji lokal tanpa internet:  MOCK=1 python3 scripts/ig_post.py prepare
Token Instagram dibaca dari secret IG_TOKEN (tidak pernah ditulis ke file atau log).
"""
import io, json, os, re, sys, time, textwrap, urllib.parse, urllib.request
from datetime import datetime, timezone, timedelta

from PIL import Image, ImageDraw, ImageFont, ImageFilter

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE_URL = "https://nusantara.properties"
RAW_URL = "https://raw.githubusercontent.com/baliarepro/nusantara/main"
SB_URL = "https://mpyspcofrekhnbkxzucr.supabase.co"
SB_KEY = "sb_publishable_cFs5F-kTzR39URtsdFKhGg_mXN7cObN"
IG_USER_ID = os.environ.get("IG_USER_ID", "17841480190512234")
EXPIRE_DAYS = 60
MAX_PER_RUN = int(os.environ.get("IG_MAX_PER_RUN", "2"))
MAX_FAILS = 3
W, H = 1080, 1350  # rasio 4:5, ukuran feed Instagram

POSTED_F = os.path.join(ROOT, "data", "ig-posted.json")
QUEUE_F = os.path.join(ROOT, "ig", "queue.json")
LOG_F = os.path.join(ROOT, "data", "ig-log.json")
FONT_F = os.path.join(ROOT, "assets", "fonts", "PlusJakartaSans.ttf")
LOGO_F = os.path.join(ROOT, "assets", "np-mark-light.png")

NAVY = (10, 40, 69)
GOLD = (230, 169, 87)
UNITS = {"total": "", "are": "/ are", "m2": "/ m²", "tahun": "/ tahun", "are_tahun": "/ are / tahun"}
HAS_BUILDING = {"Rumah", "Villa", "Ruko", "Apartemen", "Gudang", "Hotel", "Kantor", "Bangunan"}


# ---------- utilitas ----------
def now():
    return datetime.now(timezone.utc)


def load_json(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def log(event, **kw):
    entries = load_json(LOG_F, [])
    entries.append({"at": now().isoformat(timespec="seconds"), "event": event, **kw})
    save_json(LOG_F, entries[-80:])
    print(event, json.dumps(kw, ensure_ascii=False)[:500])


def http(url, data=None, headers=None, timeout=60):
    body = None
    if data is not None:
        body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(url, data=body, headers=headers or {}, method="POST" if data is not None else "GET")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, r.read(), r.headers
    except urllib.error.HTTPError as e:
        return e.code, e.read(), e.headers


def num(n):
    return f"{int(round(float(n))):,}".replace(",", ".")


def rupiah_full(v):
    return "Rp " + num(v)


def rupiah_short(v):
    v = float(v)
    for lim, suf in ((1e12, " T"), (1e9, " M"), (1e6, " jt")):
        if v >= lim:
            s = f"{v / lim:.2f}".rstrip("0").rstrip(".").replace(".", ",")
            return "Rp " + s + suf
    return rupiah_full(v)


def wa_digits(p):
    d = re.sub(r"\D", "", str(p or ""))
    return "62" + d[1:] if d.startswith("0") else d


def tag(s):
    return re.sub(r"[^a-z0-9]", "", str(s or "").lower())


# ---------- data ----------
def get_data():
    if os.environ.get("MOCK"):
        return load_json(os.path.join(ROOT, "scripts", "mock.json"), {"agents": [], "listings": []})
    h = {"apikey": SB_KEY, "Authorization": f"Bearer {SB_KEY}"}

    def get(q):
        out, frm = [], 0
        while True:
            st, body, _ = http(f"{SB_URL}/rest/v1/{q}", headers={**h, "Range": f"{frm}-{frm + 999}", "Range-Unit": "items"})
            if st not in (200, 206):
                raise RuntimeError(f"Supabase {q}: {st} {body[:200]!r}")
            rows = json.loads(body)
            out += rows
            if len(rows) < 1000:
                return out
            frm += 1000

    agents = get("agents?select=id,name,agency,phone,status&status=eq.approved")
    listings = get("listings?select=*&published=eq.true&order=created_at.asc")
    return {"agents": agents, "listings": listings}


def is_live(l):
    if not l.get("published") or l.get("sold_at"):
        return False
    t = l.get("updated_at") or l.get("created_at")
    try:
        d = datetime.fromisoformat(str(t).replace("Z", "+00:00"))
    except Exception:
        return False
    return now() - d < timedelta(days=EXPIRE_DAYS)


def pending(data, posted):
    agents = {a["id"]: a for a in data["agents"]}
    out = []
    for l in data["listings"]:
        st = posted.get(l["id"], {})
        if st.get("media_id") or st.get("fails", 0) >= MAX_FAILS:
            continue
        if not is_live(l) or l.get("agent_id") not in agents or not (l.get("photos") or []):
            continue
        out.append((l, agents[l["agent_id"]]))
    return out


# ---------- gambar ----------
def font(size, weight="Bold"):
    f = ImageFont.truetype(FONT_F, size)
    try:
        f.set_variation_by_name(weight)
    except Exception:
        pass
    return f


def fetch_image(url):
    if os.environ.get("MOCK") and not url.startswith("http"):
        return Image.open(os.path.join(ROOT, url.lstrip("/"))).convert("RGB")
    st, body, _ = http(url, timeout=90)
    if st != 200:
        raise RuntimeError(f"foto tidak bisa diunduh ({st})")
    return Image.open(io.BytesIO(body)).convert("RGB")


def cover(img):
    k = max(W / img.width, H / img.height)
    img = img.resize((max(W, round(img.width * k)), max(H, round(img.height * k))), Image.LANCZOS)
    x, y = (img.width - W) // 2, (img.height - H) // 2
    return img.crop((x, y, x + W, y + H))


def paste_alpha(base, layer, xy, opacity=1.0):
    if opacity < 1:
        a = layer.getchannel("A").point(lambda v: int(v * opacity))
        layer = layer.copy()
        layer.putalpha(a)
    base.alpha_composite(layer, xy)


def watermark(canvas):
    """Watermark tengah seperti di website (untuk foto lama yang belum ber-watermark)."""
    logo = Image.open(LOGO_F).convert("RGBA")
    fs = 62
    lh = int(fs * 1.9)
    logo = logo.resize((int(logo.width * lh / logo.height), lh), Image.LANCZOS)
    f = font(fs)
    text = "Nusantara Property"
    tw = f.getlength(text)
    gap = int(fs * 0.3)
    total = logo.width + gap + tw
    x0, cy = int((W - total) / 2), H // 2
    layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ds = ImageDraw.Draw(sh)
    ds.text((x0 + logo.width + gap, cy), text, font=f, fill=(0, 0, 0, 140), anchor="lm")
    sh = sh.filter(ImageFilter.GaussianBlur(6))
    layer.alpha_composite(sh)
    layer.alpha_composite(logo, (x0, cy - lh // 2))
    ImageDraw.Draw(layer).text((x0 + logo.width + gap, cy), text, font=f, fill=(255, 255, 255, 255), anchor="lm")
    paste_alpha(canvas, layer, (0, 0), 0.6)


def wrap(text, f, maxw, max_lines):
    words, lines, cur = str(text).split(), [], ""
    for w in words:
        t = (cur + " " + w).strip()
        if f.getlength(t) <= maxw:
            cur = t
        else:
            if cur:
                lines.append(cur)
            cur = w
    if cur:
        lines.append(cur)
    if len(lines) > max_lines:
        lines = lines[:max_lines]
        while f.getlength(lines[-1] + "…") > maxw and " " in lines[-1]:
            lines[-1] = lines[-1].rsplit(" ", 1)[0]
        lines[-1] += "…"
    return lines


def price_text(l, short=True):
    if l.get("price") in (None, ""):
        return "Harga: hubungi agen"
    p = (rupiah_short if short else rupiah_full)(l["price"])
    u = UNITS.get(l.get("unit") or "total", "")
    return f"{p} {u}".strip()


def specs(l):
    s = []
    if l.get("size"):
        are = float(l["size"]) / 100
        are_s = f"{are:.2f}".rstrip("0").rstrip(".").replace(".", ",")
        s.append(f"LT {num(l['size'])} m² ({are_s} are)" if l.get("type") in HAS_BUILDING else f"{num(l['size'])} m² · {are_s} are")
    if l.get("building_size"):
        s.append(f"LB {num(l['building_size'])} m²")
    if l.get("bedrooms") not in (None, ""):
        s.append(f"{l['bedrooms']} KT")
    if l.get("bathrooms") not in (None, ""):
        s.append(f"{l['bathrooms']} KM")
    if l.get("cert"):
        s.append(l["cert"])
    return s


def cover_slide(img, l):
    c = cover(img).convert("RGBA")
    if "/lw-" not in str(l["photos"][0]):
        watermark(c)
    # gradasi bawah
    grad = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(grad)
    top = int(H * 0.46)
    for y in range(top, H):
        a = int(235 * min(1, (y - top) / (H - top) * 1.6))
        gd.line([(0, y), (W, y)], fill=NAVY + (a,))
    for y in range(0, 190):
        a = int(150 * (1 - y / 190))
        gd.line([(0, y), (W, y)], fill=NAVY + (a,))
    c.alpha_composite(grad)
    d = ImageDraw.Draw(c)
    M = 64
    # merek kiri atas
    logo = Image.open(LOGO_F).convert("RGBA")
    logo = logo.resize((int(logo.width * 64 / logo.height), 64), Image.LANCZOS)
    c.alpha_composite(logo, (M - 8, 52))
    d.text((M - 8 + logo.width + 10, 84), "Nusantara Property", font=font(34), fill="white", anchor="lm")
    # label jenis & status
    y = H - 64
    lines_specs = " · ".join(specs(l))
    loc = ", ".join([x for x in (l.get("place"), l.get("kab"), l.get("prov")) if x])
    f_title, f_loc, f_price, f_spec, f_pill = font(56, "ExtraBold"), font(32, "Medium"), font(64, "ExtraBold"), font(30, "SemiBold"), font(28, "Bold")
    blocks = []
    if lines_specs:
        blocks.append(("spec", lines_specs))
    blocks.append(("price", price_text(l)))
    if loc:
        blocks.append(("loc", loc))
    title_lines = wrap(l.get("title", ""), f_title, W - 2 * M, 2)
    # gambar dari bawah ke atas
    for kind, text in blocks:
        if kind == "spec":
            for ln in reversed(wrap(text, f_spec, W - 2 * M, 2)):
                d.text((M, y), ln, font=f_spec, fill=(230, 236, 243), anchor="ls")
                y -= 44
            y -= 10
        elif kind == "price":
            d.text((M, y), text, font=f_price, fill=GOLD, anchor="ls")
            y -= 84
        elif kind == "loc":
            for ln in reversed(wrap(text, f_loc, W - 2 * M, 2)):
                d.text((M, y), ln, font=f_loc, fill=(220, 228, 238), anchor="ls")
                y -= 46
            y -= 8
    for ln in reversed(title_lines):
        d.text((M, y), ln, font=f_title, fill="white", anchor="ls")
        y -= 70
    pill = f"{(l.get('status') or 'Dijual').upper()} · {(l.get('type') or '').upper()}".strip(" ·")
    pw = f_pill.getlength(pill) + 40
    y -= 16
    d.rounded_rectangle([M, y - 52, M + pw, y], radius=26, fill=GOLD)
    d.text((M + 20, y - 26), pill, font=f_pill, fill=NAVY, anchor="lm")
    return c.convert("RGB")


def photo_slide(img, url):
    c = cover(img).convert("RGBA")
    if "/lw-" not in str(url):
        watermark(c)
    return c.convert("RGB")


# ---------- caption ----------
def caption(l, a):
    loc = ", ".join([x for x in (l.get("place"), l.get("kab"), l.get("prov")) if x])
    lines = [f"🏡 {l.get('title', '').strip()}"]
    if loc:
        lines.append(f"📍 {loc}")
    lines.append("")
    lines.append(f"💰 {price_text(l, short=False)}")
    sp = specs(l)
    if sp:
        lines.append("📐 " + " · ".join(sp))
    extra = []
    if l.get("facing"):
        extra.append(f"Hadap {l['facing']}")
    if l.get("zone"):
        extra.append(f"Zona {l['zone']}")
    if extra:
        lines.append("🧭 " + " · ".join(extra))
    desc = re.sub(r"\n{3,}", "\n\n", str(l.get("description") or "").strip())
    if desc:
        if len(desc) > 900:
            desc = desc[:900].rsplit(" ", 1)[0] + "…"
        lines += ["", desc]
    lines.append("")
    agent = a.get("name", "Agen") + (f" ({a['agency']})" if a.get("agency") else "")
    lines.append(f"📞 Hubungi agen: {agent}")
    if a.get("phone"):
        lines.append(f"WhatsApp: wa.me/{wa_digits(a['phone'])}")
    lines.append(f"🔗 Detail & listing lain: {SITE_URL.replace('https://', '')} (link di bio)")
    t, kab, prov = tag(l.get("type")), tag(l.get("kab")), tag(l.get("prov"))
    st = "disewakan" if l.get("status") == "Disewakan" else "dijual"
    tags = ["nusantaraproperty", "propertiindonesia", f"{t}{st}", f"{t}{kab}", f"{t}{prov}", f"properti{kab}",
            f"properti{prov}", f"{st}{t}{kab}", "infoproperti", "investasiproperti"]
    if prov == "bali":
        tags += ["baliproperty", f"{t}bali", "balirealestate"]
    seen, out = set(), []
    for x in tags:
        if x and x not in seen and len(x) > 3:
            seen.add(x)
            out.append("#" + x)
    lines += ["", " ".join(out[:20])]
    return "\n".join(lines)[:2150]


# ---------- tahap 1: siapkan gambar ----------
def prepare():
    posted = load_json(POSTED_F, {})
    data = get_data()
    todo = pending(data, posted)[:MAX_PER_RUN]
    queue = []
    for l, a in todo:
        d = os.path.join(ROOT, "ig", l["id"])
        os.makedirs(d, exist_ok=True)
        files = []
        try:
            for i, url in enumerate((l.get("photos") or [])[:10]):
                img = fetch_image(url)
                out = cover_slide(img, l) if i == 0 else photo_slide(img, url)
                fn = f"{i + 1}.jpg"
                out.save(os.path.join(d, fn), "JPEG", quality=88, optimize=True, progressive=False)
                files.append(f"ig/{l['id']}/{fn}")
        except Exception as e:
            if not files:
                st = posted.setdefault(l["id"], {})
                st["fails"] = st.get("fails", 0) + 1
                st["last_error"] = f"siapkan gambar: {e}"[:300]
                log("prepare_failed", listing=l["id"], error=str(e)[:300])
                continue
        queue.append({"id": l["id"], "title": l.get("title"), "files": files, "caption": caption(l, a)})
        log("prepared", listing=l["id"], images=len(files))
    save_json(QUEUE_F, queue)
    save_json(POSTED_F, posted)
    print(f"{len(queue)} listing disiapkan")


# ---------- tahap 2: posting ----------
def wait_public(path, timeout=420):
    """Tunggu sampai gambar bisa diakses publik (GitHub Pages), atau pakai raw.githubusercontent."""
    url = f"{SITE_URL}/{path}"
    end = time.time() + timeout
    while time.time() < end:
        st, body, hdr = http(url, timeout=30)
        if st == 200 and str(hdr.get("Content-Type", "")).startswith("image/") and len(body) > 1000:
            return url
        time.sleep(15)
    return f"{RAW_URL}/{path}"


class IG:
    def __init__(self, token):
        self.token = token
        self.base = None
        for base in ("https://graph.instagram.com", "https://graph.facebook.com"):
            st, body, _ = http(f"{base}/{IG_USER_ID}?fields=id,username&access_token={urllib.parse.quote(token)}")
            if st == 200:
                self.base = base
                print("Instagram API:", base, json.loads(body).get("username"))
                break
        if not self.base:
            raise RuntimeError("Token Instagram ditolak oleh graph.instagram.com dan graph.facebook.com. Periksa secret IG_TOKEN.")

    def call(self, path, params=None, post=False):
        params = dict(params or {})
        params["access_token"] = self.token
        if post:
            st, body, _ = http(f"{self.base}/{path}", data=params)
        else:
            st, body, _ = http(f"{self.base}/{path}?{urllib.parse.urlencode(params)}")
        try:
            js = json.loads(body)
        except Exception:
            js = {"raw": body[:200].decode("utf-8", "replace")}
        if st != 200 or "error" in js:
            msg = (js.get("error") or {}).get("message") or str(js)[:300]
            raise RuntimeError(f"{path}: {msg}")
        return js

    def wait_ready(self, cid, timeout=180):
        end = time.time() + timeout
        while time.time() < end:
            js = self.call(cid, {"fields": "status_code,status"})
            sc = js.get("status_code")
            if sc == "FINISHED":
                return
            if sc in ("ERROR", "EXPIRED"):
                raise RuntimeError(f"container {sc}: {js.get('status')}")
            time.sleep(5)
        raise RuntimeError("container tidak selesai diproses")

    def publish(self, urls, cap):
        if len(urls) == 1:
            cid = self.call(f"{IG_USER_ID}/media", {"image_url": urls[0], "caption": cap}, post=True)["id"]
        else:
            kids = []
            for u in urls:
                kid = self.call(f"{IG_USER_ID}/media", {"image_url": u, "is_carousel_item": "true"}, post=True)["id"]
                kids.append(kid)
            for k in kids:
                self.wait_ready(k)
            cid = self.call(f"{IG_USER_ID}/media", {"media_type": "CAROUSEL", "children": ",".join(kids), "caption": cap}, post=True)["id"]
        self.wait_ready(cid)
        mid = self.call(f"{IG_USER_ID}/media_publish", {"creation_id": cid}, post=True)["id"]
        try:
            link = self.call(mid, {"fields": "permalink"}).get("permalink")
        except Exception:
            link = None
        return mid, link


def rm_tree(d):
    if os.path.isdir(d):
        for f in os.listdir(d):
            os.remove(os.path.join(d, f))
        os.rmdir(d)


def publish():
    queue = load_json(QUEUE_F, [])
    if not queue:
        print("Tidak ada antrean.")
        return
    token = os.environ.get("IG_TOKEN", "").strip()
    if not token:
        log("no_token", note="Secret IG_TOKEN belum diisi di GitHub")
        return
    posted = load_json(POSTED_F, {})
    try:
        ig = IG(token)
    except Exception as e:
        log("token_error", error=str(e)[:300])
        return
    left = []
    for item in queue:
        lid = item["id"]
        try:
            urls = [wait_public(p) for p in item["files"]]
            mid, link = ig.publish(urls, item["caption"])
            posted[lid] = {"media_id": mid, "permalink": link, "at": now().isoformat(timespec="seconds"), "title": item.get("title")}
            log("published", listing=lid, permalink=link)
            rm_tree(os.path.join(ROOT, "ig", lid))
        except Exception as e:
            st = posted.setdefault(lid, {})
            st["fails"] = st.get("fails", 0) + 1
            st["last_error"] = str(e)[:300]
            log("publish_failed", listing=lid, error=str(e)[:300])
            if st["fails"] >= MAX_FAILS:
                rm_tree(os.path.join(ROOT, "ig", lid))
            else:
                left.append(item)
        save_json(POSTED_F, posted)
    save_json(QUEUE_F, left)


if __name__ == "__main__":
    step = sys.argv[1] if len(sys.argv) > 1 else ""
    if step == "prepare":
        prepare()
    elif step == "publish":
        publish()
    else:
        print(__doc__)
        sys.exit(1)
