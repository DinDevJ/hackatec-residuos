import { useContext, useState } from "react";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import { DatosContext } from "../context/DatosContext";

export default function Mapa() {
  const { contenedores } = useContext(DatosContext);
  const [popupInfo, setPopupInfo] = useState(null);

  return (
    <div className="h-96 w-full rounded overflow-hidden shadow">
      <Map
        initialViewState={{
          longitude: -101.1872,
          latitude: 19.7024,
          zoom: 14
        }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
      >
        {contenedores.map((c) => (
          <Marker 
            key={c.id} 
            longitude={c.lng} 
            latitude={c.lat} 
            color={c.nivel_actual > 80 ? 'red' : c.nivel_actual > 50 ? 'orange' : 'green'}
            onClick={e => {
              e.originalEvent.stopPropagation();
              setPopupInfo(c);
            }}
          />
        ))}

        {popupInfo && (
          <Popup
            anchor="top"
            longitude={popupInfo.lng}
            latitude={popupInfo.lat}
            onClose={() => setPopupInfo(null)}
          >
            <div className="p-1">
              <strong>{popupInfo.zona}</strong>
              <br />
              Nivel: {popupInfo.nivel_actual}%
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
