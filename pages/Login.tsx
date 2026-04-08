import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService'; 
import { User } from '../types';

interface Props {
  setUser: (u: User | null) => void;
}

const Login: React.FC<Props> = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError || !userData) {
      setError("Login réussi, mais votre profil est introuvable. Contactez l'admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    setUser(userData);
    navigate(userData.role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 bg-white dark:bg-black transition-colors duration-300">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 p-8 md:p-12 space-y-10 shadow-sm dark:shadow-none"
      >
        <div className="text-center space-y-3">
          <h1 className="text-3xl md:text-4xl font-serif text-black dark:text-white italic">Bienvenue Hamdi</h1>
          <p className="text-zinc-400 text-[10px] uppercase tracking-[0.3em] font-medium">Connectez-vous à votre studio</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2 group">
              <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                Email Professionnel
              </label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 px-0 py-2 outline-none focus:border-black dark:focus:border-white transition-all duration-300 text-black dark:text-white text-sm" 
              />
            </div>

            <div className="space-y-2 group">
              <label className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                Mot de Passe
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full bg-transparent border-b border-zinc-200 dark:border-zinc-800 px-0 py-2 outline-none focus:border-black dark:focus:border-white transition-all duration-300 text-black dark:text-white text-sm" 
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-center text-red-500 text-[10px] uppercase tracking-wider font-bold"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-black dark:bg-white text-white dark:text-black py-4 font-bold uppercase tracking-[0.4em] text-[10px] hover:opacity-80 transition-all disabled:bg-zinc-200 dark:disabled:bg-zinc-800 disabled:text-zinc-400"
          >
            {loading ? "Vérification..." : "Se Connecter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;