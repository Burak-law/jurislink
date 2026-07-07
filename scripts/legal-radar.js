const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { Resend } = require('resend');

// Load environment variables for local testing
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "JurisLink <onboarding@resend.dev>";
// Normally this would be the admin's email, falling back to a test email or the from email for now
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || EMAIL_FROM;

async function runRadar() {
  console.log("🔍 JurisLink Hukuk Radarı Başlatılıyor...");

  if (!process.env.GEMINI_API_KEY) {
    console.error("❌ HATA: GEMINI_API_KEY bulunamadı.");
    process.exit(1);
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Yargıtay kararlarını internette aramak için Google Search grounding'i etkinleştirilmiş model kullanımı (varsa)
    // Standart 2.5 flash modelini kullanıyoruz.
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      tools: [
        {
          googleSearch: {} // İnternet araması yetkisi veriyoruz
        }
      ]
    });

    const prompt = `
    Sen "JurisLink Hukuk Radarı" isimli bir yapay zeka asistanısın. Görevin Türkiye'deki en güncel hukuki gelişmeleri takip etmektir.
    Lütfen internette (Google Arama) şu konuları araştır:
    1. Son 7 gün içinde Yargıtay tarafından verilen veya haber sitelerine (hukukihaber, memurlar.net, barolar) düşen yeni "Emsal Kararlar" var mı?
    2. Son 7 gün içinde "İçtihadı Birleştirme Kararı" çıktı mı?
    3. Hukuk dünyasında içtihat değişikliği (örneğin kira hukuku, iş hukuku, ceza hukuku alanında) yaşandı mı?
    
    Bulduğun en önemli 1-3 adet kararı veya haberi bana raporla.
    Eğer önemli bir gelişme bulursan, çıktıyı aşağıdaki gibi net bir Türkçe rapor halinde yaz:
    "🚨 YENİ İÇTİHAT BULUNDU!
    Konu: [Konu]
    Kaynak/Haber Linki: [Link]
    Kısaca Ne Oldu: [Özet]"

    Eğer kayda değer hiçbir yeni karar veya içtihat değişikliği bulamazsan sadece şunu yaz:
    "✅ Bu hafta yeni bir emsal Yargıtay kararı veya içtihat değişikliği tespit edilmedi."
    `;

    console.log("🌐 Yapay Zeka internette araştırma yapıyor (Google Search Grounding)...");
    const result = await model.generateContent(prompt);
    const report = result.response.text();

    console.log("\n📊 RADAR RAPORU:\n");
    console.log(report);
    console.log("\n-----------------------------------\n");

    // E-posta gönderimi (Eğer RESEND_API_KEY varsa)
    if (RESEND_API_KEY && RESEND_API_KEY.length > 5 && report.includes("YENİ İÇTİHAT BULUNDU")) {
      console.log(`📧 Admin'e (${ADMIN_EMAIL}) e-posta gönderiliyor...`);
      const resend = new Resend(RESEND_API_KEY);
      
      await resend.emails.send({
        from: EMAIL_FROM,
        to: [ADMIN_EMAIL],
        subject: "🚨 JurisLink Radar: Yeni Yargıtay İçtihadı Tespit Edildi!",
        html: `<h2>JurisLink Günlük Hukuk Radarı</h2>
               <p>Sistemin internette yaptığı otomatik tarama sonucunda yeni emsal kararlar tespit edildi. Lütfen bu kararları inceleyip <b>/admin</b> paneli üzerinden sisteme ekleyin.</p>
               <hr/>
               <pre style="font-family: sans-serif; white-space: pre-wrap;">${report}</pre>
               <hr/>
               <p><i>Otomatik bildirimdir.</i></p>`
      });
      console.log("✅ E-posta başarıyla gönderildi!");
    } else if (!RESEND_API_KEY) {
      console.log("ℹ️ RESEND_API_KEY tanımlı olmadığı için e-posta atlanıyor (Konsol çıktısı ile yetinildi).");
    }

  } catch (error) {
    console.error("❌ Radar Hata Verdi:", error.message);
  }
}

runRadar();
