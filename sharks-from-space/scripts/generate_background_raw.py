#!/usr/bin/env python3
import json, random, argparse, os

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--out", required=True)
    ap.add_argument("--n", type=int, default=5000)
    # bbox ejemplo Atlántico Este; ajusta a tu AOI
    ap.add_argument("--lon-min", type=float, default=-60)
    ap.add_argument("--lon-max", type=float, default=-10)
    ap.add_argument("--lat-min", type=float, default=-30)
    ap.add_argument("--lat-max", type=float, default=30)
    ap.add_argument("--monthly", action="store_true", help="añade campo month 1..12")
    args = ap.parse_args()

    feats = []
    for i in range(args.n):
        lon = random.uniform(args.lon_min, args.lon_max)
        lat = random.uniform(args.lat_min, args.lat_max)
        props = {"type":"background","id": i}
        if args.monthly:
            props["month"] = random.randint(1,12)
        feats.append({
            "type":"Feature",
            "geometry":{"type":"Point","coordinates":[lon, lat]},
            "properties": props
        })

    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    with open(args.out, "w", encoding="utf-8") as f:
        json.dump({"type":"FeatureCollection","features":feats}, f)

    print(f"[ok] background raw -> {args.out} ({len(feats)} puntos)")

if __name__ == "__main__":
    main()
