import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoMarquee from "@/components/LogoMarquee";
import FeaturesSection from "@/components/FeaturesSection";
import RealFinanceSection from "@/components/RealFinanceSection";
import UnderTheHoodSection from "@/components/UnderTheHoodSection";
import PharosSections from "@/components/PharosSections";
import PharosFooterSection from "@/components/PharosFooterSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <LogoMarquee />
      <FeaturesSection />
      <RealFinanceSection />
      <UnderTheHoodSection />
      <PharosSections />
       <PharosFooterSection/>
    </main>
  );
}
