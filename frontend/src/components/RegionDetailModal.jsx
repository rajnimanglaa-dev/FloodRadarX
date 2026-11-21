import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  Clock, 
  CloudRain, 
  Droplets, 
  Gauge, 
  Home, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { apiService, SEED_SHELTERS } from '../services/api';

export default function RegionDetailModal({ isOpen, onClose, region, onNavigateMap }) {
  if (!isOpen || !region) return null;

  // ML Predictor interactive controls
  const [rainfallMm, setRainfallMm] = useState(region.rainfallMm);
  const [waterLevelM, setWaterLevelM] = useState(region.waterLevelM);
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const handleRunPredictor = async () => {
    setPredicting(true);
    const res = await apiService.predictFloodRisk({
      rainfallMm: parseFloat(rainfallMm),
      waterLevelM: parseFloat(waterLevelM),
      drainageCapacityPercent: region.drainageCapacityPercent,
      riverDischargeCusecs: region.riverDischargeCusecs,
      soilMoisturePercent: region.soilMoisturePercent
    });
    setPrediction(res);
    setPredicting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh] space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white">{region.name}, {region.state}</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                region.riskLevel === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                ● {region.riskLevel} Risk
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Geographic Telemetry & AI Hydrological Inundation Model
            </p>
          </div>

          <button
            onClick={() => {
              onClose();
              onNavigateMap();
            }}
            className="self-start sm:self-auto px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-xs font-bold hover:bg-cyan-500/30 transition-colors flex items-center gap-1.5"
          >
            <span>View on Map</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 6 Grid Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Est. Arrival
            </span>
            <div className="text-lg font-black text-white mt-1">
              {region.arrivalEstimateHours} – {region.arrivalEstimateHours + 0.5} hrs
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3.5 h-3.5 text-sky-400" />
              Rainfall (24h)
            </span>
            <div className="text-lg font-black text-sky-300 mt-1">
              {region.rainfallMm} mm
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Droplets className="w-3.5 h-3.5 text-blue-400" />
              Water Level
            </span>
            <div className="text-lg font-black text-blue-300 mt-1">
              {region.waterLevelM} m
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              River Discharge
            </span>
            <div className="text-lg font-black text-amber-300 mt-1">
              {region.riverDischargeCusecs.toLocaleString()} cusecs
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-teal-400" />
              Drainage Capacity
            </span>
            <div className="text-lg font-black text-teal-300 mt-1">
              {region.drainageCapacityPercent}%
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Home className="w-3.5 h-3.5 text-emerald-400" />
              Shelters
            </span>
            <div className="text-lg font-black text-emerald-400 mt-1">
              {region.sheltersAvailable} Open
            </div>
          </div>

        </div>

        {/* Interactive AI Inundation Simulator */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-950/30 to-slate-950 border border-cyan-500/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Interactive AI Hydro-Risk Simulation
              </h3>
            </div>
            <span className="text-[10px] text-cyan-400 font-mono">GradientBoosting ML v2.4</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Simulate Rainfall:</span>
                <strong className="text-cyan-400">{rainfallMm} mm</strong>
              </div>
              <input
                type="range"
                min="10"
                max="250"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-300 mb-1">
                <span>Simulate River Height:</span>
                <strong className="text-cyan-400">{waterLevelM} m</strong>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.1"
                value={waterLevelM}
                onChange={(e) => setWaterLevelM(e.target.value)}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              onClick={handleRunPredictor}
              disabled={predicting}
              className="py-2 px-4 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-md shadow-cyan-500/20"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{predicting ? 'Computing Simulation...' : 'Run Prediction Algorithm'}</span>
            </button>

            {prediction && (
              <div className="text-xs text-right">
                <span className="text-slate-400">Predicted Arrival: </span>
                <strong className="text-white">{prediction.arrivalEstimateHours} hrs </strong>
                <span className={`px-2 py-0.5 rounded font-bold text-[10px] ml-1 ${
                  prediction.riskLevel === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {prediction.riskLevel} Risk
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nearest Designated Shelters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-white">
            <span className="flex items-center gap-1.5">
              <Home className="w-4 h-4 text-emerald-400" />
              <span>Designated Evacuation Shelters in Vicinity</span>
            </span>
          </div>

          <div className="space-y-2">
            {SEED_SHELTERS.slice(0, 2).map((sh) => (
              <div
                key={sh.id}
                className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-white">{sh.name}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    {sh.distanceKm} km away • {sh.facilities}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-emerald-400 font-bold">
                    {sh.capacity - sh.currentOccupancy} beds free
                  </div>
                  <div className="text-[10px] text-cyan-400 font-mono mt-0.5">
                    {sh.contactNumber}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
