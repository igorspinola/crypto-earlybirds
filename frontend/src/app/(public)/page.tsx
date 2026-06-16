import { Hero } from "@/components/features/landing/Hero";
import { AboutSection } from "@/components/features/landing/AboutSection";
import { SecuritySection } from "@/components/features/landing/SecuritySection";
import { TransparencySection } from "@/components/features/landing/TransparencySection";
import { getAboutContent, getHomeContent } from "@/lib/prismic";

export const revalidate = 60;

export default async function LandingPage() {
  const [homeContent, aboutContent] = await Promise.all([
    getHomeContent(),
    getAboutContent(),
  ]);

  return (
    <>
      <Hero content={homeContent} />
      <AboutSection content={aboutContent} />
      <SecuritySection />
      <TransparencySection />
    </>
  );
}
