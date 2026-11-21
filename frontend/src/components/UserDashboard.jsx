import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  CloudRain, 
  Home, 
  MapPin, 
  Bell, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ChevronDown, 
  AlertCircle,
  ExternalLink,
  Info,
  Radio,
  FileText,
  User,
  Activity
} from 'lucide-react';
import { SEED_REGIONS, SEED_ALERTS, apiService } from '../services/api';

export default function UserDashboard({ 
  user, 
  onNavigate, 
  onOpenSos, 
  selectedRegion, 
  onSelectRegion,
  onOpenDetail
}) {
  const [activeSidebarItem, setActiveSidebarItem] = useState('Overview');
  const [alerts, setAlerts] = useState(SEED_ALERTS);
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showAlertsDropdown, setShowAlertsDropdown] = useState(false);
  const [customRainfall, setCustomRainfall] = useState(selectedRegion.rainfallMm);

  // Sync custom rainfall when selected region changes
  useEffect(() => {
    setCustomRainfall(selectedRegion.rainfallMm);
  }, [selectedRegion]);

  const sidebarItems = [
    { id: 'Overview', label: 'Overview', icon: Home },
    { id: 'My Region', label: 'My Region', icon: MapPin },
    { id: 'Flood Forecast', label: 'Flood Forecast', icon: CloudRain },
    { id: 'Nearby Shelters', label: 'Nearby Shelters', icon: Home },
    { id: 'Safety Guide', label: 'Safety Guide', icon: ShieldCheck },
    { id: 'Community Reports', label: 'Community Reports', icon: FileText },
    { id: 'My Alerts', label: 'My Alerts', icon: Bell },
    { id: 'Profile', label: 'Profile', icon: User },
  ];

  const handleSidebarClick = (item) => {
    setActiveSidebarItem(item.id);
    if (item.id === 'Profile') {
      onNavigate('profile');
    } else if (item.id === 'Nearby Shelters' || item.id === 'Flood Forecast' || item.id === 'My Region') {
      onNavigate('map');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
      
      {/* Left Sidebar (Matching Image) */}
      <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          
          {/* Dashboard Mini Branding */}
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-cyan-500/20">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-bold text-white tracking-wider uppercase">Citizen Portal</span>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSidebarItem === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSidebarClick(item)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SOS Emergency Sidebar Button (Matching Image) */}
        <div className="pt-6">
          <button
            onClick={onOpenSos}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/20 transition-all hover:scale-[1.02] active:scale-98 text-xs"
          >
            <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
            <span>🚨 SOS Emergency</span>
          </button>
        </div>
      </aside>

      {/* Main Dashboard Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header Greeting & Controls Row (Matching Image) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              Good Evening, {user?.name || 'Rajni'}! 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">Stay informed. Stay safe.</p>
          </div>

          {/* Right Action Controls: Location Pill, Bell, Avatar */}
          <div className="flex items-center gap-3 relative">
            
            {/* Location Selector Pill */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPicker(!showLocationPicker)}
                className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 hover:border-cyan-500/50 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 shadow-sm transition-all"
              >
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedRegion.name}, {selectedRegion.state}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Location Dropdown Picker */}
              {showLocationPicker && (
                <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 py-2 divide-y divide-slate-800">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Select Your District
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {SEED_REGIONS.map((reg) => (
                      <button
                        key={reg.id}
                        onClick={() => {
                          onSelectRegion(reg);
                          setShowLocationPicker(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-800/80 ${
                          reg.id === selectedRegion.id ? 'text-cyan-400 font-bold bg-slate-800/40' : 'text-slate-300'
                        }`}
                      >
                        <span>{reg.name}, {reg.state}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          reg.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : reg.riskLevel === 'Moderate' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {reg.riskLevel}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notification Bell with Badge */}
            <div className="relative">
              <button
                onClick={() => setShowAlertsDropdown(!showAlertsDropdown)}
                className="relative p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </button>

              {/* Alerts Dropdown */}
              {showAlertsDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-30 p-3 space-y-2">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-white">Live Alert Notifications</span>
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                      {alerts.length} Active
                    </span>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {alerts.map((al) => (
                      <div key={al.id} className="p-2 rounded-lg bg-slate-800/60 border border-slate-700/50 text-xs">
                        <div className="flex items-center justify-between text-slate-200 font-semibold">
                          <span>{al.title}</span>
                          <span className="text-[10px] text-slate-400">{al.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-1">{al.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Avatar Circle */}
            <div 
              onClick={() => onNavigate('profile')}
              className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-teal-400 p-0.5 cursor-pointer shadow-md hover:scale-105 transition-transform"
            >
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-xs">
                {user?.name ? user.name.charAt(0) : 'R'}
              </div>
            </div>

          </div>
        </div>

        {/* 4 Metric Cards Row (Matching Image Exactly) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Flood Risk (Amber / Red) */}
          <div className="bg-slate-900/80 border border-amber-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Flood Risk</span>
              <AlertTriangle className={`w-5 h-5 ${
                selectedRegion.riskLevel === 'High' ? 'text-red-400' : 'text-amber-400'
              }`} />
            </div>
            <div className="mt-3">
              <div className={`text-2xl font-black ${
                selectedRegion.riskLevel === 'High' ? 'text-red-400' : 'text-amber-400'
              }`}>
                {selectedRegion.riskLevel}
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Risk Score: {selectedRegion.riskScore * 100}%
              </div>
            </div>
          </div>

          {/* Card 2: Arrival Estimate */}
          <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Arrival Estimate</span>
              <Clock className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-white">
                {selectedRegion.arrivalEstimateHours} – {selectedRegion.arrivalEstimateHours + 1} hrs
              </div>
              <div className="text-[11px] text-cyan-400 mt-1">
                Surge expected soon
              </div>
            </div>
          </div>

          {/* Card 3: Rainfall */}
          <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Rainfall</span>
              <CloudRain className="w-5 h-5 text-sky-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-sky-300">
                {customRainfall} mm
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Past 24h accumulation
              </div>
            </div>
          </div>

          {/* Card 4: Nearby Shelters (Emerald dark card matching image) */}
          <div 
            onClick={() => onNavigate('map')}
            className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md cursor-pointer hover:border-emerald-400/60 transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-300">Nearby Shelters</span>
              <Home className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-emerald-400">
                {selectedRegion.sheltersAvailable} Available
              </div>
              <div className="text-[11px] text-emerald-300/80 mt-1 flex items-center gap-1">
                <span>View locations</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>

        </div>

        {/* Middle Two Cards Row: Safety Recommendations (Left) & Recent Alerts (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Safety Recommendations Card (with Safe House Graphic matching image) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 pb-4 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Safety Recommendations</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                {/* Checklists */}
                <div className="space-y-3.5">
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Avoid low-lying areas and riverbeds</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Keep emergency kit & flashlight ready</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Follow official NDRF & district alerts</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Charge power banks and save emergency 112</span>
                  </div>
                </div>

                {/* Stylized Safe House Graphic (Matching Reference Image) */}
                <div className="flex items-center justify-center p-3 bg-gradient-to-b from-cyan-950/30 to-slate-950/80 rounded-xl border border-cyan-500/20">
                  <div className="relative text-center">
                    <div className="w-20 h-20 mx-auto rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                      <Home className="w-10 h-10 text-cyan-400" />
                    </div>
                    <div className="text-xs font-bold text-cyan-300 mt-2">Elevated Safe Zones</div>
                    <div className="text-[10px] text-slate-400">Patiala Model School (1.4 km)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Active status: {selectedRegion.statusText}</span>
              <button
                onClick={() => onOpenDetail(selectedRegion)}
                className="text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <span>Read Full Protocol</span>
                <ChevronDown className="w-3.5 h-3.5 rotate-[-90deg]" />
              </button>
            </div>
          </div>

          {/* Recent Alerts Card (Matching Image) */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                  <h3 className="font-bold text-white text-base">Recent Alerts</h3>
                </div>
                <button
                  onClick={() => setShowAlertsDropdown(true)}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Alert Items matching image */}
              <div className="space-y-3.5 mt-4">
                <div className="p-3 rounded-xl bg-red-950/30 border border-red-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-red-500/20 text-red-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-red-300">Heavy rainfall in Patiala</h4>
                      <span className="text-[10px] text-slate-400">2h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      90mm recorded. Low-lying sectors placed on amber watch.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-amber-300">Water level rising in Sutlej</h4>
                      <span className="text-[10px] text-slate-400">3h ago</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Barrage discharge 48,000 cusecs upstream.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-2">
              <button
                onClick={() => onOpenDetail(selectedRegion)}
                className="w-full py-2.5 px-4 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <span>View Regional Hydrology Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Banner: Call 112 & View Live Map (Matching Image Exactly) */}
        <div className="bg-gradient-to-r from-cyan-950/80 via-slate-900/90 to-teal-950/80 border border-cyan-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 flex items-center justify-center shrink-0">
              <PhoneCall className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Need Help? Emergency Call 112</span>
                <span className="text-[10px] bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-full">
                  24/7 TOLL FREE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct dispatch to NDRF, State Disaster Response & Local Ambulance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => onNavigate('map')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-cyan-500/20 text-xs transition-all hover:scale-105 active:scale-95"
            >
              <span>View Live Map</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

      </main>

    </div>
  );
}
