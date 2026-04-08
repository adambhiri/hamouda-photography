import React, { useState, useEffect } from 'react';
import { PortfolioItem } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Maximize2, Loader2 } from 'lucide-react';
import { db } from '../services/supabaseService'; // Thabbet mel path hedha
import { useLocation } from 'react-router-dom';
const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);
  const location = useLocation();
  // --- Fetching Data mel Supabase ---
  useEffect(() => {
    const fetchPortfolio = async () => {
      setLoading(true);
      const data = await db.getPortfolio();
      setItems(data);
      setLoading(false);

      // Na9raw el category mel URL Search Params (e.g. ?category=Wedding)
      const queryParams = new URLSearchParams(location.search);
      const categoryParam = queryParams.get('category');

      if (categoryParam) {
        setFilter(categoryParam);
      }
    };

    fetchPortfolio();
  }, [location.search]);

  const categories = ['All', ...new Set(items.map(img => img.category))];
  
  const filteredItems = filter === 'All'
    ? items
    : items.filter(img => img.category === filter);

  return (
    <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-12 md:py-24 space-y-12 md:space-y-20">
      
      {/* Header Section */}
      <div className="text-center space-y-4 md:space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-8xl font-serif text-black dark:text-white tracking-tighter"
        >
          Portfolio
        </motion.h1>
        <p className="text-zinc-400 tracking-[0.4em] uppercase text-[10px] font-black italic">Narration Visuelle</p>
      </div>

      {/* --- Filtres --- */}
      {!loading && (
        <div className="flex flex-wrap justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 text-[9px] tracking-[0.2em] uppercase transition-all rounded-full border font-black ${
                filter === cat 
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white shadow-lg' 
                : 'border-zinc-100 dark:border-zinc-900 text-zinc-400 hover:border-zinc-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* --- Grille / Loading State --- */}
      {loading ? (
  <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
    {[1, 2, 3, 4, 5, 6].map((n) => (
      <div key={n} className="break-inside-avoid bg-zinc-100 dark:bg-zinc-900 rounded-[2rem] h-80 animate-pulse" />
    ))}
  </div>
) : (
  <motion.div layout className="columns-1 sm:columns-2 lg:columns-3 gap-4 md:gap-8 space-y-4 md:space-y-8">
    <AnimatePresence mode='popLayout'>
      {filteredItems.map((item) => (
        <motion.div
          layout
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          key={item.id}
          onContextMenu={(e) => e.preventDefault()} // Protection Right-click
          className="break-inside-avoid group relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 md:cursor-none select-none"
          onClick={() => setActiveItem(item)} 
        >
          <div className="relative overflow-hidden">
            <img
              src={item.type === 'video' ? item.thumbnail : item.url}
              alt={item.title}
              draggable="false" // Protection Drag
              className="w-full h-auto transition-all duration-[1.2s] group-hover:scale-105 pointer-events-none"
            />
            
            {/* Ghost Layer + Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 z-10" />

            {/* Hover Icons */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100 z-20">
              <div className="bg-white/90 backdrop-blur-md text-black p-4 md:p-6 rounded-full shadow-2xl">
                {item.type === 'video' ? (
                  <Play fill="black" size={20} className="md:w-6 md:h-6" />
                ) : (
                  <Maximize2 size={20} className="md:w-6 md:h-6" />
                )}
              </div>
            </div>
          </div>

          {/* Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none">
            <p className="text-white/60 text-[7px] tracking-[0.3em] uppercase font-black mb-2">{item.category}</p>
            <h4 className="text-2xl font-serif text-white">{item.title}</h4>
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  </motion.div>
)}

      {/* --- Lightbox / Modal --- */}
      {/* --- Lightbox / Modal --- */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            // 1. Right-click protection fil-modal l-kol
            onContextMenu={(e) => e.preventDefault()}
            className="fixed inset-0 z-[100] bg-white/98 dark:bg-black/98 backdrop-blur-2xl flex items-center justify-center p-4 select-none"
            onClick={() => setActiveItem(null)}
          >
            <button className="absolute top-6 right-6 p-3 bg-zinc-100 dark:bg-zinc-900 rounded-full z-[110]" onClick={() => setActiveItem(null)}>
              <X size={20} />
            </button>
            
            <motion.div 
              initial={{ scale: 0.9 }} 
              animate={{ scale: 1 }}
              className="relative max-w-6xl w-full h-full flex flex-col items-center justify-center"
              onClick={e => e.stopPropagation()}
            >
              {activeItem.type === 'video' ? (
                <div className="relative w-full max-h-[70vh] rounded-3xl overflow-hidden bg-black shadow-2xl">
                   <video 
                    src={activeItem.url} 
                    controls 
                    autoPlay 
                    // 2. Na7i el download button mel video player
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                    className="w-full h-full object-contain" 
                  />
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={activeItem.url} 
                    alt="" 
                    // 3. Right-click w Drag protection lel image
                    onContextMenu={(e) => e.preventDefault()}
                    draggable="false"
                    className="max-w-full max-h-[70vh] object-contain rounded-xl shadow-2xl pointer-events-none" 
                  />
                  {/* Ghost layer fouq el taswira fil-modal zeda */}
                  <div className="absolute inset-0 z-10 bg-transparent" />
                </div>
              )}

              <div className="mt-8 text-center space-y-2 pointer-events-none">
                <p className="text-zinc-400 text-[10px] tracking-[0.5em] uppercase font-black">{activeItem.category}</p>
                <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white">{activeItem.title}</h2>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Portfolio;