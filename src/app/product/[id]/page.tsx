"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { products } from "@/data/products";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Minus, Plus, Share2, ShieldCheck, ShoppingBag, Star, TrendingUp, Truck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const product = products.find((p) => p.id === id);
    const addItem = useCartStore((state) => state.addItem);

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("1");

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <Button onClick={() => router.push("/")} variant="outline">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Go Home
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    // Extract colors for dynamic styling
    const accentColor = product.textColor.split(" ")[0].replace("text-", "bg-"); // e.g. bg-red-900
    // We can also use a mapped color for buttons if needed, for now stick to black/white for premium feel

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-foreground selection:bg-black selection:text-white flex flex-col font-sans">
            <Header />

            <main className="flex-1 pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumb / Back */}
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-8"
                    >
                        <Button
                            variant="ghost"
                            className="hover:bg-transparent hover:text-black/60 dark:hover:text-white/60 transition-colors pl-0 text-muted-foreground"
                            onClick={() => router.back()}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                        </Button>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* LEFT COLUMN: Image Showcase (Sticky) */}
                        <div className="lg:col-span-7 lg:sticky lg:top-32 relative z-10">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.4, ease: "easeOut" }}
                                className={`relative aspect-[4/3] rounded-[2.5rem] ${product.image} shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 overflow-hidden group`}
                            >
                                {/* Noise Texture Overlay */}
                                <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                                {/* Inner Card (The "Product") */}
                                <div className="absolute inset-0 flex items-center justify-center p-12">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: -2 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="relative w-full max-w-md aspect-square bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-[2rem] border border-white/30 shadow-2xl flex flex-col items-center justify-center p-8 text-center text-wrap"
                                    >
                                        <div className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none ${product.textColor} mix-blend-multiply dark:mix-blend-normal opacity-90`}>
                                            {product.name}
                                        </div>
                                    </motion.div>
                                </div>

                                {/* Floating Badge (e.g. Strength) */}
                                <div className="absolute top-8 left-8">
                                    <span className="px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-widest text-foreground/80">
                                        {product.strength}
                                    </span>
                                </div>
                            </motion.div>

                            {/* Thumbnails / Additional Views (Mock) */}
                            <div className="grid grid-cols-3 gap-4 mt-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="aspect-square rounded-2xl bg-white dark:bg-white/5 border border-black/5 cursor-pointer hover:border-black/20 transition-all" />
                                ))}
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Details & Purchase */}
                        <div className="lg:col-span-5 flex flex-col h-full pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                {/* Header Info */}
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20">
                                        <Check className="w-3 h-3" /> In Stock
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <div className="flex items-center gap-1 bg-[#00b67a] text-white px-2 py-1 rounded text-xs font-bold">
                                            <Star className="w-3 h-3 fill-current" />
                                            Trustpilot
                                        </div>
                                        <span className="text-sm font-bold text-foreground ml-2">4.9/5</span>
                                        <span className="text-sm text-muted-foreground">Excellent (120+)</span>
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-foreground leading-[0.95]">
                                    {product.name}
                                </h1>
                                <div className="text-xl font-medium text-muted-foreground mb-8 tracking-tight">
                                    {product.category} Edition
                                </div>

                                {/* Feature Grid */}
                                <div className="grid grid-cols-2 gap-3 mb-10">
                                    {product.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10">
                                            <div className="w-8 h-8 rounded-full bg-foreground/5 flex items-center justify-center shrink-0">
                                                <Zap className="w-4 h-4 text-foreground/70" />
                                            </div>
                                            <span className="text-sm font-medium leading-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-foreground/10 pl-6">
                                    {product.description}
                                </p>

                                {/* Pack Size Selection */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Select Pack Size</div>
                                        {Number(selectedSize) > 1 && (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                Safe {(Number(selectedSize) * 0.5).toFixed(1)}€
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {["1", "5", "10", "20", "40"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setQuantity(1); // Reset quant when changing pack? Or keep it. Let's reset to avoid confusion.
                                                }}
                                                className={`h-12 rounded-xl border-2 flex flex-col items-center justify-center transition-all ${selectedSize === size
                                                    ? "border-foreground bg-foreground text-background shadow-lg scale-105"
                                                    : "border-transparent bg-white dark:bg-white/5 hover:border-foreground/10 hover:bg-black/5 dark:hover:bg-white/10"
                                                    }`}
                                            >
                                                <span className="text-sm font-bold">{size}x</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* PURCHASE CARD (Floating Effect) */}
                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group">
                                    {/* Subtle sheen */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    <div className="flex items-end justify-between mb-8 relative z-10">
                                        <div>
                                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Price</div>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-5xl font-black tracking-tight">
                                                    €{(parseFloat(product.price.replace(/[^0-9.]/g, '')) * Number(selectedSize)).toFixed(2)}
                                                </span>
                                                <span className="text-lg text-muted-foreground font-medium">
                                                    / {selectedSize} cans
                                                </span>
                                            </div>
                                        </div>
                                        {/* Quantity */}
                                        <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-full p-1.5 h-12">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-black transition-all shadow-sm disabled:opacity-50"
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-10 text-center font-bold">{quantity}</span>
                                            <button
                                                onClick={() => setQuantity(quantity + 1)}
                                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-black transition-all shadow-sm"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => {
                                            const priceNumber = parseFloat(product.price.replace(/[^0-9.]/g, ''));
                                            // Pack price logic: just base * pack size for now (discounts can be added locally to visual price above but let's keep it simple for cart)
                                            // Actually, if I show discount visually, I should apply it.
                                            // Let's assume strict math for now to avoid complexity in this step.
                                            const packPrice = priceNumber * Number(selectedSize);

                                            addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: packPrice, // storing the unit price of the PACK
                                                image: product.image,
                                                bgClass: product.image,
                                                variant: `${product.strength} • ${selectedSize} Pack`,
                                                quantity: quantity
                                            });
                                            useCartStore.getState().openCart();
                                        }}
                                        className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        Add to Cart <ShoppingBag className="ml-2 w-5 h-5" />
                                    </Button>

                                    <div className="mt-6 flex flex-col gap-4 text-xs font-semibold text-muted-foreground/70 tracking-widest text-center">
                                        <div className="flex items-center justify-center gap-6 uppercase">
                                            <div className="flex items-center gap-2">
                                                <Truck className="w-3.5 h-3.5" /> Fast Delivery
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <ShieldCheck className="w-3.5 h-3.5" /> Secure
                                            </div>
                                        </div>

                                        {/* 18+ Warning */}
                                        <div className="flex items-center justify-center gap-2 text-rose-500/80 mt-2 pt-4 border-t border-black/5 dark:border-white/5">
                                            <span className="border border-rose-500/40 rounded-full w-6 h-6 flex items-center justify-center text-[10px] font-bold">18+</span>
                                            <span>Start 18+ Nicotine Product</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Reviews / content below */}
                <section className="mt-32 border-t border-black/5 dark:border-white/5 pt-20">
                    <div className="container px-4 mx-auto max-w-4xl">
                        <h2 className="text-3xl font-bold mb-12 text-center">Customer Reviews</h2>
                        <div className="space-y-6">
                            {product.reviews.map((review, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white dark:bg-white/5 border border-black/5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center font-bold">{review.user.charAt(0)}</div>
                                            <div>
                                                <div className="font-bold">{review.user}</div>
                                                <div className="text-xs text-green-600 font-medium flex items-center gap-1"><Check className="w-3 h-3" /> Verified Buyer</div>
                                            </div>
                                        </div>
                                        <div className="flex text-amber-500">
                                            {Array.from({ length: 5 }).map((_, r) => (
                                                <Star key={r} className={`w-4 h-4 ${r < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-lg leading-relaxed opacity-90">"{review.text}"</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
