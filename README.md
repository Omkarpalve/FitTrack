# FitTrack – Personal Fitness and Nutrition Tracker

> Final-Year College Mini-Project / Web Application built with React 19, TypeScript, Tailwind CSS, Chart.js, and Vite. Includes full dual-mode Dark/Light theme, interactive monthly calendar, calorie & protein tracking, habit streaks, and comprehensive analytical reports.

---

## 🚀 Quick Start (Run Locally)

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

### 2. Installation
Open your terminal in this extracted project folder and run:

```bash
# Install all required dependencies
npm install

# Start the local development server
npm run dev
```

Open your browser and navigate to `http://localhost:3000` (or the URL shown in your terminal).

---

## 🌐 Deploy to Vercel (100% Free Hosting)

### Method A: Connect with GitHub
1. Create a free account on [Vercel.com](https://vercel.com) and [GitHub.com](https://github.com).
2. Create a new repository on GitHub (named e.g. `fittrack`).
3. Push these project files to your GitHub repository:
   ```bash
   git init
   git add .
   git commit -m "FitTrack project initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/fittrack.git
   git push -u origin main
   ```
4. On [vercel.com](https://vercel.com), click **"Add New..."** → **"Project"**.
5. Select your `fittrack` repository and click **"Deploy"**.
6. The `vercel.json` included in this repository handles routing automatically. Your website will be live in 30 seconds!

---

## 📁 Project Structure

```text
├── index.html                 # HTML5 Entry Point
├── package.json               # NPM Dependencies & Build Scripts
├── vite.config.ts             # Vite Configuration
├── vercel.json                # Vercel SPA Routing Configuration
├── netlify.toml               # Netlify SPA Routing Configuration
├── tsconfig.json              # TypeScript Compiler Settings
├── public/                    # Static Assets
└── src/
    ├── App.tsx                # Main App Router & State Container
    ├── main.tsx               # React DOM Entry Point
    ├── index.css              # Global CSS & Tailwind Setup
    ├── types/
    │   └── index.ts           # TypeScript Interfaces & Data Models
    ├── data/
    │   └── predefinedFoods.ts # Preloaded Nutrition & Food Database
    ├── utils/
    │   └── storage.ts         # LocalStorage Engine, Streaks, Mock Data
    └── components/
        ├── Navbar.tsx         # Header, Navigation, Date Stepper & Theme Toggle
        ├── DashboardView.tsx  # Daily Metrics, Progress Rings, Quick Actions
        ├── FoodTrackerView.tsx# Food Logger, Nutrition Calculator, Custom Foods
        ├── WorkoutTrackerView.tsx # Workout & Water Logger, Exercise History
        ├── CalendarView.tsx   # Interactive Monthly Fitness Calendar
        ├── HabitsView.tsx     # Consistency Streaks & Daily Habit Checklists
        ├── ReportsView.tsx    # Weekly & Monthly Chart.js Trends & Analytics
        ├── ProfileView.tsx    # User Goals & Metric Customization
        ├── AuthModal.tsx      # Login, Registration & Demo Account Access
        ├── VivaKitModal.tsx   # Project Viva Kit (ERD, Architecture, Flask Code)
        └── DeployGuideModal.tsx # Interactive Hosting & Deployment Center
```

---

## 🎓 Academic Presentation Notes

- **Client State**: Powered by persistent local storage with automated initialization and date-partitioned indexes.
- **Charts**: Integrated using Chart.js with responsive canvas layouts.
- **Theming**: System-aware and user-toggled Tailwind dark/light mode with CSS variables.
- **Viva Kit**: Access the **"Project Viva Kit"** inside the app for complete System Architecture diagrams, Database ER diagrams, test cases, and Python Flask + SQLite code.
