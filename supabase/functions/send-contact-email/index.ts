import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

// On définit le type des données qu'on attend du client (React)
interface SubmissionData {
  name: string;
  contactInfo: string;
  eventDate: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // Les headers CORS sont importants
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  // Gérer la requête preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

   try {
    const submissionData = await req.json();

    // --- Étape 1: Insertion DB ---
    const supabaseAdmin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SERVICE_ROLE_KEY")!);
    const { error: insertError } = await supabaseAdmin.from('contact_submissions').insert({
        name: submissionData.name,
        contact_info: submissionData.contactInfo,
        event_date: submissionData.eventDate,
        message: submissionData.message
      });

    if (insertError) {
      console.error("--- ERREUR DB ---", insertError);
      throw insertError; // On lance l'erreur pour l'arrêter ici
    }
    console.log("--- SUCCÈS DB: Ligne insérée ---");

    // --- Étape 2: Envoi Email ---
    console.log("--- DÉBUT: Tentative d'envoi d'email ---");
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    
    // On met l'envoi dans son propre try...catch pour l'isoler
    try {
        const { data, error: emailError } = await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: ["hamoudaphotography1@gmail.com"], 
            subject: `Nouveau Message de: ${submissionData.name}`,
            html: `<p>Message de ${submissionData.name} (${submissionData.contactInfo}): ${submissionData.message}</p>`
        });

        if (emailError) {
            // On lance l'erreur pour l'attraper dans le catch principal
            throw emailError;
        }

        console.log("--- SUCCÈS EMAIL: Email envoyé ---", data);

    } catch (emailCatchError) {
        console.error("--- ERREUR attrapée pendant l'envoi de l'email ---", emailCatchError);
        // On relance l'erreur pour que la fonction retourne une erreur 500
        throw emailCatchError;
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (e) {
    console.error("--- ERREUR GLOBALE DANS LA FONCTION ---", e);
    let errorMessage = 'An unexpected error occurred.';
    if (e instanceof Error) { errorMessage = e.message; }
    else if (typeof e === 'object' && e !== null && 'message' in e) { errorMessage = (e as { message: string }).message; }
    
    return new Response(JSON.stringify({ error: errorMessage }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
    });
  }
});