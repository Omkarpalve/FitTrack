import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Droplets, 
  Footprints, 
  Clock, 
  CheckCircle2, 
  Flame, 
  RotateCcw,
  Sparkles,
  Calendar
} from 'lucide-react';
import { User, UserGoals, WorkoutLog, WorkoutType } from '../types';
import { 
  getWorkoutLogs, 
  addWorkoutLog, 
  deleteWorkoutLog, 
  getWaterLogs, 
  addWater, 
  resetWater,
  shiftDate
} from '../utils/storage';

interface WorkoutTrackerViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  onRefreshData: () => void;
}

const COMMON_EXERCISES: Record<WorkoutType, string[]> = {
  'Strength Training': ['Barbell Bench Press', 'Squats', 'Deadlifts', 'Overhead Shoulder Press', 'Dumbbell Bicep Curls', 'Tricep Pushdowns', 'Lat Pulldowns', 'Incline Dumbbell Press'],
  'Cardio / Running': ['Outdoor 5km Run', 'Treadmill Jogging', 'Stationary Cycle', 'Rowing Machine', 'Jump Rope Intervals'],
  'Yoga & Stretching': ['Full Body Mobility Flow', 'Sun Salutations', 'Hamstring & Hip Openers', 'Post-Workout Cool Down'],
  'HIIT / Calisthenics': ['Push-ups & Pull-ups', 'Burpees & Mountain Climbers', 'Bodyweight HIIT Circuit', 'Plank Holds & Core Work'],
  'Walking': ['Campus Brisk Walk', 'Evening Post-Dinner Walk', 'Morning 10k Steps'],
  'Sports & Swimming': ['Freestyle Swimming 30 Laps', 'Basketball Pickup Game', 'Badminton Match', 'Football Drill']
};

export const WorkoutTrackerView: React.FC<WorkoutTrackerViewProps> = ({
  user,
  goals,
  selectedDate,
  onRefreshData
}) => {
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Strength Training');
  const [exerciseName, setExerciseName] = useState('');
  const [durationMins, setDurationMins] = useState<number>(45);
  const [sets, setSets] = useState<number>(3);
  const [reps, setReps] = useState<number>(10);
  const [steps, setSteps] = useState<number>(0);
  const [goalCompleted, setGoalCompleted] = useState<boolean>(true);

  // Custom water input
  const [customWater, setCustomWater] = useState<string>('');

  // Daily records
  const workouts = getWorkoutLogs(user.id, selectedDate);
  const waterToday = getWaterLogs(user.id, selectedDate);

  const totalMins = workouts.reduce((sum, w) => sum + w.durationMins, 0);
  const totalSteps = workouts.reduce((sum, w) => sum + (w.steps || 0), 0);
  const durationPercent = Math.min(100, Math.round((totalMins / (goals.workoutTargetMins || 1)) * 100));

  const handleAddWorkout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseName.trim()) return;

    addWorkoutLog({
      userId: user.id,
      date: selectedDate,
      workoutType,
      exerciseName: exerciseName.trim(),
      durationMins: durationMins || 30,
      sets: workoutType === 'Strength Training' || workoutType === 'HIIT / Calisthenics' ? sets : 0,
      reps: workoutType === 'Strength Training' || workoutType === 'HIIT / Calisthenics' ? reps : 0,
      steps: steps || 0,
      goalCompleted
    });

    setExerciseName('');
    onRefreshData();
  };

  const handleDeleteWorkout = (id: string) => {
    deleteWorkoutLog(id);
    onRefreshData();
  };

  const handleAddWater = (amount: number) => {
    addWater(user.id, selectedDate, amount);
    onRefreshData();
  };

  const handleCustomWaterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseInt(customWater);
    if (!isNaN(amt) && amt > 0) {
      addWater(user.id, selectedDate, amt);
      setCustomWater('');
      onRefreshData();
    }
  };

  const handleResetWater = () => {
    if (confirm('Reset today’s water log to 0 ml?')) {
      resetWater(user.id, selectedDate);
      onRefreshData();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 dark:text-blue-400 tracking-wide uppercase mb-1">
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Activity & Hydration Center</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Workout & Daily Activity Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Logging workouts, exercises, steps, and water for <strong className="text-slate-800 dark:text-slate-200">{selectedDate}</strong>
          </p>
        </div>

        {/* Quick summary strip */}
        <div className="flex items-center gap-4 text-xs">
          <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 rounded-lg font-medium">
            Daily Target: <strong>{goals.workoutTargetMins} mins</strong>
          </div>
          <div className="px-3 py-2 bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 text-cyan-800 dark:text-cyan-300 rounded-lg font-medium">
            Water Target: <strong>{goals.waterTargetMl} ml</strong>
          </div>
        </div>
      </div>

      {/* Snapshot Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Workout Duration Progress */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Workout Volume
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Target: {goals.workoutTargetMins} mins
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
              {totalMins}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">minutes logged</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${durationPercent}%` }}
            />
          </div>
          <div className="mt-2.5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>{workouts.length} exercise sessions logged</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{durationPercent}% achieved</span>
          </div>
        </div>

        {/* Water Intake Quick Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Hydration Level
            </span>
            <button 
              onClick={handleResetWater}
              className="text-[11px] text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              title="Reset today's water"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-600 dark:text-cyan-400 tabular-nums">
              {waterToday}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">/ {goals.waterTargetMl} ml</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full rounded-full bg-cyan-500 transition-all duration-300"
              style={{ width: `${Math.min(100, (waterToday / (goals.waterTargetMl || 1)) * 100)}%` }}
            />
          </div>
          <div className="mt-3 flex items-center gap-1.5">
            <button
              onClick={() => handleAddWater(250)}
              className="flex-1 py-1 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              +250ml
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="flex-1 py-1 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              +500ml
            </button>
            <button
              onClick={() => handleAddWater(1000)}
              className="flex-1 py-1 bg-cyan-50 dark:bg-cyan-950/60 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 text-cyan-800 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 rounded text-xs font-semibold transition-colors cursor-pointer"
            >
              +1000ml
            </button>
          </div>
        </div>

        {/* Steps & Activity Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs flex flex-col justify-between transition-colors">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Steps & Cardio
              </span>
              <Footprints className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
                {totalSteps.toLocaleString()}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">steps recorded</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
              Manually enter steps from your daily walking or jogging routines without requiring wearables or third-party APIs.
            </p>
          </div>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500">
            Est. Calories Burned: ~{Math.round(totalMins * 6.5 + totalSteps * 0.04)} kcal
          </div>
        </div>

      </div>

      {/* Main Grid: Add Workout Form + Workout Log History */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Log Workout Form */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white mb-3 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Record New Workout Session</span>
            </h2>

            <form onSubmit={handleAddWorkout} className="space-y-4">
              
              {/* Workout Type */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Workout Category
                </label>
                <select
                  value={workoutType}
                  onChange={(e) => {
                    const newType = e.target.value as WorkoutType;
                    setWorkoutType(newType);
                  }}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Strength Training">Strength Training (Gym / Weights)</option>
                  <option value="Cardio / Running">Cardio / Running / Cycling</option>
                  <option value="HIIT / Calisthenics">HIIT / Calisthenics / Bodyweight</option>
                  <option value="Yoga & Stretching">Yoga & Flexibility</option>
                  <option value="Walking">Walking / Steps</option>
                  <option value="Sports & Swimming">Sports & Swimming</option>
                </select>
              </div>

              {/* Quick Exercise Suggestions */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Quick Select or Type Exercise
                </label>
                <div className="flex flex-wrap gap-1 mb-2">
                  {COMMON_EXERCISES[workoutType]?.slice(0, 5).map(ex => (
                    <button
                      key={ex}
                      type="button"
                      onClick={() => setExerciseName(ex)}
                      className={`text-[11px] px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                        exerciseName === ex 
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800 font-semibold' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>

                <input 
                  type="text"
                  placeholder="e.g. Incline Bench Press or 5km Jog"
                  value={exerciseName}
                  onChange={(e) => setExerciseName(e.target.value)}
                  className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  required
                />
              </div>

              {/* Duration and Steps */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Duration (Minutes)
                  </label>
                  <input 
                    type="number"
                    min="1"
                    max="360"
                    value={durationMins}
                    onChange={(e) => setDurationMins(Number(e.target.value) || 0)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tabular-nums"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Steps Walked (optional)
                  </label>
                  <input 
                    type="number"
                    min="0"
                    placeholder="0"
                    value={steps || ''}
                    onChange={(e) => setSteps(Number(e.target.value) || 0)}
                    className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tabular-nums"
                  />
                </div>
              </div>

              {/* Sets and Reps (for strength/HIIT) */}
              {(workoutType === 'Strength Training' || workoutType === 'HIIT / Calisthenics') && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sets Count
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="30"
                      value={sets}
                      onChange={(e) => setSets(Number(e.target.value) || 0)}
                      className="w-full text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tabular-nums"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Reps per Set
                    </label>
                    <input 
                      type="number"
                      min="1"
                      max="100"
                      value={reps}
                      onChange={(e) => setReps(Number(e.target.value) || 0)}
                      className="w-full text-xs bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium tabular-nums"
                    />
                  </div>
                </div>
              )}

              {/* Daily Workout Goal Completed Checkbox */}
              <div className="flex items-center gap-2 p-2.5 bg-blue-50/50 dark:bg-blue-950/40 rounded-lg border border-blue-100 dark:border-blue-900/60">
                <input 
                  type="checkbox"
                  id="goalCompleted"
                  checked={goalCompleted}
                  onChange={(e) => setGoalCompleted(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 dark:border-slate-600 focus:ring-blue-500 cursor-pointer"
                />
                <label htmlFor="goalCompleted" className="text-xs font-semibold text-blue-900 dark:text-blue-300 cursor-pointer">
                  Mark daily workout target as achieved for this session
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save Workout Record</span>
              </button>
            </form>
          </div>

          {/* Custom Water Logger */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
            <span className="text-xs font-bold text-slate-900 dark:text-white block mb-2">
              Log Custom Water Amount
            </span>
            <form onSubmit={handleCustomWaterSubmit} className="flex gap-2">
              <input 
                type="number"
                placeholder="e.g. 750 (ml)"
                value={customWater}
                onChange={(e) => setCustomWater(e.target.value)}
                className="flex-1 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 font-medium tabular-nums"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                + Add Water
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Workouts Logged for Selected Date */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Sessions for {selectedDate}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {workouts.length} workout logs recorded
                </p>
              </div>
              <div className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                Total Duration: {totalMins} mins
              </div>
            </div>

            {workouts.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <Dumbbell className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-medium text-slate-600 dark:text-slate-300">No workout records logged for this date.</p>
                <p className="mt-0.5 text-slate-400 dark:text-slate-500">Fill out the workout form on the left to track your training.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Type</th>
                      <th className="py-2.5 px-3">Exercise / Routine</th>
                      <th className="py-2.5 px-3 text-right">Duration</th>
                      <th className="py-2.5 px-3 text-right">Sets × Reps</th>
                      <th className="py-2.5 px-3 text-right">Steps</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {workouts.map(w => (
                      <tr key={w.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded text-[11px]">
                            {w.workoutType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {w.exerciseName}
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                          {w.durationMins} min
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular-nums">
                          {w.sets && w.sets > 0 ? `${w.sets} × ${w.reps}` : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular-nums">
                          {w.steps && w.steps > 0 ? w.steps.toLocaleString() : '—'}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeleteWorkout(w.id)}
                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
                            title="Delete workout entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 font-bold text-slate-900 dark:text-white">
                      <td colSpan={2} className="py-3 px-3">
                        Total Activity for Day
                      </td>
                      <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400 tabular-nums">
                        {totalMins} min
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400 font-medium">
                        —
                      </td>
                      <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200 tabular-nums">
                        {totalSteps.toLocaleString()} steps
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Beginner Student Tip */}
            <div className="mt-6 p-4 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-xl text-xs">
              <div className="font-bold text-blue-900 dark:text-blue-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>Student Workout Recommendation</span>
              </div>
              <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                Consistency trumps extreme workouts. Aiming for 30–45 minutes of moderate physical activity 4 to 5 days a week improves focus, cognitive retention during study sessions, and cardiovascular fitness.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
