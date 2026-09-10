import { motion } from 'motion/react';
import { ShieldCheck, Smartphone, Leaf, Wifi, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface WhyChooseUsProps {
  language: Language;
}

export function WhyChooseUs({ language }: WhyChooseUsProps) {
  const dict = DICTIONARY[language];

  const features = [
    {
      title: 'Reliable',
      tagline: 'Consistent & Dependable',
      desc: 'Over 99.98% transmission uptime backed by automated n+1 redundant substation grid architecture.',
      icon: ShieldCheck,
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    },
    {
      title: 'Digital',
      tagline: 'Smart & Seamless',
      desc: 'AI chatbot, instant WhatsApp billing, zero-paper service transfers, and mobile self-service app.',
      icon: Smartphone,
      color: 'bg-blue-100 text-blue-800 border-blue-300'
    },
    {
      title: 'Sustainable',
      tagline: 'Cleaner Future',
      desc: 'Pioneering green energy tariffs, rooftop net-metering, and zero-carbon EV charging stations.',
      icon: Leaf,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'Connected',
      tagline: 'Tech-Driven Support',
      desc: 'SCADA feeder monitoring with predictive fault detection to resolve interruptions before they happen.',
      icon: Wifi,
      color: 'bg-purple-100 text-purple-800 border-purple-300'
    }
  ];

  return (
    <section id="why-choose-us" className="relative py-20 bg-white border-b border-slate-200 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>OPERATIONAL EXCELLENCE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {dict.whyChooseTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Built on decades of engineering trust, upgraded with next-generation smart technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-lg hover:shadow-2xl hover:border-cyan-500 transition-all duration-300 overflow-hidden flex flex-col justify-between"
              >
                {/* Laser scan line animation on hover */}
                <motion.div
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '200%' }}
                  transition={{ duration: 1.2, ease: 'easeInOut' }}
                  className="absolute inset-y-0 w-12 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent pointer-events-none skew-x-12"
                />

                <div>
                  <div className={`w-14 h-14 rounded-2xl ${feat.color} border flex items-center justify-center mb-5 shadow-sm group-hover:scale-110 transition`}>
                    <Icon className="w-7 h-7 stroke-[2]" />
                  </div>

                  <span className="text-[11px] font-bold text-cyan-700 uppercase tracking-widest block">
                    {feat.tagline}
                  </span>

                  <h3 className="text-2xl font-black text-slate-900 mt-1 group-hover:text-cyan-700 transition">
                    {feat.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-3 leading-relaxed">{feat.desc}</p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 group-hover:text-cyan-700 transition">
                  <span>Verified Standard</span>
                  <span className="w-2 h-2 rounded-full bg-cyan-600" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
