import React from 'react';
import HeroSlider from '../components/HeroSlider';
import { Slide, Pack, PortfolioItem } from '../types';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import StudioStack from '../components/ui/polaroid-flick-through';
import { ArrowUpRight } from 'lucide-react'; 
interface Props {
  slides: Slide[];
  packs: Pack[];
  portfolioItems: PortfolioItem[];
}

const Home: React.FC<Props> = ({ slides, packs, portfolioItems }) => {
  return (
    <div className="overflow-hidden bg-white dark:bg-black transition-colors duration-300">
      {/* 1. Hero Section */}
      <HeroSlider slides={slides} />

      <div className="relative z-10">
        <StudioStack />
      </div>

      {/* 3. About Section - Negative margin to pull it up over the Stack's empty scroll space */}
      <section className="relative z-20 -mt-[100vh] bg-white dark:bg-black py-20 md:py-32 transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center">
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
        </div>
      </section>

      
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-16 gap-6 text-center md:text-left">
  <div className="space-y-3">
    <p className="text-zinc-400 uppercase tracking-[0.4em] text-[9px] font-bold">Investissement</p>
    <h2 className="text-3xl md:text-5xl font-serif text-black dark:text-white">Nos Packs</h2>
  </div>

  <div className="relative group">
    
    <motion.div
      animate={{ 
        y: [0, -5, 0],
        x: [0, 2, 0],
        rotate: [-2, 2, -2]
      }}
      transition={{ 
        duration: 3, 
        repeat: Infinity, 
        ease: "easeInOut" 
      }}
      className="absolute -top-12 -left-12 md:-left-16 pointer-events-none"
    >
      <svg 
        width="55" 
        height="55" 
        viewBox="0 0 415.262 415.261" 
        fill="currentColor" 
        xmlns="http://www.w3.org/2000/svg"
        className="text-zinc-400 dark:text-zinc-600 opacity-80"
      >
        <path d="M414.937,374.984c-7.956-24.479-20.196-47.736-30.601-70.992c-1.224-3.06-6.12-3.06-7.956-1.224
          c-10.403,11.016-22.031,22.032-28.764,35.496h-0.612c-74.664,5.508-146.88-58.141-198.288-104.652
          c-59.364-53.244-113.22-118.116-134.64-195.84c-1.224-9.792-2.448-20.196-2.448-30.6c0-4.896-6.732-4.896-7.344,0
          c0,1.836,0,3.672,0,5.508C1.836,12.68,0,14.516,0,17.576c0.612,6.732,2.448,13.464,3.672,20.196
          C8.568,203.624,173.808,363.356,335.376,373.76c-5.508,9.792-10.403,20.195-16.523,29.988c-3.061,4.283,1.836,8.567,6.12,7.955
          c30.6-4.283,58.14-18.972,86.292-29.987C413.712,381.104,416.16,378.656,414.937,374.984z M332.928,399.464
          c3.673-7.956,6.12-15.912,10.404-23.868c1.225-3.061-0.612-5.508-2.448-6.12c0-1.836-1.224-3.061-3.06-3.672
          c-146.268-24.48-264.996-124.236-309.06-259.489c28.764,53.244,72.828,99.756,116.28,138.924
          c31.824,28.765,65.484,54.468,102.204,75.888c28.764,16.524,64.872,31.824,97.92,21.421l0,0c-1.836,4.896,5.508,7.344,7.956,3.672
          c7.956-10.404,15.912-20.196,24.48-29.376c8.567,18.972,17.748,37.943,24.479,57.527
          C379.44,382.94,356.796,393.956,332.928,399.464z"/>
      </svg>
    </motion.div>

    <Link 
      to="/packs" 
      className="relative z-10 text-[9px] font-bold uppercase tracking-widest border-b border-zinc-200 dark:border-zinc-800 pb-1 hover:border-black dark:hover:text-white transition text-zinc-500 dark:text-zinc-400"
    >
      Voir tous les détails
    </Link>
  </div>
</div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
  {packs.slice(0, 3).map((pack, i) => (
    <motion.div
      key={pack.id}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      transition={{ delay: i * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className="group relative bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-8 md:p-10 flex flex-col justify-between hover:border-black dark:hover:border-white transition-all duration-500 shadow-sm hover:shadow-2xl overflow-hidden min-h-[500px]" 
    >
      {/* Accent Line */}
      <div className="absolute top-0 left-0 w-1 h-0 bg-black dark:bg-white group-hover:h-full transition-all duration-500" />

      <div className="space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl md:text-2xl font-serif text-black dark:text-white italic capitalize">
            {pack.name}
          </h3>
          <div className="flex items-baseline gap-1">
            <p className="text-4xl font-light tracking-tighter text-black dark:text-white">
              {pack.price}
            </p>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">DT</span>
          </div>
        </div>

        {/* Feature List with Fixed Slots */}
        <ul className="space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-900 min-h-[160px]">
          {pack.features.slice(0, 3).map((f, j) => (
            <li key={j} className="text-[10px] md:text-[11px] uppercase tracking-[0.2em] text-zinc-500 dark:text-zinc-400 flex items-center gap-3">
              <span className="w-1.5 h-[1px] bg-zinc-300 dark:bg-zinc-700 group-hover:w-3 group-hover:bg-black dark:group-hover:bg-white transition-all" /> 
              {f}
            </li>
          ))}

          {/* "+ Autres" Indicator */}
          {pack.features.length > 3 && (
            <li className="text-[9px] italic tracking-widest text-zinc-400 dark:text-zinc-500 pt-2">
              + {pack.features.length - 3} autres services inclus
            </li>
          )}
        </ul>
      </div>

      <div className="pt-6">
        <Link 
          to="/contact" 
          className="block text-center border border-black dark:border-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-black dark:text-white group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-all duration-500"
        >
          Réserver
        </Link>
      </div>
    </motion.div>
  ))}
</div>
      </section>

      {/* 5. Services Section */}
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
              { icon: '👤', title: 'Portraits', desc: 'Sublimer votre personality à travers le jeu d\'ombres et de lumières.' },
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