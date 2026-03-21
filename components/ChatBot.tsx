import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { getHamdiResponse } from '../services/geminiService';
import { Booking } from '../types';
import { db } from '../services/supabaseService'; 
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

  // internal state (if no external control)
  const [internalOpen, setInternalOpen] = useState(false);

  // decide which state to use
  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;
  const setIsOpen =
    setExternalOpen !== undefined ? setExternalOpen : setInternalOpen;

  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Asslema! Ena Hamdi Hamouda, kifech najem n3awnek lyoum?' }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [dbPacks, setDbPacks] = useState<any[]>([]);

const [packs, setPacks] = useState<any[]>([]);
// 1. El Function elli t-zid el popularity
const handleAddPopularity = async (packId: string, currentPop: number) => {
  const newPop = currentPop + 1;

  // OPTIMISTIC UPDATE: Baddel el UI toul bech el user ma y-stannach
  setPacks(prevPacks => 
    prevPacks.map(p => p.id === packId ? { ...p, popularity: newPop } : p)
  );

  // 2. SAJJEL FEL DATABASE
  try {
    await db.updatePopularity(packId, newPop);
    console.log("✅ Popularity updated in DB!");
  } catch (err) {
    // Ken saret mochkla, raja3 el popularity kima kanet (Rollback)
    console.error("🔴 Failed to sync with DB:", err);
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
      console.log("✅ Packs loaded in Chatbot:", data);
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

    const response = await getHamdiResponse(userMessage, bookings,packs, messages);

    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
      {isOpen ? (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-800 rounded-2xl w-[350px] sm:w-[400px] h-[500px] shadow-2xl flex flex-col overflow-hidden">

          {/* Header */}
          <div className="bg-zinc-200 dark:bg-zinc-800 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-white overflow-hidden">
                <img
                  src="https://picsum.photos/seed/hamdi/100/100"
                  alt="Hamdi"
                />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-zinc-900 dark:text-zinc-300">
                  Hamdi Hamouda AI
                </h4>
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-zinc-900 dark:text-zinc-300">
                    En ligne
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-black dark:hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            className="flex-grow p-4 space-y-4 overflow-y-auto bg-zinc-50 dark:bg-black/20"
          >
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    m.role === 'user'
                      ? 'bg-black text-white dark:bg-zinc-700'
                      : 'bg-zinc-200 text-black dark:bg-zinc-800 dark:text-white'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-zinc-200 dark:bg-zinc-800 p-3 rounded-xl flex space-x-1">
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 bg-white dark:bg-zinc-900 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ikteb hne..."
                className="flex-grow bg-zinc-200 dark:bg-zinc-800 rounded-lg px-4 py-2 text-sm text-black dark:text-white"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-black dark:bg-white text-white dark:text-black rounded-lg disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-white text-black p-4 rounded-full shadow-xl hover:scale-110 transition-transform flex items-center space-x-2"
        >
          <MessageCircle size={24} />
          <span className="font-bold text-xs pr-2">Hamdi Helper</span>
        </button>
      )}
    </div>
  );
};

export default ChatBot;