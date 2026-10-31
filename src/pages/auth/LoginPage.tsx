import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid business email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { addToast } = useApp();
  const navigate = useNavigate();
  const [authError, setAuthError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setAuthError(null);
    const result = login(data.email, data.password);
    if (result.success) {
      addToast('Welcome back, Vikram! Authenticated as Raymond Apparel.', 'success');
      navigate('/client/dashboard');
    } else {
      setAuthError(result.error || 'Authentication failed');
    }
  };

  const fillDemoCredentials = () => {
    setValue('email', 'v.malhotra@raymondapparel.in');
    setValue('password', 'LoomPilot@2026');
    setAuthError(null);
  };

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Icon */}
        <div className="inline-flex w-12 h-12 rounded-xl bg-gradient-to-br from-vermilion to-vermilion-hover items-center justify-center text-white shadow-vermilion mb-3">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-7 h-7"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
            <line x1="8" y1="3" x2="8" y2="21" />
            <line x1="16" y1="3" x2="16" y2="21" />
            <circle cx="12" cy="12" r="2.5" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-3xl font-extrabold text-charcoal tracking-tight">
          Loom<span className="text-vermilion">Pilot</span>
        </h2>
        <p className="mt-1 text-sm text-muted">
          Enterprise Client Portal • Textile Manufacturing Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-muted-border sm:px-10">
          {/* Demo Helper Banner */}
          <div className="mb-6 p-3.5 rounded-xl bg-ivory border border-muted-border flex items-start gap-3">
            <ShieldCheck className="text-success mt-0.5 flex-shrink-0" size={18} />
            <div className="text-xs text-charcoal flex-1">
              <span className="font-bold block text-charcoal mb-0.5">Demo Enterprise Credentials:</span>
              <div className="font-mono text-[11px] text-muted space-y-0.5">
                <div>Email: <strong className="text-charcoal">v.malhotra@raymondapparel.in</strong></div>
                <div>Password: <strong className="text-charcoal">LoomPilot@2026</strong></div>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="mt-2 text-[11px] font-bold text-vermilion hover:underline"
              >
                Auto-fill Raymond Apparel Demo Credentials →
              </button>
            </div>
          </div>

          {authError && (
            <div className="mb-5 p-3 rounded-xl bg-vermilion/10 border border-vermilion/20 flex items-center gap-2 text-xs text-vermilion font-medium">
              <AlertCircle size={16} />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-charcoal mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  {...register('email')}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-muted-border bg-ivory focus:bg-white focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 focus:outline-none transition-all"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-vermilion font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-charcoal">
                  Portal Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); addToast('Password reset link sent to registered email.', 'info'); }} className="text-xs font-medium text-vermilion hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="password"
                  {...register('password')}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-xl border border-muted-border bg-ivory focus:bg-white focus:border-vermilion focus:ring-2 focus:ring-vermilion/10 focus:outline-none transition-all"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-vermilion font-medium">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-vermilion hover:bg-vermilion-hover shadow-vermilion transition-all flex items-center justify-center gap-2 group"
            >
              <span>Sign In to Portal</span>
              <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-muted-border text-center">
            <p className="text-xs text-muted">
              Need a LoomPilot client manufacturing account?{' '}
              <Link to="/client/register" className="font-bold text-vermilion hover:underline">
                Register Mill Entity
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

