import { createClient } from '@supabase/supabase-js';
import { Pack, Booking, Slide, ContactInfo, User, PortfolioItem } from '../types';

// Tes clés s7a7.
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL; 
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;
 const CLOUDINARY_UPLOAD_PRESET = 'ml_default'; // Create an "Unsigned" preset in Cloudinary Settings
const CLOUDINARY_CLOUD_NAME = 'dtklpdj4t';
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
  async deletePack(packId: string) {
    console.log(`🟡 Tentative de suppression du pack ID: ${packId}`);
    
    const { error, count } = await supabase
        .from('packs')
        .delete()
        .eq('id', packId.toString()); // نضمنوا إنو مبعوث كـ string

    if (error) {
        console.error("🔴 Erreur Supabase deletePack:", error);
        return { success: false, error };
    }
    
    console.log("✅ Delete command executed. Rows affected:", count);
    return { success: true };
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
 // --- BOOKINGS ---
// db.ts
async saveBookings(allBookings: Booking[], targetDate: string) {
  if (!targetDate || targetDate === "undefined") {
        console.warn("⚠️ SaveBookings annulé : targetDate est undefined.");
        return false; 
    }
    try {
        // 1. تفسخ كان النهار هذاكا
        const { error: delError } = await supabase
            .from('bookings')
            .delete()
            .eq('date', targetDate);

        if (delError) throw delError;

        // 2. تفرز الداتا متاع النهار هذاكا بركا من الـ state الكامل
        const dayData = allBookings.filter(b => b.date === targetDate);

        if (dayData.length > 0) {
            const formatted = dayData.map(b => {
                // نـحـيـوا الـ ID لـو كـان مـاهـوش رقـم (خـاطـر الـ DB تـعـطـي وحـدها)
                const isManualId = typeof b.id === 'string' || b.id > 1000000000;
                
                return {
                    client_name: b.clientName || (b as any).client_name,
                    date: b.date,
                    time: b.time || null,
                    status: b.status || 'confirmed',
                    pack_id: b.pack_id || null,
                    description: b.description || '',
                    team: b.team || '',
                    price_override: b.priceOverride || null
                };
            });

            const { error: insError } = await supabase.from('bookings').insert(formatted);
            if (insError) throw insError;
        }
        return true;
    } catch (error) {
        console.error("Sync Error:", error);
        throw error;
    }
},
async getBookings(): Promise<Booking[]> {
    const { data, error } = await supabase.from('bookings').select('*');
    if (error) {
        console.error("🔴 Erreur Fetch:", error);
        return [];
    }
    console.log("🟢 Data fetched from DB:", data);

    return (data || []).map(b => ({
        ...b,
        id: b.id, // ID mta3 el DB tawa (1, 2, 3...)
        clientName: b.client_name,
        priceOverride: b.price_override
    }));
},
  async deleteBooking(bookingId: number | string) {
    console.log(`🟡 Suppression du booking avec ID: ${bookingId}`);
    const { error } = await supabase.from('bookings').delete().eq('id', bookingId);
    if (error) console.error("🔴 Erreur deleteBooking:", error);
    else console.log("✅ Booking supprimé!");
  },

  // --- SLIDES ---
 // --- SLIDES ---
// Fil db object mte3ek
async saveSlides(slides: Slide[]) {
  if (!slides || slides.length === 0) return null;

  try {
    // 1. فـسـخ كـل شـيء مـوجـود تـوا
    // نـفـسـخـوا بـالـ ID بـاش نـفـرغـوا الـ Table
    const { error: delError } = await supabase
      .from('slides')
      .delete()
      .neq('url', 'placeholder'); // كـأنـك قـلـتـلـو "Delete All"

    if (delError) throw delError;

    // 2. حـضـر الـ Data لـلـصـبـان (مـن غـيـر ID بـاش الـ DB تـعـطـي وحـدها)
    const slidesToSave = slides.map(s => ({
      url: s.url,
      title: s.title,
      pos_y: s.posY ?? 50
    }));

    // 3. صـب الـ جـديـد
    const { data, error: insError } = await supabase
      .from('slides')
      .insert(slidesToSave)
      .select();

    if (insError) throw insError;
    return data;
  } catch (error) {
    console.error("🔴 Erreur saveSlides:", error);
    throw error;
  }
},
async getSlides(): Promise<Slide[]> {
  const { data, error } = await supabase
    .from('slides')
    .select('*')
    .order('created_at', { ascending: true }); // الـتـرتـيـب حـسـب وقـت الـصـبـان

  if (error) throw error;
  
  return (data || []).map(s => ({
    id: s.id,
    url: s.url,
    title: s.title,
    posY: s.pos_y
  }));
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
async uploadPortfolioFile(file: File): Promise<string | null> {
    // 1. Thabbet elli el file mouch empty
    if (!file) {
        console.error("🔴 Erreur: Aucun fichier fourni.");
        return null;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default'); // RAKKEZ HOUNI: 7ott el preset s7i7 direct

    console.log("🟡 FormData check:", {
        file_name: file.name,
        file_size: file.size,
        preset: 'votre_preset_name'
    });
    const resourceType = file.type.startsWith('video') ? 'video' : 'image';

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
            { 
                method: 'POST', 
                // MA T-7OTTECH 'Content-Type' header! El browser taw y-rakkhou wa7dou
                body: formData 
            }
        );

        if (!response.ok) {
            // Houni el 7all! Cloudinary i-9ollek el moshkla bed-dhabt fil JSON
            const errorJson = await response.json();
            console.error("🔴 Cloudinary API Error:", errorJson); 
            return null;
        }

        const data = await response.json();
        return data.secure_url; 
    } catch (err) {
        console.error("🔴 Fetch Error:", err);
        return null;
    }
},
  
  // --- ZID EL Khedma el Jdida Houni ---
 // --- PORTFOLIO ---
async addPortfolioItem(itemData: Omit<PortfolioItem, 'id'>, file: File): Promise<PortfolioItem | null> {
    console.log("🟡 Step 1: Envoi vers Cloudinary...");
    
    // N-estannou el upload lel Cloudinary yerja3 (Lien URL)
    const uploadedUrl = await this.uploadPortfolioFile(file);

    if (!uploadedUrl) {
        console.error("🔴 Erreur: Cloudinary n'a pas renvoyé d'URL.");
        return null;
    }

    console.log("✅ Step 2: Lien Cloudinary reçu, insertion dans Supabase...", uploadedUrl);

    // Taw n-insertiw el data mte3na m3a el URL elli jé mel Cloudinary
    const { data, error } = await supabase
        .from('portfolio_items')
        .insert({
            ...itemData,
            url: uploadedUrl, // Houni el lien l-jdid
        })
        .select()
        .single();

    if (error) {
        console.error("🔴 Erreur lors de l'insertion DB:", error.message);
        return null;
    }

    console.log("✅ Portfolio Item ajouté avec succès!");
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
}
}
