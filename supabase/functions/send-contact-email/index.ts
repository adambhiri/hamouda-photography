import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";
import { Resend } from "https://esm.sh/resend@3.2.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const submissionData = await req.json();
    console.log("🚀 Nouveau message de:", submissionData.name);

const supabaseUrl = Deno.env.get('SUPABASE_URL') 
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const supabaseAdmin = createClient(supabaseUrl!, supabaseServiceKey!)

    const { error: dbError } = await supabaseAdmin.from('contact_submissions').insert({
      name: submissionData.name,
      contact_info: submissionData.contactInfo,
      event_date: submissionData.eventDate,
      message: submissionData.message
    });

    if (dbError) throw new Error(`DB Error: ${dbError.message}`);
    console.log("✅ Data saved to DB");

    // 2. Email - هوني "الفويت"
  // 1. اجبد النص الخام (String) ملـ Env
const rawKey = Deno.env.get("RESEND_API_KEY");

// 2. التثبت (Debug)
if (rawKey) {
  // هوني الـ rawKey هو string، يعني الـ substring تخدم مريغلة
  console.log("DEBUG: الـ Key يبدأ بـ:", rawKey.substring(0, 7));
  console.log("DEBUG: طول الـ Key هو:", rawKey.length);
} else {
  console.log("DEBUG: الـ Key مفقود تماماً (Missing)!");
}

// 3. توا اصنع الـ Object متاع Resend باستعمال الـ rawKey
const resend = new Resend(rawKey);
    
    // جرب ابعث الإيميل
    const emailResponse = await resend.emails.send({
      from: "Contact <onboarding@resend.dev>", // 🛑 ما تبدلش هذي إلا ما تعمل Verify للـ Domain
      to: ["hamoudahamdi18@gmail.com"], // 🛑 تأكد إنو هذا هو الإيميل اللي سجلت بيه في Resend
      subject: `Nouveau Message: ${submissionData.name}`,
      html: `
        <h3>Nouveau message reçu</h3>
        <p><b>Nom:</b> ${submissionData.name}</p>
        <p><b>Contact:</b> ${submissionData.contactInfo}</p>
        <p><b>Message:</b> ${submissionData.message}</p>
      `
    });

    if (emailResponse.error) {
      // هذي أهم سطر باش نعرفو علاش Resend يرفض
      console.error("❌ Resend Error Details:", emailResponse.error);
      throw new Error(`Resend Error: ${emailResponse.error.message}`);
    }

    console.log("✅ Email sent successfully:", emailResponse.data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (err: any) {
    console.error("🔥 Global Function Error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});