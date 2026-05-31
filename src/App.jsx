import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatArea from './components/ChatArea';
import InputBar from './components/InputBar';
import { AnimatePresence, motion } from 'framer-motion';
import { GoogleOAuthProvider } from '@react-oauth/google';
import AuthPage from './components/AuthPage';
import SettingsModal from './components/SettingsModal';

// Replace with your real Google Client ID if needed
const GOOGLE_CLIENT_ID = "542323993315-7ui7uohfphu9n30drs4i44fhug3g2d72.apps.googleusercontent.com";

const getCurrentTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const INITIAL_MESSAGE = { 
  id: 1, 
  text: "Hello. I'm MedCare Ai. This is a safe space. How are you feeling today?", 
  sender: 'ai',
  timestamp: getCurrentTime()
};

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleLoginSuccess = (newToken, newEmail) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('userEmail', newEmail);
    setToken(newToken);
    setUserEmail(newEmail);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setToken(null);
    setUserEmail(null);
    setSessions([]);
    setActiveSessionId(null);
  };

  useEffect(() => {
    if (token) {
      fetchSessions();
    }
  }, [token]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/api/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setSessions(data);
          if (!activeSessionId) setActiveSessionId(data[0].id);
        } else {
          startNewSession();
        }
      } else if (response.status === 401) {
        handleLogout(); // Token expired or invalid
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const activeMessages = sessions.find(s => s.id === activeSessionId)?.messages || [];

  const startNewSession = () => {
    const newId = Date.now().toString() + Math.random().toString(36).substring(2, 7);
    
    setSessions(prev => {
      // Prevent creating multiple empty sessions (React 18 strict mode double-mount issue)
      if (prev.length > 0 && prev[0].title === 'New Session' && prev[0].messages.length === 1) {
        setTimeout(() => setActiveSessionId(prev[0].id), 0);
        return prev;
      }
      
      const newSession = {
        id: newId,
        title: 'New Session',
        messages: [{ ...INITIAL_MESSAGE, id: Date.now(), timestamp: getCurrentTime() }]
      };
      
      setTimeout(() => setActiveSessionId(newSession.id), 0);
      return [newSession, ...prev];
    });
    setSidebarOpen(false);
  };

  const deleteSession = async (sessionIdToDelete) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/session/${sessionIdToDelete}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setSessions(prev => {
        const newSessions = prev.filter(s => s.id !== sessionIdToDelete);
        // If we deleted the active session, switch to the first available one, or start a new one
        if (activeSessionId === sessionIdToDelete) {
          if (newSessions.length > 0) {
            setActiveSessionId(newSessions[0].id);
          } else {
            const newSession = {
              id: Date.now().toString(),
              title: 'New Session',
              messages: [{ ...INITIAL_MESSAGE, id: Date.now(), timestamp: getCurrentTime() }]
            };
            setActiveSessionId(newSession.id);
            return [newSession];
          }
        }
        return newSessions;
      });
    } catch (error) {
      console.error("Failed to delete session:", error);
    }
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
     const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'}/chat`, {
     method: 'POST',
     headers: { 
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
     },
     body: JSON.stringify({ 
          message: text,
          session_id: activeSessionId 
        }), 
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

  if (!token) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <AuthPage onLoginSuccess={handleLoginSuccess} />
      </GoogleOAuthProvider>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-500 relative">
      
      {/* Dynamic Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-[#f8fafc] dark:bg-slate-950">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-200/70 dark:bg-clinical-900/40 blur-[120px] animate-float-1"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/60 dark:bg-indigo-900/30 blur-[140px] animate-float-2"></div>
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[40%] rounded-full bg-teal-100/60 dark:bg-teal-900/20 blur-[100px] animate-float-1" style={{ animationDelay: '5s' }}></div>
      </div>

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
        onDeleteSession={deleteSession}
        onOpenSettings={() => setShowSettings(true)}
      />

      <SettingsModal 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        token={token}
        onLogout={handleLogout}
        sessions={sessions}
        setSessions={setSessions}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
      />

      <main className="flex-1 flex flex-col h-full relative z-10 backdrop-blur-[2px]">
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