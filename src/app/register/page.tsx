import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegisterContent from "./RegisterContent";

export default function RegisterPage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <RegisterContent />
      </main>
      <Footer />
    </Providers>
  );
}
