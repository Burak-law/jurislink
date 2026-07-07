import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Kullanım Şartları — JurisLink",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-6 md:px-16 py-16 text-juris-text">
        <h1 className="font-heading font-bold text-juris-accent text-3xl md:text-4xl mb-8">
          Kullanım Şartları
        </h1>
        
        <div className="space-y-6 text-sm leading-relaxed text-juris-text/80">
          <p>
            <strong>Son Güncelleme Tarihi:</strong> {new Date().toLocaleDateString('tr-TR')}
          </p>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">1. Taraflar ve Konu</h2>
            <p>
              İşbu Kullanım Şartları ("Sözleşme"), JurisLink platformunu ("Platform") kullanan tüm kullanıcılar ("Kullanıcı") ile Platform'u işleten JurisLink ekibi arasındaki hukuki hak ve yükümlülükleri düzenler. Platform'a erişim sağlayan herkes bu şartları peşinen kabul etmiş sayılır.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">2. Hizmetlerin İçeriği</h2>
            <p>
              JurisLink, Türk hukukçularına yönelik olarak tasarlanmış, hukuk İngilizcesi eğitim ve pratik platformudur. Platformda sunulan örnek olaylar, içtihat metinleri, çeviriler ve sınav içerikleri bilgilendirme ve eğitim amaçlıdır; kesin hukuki mütalaa veya profesyonel avukatlık hizmeti yerine geçmez.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">3. Kullanıcı Yükümlülükleri</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Kullanıcı, hesap oluştururken verdiği bilgilerin doğruluğundan sorumludur.</li>
              <li>Platform içeriklerinin (içtihatlar, testler, taslaklar) izinsiz olarak ticari amaçla kopyalanması, dağıtılması veya satılması kesinlikle yasaktır.</li>
              <li>Hesap şifresinin güvenliği kullanıcının sorumluluğundadır.</li>
              <li>Forum ve benzeri etkileşimli alanlarda, diğer kullanıcılara karşı saygılı olmak esastır. Hukuka aykırı, onur kırıcı veya telif hakkı ihlali içeren paylaşımlar yapılamaz.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">4. Fikri Mülkiyet Hakları</h2>
            <p>
              JurisLink platformunun yazılımı, tasarımı, kaynak kodu, algoritmaları ve platform tarafından üretilen özgün içerikler (aksi belirtilmedikçe) telif haklarıyla korunmaktadır. Açık kaynak kodlu ve kamuya mal olmuş hukuki metinler hariç, hiçbir içerik izinsiz kopyalanamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">5. Sorumluluğun Sınırlandırılması</h2>
            <p>
              Platform, "olduğu gibi" sunulmaktadır. JurisLink, platformun kesintisiz, hatasız veya siber saldırılara karşı %100 güvenli olduğunu garanti etmez. Eğitim içeriklerine dayanılarak alınan hukuki veya mesleki kararlardan doğabilecek doğrudan veya dolaylı zararlardan JurisLink sorumlu tutulamaz.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-juris-accent mb-3">6. Değişiklikler</h2>
            <p>
              JurisLink, işbu Kullanım Şartları'nı dilediği zaman tek taraflı olarak güncelleme veya değiştirme hakkını saklı tutar. Değişiklikler Platform'da yayımlandığı andan itibaren geçerlilik kazanır.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
