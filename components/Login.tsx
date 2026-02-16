import React, { useState } from 'react';
import { Lock, User as UserIcon, ArrowRight, Loader2 } from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulasi delay network
    setTimeout(() => {
      // Mock authentication logic
      if (username === 'admin' && password === 'admin') {
        onLogin({
          username: 'admin',
          name: 'Administrator',
          role: UserRole.ADMIN
        });
      } else if (username === 'staff' && password === 'staff') {
        onLogin({
          username: 'staff',
          name: 'Staff Gudang',
          role: UserRole.STAFF
        });
      } else {
        setError('Username atau password salah');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in border border-gray-100">
        <div className="bg-primary p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl mx-auto mb-4 backdrop-blur-sm">
            I
          </div>
          <h1 className="text-2xl font-bold text-white">InvenAI</h1>
          <p className="text-indigo-100 mt-2 text-sm">Masuk untuk mengelola inventaris Anda</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm py-2 px-3 rounded-lg border border-red-100 flex items-center">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></span>
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Username</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="admin atau staff"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 active:scale-95 flex items-center justify-center"
            >
              {isLoading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  Masuk Sistem <ArrowRight size={18} className="ml-2" />
                </>
              )}
            </button>

            <div className="text-center pt-2">
              <p className="text-xs text-gray-400">
                Demo Login:<br/>
                Admin: <span className="font-mono text-gray-600">admin / admin</span><br/>
                Staff: <span className="font-mono text-gray-600">staff / staff</span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};