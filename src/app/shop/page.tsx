"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, ChevronDown, ChevronRight, SlidersHorizontal, ShoppingBag, Search, Loader2, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { getAllProducts, Product } from "@/lib/firebase/products";
import { getActiveBrands, Brand } from "@/lib/firebase/brands";

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
    defaultOpen = true
}: {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="border-b border-black/5 dark:border-white/5 py-6 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group mb-4"
            >
                <h3 className="font-bold text-sm uppercase tracking-wider">{title}</h3>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-50 group-hover:opacity-100`} />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
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
        <div className="flex flex-wrap gap-2 pt-2">
            {items.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                    <button
                        key={item}
                        onClick={() => onChange(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wide transition-all duration-200 border select-none ${isSelected
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10 scale-105'
                            : 'bg-transparent border-black/5 text-neutral-500 hover:border-black/20 hover:text-black dark:border-white/5 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:text-white'
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
        <div className="flex flex-col gap-2 pt-2">
            {STRENGTH_DATA.map((strength) => {
                const isSelected = selectedItems.includes(strength.name);
                return (
                    <button
                        key={strength.name}
                        onClick={() => onChange(strength.name)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 border select-none ${isSelected
                            ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-lg shadow-black/10'
                            : 'bg-transparent border-black/5 text-neutral-500 hover:border-black/20 hover:bg-black/5 dark:border-white/5 dark:text-neutral-400 dark:hover:border-white/20 dark:hover:bg-white/5'
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

function ShopProductCard({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = product.price;
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);
    const { addItem, openCart } = useCartStore();

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
        <Link href={`/product/${product.id}`} className="block h-full">
            <motion.div
                tabIndex={0}
                className={`relative w-full h-[400px] sm:h-[450px] group rounded-[2rem] overflow-hidden select-none ${!hasImage ? bgColor : ""} border border-foreground/5 flex flex-col justify-between p-6 sm:p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500`}
                style={hasImage ? { backgroundImage: `url(${product.images[0]})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
            >
                {/* Overlay for image background */}
                {hasImage && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
                )}

                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-white/40 backdrop-blur-md ${hasImage ? "text-white" : textColor}`}>
                            {product.category}
                        </span>
                        {product.isBestSeller && (
                            <span className="text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-rose-500/80 text-white backdrop-blur-md">
                                Best Seller
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="transition-transform duration-500 group-hover:-translate-y-2">
                            <p className={`text-xs ${hasImage ? "text-white/70" : textColor + " opacity-60"} mb-1`}>
                                {product.brand}
                            </p>
                            <h3 className={`text-2xl sm:text-3xl font-bold mb-1 ${hasImage ? "text-white" : textColor} tracking-tight leading-none`}>
                                {product.name}
                            </h3>
                            <p className={`text-lg sm:text-xl font-medium ${hasImage ? "text-white" : textColor} opacity-80 mt-2`}>
                                €{currentPrice} <span className="text-sm opacity-60 font-normal">/ {selectedSize} pack</span>
                            </p>
                            {product.compareAtPrice && product.compareAtPrice > product.price && (
                                <p className={`text-sm line-through ${hasImage ? "text-white/50" : textColor + " opacity-50"}`}>
                                    €{product.compareAtPrice.toFixed(2)}
                                </p>
                            )}
                        </div>

                        {/* Controls Container - Visible on Hover */}
                        <div className="flex flex-col gap-3 transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                            {/* Pack Size Selector */}
                            <div
                                className="flex items-center justify-between bg-white/40 backdrop-blur-md rounded-xl p-1 shadow-sm border border-white/20"
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
                                        className={`h-7 sm:h-8 flex-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${selectedSize === size
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
                                className="w-full h-10 sm:h-12 rounded-xl text-sm sm:text-base font-bold shadow-lg bg-black text-white hover:bg-black/90 border-0"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    const packPrice = basePrice * Number(selectedSize);

                                    addItem({
                                        id: product.id,
                                        name: product.name,
                                        price: packPrice,
                                        image: product.images?.[0] || "/placeholder.jpg",
                                        bgClass: bgColor,
                                        variant: `${product.strength} • ${selectedSize} Pack`,
                                        quantity: 1
                                    });
                                    openCart();
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

    // Use brands from Firebase
    const availableBrands = useMemo(() => {
        return brands.map(b => b.name).sort();
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
    const FilterContent = () => (
        <div className="space-y-2">
            {/* Search */}
            <div className="pb-6 border-b border-black/5 dark:border-white/5">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-11 bg-white dark:bg-white/5 border-black/5 dark:border-white/5 rounded-xl"
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
                <div className="flex gap-4 items-center pt-2">
                    <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1 block">Min</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">€</span>
                            <Input
                                type="number"
                                value={priceRange[0]}
                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                className="pl-7 h-10 bg-white dark:bg-white/5 border-black/5 dark:border-white/5 rounded-lg"
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
                                className="pl-7 h-10 bg-white dark:bg-white/5 border-black/5 dark:border-white/5 rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </FilterSection>

            {activeFiltersCount > 0 && (
                <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                    className="w-full mt-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F5F5F7] dark:bg-black flex flex-col">
            <Header />

            <main className="flex-1 pt-32 pb-20">
                <div className="container px-4 mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-sm mb-6" aria-label="Breadcrumb">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Home className="w-4 h-4" />
                            <span>Home</span>
                        </Link>
                        <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                        <span className="font-medium text-foreground">Shop</span>
                    </nav>

                    {/* Header */}
                    <div className="mb-10">
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-3">
                            Shop All Products
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            {loading ? "Loading..." : `${filteredProducts.length} products available`}
                        </p>
                    </div>

                    <div className="flex gap-12">
                        {/* Desktop Sidebar */}
                        <aside className="hidden lg:block w-[280px] shrink-0">
                            <div className="sticky top-32 bg-white/80 dark:bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-black/5 dark:border-white/5">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bold text-lg flex items-center gap-2">
                                        <Filter className="w-5 h-5" />
                                        Filters
                                    </h2>
                                    {activeFiltersCount > 0 && (
                                        <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-1 rounded-full">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </div>
                                <FilterContent />
                            </div>
                        </aside>

                        {/* Main Content */}
                        <div className="flex-1 min-w-0">
                            {/* Mobile Header */}
                            <div className="flex items-center justify-between gap-4 mb-8 lg:hidden">
                                <Button
                                    variant="outline"
                                    onClick={() => setMobileFiltersOpen(true)}
                                    className="flex items-center gap-2 rounded-full px-4 bg-white dark:bg-white/5"
                                >
                                    <SlidersHorizontal className="w-4 h-4" />
                                    Filters
                                    {activeFiltersCount > 0 && (
                                        <span className="text-xs font-bold bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 rounded-full ml-1">
                                            {activeFiltersCount}
                                        </span>
                                    )}
                                </Button>

                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="h-11 pl-4 pr-10 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-medium appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-black/20 dark:focus:border-white/20 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md"
                                    >
                                        <option value="featured" className="bg-white dark:bg-zinc-900">Featured</option>
                                        <option value="price-asc" className="bg-white dark:bg-zinc-900">Price: Low to High</option>
                                        <option value="price-desc" className="bg-white dark:bg-zinc-900">Price: High to Low</option>
                                        <option value="name-asc" className="bg-white dark:bg-zinc-900">Name: A-Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Desktop Sort */}
                            <div className="hidden lg:flex items-center justify-end mb-8 gap-3">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <div className="relative">
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value as any)}
                                        className="h-11 pl-4 pr-10 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm font-medium appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/10 focus:border-black/20 dark:focus:border-white/20 hover:border-black/20 dark:hover:border-white/20 hover:shadow-md min-w-[180px]"
                                    >
                                        <option value="featured" className="bg-white dark:bg-zinc-900 py-2">Featured</option>
                                        <option value="price-asc" className="bg-white dark:bg-zinc-900 py-2">Price: Low to High</option>
                                        <option value="price-desc" className="bg-white dark:bg-zinc-900 py-2">Price: High to Low</option>
                                        <option value="name-asc" className="bg-white dark:bg-zinc-900 py-2">Name: A-Z</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                                </div>
                            </div>

                            {/* Loading State */}
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
                                    <p className="text-sm text-muted-foreground">Loading products...</p>
                                </div>
                            ) : filteredProducts.length > 0 ? (
                                <motion.div
                                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        hidden: { opacity: 0 },
                                        visible: {
                                            opacity: 1,
                                            transition: {
                                                staggerChildren: 0.1
                                            }
                                        }
                                    }}
                                >
                                    {filteredProducts.map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            variants={{
                                                hidden: { opacity: 0, y: 20 },
                                                visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
                                            }}
                                        >
                                            <ShopProductCard product={product} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-20">
                                    <p className="text-lg text-muted-foreground mb-4">
                                        No products found matching your filters.
                                    </p>
                                    <Button onClick={clearAllFilters} variant="outline" className="rounded-full">
                                        Clear Filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                            onClick={() => setMobileFiltersOpen(false)}
                        />
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="fixed inset-y-0 left-0 w-[85%] max-w-md bg-background z-50 lg:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="font-bold text-xl">Filters</h2>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setMobileFiltersOpen(false)}
                                    >
                                        <X className="w-5 h-5" />
                                    </Button>
                                </div>
                                <FilterContent />
                                <Button
                                    className="w-full mt-8 h-12 rounded-xl"
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
