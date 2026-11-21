import React, { useState } from 'react';
import { 
  X, 
  Satellite, 
  Cpu, 
  Radio, 
  Truck, 
  CheckCircle2, 
  ArrowRight, 
  Play, 
  RotateCcw,
  ShieldCheck 
} from 'lucide-react';

export default function DemoModal({ isOpen, onClose, onExploreMap }) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: 'Step 1: Real-Time Radar & Satellite Ingestion',
      icon: Satellite,
      badge: 'Earth Observation',
      description: 'Continuous synthesis of Sentinel-1 Synthetic Aperture Radar (SAR) and ISRO Doppler radar feeds tracks cloud density, precipitation volume, and riverbank saturation at 10m resolution.',
      stats: '12 Satellites • 10m Grid Resolution • Real-Time Stream'
    },
    {
      title: 'Step 2: AI Predictive Hydrology Engine',
      icon: Cpu,
      badge: 'ML Ensemble Model',
      description: 'Gradient boosting algorithms and hydrological discharge models calculate water surge velocities and project flood front arrival estimates with 98.4% accuracy up to 6 hours before inundation.',
      stats: '0.85 Risk Score • 1.5 - 2 hrs Arrival Window • Calibrated for Punjab Basin'
    },
    {
      title: 'Step 3: Automated Multi-Agency Early Alerts',
      icon: Radio,
      badge: 'Citizen Defense',
      description: 'Instant dissemination of geofenced emergency SMS alerts, sirens, and community app push notifications, warning residents in at-risk flood zones before water accumulates.',
      stats: 'Toll-Free 112 Dispatch • Multilingual SMS • Automatic Alert Routing'
    },
    {
      title: 'Step 4: Tactical NDRF Rescue & Shelter Allocation',
      icon: Truck,
      badge: 'Field Operations',
      description: 'Coordinated rescue convoys are plotted along safe elevated transit corridors, automatically rerouting around flooded streets while evacuees are assigned to nearest available shelters.',
      stats: 'Live GPS Fleet Tracking • 48 Shelters Synchronized • Mission #R-1024 Dispatched'
    }
  ];

  const activeStep = steps[currentStep];
  const StepIcon = activeStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-slate-900 border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
            <Play className="w-5 h-5 fill-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">How FloodRadarX Works</h3>
            <p className="text-xs text-cyan-400">Interactive 4-Stage Disaster Preparedness Protocol</p>
          </div>
        </div>

        {/* Step Progress Pills */}
        <div className="grid grid-cols-4 gap-2">
          {steps.map((st, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentStep
                  ? 'bg-cyan-400 shadow-md shadow-cyan-400/50'
                  : idx < currentStep
                  ? 'bg-emerald-400'
                  : 'bg-slate-800'
              }`}
            />
          ))}
        </div>

        {/* Active Step Card */}
        <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {activeStep.badge}
            </span>
            <span className="text-xs text-slate-400 font-mono">Stage {currentStep + 1} of 4</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shrink-0">
              <StepIcon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-extrabold text-white">{activeStep.title}</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed font-normal">
                {activeStep.description}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-emerald-400">
            ✓ {activeStep.stats}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white disabled:opacity-30"
          >
            ← Previous
          </button>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>Next Stage</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => {
                onClose();
                onExploreMap();
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <span>Explore Live Flood Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
