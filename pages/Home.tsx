import React from 'react';
import HeroSlider from '../components/HeroSlider';
import { Slide, Pack } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface Props {
  slides: Slide[];
  packs: Pack[];
}

const Home: React.FC<Props> = ({ slides, packs }) => {
  return (
    <div className="space-y-16 md:space-y-32 pb-24 overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* Hero Section */}
      <HeroSlider slides={slides} />

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-6 md:space-y-8 order-2 lg:order-1 text-center lg:text-left"
        >
          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif text-black dark:text-white leading-tight">
            La Passion au <br className="hidden md:block" /> Service de l'Image
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-base md:text-lg max-w-2xl mx-auto lg:mx-0">
            Hamdi Hamouda est un photographe visionnaire basé en Tunisie, spécialisé dans le portrait d'art,
            le mariage et l'événementiel de prestige. Chaque cliché est une œuvre d'art, capturant
            l'émotion brute et la lumière parfaite.
          </p>
          <div className="pt-4">
            <Link
              to="/portfolio"
              className="inline-block border-b border-black dark:border-white pb-1 tracking-[0.3em] text-[10px] md:text-xs font-bold hover:text-zinc-500 dark:hover:text-zinc-400 hover:border-zinc-500 transition text-black dark:text-white"
            >
              VOIR LE PORTFOLIO
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="order-1 lg:order-2"
        >
          <div className="relative group">
            <img
              src="/assets/images/hero-image.png" 
              alt="Hamdi at work"
              className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-1000 rounded-sm shadow-xl"
            />
            <div className="absolute inset-0 border border-black/5 dark:border-white/5 pointer-events-none rounded-sm"></div>
          </div>
        </motion.div>
      </section>

      {/* Featured Packs Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-left">
          <div className="space-y-3">
            <p className="text-zinc-400 uppercase tracking-[0.4em] text-[9px] font-bold">Investissement</p>
            <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white">Nos Packs</h2>
          </div>
          <Link to="/packs" className="text-[9px] font-bold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 hover:border-black dark:hover:text-white transition text-zinc-500 dark:text-zinc-400">
            Voir tous les détails →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {packs.slice(0, 3).map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-8 md:p-10 space-y-6 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-500 shadow-sm dark:shadow-none"
            >
              <h3 className="text-xl font-serif text-black dark:text-white group-hover:tracking-wider transition-all duration-500">{pack.name}</h3>
              <p className="text-3xl font-light tracking-tighter text-black dark:text-white">{pack.price}</p>
              <ul className="space-y-3 pt-4 border-t border-zinc-50 dark:border-zinc-900">
                {pack.features.slice(0, 3).map((f, j) => (
                  <li key={j} className="text-[11px] uppercase tracking-widest text-zinc-500 dark:text-zinc-500 flex items-center gap-3">
                    <span className="w-1 h-1 bg-zinc-300 dark:bg-zinc-700 rounded-full" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center bg-black dark:bg-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white dark:text-black hover:opacity-80 transition-opacity">
                Réserver
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-zinc-50 dark:bg-zinc-950 py-20 md:py-32 px-6 border-y border-zinc-100 dark:border-zinc-900 transition-colors">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-serif mb-12 md:mb-20 text-center text-black dark:text-white tracking-widest uppercase"
          >
            Services d'Excellence
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { icon: '💍', title: 'Mariages', desc: 'Capturer l\'éternité de votre union avec une discrétion absolue.' },
              { icon: '👤', title: 'Portraits', desc: 'Sublimer votre personnalité à travers le jeu d\'ombres et de lumières.' },
              { icon: '🎬', title: 'Vidéographie', desc: 'Des films cinématographiques qui racontent votre histoire unique.' }
            ].map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="text-center space-y-4 group"
              >
                <div className="text-4xl md:text-5xl mb-6 inline-block grayscale group-hover:grayscale-0 transition-all duration-500 transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-black dark:text-white">
                  {service.title}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-500 text-xs md:text-sm leading-relaxed max-w-xs mx-auto">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;