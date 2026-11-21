import React, { useState } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polyline 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  AlertTriangle, 
  Truck, 
  Users, 
  Navigation, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Layers, 
  PhoneCall, 
  Radio, 
  ArrowRight,
  Shield,
  LifeBuoy
} from 'lucide-react';
import { SEED_MISSIONS } from '../services/api';

// Rescue route icons
const rescueCarIcon = L.divIcon({
  className: 'rescue-car',
  html: `
    <div style="width:32px; height:32px; border-radius:50%; background:#0284c7; border:2.5px solid white; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.5);">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1 .4-1 1v7c0 .6.4 1 1 1h2"></path>
        <circle cx="7" cy="17" r="2"></circle>
        <path d="M9 17h6"></path>
        <circle cx="17" cy="17" r="2"></circle>
      </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

const emergencyTargetIcon = L.divIcon({
  className: 'emergency-target',
  html: `
    <div style="position:relative; width:36px; height:36px; display:flex; align-items:center; justify-content:center;">
      <span style="position:absolute; width:100%; height:100%; border-radius:50%; background:#ef4444; opacity:0.6; animation: radar-pulse 1.8s infinite ease-in-out;"></span>
      <div style="width:26px; height:26px; border-radius:50%; background:#dc2626; border:2.5px solid white; display:flex; align-items:center; justify-content:center;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      </div>
    </div>
  `,
  iconSize: [36, 36],
  iconAnchor: [18, 18]
});

export default function RescueOperations({ onOpenSos }) {
  const [activeTab, setActiveTab] = useState('Mission Overview');
  const [missions, setMissions] = useState(SEED_MISSIONS);
  const [selectedMission, setSelectedMission] = useState(SEED_MISSIONS[0]);
  const [statusMessage, setStatusMessage] = useState(null);

  const sidebarLinks = [
    'Mission Overview',
    'Active Requests',
    'Rescue Map',
    'Accessible Roads',
    'Assigned Missions',
    'Resources',
    'Team Profile'
  ];

  // Route waypoints between Patiala and Rajpura
  const missionRoute = [
    [30.3398, 76.3869], // Base: Patiala
    [30.3800, 76.4500],
    [30.4200, 76.5100],
    [30.4839, 76.5939]  // Target: Rajpura
  ];

  // Simulated GPS position of car midway along route
  const carPosition = [30.4200, 76.5100];

  const handleUpdateStatus = () => {
    const nextStatus = selectedMission.status === 'In Progress' ? 'En Route (ETA 8m)' : selectedMission.status === 'En Route (ETA 8m)' ? 'Rescued / Completed' : 'In Progress';
    const updated = missions.map(m => m.id === selectedMission.id ? { ...m, status: nextStatus } : m);
    setMissions(updated);
    setSelectedMission({ ...selectedMission, status: nextStatus });
    setStatusMessage(`Status updated to: ${nextStatus}`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleNavigate = () => {
    setStatusMessage(`GPS Route plotted to ${selectedMission.location}. Voice guidance active on Frequency 144.20 MHz.`);
    setTimeout(() => setStatusMessage(null), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
      
      {/* Left Sidebar matching image */}
      <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/80 rounded-xl border border-cyan-500/30">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">NDRF Dispatch Ops</span>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((label) => (
              <button
                key={label}
                onClick={() => setActiveTab(label)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === label
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-4 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 mb-2">Tactical Comms Channel</div>
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-cyan-400 flex items-center justify-between">
            <span>CH-04 PUNJAB</span>
            <span className="text-emerald-400 font-bold">144.200 MHz</span>
          </div>
        </div>
      </aside>

      {/* Main Rescue Dashboard View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header matching image */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Rescue Operations</span>
            </h1>
            <span className="text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-full font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Team Active
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white">Commander A. Verma</div>
              <div className="text-[10px] text-slate-400">Team Delta Alpha Leader</div>
            </div>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center font-bold text-xs">
              AV
            </div>
          </div>
        </div>

        {/* Status Toast */}
        {statusMessage && (
          <div className="p-3 bg-cyan-950/80 border border-cyan-500 rounded-xl text-xs text-cyan-300 font-medium flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* 3 Metric Cards matching image */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Active Requests */}
          <div className="bg-slate-900/80 border border-red-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Requests</span>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-red-400">
              08
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              4 critical / water ingress &gt; 3ft
            </div>
          </div>

          {/* Card 2: On Mission */}
          <div className="bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">On Mission</span>
              <Truck className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-cyan-400">
              03
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Motorized inflatable rafts deployed
            </div>
          </div>

          {/* Card 3: Available Teams */}
          <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Available Teams</span>
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-2 text-3xl font-black text-emerald-400">
              05
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Standby at Patiala & Rajpura depots
            </div>
          </div>

        </div>

        {/* Main Grid: Interactive Route Map + Mission Details Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Route Map (Leaflet) matching image */}
          <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Live Tactical Convoy Tracking</span>
              </div>
              <span className="text-[11px] text-cyan-400 font-mono">ETA: 14 mins • Distance: 18.2 km</span>
            </div>

            <div className="h-96 w-full rounded-xl overflow-hidden border border-slate-800 relative">
              <MapContainer
                center={[30.4100, 76.4900]}
                zoom={11}
                scrollWheelZoom={false}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />

                {/* Tactical Mission Route Polyline */}
                <Polyline
                  positions={missionRoute}
                  pathOptions={{
                    color: '#38bdf8',
                    weight: 5,
                    dashArray: '8 8',
                    opacity: 0.95
                  }}
                />

                {/* Base Marker */}
                <Marker position={missionRoute[0]} icon={rescueCarIcon}>
                  <Popup>Patiala Rescue Depot Alpha</Popup>
                </Marker>

                {/* In-Transit Car */}
                <Marker position={carPosition} icon={rescueCarIcon}>
                  <Popup>NDRF Rapid Response Convoy 01</Popup>
                </Marker>

                {/* Target Marker: Rajpura */}
                <Marker position={missionRoute[3]} icon={emergencyTargetIcon}>
                  <Popup>
                    <div className="text-xs p-2">
                      <strong>Mission #R-1024</strong><br />
                      5 People Trapped<br />
                      Rajpura Grain Market
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>

          {/* Mission Card matching image */}
          <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-extrabold text-white text-base">
                {selectedMission.title}
              </h3>
              <span className="text-xs font-bold text-red-400 bg-red-500/20 border border-red-500/30 px-2.5 py-0.5 rounded-full">
                ● {selectedMission.priority}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  Location:
                </span>
                <span className="font-bold text-white">{selectedMission.location}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-cyan-400" />
                  People:
                </span>
                <span className="font-bold text-white">{selectedMission.peopleCount} Stranded</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  Assigned Team:
                </span>
                <span className="font-bold text-cyan-300">{selectedMission.assignedTeam}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  Current Status:
                </span>
                <span className="font-bold text-emerald-400">{selectedMission.status}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
              {selectedMission.details}
            </p>

            {/* Action Buttons: Navigate & Update Status matching image */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleNavigate}
                className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-98"
              >
                <span>Navigate</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                onClick={handleUpdateStatus}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-semibold rounded-xl text-xs transition-colors border border-slate-700"
              >
                Update Status
              </button>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}
