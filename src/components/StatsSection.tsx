import { motion } from 'motion/react';
import { ShieldCheck, Radio, Cpu, Zap, TrendingUp, PhoneCall, Users, Leaf } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface StatsSectionProps {
  language: Language;
}

export function StatsSection({ language }: StatsSectionProps) {
  const dict = DICTIONARY[language];

  const stats = [
    {
      val: 'Lowest Losses',
      label: dict.gridReliability,
      sub: 'Top T&D Efficiency in India',
      badge: 'NATIONAL BENCHMARK',
      icon: ShieldCheck,
      topBorder: 'border-t-4 border-cyan-500',
      iconBg: 'bg-cyan-50 text-cyan-600 border-cyan-200/80',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200'
    },
    {
      val: '24 / 7 Care',
      label: dict.support247,
      sub: 'Toll-Free Emergency 1912',
      badge: 'HELPLINE 1912',
      icon: Radio,
      topBorder: 'border-t-4 border-blue-500',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200/80',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200'
    },
    {
      val: '4.2 Million+',
      label: dict.smartMeters,
      sub: 'Active Consumers Served',
      badge: 'CONSUMER BASE',
      icon: Cpu,
      topBorder: 'border-t-4 border-indigo-500',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200/80',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200'
    },
    {
      val: '2,002 MW',
      label: dict.greenEnergy,
      sub: 'Renewable Power Portfolio',
      badge: 'GREEN PORTFOLIO',
      icon: Zap,
      topBorder: 'border-t-4 border-emerald-500',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200/80',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  return (
    <section className="relative py-8 sm:py-10 bg-slate-100/70 border-y border-slate-200/90 shadow-inner z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className={`bg-white ${stat.topBorder} border-x border-b border-slate-200/90 rounded-2xl p-5 shadow-sm hover:shadow-xl transition duration-300 flex flex-col justify-between group`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl ${stat.iconBg} border flex items-center justify-center shadow-xs group-hover:scale-105 transition`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md border ${stat.badgeBg}`}>
                      {stat.badge}
                    </span>
                  </div>

                  <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight group-hover:text-cyan-700 transition">
                    {stat.val}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold text-slate-800">{stat.label}</div>
                  <div className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.sub}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

