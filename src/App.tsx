/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { FoodTrackerView } from './components/FoodTrackerView';
import { WorkoutTrackerView } from './components/WorkoutTrackerView';
import { CalendarView } from './components/CalendarView';
import { HabitsView } from './components/HabitsView';
import { ReportsView } from './components/ReportsView';
import { ProfileView } from './components/ProfileView';
import { AuthModal } from './components/AuthModal';
import { VivaKitModal } from './components/VivaKitModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { User, UserGoals } from './types';
import { 
  getActiveUser, 
  getUserGoals, 
  getTodayString, 
  seedDemoData, 
  logoutUser,
  getUsers,
  getSavedTheme,
  saveTheme,
  ThemeMode
} from './utils/storage';
import { Flame, Globe } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userGoals, setUserGoals] = useState<UserGoals | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayString());
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isVivaKitOpen, setIsVivaKitOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);
  const [theme, setTheme] = useState<ThemeMode>(getSavedTheme());

  // Apply theme class to document element
  useEffect(() => {
    saveTheme(theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Initial user initialization
  useEffect(() => {
    let user = getActiveUser();
    if (!user) {
      const allUsers = getUsers();
      if (allUsers.length === 0) {
        // Auto-seed Demo Student Alex for instant presentation demonstration
        user = seedDemoData();
      } else {
        // Prompt login
        setIsAuthOpen(true);
        return;
      }
    }

    setCurrentUser(user);
    setUserGoals(getUserGoals(user.id));
  }, [refreshTrigger]);

  const handleRefreshData = () => {
    setRefreshTrigger(prev => prev + 1);
    if (currentUser) {
      setUserGoals(getUserGoals(currentUser.id));
    }
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    setUserGoals(getUserGoals(user.id));
    setIsAuthOpen(false);
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
    setUserGoals(null);
    setIsAuthOpen(true);
  };

  if (!currentUser || !userGoals) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors">
        <AuthModal 
          isOpen={true} 
          onSuccess={handleAuthSuccess} 
        />
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 flex flex-col font-sans text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar 
        user={currentUser}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onOpenVivaKit={() => setIsVivaKitOpen(true)}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onLogout={handleLogout}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1 min-h-0 w-full overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            onNavigateTab={setActiveTab}
            onRefreshData={handleRefreshData}
            theme={theme}
          />
        )}

        {activeTab === 'food' && (
          <FoodTrackerView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            onRefreshData={handleRefreshData}
          />
        )}

        {activeTab === 'workouts' && (
          <WorkoutTrackerView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            onRefreshData={handleRefreshData}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onNavigateTab={setActiveTab}
            onRefreshData={handleRefreshData}
          />
        )}

        {activeTab === 'habits' && (
          <HabitsView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            onRefreshData={handleRefreshData}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsView 
            user={currentUser}
            goals={userGoals}
            selectedDate={selectedDate}
            theme={theme}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView 
            user={currentUser}
            goals={userGoals}
            onRefreshData={handleRefreshData}
            theme={theme}
            onToggleTheme={handleToggleTheme}
          />
        )}
        </div>
      </main>

      {/* Footer */}
      <footer className="hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="font-semibold text-slate-800 dark:text-slate-200">FitTrack</span>
            <span>· Personal Fitness & Nutrition Tracker for Students</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDeployGuideOpen(true)}
              className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold transition-colors cursor-pointer flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Host Online & Share</span>
            </button>
            <span>·</span>
            <button
              onClick={() => setIsVivaKitOpen(true)}
              className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
            >
              College Project & Viva Hub
            </button>
            <span>·</span>
            <span>Final-Year Mini Project Edition</span>
          </div>
        </div>
      </footer>

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={isAuthOpen} 
        onSuccess={handleAuthSuccess} 
      />

      {/* Project Viva & Architecture Kit Modal */}
      <VivaKitModal 
        isOpen={isVivaKitOpen} 
        onClose={() => setIsVivaKitOpen(false)} 
      />

      {/* Online Hosting & Deployment Hub Modal */}
      <DeployGuideModal 
        isOpen={isDeployGuideOpen} 
        onClose={() => setIsDeployGuideOpen(false)} 
      />

    </div>
  );
}
