import React from 'react';
import {
  LayoutDashboard, Map as MapIcon, Cpu, Truck, Settings, MoreVertical
} from 'lucide-react';
import logoImg from '../ECOTRACK.png';

export default function Sidebar({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'smart-map', label: 'Smart Map', icon: MapIcon },
    { id: 'ai-routing', label: 'AI Routing', icon: Cpu },
    { id: 'fleet', label: 'Fleet Manager', icon: Truck },
  ];

  return (
    <aside className="w-[280px] bg-[#f5f3f0] h-screen flex flex-col border-r border-[#e4e2df] px-4 py-6 shrink-0 z-20">
      
      {/* 1. Header & Logo */}
      <div className="flex items-center space-x-3 mb-8 px-2">
        <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
          <img src={logoImg} alt="EcoTrack Logo" className="max-w-full max-h-full object-contain" />
        </div>
        <div>
          <h1 className="text-xl font-extrabold text-[#1b1c1a] tracking-tight">EcoTrack</h1>
          <p className="text-[10px] text-[#4d614e] uppercase tracking-wider font-bold">Logistics Intelligence</p>
        </div>
      </div>

      {/* 2. Main Navigation (flex-1) */}
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-[#d2e9d0] text-[#0d1f11] font-bold'
                : 'text-[#434842] font-medium hover:bg-[#e4e2df] hover:text-[#1b1c1a]'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-[#0d1f11]' : 'text-[#434842]'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* 3. Bottom Section (User Profile & Settings) */}
      <div className="mt-auto">
        <div className="flex items-center p-3 bg-[#ffffff]/60 rounded-[1.25rem] cursor-pointer transition-all duration-300 hover:bg-white hover:shadow-sm border border-[#e4e2df]/60 group">
          
          {/* Avatar with Online Indicator */}
          <div className="relative flex-shrink-0">
            <img src="https://i.pravatar.cc/150?img=5" alt="User Avatar" className="w-11 h-11 rounded-full object-cover shadow-sm ring-2 ring-white" />
            <div className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 bg-[#4d614e] border-2 border-white rounded-full"></div>
          </div>
          
          {/* User Info */}
          <div className="flex-1 text-left ml-3 overflow-hidden">
            <p className="text-sm font-extrabold text-[#1b1c1a] truncate">Katia Aguilar</p>
            <p className="text-[10px] text-[#4d614e] font-bold uppercase tracking-wider mt-0.5 truncate">Logistics Mgr</p>
          </div>
          
          {/* Action Icons */}
          <div className="flex items-center space-x-0.5 text-[#434842]">
            <button className="p-2 hover:text-[#1b1c1a] hover:bg-[#f5f3f0] rounded-xl transition-colors group-hover:opacity-100 opacity-70">
              <Settings className="w-4 h-4" />
            </button>
            <button className="p-1.5 hover:text-[#1b1c1a] hover:bg-[#f5f3f0] rounded-xl transition-colors opacity-50 hover:opacity-100">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
