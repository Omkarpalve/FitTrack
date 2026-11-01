import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  Calculator,
  Flame,
  Droplets,
  Dumbbell,
  Sun,
  Moon
} from 'lucide-react';
import { User, UserGoals, FitnessGoal } from '../types';
import { saveUserGoals, seedDemoData, ThemeMode } from '../utils/storage';

interface ProfileViewProps {
  user: User;
  goals: UserGoals;
  onRefreshData: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  goals,
  onRefreshData,
  theme = 'light',
  onToggleTheme
}) => {
  const [formData, setFormData] = useState<UserGoals>({ ...goals });
  const [saveSuccess, setSaveSuccess] = useState(false);

  // BMI Calculation
  const heightM = (formData.height || 175) / 100;
  const bmi = Math.round(((formData.weight || 70) / (heightM * heightM)) * 10) / 10;

  let bmiCategory = 'Normal Weight';
  let bmiColor = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800';
  if (bmi < 18.5) {
    bmiCategory = 'Underweight';
    bmiColor = 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800';
  } else if (bmi >= 25 && bmi < 30) {
    bmiCategory = 'Overweight';
    bmiColor = 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800';
  } else if (bmi >= 30) {
    bmiCategory = 'Obese Range';
    bmiColor = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800';
  }

  // Auto-calculate suggested macro benchmarks (Mifflin-St Jeor formula approximation)
  const handleAutoEstimate = () => {
    const bmr = 10 * formData.weight + 6.25 * formData.height - 5 * formData.age + 5;
    const tdee = Math.round(bmr * 1.4); // Moderate college activity

    let suggestedCals = tdee;
    let suggestedProtein = Math.round(formData.weight * 1.8);

    if (formData.fitnessGoal === 'weight_loss') {
      suggestedCals = Math.round(tdee - 450); // Mild 450 deficit
      suggestedProtein = Math.round(formData.weight * 2.0); // Higher protein in deficit
    } else if (formData.fitnessGoal === 'muscle_gain') {
      suggestedCals = Math.round(tdee + 350); // 350 surplus
      suggestedProtein = Math.round(formData.weight * 1.9);
    }

    setFormData(prev => ({
      ...prev,
      calorieTarget: suggestedCals,
      proteinTarget: suggestedProtein,
      waterTargetMl: Math.round(formData.weight * 40), // ~40ml/kg
      workoutTargetMins: 45
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveUserGoals(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
    onRefreshData();
  };

  const handleReloadDemo = () => {
    if (confirm('Reload realistic 14-day demo data? This will populate your calendar, streaks, and progress reports with complete student workout & meal records.')) {
      seedDemoData();
      onRefreshData();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase mb-1">
            <UserIcon className="w-3.5 h-3.5" />
            <span>Profile & Goal Settings</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            User Profile & Fitness Targets
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Configure biometric benchmarks, daily targets, and custom nutritional requirements.
          </p>
        </div>

        {/* Reload Demo Data button */}
        <button
          onClick={handleReloadDemo}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-xs font-semibold transition-colors cursor-pointer shrink-0"
          title="Reload pre-seeded 14-day demonstration data for presentation"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span>Reload Demo Data</span>
        </button>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>Profile parameters and daily goals saved successfully!</span>
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 transition-colors">
        
        {/* Appearance & Theme Setting */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <span>Appearance & Theme</span>
            <span className="text-xs font-normal text-slate-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </h2>

          <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div>
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">Application Theme</div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Switch between crisp light theme and eye-friendly dark mode</p>
            </div>
            <button
              type="button"
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-xs font-bold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors cursor-pointer shadow-xs"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Switch to Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-slate-600" />
                  <span>Switch to Dark</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section 1: Biometrics & Personal Details */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-slate-800 mb-4 flex items-center justify-between">
            <span>Biometric Information</span>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${bmiColor}`}>
              BMI: {bmi} ({bmiCategory})
            </div>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Display Name
              </label>
              <input 
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Age (years)
              </label>
              <input 
                type="number"
                min="14"
                max="100"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) || 21 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Height (cm)
              </label>
              <input 
                type="number"
                step="0.5"
                min="100"
                max="250"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: Number(e.target.value) || 170 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Body Weight (kg)
              </label>
              <input 
                type="number"
                step="0.1"
                min="30"
                max="250"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) || 65 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Fitness Strategy & Target Presets */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 mb-4">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">
              Primary Goal & Daily Targets
            </h2>
            <button
              type="button"
              onClick={handleAutoEstimate}
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 cursor-pointer self-start sm:self-auto"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Auto-Estimate Based on Biometrics</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            {(['weight_loss', 'maintenance', 'muscle_gain'] as FitnessGoal[]).map(goalKey => {
              const isSelected = formData.fitnessGoal === goalKey;
              const labels: Record<FitnessGoal, { title: string; desc: string }> = {
                weight_loss: { title: 'Weight Loss (Deficit)', desc: 'Caloric deficit to burn body fat' },
                maintenance: { title: 'Maintenance', desc: 'Maintain current body weight & energy' },
                muscle_gain: { title: 'Muscle Gain (Hypertrophy)', desc: 'Caloric surplus with high protein for muscle growth' }
              };
              return (
                <div
                  key={goalKey}
                  onClick={() => setFormData({ ...formData, fitnessGoal: goalKey })}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500' 
                      : 'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 dark:text-white">{labels[goalKey].title}</div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{labels[goalKey].desc}</p>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-500" />
                <span>Daily Calorie Target (kcal)</span>
              </label>
              <input 
                type="number"
                step="50"
                min="1000"
                max="6000"
                value={formData.calorieTarget}
                onChange={(e) => setFormData({ ...formData, calorieTarget: Number(e.target.value) || 2000 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold text-rose-600 dark:text-rose-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Daily Protein Target (g)</span>
              </label>
              <input 
                type="number"
                step="5"
                min="30"
                max="300"
                value={formData.proteinTarget}
                onChange={(e) => setFormData({ ...formData, proteinTarget: Number(e.target.value) || 100 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold text-amber-600 dark:text-amber-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-cyan-500" />
                <span>Daily Water Goal (ml)</span>
              </label>
              <input 
                type="number"
                step="250"
                min="500"
                max="8000"
                value={formData.waterTargetMl}
                onChange={(e) => setFormData({ ...formData, waterTargetMl: Number(e.target.value) || 3000 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold text-cyan-600 dark:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Dumbbell className="w-3.5 h-3.5 text-blue-500" />
                <span>Daily Workout Goal (mins)</span>
              </label>
              <input 
                type="number"
                step="5"
                min="10"
                max="180"
                value={formData.workoutTargetMins}
                onChange={(e) => setFormData({ ...formData, workoutTargetMins: Number(e.target.value) || 45 })}
                className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-bold text-blue-600 dark:text-blue-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                required
              />
            </div>
          </div>
        </div>

        {/* Nutritional & Medical Disclaimer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-600 dark:text-slate-400 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Advisory Note:</strong> Calorie and protein targets within FitTrack are user-configured benchmarks and fitness approximations. They do not constitute medical, clinical, or dietary prescriptions. Consult certified sports nutritionists or medical professionals for specialized dietary programs.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile & Targets</span>
          </button>
        </div>

      </form>

    </div>
  );
};
