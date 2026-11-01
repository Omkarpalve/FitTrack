export type FitnessGoal = 'weight_loss' | 'maintenance' | 'muscle_gain';

export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

export interface UserGoals {
  userId: string;
  name: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  fitnessGoal: FitnessGoal;
  calorieTarget: number;
  proteinTarget: number; // in grams
  waterTargetMl: number; // in ml
  workoutTargetMins: number; // in minutes
}

export interface FoodItem {
  id: string;
  name: string;
  category: 'Protein' | 'Carbs' | 'Dairy' | 'Fruits & Veggies' | 'Fats & Nuts';
  servingUnit: string;
  defaultServingGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g?: number;
  fatPer100g?: number;
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export interface FoodLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  foodName: string;
  quantityGrams: number;
  calories: number;
  proteinG: number;
  mealType: MealType;
  createdAt: string;
}

export type WorkoutType = 
  | 'Strength Training' 
  | 'Cardio / Running' 
  | 'Yoga & Stretching' 
  | 'HIIT / Calisthenics' 
  | 'Walking' 
  | 'Sports & Swimming';

export interface WorkoutLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  workoutType: WorkoutType;
  exerciseName: string;
  durationMins: number;
  sets?: number;
  reps?: number;
  steps?: number;
  goalCompleted: boolean;
  createdAt: string;
}

export interface WaterLog {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  amountMl: number;
  createdAt: string;
}

export interface Habit {
  id: string;
  userId: string;
  name: string;
  iconName?: string;
}

export interface HabitCompletion {
  id: string;
  userId: string;
  habitId: string;
  date: string; // YYYY-MM-DD
  completed: boolean;
}

export interface DayRecordSummary {
  date: string;
  calories: number;
  protein: number;
  water: number;
  workoutMins: number;
  workoutCount: number;
  habitsCompleted: number;
  totalHabits: number;
  status: 'met_all' | 'partially_active' | 'rest_day';
}
