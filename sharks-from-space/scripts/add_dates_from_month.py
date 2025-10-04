#!/usr/bin/env python3
import json, sys, datetime

IN = "public/data/background_raw.geojson"
OUT = "public/data/background_raw_with_dates.geojson"
YEAR = 2019   # dentro de la cobertura MUR (>= 2002-06-01)
DAY = 15      # mitad de mes

with open(IN, "r", encoding="utf-8") as f:
    gj = json.load(f)

for feat in gj.get("features", []):
    props = feat.get("properties") or {}
    m = props.get("month")
    if isinstance(m, int) and 1 <= m <= 12:
        props.setdefault("year", YEAR)
        props.setdefault("day", DAY)
        props["date"] = f"{YEAR:04d}-{m:02d}-{DAY:02d}"
        feat["properties"] = props

with open(OUT, "w", encoding="utf-8") as f:
    json.dump(gj, f, ensure_ascii=False)

print(f"[ok] Fechas añadidas -> {OUT}")
