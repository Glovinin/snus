"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
    {
        id: 1,
        name: "Nicotine Pouches",
        description: "The modern way to enjoy nicotine. Tobacco-free, discreet, and clean.",
        count: "1200+ Products",
        className: "md:col-span-2 md:row-span-2", // Large Square
        bgClass: "bg-slate-100 dark:bg-white/5",
        textClass: "text-slate-900 dark:text-white",
        image: "/images/categories/nicotine-pouches-v3.png",
    },
    {
        id: 2,
        name: "Vapes",
        description: "Modern, discreet, and full of flavor.",
        count: "450+ Products",
        className: "md:col-span-1 md:row-span-1",
        bgClass: "bg-purple-100 dark:bg-white/5",
        textClass: "text-slate-900 dark:text-white",
        image: "/images/categories/vapes-v3.png",
    },
    {
        id: 3,
        name: "Nicotine Free",
        description: "Zero nicotine, 100% flavor.",
        count: "300+ Products",
        className: "md:col-span-1 md:row-span-1",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/20",
        textClass: "text-slate-900 dark:text-white",
        image: "/images/categories/nicotine-free-v3.png",
    },
    {
        id: 4,
        name: "Accessories",
        description: "Essentials for your daily routine.",
        count: "150+ Products",
        // Row 2 layout adjustment
        className: "md:col-span-2 md:row-span-1",
        bgClass: "bg-blue-50 dark:bg-blue-950/20",
        textClass: "text-slate-900 dark:text-white",
        image: "/images/categories/accessories-v3.png",
    },
];

export function CategoryGrid() {
    return (
        <section className="py-24 bg-background relative overflow-hidden">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4"
                        >
                            Browse Categories.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-lg text-muted-foreground font-light max-w-lg leading-relaxed"
                        >
                            Curated collections designed to help you find exactly what you're looking for.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Button variant="outline" className="rounded-full px-6 border-foreground/10 hover:bg-foreground hover:text-background transition-colors h-12">
                            View Full Catalog
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                    {/* Item 1: Nicotine Pouches (Large, Span 2) */}
                    <CategoryCard
                        category={categories[0]}
                        className="md:col-span-2"
                    />

                    {/* Item 2: Chewing Bags (Standard, Span 1) */}
                    <CategoryCard
                        category={categories[1]}
                        className="md:col-span-1"
                    />

                    {/* Item 3: Nicotine Free (Standard, Span 1) */}
                    <CategoryCard
                        category={categories[2]}
                        className="md:col-span-1"
                    />

                    {/* Item 4: Accessories (Wide, Span 2) */}
                    <CategoryCard
                        category={categories[3]}
                        className="md:col-span-2"
                    />
                </div>
            </div>
        </section>
    );
}

function CategoryCard({ category, className }: { category: typeof categories[0], className?: string }) {
    return (
        <motion.div
            className={`group relative overflow-hidden rounded-[2.5rem] ${category.bgClass} p-8 md:p-10 flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 border border-black/5 dark:border-white/5 ${className}`}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-white/10 dark:bg-black/10 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            <div className="relative z-10 flex justify-between items-start">
                <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-md w-fit text-xs font-bold uppercase tracking-wider ${category.textClass} shadow-sm`}>
                        {category.count}
                    </span>
                </div>

                <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-black/90 backdrop-blur-sm flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all duration-300 shadow-sm group-hover:scale-110 group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5" />
                </div>
            </div>

            <div className="relative z-10 mt-auto">
                <h3 className={`text-2xl md:text-4xl font-bold mb-3 ${category.textClass} tracking-tight leading-[0.9] drop-shadow-sm`}>{category.name}</h3>
                <p className={`text-base font-medium opacity-80 max-w-xs ${category.textClass} line-clamp-2 drop-shadow-sm`}>{category.description}</p>
            </div>
        </motion.div>
    );
}
