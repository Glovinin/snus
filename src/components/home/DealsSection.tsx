"use client";

import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { ArrowRight, Timer, Tag, ShoppingBag, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cartStore";

// Map mock deals to actual product IDs for navigation
const deals = [
    {
        id: 1,
        productId: "velo-freeze", // Mapped to closest real product
        title: "The Essentials Bundle",
        description: "Curated selection of mint flavors.",
        price: "€39.90",
        originalPrice: "€55.00",
        discount: "Save 25%",
        bg: "bg-emerald-50 dark:bg-emerald-950/30",
        text: "text-emerald-900 dark:text-emerald-100",
        badge: "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300"
    },
    {
        id: 2,
        productId: "pablo-ice-cold",
        title: "Pablo Exclusive",
        description: "Extra strong variety pack.",
        price: "€24.50",
        originalPrice: "€35.00",
        discount: "30% OFF",
        bg: "bg-blue-50 dark:bg-blue-950/30",
        text: "text-blue-900 dark:text-blue-100",
        badge: "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
    },
    {
        id: 3,
        productId: "velo-freeze",
        title: "Velo Freeze Mix",
        description: "Get 5, pay for 4 limited offer.",
        price: "€22.00",
        originalPrice: "€27.50",
        discount: "Free Can",
        bg: "bg-purple-50 dark:bg-purple-950/30",
        text: "text-purple-900 dark:text-purple-100",
        badge: "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
    },
    {
        id: 4,
        productId: "lyft-ice-cool",
        title: "Lyft Summer Edition",
        description: "Limited time seasonal flavors.",
        price: "€45.00",
        originalPrice: "€50.00",
        discount: "New Arrival",
        bg: "bg-orange-50 dark:bg-orange-950/30",
        text: "text-orange-900 dark:text-orange-100",
        badge: "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300"
    },
    {
        id: 5,
        productId: "killa-cold-mint",
        title: "Citrus & Lime Pack",
        description: "Zesty and refreshing citrus blend.",
        price: "€28.00",
        originalPrice: "€35.00",
        discount: "20% OFF",
        bg: "bg-lime-50 dark:bg-lime-950/30",
        text: "text-lime-900 dark:text-lime-100",
        badge: "bg-lime-100 dark:bg-lime-900/50 text-lime-700 dark:text-lime-300"
    },
    {
        id: 6,
        productId: "siberia-80-c",
        title: "Coffee Lovers Set",
        description: "Rich espresso and mocha notes.",
        price: "€32.50",
        originalPrice: "€40.00",
        discount: "Best Value",
        bg: "bg-amber-50 dark:bg-amber-950/30",
        text: "text-amber-900 dark:text-amber-100",
        badge: "bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300"
    },
    {
        id: 7,
        productId: "lyft-ice-cool",
        title: "Berry Blast Bundle",
        description: "Sweet wild berry mix.",
        price: "€19.90",
        originalPrice: "€25.00",
        discount: "Sale",
        bg: "bg-pink-50 dark:bg-pink-950/30",
        text: "text-pink-900 dark:text-pink-100",
        badge: "bg-pink-100 dark:bg-pink-900/50 text-pink-700 dark:text-pink-300"
    }
];

// --- Deal Card Component ---
function CarouselDealCard({ deal }: { deal: typeof deals[0] }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = parseFloat(deal.price.replace(/[^0-9.]/g, ''));
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);

    return (
        <Link href={`/product/${deal.productId}`} className="block h-full">
            <motion.div
                className={`relative shrink-0 w-[80vw] md:w-[350px] h-[450px] group rounded-[2rem] overflow-hidden select-none ${deal.bg} border border-foreground/5 flex flex-col justify-between p-8 hover:shadow-xl hover:shadow-foreground/5 transition-all duration-500`}
            >
                {/* Floating Badge */}
                <div className="absolute top-6 right-6 z-20">
                    <div className={`px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5 ${deal.badge}`}>
                        <Tag className="w-3.5 h-3.5" />
                        <span className="text-xs font-bold">{deal.discount}</span>
                    </div>
                </div>

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col h-full justify-end">
                    <div className="flex flex-col gap-4">
                        <div className="mb-1 transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className={`text-3xl font-bold mb-2 tracking-tight ${deal.text}`}>
                                {deal.title}
                            </h3>
                            <p className={`text-base font-medium mb-3 line-clamp-2 ${deal.text} opacity-70`}>
                                {deal.description}
                            </p>
                            <div className="flex items-baseline gap-3">
                                <span className={`text-2xl font-bold ${deal.text}`}>€{currentPrice}</span>
                                {Number(selectedSize) === 1 && (
                                    <span className={`text-lg line-through decoration-red-500/50 ${deal.text} opacity-50`}>{deal.originalPrice}</span>
                                )}
                                <span className={`text-sm ${deal.text} opacity-60 font-normal`}>/ {selectedSize} {Number(selectedSize) === 1 ? 'bundle' : 'bundles'}</span>
                            </div>
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
                                        id: `deal-${deal.id}`,
                                        name: deal.title,
                                        price: packPrice,
                                        image: "/snusidealogo.svg", // Using logo as placeholder if generic bg or figure out something better.
                                        // The original code passed 'deal.bg' as 'bgClass' and 'image' which might be processed by Cart. 
                                        // Let's stick to passing 'deal.bg' as bgClass and maybe empty image or keep it same.
                                        bgClass: deal.bg,
                                        variant: `Bundle Deal • ${selectedSize}x`,
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
            </motion.div>
        </Link>
    );
}

export function DealsSection() {
    // ... refs and state ...
    const carouselRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const [width, setWidth] = useState(0);
    const [activeIndex, setActiveIndex] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const x = useMotionValue(0);

    // ... useEffect ...
    useEffect(() => {
        const carousel = carouselRef.current;
        const viewport = viewportRef.current;

        if (!carousel || !viewport) return;

        const updateWidth = () => {
            const scrollWidth = carousel.scrollWidth;
            const viewportWidth = viewport.offsetWidth;
            const cardWidth = 366;

            // Calculate available drag width
            const dragWidth = scrollWidth - viewportWidth;
            const maxDrag = Math.max(0, dragWidth + 32);
            setWidth(maxDrag);

            // Calculate exact number of scrollable 'pages'
            const pages = Math.round(maxDrag / cardWidth);

            setTotalPages(pages);
        };

        // Initial measurement
        updateWidth();

        // Use ResizeObserver for robust updates
        const observer = new ResizeObserver(() => updateWidth());
        observer.observe(carousel);
        observer.observe(viewport);

        return () => observer.disconnect();
    }, []);

    const handleDrag = () => {
        const currentX = x.get();
        const cardWidth = 366;
        const index = Math.round(Math.abs(currentX) / cardWidth);
        setActiveIndex(index);
    };

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
                            Lightening Deals
                        </span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-semibold tracking-tighter mb-4">
                        Weekly Specials.
                    </h2>
                    <p className="text-lg text-muted-foreground font-light leading-relaxed">
                        Limited-time offers and bundle deals you don't want to miss.
                    </p>
                </div>
                <div className="hidden md:flex gap-4">
                    <Button variant="outline" className="rounded-full px-6 border-foreground/10 hover:bg-foreground hover:text-background transition-colors h-12 text-base">
                        View All Offers <ArrowRight className="ml-2 w-4 h-4" />
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
                    {deals.map((deal, i) => (
                        <CarouselDealCard key={deal.id} deal={deal} />
                    ))}

                    {/* "View All" Card at the end */}
                    <div className="relative shrink-0 w-[70vw] md:w-[200px] h-[450px] flex items-center justify-center select-none pr-8 md:pr-0">
                        <Button variant="ghost" className="h-full w-full rounded-[2rem] border-2 border-dashed border-muted-foreground/10 hover:border-muted-foreground/30 hover:bg-muted/30 flex flex-col gap-4 group transition-all">
                            <span className="w-14 h-14 rounded-full bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                                <ArrowRight className="w-6 h-6 text-muted-foreground" />
                            </span>
                            <span className="font-medium text-base text-muted-foreground">See All Deals</span>
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
