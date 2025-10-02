# scripts/enrich_distance_to_coast.py
import json
import argparse
from pathlib import Path

from shapely.geometry import shape, Point, LineString
from shapely.strtree import STRtree
from shapely.ops import nearest_points
from pyproj import Geod

GEOD = Geod(ellps="WGS84")

def _as_linestring(g):
    if g is None or g.is_empty:
        return None
    if g.geom_type == "LineString":
        return g
    if g.geom_type == "LinearRing":
        return LineString(g.coords)
    return None

def load_coast_segments(land_path: Path):
    with open(land_path, "r", encoding="utf-8") as f:
        gj = json.load(f)

    segments = []
    for feat in gj.get("features", []):
        geom = shape(feat.get("geometry"))

        if geom.geom_type == "Polygon":
            ls = _as_linestring(geom.exterior)
            if ls is not None:
                segments.append(ls)
        elif geom.geom_type == "MultiPolygon":
            for poly in geom.geoms:
                ls = _as_linestring(poly.exterior)
                if ls is not None:
                    segments.append(ls)

        b = geom.boundary
        if hasattr(b, "geoms"):
            for g in b.geoms:
                ls = _as_linestring(g)
                if ls is not None:
                    segments.append(ls)
        else:
            ls = _as_linestring(b)
            if ls is not None:
                segments.append(ls)

    return [s for s in segments if s is not None and not s.is_empty]

def geodesic_km(lon1, lat1, lon2, lat2) -> float:
    _, _, dist_m = GEOD.inv(lon1, lat1, lon2, lat2)
    return dist_m / 1000.0

def enrich_dist(src: Path, dst: Path, land_path: Path):
    print("[load] land…", land_path)
    segments = load_coast_segments(land_path)
    print(f"[info] segmentos de costa cargados: {len(segments)}")
    tree = STRtree(segments)

    print("[load] points…", src)
    with open(src, "r", encoding="utf-8") as f:
        gj = json.load(f)

    feats = gj.get("features", [])
    out = []
    added = 0

    for i, f in enumerate(feats, 1):
        geom = f.get("geometry") or {}
        coords = geom.get("coordinates") or []
        if len(coords) < 2:
            out.append(f); continue

        lon, lat = float(coords[0]), float(coords[1])
        pt = Point(lon, lat)

        # --- aquí puede devolver índice o geometría ---
        candidate = tree.nearest(pt)
        try:
            # si ya es geometría tendrá .is_empty
            _ = candidate.is_empty  # no usamos, solo comprobación de tipo
            cand_geom = candidate
        except Exception:
            # si es índice (numpy.int64), recupera la geometría real
            cand_geom = tree.geometries[int(candidate)]

        if cand_geom is None or cand_geom.is_empty:
            out.append(f); continue

        coast_pt, _ = nearest_points(cand_geom, pt)
        d_km = geodesic_km(lon, lat, coast_pt.x, coast_pt.y)

        props = dict(f.get("properties") or {})
        props["dist_coast_km"] = round(d_km, 3)
        f["properties"] = props
        out.append(f)
        added += 1

        if i % 200 == 0:
            print(f"[info] {i} procesados… (+dist={added})")

    gj["features"] = out
    dst.parent.mkdir(parents=True, exist_ok=True)
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(gj, f, ensure_ascii=False)
    print(f"[ok] Guardado: {dst}  (features: {len(out)} ; con dist={added})")

def main():
    ap = argparse.ArgumentParser(description="Añade dist_coast_km a un GeoJSON de puntos")
    ap.add_argument("--src", type=Path, required=True)
    ap.add_argument("--dst", type=Path, required=True)
    ap.add_argument("--land", type=Path, default=Path("public/data/land.geojson"))
    args = ap.parse_args()
    enrich_dist(args.src, args.dst, args.land)

if __name__ == "__main__":
    main()