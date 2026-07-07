import { Inter, Playfair_Display } from "next/font/google";
import AuthSessionProvider from "@/components/AuthSessionProvider";
import PageTransition from "@/components/PageTransition";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://jurislink.com"),
  title: {
    default: "JurisLink — İleri Düzey Hukuk İngilizcesi",
    template: "%s | JurisLink",
  },
  description:
    "Hukuk öğrencileri için tasarlanmış bir Hukuk İngilizcesi platformu — mesleğin beklediği gibi okuyun, tartışın ve yazın.",
  keywords: ["Hukuk İngilizcesi", "Hukuk Öğrencileri", "İçtihat", "Hukuki Terminoloji", "Pratik"],
  authors: [{ name: "JurisLink Ekibi" }],
  openGraph: {
    title: "JurisLink — İleri Düzey Hukuk İngilizcesi",
    description: "Hukuk öğrencileri için tasarlanmış bir Hukuk İngilizcesi platformu.",
    url: "/",
    siteName: "JurisLink",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JurisLink",
    description: "İleri Düzey Hukuk İngilizcesi.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-juris-bg font-body min-h-screen relative text-juris-text selection:bg-juris-accent selection:text-white">
        {/* Global Decorative Background Elements */}
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-juris-bg">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-juris-accent/5 to-transparent"></div>
          <div 
            className="absolute top-0 right-0 w-[800px] h-[800px] opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(128, 0, 32, 0.15) 0%, transparent 60%)",
            }}
          ></div>
          <div 
            className="absolute bottom-0 left-0 w-[600px] h-[600px] opacity-10"
            style={{
              background: "radial-gradient(circle, rgba(128, 0, 32, 0.1) 0%, transparent 70%)",
            }}
          ></div>
        </div>

        <AuthSessionProvider>
          <PageTransition>{children}</PageTransition>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
