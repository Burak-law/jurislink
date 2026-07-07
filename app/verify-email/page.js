import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VerifyEmailClient from "@/components/VerifyEmailClient";

export const metadata = {
  title: "Verify Email — JurisLink",
};

export default function VerifyEmailPage({ searchParams }) {
  const token = searchParams?.token;

  return (
    <>
      <Header />
      <VerifyEmailClient token={token} />
      <Footer />
    </>
  );
}
