"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

const slides = [
    {
        id: 1,
        title: "KRATOS",
        subtitle: "Unleash the power. Premium nicotine pouches for those who demand excellence.",
        image: "/images/banners/banner-kratos2.jpg",
        ctaPrimary: "Shop Kratos",
        ctaSecondary: "View Flavors",
        link: "/collections/kratos",
        theme: "light"
    },
    {
        id: 2,
        title: "REBEL",
        subtitle: "Break the rules. Intense flavor and maximum satisfaction for the bold.",
        image: "/images/banners/banner-rebel.jpg",
        ctaPrimary: "Shop Rebel",
        ctaSecondary: "View Flavors",
        link: "/collections/rebel",
        theme: "light"
    },
    {
        id: 3,
        title: "VELO",
        subtitle: "The #1 Nicotine Pouch in Scandinavia. Crisp flavors, pure satisfaction for the modern lifestyle.",
        image: "/images/banners/banner-velo.jpg",
        ctaPrimary: "Shop Velo",
        ctaSecondary: "View Flavors",
        link: "/collections/velo",
        theme: "light"
    }
];

export function Hero() {
    const [current, setCurrent] = useState(0);

    // Auto-play
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrent((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

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
                                style={{ backgroundImage: `url(${slide.image})` }}
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
                        <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2 animate-pulse" />
                            Premium Quality
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
                            {slides[current].title}
                        </h1>

                        <p className="text-xl md:text-2xl text-white/80 max-w-xl leading-relaxed font-light">
                            {slides[current].subtitle}
                        </p>

                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                href={slides[current].link}
                                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-full bg-white text-black px-8 text-lg font-medium transition-all hover:bg-gray-200"
                            >
                                <span className="mr-2">{slides[current].ctaPrimary}</span>
                                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>

                            <button
                                className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/5 backdrop-blur-sm px-8 text-lg font-medium transition-all hover:bg-white/20"
                            >
                                {slides[current].ctaSecondary}
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation Controls */}
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
                                    layoutId="progress"
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
        </section>
    );
}
