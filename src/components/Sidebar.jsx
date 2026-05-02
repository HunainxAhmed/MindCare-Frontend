import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, MessageSquare, Settings, Activity, X } from 'lucide-react';

export default function Sidebar({ isOpen, onClose, sessions, activeSessionId, onNewSession, onSelectSession }) {
  const sidebarVariants = {
    closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  };

  return (
    <>
      <div className="hidden md:flex w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex-col h-full z-10 shadow-lg shadow-slate-200/20 dark:shadow-none transition-colors duration-300">
        <SidebarContent 
          sessions={sessions} activeSessionId={activeSessionId} onNewSession={onNewSession} onSelectSession={onSelectSession}
        />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed" animate="open" exit="closed" variants={sidebarVariants}
            className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col h-full z-50 md:hidden shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 bg-slate-50 dark:bg-slate-700/50 rounded-full">
              <X size={18} />
            </button>
            <SidebarContent 
              sessions={sessions} activeSessionId={activeSessionId} onNewSession={onNewSession} onSelectSession={onSelectSession}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SidebarContent({ sessions, activeSessionId, onNewSession, onSelectSession }) {
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
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={onNewSession}
        className="flex items-center justify-center gap-2 px-4 py-3 bg-clinical-600 dark:bg-clinical-500 text-white rounded-xl hover:bg-clinical-700 dark:hover:bg-clinical-400 transition-all shadow-md shadow-clinical-500/20 mb-6 w-full font-medium"
      >
        <PlusCircle size={18} />
        New Session
      </motion.button>

      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
        <p className="text-[11px] font-bold text-slate-400 px-2 mb-3 uppercase tracking-widest">Chat History</p>
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-1">
          {sessions.map((session) => (
            <motion.button 
              key={session.id} variants={item} onClick={() => onSelectSession(session.id)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl w-full text-left transition-all text-sm group ${
                session.id === activeSessionId 
                  ? 'bg-clinical-50 dark:bg-clinical-900/40 text-clinical-900 dark:text-clinical-100 font-medium border border-clinical-100 dark:border-clinical-800/50 shadow-sm' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/30 border border-transparent'
              }`}
            >
              <MessageSquare size={16} className={`transition-colors ${session.id === activeSessionId ? 'text-clinical-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
              <span className="truncate">{session.title}</span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50 mt-auto">
        <button className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors w-full group">
          <Settings size={18} className="text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
          <span className="font-medium text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}