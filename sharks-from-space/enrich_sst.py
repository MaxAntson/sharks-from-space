# enrich_sst.py
# Lee tus puntos GeoJSON y añade SST (°C) consultando ERDDAP para cada (fecha, celda lat/lon redondeada).
# Salida: public/data/sphyrna_points_enriched.geojson

import json
import time
import math
import pandas as pd
from pathlib import Path

# ------------ Ajustes ------------
IN_GEOJSON  = Path("public/data/sphyrna_points.geojson")
OUT_GEOJSON = Path("public/data/sphyrna_points_enriched.geojson")
ROUND_DEG   = 0.05   # redondeo de lat/lon para agrupar por “celda”
SLEEP_SEC   = 0.15   # pausa entre llamadas (evitar rate-limit)
DATASET     = "jplMURSST41mday_Lon0360"  # GHRSST MUR diario (longitudes 0–360)
# ---------------------------------

def to_0360(lon_deg: float) -> float:
    """Convierte longitudes [-180,180] a [0,360] para datasets 0–360."""
    return lon_deg if lon_deg >= 0 else lon_deg + 360

def erddap_sst_point(date_iso: str, lat: float, lon: float) -> float | None:
    """
    Devuelve SST (°C) para (fecha YYYY-MM-DD, lat, lon en [-180,180]).
    Usa ERDDAP csv con subsetting exacto a un punto.
    """
    lon0360 = to_0360(lon)
    url = (
        f"https://coastwatch.pfeg.noaa.gov/erddap/griddap/{DATASET}.csv?"
        f"sst[({date_iso}):1:({date_iso})]"
        f"[({lat}):1:({lat})]"
        f"[({lon0360}):1:({lon0360})]"
    )
    try:
        df = pd.read_csv(url)
        # Buscar columna sst (puede venir como 'sst (degree_C)')
        sst_col = next((c for c in df.columns if c.startswith("sst")), None)
        if not sst_col:
            return None
        val = df[sst_col].iloc[0]
        if pd.isna(val):
            return None
        return float(val)  # °C
    except Exception:
        return None

def round_to(v: float, step: float) -> float:
    return round(v / step) * step

def main():
    if not IN_GEOJSON.exists():
        raise FileNotFoundError(f"No existe {IN_GEOJSON}")

    fc = json.loads(IN_GEOJSON.read_text(encoding="utf-8"))
    feats = fc.get("features", [])
    if not feats:
        print("No hay features en el GeoJSON.")
        return

    # Extraer filas con (fecha, lat, lon)
    rows = []
    for i, f in enumerate(feats):
        geom = f.get("geometry", {})
        props = f.get("properties", {})
        coords = (geom.get("coordinates") or [None, None])
        lon, lat = coords[0], coords[1]
        # Intentar obtener fecha de properties: 'date' o 'eventDate' o 'year-month-day'
        date_str = (props.get("date") or props.get("eventDate") or "").split("T")[0]
        # Si no hay fecha, saltar
        if not date_str or lat is None or lon is None:
            rows.append({"idx": i, "date": None, "lat": lat, "lon": lon})
            continue
        rows.append({"idx": i, "date": date_str, "lat": float(lat), "lon": float(lon)})

    df = pd.DataFrame(rows)

    # Redondeo de celda y clave (fecha, celda)
    df["lat_cell"] = df["lat"].apply(lambda x: round_to(x, ROUND_DEG) if pd.notna(x) else None)
    df["lon_cell"] = df["lon"].apply(lambda x: round_to(x, ROUND_DEG) if pd.notna(x) else None)

    # Quedarnos con filas con fecha+coords válidas
    valid = df.dropna(subset=["date", "lat_cell", "lon_cell"]).copy()

    # Deduplicar para no repetir consultas
    keys = valid[["date", "lat_cell", "lon_cell"]].drop_duplicates()

    print(f"Consultas únicas a ERDDAP: {len(keys)}")

    cache = {}  # (date,lat_cell,lon_cell) -> sst_c
    for _, r in keys.iterrows():
        k = (r["date"], float(r["lat_cell"]), float(r["lon_cell"]))
        sst_c = erddap_sst_point(k[0], k[1], k[2])
        cache[k] = sst_c
        time.sleep(SLEEP_SEC)

    # Asignar sst_c a cada feature
    sst_list = []
    for _, r in df.iterrows():
        if pd.isna(r["date"]) or pd.isna(r["lat_cell"]) or pd.isna(r["lon_cell"]):
            sst_list.append(None)
        else:
            sst_list.append(cache.get((r["date"], float(r["lat_cell"]), float(r["lon_cell"])), None))

    # Escribir salida
    for i, f in enumerate(feats):
        props = f.setdefault("properties", {})
        props["sst_c"] = None if i >= len(sst_list) else sst_list[i]

    fc["features"] = feats
    OUT_GEOJSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_GEOJSON.write_text(json.dumps(fc), encoding="utf-8")
    print(f"✅ Escrito: {OUT_GEOJSON} (con 'sst_c' por punto)")

if __name__ == "__main__":
    main()