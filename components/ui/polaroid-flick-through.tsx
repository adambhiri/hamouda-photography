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
  isMobile: boolean;
}

const ScrollIndicator = ({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) => {
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  return (
    <motion.div 
      style={{ opacity }}
      className="absolute bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 select-none z-20 pointer-events-none"
    >
      <span className="text-xs tracking-[0.3em] uppercase font-bold text-zinc-400 dark:text-zinc-500">SCROLL</span>
      <div className="relative h-10 w-6 border border-zinc-300 dark:border-zinc-700 rounded-full flex justify-center pt-2">
        <motion.div animate={{ y: [0, 12, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}>
          <div className="w-1 h-2 bg-zinc-400 dark:bg-zinc-500 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
};

const AnimatedCard = ({ card, index, total, scrollYProgress, isMobile }: CardProps) => {
  const categoryName = card.category_name.charAt(0).toUpperCase() + card.category_name.slice(1).toLowerCase();

  let x, y, opacity, rotate, scale, zIndex;

  if (isMobile) {
    // === MOBILE: VERY FAST SPREAD ===
    
    // 1. Scale
    const baseScale = 0.6;
    zIndex = (index + 1) * 10;

    // 2. Arc Positions
    const arcPositions = [
      { x: -100, y: 40, r: -20 },  // Left
      { x: 0,    y: -40, r: 0 },   // Center Top
      { x: 100,  y: 40, r: 20 }    // Right
    ];

    const pos = arcPositions[index] || { x: 0, y: 0, r: 0 };

    // 3. SUPER FAST RANGES
    const step1Start = 0.0;
    const step1End = 0.15;   // SPREAD ENDS FAST (15% scroll)
    const step2Start = 0.6; 
    const step2End = 0.9;   

    // 4. Animation
    
    x = useTransform(scrollYProgress, 
      [step1Start, step1End, step2Start, step2End], 
      [0, pos.x, pos.x, pos.x * 3] 
    );

    const initialStack = (total - 1 - index) * 5; 
    y = useTransform(scrollYProgress, 
      [step1Start, step1End, step2Start, step2End], 
      [initialStack, pos.y, pos.y, -800] 
    );

    opacity = useTransform(scrollYProgress, 
      [step2Start, step2End], 
      [1, 0]
    );

    rotate = useTransform(scrollYProgress, 
      [step1Start, step1End, step2Start, step2End], 
      [0, pos.r, pos.r, pos.r - 30]
    );

    scale = useTransform(scrollYProgress, 
      [step1Start, step1End], 
      [baseScale * 0.9, baseScale] 
    );

  } else {
    // === DESKTOP: HORIZONTAL SPREAD ===
    const cardWidth = 400;
    const centerIndex = (total - 1) / 2;
    const targetX = (index - centerIndex) * cardWidth;

    const delay = index * 0.05;
    const introStart = 0 + delay;
    const introEnd = 0.01 + delay;
    const spreadStart = 0.1;
    const spreadEnd = 0.15;
    const dropStart = 0.85;
    const dropEnd = 0.95;

    opacity = useTransform(scrollYProgress, [introStart, introEnd, dropStart, dropEnd], [0, 1, 1, 0]);
    const introScale = useTransform(scrollYProgress, [introStart, introEnd], [0.8, 1]);
    x = useSpring(useTransform(scrollYProgress, [spreadStart, spreadEnd], [0, targetX]), { stiffness: 400, damping: 30 });
    y = useSpring(useTransform(scrollYProgress, [dropStart, dropEnd], [0, 100]), { stiffness: 400, damping: 30 });
    rotate = useTransform(scrollYProgress, [spreadStart, spreadEnd], [(index - centerIndex) * 10, 0]);
    scale = introScale;
    zIndex = 10 - index;
  }

  return (
    <motion.div
      style={{ 
        x,
        y,
        opacity,
        scale,
        rotate,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: '-250px',
        marginLeft: '-175px',
        zIndex: zIndex,
      }}
      className="w-[350px] h-[500px] flex-shrink-0"
    >
      <Link 
        to={`/portfolio?category=${categoryName}`}
        className="relative w-full h-full group cursor-pointer no-undefined block"
      >
        <div className="relative w-full h-full bg-zinc-100 dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border border-zinc-200 dark:border-white/10 shadow-xl dark:shadow-2xl transition-all duration-500 hover:border-zinc-400 dark:hover:border-white/30">
          
          <img 
            src={card.image_url} 
            alt={card.category_name} 
            className="w-full h-full object-cover opacity-80 dark:opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-200/80 via-transparent to-transparent dark:from-black dark:via-transparent dark:to-transparent flex flex-col justify-end p-8 transition-all duration-400">
            <h3 className="text-black dark:text-white text-3xl md:text-4xl font-serif italic tracking-tighter">
              {card.category_name}
            </h3>
            <div className="h-[1px] w-0 group-hover:w-full bg-black/40 dark:bg-white/40 transition-all duration-500 mt-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default function StudioStack() {
  const [cards, setCards] = useState<FeaturedCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
      style={{ height: '300vh' }} 
      className="relative bg-white dark:bg-black transition-colors duration-500"
    >
      <div 
        className="sticky top-0 h-screen w-full flex items-center justify-center overflow-visible"
      >
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative w-full h-full">
            {cards.map((card, idx) => (
              <AnimatedCard 
                key={idx} 
                card={card} 
                index={idx} 
                total={cards.length} 
                scrollYProgress={scrollYProgress}
                isMobile={isMobile}
              />
            ))}
          </div>
          <ScrollIndicator scrollYProgress={scrollYProgress} />
        </div>
      </div>
    </section>
  );
}