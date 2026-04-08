import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getHamdiResponse } from '../services/geminiService';
import { Booking } from '../types';
import { db } from '../services/supabaseService'; 
import ReactMarkdown from 'react-markdown'; // 1. Zid el import hadha

interface Props {
  bookings: Booking[];
  externalOpen?: boolean;
  setExternalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatBot: React.FC<Props> = ({
  bookings,
  externalOpen,
  setExternalOpen
}) => {

  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen = setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Asslema! Ena Hamdi Hamouda AI, kifech najem n3awnek lyoum?' }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [packs, setPacks] = useState<any[]>([]);

  // Mantach na9asna chay: Logic popularity kima khallitou
  const handleAddPopularity = async (packId: string, currentPop: number) => {
    const newPop = currentPop + 1;
    setPacks(prevPacks => 
      prevPacks.map(p => p.id === packId ? { ...p, popularity: newPop } : p)
    );
    try {
      await db.updatePopularity(packId, newPop);
    } catch (err) {
      setPacks(prevPacks => 
        prevPacks.map(p => p.id === packId ? { ...p, popularity: currentPop } : p)
      );
    }
  };

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const data = await db.getPacks(); 
        setPacks(data || []);
      } catch (err) {
        console.error("🔴 Error fetching packs in Chatbot:", err);
      }
    };
    fetchPacks();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const response = await getHamdiResponse(userMessage, bookings, packs, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden">
          
          {/* Header */}
          <div className="bg-zinc-100 dark:bg-zinc-800 p-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-zinc-300 overflow-hidden">
                <img src="https://picsum.photos/seed/hamdi/100/100" alt="Hamdi" />
              </div>
              <div>
                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">
                  Hamdi Assistant
                </h4>
                <div className="flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[9px] font-black uppercase text-zinc-500">En ligne</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-black dark:hover:text-white transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div ref={scrollRef} className="flex-grow p-4 space-y-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-950/50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-black text-white dark:bg-zinc-100 dark:text-black shadow-md'
                    : 'bg-white text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700 shadow-sm'
                }`}>
                  {/* Houni rka7na el Markdown bech el links yabdaw clickable */}
                  <ReactMarkdown 
                    components={{
                      a: ({node, ...props}) => (
                        <a 
                          {...props} 
                          className="text-blue-500 dark:text-blue-400 font-bold underline hover:no-underline transition-all"
                          target="_blank" 
                          rel="noopener noreferrer" 
                        />
                      ),
                      p: ({node, ...props}) => <p {...props} className="m-0" />, // Enlever margin p
                      strong: ({node, ...props}) => <strong {...props} className="font-black" />
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-200 dark:bg-zinc-800 px-4 py-3 rounded-2xl flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ikteb hne..."
                className="flex-grow bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-zinc-400 transition-all"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl hover:scale-105 active:scale-95 disabled:opacity-50 transition-all shadow-lg"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black dark:bg-white text-white dark:text-black px-5 py-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all flex items-center space-x-3 group"
        >
          <div className="relative">
            <MessageCircle size={22} className="group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-black rounded-full"></span>
          </div>
          <span className="font-black text-[10px] uppercase tracking-[0.2em]">Helper</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;