import React from 'react';
import {
  Map as MapIcon, Activity, Brain, Send, Navigation, AlertTriangle, MoreVertical, Filter
} from 'lucide-react';
import Map, { Source, Layer, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

// --- MOCK DATA ---
// TODO: Replace with REST API fetch from docs/api-contract.md

const mockChatHistory = [
  { id: 1, sender: 'user', text: 'La saturación del Mercado Independencia está llegando al 92%. Redirige el camión más cercano inmediatamente.' },
  { id: 2, sender: 'ai', text: 'He identificado que el CAM-04 está a 3 minutos en el Centro Histórico. Reasignando ruta ahora para interceptar la carga crítica.' }
];

const mockZoneGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 'Z1', name: 'Centro Histórico', saturation: 85, color: '#8e6b73' }, // Critical
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-101.198, 19.708], [-101.188, 19.712], [-101.182, 19.700], [-101.192, 19.696], [-101.198, 19.708]
        ]]
      }
    },
    {
      type: 'Feature',
      properties: { id: 'Z2', name: 'Zona Sur', saturation: 35, color: '#b6ccb5' }, // Safe
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-101.210, 19.695], [-101.200, 19.699], [-101.195, 19.690], [-101.205, 19.686], [-101.210, 19.695]
        ]]
      }
    }
  ]
};

const mockZoneStats = [
  { id: 1, name: 'Centro Histórico', saturation: 85, status: 'critical', note: 'ALTO RIESGO - DÍA DE TIANGUIS' },
  { id: 2, name: 'Zona Norte', saturation: 62, status: 'warning', note: '' },
  { id: 3, name: 'Colonia Las Américas', saturation: 15, status: 'safe', note: '' },
];

const fillLayerStyle = {
  id: 'zones-fill',
  type: 'fill',
  paint: {
    'fill-color': ['get', 'color'],
    'fill-opacity': 0.2
  }
};

const lineLayerStyle = {
  id: 'zones-line',
  type: 'line',
  paint: {
    'line-color': ['get', 'color'],
    'line-width': 2,
    'line-dasharray': [2, 2]
  }
};

export default function SmartMapView() {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#fbf9f6] relative">
      {/* Map Area */}
      <div className="flex-1 relative w-full h-full bg-[#fbf9f6]">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={{
              longitude: -101.1924,
              latitude: 19.7027,
              zoom: 13.5
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
          >
            <Source type="geojson" data={mockZoneGeoJSON}>
              <Layer {...fillLayerStyle} />
              <Layer {...lineLayerStyle} />
            </Source>

            <Popup longitude={-101.188} latitude={19.706} closeButton={false} anchor="bottom" offset={20}>
              <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 min-w-[180px]">
                <div className="flex items-center space-x-2 text-[#8e6b73] mb-2">
                  <MapIcon className="w-4 h-4" />
                  <span className="font-bold text-sm">Zona: Centro</span>
                </div>
                <div className="flex justify-between text-xs text-[#1b1c1a] font-medium mb-3">
                  <span>Gen: <span className="font-bold">120 Tons</span></span>
                  <span>Sat: <span className="text-[#8e6b73] font-bold">85%</span></span>
                </div>
                <div className="bg-[#f5f3f0] text-[#1b1c1a] text-xs font-bold py-1.5 px-3 rounded-lg text-center">
                  14 Contenedores Críticos
                </div>
              </div>
            </Popup>
          </Map>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#fbf9f6]">
            <p className="text-[#8e6b73] font-bold mb-2">Falta VITE_MAPBOX_TOKEN</p>
            <p className="text-sm text-[#4d614e]">Añádelo a tu archivo .env para ver el mapa.</p>
          </div>
        )}

        {/* FLOATING UI */}

        {/* Top-Left: Zone Saturation */}
        <div className="absolute top-6 left-6 z-10 w-[340px] bg-white/90 backdrop-blur-md rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-extrabold text-[#1b1c1a] text-lg">Saturación de Zona en Vivo</h3>
              <p className="text-xs text-[#4d614e] font-medium mt-1">Matriz de Probabilidad</p>
            </div>
            <button className="text-gray-400 hover:text-[#1b1c1a]"><MoreVertical className="w-5 h-5" /></button>
          </div>

          <div className="space-y-6">
            {mockZoneStats.map((zone) => (
              <div key={zone.id}>
                <div className="flex justify-between text-sm font-bold text-[#1b1c1a] mb-2">
                  <span>{zone.name}</span>
                  <span className={zone.status === 'critical' ? 'text-[#8e6b73]' : zone.status === 'warning' ? 'text-[#e5b370]' : 'text-[#4d614e]'}>
                    {zone.saturation}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f0] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${zone.status === 'critical' ? 'bg-[#8e6b73]' : zone.status === 'warning' ? 'bg-[#e5b370]' : 'bg-[#4d614e]'}`}
                    style={{ width: `${zone.saturation}%` }}
                  ></div>
                </div>
                {zone.note && (
                  <div className="inline-flex items-center space-x-1.5 bg-[#8e6b73]/10 text-[#8e6b73] px-2.5 py-1 rounded-md">
                    <AlertTriangle className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{zone.note}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="text-xs font-bold text-[#4d614e]">Pronóstico Próximas 12 Horas</span>
            {/* Fake Toggle Switch */}
            <div className="w-10 h-6 bg-[#4d614e] rounded-full p-1 cursor-pointer">
              <div className="w-4 h-4 bg-white rounded-full translate-x-4"></div>
            </div>
          </div>
        </div>

        {/* Top-Right: Search & Profile */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center p-2 border border-white">
            <div className="flex items-center px-4 border-r border-gray-200">
              <input type="text" placeholder="Buscar Zona o ID de Contenedor..." className="bg-transparent text-sm w-48 focus:outline-none placeholder-gray-400 font-medium text-[#1b1c1a]" />
              <Filter className="w-4 h-4 text-[#4d614e]" />
            </div>
            <button className="p-2 mx-1 relative text-[#4d614e] hover:bg-[#f5f3f0] rounded-full transition-colors">
              <Activity className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8e6b73] rounded-full"></span>
            </button>
            <button className="p-1 ml-1">
              <div className="bg-[#f5f3f0] rounded-full p-1.5">
                <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-6 h-6 rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Bottom-Center: AI Action Bar */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-white/95 backdrop-blur-md rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-2 flex items-center border border-white">
            <div className="px-4 border-r border-gray-100 flex items-center space-x-3">
              <div className="w-3 h-3 bg-[#4d614e] rounded-full animate-pulse"></div>
              <div>
                <p className="text-xs font-bold text-[#1b1c1a]">Estado IA: <span className="text-[#4d614e] font-medium">Procesando</span></p>
                <p className="text-[10px] text-gray-500 font-medium">248 puntos...</p>
              </div>
            </div>
            <div className="px-6 flex items-center space-x-2 text-[#8e6b73]">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-xs font-bold">3 Rutas Activas en Zonas de Alto Riesgo</span>
            </div>
            <button className="bg-[#4d614e] hover:bg-[#3d4d3e] text-white text-sm font-bold px-6 py-3 rounded-xl flex items-center space-x-2 transition-colors">
              <Navigation className="w-4 h-4" />
              <span>Generar Redirecciones Zonales</span>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT AI COPILOT PANEL */}
      <div className="w-96 bg-white border-l border-[#e4e2df] flex flex-col h-full shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20 shrink-0">
        <div className="p-6 border-b border-[#f5f3f0] flex items-center space-x-3">
          <div className="bg-[#f5f3f0] p-2 rounded-xl relative">
            <Brain className="w-5 h-5 text-[#4d614e]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#4d614e] rounded-full animate-pulse"></div>
          </div>
          <h3 className="font-extrabold text-[#1b1c1a] text-lg tracking-tight">Copiloto WasteAI</h3>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6">
          {mockChatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'user' ? (
                <div className="bg-[#e9e8e5] text-[#1b1c1a] p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm font-medium">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-[#f5f3f0] text-[#1b1c1a] p-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm shadow-sm font-medium leading-relaxed">
                  <p className="mb-4">{msg.text}</p>
                  <div className="flex items-center space-x-2 text-[#4d614e] font-bold bg-white p-2.5 rounded-xl border border-[#e4e2df] shadow-sm">
                    <Navigation className="w-4 h-4" />
                    <span>CAM-04 Redirigido</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-[#f5f3f0]">
          <div className="flex items-center bg-[#fbf9f6] rounded-2xl p-1.5 border border-[#e4e2df] focus-within:border-[#4d614e]/50 focus-within:ring-2 focus-within:ring-[#4d614e]/10 transition-all shadow-inner">
            <input
              type="text"
              placeholder="Pídele a la IA que redirija..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-[#1b1c1a] font-medium placeholder-gray-400"
            />
            <button className="bg-[#4d614e] hover:bg-[#3d4d3e] p-2.5 rounded-xl text-white transition-colors shadow-sm flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
