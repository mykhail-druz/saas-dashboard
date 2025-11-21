import { LandingNav } from "@/components/navigation/landing-nav";
import { HeroSection } from "@/components/landing/hero-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { StatsSection } from "@/components/landing/stats-section";
import { BenefitsSection } from "@/components/landing/benefits-section";
import { ShowcaseSection } from "@/components/landing/showcase-section";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
import { LandingFooter } from "@/components/landing/landing-footer";

export default function Home() {
  return (
    <div className="landing-page min-h-screen flex flex-col overflow-x-hidden">
      <LandingNav />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <StatsSection />
        <BenefitsSection />
        <ShowcaseSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
