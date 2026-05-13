import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Truck, Users, Flame, BarChart3, Info, Star, MessageSquare, MapPin } from 'lucide-react';
import { getFleetStatus } from '../api/client';

export default function FleetManagerView() {
  const [fleetData, setFleetData] = useState([]);
  const [selectedTruckId, setSelectedTruckId] = useState(null);

  useEffect(() => {
    getFleetStatus().then(res => {
      setFleetData(res.data);
      if (res.data.length > 0) setSelectedTruckId(res.data[0].unit_id);
    }).catch(console.error);
  }, []);

  const selectedTruck = useMemo(() => fleetData.find(t => t.unit_id === selectedTruckId), [fleetData, selectedTruckId]);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#FCFAFA]">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Flotilla y Operadores</h2>
          <p className="text-sm text-gray-500 mt-1">Monitorea operaciones en vivo y el estado de la flotilla.</p>
        </div>
        <button className="bg-[#7B907B] hover:bg-[#6a7d6a] text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Agregar Nuevo Vehículo</span>
        </button>
      </div>

      {/* Top Row: KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Vehículos Activos</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-900">12</span>
            <span className="text-sm font-semibold text-gray-400">/ 14</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Conductores en Turno</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">12</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="text-[#E07A5F] w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Consumo de Diésel en Vivo</h3>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-900">450</span>
            <span className="text-lg font-semibold text-gray-500">L</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Capacidad de Flotilla</h3>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-900">82</span>
            <span className="text-lg font-semibold text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Bottom Split: Master-Detail */}
      <div className="flex gap-6 h-[500px]">
        {/* Left: Fleet List (60%) */}
        <div className="w-[60%] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Estado de Unidades en Vivo</h3>
          <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-4">
            {fleetData.map((truck) => (
              <div
                key={truck.unit_id}
                onClick={() => setSelectedTruckId(truck.unit_id)}
                className={`p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all border ${selectedTruckId === truck.unit_id
                  ? 'bg-white border-[#7B907B]/30 shadow-sm ring-1 ring-[#7B907B]/10'
                  : 'bg-[#F9F3F2] border-transparent hover:bg-white hover:shadow-sm'
                  }`}
              >
                {/* Icon + Info */}
                <div className="flex items-center space-x-4 min-w-[150px]">
                  <div className={`p-3 rounded-2xl ${selectedTruckId === truck.unit_id ? 'bg-[#7B907B]' : 'bg-gray-200'}`}>
                    <Truck className={`w-5 h-5 ${selectedTruckId === truck.unit_id ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{truck.unit_id}</p>
                    <p className="text-xs text-gray-500 font-medium">{truck.driver_name}</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="w-28 flex justify-center">
                  <span className={`inline-flex px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${truck.status === 'In Transit'
                    ? 'bg-gray-200/50 text-gray-600'
                    : truck.status === 'Delayed' ? 'bg-[#E07A5F]/10 text-[#E07A5F]' : 'bg-[#7B907B]/10 text-[#7B907B]'
                    }`}>
                    {truck.status}
                  </span>
                </div>

                {/* Load Bar */}
                <div className="w-32 flex flex-col space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                    <span>Carga</span>
                    <span>{truck.load_pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${truck.load_pct > 80 ? 'bg-[#7B907B]' : 'bg-gray-400'}`}
                      style={{ width: `${truck.load_pct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Route */}
                <div className="w-32 text-right">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {truck.current_zone !== 'N/A' ? `Zona: ${truck.current_zone}` : 'N/A'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Truck Detail Panel (40%) */}
        <div className="w-[40%] bg-[#F9F3F2] rounded-3xl p-6 flex flex-col border border-gray-100 shadow-sm relative overflow-hidden">
          {selectedTruck && (
            <>
              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Unidad {selectedTruck.unit_id}</h3>
                <button className="text-gray-400 hover:text-gray-600">
                  <Info className="w-5 h-5" />
                </button>
              </div>

              {/* Driver Card */}
              <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 mb-8 shadow-sm">
                <img src={`https://i.pravatar.cc/150?u=${selectedTruck.driver_name}`} alt="Conductor" className="w-12 h-12 rounded-full border-2 border-gray-50" />
                <div>
                  <p className="font-bold text-gray-900">{selectedTruck.driver_name}</p>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                    <span className="text-xs font-semibold text-gray-500">Calificación {selectedTruck.telemetry?.driver_rating || '4.5'}</span>
                  </div>
                </div>
              </div>

              {/* Live Telemetry */}
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Telemetría en Vivo</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                    <span className="text-sm text-gray-600 font-medium">Eficiencia Combustible</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry?.fuel_efficiency || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                    <span className="text-sm text-gray-600 font-medium">Velocidad Actual</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry?.current_speed || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                    <span className="text-sm text-gray-600 font-medium">Temp. del Motor</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry?.engine_temp || '--'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 font-medium">Llegada Estimada</span>
                    <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry?.eta || '--'}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors shadow-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Mensaje al Operador</span>
            </button>
            <button className="w-full py-3 bg-[#7B907B] hover:bg-[#6a7d6a] text-white font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors shadow-sm">
              <MapPin className="w-4 h-4" />
              <span>Reasignar Ruta</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
