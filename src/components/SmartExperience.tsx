import { useState } from 'react';
import { motion } from 'motion/react';
import { BarChart2, Zap, CheckCircle2, ShieldCheck, Bell, TrendingDown, ArrowUpRight, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';
import { MOCK_USAGE_HISTORY } from '../data/mockData';

interface SmartExperienceProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenLoginModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function SmartExperience({ language, onOpenPayModal, onOpenLoginModal, onOpenAnnChatbot }: SmartExperienceProps) {
  const dict = DICTIONARY[language];
  const [activeTab, setActiveTab] = useState<'bill' | 'analytics' | 'notifications'>('bill');

  const features = [
    { title: 'Real-time Usage Insights', desc: 'Monitor hourly kWh consumption breakdown & peak-hour load patterns.' },
    { title: 'Digital Bill Management', desc: 'Instant access to past 24 months itemized statements & green tax receipts.' },
    { title: 'Secure Online Payments', desc: 'Zero-fee UPI, NetBanking, auto-debit & debit card payment gateway.' },
    { title: 'Instant Service Requests', desc: 'Submit meter inspection, load enhancement, or solar net-metering online.' },
    { title: 'Smart Feeder Notifications', desc: 'Proactive WhatsApp & SMS alerts regarding scheduled maintenance.' }
  ];

  return (
    <section id="smart-experience" className="relative py-20 bg-white border-b border-slate-200 z-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Side: Live Interactive Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6"
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {/* Top Bar of Mock Dashboard */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center font-bold">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">Consumer Dashboard</h3>
                    <p className="text-[11px] text-slate-500 font-mono">Account: #10023456 (Active)</p>
                  </div>
                </div>

                <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
                  {(['bill', 'analytics', 'notifications'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                        activeTab === tab ? 'bg-cyan-600 text-white shadow' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab 1: Bill Summary */}
              {activeTab === 'bill' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <span className="text-slate-500 text-xs font-semibold block">Current Outstanding Bill</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-cyan-700 block mt-1">₹2,450</span>
                      <span className="text-[11px] text-amber-700 mt-1 inline-flex items-center gap-1 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Due 25 Sept 2026
                      </span>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                      <span className="text-slate-500 text-xs font-semibold block">Energy Consumed</span>
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 block mt-1">326 kWh</span>
                      <span className="text-[11px] text-emerald-700 mt-1 inline-flex items-center gap-1 font-bold">
                        <TrendingDown className="w-3 h-3" />
                        -3.2% vs last year
                      </span>
                    </div>
                  </div>

                  {/* Animated Bar Chart Preview */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="font-bold text-slate-800">Monthly Usage Comparison (kWh)</span>
                      <span className="text-cyan-700 font-mono text-[11px]">Avg: 293 kWh</span>
                    </div>

                    <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-200">
                      {MOCK_USAGE_HISTORY.map((item, idx) => {
                        const heightPct = Math.min(100, (item.kwh / 400) * 100);
                        const isLatest = idx === MOCK_USAGE_HISTORY.length - 1;
                        return (
                          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                            <div className="w-full bg-slate-200 rounded-t-lg relative flex items-end justify-center h-24 overflow-hidden">
                              <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: `${heightPct}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: idx * 0.1 }}
                                className={`w-full rounded-t-lg transition ${
                                  isLatest
                                    ? 'bg-cyan-600 shadow-md'
                                    : 'bg-slate-400 group-hover:bg-cyan-500'
                                }`}
                              />
                            </div>
                            <span className={`text-[10px] ${isLatest ? 'text-cyan-700 font-bold' : 'text-slate-500'}`}>
                              {item.month}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions inside mock widget */}
                  <div className="flex gap-3">
                    <button
                      onClick={onOpenPayModal}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-600/20"
                    >
                      <span>Pay ₹2,450 Now</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onOpenAnnChatbot('usage_start')}
                      className="py-3 px-4 rounded-xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 text-xs font-bold"
                    >
                      Full Analytics
                    </button>
                  </div>
                </div>
              )}

              {/* Tab 2: Analytics detail */}
              {activeTab === 'analytics' && (
                <div className="space-y-4 text-xs">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-800 font-semibold">
                      <span>Peak Hours (2 PM - 7 PM):</span>
                      <span className="font-bold text-amber-700">137 kWh (42%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 w-[42%]" />
                    </div>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex justify-between text-slate-800 font-semibold">
                      <span>Off-Peak Hours (11 PM - 7 AM):</span>
                      <span className="font-bold text-emerald-700">118 kWh (36%)</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[36%]" />
                    </div>
                  </div>
                  <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-xl text-cyan-900 text-[11px] font-semibold flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-600 shrink-0" />
                    <span>Shift heavy loads (Washing Machine / EV Charging) to off-peak hours to save up to 18% on monthly charges.</span>
                  </div>
                </div>
              )}

              {/* Tab 3: Notifications */}
              {activeTab === 'notifications' && (
                <div className="space-y-2 text-xs">
                  {[
                    { title: 'August Invoice Released', date: '01 Sept 2026', type: 'Billing' },
                    { title: 'Smart Meter Firmware Upgraded', date: '28 Aug 2026', type: 'System' },
                    { title: 'Scheduled Feeder Maintenance Complete', date: '20 Aug 2026', type: 'Grid' }
                  ].map((n, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-cyan-600" />
                        <div>
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-[10px] text-slate-500">{n.type} • {n.date}</p>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {/* Right Side: Copy & Bullet Points */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold uppercase tracking-wider">
              <BarChart2 className="w-3.5 h-3.5" />
              <span>DIGITAL CUSTOMER PLATFORM</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {dict.smartExpTitle} <br />
              <span className="text-cyan-700">{dict.smartExpSubTitle}</span>
            </h2>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">{dict.smartExpBody}</p>

            <div className="space-y-4 pt-2">
              {features.map((feat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-400 transition shadow-sm"
                >
                  <div className="w-7 h-7 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{feat.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{feat.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={onOpenLoginModal}
                className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm shadow-lg shadow-cyan-600/25 transition hover:brightness-110"
              >
                Access Customer Portal
              </button>
              <button
                onClick={() => onOpenAnnChatbot('main_menu')}
                className="px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-sm transition"
              >
                Ask ANN Assistant
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
