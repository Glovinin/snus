"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { products } from "@/data/products";
import { useCartStore } from "@/store/cartStore";

// --- Product Card Component ---
function CarouselProductCard({ product }: { product: typeof products[0] }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);

    return (
        <Link href={`/product/${product.id}`} className="block h-full">
            <div className={`relative shrink-0 w-[80vw] md:w-[350px] h-[450px] group rounded-[2rem] overflow-hidden select-none ${product.image} border border-foreground/5 flex flex-col justify-between p-8 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500`}>
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-white/40 backdrop-blur-md ${product.textColor}`}>
                            {product.category}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className={`text-3xl font-bold mb-1 ${product.textColor} tracking-tight`}>
                                {product.name}
                            </h3>
                            <p className={`text-xl font-medium ${product.textColor} opacity-80`}>
                                €{currentPrice} <span className="text-sm opacity-60 font-normal">/ {selectedSize} {Number(selectedSize) === 1 ? 'pack' : 'packs'}</span>
                            </p>
                        </div>

                        {/* Controls Container - Visible on Hover */}
                        <div className="flex flex-col gap-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">

                            {/* Pack Size Selector */}
                            <div
                                className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/20"
                                onClick={(e) => e.preventDefault()}
                            >
                                {["1", "5", "10", "20", "40"].map((size) => (
                                    <button
                                        key={size}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedSize(size);
                                        }}
                                        className={`h-8 min-w-[2.5rem] flex-1 rounded-lg text-xs font-bold transition-all ${selectedSize === size
                                            ? "bg-black text-white shadow-sm scale-105"
                                            : "text-black/60 hover:bg-white/40"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                className="w-full h-12 rounded-xl text-base font-bold shadow-lg bg-black text-white hover:bg-black/90 border-0"
                                onClick={(e) => {
                                    e.preventDefault();
                                    const packPrice = basePrice * Number(selectedSize);

                                    useCartStore.getState().addItem({
                                        id: product.id,
                                        name: product.name,
                                        price: packPrice,
                                        image: product.image,
                                        bgClass: product.image,
                                        variant: `${product.strength || 'Standard'} • ${selectedSize} Pack`,
                                        quantity: 1
                                    });
                                    useCartStore.getState().openCart();
                                }}
                            >
                                <span>Add to Cart <ShoppingBag className="ml-2 w-4 h-4 inline-block" /></span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export function ProductCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const x = useMotionValue(0);

    useEffect(() => {
        const carousel = carouselRef.current;
        const viewport = viewportRef.current;

        if (!carousel || !viewport) return;

        const updateWidth = () => {
            const scrollWidth = carousel.scrollWidth;
            const viewportWidth = viewport.offsetWidth;
            const cardWidth = 366; // 350px card + 16px gap

            // Calculate available drag width
            const dragWidth = scrollWidth - viewportWidth;
            const maxDrag = Math.max(0, dragWidth + 32);
            setWidth(maxDrag);

            // Calculate exact number of scrollable 'pages'
            const pages = Math.round(maxDrag / cardWidth);

            setTotalPages(pages);
        };

        updateWidth();

        const observer = new ResizeObserver(() => {
            updateWidth();
        });

        observer.observe(carousel);
        observer.observe(viewport);

        return () => observer.disconnect();
    }, []);

    const handleDrag = () => {
        const currentX = x.get();
        const cardWidth = 366;
        // Calculate index based on drag position
        const index = Math.round(Math.abs(currentX) / cardWidth);
        setActiveIndex(index);
    };

    return (
        <section data-theme="light" className="py-20 bg-background border-t border-border/40 overflow-hidden relative">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

            <div className="container px-4 mx-auto mb-10 flex items-end justify-between relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4">
                        Best Sellers.
                    </h2>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        The most popular nicotine pouches in our marketplace, curated for you.
                    </p>
                </div>
                <div className="hidden md:flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 border-foreground/10 hover:bg-foreground hover:text-background transition-colors h-12 text-base">
                        View All <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Carousel Viewport */}
            <div
                ref={viewportRef}
                className="container-fluid pl-4 md:pl-8 overflow-hidden cursor-grab active:cursor-grabbing relative z-10"
            >
                <motion.div
                    ref={carouselRef}
                    drag="x"
                    dragConstraints={{ right: 0, left: -width }}
                    style={{ x }}
                    onUpdate={handleDrag}
                    whileTap={{ cursor: "grabbing" }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    className="flex gap-4 w-max pb-8"
                >
                    {products.map((product, i) => (
                        <CarouselProductCard key={product.id} product={product} />
                    ))}

                    {/* "View All" Card at the end */}
                    <div className="relative shrink-0 w-[80vw] md:w-[200px] h-[450px] flex items-center justify-center select-none pr-8 md:pr-0">
                        <Button variant="ghost" className="h-full w-full rounded-[2rem] border-2 border-dashed border-muted-foreground/10 hover:border-muted-foreground/30 hover:bg-muted/30 flex flex-col gap-4 group transition-all">
                            <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                            </span>
                            <span className="font-medium text-base text-muted-foreground">View All</span>
                        </Button>
                    </div>
                </motion.div>
            </div>

            {/* Apple-style Navigation & Indicators */}
            {totalPages > 0 && (
                <div className="flex items-center justify-center gap-8 mt-10">
                    {/* Left Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-full border-transparent bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        onClick={() => {
                            const newIndex = Math.max(0, activeIndex - 1);
                            setActiveIndex(newIndex);
                            animate(x, -newIndex * 366, { type: "spring", stiffness: 300, damping: 30 });
                        }}
                        disabled={activeIndex === 0}
                    >
                        <ChevronLeft className="w-6 h-6 stroke-[3]" />
                    </Button>

                    {/* Dots */}
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: totalPages + 1 }).map((_, idx) => (
                            <motion.div
                                key={idx}
                                className={`h-2 rounded-full transition-all duration-300 ${idx === Math.min(activeIndex, totalPages)
                                    ? "bg-black dark:bg-white w-8"
                                    : "bg-black/20 dark:bg-white/20 w-2 hover:bg-black/40 dark:hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Right Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-full border-transparent bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                        onClick={() => {
                            const newIndex = Math.min(totalPages, activeIndex + 1);
                            setActiveIndex(newIndex);
                            animate(x, -newIndex * 366, { type: "spring", stiffness: 300, damping: 30 });
                        }}
                        disabled={activeIndex >= totalPages}
                    >
                        <ChevronRight className="w-6 h-6 stroke-[3]" />
                    </Button>
                </div>
            )}
        </section>
    );
}
