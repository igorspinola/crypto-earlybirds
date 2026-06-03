import { Hero } from "@/components/features/landing/Hero";
import { AboutSection } from "@/components/features/landing/AboutSection";
import { SecuritySection } from "@/components/features/landing/SecuritySection";
import { TransparencySection } from "@/components/features/landing/TransparencySection";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <SecuritySection />
      <TransparencySection />
    </>
  );
}
