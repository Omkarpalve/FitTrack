import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  Flame, 
  Utensils, 
  Sparkles, 
  Info
} from 'lucide-react';
import { User, UserGoals, FoodLog, MealType, FoodItem } from '../types';
import { PREDEFINED_FOODS } from '../data/predefinedFoods';
import { getFoodLogs, addFoodLog, deleteFoodLog } from '../utils/storage';

interface FoodTrackerViewProps {
  user: User;
  goals: UserGoals;
  selectedDate: string;
  onRefreshData: () => void;
}

export const FoodTrackerView: React.FC<FoodTrackerViewProps> = ({
  user,
  goals,
  selectedDate,
  onRefreshData
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // Custom Food Form State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedPredefined, setSelectedPredefined] = useState<FoodItem | null>(PREDEFINED_FOODS[0]);
  const [quantityGrams, setQuantityGrams] = useState<number>(100);
  const [mealType, setMealType] = useState<MealType>('Lunch');
  
  // Manual custom food inputs
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [customProtein, setCustomProtein] = useState('');

  const [activeMealFilter, setActiveMealFilter] = useState<'All' | MealType>('All');

  // Logs for current selected date
  const foodLogs = getFoodLogs(user.id, selectedDate);
  const filteredLogs = activeMealFilter === 'All' 
    ? foodLogs 
    : foodLogs.filter(l => l.mealType === activeMealFilter);

  // Calculations
  const totalCalories = Math.round(foodLogs.reduce((sum, f) => sum + f.calories, 0) * 10) / 10;
  const totalProtein = Math.round(foodLogs.reduce((sum, f) => sum + f.proteinG, 0) * 10) / 10;

  const calRemaining = Math.round((goals.calorieTarget - totalCalories) * 10) / 10;
  const isCalSurplus = calRemaining < 0;

  const proteinRemaining = Math.max(0, Math.round((goals.proteinTarget - totalProtein) * 10) / 10);
  const proteinPercent = Math.min(100, Math.round((totalProtein / (goals.proteinTarget || 1)) * 100));

  // Category list
  const categories = ['All', 'Protein', 'Carbs', 'Dairy', 'Fruits & Veggies', 'Fats & Nuts'];

  const filteredFoods = PREDEFINED_FOODS.filter(item => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  // Calculate live preview
  let previewCalories = 0;
  let previewProtein = 0;

  if (isCustomMode) {
    previewCalories = parseFloat(customCalories) || 0;
    previewProtein = parseFloat(customProtein) || 0;
  } else if (selectedPredefined) {
    previewCalories = Math.round(((selectedPredefined.caloriesPer100g / 100) * quantityGrams) * 10) / 10;
    previewProtein = Math.round(((selectedPredefined.proteinPer100g / 100) * quantityGrams) * 10) / 10;
  }

  const handleLogFood = (e: React.FormEvent) => {
    e.preventDefault();

    if (isCustomMode) {
      if (!customName.trim()) return;
      addFoodLog({
        userId: user.id,
        date: selectedDate,
        foodName: customName.trim(),
        quantityGrams: quantityGrams || 100,
        calories: parseFloat(customCalories) || 0,
        proteinG: parseFloat(customProtein) || 0,
        mealType
      });
      setCustomName('');
      setCustomCalories('');
      setCustomProtein('');
    } else if (selectedPredefined) {
      addFoodLog({
        userId: user.id,
        date: selectedDate,
        foodName: selectedPredefined.name,
        quantityGrams: quantityGrams,
        calories: previewCalories,
        proteinG: previewProtein,
        mealType
      });
    }

    onRefreshData();
  };

  const handleDeleteLog = (id: string) => {
    deleteFoodLog(id);
    onRefreshData();
  };

  const handleQuickPortion = (grams: number) => {
    setQuantityGrams(grams);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 tracking-wide uppercase mb-1">
            <Utensils className="w-3.5 h-3.5" />
            <span>Nutrition Engine</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Daily Calorie & Protein Tracker
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Logging entries for date: <strong className="text-slate-800 dark:text-slate-200">{selectedDate}</strong>
          </p>
        </div>

        {/* Informational banner about approximate values */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-lg text-xs text-slate-600 dark:text-slate-300 max-w-sm">
          <Info className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
          <span>Nutritional values are clearly labeled approximations based on standard nutritional databases for fitness estimation.</span>
        </div>
      </div>

      {/* Target Progress Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Calories Goal Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Calorie Target Balance
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Goal: {goals.calorieTarget} kcal
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {totalCalories}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">kcal consumed</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className={`h-full rounded-full transition-all duration-300 ${isCalSurplus ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${Math.min(100, (totalCalories / (goals.calorieTarget || 1)) * 100)}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className={isCalSurplus ? 'text-amber-700 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-300 font-medium'}>
              {isCalSurplus 
                ? `Exceeding target by ${Math.abs(calRemaining)} kcal`
                : `${calRemaining} kcal remaining today`}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {Math.round((totalCalories / (goals.calorieTarget || 1)) * 100)}% of budget
            </span>
          </div>
        </div>

        {/* Protein Target Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Protein Intake Goal
            </span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Goal: {goals.proteinTarget} g
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white tabular-nums">
              {totalProtein}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">grams consumed</span>
          </div>

          <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mt-3">
            <div 
              className="h-full rounded-full bg-amber-500 transition-all duration-300"
              style={{ width: `${proteinPercent}%` }}
            />
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs">
            <span className={proteinRemaining === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1' : 'text-slate-600 dark:text-slate-300 font-medium'}>
              {proteinRemaining === 0 ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 inline text-emerald-600 dark:text-emerald-400" />
                  Target fully reached!
                </>
              ) : (
                `${proteinRemaining}g needed to hit target`
              )}
            </span>
            <span className="text-slate-400 dark:text-slate-500 font-medium">
              {proteinPercent}% achieved
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Add Food Form + Daily Log Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Food Logging Form & Predefined Library */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            
            {/* Form Mode Toggle */}
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Log Food Entry
              </h2>
              <div className="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setIsCustomMode(false)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    !isCustomMode ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  From Food Library
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomMode(true)}
                  className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                    isCustomMode ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Custom Item
                </button>
              </div>
            </div>

            <form onSubmit={handleLogFood} className="space-y-4">
              
              {!isCustomMode ? (
                <>
                  {/* Predefined Food Selection */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Choose Predefined Food
                    </label>
                    <select
                      value={selectedPredefined?.id || ''}
                      onChange={(e) => {
                        const found = PREDEFINED_FOODS.find(f => f.id === e.target.value) || null;
                        setSelectedPredefined(found);
                        if (found) {
                          setQuantityGrams(found.defaultServingGrams);
                        }
                      }}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {PREDEFINED_FOODS.map(food => (
                        <option key={food.id} value={food.id}>
                          {food.name} ({food.caloriesPer100g} kcal / 100g, {food.proteinPer100g}g protein)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quantity in Grams with Quick Portion Chips */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Serving Quantity (grams)
                      </label>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500">
                        Default: {selectedPredefined?.servingUnit}
                      </span>
                    </div>
                    <input 
                      type="number"
                      min="1"
                      max="2000"
                      value={quantityGrams}
                      onChange={(e) => setQuantityGrams(Number(e.target.value) || 0)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                      required
                    />

                    {/* Quick Portion Buttons */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">Quick:</span>
                      {[50, 100, 150, 200, 250].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleQuickPortion(amt)}
                          className={`px-2 py-0.5 rounded text-[11px] font-medium border cursor-pointer ${
                            quantityGrams === amt 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' 
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }`}
                        >
                          {amt}g
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Custom Food Name */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Food / Recipe Name
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. Grandma's Lentil Soup"
                      value={customName}
                      onChange={(e) => setCustomName(e.target.value)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                      required
                    />
                  </div>

                  {/* Quantity and Serving */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Approximate Weight (grams)
                    </label>
                    <input 
                      type="number"
                      min="1"
                      value={quantityGrams}
                      onChange={(e) => setQuantityGrams(Number(e.target.value) || 100)}
                      className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium tabular-nums"
                      required
                    />
                  </div>

                  {/* Custom Calories & Protein */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Calories (kcal)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        placeholder="e.g. 250"
                        value={customCalories}
                        onChange={(e) => setCustomCalories(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium tabular-nums"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Protein (grams)
                      </label>
                      <input 
                        type="number"
                        step="0.1"
                        placeholder="e.g. 15"
                        value={customProtein}
                        onChange={(e) => setCustomProtein(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg p-2.5 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium tabular-nums"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Meal Type Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Meal Category
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['Breakfast', 'Lunch', 'Dinner', 'Snack'] as MealType[]).map(meal => (
                    <button
                      key={meal}
                      type="button"
                      onClick={() => setMealType(meal)}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        mealType === meal 
                          ? 'bg-emerald-600 text-white border-emerald-600 font-semibold shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {meal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Automatic Calculation Preview Box */}
              <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 font-medium block">Calculated Totals</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {quantityGrams}g portion
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-rose-600 dark:text-rose-400 font-bold tabular-nums">
                    {previewCalories} kcal
                  </div>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold tabular-nums">
                    {previewProtein}g protein
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Food Log</span>
              </button>
            </form>

          </div>

          {/* Quick Predefined Reference Cards */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 shadow-xs transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                Quick Food Database Reference
              </span>
              <span className="text-[11px] text-slate-400 dark:text-slate-500">Values per 100g</span>
            </div>

            {/* Category Filter Chips */}
            <div className="flex gap-1 overflow-x-auto pb-2 mb-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap cursor-pointer transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
              {filteredFoods.slice(0, 8).map(food => (
                <div 
                  key={food.id}
                  onClick={() => {
                    setIsCustomMode(false);
                    setSelectedPredefined(food);
                    setQuantityGrams(food.defaultServingGrams);
                  }}
                  className="p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div>
                    <div className="font-semibold text-slate-800 dark:text-slate-200">{food.name}</div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">{food.category}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-rose-600 dark:text-rose-400 tabular-nums">{food.caloriesPer100g} kcal</span>
                    <span className="mx-1 text-slate-300 dark:text-slate-600">·</span>
                    <span className="font-semibold text-amber-600 dark:text-amber-400 tabular-nums">{food.proteinPer100g}g P</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Logged Items for Selected Date */}
        <div className="lg:col-span-7">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition-colors">
            
            {/* Header & Meal Filter Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Recorded Foods for {selectedDate}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {foodLogs.length} total entries logged
                </p>
              </div>

              {/* Segmented Filter */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs">
                {(['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack'] as const).map(filter => (
                  <button
                    key={filter}
                    onClick={() => setActiveMealFilter(filter)}
                    className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                      activeMealFilter === filter 
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* Food Logs Table */}
            {filteredLogs.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500 text-xs bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
                <Utensils className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                <p className="font-medium text-slate-600 dark:text-slate-300">No food items recorded for this filter.</p>
                <p className="mt-0.5 text-slate-400 dark:text-slate-500">Select an item from the left panel to log your meal.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold">
                      <th className="py-2.5 px-3">Meal</th>
                      <th className="py-2.5 px-3">Food Item</th>
                      <th className="py-2.5 px-3 text-right">Quantity</th>
                      <th className="py-2.5 px-3 text-right">Calories</th>
                      <th className="py-2.5 px-3 text-right">Protein</th>
                      <th className="py-2.5 px-3 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-2.5 px-3">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                            {log.mealType}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">
                          {log.foodName}
                        </td>
                        <td className="py-2.5 px-3 text-right text-slate-600 dark:text-slate-300 tabular-nums font-medium">
                          {log.quantityGrams}g
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                          {log.calories} kcal
                        </td>
                        <td className="py-2.5 px-3 text-right font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                          {log.proteinG}g
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded transition-colors cursor-pointer"
                            title="Delete food entry"
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
                        Total for Day
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 dark:text-slate-400 font-medium">
                        {foodLogs.reduce((sum, f) => sum + f.quantityGrams, 0)}g
                      </td>
                      <td className="py-3 px-3 text-right text-rose-600 dark:text-rose-400 tabular-nums">
                        {totalCalories} kcal
                      </td>
                      <td className="py-3 px-3 text-right text-amber-600 dark:text-amber-400 tabular-nums">
                        {totalProtein}g
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            {/* Protein Distribution Guidance */}
            <div className="mt-6 p-4 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs">
              <div className="font-bold text-amber-900 dark:text-amber-200 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Protein Intake Advice for Students</span>
              </div>
              <p className="text-amber-800 dark:text-amber-300 leading-relaxed">
                Standard fitness guidelines suggest 1.4g – 2.0g of protein per kg of body weight for active individuals and muscle building. With your current body weight of {goals.weight}kg, your target of {goals.proteinTarget}g represents ~{(goals.proteinTarget / (goals.weight || 1)).toFixed(1)}g/kg.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
