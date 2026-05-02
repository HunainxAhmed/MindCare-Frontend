import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-transparent">
      <div className="max-w-3xl mx-auto">
        <form 
          onSubmit={handleSubmit}
          className="relative flex items-end gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm rounded-2xl p-2 transition-all focus-within:shadow-md focus-within:border-clinical-500/30 dark:focus-within:border-clinical-500/50"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind..."
            disabled={disabled}
            className="w-full max-h-32 min-h-[44px] bg-transparent text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 px-4 py-3 focus:outline-none resize-none disabled:opacity-50 text-[15px]"
            rows={1}
            style={{ 
              height: 'auto',
              maxHeight: '120px' 
            }}
          />
          <motion.button
            whileHover={!disabled && text.trim() ? { scale: 1.05 } : {}}
            whileTap={!disabled && text.trim() ? { scale: 0.95 } : {}}
            type="submit"
            disabled={disabled || !text.trim()}
            className="p-3 mb-1 mr-1 rounded-xl bg-clinical-600 dark:bg-clinical-500 text-white disabled:bg-slate-100 dark:disabled:bg-slate-700 disabled:text-slate-400 dark:disabled:text-slate-500 transition-colors flex-shrink-0"
          >
            <Send size={18} className={!disabled && text.trim() ? "translate-x-0.5 -translate-y-0.5" : ""} />
          </motion.button>
        </form>
        <div className="text-center mt-3 text-xs text-slate-400 dark:text-slate-500">
          MindCare AI is an AI assistant. In an emergency, please contact your local emergency services.
        </div>
      </div>
    </div>
  );
}