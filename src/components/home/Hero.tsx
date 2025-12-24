"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { getActiveHeroSlides, HeroSlide } from "@/lib/firebase/heroSlides";

// Fallback slides in case Firebase is empty
const fallbackSlides = [
    {
        id: "fallback-1",
        title: "KRATOS",
        subtitle: "Unleash the power. Premium nicotine pouches for those who demand excellence.",
        imageUrl: "/images/banners/banner-kratos2.jpg",
        ctaPrimary: "Shop Kratos",
        ctaSecondary: "View Flavors",
        link: "/shop?brand=kratos",
        theme: "light" as const,
        badge: "Premium Quality",
        isActive: true,
        order: 0,
    },
    {
        id: "fallback-2",
        title: "REBEL",
        subtitle: "Break the rules. Intense flavor and maximum satisfaction for the bold.",
        imageUrl: "/images/banners/banner-rebel.jpg",
        ctaPrimary: "Shop Rebel",
        ctaSecondary: "View Flavors",
        link: "/shop?brand=rebel",
        theme: "light" as const,
        badge: "New Arrival",
        isActive: true,
        order: 1,
    },
    {
        id: "fallback-3",
        title: "VELO",
        subtitle: "The #1 Nicotine Pouch in Scandinavia. Crisp flavors, pure satisfaction for the modern lifestyle.",
        imageUrl: "/images/banners/banner-velo.jpg",
        ctaPrimary: "Shop Velo",
        ctaSecondary: "View Flavors",
        link: "/shop?brand=velo",
        theme: "light" as const,
        badge: "Best Seller",
        isActive: true,
        order: 2,
    }
];

export function Hero() {
    const [slides, setSlides] = useState<(HeroSlide | typeof fallbackSlides[0])[]>(fallbackSlides);
    const [current, setCurrent] = useState(0);
    const [loading, setLoading] = useState(true);

    // Fetch slides from Firebase
    useEffect(() => {
        const fetchSlides = async () => {
            try {
                const data = await getActiveHeroSlides();
                if (data.length > 0) {
                    setSlides(data);
                }
                // If no slides in Firebase, fallback slides will be used
            } catch (error) {
                console.error("Error fetching hero slides:", error);
                // Keep fallback slides on error
            } finally {
                setLoading(false);
            }
        };
        fetchSlides();
    }, []);

    // Auto-play
    useEffect(() => {
        if (slides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    // Reset current if slides change
    useEffect(() => {
        setCurrent(0);
    }, [slides.length]);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    // Don't render anything while loading to prevent layout shift
    if (loading && slides.length === 0) {
        return (
            <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-white/50" />
            </section>
        );
    }

    const currentSlide = slides[current];

    return (
        <section className="relative w-full h-screen min-h-[700px] overflow-hidden bg-black text-white">
            <AnimatePresence mode="wait">
                {slides.map((slide, index) => (
                    index === current && (
                        <motion.div
                            key={slide.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute inset-0 z-0"
                        >
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-[85%_center] md:bg-center bg-no-repeat transform scale-105"
                                style={{ backgroundImage: `url(${slide.imageUrl})` }}
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
                        </motion.div>
                    )
                ))}
            </AnimatePresence>

            <div className="relative z-10 w-full h-full container mx-auto px-4 md:px-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="max-w-3xl space-y-6"
                    >
                        {/* Badge */}
                        {currentSlide.badge && (
                            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md">
                                <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                                {currentSlide.badge}
                            </div>
                        )}

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
                            {currentSlide.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed font-light">
                            {currentSlide.subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href={currentSlide.link}
                                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white text-black px-8 text-lg font-medium transition-all hover:bg-gray-200"
                            >
                                <span className="mr-2">{currentSlide.ctaPrimary}</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            {currentSlide.ctaSecondary && (
                                <button
                                    className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 text-lg font-medium transition-all hover:bg-white/20"
                                >
                                    {currentSlide.ctaSecondary}
                                </button>
                            )}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls - Only show if more than 1 slide */}
            {slides.length > 1 && (
                <div className="absolute bottom-12 left-0 right-0 z-20 container mx-auto px-4 flex items-center justify-start gap-6">

                    {/* Prev Arrow */}
                    <button
                        onClick={prevSlide}
                        className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>

                    {/* Indicators */}
                    <div className="flex gap-3">
                        {slides.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrent(idx)}
                                className={`group relative h-2 rounded-full overflow-hidden transition-all duration-300 ${idx === current ? "w-20 bg-white/20" : "w-14 bg-white/40 hover:bg-white/60"
                                    }`}
                            >
                                {idx === current && (
                                    <motion.div
                                        className="absolute inset-0 bg-white"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 6, ease: "linear" }}
                                        key={`progress-${current}`}
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Next Arrow */}
                    <button
                        onClick={nextSlide}
                        className="p-4 rounded-full border border-white/20 bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
            )}
        </section>
    );
}
