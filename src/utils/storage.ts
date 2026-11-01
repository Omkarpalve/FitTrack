import { 
  User, 
  UserGoals, 
  FoodLog, 
  WorkoutLog, 
  WaterLog, 
  Habit, 
  HabitCompletion, 
  DayRecordSummary 
} from '../types';

const STORAGE_KEYS = {
  USERS: 'fittrack_users',
  ACTIVE_USER_ID: 'fittrack_active_user_id',
  USER_GOALS: 'fittrack_user_goals',
  FOOD_LOGS: 'fittrack_food_logs',
  WORKOUT_LOGS: 'fittrack_workout_logs',
  WATER_LOGS: 'fittrack_water_logs',
  HABITS: 'fittrack_habits',
  HABIT_COMPLETIONS: 'fittrack_habit_completions',
  THEME: 'fittrack_theme'
};

export type ThemeMode = 'light' | 'dark';

export function getSavedTheme(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME) as ThemeMode | null;
    if (saved === 'light' || saved === 'dark') return saved;
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  } catch (e) {
    // fallback
  }
  return 'light';
}

export function saveTheme(theme: ThemeMode): void {
  try {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  } catch (e) {
    console.error('Error saving theme', e);
  }
}

// Date utilities (Local YYYY-MM-DD without timezone skew)
export function formatDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function getTodayString(): string {
  return formatDate(new Date());
}

export function shiftDate(dateStr: string, daysOffset: number): string {
  const d = parseDate(dateStr);
  d.setDate(d.getDate() + daysOffset);
  return formatDate(d);
}

// Low-level helper
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to localStorage`, e);
  }
}

// Authentication & Users
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, []);
}

export function getActiveUser(): User | null {
  const users = getUsers();
  const activeId = localStorage.getItem(STORAGE_KEYS.ACTIVE_USER_ID);
  if (!activeId) return null;
  return users.find(u => u.id === activeId) || null;
}

export function setActiveUser(userId: string | null): void {
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER_ID, userId);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER_ID);
  }
}

export function registerUser(username: string, email: string): User {
  const users = getUsers();
  const existing = users.find(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    throw new Error('Username or email already exists.');
  }

  const newUser: User = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    username,
    email,
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  setItem(STORAGE_KEYS.USERS, users);
  setActiveUser(newUser.id);

  // Set default goals
  const defaultGoals: UserGoals = {
    userId: newUser.id,
    name: username,
    age: 21,
    height: 175,
    weight: 70,
    fitnessGoal: 'maintenance',
    calorieTarget: 2200,
    proteinTarget: 130,
    waterTargetMl: 3000,
    workoutTargetMins: 45
  };
  saveUserGoals(defaultGoals);

  // Set default habits
  const defaultHabits: string[] = [
    'Drink 3L Clean Water',
    'Hit Daily Protein Target',
    '30-45 Min Workout Session',
    'Log All Meals in FitTrack'
  ];
  defaultHabits.forEach(name => addHabit(newUser.id, name));

  return newUser;
}

export function loginUser(identifier: string): User {
  const users = getUsers();
  const user = users.find(u => 
    u.username.toLowerCase() === identifier.toLowerCase() || 
    u.email.toLowerCase() === identifier.toLowerCase()
  );
  if (!user) {
    throw new Error('User not found. Please register or click "Use Demo Account".');
  }
  setActiveUser(user.id);
  return user;
}

export function logoutUser(): void {
  setActiveUser(null);
}

// User Goals
export function getUserGoals(userId: string): UserGoals {
  const allGoals = getItem<Record<string, UserGoals>>(STORAGE_KEYS.USER_GOALS, {});
  if (allGoals[userId]) {
    return allGoals[userId];
  }
  const defaultGoals: UserGoals = {
    userId,
    name: 'Student Athlete',
    age: 21,
    height: 175,
    weight: 70,
    fitnessGoal: 'muscle_gain',
    calorieTarget: 2400,
    proteinTarget: 135,
    waterTargetMl: 3000,
    workoutTargetMins: 45
  };
  allGoals[userId] = defaultGoals;
  setItem(STORAGE_KEYS.USER_GOALS, allGoals);
  return defaultGoals;
}

export function saveUserGoals(goals: UserGoals): void {
  const allGoals = getItem<Record<string, UserGoals>>(STORAGE_KEYS.USER_GOALS, {});
  allGoals[goals.userId] = goals;
  setItem(STORAGE_KEYS.USER_GOALS, allGoals);
}

// Food Logs
export function getFoodLogs(userId: string, dateStr?: string): FoodLog[] {
  const allLogs = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []);
  return allLogs.filter(log => log.userId === userId && (!dateStr || log.date === dateStr));
}

export function addFoodLog(log: Omit<FoodLog, 'id' | 'createdAt'>): FoodLog {
  const allLogs = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []);
  const newLog: FoodLog = {
    ...log,
    id: 'flog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString()
  };
  allLogs.push(newLog);
  setItem(STORAGE_KEYS.FOOD_LOGS, allLogs);
  return newLog;
}

export function deleteFoodLog(logId: string): void {
  const allLogs = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []);
  const filtered = allLogs.filter(l => l.id !== logId);
  setItem(STORAGE_KEYS.FOOD_LOGS, filtered);
}

// Workout Logs
export function getWorkoutLogs(userId: string, dateStr?: string): WorkoutLog[] {
  const allLogs = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  return allLogs.filter(log => log.userId === userId && (!dateStr || log.date === dateStr));
}

export function addWorkoutLog(log: Omit<WorkoutLog, 'id' | 'createdAt'>): WorkoutLog {
  const allLogs = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  const newLog: WorkoutLog = {
    ...log,
    id: 'wlog_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    createdAt: new Date().toISOString()
  };
  allLogs.push(newLog);
  setItem(STORAGE_KEYS.WORKOUT_LOGS, allLogs);
  return newLog;
}

export function deleteWorkoutLog(logId: string): void {
  const allLogs = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []);
  const filtered = allLogs.filter(l => l.id !== logId);
  setItem(STORAGE_KEYS.WORKOUT_LOGS, filtered);
}

// Water Logs
export function getWaterLogs(userId: string, dateStr: string): number {
  const allLogs = getItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []);
  return allLogs
    .filter(l => l.userId === userId && l.date === dateStr)
    .reduce((sum, l) => sum + l.amountMl, 0);
}

export function addWater(userId: string, dateStr: string, amountMl: number): void {
  const allLogs = getItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []);
  allLogs.push({
    id: 'wtr_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    date: dateStr,
    amountMl,
    createdAt: new Date().toISOString()
  });
  setItem(STORAGE_KEYS.WATER_LOGS, allLogs);
}

export function resetWater(userId: string, dateStr: string): void {
  const allLogs = getItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []);
  const filtered = allLogs.filter(l => !(l.userId === userId && l.date === dateStr));
  setItem(STORAGE_KEYS.WATER_LOGS, filtered);
}

// Daily Habits
export function getHabits(userId: string): Habit[] {
  const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
  return allHabits.filter(h => h.userId === userId);
}

export function addHabit(userId: string, name: string): Habit {
  const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
  const newHabit: Habit = {
    id: 'hbt_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    userId,
    name
  };
  allHabits.push(newHabit);
  setItem(STORAGE_KEYS.HABITS, allHabits);
  return newHabit;
}

export function deleteHabit(habitId: string): void {
  const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS, []);
  setItem(STORAGE_KEYS.HABITS, allHabits.filter(h => h.id !== habitId));
  
  const allComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []);
  setItem(STORAGE_KEYS.HABIT_COMPLETIONS, allComps.filter(c => c.habitId !== habitId));
}

export function getHabitCompletions(userId: string, dateStr: string): Record<string, boolean> {
  const allComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []);
  const result: Record<string, boolean> = {};
  allComps
    .filter(c => c.userId === userId && c.date === dateStr)
    .forEach(c => {
      result[c.habitId] = c.completed;
    });
  return result;
}

export function toggleHabitCompletion(userId: string, habitId: string, dateStr: string, completed: boolean): void {
  const allComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []);
  const idx = allComps.findIndex(c => c.userId === userId && c.habitId === habitId && c.date === dateStr);
  if (idx >= 0) {
    allComps[idx].completed = completed;
  } else {
    allComps.push({
      id: 'hcomp_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      userId,
      habitId,
      date: dateStr,
      completed
    });
  }
  setItem(STORAGE_KEYS.HABIT_COMPLETIONS, allComps);
}

// Consistency & Streak Algorithm across Calendar Dates
export function calculateStreaks(userId: string): {
  currentStreak: number;
  longestStreak: number;
  activeDaysThisMonth: number;
  weeklyConsistencyPercent: number;
} {
  const foodLogs = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []).filter(l => l.userId === userId);
  const workoutLogs = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []).filter(l => l.userId === userId);
  const habitComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []).filter(l => l.userId === userId && l.completed);

  // Set of unique active dates
  const activeDateSet = new Set<string>();
  foodLogs.forEach(l => activeDateSet.add(l.date));
  workoutLogs.forEach(l => activeDateSet.add(l.date));
  habitComps.forEach(l => activeDateSet.add(l.date));

  const sortedDates = Array.from(activeDateSet).sort();

  if (sortedDates.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDaysThisMonth: 0, weeklyConsistencyPercent: 0 };
  }

  const todayStr = getTodayString();
  const yesterdayStr = shiftDate(todayStr, -1);

  // Current streak calculation
  let currentStreak = 0;
  let checkDate = activeDateSet.has(todayStr) ? todayStr : (activeDateSet.has(yesterdayStr) ? yesterdayStr : null);

  if (checkDate) {
    while (activeDateSet.has(checkDate)) {
      currentStreak++;
      checkDate = shiftDate(checkDate, -1);
    }
  }

  // Longest streak calculation
  let longestStreak = 0;
  let tempStreak = 0;
  let prevDateStr: string | null = null;

  for (const dateStr of sortedDates) {
    if (!prevDateStr) {
      tempStreak = 1;
    } else {
      const expectedNext = shiftDate(prevDateStr, 1);
      if (expectedNext === dateStr) {
        tempStreak++;
      } else {
        tempStreak = 1;
      }
    }
    prevDateStr = dateStr;
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  // Active days this month
  const currentYearMonth = todayStr.substring(0, 7); // YYYY-MM
  const activeDaysThisMonth = sortedDates.filter(d => d.startsWith(currentYearMonth)).length;

  // Weekly consistency (past 7 days)
  let activePast7Days = 0;
  for (let i = 0; i < 7; i++) {
    const d = shiftDate(todayStr, -i);
    if (activeDateSet.has(d)) activePast7Days++;
  }
  const weeklyConsistencyPercent = Math.round((activePast7Days / 7) * 100);

  return {
    currentStreak,
    longestStreak,
    activeDaysThisMonth,
    weeklyConsistencyPercent
  };
}

// Day Summary for Calendar View
export function getMonthSummary(userId: string, year: number, month: number): Record<string, DayRecordSummary> {
  const goals = getUserGoals(userId);
  const foodLogs = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []).filter(l => l.userId === userId);
  const workoutLogs = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []).filter(l => l.userId === userId);
  const waterLogs = getItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []).filter(l => l.userId === userId);
  const habitComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []).filter(l => l.userId === userId && l.completed);
  const habits = getHabits(userId);

  const monthPrefix = `${year}-${String(month).padStart(2, '0')}`;
  const summary: Record<string, DayRecordSummary> = {};

  // Aggregate foods
  foodLogs.filter(l => l.date.startsWith(monthPrefix)).forEach(l => {
    if (!summary[l.date]) {
      summary[l.date] = {
        date: l.date,
        calories: 0,
        protein: 0,
        water: 0,
        workoutMins: 0,
        workoutCount: 0,
        habitsCompleted: 0,
        totalHabits: habits.length,
        status: 'rest_day'
      };
    }
    summary[l.date].calories += l.calories;
    summary[l.date].protein += l.proteinG;
  });

  // Aggregate workouts
  workoutLogs.filter(l => l.date.startsWith(monthPrefix)).forEach(l => {
    if (!summary[l.date]) {
      summary[l.date] = {
        date: l.date,
        calories: 0,
        protein: 0,
        water: 0,
        workoutMins: 0,
        workoutCount: 0,
        habitsCompleted: 0,
        totalHabits: habits.length,
        status: 'rest_day'
      };
    }
    summary[l.date].workoutMins += l.durationMins;
    summary[l.date].workoutCount += 1;
  });

  // Aggregate water
  waterLogs.filter(l => l.date.startsWith(monthPrefix)).forEach(l => {
    if (!summary[l.date]) {
      summary[l.date] = {
        date: l.date,
        calories: 0,
        protein: 0,
        water: 0,
        workoutMins: 0,
        workoutCount: 0,
        habitsCompleted: 0,
        totalHabits: habits.length,
        status: 'rest_day'
      };
    }
    summary[l.date].water += l.amountMl;
  });

  // Aggregate habits
  habitComps.filter(l => l.date.startsWith(monthPrefix)).forEach(l => {
    if (!summary[l.date]) {
      summary[l.date] = {
        date: l.date,
        calories: 0,
        protein: 0,
        water: 0,
        workoutMins: 0,
        workoutCount: 0,
        habitsCompleted: 0,
        totalHabits: habits.length,
        status: 'rest_day'
      };
    }
    summary[l.date].habitsCompleted += 1;
  });

  // Compute status
  Object.values(summary).forEach(day => {
    day.calories = Math.round(day.calories * 10) / 10;
    day.protein = Math.round(day.protein * 10) / 10;
    const metCalorie = day.calories >= (goals.calorieTarget * 0.85);
    const metProtein = day.protein >= (goals.proteinTarget * 0.85);
    const metWorkout = day.workoutMins >= (goals.workoutTargetMins * 0.7);

    if ((metCalorie || metProtein) && metWorkout) {
      day.status = 'met_all';
    } else if (day.calories > 0 || day.workoutMins > 0 || day.habitsCompleted > 0) {
      day.status = 'partially_active';
    } else {
      day.status = 'rest_day';
    }
  });

  return summary;
}

// Preload Demo Data for Presentation
export function seedDemoData(): User {
  const demoUser: User = {
    id: 'demo_user_alex',
    username: 'varad_fittrack',
    email: 'varad@college.edu',
    createdAt: new Date().toISOString()
  };

  const users = getUsers();
  const existingIdx = users.findIndex(u => u.id === demoUser.id);
  if (existingIdx >= 0) {
    users[existingIdx] = demoUser;
  } else {
    users.push(demoUser);
  }
  setItem(STORAGE_KEYS.USERS, users);
  setActiveUser(demoUser.id);

  // Set Varad's goals
  const demoGoals: UserGoals = {
    userId: demoUser.id,
    name: 'Varad (Student)',
    age: 21,
    height: 178,
    weight: 71.5,
    fitnessGoal: 'muscle_gain',
    calorieTarget: 2350,
    proteinTarget: 135,
    waterTargetMl: 3000,
    workoutTargetMins: 45
  };
  saveUserGoals(demoGoals);

  // Set habits
  const demoHabits: Habit[] = [
    { id: 'hbt_water', userId: demoUser.id, name: 'Drink 3L Clean Water' },
    { id: 'hbt_protein', userId: demoUser.id, name: 'Hit 135g Protein Target' },
    { id: 'hbt_workout', userId: demoUser.id, name: '45-Min Workout Session' },
    { id: 'hbt_meals', userId: demoUser.id, name: 'Log All 4 Daily Meals' },
    { id: 'hbt_sleep', userId: demoUser.id, name: '7.5+ Hours Sleep' }
  ];
  const allHabits = getItem<Habit[]>(STORAGE_KEYS.HABITS, []).filter(h => h.userId !== demoUser.id);
  allHabits.push(...demoHabits);
  setItem(STORAGE_KEYS.HABITS, allHabits);

  // Seed 14 days of realistic student meals, workouts, water, and habit completions
  const today = new Date();
  const newFoodLogs: FoodLog[] = [];
  const newWorkoutLogs: WorkoutLog[] = [];
  const newWaterLogs: WaterLog[] = [];
  const newCompletions: HabitCompletion[] = [];

  for (let i = 13; i >= 0; i--) {
    const curDate = new Date();
    curDate.setDate(today.getDate() - i);
    const dateStr = formatDate(curDate);

    // Food logs
    newFoodLogs.push(
      {
        id: `flog_${dateStr}_1`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Boiled Egg (Large)',
        quantityGrams: 100,
        calories: 155,
        proteinG: 13,
        mealType: 'Breakfast',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_2`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Rolled Oats (Raw / Porridge)',
        quantityGrams: 120,
        calories: 82,
        proteinG: 2.9,
        mealType: 'Breakfast',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_3`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Chicken Breast (Cooked/Grilled)',
        quantityGrams: 200,
        calories: 330,
        proteinG: 62,
        mealType: 'Lunch',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_4`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'White Rice (Cooked)',
        quantityGrams: 250,
        calories: 325,
        proteinG: 6.8,
        mealType: 'Lunch',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_5`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Greek Yogurt (Plain Low-Fat)',
        quantityGrams: 150,
        calories: 110,
        proteinG: 15,
        mealType: 'Snack',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_6`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Cooked Lentils / Dal (Yellow/Moong)',
        quantityGrams: 200,
        calories: 232,
        proteinG: 18,
        mealType: 'Dinner',
        createdAt: new Date().toISOString()
      },
      {
        id: `flog_${dateStr}_7`,
        userId: demoUser.id,
        date: dateStr,
        foodName: 'Whole Wheat Roti / Chapati',
        quantityGrams: 80,
        calories: 238,
        proteinG: 8.8,
        mealType: 'Dinner',
        createdAt: new Date().toISOString()
      }
    );

    // Workout logs
    const workoutRoutines: { type: any; name: string; duration: number; sets: number; reps: number; steps: number }[] = [
      { type: 'Strength Training', name: 'Chest, Shoulders & Triceps (Push Day)', duration: 50, sets: 4, reps: 10, steps: 6200 },
      { type: 'Cardio / Running', name: 'Campus 5km Outdoor Jog', duration: 32, sets: 0, reps: 0, steps: 7800 },
      { type: 'Strength Training', name: 'Back, Lats & Biceps (Pull Day)', duration: 55, sets: 4, reps: 12, steps: 5800 },
      { type: 'Strength Training', name: 'Squats, Lunges & Calves (Leg Day)', duration: 45, sets: 4, reps: 10, steps: 6100 },
      { type: 'HIIT / Calisthenics', name: 'Core Circuit & Pullups', duration: 35, sets: 3, reps: 15, steps: 5400 }
    ];
    const routine = workoutRoutines[i % workoutRoutines.length];
    newWorkoutLogs.push({
      id: `wlog_${dateStr}_1`,
      userId: demoUser.id,
      date: dateStr,
      workoutType: routine.type,
      exerciseName: routine.name,
      durationMins: routine.duration,
      sets: routine.sets,
      reps: routine.reps,
      steps: routine.steps,
      goalCompleted: true,
      createdAt: new Date().toISOString()
    });

    // Water logs
    newWaterLogs.push(
      { id: `wtr_${dateStr}_1`, userId: demoUser.id, date: dateStr, amountMl: 1000, createdAt: new Date().toISOString() },
      { id: `wtr_${dateStr}_2`, userId: demoUser.id, date: dateStr, amountMl: 1000, createdAt: new Date().toISOString() },
      { id: `wtr_${dateStr}_3`, userId: demoUser.id, date: dateStr, amountMl: 750, createdAt: new Date().toISOString() }
    );

    // Habit completions (past days marked completed)
    demoHabits.forEach((h, hIdx) => {
      // 85% completion rate to look authentic
      const isCompleted = (i + hIdx) % 7 !== 0;
      newCompletions.push({
        id: `comp_${dateStr}_${h.id}`,
        userId: demoUser.id,
        habitId: h.id,
        date: dateStr,
        completed: isCompleted
      });
    });
  }

  // Save filtered logs
  const existingFood = getItem<FoodLog[]>(STORAGE_KEYS.FOOD_LOGS, []).filter(l => l.userId !== demoUser.id);
  setItem(STORAGE_KEYS.FOOD_LOGS, [...existingFood, ...newFoodLogs]);

  const existingWorkouts = getItem<WorkoutLog[]>(STORAGE_KEYS.WORKOUT_LOGS, []).filter(l => l.userId !== demoUser.id);
  setItem(STORAGE_KEYS.WORKOUT_LOGS, [...existingWorkouts, ...newWorkoutLogs]);

  const existingWater = getItem<WaterLog[]>(STORAGE_KEYS.WATER_LOGS, []).filter(l => l.userId !== demoUser.id);
  setItem(STORAGE_KEYS.WATER_LOGS, [...existingWater, ...newWaterLogs]);

  const existingComps = getItem<HabitCompletion[]>(STORAGE_KEYS.HABIT_COMPLETIONS, []).filter(l => l.userId !== demoUser.id);
  setItem(STORAGE_KEYS.HABIT_COMPLETIONS, [...existingComps, ...newCompletions]);

  return demoUser;
}
