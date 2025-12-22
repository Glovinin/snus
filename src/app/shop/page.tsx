"use client";

import { useState, useMemo, useEffect, Suspense, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, ChevronRight, SlidersHorizontal, ShoppingBag, Search, Loader2, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { useTransitionStore } from "@/store/transitionStore";
import { Footer } from "@/components/layout/Footer";
import { getAllProducts, Product } from "@/lib/firebase/products";
import { getActiveBrands, Brand } from "@/lib/firebase/brands";
import { ShopGridSkeleton } from "@/components/ui/ProductSkeleton";

// ============================================
// CONSTANTS
// ============================================

const STRENGTHS = ["WEAK", "MEDIUM", "STRONG", "EXTRA", "EXTREME"];

// ============================================
// FILTER COMPONENTS
// ============================================

function FilterSection({
    title,
    children,
    defaultOpen = false
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-black/5 dark:border-white/5 py-5 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group mb-3"
            >
                <h3 className="font-bold text-sm uppercase tracking-wider text-foreground">{title}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-50 group-hover:opacity-100`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function CheckboxFilter({
    items,
    selectedItems,
    onChange
}: {
    items: string[];
    selectedItems: string[];
    onChange: (item: string) => void;
}) {
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                    <button
                        key={item}
                        onClick={() => onChange(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 border select-none ${isSelected
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10 scale-105'
                            : 'bg-transparent border-black/10 text-neutral-500 hover:border-black/30 hover:text-black dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/30 dark:hover:text-white'
                            }`}
                    >
                        {item}
                    </button>
                );
            })}
        </div>
    );
}

// Strength filter with MG ranges
const STRENGTH_DATA = [
    { name: "WEAK", range: "0-8 MG", color: "bg-green-500" },
    { name: "MEDIUM", range: "9-16 MG", color: "bg-blue-500" },
    { name: "STRONG", range: "17-32 MG", color: "bg-orange-500" },
    { name: "EXTRA", range: "32-60 MG", color: "bg-red-500" },
    { name: "EXTREME", range: "+60 MG", color: "bg-purple-500" },
];

function StrengthFilter({
    selectedItems,
    onChange
}: {
    selectedItems: string[];
    onChange: (item: string) => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            {STRENGTH_DATA.map((strength) => {
                const isSelected = selectedItems.includes(strength.name);
                return (
                    <button
                        key={strength.name}
                        onClick={() => onChange(strength.name)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border select-none ${isSelected
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10'
                            : 'bg-transparent border-black/10 text-neutral-500 hover:border-black/30 hover:bg-black/5 dark:border-white/10 dark:text-neutral-400 dark:hover:border-white/30 dark:hover:bg-white/5'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${strength.color}`} />
                            <span>{strength.name}</span>
                        </div>
                        <span className={`text-[10px] font-medium normal-case tracking-normal ${isSelected ? 'opacity-70' : 'opacity-50'}`}>
                            {strength.range}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}

// ============================================
// PRODUCT CARD COMPONENT
// ============================================

function ShopProductCard({ product }: { product: Product & { priority?: boolean } }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = product.price;
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);
    const { addItem, openCart } = useCartStore();
    const setTransitionProduct = useTransitionStore((state) => state.setTransitionProduct);

    // Background color based on strength
    const strengthColors: Record<string, string> = {
        WEAK: "bg-green-50 dark:bg-green-950/30",
        MEDIUM: "bg-blue-50 dark:bg-blue-950/30",
        STRONG: "bg-orange-50 dark:bg-orange-950/30",
        EXTRA: "bg-red-50 dark:bg-red-950/30",
        EXTREME: "bg-purple-50 dark:bg-purple-950/30",
    };

    const textColors: Record<string, string> = {
        WEAK: "text-green-900 dark:text-green-100",
        MEDIUM: "text-blue-900 dark:text-blue-100",
        STRONG: "text-orange-900 dark:text-orange-100",
        EXTRA: "text-red-900 dark:text-red-100",
        EXTREME: "text-purple-900 dark:text-purple-100",
    };

    const bgColor = strengthColors[product.strength] || "bg-slate-50 dark:bg-slate-900/30";
    const textColor = textColors[product.strength] || "text-slate-900 dark:text-slate-100";
    const hasImage = product.images && product.images.length > 0;

    return (
        <Link
            href={`/product/${product.id}`}
            className="block h-full"
            onClick={() => setTransitionProduct(product, `shop-product-${product.id}`)}
        >
            <motion.div
                tabIndex={0}
                className={`relative w-full h-[380px] sm:h-[420px] group rounded-[2rem] overflow-hidden select-none ${!hasImage ? bgColor : ""} border border-foreground/5 hover:shadow-xl transition-all duration-500 flex flex-col`}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                {/* Product Image */}
                {hasImage && (
                    <motion.div
                        className="absolute inset-0 z-0"
                        layoutId={`shop-product-${product.id}`}
                        transition={{ duration: 0.5, ease: [0.43, 0.13, 0.23, 0.96] }}
                    >
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            priority={product.priority}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            placeholder={product.imagesBlurData?.[0] ? "blur" : "empty"}
                            blurDataURL={product.imagesBlurData?.[0]}
                        />
                    </motion.div>
                )}
                {/* Top Badges */}
                <div className="absolute top-5 left-5 right-5 z-20 flex justify-between items-start">
                    <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-white/40 backdrop-blur-md ${hasImage ? "text-white" : textColor}`}>
                        {product.category}
                    </span>
                    {product.isBestSeller && (
                        <span className="text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-rose-500/80 text-white backdrop-blur-md">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* Bottom Gradient */}
                {hasImage && (
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/95 via-black/70 to-transparent" />
                )}

                {/* Spacer */}
                <div className="flex-1" />

                {/* Bottom Content */}
                <div className="relative z-10 px-5 sm:px-6 pb-5 sm:pb-6">
                    {/* Product Info - Visible by default, Hidden on Hover */}
                    <div className="transition-all duration-300 group-hover:opacity-0 group-hover:h-0 group-hover:mb-0 overflow-hidden mb-0">
                        <p className={`text-xs ${hasImage ? "text-white/70" : textColor + " opacity-60"} mb-1`}>
                            {product.brand} • {product.strength}
                        </p>
                        <h3 className={`text-xl sm:text-2xl font-bold mb-1 ${hasImage ? "text-white" : textColor} tracking-tight leading-tight`}>
                            {product.name}
                        </h3>
                        <p className={`text-lg sm:text-xl font-semibold ${hasImage ? "text-white" : textColor}`}>
                            €{currentPrice}
                        </p>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                            <p className={`text-sm line-through ${hasImage ? "text-white/50" : textColor + " opacity-50"}`}>
                                €{product.compareAtPrice.toFixed(2)}
                            </p>
                        )}
                    </div>

                    {/* Controls - Hidden by default, Visible on Hover */}
                    <div className="transition-all duration-300 max-h-0 opacity-0 group-hover:max-h-[200px] group-hover:opacity-100 overflow-hidden">
                        {/* Pack Size Selector */}
                        <div
                            className="flex items-center justify-between bg-white/20 backdrop-blur-md rounded-xl p-1 border border-white/20 mb-3"
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                        >
                            {["1", "5", "10", "20", "40"].map((size) => (
                                <button
                                    key={size}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelectedSize(size);
                                    }}
                                    className={`h-8 sm:h-9 flex-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${selectedSize === size
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
                            className="w-full h-11 sm:h-12 rounded-xl text-sm sm:text-base font-bold bg-white text-black hover:bg-white/90 border-0 mb-2"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addItem({
                                    id: product.id,
                                    name: product.name,
                                    price: basePrice * Number(selectedSize),
                                    image: product.images?.[0] || "/placeholder.jpg",
                                    bgClass: bgColor,
                                    variant: `${product.strength} • ${selectedSize} Pack`,
                                    quantity: 1
                                });
                                openCart();
                            }}
                        >
                            Add to Cart <ShoppingBag className="ml-2 w-4 h-4" />
                        </Button>

                        {/* View Details */}
                        <p className="text-center text-white/70 text-xs sm:text-sm hover:text-white transition-colors">
                            View Details <ChevronRight className="inline w-4 h-4 ml-1" />
                        </p>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
}

// ============================================
// MAIN SHOP PAGE
// ============================================

function ShopPageContent() {
    // State
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);
    const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [brands, setBrands] = useState<Brand[]>([]);

    const searchParams = useSearchParams();
    // Infinite Scroll State
    const [visibleCount, setVisibleCount] = useState(9);
    const observer = useRef<IntersectionObserver | null>(null);

    // Intersection Observer Callback
    const scrollTrigger = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                // Load 9 more items (3 rows of 3)
                setVisibleCount(prev => prev + 9);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(9);
    }, [selectedBrands, selectedStrengths, selectedFlavors, priceRange, sortBy, searchQuery]);

    // Fetch products from Firestore
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                setProducts(data);

                // Calculate price range from products
                if (data.length > 0) {
                    const prices = data.map(p => p.price);
                    setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Fetch brands from Firebase
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getActiveBrands();
            setBrands(data);
        };
        fetchBrands();
    }, []);

    // Sync filters from URL params
    useEffect(() => {
        const strengthParam = searchParams.get('strength');
        const brandParam = searchParams.get('brand');
        const flavorParam = searchParams.get('flavor');
        const sortParam = searchParams.get('sort');

        if (strengthParam) {
            setSelectedStrengths(strengthParam.split(',').map(s => s.toUpperCase()));
        }
        if (brandParam) {
            setSelectedBrands(brandParam.split(','));
        }
        if (flavorParam) {
            setSelectedFlavors(flavorParam.split(','));
        }
        if (sortParam) {
            setSortBy(sortParam as any);
        }
    }, [searchParams]);

    // Derive available flavors from products
    const availableFlavors = useMemo(() => {
        return Array.from(new Set(products.map(p => p.flavor).filter(Boolean))).sort();
    }, [products]);

    // Use brands from Firebase (already sorted by order)
    const availableBrands = useMemo(() => {
        return brands.map(b => b.name);
    }, [brands]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            // Search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const matchesSearch =
                    product.name.toLowerCase().includes(query) ||
                    product.brand?.toLowerCase().includes(query) ||
                    product.flavor?.toLowerCase().includes(query) ||
                    product.category?.toLowerCase().includes(query);
                if (!matchesSearch) return false;
            }

            // Brand filter
            if (selectedBrands.length > 0) {
                const brandMatch = selectedBrands.some(b =>
                    b.toLowerCase() === product.brand?.toLowerCase()
                );
                if (!brandMatch) return false;
            }

            // Strength filter
            if (selectedStrengths.length > 0) {
                if (!selectedStrengths.includes(product.strength)) return false;
            }

            // Flavor filter
            if (selectedFlavors.length > 0) {
                if (!selectedFlavors.includes(product.flavor)) return false;
            }

            // Price filter
            if (product.price < priceRange[0] || product.price > priceRange[1]) {
                return false;
            }

            return true;
        });

        // Sort
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-desc":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Featured first, then by creation date
                result.sort((a, b) => {
                    if (a.isFeatured && !b.isFeatured) return -1;
                    if (!a.isFeatured && b.isFeatured) return 1;
                    return 0;
                });
        }

        return result;
    }, [products, searchQuery, selectedBrands, selectedStrengths, selectedFlavors, priceRange, sortBy]);

    // Toggle filter helper
    const toggleFilter = (item: string, current: string[], set: (val: string[]) => void) => {
        set(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
    };

    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedStrengths([]);
        setSelectedFlavors([]);
        setSearchQuery("");
        if (products.length > 0) {
            const prices = products.map(p => p.price);
            setPriceRange([Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))]);
        }
    };

    const activeFiltersCount = selectedBrands.length + selectedStrengths.length + selectedFlavors.length;

    // Filter Sidebar Content
    const FilterContent = ({ isMobile = false }: { isMobile?: boolean }) => (
        <div className="space-y-1">
            {/* Search */}
            <div className="pb-5 border-b border-black/5 dark:border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-white dark:bg-white/5 border-black/10 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-black/10 dark:focus:ring-white/10"
                    />
                </div>
            </div>

            <FilterSection title="Brands">
                <CheckboxFilter
                    items={availableBrands}
                    selectedItems={selectedBrands}
                    onChange={(item) => toggleFilter(item, selectedBrands, setSelectedBrands)}
                />
            </FilterSection>

            <FilterSection title="Strength">
                <StrengthFilter
                    selectedItems={selectedStrengths}
                    onChange={(item) => toggleFilter(item, selectedStrengths, setSelectedStrengths)}
                />
            </FilterSection>

            {availableFlavors.length > 0 && (
                <FilterSection title="Flavor">
                    <CheckboxFilter
                        items={availableFlavors}
                        selectedItems={selectedFlavors}
                        onChange={(item) => toggleFilter(item, selectedFlavors, setSelectedFlavors)}
                    />
                </FilterSection>
            )}

            <FilterSection title="Price Range">
                <div className="flex gap-3 items-center">
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                            <Input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="pl-7 h-10 bg-white dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg"
                            />
                        </div>
                    </div>
                    <span className="text-muted-foreground mt-5">—</span>
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Max</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                            <Input
                                type="number"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                className="pl-7 h-10 bg-white dark:bg-white/5 border-black/10 dark:border-white/10 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-black selection:text-white">
            {/* Main Layout Container */}
            <div className="flex min-h-screen">

                {/* ============================================ */}
                {/* FIXED SIDEBAR - Desktop & Tablet (Apple-style) */}
                {/* ============================================ */}
                <aside className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-[280px] lg:w-[320px] bg-white dark:bg-black border-r border-black/5 dark:border-white/5 z-30 pt-28">
                    {/* Header - Fixed title within sidebar */}
                    <div className="px-8 pb-6 flex items-center justify-between shrink-0">
                        <h2 className="font-bold text-xl tracking-tight">Filters</h2>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearAllFilters}
                                className="text-xs font-medium text-muted-foreground hover:text-black dark:hover:text-white transition-colors"
                            >
                                Clear all
                            </button>
                        )}
                    </div>

                    {/* Scrollable Content (No visible scrollbar) */}
                    <div className="flex-1 overflow-y-auto px-8 pb-10 hover:overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                        <FilterContent />
                    </div>
                </aside>

                {/* ============================================ */}
                {/* MAIN CONTENT AREA */}
                {/* ============================================ */}
                <main className="flex-1 md:ml-[280px] lg:ml-[320px] min-w-0 pt-44 pb-20">
                    <div className="container px-4 sm:px-8 lg:px-12 mx-auto max-w-[1600px]">

                        {/* Breadcrumbs */}
                        <nav className="flex items-center gap-2 text-sm mb-8 text-muted-foreground" aria-label="Breadcrumb">
                            <Link href="/" className="flex items-center gap-1.5 hover:text-black dark:hover:text-white transition-colors">
                                <Home className="w-4 h-4" />
                                <span>Home</span>
                            </Link>
                            <ChevronRight className="w-4 h-4 opacity-50" />
                            <span className="flex items-center gap-1.5 text-black dark:text-white font-medium">
                                <ShoppingBag className="w-4 h-4" />
                                <span>Shop</span>
                            </span>
                        </nav>

                        {/* Header Section */}
                        <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-10">
                            <div>
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-3 text-black dark:text-white">
                                    All Products
                                </h1>
                                <p className="text-muted-foreground text-lg">
                                    {loading ? "Loading..." : `${filteredProducts.length} items`}
                                </p>
                            </div>

                            {/* Desktop Sort - Minimalist */}
                            <div className="hidden md:flex items-center gap-4">
                                <span className="text-sm font-medium text-muted-foreground">Sort by</span>
                                <div className="relative group">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="appearance-none bg-transparent pr-8 pl-0 py-2 text-sm font-semibold text-black dark:text-white cursor-pointer focus:outline-none border-none ring-0 w-auto text-right"
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-asc">Price: Low to High</option>
                                        <option value="price-desc">Price: High to Low</option>
                                        <option value="name-asc">Name: A-Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black dark:text-white pointer-events-none transition-transform group-hover:translate-y-[-2px]" />
                                </div>
                            </div>
                        </div>

                        {/* Mobile Header Controls */}
                        <div className="flex items-center justify-between gap-4 mb-8 md:hidden">
                            <Button
                                variant="outline"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="flex-1 h-12 rounded-full border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 text-base font-medium"
                            >
                                <SlidersHorizontal className="w-4 h-4 mr-2" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="ml-2 w-5 h-5 flex items-center justify-center bg-black text-white dark:bg-white dark:text-black text-[10px] rounded-full">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </Button>

                            <div className="relative flex-1">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as any)}
                                    className="w-full h-12 pl-4 pr-10 rounded-full bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-base font-medium appearance-none cursor-pointer"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-asc">Price: Low to High</option>
                                    <option value="price-desc">Price: High to Low</option>
                                    <option value="name-asc">Name: A-Z</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                            </div>
                        </div>

                        {/* Active Filters Pills (Clean style) */}
                        {activeFiltersCount > 0 && (
                            <div className="hidden md:flex flex-wrap gap-2 mb-8">
                                {[...selectedBrands, ...selectedStrengths, ...selectedFlavors].map((filter, i) => (
                                    <button
                                        key={`${filter}-${i}`}
                                        onClick={() => {
                                            if (selectedBrands.includes(filter)) toggleFilter(filter, selectedBrands, setSelectedBrands);
                                            else if (selectedStrengths.includes(filter)) toggleFilter(filter, selectedStrengths, setSelectedStrengths);
                                            else if (selectedFlavors.includes(filter)) toggleFilter(filter, selectedFlavors, setSelectedFlavors);
                                        }}
                                        className="group flex items-center gap-2 pl-3 pr-2 py-1.5 bg-black/5 dark:bg-white/10 hover:bg-black/10 dark:hover:bg-white/20 rounded-lg text-xs font-semibold text-black dark:text-white transition-all"
                                    >
                                        {filter}
                                        <X className="w-3.5 h-3.5 text-muted-foreground group-hover:text-black dark:group-hover:text-white" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <ShopGridSkeleton />
                        ) : filteredProducts.length > 0 ? (
                            <>
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
                                    initial="visible"
                                    animate="visible"
                                    variants={{
                                        visible: {
                                            transition: {
                                                staggerChildren: 0.05
                                            }
                                        }
                                    }}
                                >
                                    {filteredProducts.slice(0, visibleCount).map((product) => (
                                        <motion.div
                                            key={product.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
                                            }}
                                            animate="visible"
                                        >
                                            <ShopProductCard product={{ ...product, priority: visibleCount <= 9 && filteredProducts.indexOf(product) < 6 }} />
                                        </motion.div>
                                    ))}
                                </motion.div>

                                {/* Infinite Scroll Sentinel */}
                                {visibleCount < filteredProducts.length && (
                                    <div
                                        ref={scrollTrigger}
                                        className="py-12 flex justify-center w-full"
                                    >
                                        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-20">
                                <div className="w-16 h-16 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-7 h-7 text-muted-foreground" />
                                </div>
                                <p className="text-lg font-medium mb-2">
                                    No products found
                                </p>
                                <p className="text-muted-foreground mb-6">
                                    Try adjusting your filters or search terms
                                </p>
                                <Button onClick={clearAllFilters} variant="outline" className="rounded-full px-6">
                                    Clear All Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* ============================================ */}
            {/* MOBILE FILTERS DRAWER */}
            {/* ============================================ */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 md:hidden"
                            onClick={() => setMobileFiltersOpen(false)}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[90%] max-w-sm bg-white dark:bg-zinc-950 z-50 md:hidden shadow-2xl flex flex-col"
                        >
                            {/* Drawer Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-black/5 dark:border-white/5">
                                <h2 className="font-bold text-xl flex items-center gap-2">
                                    <Filter className="w-5 h-5" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="rounded-full"
                                >
                                    <X className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Drawer Content */}
                            <div className="flex-1 overflow-y-auto px-6 py-4">
                                <FilterContent isMobile />
                            </div>

                            {/* Drawer Footer */}
                            <div className="p-6 border-t border-black/5 dark:border-white/5 bg-white dark:bg-zinc-950">
                                <Button
                                    className="w-full h-12 rounded-xl font-bold text-base"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    Show {filteredProducts.length} Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}

// Wrap with Suspense for useSearchParams
export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
        }>
            <ShopPageContent />
        </Suspense>
    );
}
