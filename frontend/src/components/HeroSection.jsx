import React, { useState } from 'react';
import { 
  Satellite, 
  Cpu, 
  ShieldCheck, 
  Users, 
  ArrowRight, 
  Play, 
  MapPin, 
  AlertTriangle,
  Droplets,
  CloudRain,
  ChevronRight,
  TrendingUp,
  Activity
} from 'lucide-react';
import { SEED_REGIONS } from '../services/api';

export default function HeroSection({ onNavigate, onSelectRegion, onOpenDemo }) {
  const [activePin, setActivePin] = useState(SEED_REGIONS[0]); // Patiala default

  const features = [
    { icon: Satellite, label: 'Satellite Monitoring' },
    { icon: Cpu, label: 'AI Prediction' },
    { icon: ShieldCheck, label: 'Safety Alerts' },
    { icon: Users, label: 'Rescue Support' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      
      {/* Dynamic Background with Atmospheric Aerial River Water Effect */}
      <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
        <div className="absolute inset-0 bg-radial-at-t from-cyan-900/30 via-slate-950/80 to-slate-950" />
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content Row */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow">
        
        {/* Left Column: Headlines & CTA */}
        <div className="lg:col-span-7 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-400 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Next-Gen Hydro-Meteorological Disaster Intelligence</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Know the Risk. <br />
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-200 bg-clip-text text-transparent">
                Before It Reaches You.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Advanced flood intelligence, predictive arrival estimates and coordinated emergency response for safer communities across India.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={() => onNavigate('map')}
              className="inline-flex items-center gap-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 text-sm"
            >
              <span>Explore Flood Map</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <button
              onClick={onOpenDemo}
              className="inline-flex items-center gap-2.5 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-slate-200 font-semibold px-5 py-3.5 rounded-xl transition-all hover:scale-105 text-sm backdrop-blur-sm"
            >
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                <Play className="w-3 h-3 fill-cyan-400 translate-x-0.5" />
              </div>
              <span>Watch Demo</span>
            </button>
          </div>

          {/* Quick Metrics / Summary */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg">
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">98.4%</div>
              <div className="text-xs text-slate-400 mt-0.5">Prediction Accuracy</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400 tracking-tight">&lt; 2 Hrs</div>
              <div className="text-xs text-slate-400 mt-0.5">Early Arrival Alert</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-teal-400 tracking-tight">48+</div>
              <div className="text-xs text-slate-400 mt-0.5">Shelters Mapped</div>
            </div>
          </div>
        </div>

        {/* Right Column: "Live Flood Risk" Map Card Widget (Matching Image) */}
        <div className="lg:col-span-5">
          <div className="relative mx-auto max-w-md w-full bg-slate-900/80 border border-cyan-500/30 rounded-2xl p-5 shadow-2xl shadow-cyan-500/10 backdrop-blur-xl">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <h3 className="font-bold text-sm text-white tracking-wide">Live Flood Risk</h3>
              </div>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Radar
              </span>
            </div>

            {/* Interactive India Map Graphic with Hotspots */}
            <div className="relative my-4 h-64 bg-slate-950/90 rounded-xl overflow-hidden border border-slate-800/60 p-3 flex flex-col justify-between">
              
              {/* Stylized SVG Map of India with Elevation & Heat Gradient */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-80">
                <svg viewBox="0 0 300 320" className="w-full h-full max-h-60" fill="none" stroke="currentColor">
                  {/* Geographic contours */}
                  <path 
                    d="M 120 20 L 150 35 L 180 50 L 210 70 L 240 85 L 260 110 L 240 135 L 210 145 L 200 170 L 180 200 L 150 250 L 140 280 L 130 250 L 110 200 L 80 160 L 60 120 L 80 80 L 100 45 Z" 
                    fill="url(#india-gradient)" 
                    stroke="#0284c7" 
                    strokeWidth="1.5"
                    strokeDasharray="2 2"
                    opacity="0.9"
                  />
                  <defs>
                    <linearGradient id="india-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                      <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Interactive Region Pins on India Map */}
              <div className="relative z-10 w-full h-full">
                {/* Patiala, Punjab (North-West) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[0])}
                  className={`absolute top-12 left-28 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Patiala' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Patiala, Punjab"
                >
                  <span className="relative flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 border-2 border-white shadow-md"></span>
                  </span>
                  <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-bold bg-slate-900/90 text-red-300 px-1.5 py-0.5 rounded border border-red-500/40">
                    Patiala (High)
                  </span>
                </button>

                {/* Rupnagar (North) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[3])}
                  className={`absolute top-8 left-36 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Rupnagar' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Rupnagar, Punjab"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                </button>

                {/* Patna (East Central) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[4])}
                  className={`absolute top-24 left-44 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Patna' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Patna, Bihar"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                </button>

                {/* Guwahati (Far East) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[5])}
                  className={`absolute top-20 right-10 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Guwahati' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Guwahati, Assam"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 border border-white"></span>
                  </span>
                </button>

                {/* Surat (West) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[7])}
                  className={`absolute top-36 left-20 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Surat' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Surat, Gujarat"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white"></span>
                  </span>
                </button>

                {/* Cuttack (East Coastal) */}
                <button
                  onClick={() => setActivePin(SEED_REGIONS[6])}
                  className={`absolute top-40 right-28 group transition-all transform hover:scale-125 ${
                    activePin.name === 'Cuttack' ? 'scale-125 z-20' : 'z-10'
                  }`}
                  title="Cuttack, Odisha"
                >
                  <span className="relative flex h-4 w-4 items-center justify-center">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border border-white"></span>
                  </span>
                </button>
              </div>

              {/* Pin Detail Overlay at top-right of map */}
              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/95 border border-slate-700/80 rounded-lg p-2.5 flex items-center justify-between text-xs backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    activePin.riskLevel === 'High' ? 'bg-red-500' : activePin.riskLevel === 'Moderate' ? 'bg-amber-400' : 'bg-emerald-400'
                  }`} />
                  <div>
                    <div className="font-bold text-white">{activePin.name}, {activePin.state}</div>
                    <div className="text-[10px] text-slate-400">Arrival: {activePin.arrivalEstimateHours} hrs • Rain: {activePin.rainfallMm} mm</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onSelectRegion(activePin);
                    onNavigate('map');
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-2.5 py-1 rounded font-bold text-[11px] transition-colors"
                >
                  Map View →
                </button>
              </div>
            </div>

            {/* Legend row matching image: Low, Moderate, High */}
            <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span>Low</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span>Moderate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span>High</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Feature Pills Row (Satellite Monitoring, AI Prediction, Safety Alerts, Rescue Support) */}
      <div className="relative z-10 border-t border-cyan-500/10 bg-slate-950/60 backdrop-blur-md py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {features.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center sm:justify-start gap-3 px-4 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all hover:bg-slate-900/90"
                >
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-slate-200">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
