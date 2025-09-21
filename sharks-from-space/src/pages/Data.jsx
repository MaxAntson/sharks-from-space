export default function Data() {
  return (
    <div className="section">
      <h2 className="h2">Datasets</h2>
      <div className="grid cols-2">
        <div className="card">
          <strong>Satellite SST / Chlorophyll</strong>
          <p className="muted">Sea surface temp & productivity proxies.</p>
        </div>
        <div className="card">
          <strong>Citizen science</strong>
          <p className="muted">Dorsal, eOceans, GBIF records.</p>
        </div>
        <div className="card">
          <strong>Protected areas</strong>
          <p className="muted">EEZ/MPA boundaries for context.</p>
        </div>
        <div className="card">
          <strong>IUCN Red List</strong>
          <p className="muted">Conservation status per species.</p>
        </div>
      </div>
    </div>
  );
}
