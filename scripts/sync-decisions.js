const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// NOTE: In Next.js process.env is usually loaded automatically, but for standalone scripts 
// we might need dotenv. We will assume dotenv is not installed and try to run it. 
// If it fails because of missing env, user has to set it.
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const prisma = new PrismaClient();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'DUMMY');

const RAW_DIR = path.join(__dirname, '../data/raw-decisions');
const PROCESSED_DIR = path.join(__dirname, '../data/processed-decisions');

// Helper to sanitize strings for slugs
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

async function processFile(filePath, filename) {
  console.log(`\n⏳ İşleniyor: ${filename}...`);
  const fullText = fs.readFileSync(filePath, 'utf8');

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = `
Sen bir Yargıtay kararı analiz botusun.
Aşağıda verilen gerçek mahkeme kararının tam metnini oku. 
Senden beklenen, bu metni analiz edip aşağıdaki JSON yapısında bir çıktı üretmendir. 
Markdown kullanma, SADECE saf JSON çıktısı ver.

JSON YAPISI:
{
  "esasNo": "Örn: 2017/11-1234",
  "kararNo": "Örn: 2017/5678",
  "court": "Örn: Yargıtay Hukuk Genel Kurulu",
  "date": "Örn: 25.10.2017",
  "areaOfLaw": "Örn: Ticaret Hukuku",
  "summary": "Kararın 2-3 cümlelik özeti",
  "principle": "Kararın emsal teşkil eden temel hukuk kuralı/hükmü",
  "practice": {
    "title": "Pratik Başlığı (Örn: Haksız Rekabette Zamanaşımı)",
    "difficulty": "Kolay / Orta / Zor",
    "prompt": "Bu karardaki hukuki soruna dayanan, öğrencinin çözmesi için hazırlanmış varsayımsal bir olay kurgusu (gerçek isimleri gizle)",
    "instructions": "Öğrenciye bu olayda neyi çözmesi/tartışması gerektiğini söyleyen yönerge",
    "structure": [
      { "label": "Madde 1", "detail": "Açıklama 1" },
      { "label": "Madde 2", "detail": "Açıklama 2" }
    ]
  },
  "terms": [
    {
      "term": "Örn: Haksız Rekabet",
      "englishTranslation": "Örn: Unfair Competition (Legal English karşılığı)",
      "latinEquivalent": "Örn: Contra bonos mores (Eğer Latince bir kökeni varsa yaz, yoksa boş bırak)",
      "definition": "Kısaca tanımı",
      "usage": "Hukuki cümle içinde kullanımı"
    }
  ]
}

KARAR METNİ:
${fullText}
`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const jsonStr = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(jsonStr);

    // 1. Dava/Karar Kaydı (Case / YargitayDecision)
    const caseSlug = slugify(`${data.court} ${data.esasNo} ${data.kararNo}`);
    const decision = await prisma.yargitayDecision.upsert({
      where: { slug: caseSlug },
      update: {
        summary: data.summary,
        principle: data.principle,
        fullText: fullText,
      },
      create: {
        slug: caseSlug,
        esasNo: data.esasNo,
        kararNo: data.kararNo,
        court: data.court,
        date: data.date,
        areaOfLaw: data.areaOfLaw,
        summary: data.summary,
        principle: data.principle,
        fullText: fullText,
      }
    });

    // 2. Pratik Sorusu (Practice)
    if (data.practice) {
      const practiceSlug = slugify(data.practice.title + '-' + Math.random().toString(36).substring(2,6));
      await prisma.practice.create({
        data: {
          slug: practiceSlug,
          type: "essay",
          title: data.practice.title,
          areaOfLaw: data.areaOfLaw,
          prompt: data.practice.prompt,
          instructions: data.practice.instructions,
          structure: JSON.stringify(data.practice.structure),
          relatedCase: decision.slug
        }
      });
    }

    // 3. Kelime Bilgisi (Terms)
    if (data.terms && Array.isArray(data.terms)) {
      for (const t of data.terms) {
        const termSlug = slugify(t.term);
        await prisma.term.upsert({
          where: { slug: termSlug },
          update: {},
          create: {
            slug: termSlug,
            term: t.term,
            areaOfLaw: data.areaOfLaw,
            definition: t.definition,
            usage: t.usage,
            englishTranslation: t.englishTranslation || null,
            latinEquivalent: t.latinEquivalent || null,
            relatedCase: decision.slug,
            relatedTerms: "[]"
          }
        });
      }
    }

    console.log(`✅ Başarılı: ${filename} -> Veritabanına işlendi (1 Dava, 1 Pratik, ${data.terms?.length || 0} Kelime).`);
    
    // Move to processed
    if (!fs.existsSync(PROCESSED_DIR)) {
      fs.mkdirSync(PROCESSED_DIR, { recursive: true });
    }
    fs.renameSync(filePath, path.join(PROCESSED_DIR, filename));

  } catch (err) {
    console.error(`❌ Hata (${filename}):`, err.message);
  }
}

async function main() {
  if (!process.env.GEMINI_API_KEY) {
    console.error("HATA: .env dosyasında GEMINI_API_KEY bulunamadı!");
    process.exit(1);
  }

  if (!fs.existsSync(RAW_DIR)) {
    console.log("Kaynak klasör bulunamadı, oluşturuluyor:", RAW_DIR);
    fs.mkdirSync(RAW_DIR, { recursive: true });
    return;
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.endsWith('.txt'));
  
  if (files.length === 0) {
    console.log("📂 İşlenecek yeni karar bulunamadı. Lütfen 'data/raw-decisions' klasörüne .txt dosyaları ekleyin.");
    return;
  }

  console.log(`🤖 Toplam ${files.length} adet karar işleniyor...`);
  
  for (const file of files) {
    await processFile(path.join(RAW_DIR, file), file);
  }

  console.log("\n🎉 Tüm kararlar başarıyla yapay zeka tarafından işlendi ve veritabanına eklendi!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
