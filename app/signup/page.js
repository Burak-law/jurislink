import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SignupForm from "@/components/SignupForm";

export const metadata = {
  title: "Sign Up — JurisLink",
};

export default function SignupPage() {
  return (
    <>
      <Header />

      <section className="relative z-10 px-6 md:px-16 pt-24 pb-16 max-w-md mx-auto">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm relative">
          <h1 className="font-heading font-bold text-juris-accent text-3xl mb-2 text-center drop-shadow-sm">
            JurisLink'e Katılın.
          </h1>
          <p className="text-juris-text/60 font-medium text-sm text-center mb-8">
            Hukuk İngilizcenizi adım adım geliştirin.
          </p>

          <div className="bg-slate-50 rounded-xl p-8 border border-slate-100 shadow-inner">
            <SignupForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
