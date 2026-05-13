import React from 'react';
import { Sparkles, ChevronDown, Calendar, RotateCcw, Truck, CheckCircle2, FileText, Brain, RefreshCw, Send } from 'lucide-react';

export default function AIRoutingView() {
  return (
    <div className="flex-1 flex overflow-hidden bg-[#FCFAFA]">
      {/* Center Workspace */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Motor de Optimización de Rutas con IA</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#7B907B]" />
              <span>Impulsado por Gemini Flash</span>
            </p>
          </div>

          <div className="flex items-end space-x-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Sector de Flotilla</label>
              <button className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl px-4 py-2 flex items-center space-x-3 transition-colors">
                <span className="text-sm font-medium text-gray-900">Zona Norte</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Fecha</label>
              <button className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl px-4 py-2 flex items-center space-x-3 transition-colors">
                <span className="text-sm font-medium text-gray-900">27/10/2023</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center space-x-1.5 pb-2 transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span>Restablecer Valores</span>
            </button>
          </div>
        </div>

        {/* Route Cards */}
        <div className="flex flex-wrap gap-6">
          {/* Card 1: Route Alpha */}
          <div className="w-[340px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
            {/* Highlight Banner */}
            <div className="absolute top-0 left-0 right-0 bg-[#eef3ee] text-[#7B907B] text-[11px] font-bold px-5 py-2 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Actualizado por Copiloto de IA</span>
            </div>

            <div className="mt-8 flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#FCFAFA] p-3 rounded-2xl">
                  <Truck className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Ruta Alfa</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Zona Norte • Camión 402</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">En Progreso</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#FCFAFA] p-4 rounded-2xl">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tiempo Est.</p>
                <p className="text-xl font-bold text-gray-900">4h 15m</p>
              </div>
              <div className="bg-[#eef3ee] p-4 rounded-2xl border border-[#7B907B]/10">
                <p className="text-[11px] text-[#7B907B] font-bold uppercase tracking-wider mb-1">Eficiencia</p>
                <p className="text-xl font-bold text-[#7B907B] flex items-center space-x-1">
                  <span>12L</span>
                </p>
                <p className="text-[10px] text-[#7B907B] font-bold flex items-center mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Diésel Ahorrado
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                <span>Contenedores</span>
                <span>45 / 50 Cap.</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#7B907B] rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>

            <button className="w-full mt-auto py-3.5 bg-[#F9F3F2] hover:bg-[#f0e6e4] text-gray-800 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Exportar Hoja de Ruta PDF</span>
            </button>
          </div>

          {/* Card 2: Route Beta */}
          <div className="w-[340px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center space-x-4">
                <div className="bg-[#FCFAFA] p-3 rounded-2xl">
                  <Truck className="w-6 h-6 text-gray-700" />
                </div>
                <div>
                  <h4 className="font-bold text-lg text-gray-900">Ruta Beta</h4>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Zona Norte • Camión 415</p>
                </div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">Pendiente</span>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#FCFAFA] p-4 rounded-2xl">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Tiempo Est.</p>
                <p className="text-xl font-bold text-gray-900">5h 30m</p>
              </div>
              <div className="bg-[#FCFAFA] p-4 rounded-2xl">
                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Eficiencia</p>
                <p className="text-sm font-bold text-gray-700 mt-1">Estándar</p>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                <span>Contenedores</span>
                <span>20 / 50 Cap.</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gray-400 rounded-full" style={{ width: '40%' }}></div>
              </div>
            </div>

            <button className="w-full mt-auto py-3.5 bg-[#F9F3F2] hover:bg-[#f0e6e4] text-gray-800 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors">
              <FileText className="w-4 h-4" />
              <span>Exportar Hoja de Ruta PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Right AI Copilot Panel */}
      <div className="w-[380px] bg-white border-l border-stone-100 flex flex-col h-full shadow-[0_0_40px_rgba(0,0,0,0.03)] z-10 shrink-0">
        {/* Copilot Header */}
        <div className="p-5 border-b border-stone-50 flex items-center space-x-3">
          <div className="bg-[#eef3ee] p-2 rounded-xl relative">
            <Brain className="w-5 h-5 text-[#7B907B]" />
            <div className="absolute top-1 right-1 w-2 h-2 bg-[#7B907B] rounded-full animate-pulse"></div>
          </div>
          <h3 className="font-bold text-gray-900 text-lg">Copiloto WasteAI</h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-[#F9F3F2] text-gray-800 p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm">
              Prioriza las recolecciones en el Mercado Independencia antes de las 10 AM debido al tráfico.
            </div>
          </div>

          {/* AI Message */}
          <div className="flex justify-start">
            <div className="bg-[#eef3ee] text-[#2c3d2c] p-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm shadow-sm border border-[#7B907B]/10">
              <p className="mb-4 leading-relaxed">Analizando datos históricos de tráfico para el Mercado Independencia...</p>
              <div className="flex items-center space-x-2 text-[#7B907B] font-bold bg-white/60 p-2.5 rounded-lg border border-white/40">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Redirigiendo flotillas activas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-stone-50 bg-white">
          <div className="flex items-center bg-[#FCFAFA] rounded-2xl p-1.5 border border-stone-200 focus-within:border-[#7B907B]/50 transition-colors shadow-inner">
            <input
              type="text"
              placeholder="Pídele al Copiloto que ajuste..."
              className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none text-gray-800 placeholder-gray-400"
            />
            <button className="bg-[#7B907B] hover:bg-[#6a7d6a] p-2.5 rounded-xl text-white transition-colors shadow-sm flex-shrink-0">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
