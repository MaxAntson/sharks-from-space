#!/usr/bin/env python3
import json, argparse, rasterio

def enrich(src_geojson, raster_path, dst_geojson, prop_name="bathy_m"):
    gj = json.load(open(src_geojson))
    feats = gj.get("features", [])
    out = []
    added = 0

    with rasterio.open(raster_path) as src:
        for f in feats:
            geom = f.get("geometry") or {}
            coords = geom.get("coordinates") or []
            if len(coords) < 2:
                out.append(f); continue
            lon, lat = float(coords[0]), float(coords[1])

            vals = list(src.sample([(lon, lat)]))
            v = None
            if vals and vals[0] is not None:
                v = float(vals[0][0])

            props = f.get("properties") or {}
            props[prop_name] = v
            f["properties"] = props
            out.append(f)
            if v is not None:
                added += 1

    gj["features"] = out
    json.dump(gj, open(dst_geojson, "w"), ensure_ascii=False)
    print(f"[ok] Guardado: {dst_geojson}  (+{prop_name} en {added}/{len(out)} puntos)")

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--src", required=True, help="GeoJSON de entrada")
    ap.add_argument("--raster", default="data/env/gebco_bathymetry.tif")
    ap.add_argument("--dst", required=True, help="GeoJSON de salida")
    ap.add_argument("--prop", default="bathy_m")
    args = ap.parse_args()
    enrich(args.src, args.raster, args.dst, args.prop)

if __name__ == "__main__":
    main()
