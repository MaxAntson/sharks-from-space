#!/usr/bin/env python3
import json, argparse, pathlib

def tag(features, presence):
    out = []
    for f in features:
        props = f.get("properties") or {}
        props["presence"] = presence
        f["properties"] = props
        out.append(f)
    return out

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pres", default="public/data/sphyrna_points_enriched.geojson")
    ap.add_argument("--back", default="public/data/background_sst.geojson")
    ap.add_argument("--out", default="data/processed/pa_dataset.geojson")
    args = ap.parse_args()

    # cargar
    pres = json.load(open(args.pres))["features"]
    back = json.load(open(args.back))["features"]

    # etiquetar
    pres = tag(pres, 1)
    back = tag(back, 0)

    # opcional: filtrar background sin sst
    back = [f for f in back if f.get("properties", {}).get("sst_c") is not None]

    # unir
    all_feats = pres + back
    out = {"type": "FeatureCollection", "features": all_feats}

    pathlib.Path(args.out).parent.mkdir(parents=True, exist_ok=True)
    json.dump(out, open(args.out, "w"), ensure_ascii=False)

    print(f"[ok] dataset P/A -> {args.out} ({len(all_feats)} puntos)")

if __name__ == "__main__":
    main()
