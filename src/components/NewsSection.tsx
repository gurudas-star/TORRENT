import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MOCK_NEWS } from '../data/mockData';
import { NewsItem, Language } from '../types';
import { DICTIONARY } from '../data/content';
import { ArrowRight, Calendar, Clock, X, Newspaper } from 'lucide-react';

interface NewsSectionProps {
  language: Language;
}

export function NewsSection({ language }: NewsSectionProps) {
  const dict = DICTIONARY[language];
  const [activeArticle, setActiveArticle] = useState<NewsItem | null>(null);

  return (
    <section id="news" className="relative py-20 bg-slate-50 border-b border-slate-200 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-cyan-100 border border-cyan-300 text-cyan-800 text-xs font-bold uppercase tracking-wider mb-2">
              <Newspaper className="w-3.5 h-3.5" />
              <span>MEDIA & PRESS RELEASES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {dict.newsTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mt-2 md:mt-0">
            Stay informed on grid modernization initiatives, tariff announcements, and corporate sustainability achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {MOCK_NEWS.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -6 }}
              onClick={() => setActiveArticle(item)}
              className="cursor-pointer bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:border-cyan-500 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-900/90 text-white border border-slate-700 text-[10px] font-bold uppercase">
                    {item.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-[11px] text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-cyan-600" />
                      {item.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-600" />
                      {item.readTime}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-cyan-700 transition">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.summary}</p>
                </div>
              </div>

              <div className="p-6 pt-0 flex items-center justify-between text-xs font-bold text-cyan-700 group-hover:translate-x-1 transition">
                <span>Read Full Release</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Article Detail Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-slate-900 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-800 p-1 rounded-xl bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>

              <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300 text-xs font-bold uppercase inline-block mb-3">
                {activeArticle.category}
              </span>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">{activeArticle.title}</h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
                <span>Published: {activeArticle.date}</span>
                <span>•</span>
                <span>{activeArticle.readTime}</span>
              </div>

              <img
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-64 object-cover rounded-2xl mb-4 border border-slate-200"
              />

              <div className="text-xs text-slate-700 leading-relaxed space-y-3">
                <p className="font-semibold text-slate-900">{activeArticle.summary}</p>
                <p>
                  Torrent Power continues to invest heavily in smart grid architecture, ultra-low loss conductors, and digital customer empowerment. Through our unified utility platform, citizens and enterprise clients receive reliable electricity with complete billing transparency.
                </p>
                <p>
                  For media queries, email <span className="text-cyan-700 font-bold">connect.connect@torrentpower.com</span> or contact our 24/7 corporate communications desk.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-5 py-2.5 rounded-xl bg-cyan-600 text-white font-bold text-xs hover:bg-cyan-700 transition"
                >
                  Close Press Release
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
