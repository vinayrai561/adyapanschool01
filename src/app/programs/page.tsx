import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProgramsSection from '@/components/ProgramsSection';

export default function ProgramsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <ProgramsSection />
      </main>
      <Footer />
    </div>
  );
}
