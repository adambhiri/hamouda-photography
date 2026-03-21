import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../services/supabaseService'; // L'import s7i7
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

    // 1. Authentification avec le "Bureau des Passeports"
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (authError || !authData.user) {
      setError(authError?.message || "Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    // 2. Si ça marche, on va au "Bureau de l'État Civil" pour chercher le rôle
    console.log("✅ Authentification réussie. Recherche du profil...");
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*') // On peut mettre 'id, name, email, role'
      .eq('id', authData.user.id) // On cherche par l'ID du passeport
      .single();

    if (userError || !userData) {
      console.error("🔴 ERREUR: Profil introuvable dans public.users", userError);
      setError("Login réussi, mais votre profil est introuvable. Contactez l'admin.");
      await supabase.auth.signOut(); // On le déconnecte
      setLoading(false);
      return;
    }

    // 3. TOUT EST BON! On a le passeport ET le badge (rôle)
    console.log("✅ Profil trouvé:", userData);
    setUser(userData); // On met le user COMPLET (avec le rôle) dans App.tsx
    navigate(userData.role === 'admin' ? '/admin' : '/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-950 border border-zinc-900 p-12 space-y-8"
      >
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif">Bienvenue</h1>
          <p className="text-zinc-500 text-xs uppercase tracking-widest">Connectez-vous pour continuer</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          {/* ... les inputs restent les mêmes ... */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black border border-zinc-800 px-4 py-3 outline-none focus:border-white transition" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Mot de passe</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black border border-zinc-800 px-4 py-3 outline-none focus:border-white transition" />
          </div>
          {error && <p className="text-center text-red-500 text-xs">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-white text-black py-4 font-bold uppercase tracking-widest text-xs hover:bg-zinc-200 transition disabled:bg-zinc-600">
            {loading ? "Connexion..." : "Se Connecter"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;