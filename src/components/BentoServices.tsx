import { motion } from 'motion/react';
import { Factory, Zap, Building2, Scale, ArrowUpRight, CheckCircle2, Landmark } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface BentoServicesProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function BentoServices({ language, onOpenPayModal, onOpenAnnChatbot }: BentoServicesProps) {
  const dict = DICTIONARY[language];

  const serviceCategories = [
    {
      id: 'generation',
      title: 'Power Generation (6,494 MW)',
      subtitle: 'Thermal Combined-Cycle Gas (DGEN, SUGEN, UNOSUGEN), AMGEN Coal, & 2002 MW Renewables.',
      icon: Factory,
      accent: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      badge: 'Thermal & Clean Grid',
      items: [
        { label: '1,200 MW DGEN Gas Power Plant (Dahej SEZ)', flow: 'usage_start' },
        { label: '1,147.5 MW SUGEN & 382.5 MW UNOSUGEN (Surat)', flow: 'usage_start' },
        { label: '362 MW AMGEN Coal Plant (Ahmedabad)', flow: 'usage_start' },
        { label: 'Charanka & Regional Solar/Wind Parks (2002 MW)', flow: 'connection_start' }
      ]
    },
    {
      id: 'distribution',
      title: 'Distribution Licensee & Franchisee',
      subtitle: 'Distributing electricity to 4.2 Million customers across Gujarat, Maharashtra, UP & UT.',
      icon: Building2,
      accent: 'bg-blue-100 text-blue-800 border-blue-300',
      badge: '4.2M Customers',
      items: [
        { label: 'Gujarat License Area (Ahmedabad, Gandhinagar, Surat, Dahej)', flow: 'view_bill_start' },
        { label: 'Maharashtra Franchisees (Bhiwandi, Shil, Mumbra & Kalwa)', flow: 'complaint_start' },
        { label: 'Uttar Pradesh Franchisee (Agra Circle)', flow: 'pay_bill_start' },
        { label: 'Union Territory Licensee (Dadra & Nagar Haveli, Daman & Diu)', flow: 'connection_start' }
      ]
    },
    {
      id: 'regulatory-tenders',
      title: 'Regulatory & Vendor E-Tendering',
      subtitle: 'GERC, MERC, UPERC, CERC Tariff Petitions & Procurement Tenders.',
      icon: Scale,
      accent: 'bg-amber-100 text-amber-800 border-amber-300',
      badge: 'Official Governance',
      items: [
        { label: 'GERC / MERC / UPERC Tariff Orders & Petitions', flow: 'other_services' },
        { label: 'Vendor E-Tendering & Material Procurement', flow: 'other_services' },
        { label: 'High Voltage Cables Manufacturing (132 kV XLPE)', flow: 'other_services' },
        { label: 'Supplier Registration & Prequalification', flow: 'other_services' }
      ]
    },
    {
      id: 'beyond-business',
      title: 'Beyond Business (CSR & Ecology)',
      subtitle: 'Founder U. N. Mehta Philosophy: "Think of others also, when you think about yourself."',
      icon: Landmark,
      accent: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      badge: 'Torrent Foundation',
      items: [
        { label: 'Community Healthcare & REACH Child Care (71,000+ Kids)', flow: 'other_services' },
        { label: 'Education & Primary Knowledge Enhancement', flow: 'other_services' },
        { label: 'Arts, Culture & Community Welfare Projects', flow: 'other_services' },
        { label: 'Ecological Care & Mass Tree Plantation', flow: 'other_services' }
      ]
    }
  ];

  return (
    <section id="services" className="relative py-20 bg-slate-50 border-b border-slate-200 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-cyan-800 uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300">
            BUSINESS PORTFOLIO & OPERATIONAL DIVISIONS
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-3">
            {dict.servicesTitle} <span className="text-cyan-700">{dict.servicesSub}</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 mt-3">
            Official operational areas of Torrent Power Ltd. encompassing generation plants, EHV transmission, licensed distribution, regulatory compliance, and community development.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCategories.map((cat, index) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="group relative bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-lg hover:shadow-2xl hover:border-cyan-500/60 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl ${cat.accent} border flex items-center justify-center shadow-sm group-hover:scale-105 transition`}>
                      <Icon className="w-7 h-7 stroke-[2]" />
                    </div>

                    <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold">
                      {cat.badge}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-cyan-700 transition">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">{cat.subtitle}</p>

                  {/* List of sub-services */}
                  <div className="mt-6 space-y-2.5">
                    {cat.items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          if (item.flow) onOpenAnnChatbot(item.flow);
                        }}
                        className="w-full text-left p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-cyan-300 hover:bg-cyan-50/50 text-slate-800 hover:text-cyan-800 flex items-center justify-between text-xs font-bold transition group/item"
                      >
                        <div className="flex items-center gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                          <span>{item.label}</span>
                        </div>
                        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/item:text-cyan-700 group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-cyan-700 transition">
                  <span>Explore Division Details</span>
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
