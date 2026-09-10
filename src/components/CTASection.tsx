import { motion } from 'motion/react';
import { ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface CTASectionProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function CTASection({ language, onOpenPayModal, onOpenAnnChatbot }: CTASectionProps) {
  const dict = DICTIONARY[language];

  return (
    <section className="relative py-20 bg-white z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative bg-gradient-to-r from-slate-900 via-cyan-950 to-blue-950 border border-slate-800 rounded-3xl p-8 sm:p-14 shadow-2xl overflow-hidden text-center text-white"
        >
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-cyan-500/30">
              <Zap className="w-8 h-8 stroke-[2.5]" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {dict.ctaTitle}
            </h2>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              {dict.ctaBody}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onOpenPayModal}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-extrabold text-sm sm:text-base flex items-center gap-2 shadow-xl shadow-cyan-600/30 transition border border-cyan-300/40"
              >
                <span>{dict.payBill}</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              <button
                onClick={() => onOpenAnnChatbot('main_menu')}
                className="px-8 py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-100 font-bold text-sm sm:text-base flex items-center gap-2 transition"
              >
                <span>Explore Customer Services</span>
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
