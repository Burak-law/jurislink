import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProfileSettingsForm from "@/components/ProfileSettingsForm";
import ChangePasswordForm from "@/components/ChangePasswordForm";
import DeleteAccountSection from "@/components/DeleteAccountSection";

export const metadata = {
  title: "Settings — JurisLink",
};

export default function SettingsPage() {
  return (
    <>
      <Header />

      <section className="relative z-10 px-6 md:px-16 pt-24 pb-24 max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-juris-cream/10 rounded-3xl p-8 md:p-12 shadow-2xl relative">
          <div className="absolute top-0 left-10 right-10 h-px bg-gradient-to-r from-transparent via-juris-cream/20 to-transparent"></div>
          
          <p className="uppercase tracking-[0.3em] text-juris-burgundy text-xs font-semibold mb-3 text-center">
            Account
          </p>
          <h1 className="font-heading font-bold text-juris-cream text-3xl md:text-4xl mb-10 text-center drop-shadow-md">
            Settings
          </h1>

          <div className="flex flex-col gap-10">
            <div>
              <h2 className="font-heading font-bold text-xl text-juris-cream mb-4">
                Profile
              </h2>
              <div className="border border-juris-cream/10 bg-black/20 rounded-xl p-6">
                <ProfileSettingsForm />
              </div>
            </div>

            <div>
              <h2 className="font-heading font-bold text-xl text-juris-cream mb-4">
                Password
              </h2>
              <div className="border border-juris-cream/10 bg-black/20 rounded-xl p-6">
                <ChangePasswordForm />
              </div>
            </div>

            <div className="border border-juris-burgundy/30 bg-juris-burgundy/5 rounded-xl p-6">
              <DeleteAccountSection />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
