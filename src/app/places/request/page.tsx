import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import RequestPlaceContent from "./RequestPlaceContent";

export default function RequestPlacePage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-3xl mx-auto">
        <RequestPlaceContent />
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
