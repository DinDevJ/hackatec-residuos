import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, Truck, CheckCircle2, FileText, Brain,
  RefreshCw, Send, Loader2, AlertTriangle, BarChart2, Package
} from 'lucide-react';
import { getActiveRoutes, exportRoutePdf, chatAI } from '../api/client';

// === Caché en memoria (persiste entre cambios de pestaña sin usar localStorage) ===
let cachedMessages = [
  { role: 'ai', text: 'Hola, soy Eco-Brain. Tengo acceso en tiempo real a la telemetría de tu flota. ¿En qué te puedo ayudar para optimizar las rutas hoy?' }
];

const statusLabels = {
  'In Progress': { label: 'En Progreso', color: 'bg-[#4d614e]/10 text-[#4d614e]' },
  'Pending':     { label: 'Pendiente',   color: 'bg-gray-100 text-gray-500' },
  'Re-routed':   { label: 'Redirigida',  color: 'bg-blue-50 text-blue-600' },
  'Delayed':     { label: 'Retrasada',   color: 'bg-[#e57373]/10 text-[#e57373]' },
};

export default function AIRoutingView() {
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(true);
  const [messages, setMessages] = useState(cachedMessages);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [exportingId, setExportingId] = useState(null);
  const chatEndRef = useRef(null);

  const fetchRoutes = () => {
    setLoadingRoutes(true);
    getActiveRoutes()
      .then(res => setRoutes(res.data))
      .catch(console.error)
      .finally(() => setLoadingRoutes(false));
  };

  useEffect(() => { fetchRoutes(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const updateMessages = (newMsgs) => {
    cachedMessages = newMsgs;
    setMessages(newMsgs);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    const userMsg = { role: 'user', text: inputText };
    const newHistory = [...messages, userMsg];
    updateMessages(newHistory);
    setInputText('');
    setIsTyping(true);
    try {
      const res = await chatAI(inputText);
      updateMessages([...newHistory, { role: 'ai', text: res.data.reply }]);
      if (res.data.action_trigger === 'refresh_routes') fetchRoutes();
    } catch {
      updateMessages([...newHistory, { role: 'ai', text: 'Error al contactar a Eco-Brain. Intenta de nuevo.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExportPdf = async (routeId, routeName) => {
    setExportingId(routeId);
    try {
      const res = await exportRoutePdf(routeId);
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `manifiesto_${routeId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando PDF:', err);
    } finally {
      setExportingId(null);
    }
  };

  const criticalRoutes = routes.filter(r => r.live_stats?.sat_promedio >= 80).length;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#FCFAFA]">
      {/* ===== CENTRO ===== */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Motor de Optimización de Rutas</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#4d614e]" />
              <span>Impulsado por Eco-Brain · Gemini Flash</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            {criticalRoutes > 0 && (
              <div className="flex items-center gap-2 bg-[#e57373]/10 text-[#e57373] px-4 py-2 rounded-xl text-sm font-bold">
                <AlertTriangle className="w-4 h-4" />
                <span>{criticalRoutes} zona{criticalRoutes > 1 ? 's' : ''} crítica{criticalRoutes > 1 ? 's' : ''}</span>
              </div>
            )}
            <button
              onClick={fetchRoutes}
              className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl px-4 py-2 flex items-center space-x-2 text-sm font-medium text-gray-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizar</span>
            </button>
          </div>
        </div>

        {/* Route Cards */}
        {loadingRoutes ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-8 h-8 animate-spin text-[#4d614e]" />
          </div>
        ) : (
          <div className="flex flex-wrap gap-6">
            {routes.map((route) => {
              const status = statusLabels[route.status] || { label: route.status, color: 'bg-gray-100 text-gray-500' };
              const live = route.live_stats || {};
              const isAI = route.efficiency_saved && route.efficiency_saved !== 'Standard';
              const containerPct = route.containers_max > 0
                ? (route.containers_current / route.containers_max) * 100
                : 0;

              return (
                <div key={route.route_id} className="w-[340px] bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col relative overflow-hidden">
                  {/* AI Banner */}
                  {isAI && (
                    <div className="bg-[#eef3ee] text-[#4d614e] text-[11px] font-bold px-5 py-2 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Optimizada por Eco-Brain IA</span>
                    </div>
                  )}

                  <div className="p-6 flex flex-col flex-1">
                    {/* Title row */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center space-x-3">
                        <div className="bg-[#f5f3f0] p-2.5 rounded-2xl">
                          <Truck className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-bold text-base text-gray-900">{route.name}</h4>
                          <p className="text-xs text-gray-500 font-medium mt-0.5">{route.zone} · {route.truck}</p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Metrics grid */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-[#FCFAFA] p-3.5 rounded-2xl">
                        <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tiempo Est.</p>
                        <p className="text-lg font-bold text-gray-900">{route.est_time}</p>
                      </div>
                      <div className={`${isAI ? 'bg-[#eef3ee] border border-[#4d614e]/10' : 'bg-[#FCFAFA]'} p-3.5 rounded-2xl`}>
                        <p className={`text-[11px] ${isAI ? 'text-[#4d614e]' : 'text-gray-500'} font-bold uppercase tracking-wider mb-1`}>Ahorro</p>
                        {isAI ? (
                          <p className="text-lg font-bold text-[#4d614e] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" />
                            {route.efficiency_saved.split(' ')[0]}
                          </p>
                        ) : (
                          <p className="text-sm font-bold text-gray-500 mt-1">Estándar</p>
                        )}
                      </div>
                    </div>

                    {/* Containers bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
                        <span>Contenedores</span>
                        <span>{route.containers_current} / {route.containers_max}</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${containerPct > 80 ? 'bg-[#e57373]' : 'bg-[#4d614e]'} rounded-full`}
                          style={{ width: `${containerPct}%` }}
                        />
                      </div>
                    </div>

                    {/* Live zone stats */}
                    {live.sat_promedio !== undefined && (
                      <div className="bg-[#f5f3f0] rounded-2xl p-3 mb-4 flex items-center justify-between text-xs font-medium text-gray-600">
                        <div className="flex items-center gap-1.5">
                          <BarChart2 className="w-3.5 h-3.5 text-[#4d614e]" />
                          <span>Sat. zona: <strong className={live.sat_promedio >= 80 ? 'text-[#e57373]' : 'text-[#4d614e]'}>{live.sat_promedio}%</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-3.5 h-3.5 text-[#8e6b73]" />
                          <span>Críticos: <strong className="text-[#8e6b73]">{live.contenedores_criticos}</strong></span>
                        </div>
                      </div>
                    )}

                    {/* PDF Export button */}
                    <button
                      onClick={() => handleExportPdf(route.route_id, route.name)}
                      disabled={exportingId === route.route_id}
                      className="w-full mt-auto py-3 bg-[#F9F3F2] hover:bg-[#f0e6e4] disabled:opacity-60 text-gray-800 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors"
                    >
                      {exportingId === route.route_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <FileText className="w-4 h-4" />
                      )}
                      <span>{exportingId === route.route_id ? 'Generando PDF...' : 'Exportar Manifiesto PDF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ===== PANEL DERECHO — ECO-BRAIN ===== */}
      <div className="w-[380px] bg-white border-l border-stone-100 flex flex-col h-full shadow-[0_0_40px_rgba(0,0,0,0.03)] z-10 shrink-0">
        <div className="p-5 border-b border-stone-50 flex items-center space-x-3">
          <div className="bg-[#eef3ee] p-2 rounded-xl relative">
            <Brain className="w-5 h-5 text-[#4d614e]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#4d614e] rounded-full animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Eco-Brain</h3>
            <p className="text-xs text-gray-400 font-medium">Analiza datos de flota en tiempo real</p>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-5">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${msg.role === 'user'
                  ? 'bg-[#F9F3F2] text-gray-800 rounded-tr-sm'
                  : 'bg-[#eef3ee] text-[#2c3d2c] border border-[#4d614e]/10 rounded-tl-sm'
                } p-4 rounded-2xl max-w-[90%] text-sm shadow-sm`}>
                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[#eef3ee] border border-[#4d614e]/10 p-4 rounded-2xl rounded-tl-sm text-sm shadow-sm flex space-x-2 items-center">
                <RefreshCw className="w-4 h-4 animate-spin text-[#4d614e]" />
                <span className="text-gray-500 font-medium">Eco-Brain está analizando...</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-5 border-t border-stone-50 bg-white">
          <div className="flex items-center bg-[#FCFAFA] rounded-2xl p-1.5 border border-stone-200 focus-within:border-[#4d614e]/50 transition-colors shadow-inner">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Pregúntale al Eco-Brain..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
            <button
              onClick={handleSendMessage}
              disabled={isTyping || !inputText.trim()}
              className="bg-[#4d614e] hover:bg-[#3d4d3e] disabled:bg-gray-300 p-2.5 rounded-xl text-white transition-colors shadow-sm flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
