import { Booking } from "../types.ts";

export const getHamdiResponse = async (
  userMessage: string, 
  bookings: Booking[], 
  packs: any[],
  chatHistory: { role: 'user' | 'model', text: string }[]
) => {
  // Simulated delay (bech t7essou AI s7i7a t-khammem)
  await new Promise(res => setTimeout(res, 600));

  const msg = userMessage.toLowerCase();

  // 1. Logic Dynamic lel Aswem wel Packs
 const isAskingForPacks = msg.includes("aswem") || msg.includes("prix") || msg.includes("b9adeh") || msg.includes("pack");

  if (isAskingForPacks) {
    // 2. Ken el packs weslet fergha, n-rajjou message simple mouch Error
    if (!packs || packs.length === 0) {
      return "Sama7ni khouya, thamma mochkla sghira fel connexion m3a el base de données. Jarreb mara okhra wala kallamni toul!";
    }

   // 1. Header mezyen
    let response = "📸 **Hamdi Hamouda Photography - Nos Packs:**\n";
    response += "------------------------------------------\n\n";

    // 2. Kol pack n-7ottouh f-unit wa7dou
  const packsList = packs.map(p => {
        // N-rka7ou el features: kol wa7da fi star jdid m-sabba9 b-point
        const featuresText = Array.isArray(p.features) 
            ? p.features.map(f => `• ${f}`).join('\n') 
            : '• Détails sur demande';
        
        return `🌟 **${p.name.toUpperCase()}**\n💰 Prix: ${p.price}\n${featuresText}`;
    }).join('\n\n---\n\n'); // Separator s7i7 bin el packs

    response += packsList;
    response += "\n\n------------------------------------------\n";
    response += "📩 **T-7eb t-réservi wa7ed fihom?** Juste ab3athli ism el pack!";

    return response ;
  }

  // 2. Logic simple lel Dates (mel bookings props)
  if (msg.includes("disponible") || msg.includes("wa9t") || msg.includes("wakt")|| msg.includes("nhar") || msg.includes("metfadhi")) {
    const reservedDates = bookings.map(b => b.date).join(", ");
    return reservedDates 
      ? `Chouf khouya, 3andi nharat hedhom reserved: ${reservedDates}. Ay nhar ekher marhba bik!`
      : "Ena disponible el nharat el kol tawa, ekhtar el nhar elli i-sa3dek!";
  }

  // 3. Logic lel Réservation
  if (msg.includes("reserver") || msg.includes("n7eb nji")) {
    return "Ey marhba bik! T-najem t-cliqui 3al bouton 'Réserver' wala t-khallili noumrouk houni w Hamdi taw y-kallemek.";
  }

  // 4. Default Response (Derja Style)
  return "Marhba bik 3and Hamdi Hamouda! Ena houni bech n-3awnek fel booking walla ay sou2el 3al photography. Chnoua t7eb ta3ref ekher?";
};