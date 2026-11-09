#!/usr/bin/env python3
"""Email otomatis Nusantara Property (dijalankan GitHub Actions, lihat .github/workflows/notify.yml).

- Agen: pengingat 7 hari dan 1 hari sebelum listing turun (aturan 60 hari).
- Agen: pemberitahuan saat akunnya disetujui admin.
- Admin: pemberitahuan agen baru yang menunggu persetujuan.
- Admin: postingan Instagram yang perlu diarsipkan manual (dari data/ig-alerts.json).

Butuh secret GitHub: SUPABASE_SERVICE_KEY dan RESEND_API_KEY (tidak pernah ditulis ke file atau log).
Status pengiriman disimpan di data/notify-state.json (hanya ID, tanpa email atau data pribadi).
Uji lokal tanpa kirim email:  DRY=1 MOCK=1 python3 scripts/notify.py
"""
import html, json, os, sys, urllib.error, urllib.parse, urllib.request
from datetime import datetime, timezone

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SITE = "https://nusantara.properties"
SB_URL = "https://mpyspcofrekhnbkxzucr.supabase.co"
FROM = "Nusantara Property <noreply@nusantara.properties>"
EXPIRE_DAYS = 60
STATE_F = os.path.join(ROOT, "data", "notify-state.json")
ALERTS_F = os.path.join(ROOT, "data", "ig-alerts.json")
DRY = bool(os.environ.get("DRY"))


def now():
    return datetime.now(timezone.utc)


def load(path, default):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return default


def save(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)


def req(url, method="GET", headers=None, body=None):
    data = json.dumps(body).encode() if body is not None else None
    r = urllib.request.Request(url, data=data, method=method, headers={**(headers or {}), **({"Content-Type": "application/json"} if data else {})})
    try:
        with urllib.request.urlopen(r, timeout=60) as resp:
            return resp.status, resp.read()
    except urllib.error.HTTPError as e:
        return e.code, e.read()


# ---------- data ----------
def get_data(key):
    if os.environ.get("MOCK"):
        return load(os.environ.get("MOCK_FILE", ""), {"agents": [], "listings": [], "emails": {}})
    h = {"apikey": key, "Authorization": f"Bearer {key}"}

    def rest(q):
        out, frm = [], 0
        while True:
            st, body = req(f"{SB_URL}/rest/v1/{q}", headers={**h, "Range": f"{frm}-{frm + 999}", "Range-Unit": "items"})
            if st not in (200, 206):
                raise RuntimeError(f"Supabase {q.split('?')[0]}: {st}")
            rows = json.loads(body)
            out += rows
            if len(rows) < 1000:
                return out
            frm += 1000

    agents = rest("agents?select=id,name,status,is_admin,created_at")
    listings = rest("listings?select=id,agent_id,title,published,sold_at,updated_at,created_at&published=eq.true&sold_at=is.null")
    emails, page = {}, 1
    while True:
        st, body = req(f"{SB_URL}/auth/v1/admin/users?page={page}&per_page=500", headers=h)
        if st != 200:
            raise RuntimeError(f"Supabase auth users: {st}")
        users = json.loads(body).get("users", [])
        for u in users:
            if u.get("email"):
                emails[u["id"]] = u["email"]
        if len(users) < 500:
            break
        page += 1
    return {"agents": agents, "listings": listings, "emails": emails}


# ---------- email ----------
def wrap(title, inner):
    return f"""<div style="font-family:Arial,Helvetica,sans-serif;background:#F5F7FA;padding:24px">
<div style="max-width:560px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E3E8EF">
<div style="background:#0A2845;color:#fff;padding:18px 24px;font-weight:bold;font-size:18px;border-bottom:3px solid #D4802A">Nusantara Property</div>
<div style="padding:24px;color:#0A2845;font-size:15px;line-height:1.6"><h2 style="margin:0 0 12px;font-size:20px">{html.escape(title)}</h2>{inner}</div>
<div style="padding:14px 24px;background:#F5F7FA;color:#5B6B7F;font-size:12px">Email otomatis dari {SITE.replace('https://', '')}. Mohon tidak membalas email ini.</div>
</div></div>"""


def button(href, text):
    return f'<p style="margin:20px 0"><a href="{href}" style="background:#D4802A;color:#0A2845;text-decoration:none;font-weight:bold;padding:12px 20px;border-radius:999px;display:inline-block">{html.escape(text)}</a></p>'


SENT = []


def send(to, subject, body_html, key):
    if not to:
        return False
    if DRY:
        SENT.append((to, subject))
        print(f"[DRY] {subject}")
        return True
    st, body = req("https://api.resend.com/emails", "POST", {"Authorization": f"Bearer {key}"},
                   {"from": FROM, "to": [to] if isinstance(to, str) else to, "subject": subject, "html": body_html})
    ok = st in (200, 201)
    print(("terkirim: " if ok else f"gagal ({st}): ") + subject)
    return ok


def days_left(l):
    t = datetime.fromisoformat(str(l.get("updated_at") or l.get("created_at")).replace("Z", "+00:00"))
    return EXPIRE_DAYS - int((now() - t).total_seconds() // 86400)


# ---------- main ----------
def main():
    sb_key = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()
    rs_key = os.environ.get("RESEND_API_KEY", "").strip()
    if not os.environ.get("MOCK") and (not sb_key or (not rs_key and not DRY)):
        print("Secret SUPABASE_SERVICE_KEY / RESEND_API_KEY belum diisi; email otomatis dilewati.")
        return
    state = load(STATE_F, {"expiry": {}, "pending": [], "approved": [], "started": now().isoformat(timespec="seconds")})
    data = get_data(sb_key)
    agents = {a["id"]: a for a in data["agents"]}
    emails = data["emails"]
    admins = [emails.get(a["id"]) for a in data["agents"] if a.get("is_admin") and emails.get(a["id"])]
    first_run = not state.get("seeded")

    # 1. pengingat listing akan turun
    per_agent = {}
    live_keys = set()
    for l in data["listings"]:
        d = days_left(l)
        stage = "1" if 0 < d <= 1 else "7" if 1 < d <= 7 else None
        key = f"{l['id']}:{l.get('updated_at')}"
        live_keys.add(key)
        if stage and stage not in state["expiry"].get(key, []):
            per_agent.setdefault(l["agent_id"], []).append((l, d, stage, key))
    for aid, items in per_agent.items():
        a, to = agents.get(aid), emails.get(aid)
        if not a or a.get("status") != "approved" or not to:
            continue
        rows = "".join(f'<li style="margin-bottom:6px"><b>{html.escape(l["title"])}</b> — turun dalam <b>{d} hari</b></li>' for l, d, _, _ in items)
        inner = (f"<p>Halo {html.escape(a['name'])},</p><p>Listing berikut belum diperbarui hampir {EXPIRE_DAYS} hari dan akan otomatis turun dari website:</p>"
                 f"<ul style='padding-left:18px'>{rows}</ul><p>Bila properti masih tersedia, masuk ke dasbor lalu ketuk <b>Tayangkan ulang</b>. Bila sudah laku, ketuk <b>Tandai terjual</b>.</p>"
                 + button(f"{SITE}/#dasbor", "Buka dasbor agen"))
        soon = min(d for _, d, _, _ in items)
        if send(to, f"Listing Anda akan turun dalam {soon} hari", wrap("Listing akan turun", inner), rs_key):
            for l, _, stage, key in items:
                state["expiry"].setdefault(key, []).append(stage)
    state["expiry"] = {k: v for k, v in state["expiry"].items() if k in live_keys}

    # 2. agen baru menunggu persetujuan -> admin
    pend = [a for a in data["agents"] if a.get("status") == "pending" and a["id"] not in state["pending"]]
    if pend and first_run:
        state["pending"] += [a["id"] for a in pend]  # jangan kirim ulang yang sudah lama menunggu saat pertama kali dijalankan
        pend = []
    if pend and admins:
        rows = "".join(f"<li><b>{html.escape(a['name'])}</b></li>" for a in pend)
        inner = f"<p>Ada {len(pend)} agen baru yang menunggu persetujuan:</p><ul style='padding-left:18px'>{rows}</ul>" + button(f"{SITE}/#dasbor", "Tinjau di dasbor admin")
        if send(admins, f"{len(pend)} agen baru menunggu persetujuan", wrap("Agen baru mendaftar", inner), rs_key):
            state["pending"] += [a["id"] for a in pend]
    pending_ids = {a["id"] for a in data["agents"] if a.get("status") == "pending"}
    state["pending"] = [i for i in state["pending"] if i in pending_ids or i in agents]

    # 3. akun disetujui -> agen
    appr = [a for a in data["agents"] if a.get("status") == "approved" and not a.get("is_admin") and a["id"] not in state["approved"]]
    if first_run:
        state["approved"] += [a["id"] for a in appr]
        appr = []
    for a in appr:
        inner = (f"<p>Halo {html.escape(a['name'])},</p><p>Akun agen Anda di Nusantara Property sudah <b>disetujui</b>. Sekarang Anda bisa memasang listing dari dasbor.</p>"
                 "<p>Ingat: pasang hanya properti yang Anda terima langsung dari pemiliknya (Direct Owner), dengan data yang benar dan bisa dipertanggungjawabkan.</p>"
                 + button(f"{SITE}/#dasbor", "Pasang listing pertama"))
        if send(emails.get(a["id"]), "Akun agen Anda sudah disetujui", wrap("Selamat bergabung", inner), rs_key):
            state["approved"].append(a["id"])

    # 4. postingan Instagram yang perlu diarsipkan manual -> admin
    alerts = load(ALERTS_F, [])
    todo = [x for x in alerts if not x.get("emailed")]
    if todo and admins:
        rows = "".join(f'<li style="margin-bottom:6px"><b>{html.escape(str(x.get("title") or "Listing"))}</b> ({html.escape(x.get("reason", ""))}) — <a href="{x.get("permalink")}">buka postingan</a></li>' for x in todo)
        inner = ("<p>Listing berikut sudah tidak tersedia, tapi postingan Instagram-nya tidak bisa dihapus otomatis. Sistem sudah menambahkan komentar pemberitahuan.</p>"
                 f"<ul style='padding-left:18px'>{rows}</ul><p>Sebaiknya arsipkan atau hapus postingan tersebut dari aplikasi Instagram: buka postingan → ⋯ → Arsipkan.</p>")
        if send(admins, f"{len(todo)} postingan Instagram perlu diarsipkan", wrap("Postingan Instagram perlu diarsipkan", inner), rs_key):
            for x in todo:
                x["emailed"] = True
            save(ALERTS_F, alerts)

    state["seeded"] = True
    state["last_run"] = now().isoformat(timespec="seconds")
    save(STATE_F, state)


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("Gagal:", str(e)[:300])
        sys.exit(1)
