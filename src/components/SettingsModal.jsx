import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Shield, Palette, Info, Trash2, Download } from 'lucide-react';

export default function SettingsModal({ isOpen, onClose, token, onLogout, sessions, setSessions, isDarkMode, toggleDarkMode }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && token) {
      fetchProfile();
    }
  }, [isOpen, token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setProfile(await response.json());
      }
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const handleDeleteAllChats = async () => {
    if (!window.confirm("Are you sure you want to permanently delete all your chats? This cannot be undone.")) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/api/sessions/all', {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSessions([]);
        onClose();
      }
    } catch (err) {
      console.error("Failed to delete chats", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sessions, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "mindcare_chat_history.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'My Profile' },
    { id: 'privacy', icon: Shield, label: 'Data & Privacy' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'about', icon: Info, label: 'About' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-slate-900/80 z-50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-full max-w-4xl h-[90vh] md:h-[600px] max-h-[90vh] bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] z-50 flex flex-col md:flex-row overflow-hidden border border-white/60 dark:border-slate-700/50"
          >
            {/* Modal Sidebar */}
            <div className="w-full md:w-64 bg-white/40 dark:bg-slate-800/40 border-b md:border-b-0 md:border-r border-white/50 dark:border-slate-700/50 p-4 flex flex-col shrink-0 relative">
              <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/50 dark:via-slate-600/50 to-transparent pointer-events-none hidden md:block"></div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 md:mb-6 px-2 hidden md:block">Settings</h2>
              
              <div className="flex items-center justify-between md:hidden mb-4 px-2">
                 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Settings</h2>
                 <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    <X size={20} />
                 </button>
              </div>

              <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0 flex-1 custom-scrollbar">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-shrink-0 md:w-full flex items-center gap-2 md:gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium relative overflow-hidden ${
                        isActive 
                          ? 'bg-white/80 dark:bg-slate-800/80 text-clinical-600 dark:text-clinical-400 shadow-sm border border-white/60 dark:border-slate-700/50' 
                          : 'text-slate-600 dark:text-slate-400 hover:bg-white/50 dark:hover:bg-slate-800/50 border border-transparent'
                      }`}
                    >
                      <Icon size={18} className="hidden sm:block md:block" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
              
              <div className="hidden md:block pt-4 border-t border-white/50 dark:border-slate-700/50 z-10">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-white/60 dark:hover:bg-red-900/20 rounded-xl transition-all border border-transparent hover:border-white/50 dark:hover:border-red-900/30"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto relative bg-transparent z-10">
              <button 
                onClick={onClose} 
                className="hidden md:block absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={20} />
              </button>

              {activeTab === 'profile' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">My Profile</h3>
                  
                  {profile ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Full Name</p>
                        <p className="font-medium text-slate-900 dark:text-white">{profile.full_name || 'Not provided'}</p>
                      </div>
                      <div className="p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Email Address</p>
                        <p className="font-medium text-slate-900 dark:text-white">{profile.email}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Authentication Method</p>
                          <p className="font-medium text-slate-900 dark:text-white">{profile.auth_method}</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow">
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Chat Sessions</p>
                          <p className="font-medium text-slate-900 dark:text-white">{profile.total_sessions}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="animate-pulse space-y-4">
                      <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                        <div className="h-20 bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'privacy' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Data & Privacy</h3>
                  
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900 dark:text-white flex items-center gap-2">
                          <Download size={18} className="text-clinical-500" /> Export Chat Data
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          Download a copy of your chat history locally as a JSON file.
                        </p>
                      </div>
                      <button 
                        onClick={handleExportData}
                        className="px-4 py-2 bg-white/80 dark:bg-slate-700/80 backdrop-blur-md border border-white/50 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-white dark:hover:bg-slate-600 transition-all shadow-sm w-full sm:w-auto"
                      >
                        Export
                      </button>
                    </div>

                    <div className="p-5 rounded-2xl border border-red-200/60 dark:border-red-900/50 bg-red-50/60 dark:bg-red-900/20 backdrop-blur-xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-medium text-red-700 dark:text-red-400 flex items-center gap-2">
                          <Trash2 size={18} /> Delete All Sessions
                        </h4>
                        <p className="text-sm text-red-600/80 dark:text-red-400/80 mt-1">
                          Permanently delete all chat history. This action cannot be undone.
                        </p>
                      </div>
                      <button 
                        onClick={handleDeleteAllChats}
                        disabled={isLoading}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors whitespace-nowrap w-full sm:w-auto text-center"
                      >
                        {isLoading ? 'Deleting...' : 'Delete All'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">Appearance</h3>
                  
                  <div className="p-5 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-slate-900 dark:text-white">Dark Mode</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Toggle between light and dark themes.
                      </p>
                    </div>
                    <button 
                      onClick={toggleDarkMode}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDarkMode ? 'bg-clinical-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'about' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-6">About MindCare AI</h3>
                  
                  <div className="prose dark:prose-invert text-sm text-slate-600 dark:text-slate-400 space-y-4 p-5 rounded-2xl border border-white/60 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/40 backdrop-blur-xl shadow-sm">
                    <p>
                      <strong>MindCare AI</strong> is an advanced, privacy-first mental health companion designed to provide a safe space for reflection and support.
                    </p>
                    <p>
                      <strong>Privacy First:</strong> We employ a pure NLP pipeline using lightweight, local SentenceTransformer models (`all-MiniLM-L6-v2`) combined with strict heuristics. This ensures high-speed, local processing without relying on large language models (LLMs) that might share data with third parties.
                    </p>
                    <p>
                      <strong>Symptom Accumulation:</strong> The system continuously evaluates your dialogue to build a soft diagnostic profile, adapting its empathy and coping strategies based on clinical patterns over time.
                    </p>
                    <p>
                      <strong>Disclaimer:</strong> MindCare AI is an AI assistant, not a licensed therapist or doctor. The insights and soft diagnoses provided are for informational purposes only. If you are in crisis, please utilize the safety helplines listed or contact local emergency services immediately.
                    </p>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
