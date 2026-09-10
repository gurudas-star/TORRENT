import { useState, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence, Variants } from 'motion/react';
import { ArrowRight, ChevronDown, Activity, Sparkles } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { Language } from '../types';

interface HeroProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function Hero({ language, onOpenPayModal, onOpenAnnChatbot }: HeroProps) {
  const dict = DICTIONARY[language];
  const shouldReduceMotion = useReducedMotion();

  const slides = [
    {
      id: 'sugen',
      title: 'SUGEN Mega Power Plant',
      subtitle: '1,147.5 MW Combined-Cycle Gas Assets • Unparalleled Thermal Efficiency',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/slider-4.jpg'
    },
    {
      id: 'dgen',
      title: 'DGEN Mega Power Plant',
      subtitle: '1,200 MW Combined-Cycle Gas Asset (Dahej SEZ) • On The Road To Sustainability',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/slider-5.jpg'
    },
    {
      id: 'amgen',
      title: 'AMGEN Sabarmati TPS',
      subtitle: '362 MW Coal Generation Asset • Preserving A Century Old Legacy',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/amgen.jpg'
    },
    {
      id: 'solar',
      title: 'Charanka Solar Park',
      subtitle: '2,002 MW Aggregate Renewable Portfolio • Unlocking India’s Green Energy Potential',
      image: 'http://torrentpower.com/public/images/coverimages/home/tpl-solar.jpg'
    },
    {
      id: 'heritage',
      title: 'Electricity House, Circa 1942',
      subtitle: 'Ahmedabad Headquarters • Celebrating Over 100 Years of Power Reliability',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/EH2.jpg'
    },
    {
      id: 'csr',
      title: 'Empowering Society (REACH CSR)',
      subtitle: 'Community Healthcare & Child Well-being • Impacting Over 71,000 Children',
      image: 'https://www.torrentpower.com/public/images/coverimages/home/empowering_society.jpg'
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [shouldReduceMotion, slides.length]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.1,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const currentSlide = slides[currentSlideIndex];

  return (
    <section id="hero" className="relative h-screen min-h-[640px] max-h-[1080px] w-full flex flex-col justify-between overflow-hidden pt-28 sm:pt-32 pb-6 bg-slate-950 text-white">
      {/* ═══ LAYER 0: Official Banner Carousel Background ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={{ opacity: 0.3, scale: 1.03 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.2 }}
          transition={{ duration: 1.0, ease: 'easeInOut' }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={currentSlide.image}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center filter brightness-95 contrast-105"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/50 to-transparent max-w-4xl" />
        </motion.div>
      </AnimatePresence>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hero-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0, 240, 255, 0.3)" strokeWidth="0.8" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* ═══ LAYER 4: Main Hero Content (Vertically Centered) ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex-1 flex flex-col justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-2xl space-y-4"
        >
          {/* Staggered Headline */}
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
          >
            <span className="block drop-shadow-md">{dict.heroHeadline1}</span>
            <span className="bg-gradient-to-r from-cyan-400 via-blue-300 to-teal-300 bg-clip-text text-transparent block drop-shadow-md">
              {dict.heroHeadline2}
            </span>
          </motion.h1>

          {/* Slide subtitle highlight */}
          <motion.div
            key={currentSlide.id + '-sub'}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-3 rounded-xl bg-slate-950/80 border border-cyan-500/40 text-cyan-200 text-xs sm:text-sm font-semibold backdrop-blur-md max-w-xl shadow-lg flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{currentSlide.subtitle}</span>
          </motion.div>

          {/* Subhead text */}
          <motion.p variants={itemVariants} className="text-xs sm:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow">
            {dict.heroSubhead}
          </motion.p>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3 pt-1">
            <motion.button
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={onOpenPayModal}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:brightness-110 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-cyan-600/30 transition border border-cyan-300/40"
            >
              <span>{dict.payBill}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.a
              href="#services"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="px-5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-100 font-bold text-xs sm:text-sm flex items-center gap-1.5 backdrop-blur-md transition shadow-md"
            >
              <span>{dict.exploreServices}</span>
              <ChevronDown className="w-4 h-4 text-cyan-400" />
            </motion.a>

            <button
              onClick={() => onOpenAnnChatbot('outage_start')}
              className="px-4 py-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 font-bold text-xs flex items-center gap-1.5 transition"
            >
              <Activity className="w-3.5 h-3.5 text-amber-400" />
              <span>Report Outage 1912</span>
            </button>
          </motion.div>
        </motion.div>
      </div>

      {/* ═══ LAYER 5: Bottom Navigation & Scroll Indicator ═══ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex items-center justify-between pt-2">
        {/* Slide Indicator Pills */}
        <div className="flex gap-2 items-center">
          {slides.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => setCurrentSlideIndex(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${
                idx === currentSlideIndex ? 'w-10 bg-cyan-400 shadow-md shadow-cyan-500/50' : 'w-4 bg-slate-700/80 hover:bg-slate-500'
              }`}
              title={s.title}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={shouldReduceMotion ? {} : { y: [0, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex items-center gap-1.5 text-slate-300 text-xs font-semibold bg-slate-900/60 px-3 py-1.5 rounded-full border border-slate-800 backdrop-blur-sm shadow-sm"
        >
          <span>{dict.scrollToExplore}</span>
          <ChevronDown className="w-3.5 h-3.5 text-cyan-400" />
        </motion.div>
      </div>
    </section>
  );
}
