import React from 'react';
import { SidebarTab } from '../types';
import { useState, useRef, useEffect } from 'react';
import { Calendar, User, CheckCircle2, Menu, LogOut, KeyRound } from 'lucide-react';

interface HeaderProps {
  activeTab: SidebarTab;
  selectedDate: string;
  onToggleMobileMenu?: () => void;
  onLogout: () => void;
  onChangePassword: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  selectedDate,
  onToggleMobileMenu,
  onLogout,
  onChangePassword,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTabTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Workforce Overview';
      case 'employees':
        return 'Employee Management';
      case 'attendance':
        return 'Attendance Tracking';
      default:
        return 'Workforce System';
    }
  };

  const getTabDescription = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Real-time metrics, system actions, and recent activity log.';
      case 'employees':
        return 'Manage personnel records, onboarding details, and bank profiles.';
      case 'attendance':
        return 'Record daily employee check-ins, leaves, and attendance logs.';
      default:
        return '';
    }
  };

  const getFormattedDate = () => {
    if (!selectedDate) return 'Today';
    try {
      const dateObj = new Date(selectedDate + 'T00:00:00');
      if (isNaN(dateObj.getTime())) return selectedDate;
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return selectedDate;
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-10 shadow-xs">
      <div className="flex items-center space-x-3">
        {onToggleMobileMenu && (
          <button type="button"
            onClick={onToggleMobileMenu}
            id="btn-mobile-menu-toggle"
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-colors"
            title="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{getTabTitle()}</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">{getTabDescription()}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Date Display */}
        <div className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-slate-100/80 border border-slate-200 text-slate-700 text-xs font-medium">
          <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span className="truncate max-w-[120px] sm:max-w-none">{getFormattedDate()}</span>
        </div>

        {/* Admin Badge */}
        <div className="relative" ref={profileRef}>
          <button type="button" 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center space-x-2.5 pl-2 border-l border-slate-200 focus:outline-none hover:bg-slate-50 p-1 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-semibold text-xs shadow-xs shrink-0">
              <User className="w-4 h-4" />
            </div>
            <div className="hidden lg:block text-left">
              <div className="text-xs font-semibold text-slate-900 flex items-center space-x-1">
                <span>Admin HR</span>
                <CheckCircle2 className="w-3 h-3 text-blue-600" />
              </div>
              <div className="text-[10px] text-slate-500">Administrator</div>
            </div>
          </button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
              <button type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  onChangePassword();
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center space-x-2 transition-colors"
              >
                <KeyRound className="w-4 h-4" />
                <span>Change Password</span>
              </button>
              <div className="h-px bg-slate-100 my-1"></div>
              <button type="button"
                onClick={() => {
                  setIsProfileOpen(false);
                  onLogout();
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2 transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

