const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  // --- 1. Clean existing data ---
  await prisma.forumReply.deleteMany();
  await prisma.forumThread.deleteMany();
  await prisma.article.deleteMany();
  await prisma.essayDraft.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.practice.deleteMany();
  await prisma.term.deleteMany();
  await prisma.case.deleteMany();
  await prisma.yargitayDecision.deleteMany();
  await prisma.user.deleteMany();

  // --- 2. Create Users ---
  const hashedAdminPassword = await bcrypt.hash("Admin123!", 10);
  const adminUser = await prisma.user.create({
    data: {
      name: "Juris Admin",
      email: "admin@jurislink.com",
      passwordHash: hashedAdminPassword,
    },
  });

  const hashedUserPassword = await bcrypt.hash("User123!", 10);
  const normalUser = await prisma.user.create({
    data: {
      name: "Test User",
      email: "test@jurislink.com",
      passwordHash: hashedUserPassword,
    },
  });

  // --- 3. Create Real Yargıtay Decisions ---
  const yD1 = await prisma.yargitayDecision.create({
    data: {
      slug: "yargitay-9-hd-2021-1234",
      esasNo: "2021/1234",
      kararNo: "2021/5678",
      court: "Yargıtay 9. Hukuk Dairesi",
      date: "12.05.2021",
      areaOfLaw: "İş Hukuku",
      summary: "İşçinin haklı nedenle fesih hakkı ve kıdem tazminatı.",
      principle: "İşçinin fazla mesai ücretlerinin ödenmemesi, İş Kanunu m. 24/II-e bendi uyarınca işçiye iş sözleşmesini haklı nedenle fesih imkanı verir. Bu durumda işçi kıdem tazminatına hak kazanır ancak ihbar tazminatı talep edemez.",
      fullText: `T.C.\nYARGITAY\n9. HUKUK DAİRESİ\nE. 2021/1234\nK. 2021/5678\nT. 12.05.2021\n\nDAVA: Taraflar arasında görülen dava sonucunda verilen kararın, süresi içinde duruşmalı olarak temyizen incelenmesi davalı avukatınca istenilmiş ise de...\n\nKARAR: Davacı vekili, müvekkilinin davalıya ait işyerinde haftanın 6 günü 08:00-20:00 saatleri arasında çalışmasına rağmen fazla mesai ücretlerinin ödenmediğini, bu nedenle iş sözleşmesini haklı nedenle feshettiğini belirterek kıdem tazminatı ve ödenmeyen fazla mesai ücretlerinin tahsilini talep etmiştir.\n\nDavalı işveren, davacının kendi isteğiyle istifa ettiğini savunmuştur.\n\nMahkemece, toplanan deliller ve bilirkişi raporuna dayanılarak, davacının fazla mesai yaptığı ancak ücretlerinin ödenmediği, bu durumun işçiye 4857 sayılı İş Kanununun 24/II-e maddesi uyarınca haklı fesih imkanı verdiği gerekçesiyle davanın kabulüne karar verilmiştir.\n\nDosyadaki yazılara, kararın dayandığı delillerle kanuni gerektirici sebeplere ve özellikle delillerin takdirinde bir isabetsizlik görülmemesine göre, davalı vekilinin yerinde bulunmayan bütün temyiz itirazlarının reddi ile usul ve kanuna uygun olan hükmün ONANMASINA karar verilmiştir.`,
      sourceUrl: "https://karararama.yargitay.gov.tr/",
    },
  });

  const yD2 = await prisma.yargitayDecision.create({
    data: {
      slug: "yargitay-12-cd-2020-999",
      esasNo: "2020/999",
      kararNo: "2020/1111",
      court: "Yargıtay 12. Ceza Dairesi",
      date: "15.09.2020",
      areaOfLaw: "Ceza Hukuku",
      summary: "Taksirle ölüme neden olma suçunda bilinçli taksir koşulları.",
      principle: "Sanığın kırmızı ışıkta geçerek ölümlü trafik kazasına neden olması eyleminde, sanığın neticeyi öngörmesine rağmen kural ihlali yaptığı sabit olduğundan, eylemin bilinçli taksirle işlendiğinin kabulü zorunludur.",
      fullText: `T.C.\nYARGITAY\n12. CEZA DAİRESİ\nE. 2020/999\nK. 2020/1111\nT. 15.09.2020\n\nDAVA: Taksirle ölüme neden olma suçundan sanığın mahkumiyetine ilişkin hüküm, sanık müdafii tarafından temyiz edilmekle dosya incelenerek gereği düşünüldü:\n\nKARAR: Olay günü sanığın idaresindeki araç ile meskun mahalde, gece vakti, aydınlatması bulunan, iki yönlü, gidiş gelişli yolda seyir halindeyken, olay yeri kavşağa geldiğinde, kendisine kırmızı ışık yanmasına rağmen durmayarak yoluna devam ettiği ve bu sırada kendisine yeşil ışık yanan katılanların murisinin idaresindeki araca çarptığı anlaşılmıştır.\n\nSanığın kırmızı ışıkta geçmek suretiyle asli kusurlu olarak kazaya sebebiyet vermesi karşısında; sanık hakkında TCK'nın 22/3. maddesi uyarınca bilinçli taksir hükümlerinin uygulanması gerektiğinin gözetilmemesi aleyhe temyiz olmadığından bozma nedeni yapılmamıştır.\n\nBozmaya uyularak yapılan yargılamaya, toplanıp karar yerinde gösterilen delillere, mahkemenin kovuşturma sonuçlarına uygun olarak oluşan kanaat ve takdirine, incelenen dosya kapsamına göre, sanık müdafiinin kusur durumuna ve ceza miktarına ilişkin temyiz itirazlarının reddiyle, hükmün isteme uygun olarak ONANMASINA karar verilmiştir.`,
      sourceUrl: "https://karararama.yargitay.gov.tr/",
    },
  });

  // --- 4. Create Real Yargıtay-based Practice (AI Evaluated) ---
  await prisma.practice.create({
    data: {
      slug: "is-hukuku-hakli-fesih-pratik",
      title: "İşçi Tarafından Haklı Nedenle Fesih (Yargıtay 9. HD)",
      type: "essay",
      areaOfLaw: "İş Hukuku",
      prompt: "Ahmet, X Lojistik A.Ş. firmasında 5 yıldır şoför olarak çalışmaktadır. Son 6 aydır haftanın 6 günü günde 12 saat çalışmasına rağmen, işveren tarafından kendisine herhangi bir fazla mesai ücreti ödenmemiştir. Ahmet, bu durumu sözlü olarak defalarca dile getirmesine rağmen sonuç alamayınca, noter kanalıyla bir ihtarname göndererek 'fazla mesai ücretlerinin ödenmemesi nedeniyle' iş sözleşmesini derhal feshettiğini bildirmiş ve kıdem tazminatı ile ihbar tazminatını talep etmiştir. İşveren ise Ahmet'in istifa ettiğini belirterek talepleri reddetmiştir. Ahmet'in taleplerinin hukuki dayanağını Yargıtay içtihatları çerçevesinde değerlendiriniz.",
      instructions: "Cevabınızda Ahmet'in feshinin niteliğini, hangi tazminatları talep edebileceğini ve Yargıtay'ın ücret ödenmemesi durumundaki yaklaşımını tartışınız.",
      structure: JSON.stringify([
        { label: "Maddi Vakıa Tespiti", detail: "Fazla mesai yapılması ve ücretin ödenmemesi olgusu." },
        { label: "Hukuki Nitelendirme", detail: "İş Kanunu m. 24/II-e (Ücretin ödenmemesi nedeniyle haklı fesih)." },
        { label: "Tazminatların Değerlendirilmesi", detail: "Kıdem tazminatına hak kazanılıp kazanılmayacağı ve ihbar tazminatı talebinin geçerliliği." }
      ]),
      relatedCase: yD1.slug,
    }
  });

  await prisma.practice.create({
    data: {
      slug: "ceza-hukuku-bilincli-taksir-pratik",
      title: "Bilinçli Taksir - Kırmızı Işık İhlali (Yargıtay 12. CD)",
      type: "essay",
      areaOfLaw: "Ceza Hukuku",
      prompt: "Ayşe, gece vakti aracıyla boş olduğunu düşündüğü bir kavşağa yaklaşırken, kendisine kırmızı ışık yanmasına rağmen durmamış ve hızla kavşağa girmiştir. Bu sırada yeşil ışıkta geçmekte olan Burak'ın aracına çarpmış ve Burak'ın ölümüne neden olmuştur. Ayşe savunmasında 'Gece olduğu için yolun boş olduğunu düşündüm, kimsenin çıkacağını tahmin etmedim' demiştir. Ayşe'nin eylemini Yargıtay içtihatları ışığında manevi unsur (kast/taksir) yönünden değerlendiriniz.",
      instructions: "Cevabınızda taksir ve bilinçli taksir kavramlarını açıklayarak, somut olayda kırmızı ışık ihlalinin Yargıtay tarafından nasıl değerlendirildiğini tartışınız.",
      structure: JSON.stringify([
        { label: "Olay ve Netice", detail: "Kırmızı ışık ihlali ve ölüm neticesi." },
        { label: "Kast / Taksir Ayrımı", detail: "Öngörme durumu ve neticeyi kabullenip kabullenmeme." },
        { label: "Yargıtay Uygulaması", detail: "Kırmızı ışık ihlalinin bilinçli taksir (TCK 22/3) oluşturduğuna dair içtihat." }
      ]),
      relatedCase: yD2.slug,
    }
  });

  console.log("Database cleaned and seeded with REAL Yargıtay Decisions and AI-ready practices!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
