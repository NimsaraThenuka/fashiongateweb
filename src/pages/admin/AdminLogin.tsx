import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

const LOGO_URL = 'https://res.cloudinary.com/dyp247eoh/image/upload/v1784785679/Fashion_Gate_JPG_02.jpg-removebg-preview_epbtzx.png';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate(from, { replace: true });
    } else {
      setError(res.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#070707] text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#C4922A]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-[#C4922A]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar */}
      <div className="max-w-[1400px] w-full mx-auto px-6 py-8 flex items-center justify-between z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-white/50 hover:text-[#C4922A] uppercase tracking-widest transition-colors font-medium">
          <ArrowLeft size={14} /> Back to Boutique
        </Link>
        <div className="flex items-center gap-2 text-[10px] text-[#C4922A] tracking-[0.2em] uppercase font-mono border border-[#C4922A]/30 px-3 py-1 rounded-full bg-[#C4922A]/5">
          <ShieldCheck size={12} /> Secure Admin Access
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md mx-auto px-6 py-10 z-10">
        <div className="bg-[#111111] border border-white/10 rounded-sm p-8 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-md">
          {/* Top Gold Edge */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C4922A] to-transparent" />

          {/* Logo & Heading */}
          <div className="text-center mb-8">
            <img src={LOGO_URL} alt="Fashion Gate" className="h-20 w-auto mx-auto mb-4 brightness-0 invert" />
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Management Portal
            </h1>
            <p className="text-white/40 text-xs tracking-wider uppercase mt-1 font-mono">
              Authorized Personnel Only
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/40 rounded-xs text-red-300 text-xs leading-relaxed animate-scale-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-white/70 mb-2">
                Administrator Email
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@fashiongate.com"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-3.5 pl-11 text-sm text-white placeholder-white/20 outline-none focus:border-[#C4922A] transition-colors rounded-xs"
                />
                <Mail size={16} className="absolute left-4 text-white/40 pointer-events-none" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[10px] tracking-[0.15em] uppercase font-semibold text-white/70 mb-2">
                Master Security Key
              </label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#181818] border border-white/15 px-4 py-3.5 pl-11 pr-11 text-sm text-white placeholder-white/20 outline-none focus:border-[#C4922A] transition-colors rounded-xs font-mono"
                />
                <Lock size={16} className="absolute left-4 text-white/40 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-white/40 hover:text-white transition-colors cursor-pointer"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 text-xs tracking-[0.15em] uppercase font-bold flex items-center justify-center gap-2 mt-4 cursor-pointer shadow-lg"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </span>
              ) : (
                <>
                  Access Dashboard <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center py-6 text-[11px] text-white/20 z-10">
        &copy; {new Date().getFullYear()} Fashion Gate Sri Lanka. All administrative sessions are encrypted.
      </div>
    </div>
  );
}
