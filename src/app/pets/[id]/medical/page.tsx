import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import MedicalContent from "./MedicalContent";

export default async function MedicalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <Providers>
      <Navbar />
      <main className="pt-24 pb-20 px-4 md:px-6 lg:px-12 max-w-5xl mx-auto">
        <MedicalContent petId={id} />
      </main>
      <Footer />
      <BottomNav />
    </Providers>
  );
}
