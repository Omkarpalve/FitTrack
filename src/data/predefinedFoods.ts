import { FoodItem } from '../types';

export const PREDEFINED_FOODS: FoodItem[] = [
  {
    id: 'food_egg',
    name: 'Boiled Egg (Large)',
    category: 'Protein',
    servingUnit: 'piece (~50g)',
    defaultServingGrams: 50,
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11
  },
  {
    id: 'food_chicken',
    name: 'Chicken Breast (Cooked/Grilled)',
    category: 'Protein',
    servingUnit: '100g fillet',
    defaultServingGrams: 100,
    caloriesPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6
  },
  {
    id: 'food_rice',
    name: 'White Rice (Cooked)',
    category: 'Carbs',
    servingUnit: '1 bowl (~150g)',
    defaultServingGrams: 150,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.3
  },
  {
    id: 'food_brown_rice',
    name: 'Brown Rice (Cooked)',
    category: 'Carbs',
    servingUnit: '1 bowl (~150g)',
    defaultServingGrams: 150,
    caloriesPer100g: 111,
    proteinPer100g: 2.6,
    carbsPer100g: 23,
    fatPer100g: 0.9
  },
  {
    id: 'food_oats',
    name: 'Rolled Oats (Raw / Porridge)',
    category: 'Carbs',
    servingUnit: '1 cup cooked (~200g)',
    defaultServingGrams: 100,
    caloriesPer100g: 68,
    proteinPer100g: 2.4,
    carbsPer100g: 12,
    fatPer100g: 1.4
  },
  {
    id: 'food_dal',
    name: 'Cooked Lentils / Dal (Yellow/Moong)',
    category: 'Protein',
    servingUnit: '1 bowl (~150g)',
    defaultServingGrams: 150,
    caloriesPer100g: 116,
    proteinPer100g: 9.0,
    carbsPer100g: 20,
    fatPer100g: 0.4
  },
  {
    id: 'food_paneer',
    name: 'Paneer (Cottage Cheese)',
    category: 'Protein',
    servingUnit: 'cubes (100g)',
    defaultServingGrams: 100,
    caloriesPer100g: 265,
    proteinPer100g: 18.3,
    carbsPer100g: 3.4,
    fatPer100g: 20.8
  },
  {
    id: 'food_roti',
    name: 'Whole Wheat Roti / Chapati',
    category: 'Carbs',
    servingUnit: '1 piece (~40g)',
    defaultServingGrams: 40,
    caloriesPer100g: 297,
    proteinPer100g: 11.0,
    carbsPer100g: 58,
    fatPer100g: 3.5
  },
  {
    id: 'food_milk',
    name: 'Whole Cow Milk',
    category: 'Dairy',
    servingUnit: '1 glass (~200ml)',
    defaultServingGrams: 200,
    caloriesPer100g: 61,
    proteinPer100g: 3.2,
    carbsPer100g: 4.8,
    fatPer100g: 3.3
  },
  {
    id: 'food_banana',
    name: 'Banana (Ripe)',
    category: 'Fruits & Veggies',
    servingUnit: '1 medium fruit (~118g)',
    defaultServingGrams: 118,
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 23,
    fatPer100g: 0.3
  },
  {
    id: 'food_peanut_butter',
    name: 'Peanut Butter (Smooth)',
    category: 'Fats & Nuts',
    servingUnit: '1 tbsp (~16g)',
    defaultServingGrams: 32,
    caloriesPer100g: 588,
    proteinPer100g: 25.0,
    carbsPer100g: 20,
    fatPer100g: 50
  },
  {
    id: 'food_greek_yogurt',
    name: 'Greek Yogurt (Plain Low-Fat)',
    category: 'Dairy',
    servingUnit: '1 cup (~150g)',
    defaultServingGrams: 150,
    caloriesPer100g: 73,
    proteinPer100g: 10.0,
    carbsPer100g: 3.6,
    fatPer100g: 1.9
  },
  {
    id: 'food_almonds',
    name: 'Raw Almonds',
    category: 'Fats & Nuts',
    servingUnit: 'handful (~28g / ~23 nuts)',
    defaultServingGrams: 28,
    caloriesPer100g: 579,
    proteinPer100g: 21.2,
    carbsPer100g: 21.6,
    fatPer100g: 49.9
  },
  {
    id: 'food_whey',
    name: 'Whey Protein Powder',
    category: 'Protein',
    servingUnit: '1 scoop (~30g)',
    defaultServingGrams: 30,
    caloriesPer100g: 400,
    proteinPer100g: 80.0,
    carbsPer100g: 6.0,
    fatPer100g: 4.0
  },
  {
    id: 'food_tuna',
    name: 'Canned Tuna in Water',
    category: 'Protein',
    servingUnit: '1 can drained (~120g)',
    defaultServingGrams: 120,
    caloriesPer100g: 116,
    proteinPer100g: 26.0,
    carbsPer100g: 0,
    fatPer100g: 0.8
  },
  {
    id: 'food_sweet_potato',
    name: 'Sweet Potato (Baked)',
    category: 'Carbs',
    servingUnit: '1 medium (~130g)',
    defaultServingGrams: 130,
    caloriesPer100g: 90,
    proteinPer100g: 2.0,
    carbsPer100g: 20.7,
    fatPer100g: 0.1
  },
  {
    id: 'food_apple',
    name: 'Fresh Apple',
    category: 'Fruits & Veggies',
    servingUnit: '1 medium apple (~180g)',
    defaultServingGrams: 180,
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 14,
    fatPer100g: 0.2
  },
  {
    id: 'food_spinach',
    name: 'Cooked Spinach / Green Salad',
    category: 'Fruits & Veggies',
    servingUnit: '1 bowl (~100g)',
    defaultServingGrams: 100,
    caloriesPer100g: 23,
    proteinPer100g: 2.9,
    carbsPer100g: 3.6,
    fatPer100g: 0.4
  }
];
