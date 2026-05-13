import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Map as MapIcon, Activity, Brain, Send, Navigation, AlertTriangle, MoreVertical, Filter, Loader2
} from 'lucide-react';
import Map, { Source, Layer, Popup } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getZonesGeojson, getSaturationList, chatAI } from '../api/client';

const fillLayerStyle = {
  id: 'zones-fill',
  type: 'fill',
  paint: {
    'fill-color': ['get', 'fill_color'],
    'fill-opacity': 0.3
  }
};

const lineLayerStyle = {
  id: 'zones-line',
  type: 'line',
  paint: {
    'line-color': ['get', 'fill_color'],
    'line-width': 2,
    'line-dasharray': [2, 2]
  }
};

// Frontend In-Memory Cache (Persists across tab switching as long as the page is not hard-refreshed)
let cachedChatHistory = [
  { id: 1, sender: 'ai', text: 'Hola, soy Eco-Brain. ¿Qué zona deseas optimizar o analizar en el mapa?' }
];

export default function SmartMapView() {
  const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;
  
  const [geoJson, setGeoJson] = useState(null);
  const [saturationList, setSaturationList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState(cachedChatHistory);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedZone, setSelectedZone] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    Promise.all([getZonesGeojson(), getSaturationList()])
      .then(([geoRes, satRes]) => {
        setGeoJson(geoRes.data);
        setSaturationList(satRes.data);
      })
      .catch(err => console.error("Error fetching map data:", err))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const updateChat = (newHistory) => {
    cachedChatHistory = newHistory;
    setChatHistory(newHistory);
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
    
    const userMsg = { id: Date.now(), sender: 'user', text: chatInput };
    const historyWithUser = [...chatHistory, userMsg];
    updateChat(historyWithUser);
    
    setChatInput('');
    setIsTyping(true);

    try {
      const res = await chatAI(userMsg.text);
      const aiMsg = { id: Date.now() + 1, sender: 'ai', text: res.data.reply };
      updateChat([...historyWithUser, aiMsg]);
    } catch (err) {
      updateChat([...historyWithUser, { id: Date.now() + 1, sender: 'ai', text: 'Error al contactar a Eco-Brain.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleMapClick = (e) => {
    if (e.features && e.features.length > 0) {
      const feature = e.features[0];
      setSelectedZone({
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
        properties: feature.properties
      });
    } else {
      setSelectedZone(null);
    }
  };

  const filteredGeoJson = useMemo(() => {
    if (!geoJson || !searchQuery) return geoJson;
    return {
      ...geoJson,
      features: geoJson.features.filter(f => 
        f.properties.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    };
  }, [geoJson, searchQuery]);

  const filteredSaturationList = useMemo(() => {
    if (!searchQuery) return saturationList;
    return saturationList.filter(z => z.zone.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [saturationList, searchQuery]);

  return (
    <div className="flex-1 flex overflow-hidden bg-[#fbf9f6] relative">
      {/* Map Area */}
      <div className="flex-1 relative w-full h-full bg-[#fbf9f6]">
        {MAPBOX_TOKEN ? (
          <Map
            initialViewState={{
              longitude: -101.1924,
              latitude: 19.7027,
              zoom: 12.5
            }}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
            interactiveLayerIds={['zones-fill']}
            onClick={handleMapClick}
          >
            {filteredGeoJson && (
              <Source type="geojson" data={filteredGeoJson}>
                <Layer {...fillLayerStyle} />
                <Layer {...lineLayerStyle} />
              </Source>
            )}

            {selectedZone && (
              <Popup 
                longitude={selectedZone.lng} 
                latitude={selectedZone.lat} 
                closeButton={true} 
                closeOnClick={false}
                onClose={() => setSelectedZone(null)}
                anchor="bottom" 
                offset={20}
              >
                <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100 min-w-[180px]">
                  <div className="flex items-center space-x-2 text-[#8e6b73] mb-2">
                    <MapIcon className="w-4 h-4" />
                    <span className="font-bold text-sm">Zona: {selectedZone.properties.name}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#1b1c1a] font-medium mb-3">
                    <span>Gen: <span className="font-bold">{selectedZone.properties.generated_tons} t</span></span>
                    <span>Sat: <span className="text-[#8e6b73] font-bold">{selectedZone.properties.saturation_pct}%</span></span>
                  </div>
                  <div className="bg-[#f5f3f0] text-[#1b1c1a] text-xs font-bold py-1.5 px-3 rounded-lg text-center">
                    {selectedZone.properties.critical_bins} Contenedores Críticos
                  </div>
                </div>
              </Popup>
            )}
          </Map>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-[#fbf9f6]">
            <p className="text-[#8e6b73] font-bold mb-2">Falta VITE_MAPBOX_TOKEN</p>
            <p className="text-sm text-[#4d614e]">Añádelo a tu archivo .env para ver el mapa.</p>
          </div>
        )}

        {/* Floating UI: Top-Left Zone Saturation */}
        <div className="absolute top-6 left-6 z-10 w-[340px] max-h-[80%] overflow-y-auto bg-white/90 backdrop-blur-md rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-white scrollbar-hide">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="font-extrabold text-[#1b1c1a] text-lg">Saturación en Vivo</h3>
              <p className="text-xs text-[#4d614e] font-medium mt-1">Conectado a Sensores</p>
            </div>
            <button className="text-gray-400 hover:text-[#1b1c1a]"><MoreVertical className="w-5 h-5" /></button>
          </div>

          <div className="space-y-6">
            {loading ? (
              <div className="flex justify-center p-4"><Loader2 className="w-6 h-6 animate-spin text-[#4d614e]" /></div>
            ) : filteredSaturationList.length === 0 ? (
              <div className="text-center text-sm text-gray-500 py-4">No se encontraron zonas</div>
            ) : filteredSaturationList.map((zone, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm font-bold text-[#1b1c1a] mb-2">
                  <span>{zone.zone}</span>
                  <span className={zone.alert === 'CRITICAL' ? 'text-[#e57373]' : zone.alert === 'WARNING' ? 'text-[#ffb74d]' : 'text-[#81c784]'}>
                    {zone.sat_pct}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-[#f5f3f0] rounded-full overflow-hidden mb-2">
                  <div
                    className={`h-full rounded-full ${zone.alert === 'CRITICAL' ? 'bg-[#e57373]' : zone.alert === 'WARNING' ? 'bg-[#ffb74d]' : 'bg-[#81c784]'}`}
                    style={{ width: `${zone.sat_pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating UI: Top-Right Search */}
        <div className="absolute top-6 right-6 z-10">
          <div className="bg-white/90 backdrop-blur-md rounded-full shadow-sm flex items-center p-2 border border-white">
            <div className="flex items-center px-4 border-r border-gray-200">
              <input 
                type="text" 
                placeholder="Buscar Zona..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-sm w-48 focus:outline-none placeholder-gray-400 font-medium text-[#1b1c1a]" 
              />
              <Filter className="w-4 h-4 text-[#4d614e]" />
            </div>
            <button className="p-2 mx-1 relative text-[#4d614e] hover:bg-[#f5f3f0] rounded-full transition-colors">
              <Activity className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#8e6b73] rounded-full"></span>
            </button>
          </div>
        </div>

      </div>

      {/* RIGHT AI COPILOT PANEL */}
      <div className="w-96 bg-white border-l border-[#e4e2df] flex flex-col h-full shadow-[-4px_0_24px_rgba(0,0,0,0.02)] z-20 shrink-0">
        <div className="p-6 border-b border-[#f5f3f0] flex items-center space-x-3">
          <div className="bg-[#f5f3f0] p-2 rounded-xl relative">
            <Brain className="w-5 h-5 text-[#4d614e]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#e57373] rounded-full animate-pulse"></div>
          </div>
          <div>
            <h3 className="font-extrabold text-[#1b1c1a] text-lg tracking-tight">Eco-Brain</h3>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6 bg-gray-50/30">
          {chatHistory.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'user' ? (
                <div className="bg-[#e9e8e5] text-[#1b1c1a] p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm font-medium">
                  {msg.text}
                </div>
              ) : (
                <div className="bg-white text-[#1b1c1a] p-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm shadow-sm font-medium leading-relaxed border border-gray-100">
                  <p>{msg.text}</p>
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100 flex space-x-1 items-center">
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-5 border-t border-[#f5f3f0] bg-white">
          <div className="flex items-center bg-[#fbf9f6] rounded-2xl p-1.5 border border-[#e4e2df] focus-within:border-[#4d614e]/50 focus-within:ring-2 focus-within:ring-[#4d614e]/10 transition-all shadow-inner">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregúntale al Eco-Brain..."
              disabled={isTyping}
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-[#1b1c1a] font-medium placeholder-gray-400 disabled:opacity-50"
            />
            <button 
              onClick={handleSendMessage}
              disabled={isTyping || !chatInput.trim()}
              className="bg-[#4d614e] disabled:bg-gray-300 hover:bg-[#3d4d3e] p-2.5 rounded-xl text-white transition-colors shadow-sm flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
