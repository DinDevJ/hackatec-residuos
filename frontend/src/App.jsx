import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import FleetManagerView from './components/FleetManagerView';
import AIRoutingView from './components/AIRoutingView';
import SmartMapView from './components/SmartMapView';

export default function App() {
  const [currentView, setCurrentView] = useState('ai-routing'); // Start in AI Routing view

  return (
    <div className="flex h-screen bg-[#FCFAFA] font-sans text-gray-800 overflow-hidden">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      {currentView === 'dashboard' && <DashboardView />}
      {currentView === 'smart-map' && <SmartMapView />}
      {currentView === 'fleet' && <FleetManagerView />}
      {currentView === 'ai-routing' && <AIRoutingView />}
    </div>
  );
}
