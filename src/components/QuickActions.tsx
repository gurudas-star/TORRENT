import { useState } from 'react';
import { motion } from 'motion/react';
import {
  CreditCard,
  FileText,
  ZapOff,
  AlertTriangle,
  UserPlus,
  Search,
  ArrowRight,
  Sparkles,
  Building2,
  Scale,
  FileCheck,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface QuickActionsProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function QuickActions({ language, onOpenPayModal, onOpenAnnChatbot }: QuickActionsProps) {
  const dict = DICTIONARY[language];
  const [activeTab, setActiveTab] = useState<'customer' | 'vendor'>('customer');

  const customerActions = [
    {
      id: 'pay-bill',
      title: 'Pay Electricity Bill',
      desc: 'Instant 2-step online bill settlement via UPI, Credit/Debit Card, and NetBanking.',
      badge: 'INSTANT PAY',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: CreditCard,
      iconBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-600/20',
      features: ['No Convenience Fee', 'Instant E-Receipt', 'All Payment Gateways'],
      action: () => onOpenPayModal()
    },
    {
      id: 'view-bill',
      title: 'View & Download Bill',
      desc: 'Fetch current itemized electricity invoice and download official PDF copy.',
      badge: 'PDF STATEMENT',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: FileText,
      iconBg: 'bg-gradient-to-tr from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-600/20',
      features: ['Itemized Tariff Breakup', 'Previous Consumption', 'Digital Signature'],
      action: () => onOpenAnnChatbot('view_bill_start')
    },
    {
      id: 'report-outage',
      title: 'Report No Power / Outage',
      desc: 'Check live grid feeder restoration status or dispatch breakdown technical crew.',
      badge: '24x7 EMERGENCY',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: ZapOff,
      iconBg: 'bg-gradient-to-tr from-amber-500 to-orange-600 text-white shadow-md shadow-amber-600/20',
      features: ['Live Feeder Telemetry', 'SMS Alert Tracking', 'Mobile Crew Dispatch'],
      action: () => onOpenAnnChatbot('no_power_start')
    },
    {
      id: 'register-complaint',
      title: 'Register Service Complaint',
      desc: 'Log billing, defective meter, voltage fluctuation, or public lighting complaints.',
      badge: 'SLA TRACKING',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: AlertTriangle,
      iconBg: 'bg-gradient-to-tr from-rose-500 to-red-600 text-white shadow-md shadow-rose-600/20',
      features: ['4-Hour Resolution SLA', 'Field Engineer Assign', 'Complaint Reference ID'],
      action: () => onOpenAnnChatbot('complaint_start')
    },
    {
      id: 'new-connection',
      title: 'Apply New Connection',
      desc: 'Single-window online application for Residential, Commercial & Industrial LT/HT power.',
      badge: 'SINGLE WINDOW',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: UserPlus,
      iconBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/20',
      features: ['Document Upload', 'Inspector Slot Booking', 'Transparent Processing'],
      action: () => onOpenAnnChatbot('connection_start')
    },
    {
      id: 'track-request',
      title: 'Track Application Status',
      desc: 'Real-time status lookup for pending applications, load extension, and complaints.',
      badge: 'LIVE STATUS',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Search,
      iconBg: 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-purple-600/20',
      features: ['Inspection Milestone', 'Officer Contact Details', 'Instant SMS Updates'],
      action: () => onOpenAnnChatbot('app_status_check')
    }
  ];

  const vendorActions = [
    {
      id: 'active-tenders',
      title: 'E-Tendering & Active Bids',
      desc: 'Access ongoing procurement tenders for power equipment, cables, and sub-station works.',
      badge: 'LIVE TENDERS',
      badgeColor: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      icon: FileCheck,
      iconBg: 'bg-gradient-to-tr from-cyan-600 to-blue-700 text-white shadow-md',
      features: ['Technical Specifications', 'BOQ Document Download', 'Online Bid Submission'],
      action: () => onOpenAnnChatbot('other_services')
    },
    {
      id: 'vendor-reg',
      title: 'Vendor & Supplier Registration',
      desc: 'Register as an approved contractor or equipment supplier for Torrent Power projects.',
      badge: 'REGISTRATION',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: Building2,
      iconBg: 'bg-gradient-to-tr from-emerald-600 to-teal-700 text-white shadow-md',
      features: ['Prequalification Criteria', 'Vendor Code Allotment', 'Empanelment Portal'],
      action: () => onOpenAnnChatbot('other_services')
    },
    {
      id: 'material-supply',
      title: 'Material Supply & Logistics',
      desc: 'Dispatch instructions, inspection call generation, and material gate pass portal.',
      badge: 'LOGISTICS',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Truck,
      iconBg: 'bg-gradient-to-tr from-blue-600 to-indigo-700 text-white shadow-md',
      features: ['Inspection Call System', 'Store Delivery Advice', 'E-Way Bill Verification'],
      action: () => onOpenAnnChatbot('other_services')
    },
    {
      id: 'regulatory-tariff',
      title: 'Regulatory & Tariff Orders',
      desc: 'GERC, MERC, UPERC & CERC tariff petitions, true-up orders, and statutory compliance.',
      badge: 'REGULATORY',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Scale,
      iconBg: 'bg-gradient-to-tr from-amber-600 to-orange-700 text-white shadow-md',
      features: ['Tariff Petitions', 'Regulatory Directives', 'Public Hearing Notices'],
      action: () => onOpenAnnChatbot('other_services')
    }
  ];

  const currentActions = activeTab === 'customer' ? customerActions : vendorActions;

  return (
    <section id="quick-actions" className="relative py-20 bg-slate-100/80 border-b border-slate-200 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-extrabold uppercase tracking-widest mb-4 shadow-xs">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            <span>EXPRESS DIGITAL UTILITY SUITE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            {dict.quickActionsTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3 leading-relaxed">
            {dict.quickActionsSub}
          </p>

          {/* Interactive Portal Switcher Tabs */}
          <div className="mt-8 inline-flex p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-md">
            <button
              onClick={() => setActiveTab('customer')}
              className={`px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'customer'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Consumer Self-Service Desk</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                6 Tools
              </span>
            </button>

            <button
              onClick={() => setActiveTab('vendor')}
              className={`px-6 py-3 rounded-xl font-extrabold text-xs sm:text-sm transition-all duration-300 flex items-center gap-2 ${
                activeTab === 'vendor'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <span>Vendor & E-Tendering Portal</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white font-bold">
                4 Desks
              </span>
            </button>
          </div>
        </div>

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {currentActions.map((act, index) => {
            const Icon = act.icon;
            return (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                whileHover={{ y: -6 }}
                onClick={act.action}
                className="relative cursor-pointer bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl hover:border-cyan-500/80 transition-all duration-300 group flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header Row */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-13 h-13 rounded-2xl ${act.iconBg} p-3 flex items-center justify-center group-hover:scale-105 transition duration-300`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>

                    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${act.badgeColor}`}>
                      {act.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-cyan-700 transition">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">{act.desc}</p>

                  {/* Key Feature Bullets */}
                  <div className="mt-5 pt-4 border-t border-slate-100 space-y-1.5">
                    {act.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-[11px] font-semibold text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Link Action */}
                <div className="mt-7 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-cyan-700 group-hover:text-cyan-800">
                  <span>Launch Express Tool</span>
                  <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-cyan-600 group-hover:text-white flex items-center justify-center transition shadow-xs">
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
