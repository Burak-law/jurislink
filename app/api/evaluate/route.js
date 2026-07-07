import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

// Use GEMINI_API_KEY from environment
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "DUMMY_KEY");

export async function POST(req) {
  try {
    const { practiceSlug, userEssay } = await req.json();

    if (!practiceSlug || !userEssay) {
      return NextResponse.json({ error: "Eksik bilgi" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ 
        score: 0, 
        feedback: "Sistemde Gemini API Anahtarı eksik. Lütfen .env dosyanıza GEMINI_API_KEY ekleyin." 
      }, { status: 200 });
    }

    // Fetch the practice and its related real Yargitay case
    const practice = await prisma.practice.findUnique({
      where: { slug: practiceSlug },
    });

    if (!practice || !practice.relatedCase) {
      return NextResponse.json({ error: "Pratik sorusu veya ilgili emsal karar bulunamadı." }, { status: 404 });
    }

    // Attempt to fetch related YargitayDecision
    const decision = await prisma.yargitayDecision.findUnique({
      where: { slug: practice.relatedCase }
    });

    if (!decision) {
      return NextResponse.json({ error: "Emsal karar metni bulunamadı." }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Sen kıdemli bir Yargıtay tetkik hakimi ve hukuk profesörüsün.
Aşağıda gerçek bir hukuki olay (pratik sorusu), bu olayın gerçekte Yargıtay tarafından nasıl çözüldüğü (Emsal İlke ve Karar) ve bir öğrencinin/avukatın bu olaya yazdığı hukuki inceleme (Kullanıcı Cevabı) yer almaktadır.

Görevlerin:
1. Kullanıcının cevabını Yargıtay'ın gerçek kararıyla kıyasla.
2. Kullanıcının Yargıtay'ın uyguladığı hukuk kuralını, illiyet bağını veya kusur dağılımını ne kadar doğru tespit ettiğini analiz et.
3. Bana sadece ve kesinlikle aşağıdaki JSON formatında, Markdown vb. hiçbir işaret kullanmadan doğrudan bir JSON objesi döndür:
{
  "score": <0 ile 100 arasında bir sayı, örneğin 85>,
  "feedback": "<kullanıcıya akademik, eleştirel ve yapıcı bir geri bildirim metni>"
}

---
PRATİK OLAYI:
${practice.prompt}

YARGITAY'IN GERÇEK KARARI VE İLKESİ:
${decision.principle}
${decision.summary}

KULLANICI CEVABI:
${userEssay}
---`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    
    // Clean up potential markdown blocks from AI response
    const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const evaluation = JSON.parse(jsonStr);

    return NextResponse.json(evaluation);
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return NextResponse.json({ error: "Yapay zeka değerlendirmesi sırasında bir hata oluştu." }, { status: 500 });
  }
}
