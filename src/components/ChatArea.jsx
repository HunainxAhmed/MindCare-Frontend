import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Sparkles, HeartPulse } from 'lucide-react';

const QUICK_PROMPTS = [
  "I'm feeling really overwhelmed today.",
  "I'm having trouble sleeping.",
  "Can we do a grounding exercise?",
  "I just need someone to listen."
];

export default function ChatArea({ messages, isLoading, onQuickPrompt }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const isNewSession = messages.length === 1;

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth custom-scrollbar relative">
      <div className="max-w-3xl mx-auto space-y-8 pb-4">
        
        {/* Welcome Graphics for New Sessions */}
        <AnimatePresence>
          {isNewSession && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center justify-center pt-8 pb-4 text-center"
            >
              <div className="w-16 h-16 bg-clinical-100 dark:bg-clinical-900/50 rounded-2xl flex items-center justify-center mb-4 text-clinical-600 dark:text-clinical-400 shadow-sm border border-clinical-200/50 dark:border-clinical-700/50">
                <HeartPulse size={32} strokeWidth={1.5} />
              </div>
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">Welcome to MindCare</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
                Your private, secure space to reflect and find balance. How can I support you right now?
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chat Messages */}
        <div className="space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </AnimatePresence>
        </div>

        {/* Quick Prompts (Only show if new session and not loading) */}
        <AnimatePresence>
          {isNewSession && !isLoading && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-8"
            >
              {QUICK_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }} whileTap={{ scale: 0.98 }}
                  onClick={() => onQuickPrompt(prompt)}
                  className="p-4 text-sm text-left bg-white/70 dark:bg-slate-900/40 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl text-slate-700 dark:text-slate-300 hover:border-clinical-400/50 hover:bg-white/90 dark:hover:bg-slate-800/60 transition-all shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                >
                  {prompt}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-start items-end gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-clinical-500 to-clinical-400 flex items-center justify-center flex-shrink-0 shadow-md border border-clinical-100 dark:border-slate-700">
                <Sparkles size={14} className="text-white" />
              </div>
              <div className="bg-white/80 dark:bg-slate-800/60 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.03)] rounded-2xl rounded-bl-sm px-5 py-4 flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium mr-1">MindCare Ai is typing</span>
                <motion.div className="flex gap-1.5">
                  {[0, 1, 2].map((dot) => (
                    <motion.div key={dot} className="w-1.5 h-1.5 bg-clinical-500/80 rounded-full"
                      animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: dot * 0.15 }}
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} className="h-2" />
      </div>
    </div>
  );
}

function MessageBubble({ message }) {
  const isAI = message.sender === 'ai' || message.sender === 'assistant';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, type: "spring", bounce: 0.3 }}
      // FIX: Added w-full and removed flex-row-reverse for perfect alignment
      className={`w-full flex items-end gap-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      {/* AI Avatar (Only renders on the left if it's AI) */}
      {isAI && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border bg-gradient-to-tr from-clinical-500 to-clinical-400 border-clinical-100 dark:border-slate-700">
          <Sparkles size={14} className="text-white" />
        </div>
      )}

      {/* Message Content */}
      <div className={`flex flex-col ${isAI ? 'items-start' : 'items-end'} max-w-[80%] sm:max-w-[70%]`}>
        <div className={`whitespace-pre-wrap px-5 py-3.5 text-[15px] leading-relaxed text-left transition-all duration-300 ${
          isAI
            ? `bg-white/80 dark:bg-slate-800/70 backdrop-blur-xl border border-white/80 dark:border-slate-700/50 rounded-2xl rounded-bl-sm text-slate-700 dark:text-slate-200 shadow-[0_4px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.03)] ${message.isError ? 'border-red-200/50 text-red-600 bg-red-50/50 dark:bg-red-900/20' : ''}`
            : 'bg-gradient-to-br from-clinical-500 to-clinical-600 text-white rounded-2xl rounded-br-sm shadow-[0_4px_14px_rgba(75,136,157,0.25)]'
        }`}>
          {message.text}
        </div>
        
        {/* Timestamp */}
        {message.timestamp && (
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mt-1.5 px-1">
            {message.timestamp}
          </span>
        )}
      </div>

      {/* User Avatar (Only renders on the right if it's the User) */}
      {!isAI && (
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border bg-slate-200 dark:bg-slate-700 border-slate-50 dark:border-slate-600">
          <User size={16} className="text-slate-600 dark:text-slate-300" />
        </div>
      )}
    </motion.div>
  );
}