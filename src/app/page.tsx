import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { DealsSection } from "@/components/home/DealsSection";
import { B2CSection } from "@/components/home/B2CSection";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Header />
      <Hero />
      <CategoryGrid />
      <BrandCarousel />
      <ProductCarousel />
      <DealsSection />
      <Testimonials />
      <B2CSection />
      <Footer />
    </main>
  );
}
