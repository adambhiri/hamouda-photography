import { createClient } from '@supabase/supabase-js';
import { Pack, Booking, Slide, ContactInfo, User, PortfolioItem } from '../types';

// Tes clés s7a7.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; 
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

// On crée le client UNE SEULE FOIS.
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// El objet "db" jdid, yekhdem direct bel client hedha.
export const db = {
  // --- PACKS ---
  // Fi supabaseService.ts, fi west el "db" object
async addPack(packData: Omit<Pack, 'id'>): Promise<Pack | null> {
    console.log("🟡 Ajout d'un nouveau pack...", packData);
    
    // 1. On crée un ID unique côté client
    const newId = `pack_${Math.random().toString(36).substring(2, 11)}`;

    // 2. On l'ajoute aux données avant de les envoyer
    const dataToInsert = {
        ...packData,
        id: newId
    };

    const { data, error } = await supabase
      .from('packs')
      .insert(dataToInsert) // On envoie l'objet complet avec l'ID
      .select()
      .single(); 

    if (error) {
      console.error("🔴 Erreur addPack:", error);
      return null;
    }
    console.log("✅ Pack ajouté avec succès:", data);
    return data;
},
  async getPacks(): Promise<Pack[]> {
    const { data, error } = await supabase.from('packs').select('*');
    if (error) {
      console.error("🔴 Erreur getPacks:", error);
      throw error;
    }
    return data || [];
  },
  
  async savePacks(packs: Pack[]) {
    console.log("🟡 Tentative savePacks (upsert)...", packs);
    const { error } = await supabase.from('packs').upsert(packs);
    if (error) console.error("🔴 Erreur savePacks:", error);
    else console.log("✅ Packs sauvegardés!");
  },

async updatePack(id: string, updates: Partial<Pack>) {
  const { data, error } = await supabase
    .from('packs') 
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating pack:', error);
    return null;
  }
  
  return data;
},
  async deletePack(packId: number | string) {
    console.log(`🟡 Suppression du pack avec ID: ${packId}`);
    const { error } = await supabase.from('packs').delete().eq('id', packId);
    if (error) console.error("🔴 Erreur deletePack:", error);
    else console.log("✅ Pack supprimé!");
  },
  async updatePopularity(packId: string, newPopularity: number) {
    const { data, error } = await supabase
      .from('packs')
      .update({ popularity: newPopularity }) // Ism el column kima zedtou enti
      .eq('id', packId)
      .select()
      .single();

    if (error) {
      console.error("🔴 Erreur updatePopularity:", error);
      return null;
    }
    return data;
  }
,

  // --- BOOKINGS ---
  async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
      console.error("🔴 Erreur getBookings:", error);
      throw error;
    }
    return data || [];
  },

  async saveBookings(bookings: Booking[]) {
    console.log("🟡 Tentative saveBookings (upsert)...", bookings);
    const { error } = await supabase.from('bookings').upsert(bookings);
    if (error) console.error("🔴 Erreur saveBookings:", error);
    else console.log("✅ Bookings sauvegardés!");
  },

  async deleteBooking(bookingId: number | string) {
    console.log(`🟡 Suppression du booking avec ID: ${bookingId}`);
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) console.error("🔴 Erreur deleteBooking:", error);
    else console.log("✅ Booking supprimé!");
  },

  // --- SLIDES ---
  async getSlides(): Promise<Slide[]> {
    const { data, error } = await supabase.from('slides').select('*');
    if (error) {
      console.error("🔴 Erreur getSlides:", error);
      throw error;
    }
    return data || [];
  },

  async saveSlides(slides: Slide[]) {
    console.log("🟡 Tentative saveSlides (upsert)...", slides);
    const { error } = await supabase.from('slides').upsert(slides);
    if (error) console.error("🔴 Erreur saveSlides:", error);
    else console.log("✅ Slides sauvegardés!");
  },
  
  async deleteSlide(slideId: number | string) {
    console.log(`🟡 Suppression du slide avec ID: ${slideId}`);
    const { error } = await supabase.from('slides').delete().eq('id', slideId);
    if (error) console.error("🔴 Erreur deleteSlide:", error);
    else console.log("✅ Slide supprimé!");
  },

  // --- USERS ---
  async getUsers(): Promise<User[]> {
    const { data, error } = await supabase.from('users').select('*');
     if (error) {
      console.error("🔴 Erreur getUsers:", error);
      throw error;
    }
    return data || [];
  },

  async deleteUser(userId: string) {
    // Note: Ceci ne supprime que de la table `public.users`. 
    // Pour supprimer l'authentification, il faut utiliser `supabase.auth.admin.deleteUser`.
    console.log(`🟡 Suppression de l'utilisateur avec ID: ${userId}`);
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (error) console.error("🔴 Erreur deleteUser:", error);
    else console.log("✅ Utilisateur supprimé!");
  },
  
  // --- CONTACT ---
  async getContact(): Promise<ContactInfo | null> {
    const { data, error } = await supabase.from('contact').select('*').single();
    if (error) {
        console.error("🔴 Erreur getContact:", error);
    }
    return data;
  },

  async saveContact(contact: ContactInfo) {
    console.log("🟡 Tentative saveContact...", contact);
    const { error } = await supabase.from('contact').upsert({ id: 1, ...contact });
     if (error) console.error("🔴 Erreur saveContact:", error);
     else console.log("✅ Contact sauvegardé!");
  },

  // --- PORTFOLIO ---
  async getPortfolio(): Promise<PortfolioItem[]> {
    const { data, error } = await supabase.from('portfolio_items').select('*');
    if (error) {
      console.error("🔴 Erreur getPortfolio:", error);
      // Return empty array instead of throwing to prevent app crash if table doesn't exist
      return [];
    }
    return data || [];
  },
async updatePortfolioItem(itemId: number | string, updatedData: Partial<PortfolioItem>) {
    const { error } = await supabase
      .from('portfolio_items')
      .update(updatedData)
      .eq('id', itemId);

    if (error) console.error("🔴 Erreur updatePortfolioItem:", error);
},
  
  // --- ZID EL Khedma el Jdida Houni ---
  async addPortfolioItem(itemData: Omit<PortfolioItem, 'id'>): Promise<PortfolioItem | null> {
    console.log("🟡 Ajout d'un nouvel item au portfolio...", itemData);
    
    const { data, error } = await supabase
      .from('portfolio_items') // On utilise le nom de table correct
      .insert(itemData)
      .select()
      .single(); 

    if (error) {
      console.error("🔴 Erreur addPortfolioItem:", error);
      return null;
    }
    
    console.log("✅ Item ajouté avec succès:", data);
    return data;
  },

  // --- Delete  ---
  async deletePortfolioItem(itemId: number | string) {
    console.log(`🟡 Suppression de l'item avec ID: ${itemId}`);
    const { error } = await supabase.from('portfolio_items').delete().eq('id', itemId);
    if (error) console.error("🔴 Erreur deletePortfolioItem:", error);
  },
 async savePortfolioItems(items: PortfolioItem[]) {
    console.log("🟡 Sauvegarde (upsert) de tous les items du portfolio...");
    const { error } = await supabase
      .from('portfolio_items')
      .upsert(items); // upsert met à jour les items existants et ajoute les nouveaux

    if (error) {
      console.error("🔴 Erreur savePortfolioItems:", error);
    } else {
      console.log("✅ Portfolio sauvegardé avec succès!");
    }
  },
 // 1. Tjib el categories el kol mel portfolio
  async getCategories() {
    const { data, error } = await supabase
      .from('portfolio_items')
      .select('category');
    if (error) throw error;
    return data;
  },

  // 2. Tjib el 3 cards elli bech yodhor f-el Home
 // F-west el object db f-el supabaseService.ts
async getHomeFeatured() {
  const { data, error } = await supabase
    .from('home_featured')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data;
},

async upsertHomeFeatured(item: { category_name: string; image_url: string; display_order: number }) {
  const { data, error } = await supabase
    .from('home_featured')
    .upsert({
      category_name: item.category_name,
      image_url: item.image_url,
      display_order: item.display_order
    }, { 
      onConflict: 'display_order' 
    });

  if (error) {
    console.error("Error details:", error);
    throw error;
  }
  return data;
}
,
async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    // Nadhfou el local storage bech ma yo93od chay
    localStorage.removeItem('sb-api-auth-token'); 
},
  // UPLOAD with SIGNED URL (bypasses RLS)
 async uploadPortfolioFile(file: File): Promise<string | null> {
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage
      .from('portfolio') // Le nom de notre bucket
      .upload(fileName, file);

    if (error) {
      console.error("Erreur d'upload Storage:", error);
      return null;
    }

    // On récupère l'URL public du fichier uploadé
    const { data: { publicUrl } } = supabase.storage
      .from('portfolio')
      .getPublicUrl(fileName);
      
    return publicUrl;
}
};
