"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
    {
        id: 1,
        name: "Siberia -80°C",
        category: "Extremely Strong",
        price: "€5.90",
        image: "bg-red-50 dark:bg-red-950/30",
        textColor: "text-red-900 dark:text-red-100",
    },
    {
        id: 2,
        name: "Pablo Ice Cold",
        category: "Extra Strong",
        price: "€4.50",
        image: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-900 dark:text-blue-100",
    },
    {
        id: 3,
        name: "Killa Cold Mint",
        category: "Strong",
        price: "€4.20",
        image: "bg-slate-100 dark:bg-slate-900/30",
        textColor: "text-slate-900 dark:text-slate-100",
    },
    {
        id: 4,
        name: "Velo Freeze",
        category: "Regular",
        price: "€5.50",
        image: "bg-emerald-50 dark:bg-emerald-950/30",
        textColor: "text-emerald-900 dark:text-emerald-100",
    },
    {
        id: 5,
        name: "Lyft Ice Cool",
        category: "Mellow",
        price: "€5.50",
        image: "bg-sky-50 dark:bg-sky-950/30",
        textColor: "text-sky-900 dark:text-sky-100",
    },
];

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
                    <Button className="rounded-full px-6 h-12 text-base bg-foreground text-background hover:bg-foreground/90 transition-all shadow-lg">
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
                        <motion.div
                            key={product.id}
                            className={`relative shrink-0 w-[80vw] md:w-[350px] h-[450px] group rounded-[2rem] overflow-hidden select-none ${product.image} border border-foreground/5 flex flex-col justify-between p-8 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500`}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Content Overlay */}
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-white/40 backdrop-blur-md ${product.textColor}`}>
                                        {product.category}
                                    </span>
                                </div>

                                <div>
                                    <div className="mb-4 transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className={`text-3xl font-bold mb-1 ${product.textColor} tracking-tight`}>
                                            {product.name}
                                        </h3>
                                        <p className={`text-lg font-medium ${product.textColor} opacity-60`}>
                                            {product.price}
                                        </p>
                                    </div>

                                    <Button className="w-full h-12 rounded-full text-base font-medium shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                                        Add to Cart <ShoppingBag className="ml-2 w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
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

            {/* Apple-style Dot Indicators - Only show if there are pages to scroll */}
            {totalPages > 0 && (
                <div className="container mx-auto px-4 mt-4 flex justify-center gap-2">
                    {Array.from({ length: totalPages + 1 }).map((_, idx) => (
                        <motion.div
                            key={idx}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === Math.min(activeIndex, totalPages)
                                ? "bg-foreground w-6"
                                : "bg-foreground/20 w-1.5 hover:bg-foreground/40"
                                }`}
                        />
                    ))}
                </div>
            )}
        </section>
    );
}
