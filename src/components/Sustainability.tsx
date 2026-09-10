import { motion } from 'motion/react';
import { Leaf, Sun, Wind, Recycle, ArrowRight, Zap, HeartHandshake } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface SustainabilityProps {
  language: Language;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function Sustainability({ language, onOpenAnnChatbot }: SustainabilityProps) {
  const dict = DICTIONARY[language];

  const flowNodes = [
    { label: 'Generation', desc: 'Solar, Wind & Hydro Parks', icon: Sun },
    { label: 'Smart Distribution', desc: 'Ultra-High Voltage HVDC Grid', icon: Zap },
    { label: 'Efficient Consumption', desc: 'Smart Metered Cities', icon: Leaf },
    { label: 'Sustainable Future', desc: 'Zero Carbon Footprint Target', icon: Recycle }
  ];

  const pillars = [
    {
      title: 'Charanka Solar Park',
      val: '2,002 MW',
      desc: 'Utility-scale solar & wind energy assets unlocking India’s green energy potential.',
      image: 'http://torrentpower.com/public/images/coverimages/home/tpl-solar.jpg',
      icon: Sun,
      color: 'bg-amber-100 text-amber-800 border-amber-300'
    },
    {
      title: 'REACH CSR Movement',
      val: '71,000+ Kids',
      desc: 'Community Healthcare & Child Well-being initiated by Founder Mr. U. N. Mehta.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/empowering_society.jpg',
      icon: HeartHandshake,
      color: 'bg-cyan-100 text-cyan-800 border-cyan-300'
    },
    {
      title: 'Energy Efficiency',
      val: '99.2%',
      desc: 'Superconducting EHV lines delivering electricity with lowest distribution losses.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/slider-5.jpg',
      icon: Zap,
      color: 'bg-emerald-100 text-emerald-800 border-emerald-300'
    },
    {
      title: 'Ecological Plantation',
      val: '100% Eco Care',
      desc: 'Mass tree plantation and ecological conservation around all generation facilities.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/EH2.jpg',
      icon: Recycle,
      color: 'bg-green-100 text-green-800 border-green-300'
    }
  ];

  return (
    <section id="sustainability" className="relative py-20 bg-slate-50 border-b border-slate-200 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Leaf className="w-3.5 h-3.5" />
            <span>BEYOND BUSINESS • CSR & GREEN GRID</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            {dict.sustainabilityTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            "Think of others also, when you think about yourself." — Torrent Founder Mr. U. N. Mehta's vision driving community healthcare, education, and 2,002 MW green power.
          </p>
        </div>

        {/* Energy Flow Interactive Pipeline Diagram */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl mb-16 relative overflow-hidden">
          <div className="text-center mb-8">
            <h3 className="text-xl font-bold text-slate-900">Torrent Clean Energy & Distribution Value Chain</h3>
            <p className="text-xs text-slate-500">Simulating electricity movement from renewable generation to eco-friendly homes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {flowNodes.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={i} className="flex flex-col items-center text-center relative z-10">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-16 h-16 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 flex items-center justify-center shadow-md mb-3 relative group"
                  >
                    <Icon className="w-8 h-8" />
                    <span className="absolute inset-0 rounded-3xl bg-emerald-400/20 animate-ping opacity-75" />
                  </motion.div>

                  <h4 className="font-bold text-slate-900 text-sm">{node.label}</h4>
                  <p className="text-xs text-slate-600 mt-1 max-w-[180px]">{node.desc}</p>

                  {i < flowNodes.length - 1 && (
                    <div className="hidden md:flex absolute top-8 left-[75%] w-[50%] items-center justify-center pointer-events-none z-0">
                      <div className="w-full h-0.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 relative">
                        <motion.div
                          animate={{ x: [0, 80, 0] }}
                          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-3 h-3 rounded-full bg-cyan-600 shadow-md absolute -top-1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Cards featuring Official Images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, index) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-emerald-400 transition group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                    <div className={`absolute top-3 left-3 w-9 h-9 rounded-xl ${p.color} border flex items-center justify-center shadow-md`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="text-xl font-black text-slate-900 tracking-tight">{p.val}</div>
                    <h3 className="text-base font-bold text-slate-800 mt-1 group-hover:text-emerald-700 transition">{p.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{p.desc}</p>
                  </div>
                </div>

                <div className="p-5 pt-0 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <span>Torrent Core Value</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Net Metering CTA */}
        <div className="mt-12 text-center">
          <button
            onClick={() => onOpenAnnChatbot('connection_start')}
            className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg shadow-emerald-600/25 transition"
          >
            <span>Apply for Rooftop Solar Net-Metering Today</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
