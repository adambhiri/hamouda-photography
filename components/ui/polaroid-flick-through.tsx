import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../../services/supabaseService';
import { Loader2 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring, MotionValue } from 'framer-motion';

interface FeaturedCard {
  category_name: string;
  image_url: string;
  display_order: number;
}

interface CardProps {
  card: FeaturedCard;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}
// --- NEW: BACKGROUND TYPOGRAPHY COMPONENT (Positioned Bottom) ---
const BackgroundText = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  // El klém yet-7arrek mel lisar lel limin
  const x1 = useTransform(scrollYProgress, [0, 1], [100, -300]);
  const x2 = useTransform(scrollYProgress, [0, 1], [-100, 300]);
  
  // El Opacity yabda y-dh-har ken ki el cards yabdaw y-spread-iw (f-el wost el scroll)
  const opacity = useTransform(scrollYProgress, [0.1, 0.4, 0.9], [0, 0.06, 0]);

  return (
    <div className="absolute bottom-10 md:bottom-20 left-0 w-full overflow-hidden pointer-events-none flex flex-col gap-0 select-none z-0">
      <motion.h2 
        style={{ x: x1, opacity }}
        className="text-[12vw] font-serif italic text-zinc-900 dark:text-white whitespace-nowrap leading-[0.8] opacity-10"
      >
        HAMDI HAMOUDA HAMDI HAMOUDA
      </motion.h2>
      <motion.h2 
        style={{ x: x2, opacity }}
        className="text-[12vw] font-serif italic text-zinc-900 dark:text-white whitespace-nowrap leading-[0.8] ml-[-20vw] opacity-10"
      >
        STUDIO PRO STUDIO PRO STUDIO PRO
      </motion.h2>
    </div>
  );
};
const AnimatedCard = ({ card, index, total, scrollYProgress }: CardProps) => {
  const categoryName = card.category_name.charAt(0).toUpperCase() + card.category_name.slice(1).toLowerCase();

  // --- 1. CALCULATIONS ---
  const cardWidth = 400;
  const centerIndex = (total - 1) / 2;
  const targetX = (index - centerIndex) * cardWidth;

  // --- 2. TIMING RANGES ---
  const delay = index * 0.05;
  const introStart = 0 + delay;
  const introEnd = 0.1 + delay;

  const spreadStart = 0.12;
  const spreadEnd = 0.2;

  const dropStart = 0.6;
  const dropEnd = 0.7;

  // --- 3. ANIMATIONS ---

  // A. OPACITY
  const opacity = useTransform(scrollYProgress, 
    [introStart, introEnd, dropStart, dropEnd], 
    [0, 1, 1, 0]
  );

  // B. INTRO SCALE
  const introScale = useTransform(scrollYProgress, [introStart, introEnd], [0.8, 1]);

  // C. SPREAD X
  const x = useSpring(
    useTransform(scrollYProgress, [spreadStart, spreadEnd], [0, targetX]), 
    { stiffness: 300, damping: 30 }
  );
  
  // D. DROP Y
  const y = useSpring(
    useTransform(scrollYProgress, [dropStart, dropEnd], [0, 200]), 
    { stiffness: 300, damping: 30 }
  );

  // E. ROTATE
  const rotate = useTransform(scrollYProgress, [spreadStart, spreadEnd], [(index - centerIndex) * 10, 0]);

  return (
    <motion.div
      style={{ 
        x,
        y,
        opacity,
        scale: introScale,
        rotate,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-250px',
        marginLeft: '-175px',
        zIndex: 10 - index,
      }}
      className="w-[350px] h-[500px] flex-shrink-0"
    >
      <Link 
        to={`/portfolio?category=${categoryName}`}
        className="relative w-full h-full group cursor-pointer no-underline block"
      >
        <div className="relative w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500 hover:border-zinc-400 dark:hover:border-white/30">
          
          <img 
            src={card.image_url} 
            alt={card.category_name} 
            className="w-full h-full object-cover opacity-80 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/80 via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent flex flex-col justify-end p-8 transition-all duration-400">
            <h3 className="text-zinc-800 dark:text-white text-3xl md:text-4xl font-serif italic tracking-tighter">
              {card.category_name}
            </h3>
            <div className="h-[1px] w-0 group-hover:w-full bg-black/40 dark:bg-white/40 transition-all duration-500 mt-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

// --- NEW: SCROLL INDICATOR COMPONENT ---
// Hedhy component sghira tethabet louta
// --- SCROLL INDICATOR COMPONENT (Fixed Z-Index) ---
const ScrollIndicator = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  
  return (
    <motion.div 
      style={{ 
        opacity,
        zIndex: 20 // HOUNI EL BADAL: T7ina fouk el cartes
      }}
      className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none pointer-events-none"
    >
      {/* Text */}
      <span className="text-xs tracking-[0.3em] uppercase font-light text-zinc-500 dark:text-zinc-400">
        Scroll
      </span>
      
      {/* Animated Arrow Container */}
      <div className="relative h-6 w-4 overflow-hidden">
        {/* Arrow 1 */}
        <motion.div
          animate={{ y: [0, 24] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500 dark:text-zinc-400">
            <path d="M8 0 L8 20 M3 15 L8 20 L13 15" />
          </svg>
        </motion.div>
        
        {/* Arrow 2 */}
        <motion.div
          animate={{ y: [-24, 0] }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="absolute top-0 left-1/2 -translate-x-1/2"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500 dark:text-zinc-400">
            <path d="M8 0 L8 20 M3 15 L8 20 L13 15" />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default function StudioStack() {
  const [cards, setCards] = useState<FeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Animation mta3 el ktiba: t-dh-har ken f-ekher el scroll
  const textOpacity = useTransform(scrollYProgress, [0.8, 0.95], [0, 1]);
  const textY = useTransform(scrollYProgress, [0.8, 1], [50, 0]);

  useEffect(() => {
    const fetchHomeCards = async () => {
      try {
        const data = await db.getHomeFeatured();
        if (data) setCards(data);
      } catch (err) {
        console.error("Error loading home cards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeCards();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-white animate-spin" size={32} />
      </div>
    );
  }

  return (
    <section 
      ref={containerRef}
      style={{ height: '200vh' }} 
      className="relative bg-white dark:bg-black transition-colors duration-500 flex flex-col"
    >
      {/* 1. EL PARTIE MTA3 EL CARDS (Sticky) */}
      <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {cards.map((card, idx) => (
            <AnimatedCard 
              key={idx} 
              card={card} 
              index={idx} 
              total={cards.length} 
              scrollYProgress={scrollYProgress} 
            />
          ))}
          
          <ScrollIndicator scrollYProgress={scrollYProgress} />
        </div>
      </div>

      {/* 2. EL ZIYADA HOUNI: El ktiba dji BA3D el cards (louta bel koll) */}
      <motion.div 
        style={{ opacity: textOpacity, y: textY }}
        className="absolute bottom-20 left-0 w-full flex flex-col items-center justify-center pointer-events-none"
      >
        <h2 className="text-[10vw] md:text-[8vw] font-serif italic text-zinc-900 dark:text-white leading-none tracking-tighter opacity-10 dark:opacity-20 uppercase">
          Hamdi Hamouda
        </h2>
        <p className="text-xs md:text-sm tracking-[0.8em] uppercase font-light text-zinc-500 mt-4">
          Visual Storyteller • Studio Pro
        </p>
      </motion.div>
    </section>
  );
}