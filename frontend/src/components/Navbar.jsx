import React from 'react';
import { 
  ShieldAlert, 
  MapPin, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  PhoneCall, 
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  user, 
  onOpenAuth, 
  onLogout, 
  onOpenSos,
  selectedRegion,
  onSelectRegion
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'map', label: 'Live Map' },
    { id: 'rescue', label: 'Rescue Ops' },
    { id: 'admin', label: 'Admin Panel' }
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-cyan-500/20 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              {/* Radar waves icon */}
              <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" opacity="0.3"/>
                <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z" opacity="0.6"/>
                <path d="M12 10a2 2 0 1 0 2 2 2 2 0 0 0-2-2z"/>
                <path d="M12 2a10 10 0 0 1 10 10"/>
              </svg>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              FloodRadar<span className="text-cyan-400">X</span>
            </span>
            <span className="text-[10px] text-cyan-400/80 uppercase tracking-widest font-semibold -mt-1">
              Know Risk. Plan Better.
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-semibold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          
          {/* Language Selector */}
          <div className="flex items-center gap-1 text-xs text-slate-300 bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
            <span>🌐 EN</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* SOS Emergency Button */}
          <button
            onClick={onOpenSos}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-red-500 hover:from-rose-500 hover:to-red-400 text-white text-xs font-bold px-3.5 py-2 rounded-xl shadow-lg shadow-red-500/30 transition-all hover:scale-105 active:scale-95 animate-pulse"
          >
            <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
            <span>SOS Emergency</span>
          </button>

          {/* User state / Login */}
          {user ? (
            <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl p-1 pr-3">
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2 hover:opacity-90"
              >
                <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center font-bold text-xs">
                  {user.name ? user.name.charAt(0) : 'R'}
                </div>
                <span className="text-xs font-medium text-slate-200">{user.name || 'Rajni'}</span>
              </button>
              <button
                onClick={onLogout}
                title="Logout"
                className="ml-2 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="text-xs font-medium text-slate-300 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-900/80 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="text-xs font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 px-4 py-2 rounded-xl shadow-md shadow-cyan-500/20 transition-all hover:scale-105"
              >
                Get Started
              </button>
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSos}
            className="bg-red-600 text-white p-2 rounded-lg text-xs font-bold"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-2 rounded-lg text-xs font-medium text-left ${
                  activeTab === link.id
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 bg-slate-800/50'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
            {user ? (
              <button
                onClick={() => {
                  setActiveTab('profile');
                  setMobileMenuOpen(false);
                }}
                className="text-xs text-cyan-400 font-medium"
              >
                Signed in as {user.name} (View Profile)
              </button>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth('login');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-xs font-semibold bg-cyan-500 text-slate-950 rounded-lg"
              >
                Login / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
