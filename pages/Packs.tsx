import React from 'react';
import { Pack } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Props {
  packs: Pack[];
}

const Packs: React.FC<Props> = ({ packs }) => {
  // --- Logic Sort: Popular in the Middle ---
  const sortedPacks = React.useMemo(() => {
    const popular = packs.filter(p => p.popularity);
    const normal = packs.filter(p => !p.popularity);

    // On divise les packs normaux en deux pour insérer le populaire au milieu
    const middleIndex = Math.floor(normal.length / 2);
    
    return [
      ...normal.slice(0, middleIndex),
      ...popular,
      ...normal.slice(middleIndex)
    ];
  }, [packs]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24 transition-colors duration-500">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-serif text-black dark:text-white tracking-tight"
        >
          Tarifs & Collections
        </motion.h1>
        <p className="text-zinc-400 tracking-[0.5em] uppercase text-[10px] font-black">Investissez dans vos souvenirs les plus précieux</p>
      </div>

      {/* Packs Grid */}
      <div className="grid lg:grid-cols-3 gap-10 items-stretch">
        {sortedPacks.map((pack) => (
          <motion.div 
            key={pack.id} 
            className={`relative flex flex-col p-12 rounded-[2.5rem] border transition-all duration-500 group overflow-hidden ${
              pack.popularity 
              ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-2xl scale-105 z-10' 
              : 'bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-900 text-black dark:text-white hover:border-zinc-300'
            }`}
          >
            {/* Bande Populaire */}
            {pack.popularity && (
              <div className="absolute top-6 right-[-35px] rotate-45 bg-fuchsia-600 text-white px-10 py-1 text-[8px] font-black uppercase tracking-[0.2em] shadow-lg">
                Populaire
              </div>
            )}
            
            <div className="space-y-6 mb-12">
              <h3 className={`text-3xl font-serif ${pack.popularity ? 'text-white dark:text-black' : 'text-zinc-900 dark:text-white'}`}>
                {pack.name}
              </h3>
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tighter">{pack.price}</span>
                <span className="text-4xl uppercase opacity-40">DT</span>
              </div>
            </div>
            
            <ul className="flex-grow space-y-6 mb-12">
              {pack.features.map((feature, idx) => (
                <li key={idx} className="flex items-start space-x-4">
                  <Check size={12} className={pack.popularity ? 'text-white/50 dark:text-black/50' : 'text-zinc-400'} />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>

            <Link 
              to="/contact" 
              className={`w-full py-5 rounded-2xl text-center uppercase tracking-[0.3em] text-[10px] font-black transition-all ${
                pack.popularity 
                ? 'bg-white dark:bg-black text-black dark:text-white' 
                : 'bg-zinc-900 dark:bg-white text-white dark:text-black'
              }`}
            >
              Réserver ce pack
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Custom Quote Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-100 dark:border-zinc-800 p-16 text-center max-w-4xl mx-auto rounded-[3rem] space-y-6 shadow-sm"
      >
        <div className="inline-block p-4 bg-white dark:bg-black rounded-2xl border border-zinc-100 dark:border-zinc-800 mb-4">
            <h4 className="font-serif text-3xl text-black dark:text-white">Sur Mesure</h4>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-base max-w-2xl mx-auto leading-relaxed italic">
          "Chaque histoire est unique. Si nos collections ne couvrent pas l'intégralité de vos besoins, nous créerons ensemble une offre personnalisée."
        </p>
        <div className="pt-6">
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-black dark:text-white border-b-2 border-black dark:border-white pb-2 hover:opacity-50 transition-all"
            >
              Demander un devis personnalisé
            </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Packs;