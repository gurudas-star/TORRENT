import { motion } from 'motion/react';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-800/80 border border-slate-700/60 w-fit text-slate-400">
      <span className="text-xs text-slate-300 font-medium mr-1">ANN is typing</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}
