import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import UserDashboard from './components/UserDashboard';
import LeafletRiskMap from './components/LeafletRiskMap';
import RescueOperations from './components/RescueOperations';
import ProfileView from './components/ProfileView';
import AdminPanel from './components/AdminPanel';
import AuthModal from './components/AuthModal';
import SosModal from './components/SosModal';
import RegionDetailModal from './components/RegionDetailModal';
import DemoModal from './components/DemoModal';
import { SEED_REGIONS, apiService } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('landing'); // 'landing' | 'dashboard' | 'map' | 'rescue' | 'profile' | 'admin'
  const [selectedRegion, setSelectedRegion] = useState(SEED_REGIONS[0]); // Default Patiala, Punjab matching image
  
  // User state
  const [user, setUser] = useState({
    id: 1,
    name: 'Rajni Sharma',
    email: 'rajni@example.com',
    location: 'Patiala, Punjab',
    phone: '+91 98765 43210',
    role: 'CITIZEN'
  });

  // Modal States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState('login');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [modalRegion, setModalRegion] = useState(SEED_REGIONS[0]);

  // Check backend health on mount
  useEffect(() => {
    apiService.checkHealth().then(status => {
      console.log('[FloodRadarX] Backend status:', status);
    });
  }, []);

  const handleOpenAuth = (tab = 'login') => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('floodradar_token');
    setActiveTab('landing');
  };

  const handleOpenDetail = (region) => {
    setModalRegion(region || selectedRegion);
    setDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onOpenAuth={handleOpenAuth}
        onLogout={handleLogout}
        onOpenSos={() => setSosModalOpen(true)}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* Main Dynamic View Area based on Active Tab */}
      <div className="flex-1 flex flex-col">
        {activeTab === 'landing' && (
          <HeroSection
            onNavigate={setActiveTab}
            onSelectRegion={(reg) => {
              setSelectedRegion(reg);
              setModalRegion(reg);
            }}
            onOpenDemo={() => setDemoModalOpen(true)}
          />
        )}

        {activeTab === 'dashboard' && (
          <UserDashboard
            user={user}
            onNavigate={setActiveTab}
            onOpenSos={() => setSosModalOpen(true)}
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onOpenDetail={handleOpenDetail}
          />
        )}

        {activeTab === 'map' && (
          <LeafletRiskMap
            selectedRegion={selectedRegion}
            onSelectRegion={setSelectedRegion}
            onOpenDetail={handleOpenDetail}
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}

        {activeTab === 'rescue' && (
          <RescueOperations
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            user={user}
            onUpdateUser={setUser}
            onNavigate={setActiveTab}
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}

        {activeTab === 'admin' && (
          <AdminPanel
            onOpenSos={() => setSosModalOpen(true)}
          />
        )}
      </div>

      {/* Interactive Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
        onAuthSuccess={handleAuthSuccess}
      />

      <SosModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        selectedRegion={selectedRegion}
      />

      <RegionDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        region={modalRegion}
        onNavigateMap={() => {
          setSelectedRegion(modalRegion);
          setActiveTab('map');
        }}
      />

      <DemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        onExploreMap={() => setActiveTab('map')}
      />

      {/* Persistent Bottom Quick-Navigation Dock for Easy Switching between the 6 picture screens */}
      <footer className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-cyan-500/30 px-3 py-1.5 rounded-full shadow-2xl backdrop-blur-xl flex items-center gap-1.5 text-xs">
        <span className="text-[10px] text-cyan-400/80 font-bold uppercase tracking-wider px-2 hidden sm:inline">
          Screens:
        </span>
        {[
          { id: 'landing', label: '1. Hero' },
          { id: 'dashboard', label: '2. Dashboard' },
          { id: 'map', label: '3. Risk Map' },
          { id: 'rescue', label: '4. Rescue' },
          { id: 'profile', label: '5. Profile' },
          { id: 'admin', label: '6. Admin' }
        ].map(screen => (
          <button
            key={screen.id}
            onClick={() => setActiveTab(screen.id)}
            className={`px-2.5 py-1 rounded-full font-semibold transition-all ${
              activeTab === screen.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/25'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            {screen.label}
          </button>
        ))}
      </footer>

    </div>
  );
}
