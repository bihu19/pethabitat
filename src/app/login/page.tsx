import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginContent from "./LoginContent";

export default function LoginPage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-6">
        <LoginContent />
      </main>
      <Footer />
    </Providers>
  );
}
