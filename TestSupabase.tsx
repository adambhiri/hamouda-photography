import React from 'react';
import { supabase } from './services/supabaseService'; // N'importiw el client el jdid

const TestSupabase = () => {

  const handleTest = async () => {
    console.log("🟡 Bouton cliqué! Tentative de lecture de la table 'packs'...");

    const { data, error } = await supabase
      .from('packs') // On va essayer de lire la table 'packs'
      .select('*')
      .limit(5); // On ne veut que 5 résultats pour le test

    if (error) {
      console.error("🔴 ERREUR DIRECTE DE SUPABASE:", error);
    } else {
      console.log("✅ SUCCÈS! Données reçues de la table 'packs':", data);
    }
  };

  return (
    <div style={{ padding: '40px', textAlign: 'center', background: '#111', color: 'white', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '2em', fontFamily: 'serif' }}>Page de Test Supabase</h1>
      <p style={{ color: '#888', marginBottom: '30px' }}>Ce test est isolé du reste de l'application.</p>
      <button 
        onClick={handleTest}
        style={{ padding: '15px 30px', fontSize: '1.2em', cursor: 'pointer', background: 'white', color: 'black', border: 'none', borderRadius: '5px' }}
      >
        Lancer le Test de Connexion
      </button>
      <div style={{ marginTop: '30px', fontFamily: 'monospace', textAlign: 'left', background: 'black', padding: '20px', border: '1px solid #333' }}>
        <p>Ouvrez la console et cliquez sur le bouton pour voir le résultat.</p>
      </div>
    </div>
  );
};

export default TestSupabase;
