import React, { useState } from 'react';
import { PORTFOLIO_ITEMS } from '../constants';
import { PortfolioItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize2 } from 'lucide-react';

interface Props {
  items?: PortfolioItem[];
}

const Portfolio: React.FC<Props> = ({ items = PORTFOLIO_ITEMS }) => {
  const [filter, setFilter] = useState('All');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  const displayItems = items.length > 0 ? items : PORTFOLIO_ITEMS;
  const categories = ['All', ...new Set(displayItems.map(img => img.category))];
  
  const filteredItems = filter === 'All'
    ? displayItems
    : displayItems.filter(img => img.category === filter);

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-24 space-y-20 transition-colors duration-500">
      
      {/* Header Section */}
      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-serif text-black dark:text-white tracking-tighter"
        >
          Portfolio
        </motion.h1>
        <div className="flex items-center justify-center gap-4">
          <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
          <p className="text-zinc-400 tracking-[0.5em] uppercase text-[10px] font-black">Narration Visuelle</p>
          <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </div>

      {/* --- Filtres Premium --- */}
      <div className="flex flex-wrap justify-center gap-3">
        {categories.map((cat, i) => (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-10 py-4 text-[9px] tracking-[0.3em] uppercase transition-all rounded-full border font-black ${
              filter === cat 
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-xl scale-105' 
              : 'border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* --- Grille Masonry Optimized --- */}
      <motion.div layout className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        <AnimatePresence mode='popLayout'>
          {filteredItems.map((item) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              key={item.id}
              className="break-inside-avoid group relative overflow-hidden rounded-[2rem] bg-zinc-100 dark:bg-zinc-900 cursor-none"
              onClick={() => setActiveItem(item)} 
            >
              {/* Image Container */}
              <div className="relative overflow-hidden">
                <img
                  src={item.type === 'video' ? item.thumbnail : item.url}
                  alt={item.title}
                  onContextMenu={(e) => e.preventDefault()}
                  className="w-full h-auto transition-all duration-[1.5s] ease-out group-hover:scale-110 group-hover:rotate-1"
                />
                
                {/* Overlay Intelligent */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500" />
                
                {/* Custom Cursor/Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100">
                  <div className="bg-white/90 backdrop-blur-md text-black p-6 rounded-full shadow-2xl">
                    {item.type === 'video' ? <Play fill="black" size={24} /> : <Maximize2 size={24} />}
                  </div>
                </div>
              </div>

              {/* Bottom Info */}
              <div className="absolute bottom-0 left-0 right-0 p-10 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none">
                <p className="text-white/60 text-[8px] tracking-[0.4em] uppercase font-black mb-2">{item.category}</p>
                <h4 className="text-3xl font-serif text-white leading-none">{item.title || 'Collection'}</h4>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* --- Lightbox / Modal --- */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-white/95 dark:bg-black/98 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
            onClick={() => setActiveItem(null)}
          >
            <motion.button 
              className="absolute top-10 right-10 text-black dark:text-white group flex items-center gap-3"
              onClick={() => setActiveItem(null)}
            >
              <span className="text-[10px] font-black tracking-[0.3em] uppercase group-hover:opacity-50 transition-opacity">Fermer</span>
              <div className="p-2 border border-black/10 dark:border-white/10 rounded-full group-hover:rotate-90 transition-transform">
                <X size={20} />
              </div>
            </motion.button>
            
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {activeItem.type === 'video' ? (
                <div className="w-full aspect-video rounded-[2rem] overflow-hidden shadow-2xl bg-black">
                  <video src={activeItem.url} controls autoPlay className="w-full h-full object-contain" />
                </div>
              ) : (
                <img 
                  src={activeItem.url} 
                  alt="Portfolio" 
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl" 
                  onContextMenu={(e) => e.preventDefault()} 
                />
              )}
              
              <div className="mt-8 text-center space-y-2">
                <p className="text-zinc-400 text-[10px] tracking-[0.5em] uppercase font-black">{activeItem.category}</p>
                <h2 className="text-4xl font-serif text-black dark:text-white">{activeItem.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;