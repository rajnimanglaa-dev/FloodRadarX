import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  Phone, 
  MapPin, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { apiService } from '../services/api';

export default function AuthModal({ isOpen, onClose, initialTab = 'login', onAuthSuccess }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState(initialTab); // 'login' | 'register'
  const [emailOrPhone, setEmailOrPhone] = useState('rajni@example.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Rajni Sharma');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (activeTab === 'login') {
        const res = await apiService.login(emailOrPhone, password);
        if (res.success) {
          setSuccessMessage('Welcome back, ' + (res.user?.name || 'User') + '!');
          setTimeout(() => {
            onAuthSuccess(res.user);
            onClose();
          }, 800);
        } else {
          setErrorMessage('Invalid credentials. Please try again.');
        }
      } else {
        const res = await apiService.register({
          name,
          email: emailOrPhone,
          phone,
          password,
          role: 'CITIZEN'
        });
        setSuccessMessage('Registration successful! Logging you in...');
        setTimeout(() => {
          onAuthSuccess({
            name,
            email: emailOrPhone,
            phone,
            location: 'Patiala, Punjab',
            role: 'CITIZEN'
          });
          onClose();
        }, 1000);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Water / Flood photo background matching image */}
        <div className="md:w-5/12 relative min-h-[220px] md:min-h-[500px] bg-gradient-to-br from-cyan-900 via-slate-900 to-slate-950 p-8 flex flex-col justify-between overflow-hidden">
          {/* Subtle water ripples pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="auth-grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#38bdf8" strokeWidth="0.8"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#auth-grid)" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z" opacity="0.4"/>
                  <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6z"/>
                </svg>
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                FloodRadar<span className="text-cyan-400">X</span>
              </span>
            </div>
          </div>

          <div className="relative z-10 space-y-2">
            <h2 className="text-2xl font-black text-white leading-tight">
              Predict. Protect. Respond.
            </h2>
            <p className="text-xs text-cyan-300 font-medium">
              Together for a safer tomorrow.
            </p>
          </div>

          <div className="relative z-10 text-[11px] text-slate-400">
            Unified Disaster Intelligence Platform
          </div>
        </div>

        {/* Right Side: Form matching image */}
        <div className="md:w-7/12 p-8 sm:p-10 flex flex-col justify-center bg-slate-900">
          
          {/* Tab switchers matching image: Login | Register */}
          <div className="flex items-center border-b border-slate-800 pb-3 mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('login'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 text-center pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'login' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Login
              {activeTab === 'login' && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('register'); setErrorMessage(''); setSuccessMessage(''); }}
              className={`flex-1 text-center pb-2 text-sm font-bold transition-all relative ${
                activeTab === 'register' ? 'text-cyan-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              Register
              {activeTab === 'register' && (
                <div className="absolute bottom-[-13px] left-0 right-0 h-0.5 bg-cyan-400" />
              )}
            </button>
          </div>

          {/* Feedback banners */}
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Register: Name */}
            {activeTab === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative flex items-center">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Rajni Sharma"
                    className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                  />
                </div>
              </div>
            )}

            {/* Email or Mobile Number */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Email or Mobile Number
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  required
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                  placeholder="rajni@example.com or +91 98765 43210"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 pl-10 pr-4 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-400 pl-10 pr-10 py-2.5 rounded-xl text-xs text-white placeholder-slate-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password matching image */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 w-3.5 h-3.5"
                />
                <span>Remember Me</span>
              </label>

              <button
                type="button"
                onClick={() => alert('Password reset link sent to your registered email.')}
                className="text-cyan-400 hover:text-cyan-300 font-medium"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Button matching image */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50"
            >
              <span>{loading ? 'Please wait...' : activeTab === 'login' ? 'Login' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Social Divider matching image */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-slate-900 px-3 text-slate-400">or continue with</span>
              </div>
            </div>

            {/* Social buttons matching image: Google & Facebook */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    name: 'Rajni Sharma',
                    email: 'rajni.google@example.com',
                    phone: '+91 98765 43210',
                    location: 'Patiala, Punjab',
                    role: 'CITIZEN'
                  });
                  onClose();
                }}
                className="py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-black text-rose-400">G</span>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onAuthSuccess({
                    name: 'Rajni Sharma',
                    email: 'rajni.fb@example.com',
                    phone: '+91 98765 43210',
                    location: 'Patiala, Punjab',
                    role: 'CITIZEN'
                  });
                  onClose();
                }}
                className="py-2.5 px-4 bg-slate-950 hover:bg-slate-800 border border-slate-700 rounded-xl text-xs font-semibold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="font-black text-blue-400">f</span>
                <span>Facebook</span>
              </button>
            </div>

            {/* Footer link matching image */}
            <div className="pt-2 text-center text-xs text-slate-400">
              {activeTab === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('register')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Sign Up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveTab('login')}
                    className="text-cyan-400 font-bold hover:underline"
                  >
                    Login
                  </button>
                </span>
              )}
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}
