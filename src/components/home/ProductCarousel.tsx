"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
    {
        id: 1,
        name: "Ice Cool",
        category: "Essentials",
        price: "$9.99",
        image: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-900 dark:text-blue-100",
    },
    {
        id: 2,
        name: "Freeze Edition",
        category: "Strong",
        price: "$11.99",
        image: "bg-slate-100 dark:bg-slate-900/30",
        textColor: "text-slate-900 dark:text-slate-100",
    },
    {
        id: 3,
        name: "Berry Frost",
        category: "Fruity",
        price: "$10.99",
        image: "bg-purple-50 dark:bg-purple-950/30",
        textColor: "text-purple-900 dark:text-purple-100",
    },
    {
        id: 4,
        name: "Citrus Burst",
        category: "Citrus",
        price: "$9.99",
        image: "bg-yellow-50 dark:bg-yellow-950/30",
        textColor: "text-yellow-900 dark:text-yellow-100",
    },
    {
        id: 5,
        name: "Mint Breeze",
        category: "Fresh",
        price: "$9.99",
        image: "bg-emerald-50 dark:bg-emerald-950/30",
        textColor: "text-emerald-900 dark:text-emerald-100",
    },
];

export function ProductCarousel() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (!carouselRef.current || !viewportRef.current) return;

        const updateWidth = () => {
            const scrollWidth = carouselRef.current?.scrollWidth || 0;
            const viewportWidth = viewportRef.current?.offsetWidth || 0;
            setWidth(scrollWidth - viewportWidth + 32); // Added padding buffer
        };

        updateWidth();
        window.addEventListener("resize", updateWidth);
        const timeoutId = setTimeout(updateWidth, 100);

        return () => {
            window.removeEventListener("resize", updateWidth);
            clearTimeout(timeoutId);
        };
    }, []);

    return (
        <section data-theme="light" className="py-32 bg-background border-t border-border/40 overflow-hidden relative">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

            <div className="container px-4 mx-auto mb-16 flex items-end justify-between relative z-10">
                <div className="max-w-2xl">
                    <h2 className="text-4xl md:text-7xl font-semibold tracking-tighter mb-6">
                        Latest Arrivals.
                    </h2>
                    <p className="text-xl text-muted-foreground font-light leading-relaxed">
                        Discover our newest flavors and limited editions.
                    </p>
                </div>
                <div className="hidden md:flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 h-12 text-base border-foreground/10 hover:bg-foreground hover:text-background transition-all">
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
                    whileTap={{ cursor: "grabbing" }}
                    dragElastic={0.1}
                    dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    className="flex gap-6 w-max pb-12"
                >
                    {products.map((product, i) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className={`relative shrink-0 w-[85vw] md:w-[400px] h-[550px] group rounded-[2.5rem] overflow-hidden select-none ${product.image} border border-foreground/5 flex flex-col justify-between p-10 hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500`}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            {/* Content Overlay */}
                            <div className="relative z-10 flex flex-col h-full justify-between">
                                <div className="flex justify-between items-start">
                                    <span className={`text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full bg-white/40 backdrop-blur-md ${product.textColor}`}>
                                        {product.category}
                                    </span>
                                </div>

                                <div>
                                    <div className="mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                                        <h3 className={`text-4xl font-bold mb-2 ${product.textColor} tracking-tight`}>
                                            {product.name}
                                        </h3>
                                        <p className={`text-xl font-medium ${product.textColor} opacity-60`}>
                                            {product.price}
                                        </p>
                                    </div>

                                    <Button className="w-full h-14 rounded-full text-lg font-medium shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                                        Add to Cart <ShoppingBag className="ml-2 w-5 h-5" />
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* "View All" Card at the end */}
                    <div className="relative shrink-0 w-[85vw] md:w-[250px] h-[550px] flex items-center justify-center select-none pr-8 md:pr-0">
                        <Button variant="ghost" className="h-full w-full rounded-[2.5rem] border-2 border-dashed border-muted-foreground/10 hover:border-muted-foreground/30 hover:bg-muted/30 flex flex-col gap-4 group transition-all">
                            <span className="w-16 h-16 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-8 h-8 text-muted-foreground" />
                            </span>
                            <span className="font-medium text-lg text-muted-foreground">View All</span>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
