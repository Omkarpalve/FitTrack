import React, { useEffect, useRef } from 'react';
import { 
  Flame, 
  Utensils, 
  Dumbbell, 
  Droplets, 
  Trophy, 
  Plus, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Clock,
  Footprints,
  CalendarCheck
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { User, UserGoals, FoodLog, WorkoutLog } from '../types';
import { 
  getFoodLogs, 
  getWorkoutLogs, 
  getWaterLogs, 
  addWater, 
  calculateStreaks, 
  shiftDate,
  parseDate,
  ThemeMode
} from '../utils/storage';
import { ActiveTab } from './Navbar';

interface DashboardViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  onNavigateTab: (tab: ActiveTab) => void;
  onRefreshData: () => void;
  theme?: ThemeMode;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  user,
  goals,
  selectedDate,
  onNavigateTab,
  onRefreshData,
  theme = 'light'
}) => {
  const chartCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Daily records
  const foodLogs = getFoodLogs(user.id, selectedDate);
  const workoutLogs = getWorkoutLogs(user.id, selectedDate);
  const waterToday = getWaterLogs(user.id, selectedDate);

  const totalCalories = Math.round(foodLogs.reduce((sum, f) => sum + f.calories, 0) * 10) / 10;
  const totalProtein = Math.round(foodLogs.reduce((sum, f) => sum + f.proteinG, 0) * 10) / 10;
  const totalWorkoutMins = workoutLogs.reduce((sum, w) => sum + w.durationMins, 0);
  const totalSteps = workoutLogs.reduce((sum, w) => sum + (w.steps || 0), 0);

  // Streaks
  const streakStats = calculateStreaks(user.id);

  // Calorie calculation
  const calsRemaining = Math.round((goals.calorieTarget - totalCalories) * 10) / 10;
  const isSurplus = calsRemaining < 0;

  // Protein calculation
  const proteinRemaining = Math.max(0, Math.round((goals.proteinTarget - totalProtein) * 10) / 10);
  const proteinPercent = Math.min(100, Math.round((totalProtein / (goals.proteinTarget || 1)) * 100));

  // Activity Completion Score
  const calScore = Math.min(100, Math.round((totalCalories / (goals.calorieTarget || 1)) * 100));
  const proScore = Math.min(100, Math.round((totalProtein / (goals.proteinTarget || 1)) * 100));
  const waterScore = Math.min(100, Math.round((waterToday / (goals.waterTargetMl || 1)) * 100));
  const workoutScore = Math.min(100, Math.round((totalWorkoutMins / (goals.workoutTargetMins || 1)) * 100));
  const overallScore = Math.min(100, Math.round((calScore + proScore + waterScore + workoutScore) / 4));

  const handleQuickWater = (amount: number) => {
    addWater(user.id, selectedDate, amount);
    onRefreshData();
  };

  // Build 7-day trend chart with dark-mode adaptive theme styling
  useEffect(() => {
    if (!chartCanvasRef.current) return;

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    const tooltipBg = isDark ? '#1e293b' : '#0f172a';

    const past7Dates: string[] = [];
    const calValues: number[] = [];
    const proteinValues: number[] = [];
    const workoutValues: number[] = [];
    const labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const d = shiftDate(selectedDate, -i);
      past7Dates.push(d);
      const dateObj = parseDate(d);
      labels.push(dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' }));

      const foods = getFoodLogs(user.id, d);
      const workouts = getWorkoutLogs(user.id, d);

      const dayCals = Math.round(foods.reduce((sum, f) => sum + f.calories, 0));
      const dayPro = Math.round(foods.reduce((sum, f) => sum + f.proteinG, 0));
      const dayWko = workouts.reduce((sum, w) => sum + w.durationMins, 0);

      calValues.push(dayCals);
      proteinValues.push(dayPro);
      workoutValues.push(dayWko);
    }

    const ctx = chartCanvasRef.current.getContext('2d');
    if (!ctx) return;

    chartInstanceRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Calories (kcal)',
            data: calValues,
            backgroundColor: 'rgba(239, 68, 68, 0.8)',
            borderRadius: 6,
            yAxisID: 'y'
          },
          {
            label: 'Protein (g)',
            data: proteinValues,
            backgroundColor: 'rgba(245, 158, 11, 0.85)',
            borderRadius: 6,
            yAxisID: 'y1'
          },
          {
            type: 'line',
            label: 'Workout (mins)',
            data: workoutValues,
            borderColor: '#3b82f6',
            backgroundColor: '#3b82f6',
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              boxWidth: 12,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: 500 },
              color: textColor
            }
          },
          tooltip: {
            backgroundColor: tooltipBg,
            padding: 10,
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 600 },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 }
          }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: {
              color: textColor,
              font: { family: 'Plus Jakarta Sans', size: 11 }
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'Calories (kcal)',
              color: '#ef4444',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 }
            },
            grid: { color: gridColor },
            ticks: { color: textColor }
          },
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: 'Protein (g) / Workout (min)',
              color: '#d97706',
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 600 }
            },
            grid: { drawOnChartArea: false },
            ticks: { color: textColor }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [selectedDate, user.id, foodLogs.length, workoutLogs.length, theme]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome & Quick Action Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Fitness Dashboard
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Hello, {goals.name || user.username}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Logging for <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedDate}</span> · Target: {goals.fitnessGoal.replace('_', ' ')}
          </p>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigateTab('food')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Food</span>
          </button>
          <button
            onClick={() => onNavigateTab('workouts')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Workout</span>
          </button>
          <button
            onClick={() => handleQuickWater(250)}
            className="flex items-center gap-1 px-3 py-2 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Add a glass of water"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>+250ml</span>
          </button>
          <button
            onClick={() => handleQuickWater(500)}
            className="flex items-center gap-1 px-3 py-2 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            title="Add a bottle of water"
          >
            <Droplets className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>+500ml</span>
          </button>
        </div>
      </div>

      {/* 4 Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Daily Calories */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Calories</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {totalCalories}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ {goals.calorieTarget} kcal</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${isSurplus ? 'bg-amber-500' : 'bg-rose-500'}`}
                style={{ width: `${Math.min(100, (totalCalories / (goals.calorieTarget || 1)) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-2.5">
              <span className={isSurplus ? 'text-amber-700 dark:text-amber-400 font-semibold' : 'text-slate-600 dark:text-slate-300 font-medium'}>
                {isSurplus 
                  ? `${Math.abs(calsRemaining)} kcal over target` 
                  : `${calsRemaining} kcal remaining`}
              </span>
              <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                {Math.round((totalCalories / (goals.calorieTarget || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 2. Daily Protein Intake */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Protein Intake</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {totalProtein}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ {goals.proteinTarget} g</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full rounded-full bg-amber-500 transition-all duration-300"
                style={{ width: `${proteinPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-2.5">
              <span className={proteinRemaining === 0 ? 'text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1' : 'text-slate-600 dark:text-slate-300 font-medium'}>
                {proteinRemaining === 0 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
                    Target achieved!
                  </>
                ) : (
                  `${proteinRemaining}g to reach goal`
                )}
              </span>
              <span className="text-slate-400 dark:text-slate-500 tabular-nums">{proteinPercent}%</span>
            </div>
          </div>
        </div>

        {/* 3. Water Intake */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Hydration</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {waterToday}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">/ {goals.waterTargetMl} ml</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-3">
              <div 
                className="h-full rounded-full bg-cyan-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (waterToday / (goals.waterTargetMl || 1)) * 100)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs mt-2.5">
              <span className="text-slate-600 dark:text-slate-300 font-medium">
                {Math.max(0, goals.waterTargetMl - waterToday)} ml remaining
              </span>
              <span className="text-slate-400 dark:text-slate-500 tabular-nums">
                {Math.round((waterToday / (goals.waterTargetMl || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* 4. Consistency Streak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Consistency Streak</span>
            <div className="w-8 h-8 rounded-lg bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white tabular-nums">
                {streakStats.currentStreak}
              </span>
              <span className="text-xs font-semibold text-orange-600 dark:text-orange-400">Days Active</span>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>Best Streak: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{streakStats.longestStreak}d</strong></span>
              <span>This Month: <strong className="text-slate-800 dark:text-slate-200 tabular-nums">{streakStats.activeDaysThisMonth}d</strong></span>
            </div>
          </div>
        </div>

      </div>

      {/* Daily Score & Weekly Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Daily Completion Score & Activity Summary */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Daily Activity Completion
              </h3>
              <span className="text-xs font-medium text-slate-400 dark:text-slate-500">
                Score Matrix
              </span>
            </div>

            {/* Circular / Big Metric Display */}
            <div className="flex flex-col items-center justify-center py-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 transition-colors">
              <div className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {overallScore}%
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {overallScore >= 80 
                  ? 'Excellent execution today!' 
                  : overallScore >= 50 
                    ? 'Good progress, keep going!' 
                    : 'Get started on your daily goals.'}
              </p>
            </div>

            {/* Mini Progress Bars for 4 Pillars */}
            <div className="space-y-3 mt-5">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Calorie Target</span>
                  <span className="tabular-nums">{calScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${calScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Protein Target</span>
                  <span className="tabular-nums">{proScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${proScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Water Target</span>
                  <span className="tabular-nums">{waterScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${waterScore}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-600 dark:text-slate-300 mb-1">
                  <span>Workout Time ({totalWorkoutMins}/{goals.workoutTargetMins}m)</span>
                  <span className="tabular-nums">{workoutScore}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full rounded-full" style={{ width: `${workoutScore}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-6 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Steps Logged:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
              <Footprints className="w-3.5 h-3.5 text-blue-500 dark:text-blue-400" />
              {totalSteps.toLocaleString()} steps
            </span>
          </div>
        </div>

        {/* Right Column: 7-Day Chart.js Trend */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Weekly Nutrition & Workout Volume
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visual trend across the past 7 days
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('reports')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Full Reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64 sm:h-72 w-full">
            <canvas ref={chartCanvasRef} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <span>Chart displays daily calories (red), protein (yellow), and active minutes (blue).</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">7-Day Consistency: {streakStats.weeklyConsistencyPercent}%</span>
          </div>
        </div>

      </div>

      {/* Two-Column Detail: Today's Meals & Workouts Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Today's Meals Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Utensils className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Meals Logged ({foodLogs.length})</h3>
            </div>
            <button
              onClick={() => onNavigateTab('food')}
              className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Food</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {foodLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              <p>No food recorded for this date.</p>
              <button 
                onClick={() => onNavigateTab('food')}
                className="mt-2 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                + Log First Meal
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {foodLogs.map(log => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{log.foodName}</div>
                    <div className="text-slate-400 dark:text-slate-500">
                      {log.mealType} · {log.quantityGrams}g
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">{log.calories} kcal</div>
                    <div className="text-amber-600 dark:text-amber-400 font-medium tabular-nums">{log.proteinG}g protein</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today's Workouts Summary */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Workouts & Activity ({workoutLogs.length})</h3>
            </div>
            <button
              onClick={() => onNavigateTab('workouts')}
              className="text-xs font-semibold text-blue-700 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Manage Workouts</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {workoutLogs.length === 0 ? (
            <div className="text-center py-8 text-slate-400 dark:text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
              <p>No workout sessions logged today.</p>
              <button 
                onClick={() => onNavigateTab('workouts')}
                className="mt-2 px-3 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                + Record Exercise
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-60 overflow-y-auto pr-1">
              {workoutLogs.map(log => (
                <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{log.exerciseName}</div>
                    <div className="text-slate-400 dark:text-slate-500">
                      {log.workoutType} · {log.sets ? `${log.sets} sets × ${log.reps} reps` : 'Session'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600 dark:text-blue-400 flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{log.durationMins} mins</span>
                    </div>
                    {log.steps && log.steps > 0 ? (
                      <div className="text-slate-500 dark:text-slate-400 tabular-nums">{log.steps.toLocaleString()} steps</div>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
