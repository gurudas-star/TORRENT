import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Globe, User, Zap, Menu, X, ArrowRight, PhoneCall, ShieldCheck, Activity } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface NavbarProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  onOpenPayModal: () => void;
  onOpenLoginModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function Navbar({
  language,
  onLanguageChange,
  onOpenPayModal,
  onOpenLoginModal,
  onOpenAnnChatbot
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const dict = DICTIONARY[language];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: dict.navHome, href: '#hero' },
    { label: dict.navAbout, href: '#about' },
    { label: dict.navServices, href: '#services' },
    { label: dict.navSustainability, href: '#sustainability' },
    { label: dict.navInvestors, href: '#infrastructure' },
    { label: dict.navCustomerServices, href: '#quick-actions' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      {/* Premium Top Corporate Ribbon */}
      <div className="bg-slate-950 border-b border-slate-800 px-4 py-1.5 text-[11px] text-slate-200 flex items-center justify-between shadow-inner">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-emerald-400 text-[10px] uppercase tracking-wider">
                GRID OPERATIONAL
              </span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-slate-300 font-medium">
              Torrent Group • 24x7 Customer Care: <strong className="text-white font-mono">1912</strong> / <span className="font-mono">1800-200-1912</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:1912"
              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30"
            >
              <PhoneCall className="w-3 h-3 text-cyan-400 animate-bounce" />
              <span>Outage Helpline 1912</span>
            </a>

            <button
              onClick={() => onOpenAnnChatbot('outage_start')}
              className="hidden md:flex items-center gap-1 text-slate-300 hover:text-cyan-400 font-semibold transition"
            >
              <Activity className="w-3 h-3 text-cyan-400" />
              <span>Live Feeder Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Light Glass Navbar */}
      <div
        className={`transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-2xl border-b border-slate-200 shadow-md py-2.5'
          : 'bg-white/85 backdrop-blur-md border-b border-slate-200/80 py-1.5'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo Area - Prominent Executive Official Logo */}
          <a href="#hero" className="flex items-center gap-3 group">
            <div className="bg-white px-4 sm:px-5 rounded-2xl shadow-md border border-slate-200/90 flex items-center justify-center group-hover:scale-105 transition">
              <img
                src="https://www.torrentpower.com/public/images/TorrentPowerNewlogo.png"
                alt="Torrent Power Official Logo"
                className="h-11 sm:h-14 w-auto object-contain"
              />
            </div>
          </a>

          {/* Desktop Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 border border-slate-200/90 px-4 py-1.5 rounded-full shadow-inner">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-cyan-700 transition rounded-full hover:bg-white hover:shadow-sm"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Tools */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-700 hover:bg-white hover:shadow-sm transition"
              title="Search Portal"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="px-3 py-2 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 hover:text-cyan-700 transition flex items-center gap-1.5 text-xs font-bold"
              >
                <Globe className="w-4 h-4 text-cyan-600" />
                <span>{language}</span>
              </button>

              <AnimatePresence>
                {langDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-32 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-50 text-xs"
                  >
                    {(['EN', 'HI', 'GU'] as Language[]).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => {
                          onLanguageChange(lang);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl transition ${language === lang ? 'bg-cyan-50 text-cyan-700 font-bold' : 'text-slate-700 hover:bg-slate-100'
                          }`}
                      >
                        {lang === 'EN' ? 'English' : lang === 'HI' ? 'हिंदी' : 'ગુજરાતી'}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Customer Login */}
            <button
              onClick={onOpenLoginModal}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 border border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-white transition text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5 text-cyan-600" />
              <span>{dict.login}</span>
            </button>

            {/* Pay Bill Primary CTA */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenPayModal}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-cyan-600/25 hover:shadow-cyan-600/40 transition"
            >
              <span>{dict.payBill}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 hover:text-cyan-700"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/98 border-b border-slate-200 px-6 py-6 space-y-4 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-sm font-bold text-slate-800 hover:text-cyan-700 hover:bg-slate-100 rounded-xl transition"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenPayModal();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30"
              >
                <span>{dict.payBill}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenLoginModal();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <User className="w-4 h-4 text-cyan-600" />
                  <span>{dict.login}</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAnnChatbot();
                  }}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 border border-slate-200 text-cyan-700 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-4 h-4" />
                  <span>Ask ANN AI</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 text-sm">Search Torrent Power Services</h3>
                <button onClick={() => setSearchOpen(false)} className="text-slate-400 hover:text-slate-800 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative mb-4">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search SUGEN, DGEN, bill payment, solar net-metering, tenders..."
                  className="w-full bg-slate-50 border border-slate-300 focus:border-cyan-600 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-900 focus:outline-none"
                  autoFocus
                />
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p className="font-bold text-slate-800">Popular Searches:</p>
                <div className="flex flex-wrap gap-2">
                  {['Pay Electricity Bill', 'SUGEN 1147MW Plant', 'DGEN 1200MW Dahej', 'Bhiwandi Franchisee', 'Charanka Solar Park', 'E-Tendering'].map(
                    (term, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setSearchQuery(term);
                          if (term.includes('Pay')) onOpenPayModal();
                          else if (term.includes('Outage')) onOpenAnnChatbot('outage_start');
                          else onOpenAnnChatbot('main_menu');
                          setSearchOpen(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 hover:border-cyan-500 hover:text-cyan-700 transition"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
