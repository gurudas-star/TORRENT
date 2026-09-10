import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Sparkles, X } from 'lucide-react';

interface ChatbotButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export function ChatbotButton({ isOpen, onToggle, unreadCount = 0 }: ChatbotButtonProps) {
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end pointer-events-auto">
      {/* First visit Tooltip */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className="mb-3 max-w-[240px] bg-slate-900/95 border border-cyan-500/50 text-slate-100 p-3 rounded-2xl shadow-xl shadow-cyan-950/50 backdrop-blur-md relative text-xs leading-snug flex items-start gap-2 group"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-cyan-400 block mb-0.5">ANN Assistant</span>
              <span>Hi! I'm ANN. How can I help you today?</span>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3.5 h-3.5" />
            </button>
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/50 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Circular Floating Button */}
      <motion.button
        onClick={() => {
          setShowTooltip(false);
          onToggle();
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.93 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all ${
          isOpen
            ? 'bg-slate-900 border-2 border-cyan-400 text-cyan-400 shadow-cyan-500/30'
            : 'bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 text-white shadow-cyan-500/40 hover:shadow-cyan-400/60 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-slate-950'
        }`}
        aria-label="Open ANN Energy Assistant Chatbot"
      >
        {/* Glowing pulse ring */}
        <span className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping pointer-events-none opacity-75" />

        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <Bot className="w-7 h-7 text-white drop-shadow" />
            <Sparkles className="w-3 h-3 text-cyan-200 absolute -top-1 -right-1" />
          </div>
        )}

        {/* Online Status Green Dot */}
        <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full" />
      </motion.button>
    </div>
  );
}
