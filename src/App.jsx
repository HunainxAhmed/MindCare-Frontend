import { useState, useEffect } from 'react';
// import { AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import { AnimatePresence, motion } from 'framer-motion';

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGE = { 
  id: 1, 
  text: "Hello. I'm MedCare Ai. This is a safe space. How are you feeling today?", 
  sender: 'ai',
  timestamp: getCurrentTime()
};

export default function App() {
  const [sessions, setSessions] = useState([
    { id: Date.now().toString(), title: 'New Session', messages: [INITIAL_MESSAGE] }
  ]);
  const [activeSessionId, setActiveSessionId] = useState(sessions[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const activeMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];

  const startNewSession = () => {
    const newSession = {
      id: Date.now().toString(),
      title: 'New Session',
      messages: [{ ...INITIAL_MESSAGE, id: Date.now(), timestamp: getCurrentTime() }]
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setSidebarOpen(false);
  };

  const sendMessage = async (text) => {
    if (!text.trim()) return;

    const newUserMsg = { id: Date.now(), text, sender: 'user', timestamp: getCurrentTime() };

    setSessions(prevSessions => prevSessions.map(session => {
      if (session.id === activeSessionId) {
        const isFirstUserMsg = session.messages.length === 1;
        const newTitle = isFirstUserMsg ? text.slice(0, 25) + (text.length > 25 ? '...' : '') : session.title;
        return { ...session, title: newTitle, messages: [...session.messages, newUserMsg] };
      }
      return session;
    }));

    setIsLoading(true);

    try {
      const response = await fetch('https://hunainahmed123-mindcare-ai.hf.space/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }), 
      });
      
      const data = await response.json();
      const newAiMsg = { id: Date.now() + 1, text: data.reply, sender: 'ai', timestamp: getCurrentTime() };
      
      setSessions(prevSessions => prevSessions.map(session => {
        if (session.id === activeSessionId) return { ...session, messages: [...session.messages, newAiMsg] };
        return session;
      }));
    } catch (error) {
      const errorMsg = { id: Date.now() + 1, text: "I'm having trouble connecting right now. Please try again in a moment.", sender: 'ai', isError: true, timestamp: getCurrentTime() };
      setSessions(prevSessions => prevSessions.map(session => {
        if (session.id === activeSessionId) return { ...session, messages: [...session.messages, errorMsg] };
        return session;
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900 overflow-hidden font-sans transition-colors duration-300">
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 dark:bg-slate-900/70 z-40 md:hidden backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={startNewSession}
        onSelectSession={(id) => { setActiveSessionId(id); setSidebarOpen(false); }}
      />

      <main className="flex-1 flex flex-col h-full relative">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isDarkMode={isDarkMode}
          toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        />
        
        <ChatArea messages={activeMessages} isLoading={isLoading} onQuickPrompt={sendMessage} />
        
        <InputBar onSend={sendMessage} disabled={isLoading} />
      </main>
    </div>
  );
}
