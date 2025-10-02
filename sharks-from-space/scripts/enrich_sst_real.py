# scripts/enrich_sst_real.py
import json, time, io, argparse, datetime
from pathlib import Path

import requests
import pandas as pd

# --------- Paths por defecto ----------
DEFAULT_SRC = Path("public/data/sphyrna_points.geojson")
DEFAULT_DST = Path("public/data/sphyrna_points_enriched.geojson")
CACHE_PATH = Path(".cache_sst.json")

# --------- ERDDAP (MUR SST diario, longitudes 0–360) ----------
ERDDAP_BASE = "https://coastwatch.pfeg.noaa.gov/erddap/griddap"
DATASET = "jplMURSST41mday_Lon0360"  # MUR daily, lon en [0,360]
COVERAGE_START = datetime.date(2002, 6, 1)

session = requests.Session()
session.headers.update({"User-Agent": "sphyrna-sst-enricher/1.0"})


# --- util de caché ---
def load_cache():
    if CACHE_PATH.exists():
        try:
            return json.load(open(CACHE_PATH, "r"))
        except Exception:
            return {}
    return {}

def save_cache(cache):
    try:
        json.dump(cache, open(CACHE_PATH, "w"))
    except Exception:
        pass


def _to_0360(lon_deg: float) -> float:
    """Convierte longitudes -180..180 a 0..360 para este dataset ERDDAP."""
    return (lon_deg % 360 + 360) % 360


def fetch_sst_point(lat: float, lon_deg: float, date_iso: str, retries=3, timeout=25):
    """
    Devuelve SST (°C) para (lat, lon, fecha YYYY-MM-DD) usando ERDDAP CSV.
    Usa caché en disco para evitar peticiones repetidas.
    """
    lon = _to_0360(lon_deg)
    key = f"{date_iso}|{round(lat,2)}|{round(lon,2)}"

    if key in SST_CACHE:
        return SST_CACHE[key]

    query = f"sst[({date_iso}):1:({date_iso})][({lat}):1:({lat})][({lon}):1:({lon})]"
    url = f"{ERDDAP_BASE}/{DATASET}.csv?{query}"

    last_err = None
    for _ in range(retries):
        try:
            r = session.get(url, timeout=timeout)
            r.raise_for_status()

            df = pd.read_csv(io.StringIO(r.text))
            if "sst" not in df.columns:
                SST_CACHE[key] = None
                return None

            sst_num = pd.to_numeric(df["sst"], errors="coerce")
            df = df[sst_num.notna()]
            if df.empty:
                SST_CACHE[key] = None
                return None

            val = float(df["sst"].iloc[0])
            SST_CACHE[key] = val
            return val

        except Exception as e:
            last_err = e
            time.sleep(1.2)

    print(f"[warn] SST fallo en {lat:.4f},{lon_deg:.4f} {date_iso}: {last_err}")
    SST_CACHE[key] = None
    return None


def first_date(props: dict) -> str | None:
    """Intenta sacar una fecha ISO (YYYY-MM-DD) desde distintas claves habituales."""
    candidates = []
    for k in ("date", "eventDate", "event_date", "observed", "timestamp"):
        v = props.get(k)
        if isinstance(v, str) and len(v) >= 10:
            candidates.append(v[:10])

    y, m, d = props.get("year"), props.get("month"), props.get("day")
    if y and m and d:
        try:
            candidates.append(f"{int(y):04d}-{int(m):02d}-{int(d):02d}")
        except Exception:
            pass

    return candidates[0] if candidates else None


def is_bad_coord(lat: float, lon: float) -> bool:
    """Filtra (0,0), NaNs y valores fuera de rango."""
    if not (isinstance(lat, (int, float)) and isinstance(lon, (int, float))):
        return True
    if lat == 0 and lon == 0:
        return True
    if not (-90 <= lat <= 90 and -180 <= lon <= 180):
        return True
    return False


def enrich_file(src: Path, dst: Path, limit: int | None, throttle: float):
    with open(src, "r", encoding="utf-8") as f:
        gj = json.load(f)

    feats = gj.get("features", [])
    if limit:
        feats = feats[:limit]

    out, added = [], 0
    for i, f in enumerate(feats, 1):
        geom = f.get("geometry") or {}
        coords = geom.get("coordinates") or []
        if len(coords) < 2:
            out.append(f)
            continue

        lon, lat = float(coords[0]), float(coords[1])
        if is_bad_coord(lat, lon):
            out.append(f)
            continue

        props = f.get("properties") or {}
        date_iso = first_date(props)
        if not date_iso:
            out.append(f)
            continue

        try:
            d = datetime.date.fromisoformat(date_iso)
            if d < COVERAGE_START:
                out.append(f)
                continue
        except Exception:
            out.append(f)
            continue

        sst = fetch_sst_point(lat, lon, date_iso)
        props["sst_c"] = sst
        f["properties"] = props
        out.append(f)

        if sst is not None:
            added += 1

        if i % 50 == 0:
            print(f"[info] {i} puntos procesados… (+SST={added})")
            save_cache(SST_CACHE)

        time.sleep(max(0.0, throttle))

    gj["features"] = out
    dst.parent.mkdir(parents=True, exist_ok=True)
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(gj, f, ensure_ascii=False)

    save_cache(SST_CACHE)
    print(f"[ok] Guardado: {dst} con {len(out)} features. SST añadida en {added} puntos.")


def main():
    ap = argparse.ArgumentParser(description="Enriquecer GeoJSON con SST (ERDDAP MUR)")
    ap.add_argument("--src", type=Path, default=DEFAULT_SRC)
    ap.add_argument("--dst", type=Path, default=DEFAULT_DST)
    ap.add_argument("--limit", type=int, default=40, help="procesar solo N puntos (prueba)")
    ap.add_argument("--throttle", type=float, default=0.2, help="pausa entre peticiones (s)")
    args = ap.parse_args()

    print(f"[run] src={args.src} -> dst={args.dst}  limit={args.limit}  throttle={args.throttle}")

    global SST_CACHE
    SST_CACHE = load_cache()

    enrich_file(args.src, args.dst, args.limit, args.throttle)


if __name__ == "__main__":
    main()