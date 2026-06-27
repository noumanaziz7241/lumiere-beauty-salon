import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Lock, Eye, EyeOff } from 'lucide-react';
import { useSalonConfig } from '../context/SalonConfigContext';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useSalonConfig();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const success = await login(password);
    if (success) {
      navigate('/admin/dashboard');
    } else {
      setError('Incorrect password. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-burgundy-dark via-burgundy to-burgundy-light flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-rose/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose to-burgundy flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <h1 className="font-serif text-2xl font-black text-burgundy">Admin Portal</h1>
            <p className="font-sans text-xs text-burgundy/60 mt-1">Lumière Beauty Salon Management</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-sans text-xs font-bold text-burgundy/70 uppercase tracking-wider mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-rose-pale bg-cream/50 font-sans text-sm text-burgundy focus:outline-none focus:ring-2 focus:ring-rose/30 focus:border-rose"
                  placeholder="Enter admin password"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-burgundy/40 hover:text-burgundy"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-semibold">{error}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-sans text-xs uppercase font-extrabold tracking-widest bg-burgundy hover:bg-burgundy-light text-white shadow-md transition-all hover:-translate-y-0.5 cursor-pointer disabled:opacity-60"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6">
            <a href="/" className="font-sans text-xs text-rose hover:text-burgundy transition-colors">
              ← Back to website
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
