"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { products, Product } from "@/data/products";
import { Filter, X, ChevronDown, Check, SlidersHorizontal, ShoppingBag, ArrowUpDown, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/store/cartStore";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

// --- Derived Data for Filters ---

const BRANDS = Array.from(new Set(products.map(p => p.name.split(" ")[0]))).sort();
const STRENGTHS = Array.from(new Set(products.map(p => p.strength))).filter(Boolean);
const FLAVORS = Array.from(new Set(products.map(p => p.flavor))).sort();

// Helper to parse price
const getPrice = (p: Product) => parseFloat(p.price.replace(/[^0-9.]/g, ''));

const MIN_PRICE = Math.floor(Math.min(...products.map(getPrice)));
const MAX_PRICE = Math.ceil(Math.max(...products.map(getPrice)));

// --- Filter Section Component ---

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
        <div className="space-y-3 pb-2 pl-1">
            {items.map((item) => {
                const isSelected = selectedItems.includes(item);
                return (
                    <label key={item} className="flex items-center gap-3 cursor-pointer group/label">
                        <div
                            className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${isSelected
                                ? 'bg-black border-black text-white dark:bg-white dark:border-white dark:text-black'
                                : 'border-black/20 dark:border-white/20 group-hover/label:border-black/40 dark:group-hover/label:border-white/40 bg-transparent'
                                }`}
                        >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={isSelected}
                            onChange={() => onChange(item)}
                        />
                        <span className={`text-sm transition-colors ${isSelected ? 'font-medium opacity-100' : 'opacity-70 group-hover/label:opacity-100'}`}>
                            {item}
                        </span>
                    </label>
                );
            })}
        </div>
    );
}

// --- Product Card Component (Matching Platform Design) ---

function ShopProductCard({ product }: { product: Product }) {
    const [selectedSize, setSelectedSize] = useState("1");
    const basePrice = parseFloat(product.price.replace(/[^0-9.]/g, ''));
    const currentPrice = (basePrice * Number(selectedSize)).toFixed(2);
    const { addItem, openCart } = useCartStore();

    return (
        <Link href={`/product/${product.id}`} className="block h-full">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                tabIndex={0}
                className={`relative w-full h-[400px] sm:h-[450px] group rounded-[2rem] overflow-hidden select-none ${product.image} border border-foreground/5 flex flex-col justify-between p-6 sm:p-8 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500`}
            >
                {/* Hover Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <span className={`text-[10px] font-bold uppercase tracking-widest py-1 px-2.5 rounded-full bg-white/40 backdrop-blur-md ${product.textColor}`}>
                            {product.category}
                        </span>
                    </div>

                    <div className="flex flex-col gap-4">
                        <div className="transition-transform duration-500 group-hover:-translate-y-2">
                            <h3 className={`text-2xl sm:text-3xl font-bold mb-1 ${product.textColor} tracking-tight leading-none`}>
                                {product.name}
                            </h3>
                            <p className={`text-lg sm:text-xl font-medium ${product.textColor} opacity-80 mt-2`}>
                                €{currentPrice} <span className="text-sm opacity-60 font-normal">/ {selectedSize} pack</span>
                            </p>
                        </div>

                        {/* Controls Container - Visible on Hover (Desktop) or Always (Mobile if desired, but here stick to hover logic with mobile caveat) */}
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
                                        image: "/snusidealogo.svg",
                                        bgClass: product.image,
                                        variant: `${product.strength || 'Standard'} • ${selectedSize} Pack`,
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

// --- Main Page Component ---

export default function ShopPage() {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [selectedStrengths, setSelectedStrengths] = useState<string[]>([]);
    const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<[number, number]>([MIN_PRICE, MAX_PRICE]);

    // Sort State
    const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name-asc">("featured");

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    // Initial load sync
    useEffect(() => {
        // Optional: Read URL params here if we want deep linking
    }, []);

    // Filter Logic
    const filteredProducts = useMemo(() => {
        let result = products.filter(product => {
            const price = getPrice(product);
            const brandMatch = selectedBrands.length === 0 || selectedBrands.includes(product.name.split(" ")[0]);
            const strengthMatch = selectedStrengths.length === 0 || selectedStrengths.includes(product.strength);
            const flavorMatch = selectedFlavors.length === 0 || selectedFlavors.includes(product.flavor);
            const priceMatch = price >= priceRange[0] && price <= priceRange[1];

            return brandMatch && strengthMatch && flavorMatch && priceMatch;
        });

        // Sort Logic
        switch (sortBy) {
            case "price-asc":
                result.sort((a, b) => getPrice(a) - getPrice(b));
                break;
            case "price-desc":
                result.sort((a, b) => getPrice(b) - getPrice(a));
                break;
            case "name-asc":
                result.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // Featured/Default order (as in array)
                break;
        }

        return result;
    }, [selectedBrands, selectedStrengths, selectedFlavors, priceRange, sortBy]);

    // Helpers
    const toggleFilter = (item: string, current: string[], set: (val: string[]) => void) => {
        set(current.includes(item) ? current.filter(i => i !== item) : [...current, item]);
    };

    const clearAllFilters = () => {
        setSelectedBrands([]);
        setSelectedStrengths([]);
        setSelectedFlavors([]);
        setPriceRange([MIN_PRICE, MAX_PRICE]);
    };

    const activeFilterCount = selectedBrands.length + selectedStrengths.length + selectedFlavors.length + (priceRange[0] !== MIN_PRICE || priceRange[1] !== MAX_PRICE ? 1 : 0);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main className="pt-32 pb-20 px-4 md:px-8 max-w-[1920px] mx-auto">

                {/* Header & Controls */}
                <div className="flex flex-col gap-8 mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">Shop All.</h1>
                            <p className="text-lg text-muted-foreground max-w-xl font-light">
                                Discover our premium collection. curated for quality and satisfaction.
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Mobile Filter Trigger */}
                            <Button
                                variant="outline"
                                onClick={() => setMobileFiltersOpen(true)}
                                className="md:hidden flex items-center gap-2 rounded-full h-12 px-6"
                            >
                                <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
                            </Button>

                            {/* Sort Dropdown (Desktop & Mobile) */}
                            <div className="relative group z-30">
                                <button className="flex items-center gap-2 px-4 py-3 bg-white dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-full text-sm font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors min-w-[160px] justify-between">
                                    <span className="flex items-center gap-2">
                                        <ArrowUpDown className="w-4 h-4" />
                                        {sortBy === "featured" && "Featured"}
                                        {sortBy === "price-asc" && "Price: Low to High"}
                                        {sortBy === "price-desc" && "Price: High to Low"}
                                        {sortBy === "name-asc" && "Name: A-Z"}
                                    </span>
                                    <ChevronDown className="w-4 h-4 opacity-50" />
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-white dark:bg-[#1a1a1a] rounded-2xl shadow-xl border border-black/5 dark:border-white/5 overflow-hidden hidden group-hover:block transition-all">
                                    {[
                                        { label: "Featured", value: "featured" },
                                        { label: "Price: Low to High", value: "price-asc" },
                                        { label: "Price: High to Low", value: "price-desc" },
                                        { label: "Name: A-Z", value: "name-asc" },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => setSortBy(opt.value as any)}
                                            className={`w-full text-left px-5 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${sortBy === opt.value ? "font-bold text-black dark:text-white" : "text-muted-foreground"}`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-12">
                    {/* Desktop Sidebar */}
                    <aside className="hidden md:block w-72 shrink-0 space-y-6 sticky top-32 h-[calc(100vh-10rem)] overflow-y-auto pr-2 custom-scrollbar">
                        <div className="flex items-center justify-between opacity-50 mb-2">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-widest">Filters</span>
                            </div>
                            {activeFilterCount > 0 && (
                                <button onClick={clearAllFilters} className="text-xs hover:underline decoration-1 underline-offset-2">
                                    Clear All
                                </button>
                            )}
                        </div>

                        <FilterSection title="Price Range">
                            <div className="px-1 py-2 space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                                        <Input
                                            type="number"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            value={priceRange[0]}
                                            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                            className="pl-7 h-10 rounded-lg bg-transparent"
                                            placeholder="Min"
                                        />
                                    </div>
                                    <span className="text-muted-foreground">-</span>
                                    <div className="relative flex-1">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">€</span>
                                        <Input
                                            type="number"
                                            min={MIN_PRICE}
                                            max={MAX_PRICE}
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="pl-7 h-10 rounded-lg bg-transparent"
                                            placeholder="Max"
                                        />
                                    </div>
                                </div>
                            </div>
                        </FilterSection>

                        <FilterSection title="Brands">
                            <CheckboxFilter items={BRANDS} selectedItems={selectedBrands} onChange={(i) => toggleFilter(i, selectedBrands, setSelectedBrands)} />
                        </FilterSection>

                        <FilterSection title="Strength">
                            <CheckboxFilter items={STRENGTHS} selectedItems={selectedStrengths} onChange={(i) => toggleFilter(i, selectedStrengths, setSelectedStrengths)} />
                        </FilterSection>

                        <FilterSection title="Flavor">
                            <CheckboxFilter items={FLAVORS} selectedItems={selectedFlavors} onChange={(i) => toggleFilter(i, selectedFlavors, setSelectedFlavors)} />
                        </FilterSection>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ShopProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {filteredProducts.length === 0 && (
                            <div className="py-32 text-center flex flex-col items-center justify-center">
                                <div className="w-16 h-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-6">
                                    <Search className="w-8 h-8 opacity-40" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No products found</h3>
                                <p className="text-muted-foreground max-w-md mx-auto mb-8">
                                    We couldn't find any products matching your filters. Try adjusting your search criteria.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={clearAllFilters}
                                    className="rounded-full px-8 h-12 border-black/10 dark:border-white/10"
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

            </main>
            <Footer />

            {/* Mobile Filters Drawer */}
            <AnimatePresence>
                {mobileFiltersOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileFiltersOpen(false)}
                            className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm md:hidden"
                        />
                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="fixed top-0 right-0 h-full w-full sm:w-[400px] bg-background z-[70] shadow-2xl flex flex-col md:hidden"
                        >
                            <div className="flex items-center justify-between p-6 border-b border-border">
                                <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="rounded-full"
                                >
                                    <X className="w-6 h-6" />
                                </Button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                <FilterSection title="Price Range">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-4">
                                            <Input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                                className="h-12 rounded-xl"
                                                placeholder="Min"
                                            />
                                            <span className="text-muted-foreground">-</span>
                                            <Input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                className="h-12 rounded-xl"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </FilterSection>
                                <FilterSection title="Brands">
                                    <CheckboxFilter items={BRANDS} selectedItems={selectedBrands} onChange={(i) => toggleFilter(i, selectedBrands, setSelectedBrands)} />
                                </FilterSection>
                                <FilterSection title="Strength">
                                    <CheckboxFilter items={STRENGTHS} selectedItems={selectedStrengths} onChange={(i) => toggleFilter(i, selectedStrengths, setSelectedStrengths)} />
                                </FilterSection>
                                <FilterSection title="Flavor">
                                    <CheckboxFilter items={FLAVORS} selectedItems={selectedFlavors} onChange={(i) => toggleFilter(i, selectedFlavors, setSelectedFlavors)} />
                                </FilterSection>
                            </div>

                            <div className="p-6 border-t border-border bg-background">
                                <Button
                                    className="w-full h-14 rounded-xl text-lg font-bold bg-foreground text-background hover:bg-foreground/90"
                                    onClick={() => setMobileFiltersOpen(false)}
                                >
                                    Show {filteredProducts.length} Results
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
