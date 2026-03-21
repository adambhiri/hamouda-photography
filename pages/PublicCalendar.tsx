import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CalendarDays, 
  Clock, 
  X, 
  Send, 
  CheckCircle2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Booking } from '../types'; 

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
    <div className="max-w-6xl mx-auto px-6 py-24 space-y-20 transition-colors">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-7xl font-serif tracking-tight text-black dark:text-white"
        >
          Disponibilité
        </motion.h1>
        <p className="text-zinc-400 tracking-[0.4em] uppercase text-[10px] font-black">Planifiez votre session en toute simplicité</p>
      </div>

      {/* Main Calendar Card */}
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] overflow-hidden shadow-2xl relative">
        <div className="bg-zinc-50 dark:bg-zinc-900/50 p-10 flex flex-col md:flex-row items-center justify-between border-b border-zinc-200 dark:border-zinc-800 gap-8">
          <div className="flex items-center gap-6">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))} className="p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-110 active:scale-90 transition-all text-black dark:text-white shadow-sm"><ChevronLeft size={20}/></button>
            <h2 className="text-3xl font-serif min-w-[220px] text-center capitalize text-black dark:text-white">{monthName} <span className="text-zinc-400 font-light">{year}</span></h2>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))} className="p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:scale-110 active:scale-90 transition-all text-black dark:text-white shadow-sm"><ChevronRight size={20}/></button>
          </div>
          
          <div className="flex gap-8 text-[9px] font-black uppercase tracking-[0.2em]">
            <div className="flex items-center gap-3 text-zinc-400"><div className="w-2 h-2 rounded-full border border-zinc-300 dark:border-zinc-600"></div> <span>Disponible</span></div>
            <div className="flex items-center gap-3 text-black dark:text-white"><div className="w-2 h-2 bg-black dark:bg-white rounded-full"></div> <span>Réservé</span></div>
          </div>
        </div>

        <div className="p-10">
          <div className="grid grid-cols-7 gap-3 text-center text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-8">
            {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map(d => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} className="h-28 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10"></div>)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const dayBookings = bookings.filter(b => b.date === dStr);
              const isOccupied = dayBookings.length > 0;
              const isSelected = selectedDate === dStr;
              
              return (
                <motion.div 
                  whileHover={{ y: -5 }}
                  key={day} 
                  onClick={() => setSelectedDate(dStr)}
                  className={`h-28 border rounded-[1.5rem] p-5 flex flex-col justify-between transition-all duration-300 cursor-pointer relative group ${
                    isOccupied 
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-lg' 
                    : 'bg-white dark:bg-zinc-900/30 border-zinc-100 dark:border-zinc-800 text-zinc-300 dark:text-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-black dark:hover:text-white'
                  } ${isSelected ? 'ring-2 ring-black dark:ring-white ring-offset-4 dark:ring-offset-black scale-[1.05] z-10' : ''}`}
                >
                  <span className={`text-sm font-black ${isOccupied ? '' : 'group-hover:text-black dark:group-hover:text-white'}`}>{day}</span>
                  <div className="flex justify-between items-center">
                    <span className="text-[8px] font-black uppercase tracking-widest opacity-60">
                       {isOccupied ? 'Occupé' : 'Libre'}
                    </span>
                    {isOccupied ? <X size={12} strokeWidth={3} /> : <div className="w-1 h-1 rounded-full bg-current opacity-20"></div>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Details Section for Selected Date */}
      <AnimatePresence mode="wait">
        {selectedDate ? (
          <motion.div 
            key={selectedDate}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }}
            className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-[3rem] p-12 space-y-12 shadow-inner"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-[10px] font-black flex items-center gap-3">
                  <CalendarDays size={14} className="text-black dark:text-white" /> Créneaux horaires
                </p>
                <h3 className="text-4xl font-serif text-black dark:text-white">
                  {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>
              </div>
              <button onClick={() => setSelectedDate(null)} className="p-4 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-400 hover:text-black dark:hover:text-white transition-all shadow-sm"><X size={20}/></button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
              {timeSlots.map(time => {
                const isBooked = bookings.find(b => b.date === selectedDate && b.time === time);
                return (
                  <div 
                    key={time} 
                    className={`group p-6 rounded-[2rem] border text-center space-y-3 transition-all duration-500 ${
                      isBooked 
                      ? 'bg-zinc-200 dark:bg-zinc-800/50 border-transparent text-zinc-400 dark:text-zinc-600 grayscale pointer-events-none' 
                      : 'bg-white dark:bg-black border-zinc-200 dark:border-zinc-800 text-black dark:text-white hover:border-black dark:hover:border-white hover:shadow-xl'
                    }`}
                  >
                    <Clock size={14} className={`mx-auto ${isBooked ? 'opacity-20' : 'text-zinc-300 dark:text-zinc-700 group-hover:text-black dark:group-hover:text-white transition-colors'}`} />
                    <p className="text-sm font-black">{time}</p>
                    <p className="text-[8px] uppercase tracking-[0.2em] font-black opacity-40">
                      {isBooked ? 'Réservé' : 'Libre'}
                    </p>
                  </div>
                );
              })}
            </div>

           <div className="pt-10 border-t border-zinc-200 dark:border-zinc-800 flex flex-col lg:flex-row items-center justify-between gap-10">
   <p className="text-zinc-500 text-sm font-medium max-w-2xl text-center lg:text-left leading-relaxed">
     Un créneau est libre ? Vous pouvez envoyer une demande de réservation via notre assistant AI ou nous contacter directement par téléphone.
   </p>
   <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
     
     <a 
       href="#/contact" 
       className="dark:bg-zinc-800 bg-zinc-300 dark:text-white text-zinc-900 px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest dark:hover:bg-zinc-700 hover:bg-zinc-400 transition text-center flex items-center justify-center"
     >
       Contact Direct
     </a>
     
     <button 
       onClick={() => setChatOpen(true)} 
       className="dark:bg-white bg-zinc-900 dark:text-black text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest dark:hover:bg-zinc-200 hover:bg-zinc-600 transition flex items-center justify-center"
     >
       Demander à l'AI
     </button>
   </div>
</div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/20 border border-zinc-200 dark:border-zinc-800 border-dashed rounded-[3rem]"
          >
            <div className="w-16 h-16 bg-white dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <CalendarDays className="text-zinc-300" size={24} />
            </div>
            <p className="text-zinc-400 text-sm font-serif italic">Veuillez sélectionner une date pour afficher les disponibilités horaires.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicCalendar;