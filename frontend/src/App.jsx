import React, { useState } from 'react';
import {
  Leaf, LayoutDashboard, Map, Cpu, Truck, Settings, HelpCircle,
  Weight, Fuel, AlertTriangle, Activity, Brain, FileText, CheckCircle2,
  Users, Flame, BarChart3, Plus, Info, Star, MessageSquare, MapPin,
  ChevronDown, Calendar, RotateCcw, Sparkles, Send, RefreshCw
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- MOCK DATA ---
// Mocks removed

// --- COMPONENTS ---

function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'smart-map', label: 'Smart Map', icon: Map },
    { id: 'ai-routing', label: 'AI Routing', icon: Cpu },
    { id: 'fleet', label: 'Fleet Manager', icon: Truck },
  ];

  return (
    <aside className="w-64 bg-[#F9F3F2] flex flex-col justify-between h-full border-r border-gray-100 shrink-0">
      <div>
        <div className="p-6 flex items-center space-x-3">
          <div className="bg-[#7B907B] p-2 rounded-lg shadow-sm">
            <Leaf className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">EcoTrack</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Logistics Intelligence</p>
          </div>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-colors ${currentView === item.id
                ? 'bg-[#7B907B] text-white shadow-sm'
                : 'text-gray-600 hover:bg-white hover:shadow-sm'
                }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4">
        <div className="space-y-2 mb-6 px-4">
          <button className="w-full flex items-center space-x-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <Settings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </button>
          <button className="w-full flex items-center space-x-3 py-2 text-gray-600 hover:text-gray-900 transition-colors">
            <HelpCircle className="w-5 h-5" />
            <span className="font-medium">Support</span>
          </button>
        </div>

        {/* User Profile at absolute bottom */}
        <div className="flex items-center space-x-3 p-3 bg-white rounded-2xl shadow-sm border border-gray-50">
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" className="w-10 h-10 rounded-full" />
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">Admin</p>
            <p className="text-xs text-gray-500">Logistics Manager</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

import { getDashboardSummary } from './api/client';

function DashboardView() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    getDashboardSummary().then(res => setData(res.data)).catch(console.error);
  }, []);

  if (!data) return <div className="flex-1 flex justify-center items-center">Loading...</div>;

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#FCFAFA]">
      {/* Top Row: KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Daily Tonnage</h3>
            <Weight className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.kpis.daily_tonnage.current}</span>
            <span className="text-sm text-gray-500">/ {data.kpis.daily_tonnage.max}t</span>
          </div>
          <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#7B907B] rounded-full" style={{ width: `${(data.kpis.daily_tonnage.current / data.kpis.daily_tonnage.max) * 100}%` }}></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Diesel Efficiency</h3>
            <Fuel className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-[#7B907B]">+{data.kpis.diesel_efficiency_saved_pct}%</span>
            <span className="text-sm text-gray-500">Saved</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">Compared to last 30 days</p>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Active Fleet</h3>
            <Truck className="text-gray-400 w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.kpis.active_fleet.active}</span>
            <span className="text-sm text-gray-500">/ {data.kpis.active_fleet.total} Trucks</span>
          </div>
          <div className="mt-4 flex space-x-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i < Math.round((data.kpis.active_fleet.active / data.kpis.active_fleet.total) * 4) ? 'bg-[#7B907B]' : 'bg-gray-100'}`}></div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-sm font-medium text-gray-500">Zonas Limpiadas Hoy</h3>
            <CheckCircle2 className="text-[#7B907B] w-5 h-5" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-gray-900">{data.kpis.zonas_limpiadas}</span>
            <span className="text-sm text-gray-500">Zonas</span>
          </div>
          <p className="text-xs text-gray-400 mt-4">AI sensors report new zones</p>
        </div>
      </div>

      {/* Middle Row: Chart & Alerts */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Collection Volume vs Predictive AI Model</h3>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.chart_data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Area type="monotone" dataKey="real_volume" stroke="#7B907B" strokeWidth={3} fillOpacity={1} fill="url(#colorVolume)" />
                <Area type="monotone" dataKey="ai_prediction" stroke="#E07A5F" strokeWidth={3} fillOpacity={1} fill="url(#colorPred)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="col-span-1 bg-white p-6 rounded-3xl shadow-sm border border-gray-50 flex flex-col">
          <div className="flex items-center space-x-2 mb-6">
            <Brain className="text-[#7B907B] w-6 h-6" />
            <h3 className="text-lg font-semibold text-gray-900">Eco-Brain Alerts</h3>
          </div>

          <div className="space-y-6 flex-1">
            {data.alerts.map((alert, idx) => (
              <div key={idx} className="flex space-x-3">
                <div className={`w-2 h-2 mt-2 rounded-full ${alert.type === 'traffic' ? 'bg-[#E07A5F]' : alert.type === 'capacity' ? 'bg-[#7B907B]' : 'bg-gray-400'}`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.description}</p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 bg-[#7B907B] hover:bg-[#6a7d6a] text-white py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors">
            <Activity className="w-5 h-5" />
            <span className="font-medium">Optimize Route</span>
          </button>
        </div>
      </div>

      {/* Bottom Row: Data Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Active Route Assignments</h3>
          <button className="text-sm font-medium text-[#7B907B] hover:text-[#6a7d6a]">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 font-medium">Truck ID</th>
                <th className="px-6 py-4 font-medium">Driver</th>
                <th className="px-6 py-4 font-medium">Current Zone</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data.active_routes.map((route, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{route.truck_id}</td>
                  <td className="px-6 py-4 text-gray-500">{route.driver}</td>
                  <td className="px-6 py-4 text-gray-500">{route.current_zone}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${route.status === 'Delayed' ? 'bg-[#E07A5F]/10 text-[#E07A5F]' : 'bg-[#7B907B]/10 text-[#7B907B]'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${route.status === 'Delayed' ? 'bg-[#E07A5F]' : 'bg-[#7B907B]'}`}></span>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="inline-flex items-center space-x-1 px-3 py-1.5 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">
                      <FileText className="w-4 h-4" />
                      <span>Export PDF</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { getFleetStatus } from './api/client';

function FleetManagerView() {
  const [fleetData, setFleetData] = React.useState([]);
  const [selectedTruck, setSelectedTruck] = React.useState(null);

  React.useEffect(() => {
    getFleetStatus()
      .then(res => {
        setFleetData(res.data);
        if (res.data.length > 0) setSelectedTruck(res.data[0]);
      })
      .catch(console.error);
  }, []);

  if (!selectedTruck) return <div className="flex-1 flex justify-center items-center">Loading Fleet Data...</div>;

  const activeVehicles = fleetData.filter(t => t.status !== 'Maintenance').length;
  const driversOnShift = activeVehicles; // simplify
  const totalLoad = fleetData.reduce((acc, t) => acc + t.load_pct, 0) / (fleetData.length || 1);

  return (
    <div className="flex-1 overflow-y-auto p-8 bg-[#FCFAFA]">
      {/* Header Area */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Fleet & Operator Management</h2>
          <p className="text-sm text-gray-500 mt-1">Monitor live operations and fleet health.</p>
        </div>
        <button className="bg-[#7B907B] hover:bg-[#6a7d6a] text-white px-5 py-2.5 rounded-xl flex items-center space-x-2 transition-colors shadow-sm">
          <Plus className="w-5 h-5" />
          <span className="font-medium">Add New Vehicle</span>
        </button>
      </div>

      {/* Top Row: KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Truck className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Active Vehicles</h3>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-bold text-gray-900">{activeVehicles}</span>
            <span className="text-sm font-semibold text-gray-400">/ {fleetData.length}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Drivers on Shift</h3>
          </div>
          <div className="flex items-baseline">
            <span className="text-4xl font-bold text-gray-900">{driversOnShift}</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <Flame className="text-[#E07A5F] w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Live Diesel Burn</h3>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-900">450</span>
            <span className="text-lg font-semibold text-gray-500">L</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-50">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="text-gray-400 w-5 h-5" />
            <h3 className="text-sm font-medium text-gray-500">Fleet Capacity</h3>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-4xl font-bold text-gray-900">{Math.round(totalLoad)}</span>
            <span className="text-lg font-semibold text-gray-500">%</span>
          </div>
        </div>
      </div>

      {/* Bottom Split: Master-Detail */}
      <div className="flex gap-6 h-[500px]">
        {/* Left: Fleet List (60%) */}
        <div className="w-[60%] flex flex-col">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 px-2">Live Unit Status</h3>
          <div className="flex-1 overflow-y-auto space-y-3 px-2 pb-4">
            {fleetData.map((truck) => {
              const isSelected = selectedTruck.unit_id === truck.unit_id;
              return (
              <div
                key={truck.unit_id}
                onClick={() => setSelectedTruck(truck)}
                className={`p-4 rounded-3xl flex items-center justify-between cursor-pointer transition-all border ${isSelected
                  ? 'bg-white border-[#7B907B]/30 shadow-sm ring-1 ring-[#7B907B]/10'
                  : 'bg-[#F9F3F2] border-transparent hover:bg-white hover:shadow-sm'
                  }`}
              >
                {/* Icon + Info */}
                <div className="flex items-center space-x-4 min-w-[150px]">
                  <div className={`p-3 rounded-2xl ${isSelected ? 'bg-[#7B907B]' : 'bg-gray-200'}`}>
                    <Truck className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-gray-500'}`} />
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
                    : truck.status === 'Maintenance' ? 'bg-[#E07A5F]/10 text-[#E07A5F]' : 'bg-[#7B907B]/10 text-[#7B907B]'
                    }`}>
                    {truck.status}
                  </span>
                </div>

                {/* Load Bar */}
                <div className="w-32 flex flex-col space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase">
                    <span>Load</span>
                    <span>{truck.load_pct}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${truck.load_pct > 80 ? 'bg-[#E07A5F]' : truck.load_pct > 0 ? 'bg-[#7B907B]' : 'bg-gray-400'}`}
                      style={{ width: `${truck.load_pct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Route */}
                <div className="w-32 text-right">
                  <p className="text-xs font-semibold text-gray-700 truncate">
                    {truck.current_zone !== 'N/A' ? `Zone: ${truck.current_zone}` : 'N/A'}
                  </p>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* Right: Truck Detail Panel (40%) */}
        <div className="w-[40%] bg-[#F9F3F2] rounded-3xl p-6 flex flex-col border border-gray-100 shadow-sm relative overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Unit {selectedTruck.unit_id}</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <Info className="w-5 h-5" />
            </button>
          </div>

          {/* Driver Card */}
          <div className="bg-white rounded-2xl p-4 flex items-center space-x-4 mb-8 shadow-sm">
            <img src={`https://ui-avatars.com/api/?name=${selectedTruck.driver_name}&background=random`} alt="Driver" className="w-12 h-12 rounded-full border-2 border-gray-50" />
            <div>
              <p className="font-bold text-gray-900">{selectedTruck.driver_name}</p>
              <div className="flex items-center space-x-1 mt-0.5">
                <Star className="w-3.5 h-3.5 text-yellow-400 fill-current" />
                <span className="text-xs font-semibold text-gray-500">{selectedTruck.telemetry.driver_rating} Rating</span>
              </div>
            </div>
          </div>

          {/* Live Telemetry */}
          <div className="flex-1">
            <h4 className="text-sm font-bold text-gray-500 mb-4 uppercase tracking-wider">Live Telemetry</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">Fuel Efficiency</span>
                <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry.fuel_efficiency}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">Current Speed</span>
                <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry.current_speed}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-200/50">
                <span className="text-sm text-gray-600 font-medium">Engine Temp</span>
                <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry.engine_temp}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-medium">ETA Destination</span>
                <span className="text-sm font-bold text-gray-900">{selectedTruck.telemetry.eta}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors shadow-sm">
              <MessageSquare className="w-4 h-4" />
              <span>Message Operator</span>
            </button>
            <button className="w-full py-3 bg-[#7B907B] hover:bg-[#6a7d6a] text-white font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors shadow-sm">
              <MapPin className="w-4 h-4" />
              <span>Reassign Route</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getActiveRoutes } from './api/client';

function AIRoutingView() {
  const [routes, setRoutes] = React.useState([]);

  React.useEffect(() => {
    getActiveRoutes()
      .then(res => setRoutes(res.data))
      .catch(console.error);
  }, []);

  if (!routes.length) return <div className="flex-1 flex justify-center items-center">Loading Routes...</div>;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#FCFAFA]">
      {/* Center Workspace */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Route Optimization Engine</h2>
            <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-[#7B907B]" />
              <span>Powered by Gemini Flash</span>
            </p>
          </div>

          <div className="flex items-end space-x-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Fleet Sector</label>
              <button className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl px-4 py-2 flex items-center space-x-3 transition-colors">
                <span className="text-sm font-medium text-gray-900">All Zones</span>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">Date</label>
              <button className="bg-white border border-gray-200 hover:border-gray-300 shadow-sm rounded-xl px-4 py-2 flex items-center space-x-3 transition-colors">
                <span className="text-sm font-medium text-gray-900">Today</span>
                <Calendar className="w-4 h-4 text-gray-400" />
              </button>
            </div>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center space-x-1.5 pb-2 transition-colors">
              <RotateCcw className="w-4 h-4" />
              <span>Reset to Defaults</span>
            </button>
          </div>
        </div>

        {/* Route Cards */}
        <div className="flex flex-wrap gap-6">
          {routes.map((route, idx) => (
            <div key={idx} className="w-[340px] bg-white rounded-3xl shadow-sm border border-gray-100 p-6 flex flex-col relative overflow-hidden">
              {/* Highlight Banner */}
              {route.efficiency_saved !== "Standard" && (
                <div className="absolute top-0 left-0 right-0 bg-[#eef3ee] text-[#7B907B] text-[11px] font-bold px-5 py-2 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Optimized by AI Copilot</span>
                </div>
              )}

              <div className={`mt-${route.efficiency_saved !== "Standard" ? '8' : '0'} flex justify-between items-start mb-6`}>
                <div className="flex items-center space-x-4">
                  <div className="bg-[#FCFAFA] p-3 rounded-2xl">
                    <Truck className="w-6 h-6 text-gray-700" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">{route.name}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">{route.zone} • {route.truck}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${route.status === 'In Progress' ? 'bg-[#7B907B]/10 text-[#7B907B]' : route.status === 'Pending' ? 'bg-gray-100 text-gray-600' : 'bg-[#E07A5F]/10 text-[#E07A5F]'}`}>
                  {route.status}
                </span>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-[#FCFAFA] p-4 rounded-2xl">
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1">Est. Time</p>
                  <p className="text-xl font-bold text-gray-900">{route.est_time}</p>
                </div>
                <div className={`${route.efficiency_saved !== "Standard" ? 'bg-[#eef3ee] border border-[#7B907B]/10' : 'bg-[#FCFAFA]'} p-4 rounded-2xl`}>
                  <p className={`text-[11px] ${route.efficiency_saved !== "Standard" ? 'text-[#7B907B]' : 'text-gray-500'} font-bold uppercase tracking-wider mb-1`}>Efficiency</p>
                  {route.efficiency_saved !== "Standard" ? (
                    <>
                      <p className="text-xl font-bold text-[#7B907B] flex items-center space-x-1">
                        <span>{route.efficiency_saved.split(' ')[0]}</span>
                      </p>
                      <p className="text-[10px] text-[#7B907B] font-bold flex items-center mt-1">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Diesel Saved
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-gray-700 mt-1">Standard</p>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex justify-between text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-wider">
                  <span>Containers</span>
                  <span>{route.containers_current} / {route.containers_max} Cap.</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${route.containers_current / route.containers_max > 0.8 ? 'bg-[#E07A5F]' : 'bg-[#7B907B]'} rounded-full`} style={{ width: `${(route.containers_current / route.containers_max) * 100}%` }}></div>
                </div>
              </div>

              <button className="w-full mt-auto py-3.5 bg-[#F9F3F2] hover:bg-[#f0e6e4] text-gray-800 font-bold rounded-xl flex justify-center items-center space-x-2 transition-colors">
                <FileText className="w-4 h-4" />
                <span>Export PDF Route Sheet</span>
              </button>
            </div>
          ))}
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
          <h3 className="font-bold text-gray-900 text-lg">WasteAI Copilot</h3>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto flex flex-col space-y-6">
          {/* User Message */}
          <div className="flex justify-end">
            <div className="bg-[#F9F3F2] text-gray-800 p-4 rounded-2xl rounded-tr-sm max-w-[85%] text-sm shadow-sm">
              Prioritize Mercado Independencia pickups before 10 AM due to traffic.
            </div>
          </div>

          {/* AI Message */}
          <div className="flex justify-start">
            <div className="bg-[#eef3ee] text-[#2c3d2c] p-4 rounded-2xl rounded-tl-sm max-w-[90%] text-sm shadow-sm border border-[#7B907B]/10">
              <p className="mb-4 leading-relaxed">Analyzing historical traffic data for Mercado Independencia...</p>
              <div className="flex items-center space-x-2 text-[#7B907B] font-bold bg-white/60 p-2.5 rounded-lg border border-white/40">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Re-routing active fleets</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-5 border-t border-stone-50 bg-white">
          <div className="flex items-center bg-[#FCFAFA] rounded-2xl p-1.5 border border-stone-200 focus-within:border-[#7B907B]/50 transition-colors shadow-inner">
            <input
              type="text"
              placeholder="Ask Copilot to adjust..."
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

export default function App() {
  const [currentView, setCurrentView] = useState('ai-routing'); // Start in AI Routing view

  return (
    <div className="flex h-screen bg-[#FCFAFA] font-sans text-gray-800 overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'fleet' && <FleetManagerView />}
      {currentView === 'ai-routing' && <AIRoutingView />}
    </div>
  );
}
