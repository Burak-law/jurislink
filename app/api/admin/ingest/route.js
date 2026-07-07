import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { GoogleGenerativeAI } from "@google/generative-ai";

const prisma = new PrismaClient();

// Helper to sanitize strings for slugs
function slugify(text) {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function POST(req) {
  try {
    const { text, password } = await req.json();

    // Çok basit bir şifre kontrolü (Gerçek projede NextAuth ile Admin rolü olmalı)
    if (password !== "juris2026") {
      return NextResponse.json({ error: "Yetkisiz erişim! Hatalı şifre." }, { status: 401 });
    }

    if (!text || text.length < 50) {
      return NextResponse.json({ error: "Lütfen geçerli bir karar metni yapıştırın." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "Sunucuda GEMINI_API_KEY bulunamadı." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
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
${text}
`;

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
        fullText: text,
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
        fullText: text,
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

    let addedTerms = 0;
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
        addedTerms++;
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Başarıyla Yüklendi! (1 Dava, 1 Pratik, ${addedTerms} Kelime)`
    });

  } catch (error) {
    console.error("Ingest Error:", error);
    return NextResponse.json({ error: error.message || "Bilinmeyen bir hata oluştu." }, { status: 500 });
  }
}
