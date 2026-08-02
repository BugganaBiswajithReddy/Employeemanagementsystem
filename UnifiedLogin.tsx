import React, { useState } from 'react';
import { AuthService } from '../services/auth';
import { Lock, User, AlertCircle, Users } from 'lucide-react';
import { StorageService } from '../services/storage';
import { Employee } from '../types';

export type AuthUser = { role: 'admin' } | { role: 'employee', employeeId: string, hasChangedPassword?: boolean };

interface UnifiedLoginProps {
  onLoginSuccess: (user: AuthUser) => void;
  employees: Employee[];
}

export const UnifiedLogin: React.FC<UnifiedLoginProps> = ({ onLoginSuccess, employees }) => {
  const [role, setRole] = useState<'admin' | 'employee'>('admin');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!identifier || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (role === 'admin') {
      if (AuthService.verifyCredentials(identifier, password)) {
        onLoginSuccess({ role: 'admin' });
      } else {
        setError('Invalid admin credentials.');
      }
    } else {
      const emp = employees.find(e => e.id === identifier || e.email === identifier);
      const actualPassword = emp?.password || 'password123';
      if (emp && actualPassword === password) {
        onLoginSuccess({ role: 'employee', employeeId: emp.id, hasChangedPassword: emp.hasChangedPassword });
      } else {
        setError('Invalid employee credentials.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-6 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            {role === 'admin' ? <Lock className="w-8 h-8 text-white" /> : <Users className="w-8 h-8 text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-white">
            {role === 'admin' ? 'Admin Access' : 'Employee Portal'}
          </h2>
          <p className="text-blue-100 mt-1">Sign in to your account</p>
        </div>
        
        <div className="p-6 pb-0">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${role === 'admin' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setRole('admin'); setIdentifier(''); setPassword(''); setError(''); }}
            >
              Admin
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${role === 'employee' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
              onClick={() => { setRole('employee'); setIdentifier(''); setPassword(''); setError(''); }}
            >
              Employee
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-center space-x-2 text-sm border border-red-100">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              {role === 'admin' ? 'Username or Email' : 'Employee ID or Email'}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder={role === 'admin' ? "admin" : "EMP001 or name@company.com"}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="password"
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 transition-colors"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
