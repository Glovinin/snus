import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { FeatureSection } from "@/components/home/FeatureSection";
import { ProductGrid } from "@/components/home/ProductGrid";
import { HowToUse } from "@/components/home/HowToUse";
import { CTASection } from "@/components/home/CTASection";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Header />
      <Hero />
      <ProductCarousel />
      <FeatureSection />
      <ProductGrid />
      <HowToUse />
      <CTASection />
      <Footer />
    </main>
  );
}
