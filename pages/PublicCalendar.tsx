import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock, 
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from '../types'; 
import { Link } from 'react-router-dom';

interface Props {
  bookings: Booking[];
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublicCalendar: React.FC<Props> = ({ bookings, setChatOpen }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const monthName = currentDate.toLocaleString('fr-FR', { month: 'long' });

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-24 space-y-12 md:space-y-20 transition-colors">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 md:space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-7xl font-serif tracking-tight text-black dark:text-white"
        >
          Disponibilité
        </motion.h1>
        <p className="text-zinc-400 tracking-[0.2em] md:tracking-[0.4em] uppercase text-[8px] md:text-[10px] font-black">
          Planifiez votre session en toute simplicité
        </p>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[3rem] overflow-hidden shadow-xl relative">
        
        {/* Header du Calendrier */}
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800 gap-6">
          <div className="flex items-center gap-4 md:gap-6">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-3 md:p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl hover:scale-105 transition-all text-black dark:text-white shadow-sm"><ChevronLeft size={18}/></button>
            <h2 className="text-xl md:text-3xl font-serif min-w-[150px] md:min-w-[220px] text-center capitalize text-black dark:text-white">
              {monthName} <span className="text-zinc-400 font-light">{year}</span>
            </h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-3 md:p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-xl hover:scale-105 transition-all text-black dark:text-white shadow-sm"><ChevronRight size={18}/></button>
          </div>
          
          <div className="flex gap-6 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
            <div className="flex items-center gap-2 text-zinc-400"><div className="w-2 h-2 rounded-full border border-zinc-300 dark:border-zinc-600"></div> <span>Libre</span></div>
            <div className="flex items-center gap-2 text-orange-500">
                <div className="w-2 h-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]"></div>
                <span>Semi-Occupé</span>
            </div>
            {/* HETHI EL KEY: Complet (Ahmer) */}
            <div className="flex items-center gap-2 text-red-500">
                <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.4)]"></div> 
                <span>Complet</span>
            </div>
          </div>
        </div>

        {/* Grid des Jours */}
        <div className="p-4 md:p-10 overflow-x-auto">
          <div className="min-w-[600px] md:min-w-full">
            <div className="grid grid-cols-7 gap-1 md:gap-3 text-center text-[8px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4 md:mb-8">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 md:gap-3">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} className="h-16 md:h-28 rounded-xl md:rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 opacity-30"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                
                // 1. Thabbet ken el nhar msaker mel admin
                const isClosed = bookings.some(b => b.date === dStr && b.status === 'cancelled' && b.clientName === '--- JOURNÉE CLÔTURÉE ---');
                
                // 2. Nehsbou el bookings mta3 el nhar hadha (men ghir el marker mta3 el clôture)
                const dayBookings = bookings.filter(b => b.date === dStr && b.clientName !== '--- JOURNÉE CLÔTURÉE ---');
                
                const totalCapacity = timeSlots.length * 2;
                const bookedCount = dayBookings.length;

                // 3. Logic mta3 el status (Ken msaker ywalli toul FullyBooked)
                const isFullyBooked = isClosed || bookedCount >= totalCapacity;
                const isPartiallyBooked = !isClosed && bookedCount > 0 && bookedCount < totalCapacity;
                const isSelected = selectedDate === dStr;

                // 4. Te5tiyar el Alwen
                let dayStyles = "bg-white dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800 text-zinc-400 hover:border-zinc-400";
                let statusText = "Libre";

                if (isFullyBooked) {
                  dayStyles = "bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400";
                  statusText = "Complet";
                } else if (isPartiallyBooked) {
                  dayStyles = "bg-orange-500/10 border-orange-500/50 text-orange-600 dark:text-orange-400";
                  statusText = "Semi-Occupé";
                }

                return (
                  <motion.div 
                    whileHover={!isFullyBooked ? { y: -3 } : {}}
                    key={day} 
                    onClick={() => !isFullyBooked && setSelectedDate(dStr)}
                    className={`h-16 md:h-28 border rounded-lg md:rounded-[1.5rem] p-2 md:p-5 flex flex-col justify-between transition-all relative ${dayStyles} ${
                      isSelected ? 'ring-2 ring-black dark:ring-white ring-offset-2 scale-105 z-10 shadow-lg !bg-black dark:!bg-white !text-white dark:!text-black' : ''
                    } ${isFullyBooked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span className="text-xs md:text-sm font-black">{day}</span>
                    
                    <div className="hidden md:flex justify-between items-center">
                      <span className="text-[7px] font-black uppercase tracking-widest opacity-80">
                         {statusText}
                      </span>
                    </div>

                    {/* Dot indicator lel mobile */}
                    {(bookedCount > 0 || isClosed) && (
                      <div className={`absolute top-2 right-2 md:hidden w-1.5 h-1.5 rounded-full ${isFullyBooked ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Détails du jour sélectionné */}
      <AnimatePresence mode="wait">
        {selectedDate ? (
          <motion.div 
            key={selectedDate}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[1.5rem] md:rounded-[3rem] p-6 md:p-12 space-y-8 md:space-y-12 shadow-inner"
          >
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2">
                <p className="text-zinc-500 uppercase tracking-widest text-[8px] md:text-[10px] font-black flex items-center gap-2">
                  <CalendarDays size={12} className="text-black dark:text-white" /> Créneaux horaires
                </p>
                <h3 className="text-xl md:text-4xl font-serif text-black dark:text-white capitalize">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-3 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-400 hover:text-black dark:hover:text-white transition-all"><X size={18}/></button>
            </div>

            <div className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* ÉQUIPE OFFICIELLE */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-l-2 border-black dark:border-white pl-4">Équipe Officielle</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(time => {
                      const isBooked = bookings.find(b => b.date === selectedDate && b.time === time && (b.team === 'officielle' || !b.team));
                      return (
                        <div key={time} className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${isBooked ? 'bg-zinc-100 dark:bg-zinc-900/50 border-transparent text-zinc-400 dark:text-zinc-600' : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white shadow-sm'}`}>
                          <p className="text-xs font-black">{time}</p>
                          <p className="text-[7px] uppercase tracking-widest font-black opacity-40">{isBooked ? 'Occupé' : 'Libre'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* DEUXIÈME ÉQUIPE */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 border-l-2 border-zinc-300 dark:border-zinc-700 pl-4">Deuxième Équipe</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {timeSlots.map(time => {
                      const isBooked = bookings.find(b => b.date === selectedDate && b.time === time && b.team === 'equipe_b');
                      return (
                        <div key={time} className={`p-4 rounded-2xl border text-center space-y-1 transition-all ${isBooked ? 'bg-zinc-100 dark:bg-zinc-900/50 border-transparent text-zinc-400 dark:text-zinc-600' : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white shadow-sm'}`}>
                          <p className="text-xs font-black">{time}</p>
                          <p className="text-[7px] uppercase tracking-widest font-black opacity-40">{isBooked ? 'Occupé' : 'Libre'}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-8">
              <p className="text-zinc-500 text-xs md:text-sm font-medium max-w-xl text-center lg:text-left leading-relaxed">
                Un créneau est libre ? Envoyez une demande via l'AI ou contactez-nous directement.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/contact" className="bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white px-6 py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:bg-zinc-300 dark:hover:bg-zinc-700 transition text-center">Contact Direct</Link>
                <button onClick={() => setChatOpen(true)} className="bg-black dark:bg-white text-white dark:text-black px-6 py-4 rounded-full text-[9px] font-bold uppercase tracking-widest hover:opacity-80 transition text-center">Demander à l'AI</button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-12 md:py-20 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-100 dark:border-zinc-800 border-dashed rounded-[1.5rem] md:rounded-[3rem]"
          >
            <CalendarDays className="text-zinc-200 dark:text-zinc-800 mx-auto mb-4" size={32} />
            <p className="text-zinc-400 text-xs md:text-sm font-serif italic px-6">Sélectionnez une date pour voir les horaires.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicCalendar;