#!/usr/bin/env python3
import json, argparse, pandas as pd, pathlib
def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--src", default="data/processed/pa_dataset.geojson")
    ap.add_argument("--csv", default="data/processed/pa_dataset.csv")
    ap.add_argument("--parquet", default="data/processed/pa_dataset.parquet")
    args=ap.parse_args()

    gj=json.load(open(args.src))
    rows=[]
    for f in gj["features"]:
        p=f.get("properties",{})
        lon,lat=f["geometry"]["coordinates"][:2]
        rows.append({
            "lon":lon,"lat":lat,
            "date":p.get("date") or p.get("eventDate"),
            "month":p.get("month"),
            "sst_c":p.get("sst_c"),
            "presence":p.get("presence", 1 if p.get("type")=="presence" else 0)
        })
    df=pd.DataFrame(rows)
    pathlib.Path(args.csv).parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(args.csv, index=False)
    df.to_parquet(args.parquet, index=False)
    print("[ok]", args.csv, "|", args.parquet, "rows:", len(df))
if __name__=="__main__": main()
