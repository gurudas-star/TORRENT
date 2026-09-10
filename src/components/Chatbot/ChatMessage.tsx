import { useState } from 'react';
import { motion } from 'motion/react';
import { ChatMessageItem, OptionChip } from '../../chatbot/types';
import { Send, Bot, User, ChevronRight, Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageItem;
  onSelectOption: (option: OptionChip) => void;
  onSubmitInput: (text: string) => void;
  isLatest: boolean;
}

export function ChatMessage({ message, onSelectOption, onSubmitInput, isLatest }: ChatMessageProps) {
  const isAnn = message.sender === 'ann';
  const [inputValue, setInputValue] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    onSubmitInput(inputValue);
    setInputValue('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex gap-3 my-3 ${isAnn ? 'justify-start' : 'justify-end'}`}
    >
      {isAnn && (
        <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 text-cyan-400 flex items-center justify-center shadow-md shrink-0 mt-0.5">
          <Bot className="w-4 h-4" />
        </div>
      )}

      <div className={`max-w-[88%] sm:max-w-[82%] ${isAnn ? 'items-start' : 'items-end'} flex flex-col`}>
        {/* Message Bubble */}
        <div
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-sm ${
            isAnn
              ? 'bg-slate-50 text-slate-800 border border-slate-200/90 rounded-tl-xs font-normal'
              : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-xs shadow-cyan-600/20 font-medium'
          }`}
        >
          {message.text}
        </div>

        <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{message.timestamp}</span>

        {/* Form Input inside Message */}
        {isAnn && message.requiresInput && isLatest && (
          <form onSubmit={handleFormSubmit} className="mt-3 w-full flex items-center gap-2">
            <input
              type={message.inputType === 'customerNumber' ? 'number' : 'text'}
              placeholder={message.placeholder || 'Type required details...'}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-white border border-slate-300 focus:border-cyan-600 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-cyan-600 transition shadow-inner"
              autoFocus
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 disabled:opacity-50 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 transition shadow-md shrink-0"
            >
              <span>Submit</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        )}

        {/* Option Chips List */}
        {isAnn && message.options && message.options.length > 0 && isLatest && (
          <div className="flex flex-col gap-2 mt-3 w-full">
            {message.options.map((opt) => {
              const isPrimary = opt.variant === 'primary';
              const isAccent = opt.variant === 'accent';
              return (
                <motion.button
                  key={opt.id}
                  title={opt.label}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onSelectOption(opt)}
                  className={`text-xs px-3.5 py-2.5 rounded-xl font-bold transition text-left flex items-center justify-between gap-2 shadow-xs group ${
                    isPrimary
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md border border-cyan-500 hover:brightness-110'
                      : isAccent
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300/80 hover:bg-emerald-100/80'
                      : 'bg-white text-slate-800 border border-slate-200 hover:bg-slate-50 hover:border-cyan-500 shadow-sm'
                  }`}
                >
                  <span className="leading-snug flex-1 break-words">{opt.label}</span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition ${isPrimary ? 'text-white/80 group-hover:translate-x-1' : 'text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1'}`} />
                </motion.button>
              );
            })}
          </div>
        )}
      </div>

      {!isAnn && (
        <div className="w-8 h-8 rounded-xl bg-cyan-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <User className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}

