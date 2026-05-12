import { useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { DatosContext } from "../context/DatosContext";

export default function Mapa() {
  const { contenedores } = useContext(DatosContext);

  return (
    <MapContainer center={[19.4, -99.1]} zoom={13} className="h-96 rounded">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {contenedores.map((c) => (
        <Marker key={c.id} position={[c.lat, c.lon]}>
          <Popup>
            {c.zona} — {c.nivel_llenado}%
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
