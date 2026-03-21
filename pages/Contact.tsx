import React, { useState } from 'react';
import { ContactInfo, User } from '../types';
import { Phone, Instagram, Facebook, Mail, MapPin, Send } from 'lucide-react';
import { supabase } from '../services/supabaseService';
import { motion } from 'framer-motion';

interface Props {
  contact: ContactInfo;
  user: User | null;
}

const Contact: React.FC<Props> = ({ contact, user }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    contactInfo: user?.email || '',
    eventDate: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.functions.invoke('send-contact-email', {
      body: formData
    });

    if (error) {
      alert(`Erreur: ${error.message}`);
      setLoading(false);
      return;
    }

    alert("Yatik essaha! Message tba3ath.");
    setFormData({ name: '', contactInfo: '', eventDate: '', message: '' });
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-24 transition-colors duration-500">
      {/* Header Section */}
      <div className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-serif text-black dark:text-white"
        >
          Contact
        </motion.h1>
        <p className="text-zinc-400 tracking-[0.5em] uppercase text-[10px] font-black">Planifions votre prochain projet</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-24 items-start">
        {/* Info Side */}
        <div className="space-y-20">
          <div className="grid sm:grid-cols-2 gap-16">
            {[
              { icon: <Phone size={20}/>, label: 'Téléphone', val: contact.phone, link: `tel:${contact.phone}` },
              { icon: <Mail size={20}/>, label: 'Email', val: contact.email, link: `mailto:${contact.email}` },
              { icon: <Instagram size={20}/>, label: 'Instagram', val: contact.instagram, link: '#' },
              { icon: <Facebook size={20}/>, label: 'Facebook', val: contact.facebook, link: '#' }
            ].map((item, i) => (
              <motion.a 
                href={item.link}
                key={i} 
                initial={{ opacity: 0, x: -20 }} 
                whileInView={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.1 }}
                className="group block space-y-4"
              >
                <h3 className="text-[10px] uppercase tracking-[0.3em] font-black text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors flex items-center gap-3">
                  <span className="p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-zinc-100 dark:border-zinc-800 group-hover:scale-110 transition-transform">{item.icon}</span>
                  {item.label}
                </h3>
                <p className="text-xl font-medium text-zinc-600 dark:text-zinc-300 group-hover:translate-x-2 transition-transform">{item.val}</p>
              </motion.a>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="p-12 bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] relative overflow-hidden group shadow-sm"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-125 transition-transform duration-700">
                <MapPin size={120} />
            </div>
            <div className="flex items-start space-x-6 relative z-10">
              <div className="p-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl">
                <MapPin size={24} />
              </div>
              <div className="space-y-2">
                <p className="text-2xl font-serif text-black dark:text-white">Basé à Msaken, Sousse</p>
                <p className="text-xs text-zinc-400 uppercase tracking-widest leading-relaxed">Disponible pour déplacements nationaux & internationaux</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Form Side */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} 
          whileInView={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          {/* Subtle background glow */}
          <div className="absolute -inset-4 bg-zinc-100 dark:bg-zinc-900/30 rounded-[3.5rem] blur-2xl -z-10" />
          
          <form 
            onSubmit={handleSubmit} 
            className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-12 md:p-16 space-y-10 rounded-[3rem] shadow-2xl"
          >
            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 ml-1">Identité</label>
              <input 
                required
                name="name"
                onChange={handleInputChange}
                placeholder="Votre Nom Complet"
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-8 py-5 rounded-2xl focus:bg-white dark:focus:bg-black focus:ring-2 ring-zinc-100 dark:ring-zinc-800 outline-none transition-all text-sm font-medium"
                type="text" 
              />
            </div>
            
            <div className="grid sm:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 ml-1">Contact</label>
                <input 
                  required
                  name="contactInfo"
                  
                  onChange={handleInputChange}
                  placeholder="Email ou Mobile"
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-8 py-5 rounded-2xl focus:bg-white dark:focus:bg-black focus:ring-2 ring-zinc-100 dark:ring-zinc-800 outline-none transition-all text-sm font-medium"
                  type="text" 
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 ml-1">Date</label>
                <input 
                  required
                  name="eventDate"
                 
                  onChange={handleInputChange}
                  className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-8 py-5 rounded-2xl focus:bg-white dark:focus:bg-black focus:ring-2 ring-zinc-100 dark:ring-zinc-800 outline-none transition-all text-sm font-medium uppercase"
                  type="date" 
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase tracking-[0.4em] font-black text-zinc-400 ml-1">Votre Vision</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Parlez-nous de votre projet..."
                className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 px-8 py-5 rounded-2xl focus:bg-white dark:focus:bg-black focus:ring-2 ring-zinc-100 dark:ring-zinc-800 outline-none transition-all text-sm font-medium resize-none"
              /> 
            </div>

            <button 
              disabled={loading}
              className="w-full bg-black dark:bg-white text-white dark:text-black py-6 rounded-2xl uppercase font-black tracking-[0.5em] text-[10px] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 shadow-xl shadow-black/5 dark:shadow-white/5"
            >
              {loading ? 'ENVOI EN COURS...' : <><Send size={16} strokeWidth={3}/> ENVOYER LE MESSAGE</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;