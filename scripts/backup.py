#!/usr/bin/env python3
"""Cadangan mingguan database Nusantara Property (agen, listing, statistik) dalam satu file JSON.
Dijalankan GitHub Actions (.github/workflows/backup.yml); file dienkripsi dengan BACKUP_PASSWORD
sebelum disimpan sebagai artifact, jadi isinya tidak bisa dibaca tanpa password.
Foto listing tidak ikut dicadangkan (tetap di Supabase Storage)."""
import gzip, json, os, sys, urllib.error, urllib.request
from datetime import datetime, timezone

SB_URL = "https://mpyspcofrekhnbkxzucr.supabase.co"


def rest(key, q):
    h = {"apikey": key, "Authorization": f"Bearer {key}"}
    out, frm = [], 0
    while True:
        r = urllib.request.Request(f"{SB_URL}/rest/v1/{q}", headers={**h, "Range": f"{frm}-{frm + 999}", "Range-Unit": "items"})
        try:
            with urllib.request.urlopen(r, timeout=120) as resp:
                rows = json.loads(resp.read())
        except urllib.error.HTTPError as e:
            if e.code == 404:  # tabel belum ada
                return out
            raise RuntimeError(f"{q.split('?')[0]}: {e.code}")
        out += rows
        if len(rows) < 1000:
            return out
        frm += 1000


def main():
    key = os.environ.get("SUPABASE_SERVICE_KEY", "").strip()
    if not key or not os.environ.get("BACKUP_PASSWORD"):
        print("Secret SUPABASE_SERVICE_KEY / BACKUP_PASSWORD belum diisi; cadangan dilewati.")
        return 0
    data = {
        "created_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "agents": rest(key, "agents?select=*&order=created_at.asc"),
        "listings": rest(key, "listings?select=*&order=created_at.asc"),
        "listing_views": rest(key, "listing_views?select=*"),
    }
    os.makedirs("backup", exist_ok=True)
    with gzip.open("backup/nusantara-backup.json.gz", "wt", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    print(f"Cadangan: {len(data['agents'])} agen, {len(data['listings'])} listing.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
