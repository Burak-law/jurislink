import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export const metadata = {
  title: "Forgot Password — JurisLink",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <Header />
      <section className="px-6 md:px-16 py-16 max-w-md mx-auto">
        <h1 className="font-heading font-bold text-juris-cream text-3xl mb-2 text-center">
          Forgot your password?
        </h1>
        <p className="text-juris-cream/60 text-sm text-center mb-8">
          Enter your email and we'll send you a reset link.
        </p>
        <div className="border border-juris-cream/10 bg-juris-cream/[0.03] rounded-sm p-8">
          <ForgotPasswordForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
