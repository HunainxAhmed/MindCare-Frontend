import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, MessageSquare, Settings, Activity, X, Trash2 } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, sessions, activeSessionId, onNewSession, onSelectSession, onDeleteSession, onOpenSettings }) {
  const sidebarVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <div className="hidden md:flex w-72 bg-white/60 dark:bg-slate-900/40 backdrop-blur-3xl border-r border-slate-200/50 dark:border-slate-800/50 flex-col h-full z-20 shadow-[4px_0_24px_rgba(0,0,0,0.05)] dark:shadow-none transition-colors duration-500 relative">
        {/* Subtle inner highlight */}
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-white/70 dark:via-slate-700/50 to-transparent pointer-events-none"></div>
        <SidebarContent 
          sessions={sessions} activeSessionId={activeSessionId} onNewSession={onNewSession} onSelectSession={onSelectSession} onDeleteSession={onDeleteSession} onOpenSettings={onOpenSettings}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed" animate="open" exit="closed" variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-72 bg-white/90 dark:bg-slate-900/80 backdrop-blur-2xl border-r border-slate-200/50 dark:border-slate-700/50 flex flex-col h-full z-50 md:hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-slate-100/80 dark:bg-slate-800/50 hover:bg-slate-200/80 dark:hover:bg-slate-700/50 rounded-full transition-all">
              <X size={18} />
            </button>
            <SidebarContent 
              sessions={sessions} activeSessionId={activeSessionId} onNewSession={onNewSession} onSelectSession={onSelectSession} onDeleteSession={onDeleteSession} onOpenSettings={onOpenSettings}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ sessions, activeSessionId, onNewSession, onSelectSession, onDeleteSession, onOpenSettings }) {
  // Staggered animation variants
  const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
  const item = { hidden: { opacity: 0, x: -10 }, show: { opacity: 1, x: 0 } };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 px-2 py-4 mb-4">
        <div className="p-2.5 bg-gradient-to-br from-clinical-50 to-clinical-100 dark:from-clinical-900/80 dark:to-clinical-800/50 text-clinical-600 dark:text-clinical-300 rounded-xl shadow-inner border border-clinical-200/50 dark:border-clinical-700/50">
          <Activity size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="font-semibold text-slate-800 dark:text-slate-100 text-lg tracking-tight">MindCare AI</h1>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            MindCare Ai Online
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.02, y: -1 }} whileTap={{ scale: 0.98 }}
        onClick={onNewSession}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-clinical-500 to-clinical-600 text-white rounded-xl shadow-[0_4px_14px_rgba(75,136,157,0.3)] dark:shadow-[0_4px_14px_rgba(75,136,157,0.15)] hover:shadow-[0_6px_20px_rgba(75,136,157,0.4)] mb-6 w-full font-medium transition-all"
      >
        <PlusCircle size={18} />
        New Session
      </motion.button>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[11px] font-bold text-slate-400 px-2 mb-3 uppercase tracking-widest">Chat History</p>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
          {sessions.map((session) => (
            <motion.div key={session.id} variants={item} className="relative group">
              <button 
                onClick={() => onSelectSession(session.id)}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left transition-all text-sm relative overflow-hidden group-hover:pr-10 ${
                  session.id === activeSessionId 
                    ? 'bg-white/80 dark:bg-slate-800/60 text-clinical-900 dark:text-clinical-100 font-medium border border-white/80 dark:border-slate-700/50 shadow-[0_2px_10px_rgba(0,0,0,0.04)]' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-white/60 dark:hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {session.id === activeSessionId && (
                  <motion.div layoutId="activeHighlight" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-clinical-500 rounded-r-full" />
                )}
                <MessageSquare size={16} className={`relative z-10 transition-colors ${session.id === activeSessionId ? 'text-clinical-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
                <span className="truncate relative z-10 block pr-2">{session.title}</span>
              </button>
              
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg opacity-100 md:opacity-0 group-hover:opacity-100 transition-all z-20"
                title="Delete Session"
              >
                <Trash2 size={14} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="pt-4 mt-auto border-t border-slate-200/50 dark:border-slate-700/50">
        <button onClick={onOpenSettings} className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-all w-full group border border-transparent hover:border-white/50 dark:hover:border-slate-700/50">
          <Settings size={18} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}