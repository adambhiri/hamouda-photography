import { Booking } from "../types.ts";

export const getHamdiResponse = async (
  userMessage: string, 
  bookings: Booking[], 
  packs: any[],
  chatHistory: { role: 'user' | 'model', text: string }[]
) => {
  await new Promise(res => setTimeout(res, 600));

  const msg = userMessage.toLowerCase();

  // 1. LOGIC: Hamdi / Hamouda / Contact / Numéro
  if (msg.includes("hamdi") || msg.includes("hamouda") || msg.includes("noumrou") || msg.includes("numéro") || msg.includes("appel") || msg.includes("kallmou")) {
    return "📸 **Hamdi ** tawa occupé, ama tnajem t-kallmou direct 3al **+216 50 808 908** . \n\nWala 3ammar el **Formulaire de Contact** houni: [Lien Contact](/contact) w taw y-kallemek f'asra3 wa9t!";
  }

  // 2. LOGIC: Packs & Aswem (Kima kbal ama plus keywords)
  const isAskingForPacks = msg.includes("aswem") || msg.includes("prix") || msg.includes("b9adeh") || msg.includes("pack") || msg.includes("tarifs") || msg.includes("ghali");

  if (isAskingForPacks) {
    if (!packs || packs.length === 0) {
      return "Sama7ni khouya, thamma mochkla sghira fel connexion. Jarreb mara okhra wala [Contactez-nous](/contact) direct!";
    }

    let response = "✨ **Hamdi Hamouda Photography - Nos Packs:**\n";
    response += "------------------------------------------\n\n";

    const packsList = packs.map(p => {
        const featuresText = Array.isArray(p.features) 
            ? p.features.map(f => `• ${f}`).join('\n') 
            : '• Détails sur demande';
        
        return `🌟 **${p.name.toUpperCase()}**\n💰 Prix: ${p.price}\n${featuresText}`;
    }).join('\n\n---\n\n');

    response += packsList;
    response += "\n\n📩 **T-7eb t-réservi?** Juste ab3athli ism el pack wala [Réservez ici](/calendar)!";
    return response;
  }

  // 3. LOGIC: Portfolio / Swer / Travail
  if (msg.includes("swer") || msg.includes("photo") || msg.includes("chouf") || msg.includes("khidma") || msg.includes("khid")|| msg.includes("khedma") || msg.includes("khed") || msg.includes("exemples") || msg.includes("exem")|| msg.includes("portfolio")) {
    return "T-najem t-chouf ekhir l'khidma mta3 Hamdi f'el **Portfolio** mta3na houni: [Voir Portfolio](https://www.facebook.com). \n\nThamma barcha des sessions mezyanin (Mariage, Studio, Shooting...)!";
  }

  // 4. LOGIC: Dates / Disponibilité (Plus intelligent)
  if (msg.includes("disponible") || msg.includes("wa9t") || msg.includes("wakt") || msg.includes("nhar") || msg.includes("aw9at")|| msg.includes("awkat")|| msg.includes("metfadhi") || msg.includes("famma blassa")) {
    const reservedDates = bookings.map(b => b.date).filter(Boolean);
    if (reservedDates.length > 0) {
        return `Chouf khouya, 3andi nharat hedhom réservés: ${reservedDates.join(", ")}. \n\nAtla3 3al **[Calendrier](/calendar)** bech t-chouf el swaya3 el fergha bedhabt!`;
    }
    return "Ena disponible el nharat el kol tawa! Ekhtar el nhar elli y-sa3dek mel **[Calendrier](/calendar)**.";
  }

  // 5. LOGIC: Chokr / Salut (Interaction humaine)
  if (msg.includes("aslema") || msg.includes("salam") || msg.includes("sbah el khir") || msg.includes("bonjour")) {
    return "Aslema bik m3ak el AI mta3 **Hamdi Hamouda Photography**! Chnowa t7eb ta3ref? Aswem el packs, wala t-chouf el portfolio?";
  }

  if (msg.includes("merci") || msg.includes("ya3tik saha") ||msg.includes("aychek") ||msg.includes("y3aychek") ||msg.includes("ya3tik saha") ||msg.includes("aaychek") ||msg.includes("3aychek") || msg.includes("mrgl") || msg.includes("beh") || msg.includes("shyt")) {
    return "meghir mziya! Marhba bik dima. Ay 7aja okhra hani houni!";
  }

  // 6. LOGIC: Réservation direct
  if (msg.includes("reserver") || msg.includes("n7eb nji") || msg.includes("nhebou njiw") || msg.includes("booking")) {
    return "Ey marhba bik! T-najem t-cliqui 3al bouton **[Réserver](/calendar)** bech t-rka7 date, wala t-khallili noumrouk houni w Hamdi taw y-kallemek.";
  }

  // 7. DEFAULT: Fallback mezyen
  return "Marhba bik 3and **Hamdi Hamouda**! Ena houni bech n-3awnek. T-najem tes2alni 3al aswem, el Portfolio, wala el disponibilité mta3na.";
};