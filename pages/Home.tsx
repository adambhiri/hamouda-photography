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
    <div className="space-y-24 pb-24 overflow-hidden">
      <HeroSlider slides={slides} />

      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="space-y-8 order-2 md:order-1"
        >
          <h2 className="text-4xl md:text-6xl font-serif text-black dark:text-white">La Passion au Service de l'Image</h2>
          <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-lg">
            Hamdi Hamouda est un photographe visionnaire basé en Tunisie, spécialisé dans le portrait d'art,
            le mariage et l'événementiel de prestige. Chaque cliché est une œuvre d'art, capturant
            l'émotion brute et la lumière parfaite.
          </p>
          <div className="pt-4">
            <Link
              to="/portfolio"
              className="inline-block border-b-2 border-black dark:border-white pb-1 tracking-widest text-sm hover:text-zinc-600 dark:hover:text-zinc-400 hover:border-zinc-600 dark:hover:border-zinc-400 transition text-black dark:text-white"
            >
              VOIR LE PORTFOLIO
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="order-1 md:order-2"
        >
          <img
            src="./public/images/hero-image.png "
            alt="Hamdi at work"
            className="w-full grayscale hover:grayscale-0 transition-all duration-700 rounded-sm shadow-2xl"
          />
        </motion.div>
      </section>

      {/* Featured Packs Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="space-y-4">
            <p className="text-zinc-500 uppercase tracking-widest text-[10px] font-bold">Investissement</p>
            <h2 className="text-4xl md:text-5xl font-serif text-black dark:text-white">Nos Packs</h2>
          </div>
          <Link to="/packs" className="text-[10px] font-bold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 hover:border-black dark:hover:border-white transition text-black dark:text-white">Voir tous les détails →</Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {packs.slice(0, 3).map((pack, i) => (
            <motion.div
              key={pack.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-900 p-8 space-y-6 hover:border-zinc-400 dark:hover:border-zinc-600 transition duration-500 shadow-sm dark:shadow-none"
            >
              <h3 className="text-xl font-serif text-black dark:text-white">{pack.name}</h3>
              <p className="text-3xl font-bold text-black dark:text-white">{pack.price}</p>
              <ul className="space-y-2">
                {pack.features.slice(0, 2).map((f, j) => (
                  <li key={j} className="text-xs text-zinc-600 dark:text-zinc-500 flex items-center gap-2">
                    <div className="w-1 h-1 bg-zinc-400 dark:bg-zinc-700 rounded-full" /> {f}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="block text-center bg-zinc-900 dark:bg-zinc-900 py-3 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-zinc-800 dark:hover:bg-white dark:hover:text-black transition">Réserver</Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="bg-zinc-50 dark:bg-zinc-950 py-24 px-6 border-y border-zinc-200 dark:border-zinc-900 text-center transition-colors">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-5xl font-serif mb-16 text-black dark:text-white"
        >
          Services d'Excellence
        </motion.h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { icon: '💍', title: 'Mariages', desc: 'Capturer l\'éternité de votre union avec une discrétion absolue.' },
            { icon: '👤', title: 'Portraits', desc: 'Sublimer votre personnalité à travers le jeu d\'ombres et de lumières.' },
            { icon: '🎬', title: 'Vidéographie', desc: 'Des films cinématographiques qui racontent votre histoire unique.' }
          ].map((service, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="p-10 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-sm space-y-4 hover:border-black dark:hover:border-white transition-all cursor-default group shadow-sm dark:shadow-none"
            >
              <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all">{service.icon}</div>
              <h3 className="text-xl font-semibold uppercase tracking-widest text-black dark:text-white">{service.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-500 text-sm leading-relaxed">{service.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;