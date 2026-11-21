import React, { useState } from 'react';
import { 
  Bar, 
  Doughnut 
} from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { 
  Users, 
  AlertTriangle, 
  Home, 
  Truck, 
  Bell, 
  Activity, 
  PlusCircle, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  Radio,
  Settings,
  FileText
} from 'lucide-react';
import { SEED_ADMIN_STATS, apiService } from '../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AdminPanel({ onOpenSos }) {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [stats, setStats] = useState(SEED_ADMIN_STATS);
  const [broadcastModalOpen, setBroadcastModalOpen] = useState(false);
  const [broadcastRegion, setBroadcastRegion] = useState('Patiala, Punjab');
  const [broadcastMessage, setBroadcastMessage] = useState('Immediate flood warning: Evacuate sector 7.');
  const [broadcastSeverity, setBroadcastSeverity] = useState('CRITICAL');
  const [alertSuccessToast, setAlertSuccessToast] = useState(false);

  const sidebarLinks = [
    'Dashboard',
    'Alert Management',
    'Shelter Management',
    'NGO Verification',
    'Rescue Teams',
    'User Management',
    'Analytics',
    'Settings'
  ];

  // Bar Chart Config
  const barData = {
    labels: stats.monthlyOverview.labels,
    datasets: [
      {
        label: 'Flood Incidents Mapped',
        data: stats.monthlyOverview.datasets[0].data,
        backgroundColor: '#06b6d4',
        borderRadius: 8,
        hoverBackgroundColor: '#22d3ee'
      }
    ]
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#06b6d4',
        borderWidth: 1,
        titleColor: '#fff',
        bodyColor: '#38bdf8'
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 11 } }
      }
    }
  };

  // Donut Chart Config
  const donutData = {
    labels: stats.riskDistribution.labels,
    datasets: [
      {
        data: stats.riskDistribution.datasets[0].data,
        backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#cbd5e1',
          font: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 14,
          usePointStyle: true
        }
      }
    },
    cutout: '72%'
  };

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    const newActivity = {
      id: Date.now(),
      title: `Emergency Alert Broadcasted: ${broadcastRegion}`,
      time: 'Just now',
      badge: 'Active Broadcast',
      type: 'red'
    };
    setStats({
      ...stats,
      activeAlerts: stats.activeAlerts + 1,
      recentActivity: [newActivity, ...stats.recentActivity]
    });
    setBroadcastModalOpen(false);
    setAlertSuccessToast(true);
    setTimeout(() => setAlertSuccessToast(false), 4000);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
      
      {/* Left Sidebar matching image */}
      <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 px-3 py-2 bg-slate-950/80 rounded-xl border border-cyan-500/30">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Command Console</span>
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

        <div className="pt-4 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setBroadcastModalOpen(true)}
            className="w-full py-2.5 px-3 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            <span>Broadcast Alert</span>
          </button>
        </div>
      </aside>

      {/* Main Admin View matching image */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center gap-2">
              <span>Admin Panel</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">Multi-agency disaster monitoring and coordination center</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setBroadcastModalOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Broadcast New Alert</span>
            </button>

            <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold text-xs flex items-center justify-center">
                AD
              </div>
              <span className="text-xs font-bold text-white">Admin ▾</span>
            </div>
          </div>
        </div>

        {/* Alert broadcast toast */}
        {alertSuccessToast && (
          <div className="p-3 bg-red-950/80 border border-red-500 rounded-xl text-xs text-red-200 flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
            <span>Emergency SMS, Siren, and In-App alert transmitted to registered residents in targeted zone!</span>
          </div>
        )}

        {/* 4 Metric Cards matching image */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Users */}
          <div className="bg-slate-900/80 border border-cyan-500/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Total Users</span>
              <Users className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-white">
              {stats.totalUsers}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">+1,240 this week</div>
          </div>

          {/* Active Alerts */}
          <div className="bg-slate-900/80 border border-red-500/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Active Alerts</span>
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-red-400">
              {stats.activeAlerts}
            </div>
            <div className="text-[11px] text-red-400/80 mt-1">4 high urgency</div>
          </div>

          {/* Shelters */}
          <div className="bg-slate-900/80 border border-emerald-500/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Shelters</span>
              <Home className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-emerald-400">
              {stats.sheltersCount}
            </div>
            <div className="text-[11px] text-emerald-300 mt-1">3,450 beds total</div>
          </div>

          {/* Rescue Teams */}
          <div className="bg-slate-900/80 border border-sky-500/20 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400">Rescue Teams</span>
              <Truck className="w-5 h-5 text-sky-400" />
            </div>
            <div className="mt-2 text-2xl sm:text-3xl font-black text-sky-400">
              {stats.rescueTeamsCount}
            </div>
            <div className="text-[11px] text-sky-300 mt-1">NDRF + SDRF Units</div>
          </div>

        </div>

        {/* Charts Row matching image: Flood Risk Overview Bar & Risk Distribution Donut */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Flood Risk Overview (Bar Chart) matching image */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="font-extrabold text-white text-base">Flood Risk Overview</h3>
                <p className="text-xs text-slate-400">Monthly incident progression analysis</p>
              </div>
              <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-1 rounded-lg">
                Jul – Nov 2026
              </span>
            </div>

            <div className="h-64 w-full">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* Risk Distribution (Donut Chart) matching image */}
          <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h3 className="font-extrabold text-white text-base">Risk Distribution</h3>
                  <p className="text-xs text-slate-400">Zonal categorization</p>
                </div>
                <span className="text-xs font-semibold text-slate-400">Real-Time</span>
              </div>

              <div className="h-56 w-full mt-3">
                <Doughnut data={donutData} options={donutOptions} />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-around text-xs font-semibold">
              <span className="text-emerald-400">Low: 50%</span>
              <span className="text-amber-400">Moderate: 30%</span>
              <span className="text-red-400">High: 20%</span>
            </div>
          </div>

        </div>

        {/* Recent Activity Feed matching image */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Recent Activity</h3>
            <span className="text-xs text-slate-400">System Audit Trail</span>
          </div>

          <div className="space-y-3">
            {stats.recentActivity.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    act.type === 'red' ? 'bg-red-500 animate-pulse' : act.type === 'emerald' ? 'bg-emerald-400' : 'bg-cyan-400'
                  }`} />
                  <div>
                    <div className="text-xs font-bold text-slate-200">{act.title}</div>
                    <div className="text-[10px] text-slate-400">{act.time}</div>
                  </div>
                </div>

                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                  act.type === 'red' ? 'bg-red-500/20 text-red-400' : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {act.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Broadcast Alert Modal */}
      {broadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-2xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-red-400">
                <Radio className="w-5 h-5 animate-pulse" />
                <h3 className="text-base font-bold text-white">Broadcast Emergency Flood Alert</h3>
              </div>
              <button
                onClick={() => setBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastAlert} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target District</label>
                <input
                  type="text"
                  value={broadcastRegion}
                  onChange={(e) => setBroadcastRegion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Severity Level</label>
                <select
                  value={broadcastSeverity}
                  onChange={(e) => setBroadcastSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                >
                  <option value="CRITICAL">RED ALERT (Immediate Evacuation)</option>
                  <option value="WARNING">ORANGE ALERT (High Preparedness)</option>
                  <option value="WATCH">YELLOW ALERT (Watchful Monitoring)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Alert Message</label>
                <textarea
                  rows={3}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setBroadcastModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to All Channels</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
