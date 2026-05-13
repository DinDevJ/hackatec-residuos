import React from 'react';
import { Weight, Fuel, Truck, CheckCircle2, Brain, Activity, FileText } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { time: '06:00', volume: 200, prediction: 250 },
  { time: '10:00', volume: 450, prediction: 400 },
  { time: '14:00', volume: 500, prediction: 520 },
  { time: '18:00', volume: 750, prediction: 700 },
];

export default function DashboardView() {
  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#FCFAFA]">
      {/* Top Row: KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Tonelaje Diario</h3>
            <Weight className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">450</span>
            <span className="text-sm text-gray-500">/ 800t</span>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#7B907B] w-[56%] rounded-full"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Eficiencia de Diésel</h3>
            <Fuel className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#7B907B]">+20%</span>
            <span className="text-sm text-gray-500">Ahorrado</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Comparado con los últimos 30 días</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Flotilla Activa</h3>
            <Truck className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">12</span>
            <span className="text-sm text-gray-500">/ 14 Camiones</span>
          </div>
          <div className="mt-4 flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < 3 ? 'bg-[#7B907B]' : 'bg-gray-100'}`}></div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Zonas Limpiadas Hoy</h3>
            <CheckCircle2 className="text-[#7B907B] w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">24</span>
            <span className="text-sm text-gray-500">Zonas</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Sensores de IA reportan nuevas zonas</p>
        </div>
      </div>

      {/* Middle Row: Chart & Alerts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Volumen de Recolección vs Modelo Predictivo de IA</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B907B" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#7B907B" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPred" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E07A5F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E07A5F" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="volume" stroke="#7B907B" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="prediction" stroke="#E07A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="text-[#7B907B] w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-900">Alertas del Eco-Cerebro</h3>
          </div>

          <div className="space-y-6 flex-1">
            <div className="flex space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#E07A5F]"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Acumulación de tráfico en la Zona B</p>
                <p className="text-xs text-gray-500 mt-1">Redirigir el Camión 04 ahorra 15 min.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-[#7B907B]"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Capacidad de carga óptima alcanzada</p>
                <p className="text-xs text-gray-500 mt-1">Camión 08 listo para regresar al depósito.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <div className="w-2 h-2 mt-2 rounded-full bg-gray-400"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Aviso Previo de Mantenimiento</p>
                <p className="text-xs text-gray-500 mt-1">Revisar pastillas de freno en el Camión 02.</p>
              </div>
            </div>
          </div>

          <button className="w-full mt-6 bg-[#7B907B] hover:bg-[#6a7d6a] text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors">
            <Activity className="w-5 h-5" />
            <span className="font-medium">Optimizar Ruta</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Asignaciones de Rutas Activas</h3>
          <button className="text-sm font-medium text-[#7B907B] hover:text-[#6a7d6a]">Ver Todo</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">ID del Camión</th>
                <th className="px-6 py-4 font-medium">Conductor</th>
                <th className="px-6 py-4 font-medium">Zona Actual</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <tr className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">CAM-004</td>
                <td className="px-6 py-4 text-gray-500">Maria Garcia</td>
                <td className="px-6 py-4 text-gray-500">Distrito Norte</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#7B907B]/10 text-[#7B907B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7B907B] mr-1.5"></span>
                    En Tiempo
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="inline-flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                    <FileText className="w-4 h-4" />
                    <span>Exportar PDF</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
