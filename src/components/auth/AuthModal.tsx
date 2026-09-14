'use client';

import React, { useState } from 'react';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { ArrowRight, Lock, Mail, User, ShieldCheck, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { currentUser, login, register, toastMessage } = useWorkspaceStore();
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isRegistering) {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setError('Please fill in all fields.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
      const success = register(name.trim(), email.trim(), password);
      if (!success) {
        setError('An account with this email already exists.');
      }
    } else {
      if (!email.trim() || !password.trim()) {
        setError('Please enter both email and password.');
        return;
      }
      const success = login(email.trim(), password);
      if (!success) {
        setError('Invalid email or password.');
      }
    }
  };

  const handleDemoLogin = () => {
    login('demo@notionboard.com', 'password123');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#111111] p-4 select-none">
      <div className="w-full max-w-sm bg-[#1a1a1a] border border-[#2e2e2e] rounded-xl p-6 shadow-2xl space-y-6">
        {/* Brand Icon & Heading */}
        <div className="text-center space-y-1.5">
          <div className="w-9 h-9 mx-auto rounded-lg bg-[#262626] border border-[#383838] flex items-center justify-center text-sm font-semibold text-[#ebebeb]">
            N
          </div>
          <h1 className="text-lg font-medium text-[#ebebeb]">
            {isRegistering ? 'Create your account' : 'Welcome to Notion Board'}
          </h1>
          <p className="text-xs text-[#777777]">
            {isRegistering
              ? 'Start organizing with hybrid boards and rich docs'
              : 'Log in to access your personal workspaces'}
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-2.5 bg-[#331c1c] border border-[#522b2b] text-[#f27474] text-xs rounded text-center">
            {error}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          {isRegistering && (
            <div>
              <label className="block text-[#888888] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666666]" />
                <input
                  type="text"
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#121212] border border-[#333333] rounded pl-8 pr-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[#888888] mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded pl-8 pr-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[#888888] mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#666666]" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#121212] border border-[#333333] rounded pl-8 pr-3 py-1.5 text-xs text-[#ebebeb] placeholder:text-[#555555] focus:outline-none focus:border-[#555555]"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-[#2383e2] hover:bg-[#1a73cb] text-white rounded text-xs font-medium transition mt-2 flex items-center justify-center gap-1.5"
          >
            <span>{isRegistering ? 'Create Account' : 'Continue'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Quick Demo Login Option */}
        <div className="pt-2 border-t border-[#262626] text-center space-y-2">
          <button
            onClick={handleDemoLogin}
            className="w-full py-1.5 px-3 bg-[#242424] hover:bg-[#2b2b2b] text-[#cccccc] rounded border border-[#333333] text-xs transition flex items-center justify-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#888888]" />
            <span>Quick Login with Demo Account</span>
          </button>

          <p className="text-[11px] text-[#777777]">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-[#2383e2] hover:underline"
            >
              {isRegistering ? 'Log in' : 'Sign up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

