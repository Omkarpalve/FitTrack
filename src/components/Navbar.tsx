import React from 'react';
import { 
  Flame, 
  Activity, 
  Utensils, 
  Dumbbell, 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  User as UserIcon, 
  GraduationCap, 
  LogOut,
  Sun,
  Moon,
  Globe,
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { User } from '../types';
import { shiftDate, getTodayString, ThemeMode } from '../utils/storage';

export type ActiveTab = 
  | 'dashboard' 
  | 'food' 
  | 'workouts' 
  | 'calendar' 
  | 'habits' 
  | 'reports' 
  | 'profile';

interface NavbarProps {
  user: User;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onOpenVivaKit: () => void;
  onOpenDeployGuide: () => void;
  onLogout: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  onTabChange,
  selectedDate,
  onDateChange,
  onOpenVivaKit,
  onOpenDeployGuide,
  onLogout,
  theme,
  onToggleTheme
}) => {
  const today = getTodayString();
  const isToday = selectedDate === today;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity className="w-4 h-4" /> },
    { id: 'food', label: 'Food & Protein', icon: <Utensils className="w-4 h-4" /> },
    { id: 'workouts', label: 'Workouts', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'calendar', label: 'Calendar', icon: <Calendar className="w-4 h-4" /> },
    { id: 'habits', label: 'Consistency', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'reports', label: 'Reports', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="shrink-0 z-40 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-16 py-2 gap-2 sm:gap-4">
          
          {/* Zone 1: Brand title */}
          <div className="flex items-center gap-3 min-w-0 shrink">
            <button 
              onClick={() => onTabChange('dashboard')}
              className="flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-950 group-hover:scale-105 transition-transform">
                <Flame className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div className="min-w-0">
                <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  FitTrack
                </span>
                <span className="hidden sm:inline-block ml-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                  Student Fitness & Nutrition
                </span>
              </div>
            </button>
          </div>

          {/* Global Date Stepper + Theme Toggle + Viva Kit + User */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Global Date Control */}
            <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg p-1 text-xs">
              <button
                onClick={() => onDateChange(shiftDate(selectedDate, -1))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Previous Day"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <input 
                type="date"
                value={selectedDate}
                onChange={(e) => e.target.value && onDateChange(e.target.value)}
                className="bg-transparent border-0 px-2 py-0.5 text-slate-800 dark:text-slate-100 font-medium focus:outline-none cursor-pointer text-xs"
              />
              <button
                onClick={() => onDateChange(shiftDate(selectedDate, 1))}
                className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded hover:bg-white dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Next Day"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              {!isToday && (
                <button
                  onClick={() => onDateChange(today)}
                  className="ml-1 px-1.5 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-semibold hover:bg-emerald-700 transition-colors cursor-pointer"
                >
                  Today
                </button>
              )}
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle theme mode"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Download Project Source Code ZIP */}
            <a
              href="/fittrack-source-code.zip"
              download="fittrack-source-code.zip"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="Download entire project code as a .ZIP file to your computer"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Download ZIP</span>
            </a>

            {/* Host Online & Deploy Button */}
            <button
              onClick={onOpenDeployGuide}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="View Live Online Website URL & Deployment Instructions"
            >
              <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="hidden sm:inline">Host Online</span>
            </button>

            {/* College Viva & Project Kit Button */}
            <button
              onClick={onOpenVivaKit}
              className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-semibold transition-all shadow-xs cursor-pointer"
              title="View Architecture, ER Diagrams, Flask Source Code & Viva Q&A"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Project Viva Kit</span>
            </button>

            {/* User Info / Logout */}
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-slate-800 pl-2 sm:pl-3">
              <button
                onClick={() => onTabChange('profile')}
                className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 font-medium hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                title="Edit profile & goals"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 font-bold text-xs uppercase">
                  {user.username.charAt(0)}
                </div>
                <span className="hidden xl:inline max-w-[90px] truncate">{user.username}</span>
              </button>
              <button
                onClick={onLogout}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Sub-Navigation Bar */}
        <nav className="flex items-center gap-1 xl:gap-2 border-t border-slate-100 dark:border-slate-800 py-2 overflow-x-auto">
          {navItems.map(item => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs xl:text-sm font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  active 
                    ? 'bg-emerald-600 text-white' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
