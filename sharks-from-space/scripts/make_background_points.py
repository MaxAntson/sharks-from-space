# scripts/make_background_points.py
import json, random, argparse
from pathlib import Path
from datetime import date
from shapely.geometry import shape, Point
from shapely.prepared import prep

def load_land_mask(land_path: Path):
    with open(land_path, "r", encoding="utf-8") as f:
        gj = json.load(f)
    # Unimos todos los polígonos de tierra en una sola mask preparada
    polys = [shape(feat["geometry"]) for feat in gj.get("features", [])]
    if not polys:
        return None
    from shapely.ops import unary_union
    land = unary_union(polys)
    return prep(land)

def load_presence_month_hist(presence_path: Path):
    """Construye una distribución simple de meses a partir de presencias (si existe eventDate o date)."""
    try:
        with open(presence_path, "r", encoding="utf-8") as f:
            gj = json.load(f)
    except FileNotFoundError:
        return None
    counts = [0]*12
    for feat in gj.get("features", []):
        props = feat.get("properties", {})
        d = props.get("eventDate") or props.get("date") or ""
        if isinstance(d, str) and len(d) >= 7:
            try:
                m = int(d[5:7])
                if 1 <= m <= 12:
                    counts[m-1] += 1
            except:
                pass
    total = sum(counts)
    if total == 0:
        return None
    # probas por mes
    probs = [c/total for c in counts]
    return probs

def sample_month(probs):
    if not probs:
        return random.randint(1, 12)
    r = random.random()
    acc = 0.0
    for i, p in enumerate(probs, start=1):
        acc += p
        if r <= acc:
            return i
    return 12

def random_point_in_bounds(bounds):
    """bounds = [minLat, minLon, maxLat, maxLon]"""
    minLat, minLon, maxLat, maxLon = bounds
    lat = random.uniform(minLat, maxLat)
    lon = random.uniform(minLon, maxLon)
    return lon, lat

def main():
    ap = argparse.ArgumentParser(description="Genera background points (ausencias) en Caribe")
    # Bounding box Caribe/Florida por defecto (ajústalo si quieres)
    ap.add_argument("--bounds", type=float, nargs=4, default=[8, -98, 34, -60],
                    help="minLat minLon maxLat maxLon")
    ap.add_argument("--n", type=int, default=5000, help="número de puntos a generar")
    ap.add_argument("--land", type=Path, default=Path("public/data/land.geojson"))
    ap.add_argument("--presence", type=Path, default=Path("public/data/sphyrna_points_enriched_0_5000.geojson"),
                    help="GeoJSON de presencias para copiar distribución de meses (opcional)")
    ap.add_argument("--out", type=Path, default=Path("public/data/background_raw.geojson"))
    args = ap.parse_args()

    land_mask = load_land_mask(args.land)
    month_probs = load_presence_month_hist(args.presence)

    feats = []
    tries = 0
    needed = args.n

    minLat, minLon, maxLat, maxLon = args.bounds
    while len(feats) < needed and tries < needed * 50:
        tries += 1
        lon, lat = random_point_in_bounds(args.bounds)
        # Rechaza si cae en tierra
        if land_mask and land_mask.contains(Point(lon, lat)):
            continue

        m = sample_month(month_probs)
        # usa día 15 como aproximación mensual (estable)
        day = 15
        # si quieres un año fijo, usa 2008; o al azar 2003–2015:
        year = random.randint(2003, 2015)
        d = date(year, m, day).isoformat()

        feats.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [lon, lat]},
            "properties": {
                "source": "background",
                "date": d
            }
        })

    out = {"type": "FeatureCollection", "features": feats}
    args.out.parent.mkdir(parents=True, exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False)
    print(f"[ok] background points: {len(feats)} guardados en {args.out}")

if __name__ == "__main__":
    main()