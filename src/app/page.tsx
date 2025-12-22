import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { BrandCarousel } from "@/components/home/BrandCarousel";
import { ProductCarousel } from "@/components/home/ProductCarousel";
import { Testimonials } from "@/components/home/Testimonials";
import { Footer } from "@/components/layout/Footer";
import { DealsSection } from "@/components/home/DealsSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground selection:bg-accent selection:text-accent-foreground">
      <Hero />
      <CategoryGrid />
      <BrandCarousel />
      <ProductCarousel />
      <DealsSection />
      <Testimonials />

      <Footer />
    </main>
  );
}
