import { useState } from 'react';
import { motion } from 'motion/react';
import { Factory, Zap, Building2, Activity, Home, ShieldCheck, ExternalLink } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface InfrastructureProps {
  language: Language;
}

export function Infrastructure({ language }: InfrastructureProps) {
  const dict = DICTIONARY[language];
  const [selectedNode, setSelectedNode] = useState<number>(1);

  const nodes = [
    {
      id: 1,
      title: 'SUGEN & UNOSUGEN Plant',
      type: '1,530 MW Combined Gas',
      location: 'Akhakhol, Surat (Gujarat)',
      voltage: '400 kV Evacuation',
      status: 'High Thermal Efficiency',
      desc: 'State-of-the-art combined cycle gas power plant possessing high environmental value & low carbon emissions.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/slider-4.jpg',
      icon: Factory,
      cx: 120,
      cy: 160
    },
    {
      id: 2,
      title: 'DGEN Mega Power Plant',
      type: '1,200 MW Gas Power Asset',
      location: 'Dahej SEZ (Gujarat)',
      voltage: '400 kV EHV Double Circuit',
      status: 'Substation Active',
      desc: 'Mega gas-based power station connected directly to 249 km & 105 km 400kV transmission corridors.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/slider-5.jpg',
      icon: Factory,
      cx: 380,
      cy: 160
    },
    {
      id: 3,
      title: 'AMGEN Sabarmati TPS',
      type: '362 MW Coal Generation',
      location: 'Sabarmati, Ahmedabad',
      voltage: '132 kV Local Grid',
      status: 'Operational Legacy',
      desc: 'One of India’s oldest & most efficient urban power generation units serving metro consumer demand.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/amgen.jpg',
      icon: Zap,
      cx: 640,
      cy: 160
    },
    {
      id: 4,
      title: 'Electricity House & Grid',
      type: 'Ahmedabad & UT Distribution',
      location: 'Licensed Distribution Areas',
      voltage: '11 kV & 230V Supply',
      status: '4.2M Customers',
      desc: 'Electricity House, Circa 1942. Celebrating over 100 years of power reliability for 4.2M consumers.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/EH2.jpg',
      icon: Home,
      cx: 860,
      cy: 90
    },
    {
      id: 5,
      title: 'Franchisee & CSR Operations',
      type: 'Bhiwandi, SMK & Agra Circles',
      location: 'Maharashtra & UP Franchisees',
      voltage: '11kV Feeder Network',
      status: 'India 1st Distribution Franchisee',
      desc: 'Pioneered India’s first distribution franchisee in Bhiwandi (Dec 2006) and REACH CSR impacting 71,000+ kids.',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/empowering_society.jpg',
      icon: Building2,
      cx: 860,
      cy: 230
    }
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[0];

  return (
    <section id="infrastructure" className="relative py-24 bg-slate-950 text-slate-100 overflow-hidden border-y border-slate-800/80">
      {/* Dark Stage background glowing mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Activity className="w-3.5 h-3.5" />
            <span>TORRENT POWER GENERATION & DISTRIBUTION ASSETS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            {dict.infraTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-3">{dict.infraSub}</p>
        </div>

        {/* Interactive SVG Network Canvas */}
        <div className="bg-slate-900/90 border border-cyan-500/30 rounded-3xl p-4 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-cyan-950/80 relative overflow-hidden">
          {/* Top Status Bar */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-slate-200">TOTAL INSTALLED GENERATION: 6,494 MW</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
              Click any node to view real plant images & technical parameters
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full h-[300px] sm:h-[340px] overflow-hidden">
            <svg className="w-full h-full" viewBox="0 0 1000 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
                </linearGradient>
                <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Lines */}
              <line x1="120" y1="160" x2="380" y2="160" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
              <line x1="380" y1="160" x2="640" y2="160" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" opacity="0.8" />
              <path d="M 640 160 Q 750 90 860 90" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" fill="none" opacity="0.8" />
              <path d="M 640 160 Q 750 230 860 230" stroke="url(#lineGrad)" strokeWidth="3" strokeDasharray="6 6" fill="none" opacity="0.8" />

              {/* Animated Energy Pulses */}
              <motion.circle
                r="5"
                fill="#00f0ff"
                filter="url(#glowEffect)"
                animate={{ cx: [120, 380], cy: [160, 160] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              />
              <motion.circle
                r="5"
                fill="#00f0ff"
                filter="url(#glowEffect)"
                animate={{ cx: [380, 640], cy: [160, 160] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: 0.7 }}
              />
              <motion.circle
                r="4"
                fill="#10b981"
                filter="url(#glowEffect)"
                animate={{ cx: [640, 860], cy: [160, 90] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1.2 }}
              />
              <motion.circle
                r="4"
                fill="#3b82f6"
                filter="url(#glowEffect)"
                animate={{ cx: [640, 860], cy: [160, 230] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: 1.4 }}
              />

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNode === node.id;
                return (
                  <g
                    key={node.id}
                    onClick={() => setSelectedNode(node.id)}
                    className="cursor-pointer group"
                  >
                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={isSelected ? '32' : '26'}
                      fill={isSelected ? 'rgba(0, 240, 255, 0.25)' : 'rgba(15, 23, 42, 0.8)'}
                      stroke={isSelected ? '#00f0ff' : '#334155'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                      className="transition-all duration-300"
                    />

                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r="18"
                      fill={isSelected ? '#00f0ff' : '#1e293b'}
                      className="transition-colors duration-300"
                    />

                    <text
                      x={node.cx}
                      y={node.cy + 42}
                      textAnchor="middle"
                      fill={isSelected ? '#00f0ff' : '#94a3b8'}
                      fontSize="12"
                      fontWeight="700"
                    >
                      {node.title}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Selected Node Details Card Panel with Official Image */}
          {activeNodeData && (
            <motion.div
              key={activeNodeData.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-5 rounded-2xl bg-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-12 gap-5 items-center text-xs"
            >
              {/* Plant Image */}
              <div className="md:col-span-4 h-36 rounded-xl overflow-hidden border border-slate-800 relative group">
                <img
                  src={activeNodeData.image}
                  alt={activeNodeData.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-[10px] text-cyan-400 font-bold">
                  Official Facility Photo
                </span>
              </div>

              {/* Technical specs */}
              <div className="md:col-span-8 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <div>
                    <h3 className="text-base font-extrabold text-cyan-400">{activeNodeData.title}</h3>
                    <p className="text-[11px] text-slate-300">{activeNodeData.location}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 text-[10px] font-bold">
                    {activeNodeData.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block">Capacity / Type</span>
                    <span className="text-slate-100 font-bold font-mono">{activeNodeData.type}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Voltage Evacuation</span>
                    <span className="text-slate-100 font-bold font-mono">{activeNodeData.voltage}</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="text-slate-400 block">Operating Franchise</span>
                    <span className="text-emerald-400 font-bold">Torrent Power Ltd.</span>
                  </div>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                  {activeNodeData.desc}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
