"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck, Loader2, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/cartStore";
import { useTransitionStore } from "@/store/transitionStore";
import { getProductById, Product } from "@/lib/firebase/products";
import Link from "next/link";
import Image from "next/image";

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;
    const addItem = useCartStore((state) => state.addItem);
    const transitionProduct = useTransitionStore((state) => state.transitionProduct);
    const transitionSourceId = useTransitionStore((state) => state.transitionSourceId);

    // Initialize with transition product if IDs match
    const initialProduct = transitionProduct?.id === id ? transitionProduct : null;
    const [product, setProduct] = useState<Product | null>(initialProduct);
    const [loading, setLoading] = useState(!initialProduct);
    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState("1");
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    // Fetch product from Firestore
    useEffect(() => {
        const fetchProduct = async () => {
            if (!id) return;
            try {
                const data = await getProductById(id);
                setProduct(data);
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    // Loading state - Only show if we have NO product data at all
    if (loading && !product) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-black text-foreground">
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
                <Footer />
            </div>
        );
    }

    // Product not found
    if (!product) {
        return (
            <div className="flex flex-col min-h-screen bg-[#F5F5F7] dark:bg-black text-foreground">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push("/shop")} variant="outline" className="rounded-full">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
                    </Button>
                </div>
                <Footer />
            </div>
        );
    }

    // Calculate prices
    const basePrice = product.price;
    const totalPrice = basePrice * Number(selectedSize) * quantity;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
        : 0;

    // Images
    const images = product.images && product.images.length > 0 ? product.images : [];
    const hasImages = images.length > 0;

    // Background color based on strength
    const strengthColors: Record<string, string> = {
        WEAK: "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-950/50 dark:to-green-900/30",
        MEDIUM: "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-950/50 dark:to-blue-900/30",
        STRONG: "bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-950/50 dark:to-orange-900/30",
        EXTRA: "bg-gradient-to-br from-red-100 to-red-200 dark:from-red-950/50 dark:to-red-900/30",
        EXTREME: "bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-950/50 dark:to-purple-900/30",
    };

    const textColors: Record<string, string> = {
        WEAK: "text-green-900 dark:text-green-100",
        MEDIUM: "text-blue-900 dark:text-blue-100",
        STRONG: "text-orange-900 dark:text-orange-100",
        EXTRA: "text-red-900 dark:text-red-100",
        EXTREME: "text-purple-900 dark:text-purple-100",
    };

    const bgColor = strengthColors[product.strength] || "bg-gradient-to-br from-slate-100 to-slate-200";
    const textColor = textColors[product.strength] || "text-slate-900";

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black text-foreground selection:bg-black selection:text-white flex flex-col font-sans">

            <main className="flex-1 pt-44 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground" aria-label="Breadcrumb">
                        <Link href="/" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <Link href="/shop" className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                            <ShoppingBag className="w-4 h-4" />
                            <span>Shop</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 opacity-50" />
                        <span className="flex items-center gap-1.5 text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
                            <div className="w-4 h-4 flex items-center justify-center">
                                <Plus className="w-4 h-4 rotate-45" />
                                {/* Using check/plus as generic product icon or just simple dot, but sticking to requested icons style. Package icon is not imported, using what is available or adding import */}
                            </div>
                            <span>{product.name}</span>
                        </span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

                        {/* LEFT COLUMN: Image Gallery */}
                        <div className="lg:col-span-7 lg:sticky lg:top-32 relative z-10">
                            {/* Main Image */}
                            <motion.div
                                layoutId={transitionSourceId || `product-image-${product.id}`}
                                transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                                className={`relative aspect-[4/3] rounded-[2.5rem] ${!hasImages ? bgColor : ""} shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)] border border-white/50 dark:border-white/10 overflow-hidden group`}
                            >
                                {hasImages ? (
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={selectedImageIndex}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="relative w-full h-full"
                                        >
                                            <Image
                                                src={images[selectedImageIndex]}
                                                alt={product.name}
                                                fill
                                                priority
                                                className="object-cover"
                                                sizes="(max-width: 1024px) 100vw, 50vw"
                                                placeholder={product.imagesBlurData?.[selectedImageIndex] ? "blur" : "empty"}
                                                blurDataURL={product.imagesBlurData?.[selectedImageIndex]}
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                ) : (
                                    <>
                                        {/* Noise Texture Overlay */}
                                        <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

                                        {/* Product Name Display */}
                                        <div className="absolute inset-0 flex items-center justify-center p-12">
                                            <motion.div
                                                whileHover={{ scale: 1.05, rotate: -2 }}
                                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                                className="relative w-full max-w-md aspect-square bg-white/20 dark:bg-black/20 backdrop-blur-2xl rounded-[2rem] border border-white/30 shadow-2xl flex flex-col items-center justify-center p-8 text-center"
                                            >
                                                <div className={`text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none ${textColor} mix-blend-multiply dark:mix-blend-normal opacity-90`}>
                                                    {product.name}
                                                </div>
                                            </motion.div>
                                        </div>
                                    </>
                                )}

                                {/* Floating Badge (Strength) */}
                                <div className="absolute top-8 left-8">
                                    <span className="px-4 py-2 rounded-full bg-white shadow-md text-xs font-bold uppercase tracking-widest text-foreground/80">
                                        {product.strength}
                                    </span>
                                </div>

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <div className="absolute top-8 right-8">
                                        <span className="px-4 py-2 rounded-full bg-red-500 text-white text-xs font-bold uppercase tracking-widest">
                                            {discountPercent}% OFF
                                        </span>
                                    </div>
                                )}

                                {/* Image Navigation Arrows */}
                                {images.length > 1 && (
                                    <>
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </button>
                                    </>
                                )}
                            </motion.div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-3 mt-6">
                                    {images.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedImageIndex(i)}
                                            className={`aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${selectedImageIndex === i
                                                ? "border-black dark:border-white ring-2 ring-black/20 dark:ring-white/20"
                                                : "border-transparent opacity-60 hover:opacity-100"
                                                }`}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={img}
                                                    alt={`${product.name} ${i + 1}`}
                                                    fill
                                                    className="object-cover"
                                                    sizes="(max-width: 768px) 25vw, 10vw"
                                                    placeholder={product.imagesBlurData?.[i] ? "blur" : "empty"}
                                                    blurDataURL={product.imagesBlurData?.[i]}
                                                />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* RIGHT COLUMN: Details & Purchase */}
                        <div className="lg:col-span-5 flex flex-col h-full pt-4">
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1, duration: 0.4 }}
                            >
                                {/* Header Info */}
                                <div className="flex items-center gap-3 mb-6 flex-wrap">
                                    {product.stock > 0 ? (
                                        <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold uppercase tracking-widest bg-emerald-500/10 px-3 py-1.5 rounded-full ring-1 ring-emerald-500/20">
                                            <Check className="w-3 h-3" /> In Stock
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1.5 text-red-600 dark:text-red-400 text-[11px] font-bold uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full ring-1 ring-red-500/20">
                                            Out of Stock
                                        </span>
                                    )}
                                    {product.isBestSeller && (
                                        <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 text-[11px] font-bold uppercase tracking-widest bg-rose-500/10 px-3 py-1.5 rounded-full ring-1 ring-rose-500/20">
                                            Best Seller
                                        </span>
                                    )}
                                </div>

                                {/* Brand */}
                                <p className="text-lg text-muted-foreground mb-2">{product.brand}</p>

                                {/* Name */}
                                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 text-foreground leading-[0.95]">
                                    {product.name}
                                </h1>

                                {/* Category & Flavor */}
                                <div className="flex items-center gap-3 text-base text-muted-foreground mb-8">
                                    <span>{product.category}</span>
                                    <span>•</span>
                                    <span>{product.flavor}</span>
                                </div>

                                {/* Description */}
                                {product.description && (
                                    <p className="text-lg text-muted-foreground leading-relaxed mb-10 border-l-2 border-foreground/10 pl-6">
                                        {product.description}
                                    </p>
                                )}

                                {/* Pack Size Selection */}
                                <div className="mb-8">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Select Pack Size</div>
                                        {Number(selectedSize) > 1 && (
                                            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded">
                                                Save {(Number(selectedSize) * 0.5).toFixed(1)}€
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-5 gap-2">
                                        {["1", "5", "10", "20", "40"].map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => {
                                                    setSelectedSize(size);
                                                    setQuantity(1);
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

                                {/* PURCHASE CARD */}
                                <div className="p-8 rounded-[2.5rem] bg-white dark:bg-[#1c1c1e] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/10 relative overflow-hidden group">
                                    {/* Subtle sheen */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

                                    <div className="flex items-end justify-between mb-8 relative z-10">
                                        <div>
                                            <div className="text-sm text-muted-foreground font-medium uppercase tracking-wide mb-1">Total Price</div>
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-5xl font-black tracking-tight">
                                                    €{totalPrice.toFixed(2)}
                                                </span>
                                                {hasDiscount && (
                                                    <span className="text-lg text-muted-foreground line-through">
                                                        €{(product.compareAtPrice! * Number(selectedSize) * quantity).toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-sm text-muted-foreground">
                                                / {selectedSize} cans × {quantity}
                                            </span>
                                        </div>

                                        {/* Quantity */}
                                        <div className="flex items-center bg-black/5 dark:bg-white/10 rounded-full p-1.5 h-12">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-white dark:hover:bg-black transition-all shadow-sm disabled:opacity-50"
                                                disabled={quantity <= 1}
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
                                            addItem({
                                                id: product.id,
                                                name: product.name,
                                                price: basePrice * Number(selectedSize),
                                                image: images[0] || "/placeholder.jpg",
                                                bgClass: bgColor,
                                                variant: `${product.strength} • ${selectedSize} Pack`,
                                                quantity: quantity
                                            });
                                            useCartStore.getState().openCart();
                                        }}
                                        disabled={product.stock === 0}
                                        className="w-full h-16 rounded-[1.5rem] text-lg font-bold shadow-xl bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                                        <ShoppingBag className="ml-2 w-5 h-5" />
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
                                            <span>Adults Only • Nicotine Product</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
