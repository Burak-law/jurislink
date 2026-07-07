import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DashboardContent from "@/components/DashboardContent";

export const metadata = {
  title: "Your Progress — JurisLink",
};

export default function DashboardPage() {
  return (
    <>
      <Header />
      <DashboardContent />
      <Footer />
    </>
  );
}
