import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Type, Volume2, VolumeX, Eye, X, Globe } from 'lucide-react';
import { Language } from '../types';

interface AccessibilityBarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  fontScale: number;
  setFontScale: (scale: number) => void;
  highContrast: boolean;
  setHighContrast: (hc: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (se: boolean) => void;
}

export function AccessibilityBar({
  language,
  onLanguageChange,
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  soundEnabled,
  setSoundEnabled
}: AccessibilityBarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button - Placed at Top Right Corner with ample clearance below header */}
      <div className="fixed top-32 right-5 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="bg-white/95 hover:bg-white border border-slate-300 text-cyan-700 p-2.5 rounded-full shadow-lg backdrop-blur-xl flex items-center gap-2 text-xs font-bold ring-2 ring-cyan-500/20"
          title="Accessibility & Language Preferences"
        >
          <Eye className="w-4 h-4 text-cyan-600 animate-pulse" />
          <span className="hidden sm:inline text-[11px] font-bold tracking-wide">Accessibility</span>
        </motion.button>
      </div>

      {/* Slide-out Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="fixed top-44 right-5 z-50 w-72 bg-white border border-slate-200 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl text-slate-900 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
              <div className="flex items-center gap-2 font-bold text-cyan-700">
                <Eye className="w-4 h-4" />
                <span>Accessibility Options</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-800 p-1">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Language Selection */}
            <div className="mb-4">
              <label className="text-[11px] text-slate-600 font-bold block mb-1.5 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-cyan-600" />
                <span>Display Language</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
                {(['EN', 'HI', 'GU'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => onLanguageChange(lang)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition ${
                      language === lang
                        ? 'bg-cyan-600 text-white shadow-md'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'ગુજરાતી'}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Scaling */}
            <div className="mb-4">
              <label className="text-[11px] text-slate-600 font-bold block mb-1.5 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-cyan-600" />
                <span>Text Size Scale: {(fontScale * 100).toFixed(0)}%</span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFontScale(Math.max(0.9, fontScale - 0.05))}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold hover:bg-slate-200"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="0.9"
                  max="1.25"
                  step="0.05"
                  value={fontScale}
                  onChange={(e) => setFontScale(parseFloat(e.target.value))}
                  className="flex-1 accent-cyan-600 cursor-pointer"
                />
                <button
                  onClick={() => setFontScale(Math.min(1.25, fontScale + 0.05))}
                  className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg font-bold hover:bg-slate-200"
                >
                  A+
                </button>
              </div>
            </div>

            {/* High Contrast Mode */}
            <div className="flex items-center justify-between py-2 border-t border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Sun className="w-3.5 h-3.5 text-amber-500" />
                <span>High Contrast Mode</span>
              </span>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-10 h-5 rounded-full p-0.5 transition ${
                  highContrast ? 'bg-cyan-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition transform ${
                    highContrast ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Sound Feedback */}
            <div className="flex items-center justify-between py-2 border-t border-slate-200">
              <span className="flex items-center gap-1.5 text-slate-800 font-semibold">
                {soundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>Sound Feedback</span>
              </span>
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`w-10 h-5 rounded-full p-0.5 transition ${
                  soundEnabled ? 'bg-cyan-600' : 'bg-slate-200'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow transition transform ${
                    soundEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
