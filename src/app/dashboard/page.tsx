import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import DashboardContent from "./DashboardContent";

export default function DashboardPage() {
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-screen-2xl mx-auto">
        <DashboardContent />
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
