# JurisLink

Hukuk fakültesi öğrencileri için İngilizce hukuk platformu.

## Kurulum

```bash
npm install
cp .env.example .env
```

`.env` dosyasını aç ve `NEXTAUTH_SECRET` değerini gerçek bir değerle değiştir:

```bash
openssl rand -base64 32
```

Çıkan değeri `.env` içindeki `NEXTAUTH_SECRET`'a yapıştır. Ardından veritabanını oluştur:

```bash
npx prisma migrate dev --name init
npm run dev
```

Tarayıcıda `http://localhost:3000` adresini aç.

> **Not:** Bu ortamda internet erişimi olmadığı için `npm install` ve `npx prisma migrate dev` komutlarını benim adıma çalıştıramadım — bu iki komutu senin çalıştırman gerekiyor. Kod tarafında her şey tutarlı yazıldı ama gerçek bir çalıştırma testinden geçmedi; ilk çalıştırmada küçük bir sürüm uyuşmazlığı çıkarsa şaşırma, birlikte çözeriz.

## E-posta Gönderimi (Resend)

E-posta gönderimi artık gerçek — [Resend](https://resend.com) üzerinden çalışıyor.

**Kurulum:**
1. [resend.com](https://resend.com) üzerinden ücretsiz bir hesap aç.
2. Dashboard'dan bir API key oluştur.
3. `.env` dosyasındaki `RESEND_API_KEY` değerine yapıştır.
4. Hızlı test için `EMAIL_FROM` değerini `"JurisLink <onboarding@resend.dev>"` olarak bırakabilirsin — Resend'in paylaşımlı test alan adı. Bu, gerçek bir domain doğrulamadan e-posta göndermeni sağlar, ama test amaçlıdır; güncel gönderim sınırları için Resend dashboard'una bak.
5. Prodüksiyona geçerken kendi domain'ini Resend'de doğrula ve `EMAIL_FROM`'u o domain'deki bir adrese çevir (örn. `"JurisLink <noreply@jurislink.com>"`).

**`RESEND_API_KEY` boş bırakılırsa** (`.env.example`'daki varsayılan durum), `lib/email.js` otomatik olarak eskisi gibi davranır: e-postayı gerçekten göndermek yerine terminal konsoluna yazdırır. Bu sayede bir Resend hesabı kurmadan da geliştirmeye devam edebilirsin — doğrulama/şifre sıfırlama linklerini konsoldan kopyalarsın. API key eklediğin an gerçek gönderim otomatik olarak devreye giriyor, kod tarafında başka bir değişiklik gerekmiyor.

## Proje Yapısı

```
jurislink/
├── app/
│   ├── layout.js               # Kök layout — fontlar + AuthSessionProvider
│   ├── page.js                 # Anasayfa
│   ├── search/page.js          # Arama sonuçları sayfası
│   ├── case/[slug]/page.js     # Dava detayı — giriş yapmışsa "case_read" aktivitesi kaydeder
│   ├── term/[slug]/page.js     # Terim detayı — giriş yapmışsa "term_learned" aktivitesi kaydeder
│   ├── practice/[slug]/page.js # Essay + quiz sayfası
│   ├── dashboard/page.js       # İlerleme takibi (auth + gerçek veri ile)
│   ├── login/page.js
│   ├── signup/page.js
│   ├── forgot-password/page.js
│   ├── reset-password/page.js  # Token'ı sayfa yüklenirken kontrol eder
│   ├── verify-email/page.js    # E-posta doğrulama linkini işler
│   ├── not-found.js
│   └── api/
│       ├── auth/[...nextauth]/route.js       # NextAuth handler
│       ├── auth/resend-verification/route.js # Doğrulama e-postasını yeniden gönderir
│       ├── auth/forgot-password/route.js     # Şifre sıfırlama linki gönderir
│       ├── auth/reset-password/route.js      # Yeni şifreyi kaydeder
│       ├── signup/route.js                   # Kayıt + doğrulama e-postası tetikleme
│       ├── activity/route.js                 # Quiz tamamlama gibi aktiviteleri kaydeder
│       ├── essay-draft/route.js              # Essay taslağını okur/yazar (autosave)
│       └── progress/route.js                 # Dashboard için gerçek istatistikleri hesaplar
├── components/
│   ├── Header.jsx, Footer.jsx, Breadcrumb.jsx
│   ├── Hero.jsx, SearchBar.jsx, SearchResults.jsx, SearchResultCard.jsx
│   ├── CaseOfWeekCard.jsx
│   ├── PracticeEssayEditor.jsx  # Artık gerçek autosave yapıyor (bkz. aşağı)
│   ├── PracticeQuiz.jsx         # Tamamlanınca /api/activity'ye kayıt gönderiyor
│   ├── StatCard.jsx, AreaProgressBar.jsx, ContinueLearningCard.jsx, ActivityFeed.jsx
│   ├── DashboardContent.jsx     # /api/progress'ten gerçek veri çeker
│   ├── VerifyEmailBanner.jsx    # Doğrulanmamış kullanıcılara hatırlatma
│   ├── LoginForm.jsx, SignupForm.jsx, ForgotPasswordForm.jsx, ResetPasswordForm.jsx
│   └── AuthSessionProvider.jsx
├── lib/
│   ├── mockSearchData.js, mockCases.js, mockTerms.js, mockPractice.js
│   │   (içerik hâlâ sabit — ilerleme/aktivite artık gerçek, ama dava/terim/quiz
│   │   içerikleri henüz bir CMS'ten gelmiyor)
│   ├── prisma.js           # Prisma client singleton
│   ├── authOptions.js      # NextAuth yapılandırması + login rate limiting
│   ├── tokens.js           # Güvenli token üretimi
│   ├── email.js            # Resend ile gerçek e-posta gönderimi (API key yoksa konsola yazdırır)
│   ├── rateLimit.js        # Bellek içi rate limiter
│   └── formatRelativeTime.js
├── prisma/schema.prisma    # User, VerificationToken, PasswordResetToken, Activity, EssayDraft
├── middleware.js           # /dashboard'u sunucu tarafında auth ile korur
├── .env.example / .env
├── tailwind.config.js
└── postcss.config.js
```

## Neler Gerçek, Neler Hâlâ Mock

**Artık tamamen gerçek:**
- Kullanıcı hesapları, şifre hash'leme, oturumlar (SQLite + Prisma + NextAuth)
- E-posta doğrulama akışı (token üretimi, süre kontrolü, yeniden gönderme)
- Şifremi unuttum / şifre sıfırlama akışı (email enumeration'a karşı korumalı — her zaman aynı genel mesaj dönüyor)
- Rate limiting: kayıt, giriş denemeleri, şifre sıfırlama, doğrulama e-postası yeniden gönderme
- Dashboard istatistikleri, alan bazlı ilerleme, son etkinlik akışı — hepsi gerçek `Activity` ve `EssayDraft` tablolarından hesaplanıyor
- Essay taslakları artık gerçekten kaydediliyor (debounce'lu autosave, `/api/essay-draft`)
- Quiz sonuçları tamamlandığında gerçekten kaydediliyor
- E-posta gönderimi — Resend API key eklendiğinde doğrulama ve şifre sıfırlama e-postaları gerçekten gidiyor (bkz. yukarıdaki "E-posta Gönderimi" bölümü)

**Hâlâ mock/sabit veri:**
- Dava, terim ve pratik alıştırma **içerikleri** (`lib/mockCases.js`, `mockTerms.js`, `mockPractice.js`, `mockSearchData.js`) — bunlar bir CMS veya veritabanına taşınmadı, hâlâ kod içinde sabit. `/api/progress` bu dosyalardaki verilerle gerçek aktiviteleri eşleştirerek "alan bazlı ilerleme" hesaplıyor.

## Bilinen Sınırlamalar / Sıradaki Adımlar İçin Notlar

- **Rate limiter bellek içi** — tek sunucu için yeterli ama birden fazla instance'da (serverless, load balancer arkasında) her instance kendi sayacını tutar. Prodüksiyon için Upstash Redis gibi paylaşılan bir store'a geçilmeli.
- **E-posta doğrulama linki GET ile tüketiliyor** — bazı e-posta istemcileri linkleri önceden tarayıp (link preview) token'ı yanlışlıkla geçersiz kılabilir. Daha sağlam bir çözüm, kullanıcının linke tıkladıktan sonra ayrı bir "Doğrula" butonuna basmasını istemek (POST tabanlı) olurdu.
- **`/case/[slug]` ve `/term/[slug]` artık tamamen statik değil** — oturum kontrolü yaptıkları için Next.js bu sayfaları istek anında (dynamic) render ediyor. Performans için ileride bir cache stratejisi düşünülebilir.
- Dava/terim/pratik alıştırma içerikleri gerçek bir veri kaynağına taşınmadı — bu yapıldığında `lib/mock*.js` dosyalarını API/veritabanı sorgularıyla değiştirmen yeterli, geri kalan bileşenler aynı veri şeklini bekleyecek şekilde tasarlandı.

## Profil Ayarları

`/settings` sayfası (auth korumalı, middleware'e eklendi):
- **Profile**: isim/email güncelleme. Email değiştirilirse `emailVerified` sıfırlanıyor ve yeni adrese otomatik bir doğrulama e-postası gidiyor — tıpkı yeni kayıtta olduğu gibi. Kaydettikten sonra `useSession().update()` çağrılıyor, böylece Header'daki isim anında güncelleniyor (yeniden giriş yapmana gerek yok).
- **Password**: mevcut şifre doğrulanıp yenisi kaydediliyor.
- **Danger Zone**: hesabı kalıcı olarak siler (şifre onayı gerektirir). `schema.prisma`'daki `onDelete: Cascade` ilişkileri sayesinde kullanıcıya ait tüm `Activity`, `EssayDraft`, ve token kayıtları da otomatik siliniyor.

## Görsel Dönüşüm: 3D ve Hareket Efektleri

Site artık düz bir sayfa değil — gerçek 3D grafikler (`three.js` + `@react-three/fiber`) ve hareket kütüphanesi (`framer-motion`) kullanılıyor. Neyin nerede olduğu:

- **Anasayfa hero'su**: `components/HeroScene.jsx` — primitif geometrilerden (silindir, küre, kutu) oluşturulmuş, yavaşça sallanan gerçek bir 3D adalet terazisi. Hazır bir 3D model dosyası kullanılmadı; tamamen kod ile inşa edildi, marka renkleriyle (burgundy/cream).
- **3D eğim efekti** (`components/TiltCard.jsx`): fareyi kartın üzerinde gezdirdiğinde gerçek bir CSS `perspective` + `rotateX/rotateY` dönüşümüyle kart hafifçe eğiliyor — sanki elinle bir dava dosyası tutuyormuşsun gibi. Kütüphane gerektirmiyor. `CaseOfWeekCard`, `ContinueLearningCard`, ve dashboard `StatCard`'larında kullanılıyor.
- **Scroll ile beliren animasyonlar** (`components/FadeIn.jsx`): Hero metni, dava/terim/pratik sayfalarındaki başlık blokları sayfa yüklenirken/scroll edilirken yukarı kayarak beliriyor.
- **Sıralı liste animasyonları** (`components/StaggerGroup.jsx`): arama sonuçları ve dashboard'daki istatistik/kart grid'leri, elemanlar teker teker (staggered) beliriyor.
- **Animasyonlu ilerleme çubukları**: `AreaProgressBar` artık scroll'a girdiğinde 0'dan gerçek yüzdeye doğru doluyor.
- **Sayaç animasyonu**: `StatCard` sayısal değerleri 0'dan gerçek değere doğru sayarak beliriyor (`framer-motion`'ın `animate()` fonksiyonuyla).

**Kapsam notu — dürüst olmak gerekirse:** Bu bir "her piksel 3D" dönüşümü değil, bilinçli olarak seçilmiş birkaç yüksek etkili nokta: hero, öne çıkan kartlar, ve listeler. Header navigasyonu, footer, ve form sayfaları (login/signup/settings) hâlâ düz — bunlarda hareket efekti bir katma değer sağlamayacağı için bilinçli olarak dokunulmadı. İstersen bu listeyi genişletebiliriz (örneğin sayfa geçişlerinde bir fade transition, ya da butonlarda hover'da hafif bir scale efekti).

**Performans notu:** `HeroScene`'deki 3D canvas basit primitiflerle (tek ışık grubu, birkaç mesh) kuruldu ama yine de bir WebGL context açıyor — çok eski/düşük güçlü cihazlarda hafif bir performans maliyeti olabilir. Gerekirse `prefers-reduced-motion` medya sorgusuna göre 3D sahneyi ve animasyonları devre dışı bırakan bir kontrol eklenebilir; şu an eklenmedi.

## Ek Cilalama: Daha Akıcı 3D ve Geçişler

Önceki 3D/animasyon temelinin üzerine şunlar eklendi:

- **Header artık sticky ve scroll'a duyarlı** — sayfanın en üstündeyken şeffaf, aşağı kaydırdıkça yumuşak bir geçişle koyulaşıp arkasında blur (buzlu cam) efekti kazanıyor. Nav linklerinde fareyle gezinince linkler arasında akıcıca kayan bir alt çizgi var (`layoutId` ile paylaşılan animasyon).
- **HeroScene'e gerçekçi yansımalar** (`@react-three/drei`'nin `Environment` bileşeni) ve **fare paralaksı** eklendi — imleci hareket ettirdiğinde 3D terazi hafifçe seni takip ediyor, ayrıca zemine yumuşak bir gölge (`ContactShadows`) düşüyor.
- **TiltCard artık spring fiziğiyle çalışıyor** (`framer-motion`'ın `useSpring`/`useMotionValue`'su) — önceki CSS-only versiyona göre çok daha akıcı ve "ağırlıklı" hissettiriyor.
- **Sayfa geçişleri** (`components/PageTransition.jsx`): bir sayfadan diğerine geçerken içerik yumuşak bir fade + kaymayla değişiyor, sert bir "zıplama" olmadan.
- **Anahtar CTA butonları** (Header'daki "Join Free", arama butonu, "Read Full Analysis") artık hover/tap'te yay (spring) fizikli hafif bir büyüme/küçülme efekti veriyor.
- **Shimmer skeleton yükleme durumları** (`components/Skeleton.jsx`): Dashboard verisi yüklenirken artık düz bir "Loading…" yazısı yerine, gerçek içeriğin hatlarını taklit eden parlayan placeholder'lar gösteriliyor.

**Not:** `Environment preset="city"` bileşeni, tarayıcıda çalışırken küçük bir HDRI dosyasını harici bir CDN'den (drei'nin barındırdığı) indiriyor — bu, kullanıcının kendi tarayıcısında olduğu için normal bir web uygulaması davranışı, ekstra bir kurulum gerektirmiyor.
