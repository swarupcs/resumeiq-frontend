import {
  HeroSection,
  FeaturesSection,
  HowItWorksSection,
  CTASection,
} from '@/components/LandingSections';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const LandingPage = () => (
  <div className='min-h-screen bg-background'>
    <Navbar />
    <main>
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </main>
    <Footer />
  </div>
);
