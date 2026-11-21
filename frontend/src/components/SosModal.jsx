import React, { useState } from 'react';
import { 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  CheckCircle2, 
  X, 
  Send, 
  ShieldAlert, 
  Activity, 
  Radio 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function SosModal({ isOpen, onClose, selectedRegion }) {
  if (!isOpen) return null;

  const [dispatched, setDispatched] = useState(false);
  const [dispatchInfo, setDispatchInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [medicalEmergency, setMedicalEmergency] = useState(false);
  const [elderlyOrChildren, setElderlyOrChildren] = useState(false);
  const [peopleCount, setPeopleCount] = useState(2);

  const handleSendSOS = async () => {
    setLoading(true);
    const payload = {
      regionId: selectedRegion?.id || 1,
      regionName: selectedRegion?.name || 'Patiala',
      latitude: selectedRegion?.latitude || 30.3398,
      longitude: selectedRegion?.longitude || 76.3869,
      medicalEmergency,
      elderlyOrChildren,
      peopleCount,
      timestamp: new Date().toISOString()
    };

    const res = await apiService.triggerSOS(payload);
    setDispatchInfo(res);
    setDispatched(true);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-red-500/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-red-500/20 overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!dispatched ? (
          <div className="space-y-6">
            
            {/* Header with Siren Glow */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 text-red-500 flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-6 h-6 fill-red-500 text-slate-900" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Emergency SOS Dispatch</h2>
                <p className="text-xs text-red-400 font-semibold">Immediate Priority Signal to NDRF & State Disaster Relief</p>
              </div>
            </div>

            {/* GPS Lock Card */}
            <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-red-400 shrink-0" />
                <span>
                  Current Location: <strong className="text-white">{selectedRegion?.name || 'Patiala'}, {selectedRegion?.state || 'Punjab'}</strong>
                </span>
              </div>
              <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-mono font-bold">
                GPS LOCKED
              </span>
            </div>

            {/* Emergency Checklist options */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-300">Situation Details:</div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">Number of people needing rescue:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPeopleCount(Math.max(1, peopleCount - 1))}
                    className="w-7 h-7 rounded bg-slate-800 text-white font-bold"
                  >
                    -
                  </button>
                  <span className="font-bold text-white text-sm">{peopleCount}</span>
                  <button
                    type="button"
                    onClick={() => setPeopleCount(peopleCount + 1)}
                    className="w-7 h-7 rounded bg-slate-800 text-white font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={medicalEmergency}
                  onChange={(e) => setMedicalEmergency(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-red-500 focus:ring-0 w-4 h-4"
                />
                <span className="text-slate-200">Critical Medical Emergency / Oxygen / Medication Needed</span>
              </label>

              <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={elderlyOrChildren}
                  onChange={(e) => setElderlyOrChildren(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-red-500 focus:ring-0 w-4 h-4"
                />
                <span className="text-slate-200">Elderly Citizens or Infants Present</span>
              </label>
            </div>

            {/* Dispatch Action */}
            <button
              onClick={handleSendSOS}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-black rounded-2xl shadow-xl shadow-red-500/30 flex items-center justify-center gap-2 text-sm uppercase tracking-wider transition-all hover:scale-[1.02] active:scale-98 disabled:opacity-50"
            >
              <Radio className="w-5 h-5 animate-pulse" />
              <span>{loading ? 'Transmitting Distress Signal...' : 'Trigger SOS Alert Now'}</span>
            </button>

            {/* Direct Helpline Numbers */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>National Disaster Helpline: <strong className="text-white">1078</strong></span>
              <span>Unified Police/Ambulance: <strong className="text-white">112</strong></span>
            </div>

          </div>
        ) : (
          /* Dispatched Confirmation View */
          <div className="text-center space-y-6 py-4">
            <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white">Distress Beacon Broadcasted!</h2>
              <p className="text-xs text-slate-300 max-w-sm mx-auto">
                {dispatchInfo?.message || 'Emergency SOS Dispatched to NDRF and Local Disaster Response Unit!'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 text-left">
              <div className="flex justify-between text-slate-400">
                <span>Alert ID:</span>
                <span className="font-mono text-cyan-400 font-bold">{dispatchInfo?.alertId || 'SOS-948201'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Assigned Unit:</span>
                <span className="text-white font-bold">NDRF Battalion 7 (Patiala Sub-HQ)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Estimated Response Time:</span>
                <span className="text-emerald-400 font-bold">8 – 12 minutes</span>
              </div>
            </div>

            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-300">
              ⚠️ Please remain in an elevated safe position. Keep phone line open for rescue unit call.
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs"
            >
              Close & Monitor Rescue Map
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
