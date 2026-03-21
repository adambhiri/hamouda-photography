import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Slide } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  slides: Slide[];
}

const HeroSlider: React.FC<Props> = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  return (
    <div className="relative h-[90vh] w-full overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current].id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${slides[current].url})`,
              backgroundPosition: `center ${slides[current].posY ?? 50}%`
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-white dark:to-black" />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-8 px-4 max-w-4xl">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="text-white/60 tracking-[0.5em] uppercase text-[10px] font-bold"
              >
                Hamdi Hamouda Studio
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8 }}
                className="text-5xl md:text-8xl font-serif tracking-tight text-white leading-tight"
              >
                {slides[current].title}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.8 }}
                className="flex justify-center"
              >
                <Link
                  to="/contact"
                  className="group relative overflow-hidden bg-white text-black px-10 py-5 uppercase tracking-[0.2em] text-[10px] font-bold transition-all border border-white"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                    Réserver Maintenant
                  </span>
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slide Indicators */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col space-y-6 z-10 hidden md:flex">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group flex items-center space-x-4"
          >
            <span className={`text-[10px] font-bold tracking-widest transition-opacity ${index === current ? 'opacity-100' : 'opacity-0'}`}>
              0{index + 1}
            </span>

            <div className={`w-1.5 h-1.5 rounded-full border border-white transition-all ${
              index === current
                ? 'bg-white scale-150'
                : 'bg-transparent scale-100'
            }`} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;