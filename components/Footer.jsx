export default function Footer() {
  return (
    <footer className="text-center pb-10 border-t border-slate-200 mt-16 pt-10">
      <div className="flex items-center justify-center gap-6 mb-4">
        <a href="/terms" className="text-juris-text/60 text-xs font-semibold hover:text-juris-accent transition-colors">
          Kullanım Şartları
        </a>
        <a href="/privacy" className="text-juris-text/60 text-xs font-semibold hover:text-juris-accent transition-colors">
          Gizlilik Politikası
        </a>
      </div>
      <p className="text-juris-text/40 text-xs font-semibold">
        JurisLink — Yeni nesil hukukçular için inşa edildi.
      </p>
    </footer>
  );
}
