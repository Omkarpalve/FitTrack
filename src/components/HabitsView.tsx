import React, { useState } from 'react';
import { 
  Flame, 
  Trophy, 
  CalendarCheck, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Sparkles, 
  TrendingUp, 
  AlertCircle,
  Award,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { User, UserGoals, Habit } from '../types';
import { 
  getHabits, 
  addHabit, 
  deleteHabit, 
  getHabitCompletions, 
  toggleHabitCompletion, 
  calculateStreaks, 
  getTodayString 
} from '../utils/storage';

interface HabitsViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  onRefreshData: () => void;
}

export const HabitsView: React.FC<HabitsViewProps> = ({
  user,
  goals,
  selectedDate,
  onRefreshData
}) => {
  const [newHabitName, setNewHabitName] = useState('');
  const habits = getHabits(user.id);
  const completions = getHabitCompletions(user.id, selectedDate);
  const streakStats = calculateStreaks(user.id);

  const completedCount = habits.filter(h => !!completions[h.id]).length;
  const isAllCompleted = habits.length > 0 && completedCount === habits.length;

  // Toggle habit
  const handleToggle = (habitId: string, currentState: boolean) => {
    const nextState = !currentState;
    toggleHabitCompletion(user.id, habitId, selectedDate, nextState);

    // If completing the last remaining habit today, fire celebration confetti!
    if (nextState && completedCount + 1 === habits.length) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // Fallback gracefully
      }
    }

    onRefreshData();
  };

  const handleAddCustomHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    addHabit(user.id, newHabitName.trim());
    setNewHabitName('');
    onRefreshData();
  };

  const handleDeleteHabit = (id: string) => {
    if (confirm('Delete this habit? Existing completion history will be removed.')) {
      deleteHabit(id);
      onRefreshData();
    }
  };

  // Consistency Score
  const dailyPercent = habits.length > 0 ? Math.round((completedCount / habits.length) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-orange-600 dark:text-orange-400 tracking-wide uppercase mb-1">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>Discipline & Consistency Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Daily Habits & Consistency System
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Streaks are computed mathematically over consecutive calendar dates across month boundaries.
          </p>
        </div>

        {/* Selected Date badge */}
        <div className="px-3 py-2 bg-orange-50 dark:bg-orange-950/60 border border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-300 rounded-lg text-xs font-semibold flex items-center gap-2">
          <CalendarCheck className="w-4 h-4 text-orange-600 dark:text-orange-400" />
          <span>Tracking for: {selectedDate}</span>
        </div>
      </div>

      {/* 4 Consistency Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Current Active Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Current Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Zap className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-orange-600 dark:text-orange-400 tabular-nums">
                {streakStats.currentStreak}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Days Active</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Consecutive days with logged activity or completed habits.
            </p>
          </div>
        </div>

        {/* Longest Streak Record */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Longest Streak</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {streakStats.longestStreak}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Days Record</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Personal all-time continuous fitness consistency.
            </p>
          </div>
        </div>

        {/* Active Days This Month */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monthly Presence</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <CalendarCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                {streakStats.activeDaysThisMonth}
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Days This Month</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Total active calendar days in the current month.
            </p>
          </div>
        </div>

        {/* Weekly Consistency Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Consistency Score</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Award className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 tabular-nums">
                {streakStats.weeklyConsistencyPercent}%
              </span>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">7-Day Score</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${streakStats.weeklyConsistencyPercent}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* Main Content: Daily Checklist & Add Custom Habit */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Habit Checklist for Selected Date */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Daily Habit Checklist for {selectedDate}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {completedCount} of {habits.length} habits completed ({dailyPercent}%)
              </p>
            </div>

            {isAllCompleted && (
              <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold animate-bounce">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                All Habits Crushed!
              </span>
            )}
          </div>

          {habits.length === 0 ? (
            <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p>No habits configured yet. Add your first habit in the side panel!</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {habits.map(habit => {
                const isCompleted = !!completions[habit.id];
                return (
                  <div
                    key={habit.id}
                    className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                      isCompleted 
                        ? 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 shadow-xs' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <label 
                      onClick={() => handleToggle(habit.id, isCompleted)}
                      className="flex items-center gap-3 cursor-pointer select-none flex-1"
                    >
                      <input 
                        type="checkbox"
                        checked={isCompleted}
                        onChange={() => {}} // handled by parent onClick
                        className="w-5 h-5 rounded border-slate-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className={`text-xs sm:text-sm font-semibold ${isCompleted ? 'text-emerald-950 dark:text-emerald-200 line-through opacity-80' : 'text-slate-800 dark:text-slate-200'}`}>
                        {habit.name}
                      </span>
                    </label>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                        isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                      }`}>
                        {isCompleted ? 'Completed' : 'Pending'}
                      </span>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="p-1 text-slate-300 dark:text-slate-600 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete habit"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Educational Note on Streaks */}
          <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-600 dark:text-slate-400">
            <h4 className="font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>How streaks work mathematically:</span>
            </h4>
            <p className="leading-relaxed">
              Unlike simplistic counters that count database rows, FitTrack computes streaks strictly against <strong>continuous calendar dates</strong> (e.g. Oct 21, Oct 22, Oct 23). If you miss an entire calendar day without logging a meal, workout, or habit, the current streak resets to 0 upon the next check.
            </p>
          </div>

        </div>

        {/* Right Column: Add Custom Habit & Suggestions */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Add Custom Habit</span>
            </h2>

            <form onSubmit={handleAddCustomHabit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Habit Description
                </label>
                <input 
                  type="text"
                  placeholder="e.g. 10,000 Daily Steps"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Daily Habit</span>
              </button>
            </form>

            {/* Student Habit Ideas */}
            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Popular Student Fitness Habits:
              </span>
              <div className="space-y-1.5">
                {[
                  'Drink 3L Clean Water',
                  'Hit 135g Protein Target',
                  '45-Min Workout Session',
                  'Log All 4 Daily Meals',
                  '7.5+ Hours Sleep',
                  '10,000 Daily Steps',
                  'No Late-Night Junk Snacks',
                  '10-Minute Morning Stretch'
                ].map((idea, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      if (!habits.some(h => h.name.toLowerCase() === idea.toLowerCase())) {
                        addHabit(user.id, idea);
                        onRefreshData();
                      }
                    }}
                    className="w-full text-left text-xs p-2 bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-800 dark:hover:text-emerald-300 text-slate-700 dark:text-slate-300 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors flex items-center justify-between cursor-pointer"
                  >
                    <span>{idea}</span>
                    <Plus className="w-3 h-3 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
