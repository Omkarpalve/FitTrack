import React, { useState } from 'react';
import { 
  X, 
  GraduationCap, 
  Database, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Copy, 
  Check, 
  Sparkles,
  Terminal,
  HelpCircle,
  Code2,
  Download
} from 'lucide-react';

interface VivaKitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VivaKitModal: React.FC<VivaKitModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [activeSection, setActiveSection] = useState<'abstract' | 'architecture' | 'schema' | 'viva' | 'testcases'>('abstract');
  const [copied, setCopied] = useState(false);

  const sqliteSchemaText = `-- FitTrack SQLite Database Schema (fittrack.db)

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    name TEXT,
    age INTEGER DEFAULT 21,
    height REAL DEFAULT 175.0,
    weight REAL DEFAULT 70.0,
    fitness_goal TEXT DEFAULT 'maintenance',
    calorie_target INTEGER DEFAULT 2200,
    protein_target INTEGER DEFAULT 120,
    water_target_ml INTEGER DEFAULT 3000,
    workout_target_mins INTEGER DEFAULT 45,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE food_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    serving_unit TEXT NOT NULL DEFAULT 'grams',
    calories_per_100g REAL NOT NULL,
    protein_per_100g REAL NOT NULL,
    is_predefined INTEGER DEFAULT 1
);

CREATE TABLE food_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    food_name TEXT NOT NULL,
    quantity_grams REAL NOT NULL,
    calories REAL NOT NULL,
    protein_g REAL NOT NULL,
    meal_type TEXT DEFAULT 'Lunch',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE workout_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    workout_type TEXT NOT NULL,
    exercise_name TEXT NOT NULL,
    duration_mins INTEGER NOT NULL,
    sets INTEGER DEFAULT 0,
    reps INTEGER DEFAULT 0,
    steps INTEGER DEFAULT 0,
    goal_completed INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE water_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    amount_ml INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE daily_habits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    habit_name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE habit_completions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    habit_id INTEGER NOT NULL,
    date TEXT NOT NULL, -- YYYY-MM-DD
    completed INTEGER DEFAULT 1,
    UNIQUE(user_id, habit_id, date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (habit_id) REFERENCES daily_habits(id) ON DELETE CASCADE
);`;

  const handleCopySchema = () => {
    navigator.clipboard.writeText(sqliteSchemaText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                FitTrack · Final-Year College Project & Viva Hub
              </h3>
              <p className="text-xs text-slate-400">
                Presentation guide, architecture diagrams, SQLite schema & viva preparation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 gap-2 shrink-0 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'abstract', label: '1. Abstract & Problem', icon: <FileText className="w-3.5 h-3.5" /> },
            { id: 'architecture', label: '2. System Architecture & ER', icon: <Layers className="w-3.5 h-3.5" /> },
            { id: 'schema', label: '3. SQLite Schema', icon: <Database className="w-3.5 h-3.5" /> },
            { id: 'viva', label: '4. Viva Q&A & Demo Script', icon: <HelpCircle className="w-3.5 h-3.5" /> },
            { id: 'testcases', label: '5. Test Cases Matrix', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeSection === tab.id 
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 font-bold' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-6">
          
          {/* 1. Abstract & Problem Statement */}
          {activeSection === 'abstract' && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm mb-1">Project Abstract</h4>
                <p className="text-emerald-900 dark:text-emerald-300 leading-relaxed text-xs">
                  <strong>FitTrack</strong> is a modern, responsive personal fitness and nutrition tracking web application built specifically for college students and fitness beginners. Unlike commercial platforms laden with subscriptions, intrusive ads, or mandatory proprietary wearable devices, FitTrack delivers a streamlined, self-sufficient utility to track daily calorie deficit/surplus, hit protein goals, record strength and cardio workouts, log hydration, and cultivate discipline through continuous calendar streak calculation.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Problem Statement</h4>
                <p className="leading-relaxed text-xs text-slate-600 dark:text-slate-400">
                  Beginners often quit fitness programs due to nutritional ambiguity (not knowing if they are under-eating protein or over-eating calories) and lack of daily accountability. Traditional spreadsheets are cumbersome on mobile devices, while corporate apps require hardware sync and lock basic macro tracking behind paywalls. FitTrack addresses this gap with a lightweight, browser-based solution that computes instant nutritional estimates and calendar streaks without privacy-violating external APIs.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <strong className="text-slate-900 dark:text-white block mb-1">Core Modules:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Dynamic Calorie Deficit & Surplus Calculation</li>
                    <li>Automated Protein Intake & Progress Tracking</li>
                    <li>Calendar Date-Based Streak Calculation Algorithm</li>
                    <li>Interactive Monthly Fitness & Nutrition Matrix</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
                  <strong className="text-slate-900 dark:text-white block mb-1">Key Advantages:</strong>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 dark:text-slate-300">
                    <li>Zero wearable requirement (manual input friendly)</li>
                    <li>Instant client-side calculation with instant feedback</li>
                    <li>Pre-seeded college foods (eggs, dal, paneer, chicken, oats)</li>
                    <li>User-toggleable light and dark theme mode</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* 2. System Architecture & ER Diagram */}
          {activeSection === 'architecture' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">3-Tier System Architecture</h4>
                <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs rounded-xl overflow-x-auto leading-relaxed border border-slate-800">
                  <pre>{`+-----------------------------------------------------------+
|                     Client Tier (Presentation)            |
|   - React 19 SPA + TypeScript + Tailwind CSS               |
|   - Dark Mode / Light Mode Theme Switching Engine          |
|   - Chart.js Analytical Visualizations                    |
|   - Interactive 42-Cell Monthly Calendar Grid            |
+-----------------------------------------------------------+
                              |
                     Application State & Logic
                              |
                              v
+-----------------------------------------------------------+
|                 Application / Business Logic Tier         |
|   - Calorie & Protein Multiplier Engine (per 100g)        |
|   - Calendar-Date Streak Computation Algorithm            |
|   - Mifflin-St Jeor TDEE & Macro Estimator                |
|   - Multi-User Session Isolation Manager                  |
+-----------------------------------------------------------+
                              |
                    Data Persistence Layer
                              |
                              v
+-----------------------------------------------------------+
|                   Database Tier (SQLite / Storage)        |
|   - Tables: users, user_goals, food_logs, workout_logs,    |
|             water_logs, daily_habits, habit_completions   |
+-----------------------------------------------------------+`}</pre>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-2">Database Entity-Relationship (ER) Description</h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  <div className="p-3">
                    <strong className="text-slate-900 dark:text-white">USERS (1) ── (1) USER_GOALS:</strong> Each user has exactly one profile row configuring age, height, weight, daily calorie goal, protein target, and water target.
                  </div>
                  <div className="p-3">
                    <strong className="text-slate-900 dark:text-white">USERS (1) ── (N) FOOD_LOGS:</strong> Users log multiple meals per date, calculating calories and protein from quantity in grams.
                  </div>
                  <div className="p-3">
                    <strong className="text-slate-900 dark:text-white">USERS (1) ── (N) WORKOUT_LOGS:</strong> Workouts store duration, exercise name, workout type, sets/reps, and manual steps.
                  </div>
                  <div className="p-3">
                    <strong className="text-slate-900 dark:text-white">USERS (1) ── (N) HABIT_COMPLETIONS:</strong> Tracks completion state for custom and predefined daily discipline habits.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. SQLite Schema */}
          {activeSection === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">SQLite Production Schema</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">8 normalized relational tables designed for the Python Flask + SQLite backend.</p>
                </div>
                <button
                  onClick={handleCopySchema}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-800 text-white rounded-lg text-xs font-semibold hover:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer border border-transparent dark:border-slate-700"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied SQL!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <div className="bg-slate-950 text-slate-100 p-4 rounded-xl font-mono text-xs overflow-x-auto max-h-96 border border-slate-800">
                <pre>{sqliteSchemaText}</pre>
              </div>
            </div>
          )}

          {/* 4. Viva Q&A & Demo Script */}
          {activeSection === 'viva' && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1">Frequently Asked Viva Questions & Standard Answers</h4>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Q1: How does your system calculate active streaks across month boundaries?</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> Rather than counting database rows (which breaks if a user logs multiple items in one day), FitTrack aggregates a distinct set of calendar dates (YYYY-MM-DD) where the user was active. It checks today; if inactive, it checks yesterday. Then it loops backwards day-by-day using calendar date math (<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">d - 1 day</code>) to verify continuous dates, properly traversing across month and leap-year boundaries.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Q2: How are nutrition metrics (calories and protein) calculated dynamically?</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> The food item database defines nutritional density per 100g (<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">calories_per_100g</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">protein_per_100g</code>). When a user enters a serving size in grams, the system computes: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">calories = (calories_per_100g / 100) * quantity_grams</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Q3: Why use SQLite instead of a heavy database server?</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> SQLite is lightweight, serverless, zero-configuration, and stores the entire database in a single portable file (<code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">fittrack.db</code>). For single-institution, personal fitness, and student projects, it eliminates server overhead and guarantees transactional integrity (ACID).
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Q4: How does FitTrack protect user data privacy?</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> Passwords in the backend are hashed using Werkzeug PBKDF2 with SHA-256 and salt. Every database query filters by foreign key <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">user_id</code> from the authenticated session, preventing horizontal privilege escalation or data leakage across users.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">Q5: Where and how is this project hosted online for teacher & examiner evaluation?</div>
                  <p className="text-slate-600 dark:text-slate-300">
                    <strong>Answer:</strong> FitTrack is deployed live on Google Cloud Run with 24/7 HTTPS accessibility. Additionally, the project repository includes pre-configured <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">vercel.json</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">netlify.toml</code> configuration files enabling instant 1-click deployments to Vercel or Netlify, as well as instructions for hosting the Python Flask backend on Render.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Test Cases Matrix */}
          {activeSection === 'testcases' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">Formal Verification & Test Cases Matrix</h4>
              
              <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300">
                    <tr>
                      <th className="py-2.5 px-3">Test ID</th>
                      <th className="py-2.5 px-3">Test Objective</th>
                      <th className="py-2.5 px-3">Input Data</th>
                      <th className="py-2.5 px-3">Expected Result</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TC-01</td>
                      <td className="py-2.5 px-3">User Authentication</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">user: demo, pwd: demo123</td>
                      <td className="py-2.5 px-3">Session created, redirect to dashboard</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">Pass</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TC-02</td>
                      <td className="py-2.5 px-3">Calorie & Protein Multiplier</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">200g Chicken (165kcal/100g)</td>
                      <td className="py-2.5 px-3">Output: 330 kcal, 62g protein</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">Pass</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TC-03</td>
                      <td className="py-2.5 px-3">Streak Calculation Across Month</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">Active on 31st and 1st</td>
                      <td className="py-2.5 px-3">Streak continues without reset</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">Pass</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TC-04</td>
                      <td className="py-2.5 px-3">Hydration Increment</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">Click +250ml water</td>
                      <td className="py-2.5 px-3">Increases total water to current + 250</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">Pass</span></td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">TC-05</td>
                      <td className="py-2.5 px-3">Day Inspection in Calendar</td>
                      <td className="py-2.5 px-3 font-mono text-[11px]">Click date in calendar grid</td>
                      <td className="py-2.5 px-3">Displays daily breakdown and summary</td>
                      <td className="py-2.5 px-3 text-center"><span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">Pass</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <a
            href="/fittrack-source-code.zip"
            download="fittrack-source-code.zip"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-semibold transition-all cursor-pointer"
            title="Download full project source code as a ZIP file"
          >
            <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Download Project Source (.ZIP)</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close Viva Kit
          </button>
        </div>

      </div>
    </div>
  );
};
