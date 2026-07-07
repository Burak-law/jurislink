import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Gizlilik Politikası — JurisLink",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 md:px-16 py-16 text-juris-text">
        <h1 className="font-heading font-bold text-juris-accent text-3xl md:text-4xl mb-8">
          Gizlilik Politikası (KVKK/GDPR Aydınlatma Metni)
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-juris-text/80">
          <p>
            <strong>Son Güncelleme Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">1. Veri Sorumlusu</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") ve Avrupa Birliği Genel Veri Koruma Tüzüğü ("GDPR") uyarınca, JurisLink platformunu kullanırken paylaştığınız kişisel verileriniz veri sorumlusu sıfatıyla tarafımızca işlenmektedir.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">2. İşlenen Kişisel Verileriniz</h2>
            <p>Platformumuzu kullanmanız esnasında aşağıdaki kişisel verileriniz işlenmektedir:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Kimlik ve İletişim Verileri:</strong> Ad, soyad, e-posta adresi.</li>
              <li><strong>Kullanım ve Etkileşim Verileri:</strong> Platform içindeki ilerlemeniz, incelediğiniz içtihatlar, pratik çözümleriniz, yazdığınız taslaklar ve forum paylaşımlarınız.</li>
              <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, log kayıtları ve oturum açma süreleri.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">3. Kişisel Verilerin İşlenme Amaçları</h2>
            <p>Toplanan kişisel verileriniz;</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Platforma üye olmanız ve kullanıcı hesabınızın oluşturulması,</li>
              <li>Eğitim ve gelişim ilerlemenizin (Dashboard) size özel olarak sunulması ve takip edilmesi,</li>
              <li>Hizmetlerimizin iyileştirilmesi ve teknik hataların tespit edilmesi,</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi ve hukuki uyuşmazlıkların çözümü,</li>
              <li>(Açık rıza vermeniz halinde) Yeniliklerden ve bültenlerden sizi haberdar etmek amaçlarıyla işlenmektedir.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">4. Verilerin Aktarımı</h2>
            <p>
              Kişisel verileriniz, yasal zorunluluklar hariç olmak üzere kural olarak üçüncü kişilerle paylaşılmamaktadır. Ancak, platformun çalışabilmesi için sunucu (hosting), veritabanı (Vercel, Supabase, vb.) ve e-posta gönderim (Resend) hizmetleri alınan güvenilir uluslararası teknoloji sağlayıcılarına güvenli şifreleme yöntemleriyle aktarılmaktadır. Bu aktarım GDPR standartlarına uygundur.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">5. Haklarınız (KVKK Madde 11 ve GDPR)</h2>
            <p>Kullanıcı olarak kişisel verilerinize ilişkin şu haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li>
              <li>İşlenmişse buna ilişkin bilgi talep etme,</li>
              <li>Amacına uygun kullanılıp kullanılmadığını öğrenme,</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini, kanunlarda öngörülen şartlar çerçevesinde silinmesini veya yok edilmesini talep etme,</li>
              <li>Otomatik sistemler vasıtasıyla aleyhinize bir sonucun çıkmasına itiraz etme.</li>
            </ul>
            <p className="mt-2">
              Haklarınızı kullanmak için iletişim kanallarımız üzerinden (platformun "İletişim" veya "Destek" bölümünden) bizimle her zaman iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
