import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  CheckCircle2, 
  Camera, 
  Edit3, 
  Save, 
  Bell, 
  Shield, 
  AlertTriangle,
  Home, 
  CloudRain, 
  FileText 
} from 'lucide-react';

export default function ProfileView({ user, onUpdateUser, onNavigate, onOpenSos }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Rajni Sharma');
  const [email, setEmail] = useState(user?.email || 'rajni@example.com');
  const [location, setLocation] = useState(user?.location || 'Patiala, Punjab');
  const [emergencyContact, setEmergencyContact] = useState(user?.phone || '+91 98765 43210');

  // Notification toggles matching image
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      email,
      location,
      phone: emergencyContact
    });
    setIsEditing(false);
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 3000);
  };

  const sidebarLinks = [
    { label: 'Overview', icon: Home, tab: 'dashboard' },
    { label: 'My Region', icon: MapPin, tab: 'map' },
    { label: 'Flood Forecast', icon: CloudRain, tab: 'map' },
    { label: 'Nearby Shelters', icon: Home, tab: 'map' },
    { label: 'Community Reports', icon: FileText, tab: 'dashboard' },
    { label: 'My Alerts', icon: Bell, tab: 'dashboard' },
    { label: 'Profile', icon: User, active: true },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 flex flex-col md:flex-row">
      
      {/* Left Sidebar matching image */}
      <aside className="w-full md:w-64 bg-slate-900/70 border-r border-slate-800/80 p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5 px-3 py-2 bg-slate-950/60 rounded-xl border border-cyan-500/20">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">Account Settings</span>
          </div>

          <nav className="space-y-1">
            {sidebarLinks.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => item.tab && onNavigate(item.tab)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    item.active
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.active ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* SOS Emergency Button */}
        <div className="pt-6">
          <button
            onClick={onOpenSos}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-red-500/20 text-xs transition-all hover:scale-[1.02]"
          >
            <AlertTriangle className="w-4 h-4 fill-white text-red-600" />
            <span>🚨 SOS Emergency</span>
          </button>
        </div>
      </aside>

      {/* Main Profile View matching image */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
        
        {/* Header */}
        <div className="pb-3 border-b border-slate-800">
          <h1 className="text-2xl font-extrabold text-white">My Profile</h1>
          <p className="text-xs text-slate-400 mt-1">Manage your account information and early alert channels</p>
        </div>

        {/* Success Feedback */}
        {savedNotification && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Profile and notification preferences saved successfully!</span>
          </div>
        )}

        {/* User Avatar Card matching image */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col sm:flex-row items-center gap-6">
          
          {/* Avatar Illustration */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-cyan-500 via-teal-400 to-sky-300 p-1 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center overflow-hidden">
                <svg className="w-16 h-16 text-cyan-300" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 4c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm0 14c-2.03 0-4.43-.82-6.14-2.88C7.55 15.8 9.68 15 12 15s4.45.8 6.14 2.12C16.43 19.18 14.03 20 12 20z"/>
                </svg>
              </div>
            </div>
            <button
              onClick={() => alert('Photo picker: Select a photo from device')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-cyan-500 text-slate-950 shadow-md hover:scale-110 transition-transform"
              title="Update Photo"
            >
              <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>

          {/* User Details & Verified Badge matching image */}
          <div className="text-center sm:text-left space-y-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-black text-white">{name}</h2>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Verified
              </span>
            </div>
            <p className="text-xs text-slate-400">{email}</p>
            <p className="text-xs text-cyan-400 font-medium">NDRF Volunteer & Community Liaison</p>
            <div className="pt-2">
              <button
                onClick={() => alert('Profile photo updated to default avatar.')}
                className="text-xs text-slate-300 hover:text-cyan-400 font-semibold underline underline-offset-4"
              >
                Update Photo
              </button>
            </div>
          </div>

        </div>

        {/* Personal Details Card matching image */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Personal Details</h3>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>

          {!isEditing ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Location</span>
                </div>
                <div className="font-bold text-white text-sm">{location}</div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-slate-400 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Emergency Contact</span>
                </div>
                <div className="font-bold text-white text-sm">{emergencyContact}</div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="py-2.5 px-5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>

        {/* Notification Preferences Card matching image */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-base">Notification Preferences</h3>
            <p className="text-xs text-slate-400 mt-0.5">Control which channels broadcast critical flash flood alerts to you</p>
          </div>

          <div className="space-y-4 pt-1">
            {/* SMS Alerts toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">SMS Alerts</div>
                <div className="text-[11px] text-slate-400">Receive priority text SMS when water levels exceed threshold</div>
              </div>
              <button
                type="button"
                onClick={() => setSmsAlerts(!smsAlerts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  smsAlerts ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* Email Alerts toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">Email Alerts</div>
                <div className="text-[11px] text-slate-400">Daily forecast bulletin and radar analysis reports</div>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  emailAlerts ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>

            {/* In-App Notifications toggle */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <div className="text-xs font-bold text-white">In-App Notifications</div>
                <div className="text-[11px] text-slate-400">Push notifications and audio siren for instant evacuation</div>
              </div>
              <button
                type="button"
                onClick={() => setInAppAlerts(!inAppAlerts)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                  inAppAlerts ? 'bg-cyan-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 rounded-full bg-white shadow-md" />
              </button>
            </div>
          </div>
        </div>

      </main>

    </div>
  );
}
