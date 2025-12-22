"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, Timer, Tag, ShoppingBag, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";
import { getWeeklySpecials, Product } from "@/lib/firebase/products";
import Image from "next/image";
import { useTransitionStore } from "@/store/transitionStore";

// ============================================
// DEAL CARD COMPONENT
// ============================================

function CarouselDealCard({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = product.price;
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);
    const setTransitionProduct = useTransitionStore((state) => state.setTransitionProduct);

    const strengthColors: Record<string, { bg: string; text: string; badge: string }> = {
        WEAK: {
            bg: "bg-green-50 dark:bg-green-950/30",
            text: "text-green-900 dark:text-green-100",
            badge: "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300",
        },
        MEDIUM: {
            bg: "bg-blue-50 dark:bg-blue-950/30",
            text: "text-blue-900 dark:text-blue-100",
            badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300",
        },
        STRONG: {
            bg: "bg-orange-50 dark:bg-orange-950/30",
            text: "text-orange-900 dark:text-orange-100",
            badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300",
        },
        EXTRA: {
            bg: "bg-red-50 dark:bg-red-950/30",
            text: "text-red-900 dark:text-red-100",
            badge: "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300",
        },
        EXTREME: {
            bg: "bg-purple-50 dark:bg-purple-950/30",
            text: "text-purple-900 dark:text-purple-100",
            badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300",
        },
    };

    const colors = strengthColors[product.strength] || strengthColors.MEDIUM;
    const hasImage = product.images && product.images.length > 0;
    const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
    const discountPercent = hasDiscount
        ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
        : 0;

    return (
        <Link
            href={`/product/${product.id}`}
            className="block h-full"
            onClick={() => setTransitionProduct(product, `deals-product-${product.id}`)}
        >
            <motion.div
                className={`relative shrink-0 w-[80vw] md:w-[350px] h-[450px] group rounded-[2rem] overflow-hidden select-none ${!hasImage ? colors.bg : ""} border border-foreground/5 hover:shadow-xl transition-all duration-500 flex flex-col`}
            >
                {/* Product Image */}
                {hasImage && (
                    <motion.div
                        className="absolute inset-0 z-0"
                        layoutId={`deals-product-${product.id}`}
                        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                    >
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 80vw, 350px"
                            placeholder={product.imagesBlurData?.[0] ? "blur" : "empty"}
                            blurDataURL={product.imagesBlurData?.[0]}
                        />
                    </motion.div>
                )}
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 z-20">
                    {hasDiscount ? (
                        <div className="px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 bg-red-500 text-white">
                            <Tag className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">{discountPercent}% OFF</span>
                        </div>
                    ) : (
                        <div className={`px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${hasImage ? "bg-white/20 backdrop-blur-md text-white" : colors.badge}`}>
                            <Timer className="w-3.5 h-3.5" />
                            <span className="text-xs font-bold">Weekly Special</span>
                        </div>
                    )}
                </div>

                {/* Bottom Gradient */}
                {hasImage && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom Content */}
                <div className="relative z-10 px-6 pb-6">
                    {/* Product Info - Visible by default, Hidden on Hover */}
                    <div className="transition-all duration-300 group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 overflow-hidden mb-0">
                        <p className={`text-sm font-medium mb-1 ${hasImage ? "text-white/70" : colors.text + " opacity-60"}`}>
                            {product.brand} • {product.strength}
                        </p>
                        <h3 className={`text-2xl font-bold mb-1 tracking-tight ${hasImage ? "text-white" : colors.text}`}>
                            {product.name}
                        </h3>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-xl font-bold ${hasImage ? "text-white" : colors.text}`}>
                                €{currentPrice}
                            </span>
                            {hasDiscount && Number(selectedSize) === 1 && (
                                <span className={`text-sm line-through ${hasImage ? "text-white/50" : colors.text + " opacity-50"}`}>
                                    €{product.compareAtPrice?.toFixed(2)}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Controls - Hidden by default, Visible on Hover */}
                    <div className="transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 overflow-hidden">
                        {/* Pack Size Selector */}
                        <div
                            className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/20 mb-3"
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
                                    className={`h-9 flex-1 rounded-lg text-xs font-bold transition-all ${selectedSize === size
                                        ? "bg-white text-black"
                                        : "text-white/70 hover:bg-white/20"
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                            className="w-full h-12 rounded-xl text-base font-bold bg-white text-black hover:bg-white/90 border-0 mb-2"
                            onClick={(e) => {
                                e.preventDefault();
                                useCartStore.getState().addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: basePrice * Number(selectedSize),
                                    image: product.images?.[0] || "/placeholder.jpg",
                                    bgClass: colors.bg,
                                    variant: `${product.strength} • ${selectedSize} Pack`,
                                    quantity: 1,
                                });
                                useCartStore.getState().openCart();
                            }}
                        >
                            Add to Cart <ShoppingBag className="ml-2 w-4 h-4" />
                        </Button>

                        {/* View Details */}
                        <p className="text-center text-white/70 text-sm hover:text-white transition-colors">
                            View Details <ArrowRight className="inline w-4 h-4 ml-1" />
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

// ============================================
// MAIN DEALS SECTION COMPONENT
// ============================================

export function DealsSection() {
    const carouselRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const x = useMotionValue(0);

    // Fetch products from Firestore
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getWeeklySpecials(10);
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch weekly specials:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const carousel = carouselRef.current;
        const viewport = viewportRef.current;

        if (!carousel || !viewport || products.length === 0) return;

        const updateWidth = () => {
            const scrollWidth = carousel.scrollWidth;
            const viewportWidth = viewport.offsetWidth;
            const cardWidth = 366;

            const dragWidth = scrollWidth - viewportWidth;
            const maxDrag = Math.max(0, dragWidth + 32);
            setWidth(maxDrag);

            const pages = Math.round(maxDrag / cardWidth);
            setTotalPages(pages);
        };

        updateWidth();

        const observer = new ResizeObserver(() => updateWidth());
        observer.observe(carousel);
        observer.observe(viewport);

        return () => observer.disconnect();
    }, [products]);

    const handleDrag = () => {
        const currentX = x.get();
        const cardWidth = 366;
        const index = Math.round(Math.abs(currentX) / cardWidth);
        setActiveIndex(index);
    };

    // Loading state
    if (loading) {
        return (
            <section className="py-20 bg-background border-t border-border/40">
                <div className="container px-4 mx-auto flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                </div>
            </section>
        );
    }

    // No products state
    if (products.length === 0) {
        return null; // Don't show section if no weekly specials
    }

    return (
        <section className="py-20 bg-background border-t border-border/40 overflow-hidden relative">
            <div className="container px-4 mx-auto mb-10 flex items-end justify-between relative z-10">
                <div className="max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2 mb-4"
                    >
                        <span className="px-3 py-1 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <Timer className="w-3.5 h-3.5" />
                            Limited Time
                        </span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4">
                        Weekly Specials.
                    </h2>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        Limited-time offers and special deals you don't want to miss.
                    </p>
                </div>
                <div className="hidden md:flex gap-4">
                    <Link href="/shop?special=weekly">
                        <Button variant="outline" className="rounded-full px-6 border-foreground/10 hover:bg-foreground hover:text-background transition-colors h-12 text-base">
                            View All Offers <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                    </Link>
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
                    {products.map((product) => (
                        <CarouselDealCard key={product.id} product={product} />
                    ))}

                    {/* "View All" Card at the end */}
                    <div className="relative shrink-0 w-[70vw] md:w-[200px] h-[450px] flex items-center justify-center select-none pr-8 md:pr-0">
                        <Link href="/shop" className="h-full w-full">
                            <Button variant="ghost" className="h-full w-full rounded-[2rem] border-2 border-dashed border-muted-foreground/10 hover:border-muted-foreground/30 hover:bg-muted/30 flex flex-col gap-4 group transition-all">
                                <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ArrowRight className="w-6 h-6 text-muted-foreground" />
                                </span>
                                <span className="font-medium text-base text-muted-foreground">See All Deals</span>
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>

            {/* Navigation & Indicators */}
            {totalPages > 0 && (
                <div className="flex items-center justify-center gap-8 mt-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-full border-transparent bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
                        onClick={() => {
                            const newIndex = Math.max(0, activeIndex - 1);
                            setActiveIndex(newIndex);
                            animate(x, -newIndex * 366, { type: "spring", stiffness: 300, damping: 30 });
                        }}
                        disabled={activeIndex === 0}
                    >
                        <ChevronLeft className="w-6 h-6 stroke-[3]" />
                    </Button>

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

                    <Button
                        variant="outline"
                        size="icon"
                        className="w-14 h-14 rounded-full border-transparent bg-black text-white hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80 transition-all shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50"
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
