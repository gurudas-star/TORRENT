import { Zap, Mail, MapPin, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { DICTIONARY } from '../data/content';

interface FooterProps {
  language: Language;
  onOpenPayModal: () => void;
  onOpenAnnChatbot: (flowId?: string) => void;
}

export function Footer({ language, onOpenPayModal, onOpenAnnChatbot }: FooterProps) {
  const dict = DICTIONARY[language];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-16 relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand Info & Corporate Reg Office */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              {/* Enlarged Prominent White Logo Container */}
              <div className="bg-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl shadow-lg border border-slate-700/60 inline-flex items-center justify-center">
                <img
                  src="https://www.torrentpower.com/public/images/TorrentPowerNewlogo.png"
                  alt="Torrent Power Official Logo"
                  className="h-12 sm:h-16 w-auto object-contain"
                />
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Torrent Power is an integrated power utility promoted by the ₹45,000 Crore Torrent Group, having interests in generation, transmission, distribution, and power cable manufacturing.
            </p>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-2 max-w-sm">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Regd. & Corporate Office</span>
              </div>
              <p className="text-[11px] text-slate-300">
                "Samanvay", 600, Tapovan, Ambavadi, Ahmedabad - 380015 (Gujarat)<br />
                <span className="font-mono text-[10px] text-slate-400">CIN: L31200GJ2004PLC044068</span>
              </p>
              <div className="flex justify-between items-center text-slate-200 font-mono text-xs pt-2 border-t border-slate-800">
                <span>Phone: +91-79-26628000</span>
                <span>Helpline: 1912</span>
              </div>
            </div>
          </div>

          {/* Col 2: Company */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Company Info</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="hover:text-cyan-400 transition">About Torrent Power</a></li>
              <li><a href="#about" className="hover:text-cyan-400 transition">Torrent Group Overview</a></li>
              <li><a href="#sustainability" className="hover:text-cyan-400 transition">Beyond Business (CSR)</a></li>
              <li><a href="#infrastructure" className="hover:text-cyan-400 transition">Generation Assets (6494 MW)</a></li>
              <li><a href="http://careers.torrentpower.com/" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Careers Portal</a></li>
            </ul>
          </div>

          {/* Col 3: Business & Customer Portals */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Customer Services</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={onOpenPayModal} className="hover:text-cyan-400 transition text-left">
                  Pay Electricity Bill
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('view_bill_start')} className="hover:text-cyan-400 transition text-left">
                  View Latest Invoice
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('connection_start')} className="hover:text-cyan-400 transition text-left">
                  Apply New Connection
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('complaint_start')} className="hover:text-cyan-400 transition text-left">
                  Register Complaint Ticket
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('outage_start')} className="hover:text-cyan-400 transition text-left">
                  Feeder Outage Information
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Regulatory & Tenders */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-200 text-sm">Regulatory & Tenders</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenAnnChatbot('other_services')} className="hover:text-cyan-400 transition text-left">
                  GERC / MERC Tariff Orders
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('other_services')} className="hover:text-cyan-400 transition text-left">
                  Vendor E-Tendering Portal
                </button>
              </li>
              <li>
                <button onClick={() => onOpenAnnChatbot('other_services')} className="hover:text-cyan-400 transition text-left">
                  Torrent Electricals (Cables)
                </button>
              </li>
              <li className="flex items-center gap-1.5 pt-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>connect.connect@torrentpower.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <p className="font-medium text-slate-300">
            © Copyright 2026 Torrent Power Ltd. All Rights Reserved.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="https://www.torrentpower.com/index.php/site/info/privacy" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Privacy Policy</a>
            <a href="https://www.torrentpower.com/index.php/site/info/disclaimer" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Disclaimer</a>
            <a href="https://www.torrentpower.com/index.php/site/info/sitemap" target="_blank" rel="noreferrer" className="hover:text-cyan-400 transition">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
