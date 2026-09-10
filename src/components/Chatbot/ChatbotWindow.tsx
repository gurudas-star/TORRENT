import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useChatbotEngine } from '../../chatbot/chatbotEngine';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { Bot, X, RotateCcw, ArrowLeft, Maximize2, Minimize2, Home, Send } from 'lucide-react';

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const { state, handleOptionClick, handleInputSubmit, handleBack, restartConversation, navigateToFlow } = useChatbotEngine();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [manualInput, setManualInput] = useState('');

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, state.messages]);

  if (!isOpen) return null;

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleInputSubmit(manualInput);
    setManualInput('');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed z-50 transition-all duration-300 ${isExpanded
            ? 'inset-2 sm:inset-6 md:inset-10 rounded-3xl'
            : 'bottom-20 right-4 sm:right-6 w-[92vw] sm:w-[420px] h-[580px] max-h-[82vh] rounded-3xl'
          } bg-white/98 border border-slate-200 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden text-slate-900`}
      >
        {/* Header */}
        <div className="bg-slate-950 border-b border-slate-800 px-4 py-3.5 flex items-center justify-between gap-3 shrink-0 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md border border-cyan-400/30">
                <Bot className="w-5 h-5 text-cyan-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-sm tracking-tight">ANN Digital Assistant</h3>
                <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold uppercase tracking-wider">
                  ASSISTANT
                </span>
              </div>
              <p className="text-[11px] text-slate-300 flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Torrent Power Customer Support Portal</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition hidden sm:flex"
              title={isExpanded ? 'Minimize Window' : 'Expand Window'}
            >
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={restartConversation}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Restart Conversation"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-red-500/20 hover:text-red-300 transition"
              title="Close Chatbot"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-3 py-2 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleBack}
              disabled={state.history.length <= 1}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition font-bold border border-slate-200/60"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
              <span>Back</span>
            </button>

            <button
              onClick={() => navigateToFlow('main_menu', {}, 'Return to Main Menu')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white text-cyan-700 font-bold transition border border-slate-200/60"
            >
              <Home className="w-3.5 h-3.5 text-cyan-600" />
              <span>Main Menu</span>
            </button>
          </div>

          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-200/70">
            Interactive Helpdesk
          </span>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-white">
          {state.messages.map((msg, index) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onSelectOption={handleOptionClick}
              onSubmitInput={handleInputSubmit}
              isLatest={index === state.messages.length - 1}
            />
          ))}
          {state.isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Bottom Input Field */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 shrink-0">
          <form onSubmit={handleManualSubmit} className="relative flex items-center">
            <input
              type="text"
              placeholder="Ask ANN anything (e.g. pay bill, report outage...)"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-2xl pl-3.5 pr-10 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-cyan-600 focus:ring-1 focus:ring-cyan-600 transition"
            />
            <button
              type="submit"
              disabled={!manualInput.trim()}
              className="absolute right-2 text-cyan-700 hover:text-cyan-800 disabled:opacity-40 p-1.5 transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
