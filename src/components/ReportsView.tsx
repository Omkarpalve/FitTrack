import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Flame, 
  Dumbbell, 
  Utensils, 
  Calendar, 
  Award, 
  ArrowUpRight,
  Sparkles
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { User, UserGoals } from '../types';
import { 
  getFoodLogs, 
  getWorkoutLogs, 
  shiftDate, 
  parseDate, 
  getTodayString,
  ThemeMode 
} from '../utils/storage';

interface ReportsViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  theme?: ThemeMode;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  user,
  goals,
  selectedDate,
  theme = 'light'
}) => {
  const [rangeDays, setRangeDays] = useState<7 | 14 | 30>(14);

  const calChartRef = useRef<HTMLCanvasElement | null>(null);
  const calChartInstance = useRef<Chart | null>(null);

  const proteinChartRef = useRef<HTMLCanvasElement | null>(null);
  const proteinChartInstance = useRef<Chart | null>(null);

  const workoutChartRef = useRef<HTMLCanvasElement | null>(null);
  const workoutChartInstance = useRef<Chart | null>(null);

  // Compute stats across selected date range
  const dates: string[] = [];
  const labels: string[] = [];
  const calData: number[] = [];
  const proteinData: number[] = [];
  const workoutData: number[] = [];

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = shiftDate(selectedDate, -i);
    dates.push(d);
    const dObj = parseDate(d);
    labels.push(dObj.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' }));

    const foods = getFoodLogs(user.id, d);
    const workouts = getWorkoutLogs(user.id, d);

    const cals = Math.round(foods.reduce((sum, f) => sum + f.calories, 0));
    const protein = Math.round(foods.reduce((sum, f) => sum + f.proteinG, 0) * 10) / 10;
    const wMins = workouts.reduce((sum, w) => sum + w.durationMins, 0);

    calData.push(cals);
    proteinData.push(protein);
    workoutData.push(wMins);
  }

  // Summary statistics
  const nonZeroCals = calData.filter(c => c > 0);
  const avgCals = nonZeroCals.length > 0 ? Math.round(nonZeroCals.reduce((a, b) => a + b, 0) / nonZeroCals.length) : 0;

  const nonZeroProtein = proteinData.filter(p => p > 0);
  const avgProtein = nonZeroProtein.length > 0 ? Math.round((nonZeroProtein.reduce((a, b) => a + b, 0) / nonZeroProtein.length) * 10) / 10 : 0;

  const totalWorkoutMins = workoutData.reduce((a, b) => a + b, 0);
  const activeWorkoutDays = workoutData.filter(w => w > 0).length;

  const activeDays = dates.filter((_, i) => calData[i] > 0 || workoutData[i] > 0).length;
  const consistencyPercent = Math.round((activeDays / rangeDays) * 100);

  // Render Charts with Chart.js and dark mode adaptation
  useEffect(() => {
    const isDark = theme === 'dark' || document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    const targetLineColor = isDark ? '#64748b' : '#94a3b8';

    // 1. Calorie Chart
    if (calChartRef.current) {
      if (calChartInstance.current) calChartInstance.current.destroy();
      const ctx = calChartRef.current.getContext('2d');
      if (ctx) {
        calChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels,
            datasets: [
              {
                label: 'Calorie Intake (kcal)',
                data: calData,
                borderColor: '#ef4444',
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2.5,
                fill: true,
                tension: 0.35,
                pointBackgroundColor: '#ef4444',
                pointRadius: 3
              },
              {
                label: `Goal Target (${goals.calorieTarget} kcal)`,
                data: dates.map(() => goals.calorieTarget),
                borderColor: targetLineColor,
                borderWidth: 1.5,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: { family: 'Plus Jakarta Sans', size: 11 }
                }
              }
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
              },
              y: { 
                grid: { color: gridColor },
                ticks: { color: textColor },
                title: { display: true, text: 'kcal', color: textColor }
              }
            }
          }
        });
      }
    }

    // 2. Protein Chart
    if (proteinChartRef.current) {
      if (proteinChartInstance.current) proteinChartInstance.current.destroy();
      const ctx = proteinChartRef.current.getContext('2d');
      if (ctx) {
        proteinChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Protein Consumed (g)',
                data: proteinData,
                backgroundColor: '#f59e0b',
                borderRadius: 4
              },
              {
                type: 'line',
                label: `Target (${goals.proteinTarget}g)`,
                data: dates.map(() => goals.proteinTarget),
                borderColor: isDark ? '#fbbf24' : '#b45309',
                borderWidth: 1.5,
                borderDash: [4, 4],
                pointRadius: 0
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: { family: 'Plus Jakarta Sans', size: 11 }
                }
              }
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
              },
              y: { 
                grid: { color: gridColor },
                ticks: { color: textColor },
                title: { display: true, text: 'grams', color: textColor }
              }
            }
          }
        });
      }
    }

    // 3. Workout Volume Chart
    if (workoutChartRef.current) {
      if (workoutChartInstance.current) workoutChartInstance.current.destroy();
      const ctx = workoutChartRef.current.getContext('2d');
      if (ctx) {
        workoutChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: 'Workout Minutes',
                data: workoutData,
                backgroundColor: isDark ? '#3b82f6' : 'rgba(37, 99, 235, 0.85)',
                borderRadius: 4
              }
            ]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  color: textColor,
                  font: { family: 'Plus Jakarta Sans', size: 11 }
                }
              }
            },
            scales: {
              x: { 
                grid: { display: false },
                ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
              },
              y: { 
                grid: { color: gridColor },
                ticks: { color: textColor },
                title: { display: true, text: 'minutes', color: textColor }
              }
            }
          }
        });
      }
    }

    return () => {
      if (calChartInstance.current) calChartInstance.current.destroy();
      if (proteinChartInstance.current) proteinChartInstance.current.destroy();
      if (workoutChartInstance.current) workoutChartInstance.current.destroy();
    };
  }, [rangeDays, selectedDate, user.id, theme]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Range Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase mb-1">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Analytical Reports</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Progress Reports & Trend Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Statistical aggregation over {rangeDays} days leading to <strong className="text-slate-800 dark:text-slate-200">{selectedDate}</strong>
          </p>
        </div>

        {/* Segmented Range Control */}
        <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-semibold">
          {[7, 14, 30].map(days => (
            <button
              key={days}
              onClick={() => setRangeDays(days as any)}
              className={`px-3 py-1.5 rounded-md transition-colors cursor-pointer ${
                rangeDays === days 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Avg Daily Calories
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-rose-600 dark:text-rose-400 tabular-nums">
              {avgCals}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kcal/day</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            Target: {goals.calorieTarget} kcal ({Math.round((avgCals / (goals.calorieTarget || 1)) * 100)}%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Avg Daily Protein
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
              {avgProtein}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">g/day</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            Target: {goals.proteinTarget}g ({Math.round((avgProtein / (goals.proteinTarget || 1)) * 100)}%)
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Total Workout Volume
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
              {totalWorkoutMins}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">mins total</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            Across {activeWorkoutDays} exercise sessions
          </span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Period Consistency
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {consistencyPercent}%
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">active</span>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500 mt-1 block">
            {activeDays} of {rangeDays} days logged
          </span>
        </div>

      </div>

      {/* Visual Chart Row 1: Calories and Protein */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Calorie Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Caloric Intake History
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily calories versus personal deficit/surplus goal line
              </p>
            </div>
            <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded">
              Avg: {avgCals} kcal
            </span>
          </div>
          <div className="h-64 w-full">
            <canvas ref={calChartRef} />
          </div>
        </div>

        {/* Protein Trend Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Protein Intake Trend (g)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Daily protein grams compared to your {goals.proteinTarget}g target
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded">
              Avg: {avgProtein}g
            </span>
          </div>
          <div className="h-64 w-full">
            <canvas ref={proteinChartRef} />
          </div>
        </div>

      </div>

      {/* Visual Chart Row 2: Workout Duration */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Workout Duration Trend (Minutes per Day)
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Consistent physical activity duration across the selected evaluation window
            </p>
          </div>
          <span className="text-xs font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded">
            Total Volume: {totalWorkoutMins} mins
          </span>
        </div>
        <div className="h-56 w-full">
          <canvas ref={workoutChartRef} />
        </div>
      </div>

    </div>
  );
};
