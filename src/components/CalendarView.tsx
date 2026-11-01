import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Flame, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  Info
} from 'lucide-react';
import { User, UserGoals, DayRecordSummary } from '../types';
import { 
  getMonthSummary, 
  formatDate, 
  parseDate, 
  getTodayString,
  getFoodLogs,
  getWorkoutLogs,
  getWaterLogs
} from '../utils/storage';
import { ActiveTab } from './Navbar';

interface CalendarViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  onDateChange: (date: string) => void;
  onNavigateTab: (tab: ActiveTab) => void;
  onRefreshData: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  user,
  goals,
  selectedDate,
  onDateChange,
  onNavigateTab,
  onRefreshData
}) => {
  const today = getTodayString();
  const selectedDateObj = parseDate(selectedDate);

  const [currentYear, setCurrentYear] = useState<number>(selectedDateObj.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(selectedDateObj.getMonth() + 1); // 1-12

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth() + 1);
    onDateChange(today);
  };

  // Month summary records
  const monthSummary = getMonthSummary(user.id, currentYear, currentMonth);

  // Calculate days in month and starting weekday
  const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 for Sunday
  const totalDaysInMonth = new Date(currentYear, currentMonth, 0).getDate();

  // Days in previous month for leading padding
  const totalDaysInPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

  const monthName = firstDayOfMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Selected date details
  const selectedFoods = getFoodLogs(user.id, selectedDate);
  const selectedWorkouts = getWorkoutLogs(user.id, selectedDate);
  const selectedWater = getWaterLogs(user.id, selectedDate);
  const selectedSummary = monthSummary[selectedDate] || {
    date: selectedDate,
    calories: 0,
    protein: 0,
    water: selectedWater,
    workoutMins: 0,
    workoutCount: 0,
    habitsCompleted: 0,
    totalHabits: 4,
    status: 'rest_day'
  };

  // Render calendar grid days
  const calendarCells = [];

  // 1. Previous month trailing days
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const prevDayNum = totalDaysInPrevMonth - i;
    const prevMonthNum = currentMonth === 1 ? 12 : currentMonth - 1;
    const prevYearNum = currentMonth === 1 ? currentYear - 1 : currentYear;
    const dStr = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(prevDayNum).padStart(2, '0')}`;
    calendarCells.push({
      dateStr: dStr,
      dayNum: prevDayNum,
      isCurrentMonth: false,
      summary: monthSummary[dStr]
    });
  }

  // 2. Current month days
  for (let day = 1; day <= totalDaysInMonth; day++) {
    const dStr = `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    calendarCells.push({
      dateStr: dStr,
      dayNum: day,
      isCurrentMonth: true,
      summary: monthSummary[dStr]
    });
  }

  // 3. Next month leading days to complete full grid
  const remainingCells = (7 - (calendarCells.length % 7)) % 7;
  for (let i = 1; i <= remainingCells; i++) {
    const nextMonthNum = currentMonth === 12 ? 1 : currentMonth + 1;
    const nextYearNum = currentMonth === 12 ? currentYear + 1 : currentYear;
    const dStr = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    calendarCells.push({
      dateStr: dStr,
      dayNum: i,
      isCurrentMonth: false,
      summary: monthSummary[dStr]
    });
  }

  // Monthly stats count
  const activeDaysCount = Object.values(monthSummary).filter(s => s.status === 'met_all' || s.status === 'partially_active').length;
  const goalMetDaysCount = Object.values(monthSummary).filter(s => s.status === 'met_all').length;

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Month Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase mb-1">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Interactive Fitness Calendar</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Monthly Progress & History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Click any calendar day to inspect nutritional logs or backfill workout records.
          </p>
        </div>

        {/* Month Stepper */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="px-4 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-sm font-bold min-w-[170px] text-center shadow-xs">
            {monthName}
          </div>
          <button
            onClick={handleNextMonth}
            className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleJumpToToday}
            className="px-3 py-2 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Jump to Today
          </button>
        </div>
      </div>

      {/* Monthly Statistics Summary Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs transition-colors">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{goalMetDaysCount} Goals Met Days</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0"></span>
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{activeDaysCount - goalMetDaysCount} Partially Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-200 dark:bg-slate-700 shrink-0"></span>
            <span className="text-slate-500 dark:text-slate-400 font-medium">Rest / Inactive Days</span>
          </div>
        </div>

        <div className="text-slate-500 dark:text-slate-400">
          Selected Date: <strong className="text-slate-800 dark:text-slate-200 font-bold">{selectedDate}</strong>
        </div>
      </div>

      {/* Calendar Grid & Selected Day Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Month Calendar */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            <div className="py-2 text-rose-500 dark:text-rose-400">Sun</div>
            <div className="py-2">Mon</div>
            <div className="py-2">Tue</div>
            <div className="py-2">Wed</div>
            <div className="py-2">Thu</div>
            <div className="py-2">Fri</div>
            <div className="py-2 text-blue-500 dark:text-blue-400">Sat</div>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarCells.map((cell, idx) => {
              const isSelected = cell.dateStr === selectedDate;
              const isTodayCell = cell.dateStr === today;
              const status = cell.summary?.status;

              let statusBorder = 'border-slate-100 dark:border-slate-800';
              let statusBg = 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/60';

              if (status === 'met_all') {
                statusBg = 'bg-emerald-50/70 dark:bg-emerald-950/40 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/50';
                statusBorder = 'border-emerald-200 dark:border-emerald-800/60';
              } else if (status === 'partially_active') {
                statusBg = 'bg-amber-50/70 dark:bg-amber-950/40 hover:bg-amber-100/70 dark:hover:bg-amber-900/50';
                statusBorder = 'border-amber-200 dark:border-amber-800/60';
              }

              if (isSelected) {
                statusBorder = 'ring-2 ring-emerald-600 dark:ring-emerald-500 border-emerald-600 dark:border-emerald-500';
              }

              return (
                <div
                  key={idx}
                  onClick={() => onDateChange(cell.dateStr)}
                  className={`min-h-[82px] sm:min-h-[92px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${statusBg} ${statusBorder} ${
                    !cell.isCurrentMonth ? 'opacity-35' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span 
                      className={`text-xs font-bold tabular-nums rounded-full w-5 h-5 flex items-center justify-center ${
                        isTodayCell 
                          ? 'bg-emerald-600 text-white shadow-xs' 
                          : isSelected 
                            ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                            : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {cell.dayNum}
                    </span>

                    {status === 'met_all' && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </div>

                  {/* Badges on cell */}
                  <div className="space-y-1 mt-1">
                    {cell.summary && cell.summary.calories > 0 && (
                      <div className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50/90 dark:bg-rose-950/60 rounded px-1 py-0.5 truncate tabular-nums">
                        🔥 {cell.summary.calories} kcal
                      </div>
                    )}
                    {cell.summary && cell.summary.workoutMins > 0 && (
                      <div className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50/90 dark:bg-blue-950/60 rounded px-1 py-0.5 truncate tabular-nums">
                        🏋️ {cell.summary.workoutMins}m
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right Column: Day Inspector & Activity Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Day Inspector
              </h2>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {selectedDate}
              </span>
            </div>

            {/* Status overview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 mb-4 text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-slate-500 dark:text-slate-400">Day Status:</span>
                <span className="font-bold uppercase text-[11px] text-slate-800 dark:text-slate-200">
                  {selectedSummary.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Total Hydration:</span>
                <span className="font-semibold text-cyan-700 dark:text-cyan-300 tabular-nums">
                  {selectedWater} ml
                </span>
              </div>
            </div>

            {/* Nutrition Breakdown for selected day */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Utensils className="w-3.5 h-3.5 text-rose-500" />
                  Calories:
                </span>
                <span className="font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                  {selectedSummary.calories} / {goals.calorieTarget} kcal
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  Protein:
                </span>
                <span className="font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                  {selectedSummary.protein} / {goals.proteinTarget} g
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-medium">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                  Exercise Duration:
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {selectedSummary.workoutMins} / {goals.workoutTargetMins} mins
                </span>
              </div>
            </div>

            {/* List of meals on that day */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Logged Meals ({selectedFoods.length})
                </span>
                <button
                  onClick={() => onNavigateTab('food')}
                  className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:underline cursor-pointer"
                >
                  + Add Food
                </button>
              </div>

              {selectedFoods.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-xs italic py-2">No meals logged for this date.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedFoods.map(f => (
                    <div key={f.id} className="text-xs p-1.5 bg-slate-50 dark:bg-slate-800/70 rounded border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{f.foodName}</span>
                      <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">{f.calories} kcal</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* List of workouts on that day */}
            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 mt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Logged Workouts ({selectedWorkouts.length})
                </span>
                <button
                  onClick={() => onNavigateTab('workouts')}
                  className="text-[11px] font-semibold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                >
                  + Add Workout
                </button>
              </div>

              {selectedWorkouts.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-500 text-xs italic py-2">No workouts logged for this date.</p>
              ) : (
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {selectedWorkouts.map(w => (
                    <div key={w.id} className="text-xs p-1.5 bg-slate-50 dark:bg-slate-800/70 rounded border border-slate-100 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[140px]">{w.exerciseName}</span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 tabular-nums">{w.durationMins}m</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Direct jump buttons */}
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
              <button
                onClick={() => onNavigateTab('food')}
                className="py-1.5 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Log Food
              </button>
              <button
                onClick={() => onNavigateTab('workouts')}
                className="py-1.5 bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-800 dark:text-blue-300 rounded-lg text-xs font-semibold text-center transition-colors cursor-pointer"
              >
                Log Exercise
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
