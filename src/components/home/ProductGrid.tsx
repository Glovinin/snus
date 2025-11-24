"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";

const products = [
    {
        id: 1,
        name: "Ice Cool",
        tagline: "Arctic Freshness",
        description: "A piercing wave of mint that cools instantly.",
        price: "$9.99",
        bgClass: "bg-blue-50 dark:bg-blue-950/30",
        textClass: "text-blue-900 dark:text-blue-100",
        colSpan: "md:col-span-2",
    },
    {
        id: 2,
        name: "Freeze Edition",
        tagline: "Maximum Strength",
        description: "For those who demand the strongest kick.",
        price: "$11.99",
        bgClass: "bg-slate-100 dark:bg-slate-900/30",
        textClass: "text-slate-900 dark:text-slate-100",
        colSpan: "md:col-span-1",
    },
    {
        id: 3,
        name: "Berry Frost",
        tagline: "Sweet & Sharp",
        description: "Wild berries with a hint of menthol.",
        price: "$10.99",
        bgClass: "bg-purple-50 dark:bg-purple-950/30",
        textClass: "text-purple-900 dark:text-purple-100",
        colSpan: "md:col-span-1",
    },
    {
        id: 4,
        name: "Citrus Burst",
        tagline: "Zesty Energy",
        description: "Sun-ripened lemons with a lime twist.",
        price: "$9.99",
        bgClass: "bg-yellow-50 dark:bg-yellow-950/30",
        textClass: "text-yellow-900 dark:text-yellow-100",
        colSpan: "md:col-span-2",
    },
];

export function ProductGrid() {
    return (
        <section data-theme="light" className="py-32 bg-background relative overflow-hidden">
            {/* Background Noise Texture */}
            <div className="absolute inset-0 opacity-[0.02] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none mix-blend-difference" />

            <div className="container px-4 mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-7xl font-semibold tracking-tighter mb-6"
                        >
                            The Collection.
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                            className="text-xl text-muted-foreground max-w-xl font-light leading-relaxed"
                        >
                            Meticulously crafted flavors for the discerning user. <br />
                            Experience the next generation of nicotine pouches.
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                    >
                        <Button variant="outline" className="rounded-full px-8 h-14 text-base border-foreground/10 hover:bg-foreground hover:text-background transition-all">
                            View All Products
                        </Button>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={`group relative overflow-hidden rounded-[2.5rem] ${product.bgClass} border border-foreground/5 ${product.colSpan} min-h-[450px] flex flex-col justify-between p-10 cursor-pointer hover:shadow-2xl hover:shadow-foreground/5 transition-all duration-500`}
                        >
                            {/* Hover Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative z-10 transition-transform duration-500 group-hover:-translate-y-2">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`text-xs font-bold uppercase tracking-widest py-1 px-3 rounded-full bg-white/40 backdrop-blur-md ${product.textClass}`}>
                                        {product.tagline}
                                    </span>
                                    <div className="w-10 h-10 rounded-full bg-white/40 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                                        <ArrowUpRight className={`w-5 h-5 ${product.textClass}`} />
                                    </div>
                                </div>
                                <h3 className={`text-4xl md:text-5xl font-bold mb-3 ${product.textClass} tracking-tight`}>{product.name}</h3>
                                <p className={`text-xl font-medium ${product.textClass} opacity-60`}>{product.price}</p>
                            </div>

                            <div className="relative z-10 mt-auto">
                                <div className="overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
                                    <p className={`text-lg ${product.textClass} opacity-80 mb-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75`}>
                                        {product.description}
                                    </p>
                                </div>
                                <Button className="w-full h-14 rounded-full text-lg font-medium shadow-lg transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
                                    Add to Cart <ShoppingBag className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
