import React, { useState } from 'react';
import { 
  X, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Cloud, 
  Download,
  FolderDown,
  UploadCloud,
  Zap, 
  Server, 
  FileCode, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Share2,
  FolderArchive,
  MousePointerClick
} from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'download' | 'instant' | 'vercel' | 'netlify' | 'flask'>('download');

  const sharedAppUrl = 'https://ais-pre-hphq77wrk5ie4ofj6q4ys7-764944504655.asia-northeast1.run.app';
  const devAppUrl = 'https://ais-dev-hphq77wrk5ie4ofj6q4ys7-764944504655.asia-northeast1.run.app';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(label);
    setTimeout(() => setCopiedLink(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 dark:bg-slate-950 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <span>Export & Online Hosting Hub</span>
                <span className="px-2 py-0.5 bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[10px] rounded-full uppercase tracking-wider font-bold">
                  Beginner Friendly
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Download your project zip or deploy online with step-by-step guidance.
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6 gap-2 shrink-0 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'download', label: '1. Download Code (.ZIP)', icon: <FolderDown className="w-3.5 h-3.5 text-blue-500" /> },
            { id: 'instant', label: '2. Live URL Right Now', icon: <Zap className="w-3.5 h-3.5 text-amber-500" /> },
            { id: 'vercel', label: '3. Host on Vercel', icon: <Cloud className="w-3.5 h-3.5 text-indigo-500" /> },
            { id: 'netlify', label: '4. Drag & Drop on Netlify', icon: <Globe className="w-3.5 h-3.5 text-emerald-500" /> },
            { id: 'flask', label: '5. Python Flask Backend', icon: <Server className="w-3.5 h-3.5 text-purple-500" /> },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-3 px-3 border-b-2 cursor-pointer transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'border-emerald-600 text-emerald-800 dark:text-emerald-300 bg-white dark:bg-slate-900 font-bold' 
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto text-xs sm:text-sm text-slate-700 dark:text-slate-300 space-y-6">
          
          {/* TAB 1: DOWNLOAD PROJECT ZIP (FOR ABSOLUTE BEGINNERS) */}
          {activeTab === 'download' && (
            <div className="space-y-5">
              
              {/* Highlight Download Card */}
              <div className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-700/60 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                      <FolderArchive className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white">
                        Download Entire Codebase (.ZIP)
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                        Includes all source files (<code className="bg-white/80 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">src/</code>, <code className="bg-white/80 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">package.json</code>, <code className="bg-white/80 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">vercel.json</code>, <code className="bg-white/80 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">README.md</code>, etc.).
                      </p>
                    </div>
                  </div>

                  <a
                    href="/fittrack-source-code.zip"
                    download="fittrack-source-code.zip"
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download ZIP Now (~94 KB)</span>
                  </a>
                </div>
              </div>

              {/* Zero-Terminal Step-by-Step Guide */}
              <div className="space-y-3">
                <h5 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <MousePointerClick className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>How to Use the Downloaded Code (No Terminal Needed!)</span>
                </h5>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  
                  {/* Step 1 */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold text-xs flex items-center justify-center">
                      1
                    </div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-xs">
                      Extract (Unzip) the File
                    </h6>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Go to your computer's <strong>Downloads</strong> folder. Right-click <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">fittrack-source-code.zip</code> and select <strong>"Extract All..."</strong> (Windows) or double-click it (Mac).
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center">
                      2
                    </div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-xs">
                      Upload to GitHub Website
                    </h6>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">github.com/new</a>, create a repo, and click <strong>"uploading an existing file"</strong>. Drag in all extracted files and click "Commit"!
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center justify-center">
                      3
                    </div>
                    <h6 className="font-bold text-slate-900 dark:text-white text-xs">
                      Connect to Vercel
                    </h6>
                    <p className="text-[11px] text-slate-600 dark:text-slate-300">
                      Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">vercel.com</a>, click "Add New Project", choose your GitHub repository, and click <strong>Deploy</strong>. Done!
                    </p>
                  </div>

                </div>
              </div>

              {/* Native AI Studio Interface Export Option */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl space-y-2">
                <h6 className="font-bold text-amber-950 dark:text-amber-200 text-xs flex items-center gap-1.5">
                  <UploadCloud className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Also available directly in Google AI Studio interface:</span>
                </h6>
                <p className="text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
                  Look at the top-right corner of the Google AI Studio screen. You can find the <strong>Export / Download</strong> icon or 3-dot menu icon to export directly to GitHub or download your workspace anytime.
                </p>
              </div>

            </div>
          )}

          {/* TAB 2: Instant Live URL */}
          {activeTab === 'instant' && (
            <div className="space-y-5">
              <div className="p-4 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm">
                    Great News: Your Website is Already Hosted Online!
                  </h4>
                </div>
                <p className="text-emerald-900 dark:text-emerald-300 text-xs leading-relaxed ml-7">
                  FitTrack is already running live on high-speed cloud infrastructure. Anyone in the world with this link can open and use the application on their phone, laptop, or tablet.
                </p>
              </div>

              {/* Main Shared URL Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Production Shareable Link (For Teachers, Evaluators & Peers)
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Online 24/7
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={sharedAppUrl}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 select-all"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleCopy(sharedAppUrl, 'shared')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      {copiedLink === 'shared' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedLink === 'shared' ? 'Copied!' : 'Copy Link'}</span>
                    </button>
                    <a
                      href={sharedAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors"
                    >
                      <span>Open Link</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Development URL Card */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                  Interactive Development Environment Link
                </span>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={devAppUrl}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 dark:text-slate-100 select-all"
                  />
                  <button
                    onClick={() => handleCopy(devAppUrl, 'dev')}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {copiedLink === 'dev' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink === 'dev' ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Vercel Deployment */}
          {activeTab === 'vercel' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 rounded-xl">
                <h4 className="font-bold text-blue-950 dark:text-blue-200 text-sm mb-1">
                  How to Host for Free on Vercel
                </h4>
                <p className="text-xs text-blue-800 dark:text-blue-300">
                  Vercel provides free global hosting, automatic SSL (https), and custom domain support with zero setup. We have already included <code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">vercel.json</code> in this project!
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Option A: Drag-and-drop onto GitHub (No Terminal)
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>Download the ZIP from Tab 1 and unzip it.</li>
                    <li>Go to <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">github.com/new</a> and create a repository called <code className="font-mono bg-slate-200 dark:bg-slate-700 px-1 rounded">fittrack</code>.</li>
                    <li>Click the link that says <strong>"uploading an existing file"</strong>.</li>
                    <li>Select all files from your unzipped folder and drag them in, then click <strong>"Commit changes"</strong>.</li>
                    <li>Go to <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">vercel.com</a>, log in with GitHub, click <strong>"Add New Project"</strong>, select your repository, and click <strong>"Deploy"</strong>!</li>
                  </ol>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Option B: If you know Git (Command Line)
                  </span>
                  <div className="bg-slate-950 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                    git init<br/>
                    git add .<br/>
                    git commit -m "Initial FitTrack commit"<br/>
                    git branch -M main<br/>
                    git remote add origin https://github.com/YOUR_USERNAME/fittrack.git<br/>
                    git push -u origin main
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Netlify Deployment */}
          {activeTab === 'netlify' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-xl">
                <h4 className="font-bold text-emerald-950 dark:text-emerald-200 text-sm mb-1">
                  10-Second Drag & Drop Hosting on Netlify (No Git Required)
                </h4>
                <p className="text-xs text-emerald-800 dark:text-emerald-300">
                  If you don't want to use GitHub at all, Netlify lets you build the app and drag the production folder directly into their web interface.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Step 1: Generate the Production Build
                  </span>
                  <div className="bg-slate-950 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] overflow-x-auto">
                    npm run build
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    This creates an optimized, self-contained <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">dist/</code> folder.
                  </p>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Step 2: Drop on Netlify
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>Go to <a href="https://app.netlify.com/drop" target="_blank" rel="noopener noreferrer" className="text-emerald-600 dark:text-emerald-400 underline font-semibold">app.netlify.com/drop</a>.</li>
                    <li>Drag and drop the entire <strong>dist</strong> folder into the upload circle on the webpage.</li>
                    <li>Netlify generates a public HTTPS URL instantly (e.g. <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">fittrack-live.netlify.app</code>)!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Python Flask Backend Hosting */}
          {activeTab === 'flask' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60 rounded-xl">
                <h4 className="font-bold text-purple-950 dark:text-purple-200 text-sm mb-1">
                  Hosting the Python Flask + SQLite Backend (Render / PythonAnywhere)
                </h4>
                <p className="text-xs text-purple-800 dark:text-purple-300">
                  If your college viva project specifically requires demonstrating the Python Flask backend with SQLite (<code className="bg-white/80 dark:bg-slate-800 px-1 py-0.5 rounded font-mono">app.py</code>), you can host it for free online using <strong>Render.com</strong> or <strong>PythonAnywhere</strong>.
                </p>
              </div>

              <div className="space-y-3">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl space-y-1.5">
                  <span className="font-bold text-slate-900 dark:text-white text-xs block">
                    Deploying on Render.com (Free Web Service)
                  </span>
                  <ol className="list-decimal pl-4 space-y-1 text-xs text-slate-600 dark:text-slate-300">
                    <li>Push the <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">app.py</code> and <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">requirements.txt</code> from the Viva Kit to a GitHub repository.</li>
                    <li>In Render dashboard, click <strong>"New +" → "Web Service"</strong>.</li>
                    <li>Set Build Command: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">pip install -r requirements.txt</code></li>
                    <li>Set Start Command: <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">gunicorn app:app</code> or <code className="bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded font-mono">python app.py</code></li>
                    <li>Render hosts the Python Flask application with full SQLite database support online.</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <a
            href="/fittrack-source-code.zip"
            download="fittrack-source-code.zip"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Project ZIP</span>
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
