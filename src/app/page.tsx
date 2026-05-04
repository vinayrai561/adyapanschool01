import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import HowItWorksSection from '@/components/HowItWorksSection';
import AddOnsSection from '@/components/AddOnsSection';
import TestimonialsSection from '@/components/TestimonialsSection';
import GallerySection from '@/components/GallerySection';
import CertificationsSection from '@/components/CertificationsSection';
import CertificateShowcaseSection from '@/components/CertificateShowcaseSection';

export default function Home() {
  return (
    <div className="flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <AddOnsSection />
      <TestimonialsSection />
      <GallerySection />
      <CertificationsSection />
      <CertificateShowcaseSection />
    </div>
  );
}
