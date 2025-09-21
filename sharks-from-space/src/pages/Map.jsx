import "leaflet/dist/leaflet.css";
import { MapContainer, TileLayer, GeoJSON, LayersControl } from "react-leaflet";

const scallopedRange = {
  type: "Feature",
  properties: { name: "Scalloped hammerhead (demo)" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-120, -30],
        [-120, 30],
        [-70, 30],
        [-70, -30],
        [-120, -30],
      ],
    ],
  },
};

const bonnetheadRange = {
  type: "Feature",
  properties: { name: "Bonnethead (demo)" },
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [-95, 10],
        [-95, 35],
        [-75, 35],
        [-75, 10],
        [-95, 10],
      ],
    ],
  },
};

const styleA = {
  color: "#32d0ff",
  weight: 2,
  fillColor: "#32d0ff",
  fillOpacity: 0.15,
};
const styleB = {
  color: "#ffd166",
  weight: 2,
  fillColor: "#ffd166",
  fillOpacity: 0.15,
};

export default function Map() {
  return (
    <div className="section">
      <h2 className="h2">Global sightings map (demo ranges)</h2>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <MapContainer
          center={[10, -80]}
          zoom={3}
          scrollWheelZoom={true}
          style={{ height: 480, width: "100%" }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LayersControl position="topright">
            <LayersControl.Overlay checked name="Scalloped hammerhead">
              <GeoJSON data={scallopedRange} style={styleA} />
            </LayersControl.Overlay>

            <LayersControl.Overlay checked name="Bonnethead">
              <GeoJSON data={bonnetheadRange} style={styleB} />
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </div>

      <p className="muted" style={{ marginTop: 8 }}>
        Demo polygons only. Next steps: replace with real distribution GeoJSON
        or occurrence points.
      </p>
    </div>
  );
}
