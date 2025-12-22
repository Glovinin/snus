"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/admin/PageHeader";
import { AdminTable, AdminTableRow, AdminTableCell } from "@/components/admin/AdminTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit, Trash2, Search, PackageOpen, Star, Flame, Sparkles, Loader2, Tag, ChevronLeft } from "lucide-react";
import { ProductSheet } from "@/components/admin/products/ProductSheet";
import { BrandManager } from "@/components/admin/products/BrandManager";
import { BrandGrid } from "@/components/admin/products/BrandGrid"; // New component
import { getAdminProducts, deleteProduct, clearBrandStatuses, Product } from "@/lib/firebase/products";
import { getAllBrands, updateBrandOrders, Brand } from "@/lib/firebase/brands";
import { Eraser } from "lucide-react";
import toast from "react-hot-toast";

// ============================================
// HELPER COMPONENTS
// ============================================

function InventoryStatus({ stock }: { stock: number }) {
    let color = "bg-emerald-500 shadow-emerald-500/20";
    let text = "In Stock";

    if (stock === 0) {
        color = "bg-red-500 shadow-red-500/20";
        text = "Out of Stock";
    } else if (stock < 20) {
        color = "bg-amber-500 shadow-amber-500/20";
        text = "Low Stock";
    }

    return (
        <div className="flex items-center gap-2.5">
            <span className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${color}`} />
            <span className="text-zinc-300 font-medium text-xs">
                {text} <span className="text-zinc-500 ml-1">({stock})</span>
            </span>
        </div>
    );
}

function ProductBadges({ product }: { product: Product }) {
    return (
        <div className="flex items-center gap-1.5">
            {product.isFeatured && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-bold">
                    <Star className="w-3 h-3 fill-amber-400" />
                </span>
            )}
            {product.isBestSeller && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 text-[10px] font-bold">
                    <Flame className="w-3 h-3 fill-rose-400" />
                </span>
            )}
            {product.isWeeklySpecial && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 text-[10px] font-bold">
                    <Sparkles className="w-3 h-3 fill-purple-400" />
                </span>
            )}
        </div>
    );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function ProductsPage() {
    // Data State
    const [products, setProducts] = useState<Product[]>([]);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);

    // View State
    const [view, setView] = useState<'brands' | 'products'>('brands');
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    // Action State
    const [sheetOpen, setSheetOpen] = useState(false);
    const [brandManagerOpen, setBrandManagerOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [clearingStatus, setClearingStatus] = useState(false);

    // Fetch products from Firestore
    const fetchData = async () => {
        setLoading(true);
        try {
            const [productsData, brandsData] = await Promise.all([
                getAdminProducts(),
                getAllBrands()
            ]);
            setProducts(productsData);
            setBrands(brandsData);
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchProducts = fetchData; // Alias for compatibility with existing code calling fetchProducts


    // Selection Logic
    const handleSelectBrand = (brand: string) => {
        setSelectedBrand(brand);
        setView('products');
        setSearchQuery(""); // Reset search when entering brand view
    };

    const handleBackToBrands = () => {
        setSelectedBrand(null);
        setView('brands');
        setSearchQuery("");
    };

    // Filter products
    const filteredProducts = products.filter((p) => {
        // First filter by selected brand (if any)
        if (selectedBrand && p.brand !== selectedBrand) return false;

        // Then filter by search query
        if (!searchQuery) return true;

        return (
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Actions
    const handleEdit = (product: Product) => {
        setSelectedProduct(product);
        setSheetOpen(true);
    };

    const handleAdd = () => {
        setSelectedProduct(null);
        setSheetOpen(true);
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
            return;
        }

        setDeletingId(id);
        try {
            await deleteProduct(id);
            toast.success("Product deleted");
            setProducts((prev) => prev.filter((p) => p.id !== id));
        } catch (error: any) {
            toast.error(error.message || "Failed to delete product");
        } finally {
            setDeletingId(null);
        }
    };

    const handleClearStatus = async () => {
        if (!selectedBrand) return;

        if (!confirm(`Are you sure you want to remove all statuses (Featured, Best Seller, etc.) from all ${selectedBrand} products?`)) {
            return;
        }

        setClearingStatus(true);
        try {
            const count = await clearBrandStatuses(selectedBrand);
            toast.success(`Cleared statuses from ${count} products`);
            await fetchProducts();
        } catch (error: any) {
            toast.error(error.message || "Failed to clear statuses");
        } finally {
            setClearingStatus(false);
        }
    };

    const handleSheetSuccess = () => {
        fetchProducts(); // Refresh the list
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-6">
                <PageHeader
                    title="Products"
                    description={
                        view === 'brands'
                            ? "Manage your inventory by brand."
                            : `Managing products for ${selectedBrand}`
                    }
                    actionLabel="Add Product"
                    onAction={handleAdd}
                />

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center rounded-2xl p-1">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        {/* Back Button (Only in Product View) */}
                        {view === 'products' && (
                            <Button
                                variant="ghost"
                                onClick={handleBackToBrands}
                                className="h-10 px-3 bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-xl gap-2"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Button>
                        )}

                        {/* Search Bar (Only in Product View - BrandGrid has its own) */}
                        {view === 'products' && (
                            <div className="relative w-full sm:w-64 group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                                <Input
                                    placeholder={`Search ${selectedBrand || ""} products...`}
                                    className="pl-10 h-10 bg-zinc-900/50 border-zinc-800 focus:bg-zinc-900 focus:ring-1 focus:ring-white/10 transition-all text-sm text-white rounded-xl placeholder:text-zinc-500"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Additional Tools */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                onClick={() => setBrandManagerOpen(true)}
                                className="h-10 px-4 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl gap-2"
                            >
                                <Tag className="w-4 h-4" />
                                <span className="hidden sm:inline">Brands</span>
                            </Button>

                            {view === 'products' && (
                                <Button
                                    variant="outline"
                                    onClick={handleClearStatus}
                                    disabled={clearingStatus}
                                    className="h-10 px-4 bg-zinc-900/50 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 rounded-xl gap-2"
                                >
                                    {clearingStatus ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Eraser className="w-4 h-4" />
                                    )}
                                    <span className="hidden sm:inline">Clear Status</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Count Display */}
                    <div className="text-sm text-zinc-500 hidden sm:block">
                        {view === 'brands' ? (
                            `${products.length} total products`
                        ) : (
                            `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""}`
                        )}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                </div>
            ) : view === 'brands' ? (
                <BrandGrid
                    products={products}
                    brands={brands} // Pass firebase brands
                    onSelectBrand={handleSelectBrand}
                    onRefresh={fetchData}
                    onReorder={async (newOrder) => {
                        try {
                            // Optimistic update handled in child potentially, but for now we just save
                            await updateBrandOrders(newOrder);
                            await fetchData(); // Refresh to ensure sync
                        } catch (e) {
                            toast.error("Failed to save order");
                        }
                    }}
                />
            ) : (
                <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                    <AdminTable headers={["Product", "Category", "Price", "Inventory", "SKU", "Actions"]}>
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => (
                                <AdminTableRow
                                    key={product.id}
                                    onClick={() => handleEdit(product)}
                                    className="cursor-pointer group"
                                >
                                    <AdminTableCell className="font-medium text-white">
                                        <div className="flex items-center gap-4">
                                            {/* Product Thumbnail */}
                                            <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center overflow-hidden group-hover:border-white/10 transition-colors">
                                                {product.images && product.images.length > 0 ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <PackageOpen className="w-5 h-5 text-zinc-500" />
                                                )}
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="group-hover:text-white transition-colors">
                                                        {product.name}
                                                    </span>
                                                    <ProductBadges product={product} />
                                                </div>
                                                <span className="text-xs text-zinc-500">{product.brand}</span>
                                            </div>
                                        </div>
                                    </AdminTableCell>
                                    <AdminTableCell>
                                        <span className="px-2.5 py-1 rounded-full bg-zinc-800/50 border border-white/5 text-xs text-zinc-400">
                                            {product.category}
                                        </span>
                                    </AdminTableCell>
                                    <AdminTableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-white">€{product.price.toFixed(2)}</span>
                                            {product.compareAtPrice && (
                                                <span className="text-xs text-zinc-500 line-through">
                                                    €{product.compareAtPrice.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </AdminTableCell>
                                    <AdminTableCell>
                                        <InventoryStatus stock={product.stock} />
                                    </AdminTableCell>
                                    <AdminTableCell className="font-mono text-xs text-zinc-500">
                                        {product.sku}
                                    </AdminTableCell>
                                    <AdminTableCell>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(product);
                                                }}
                                                className="h-8 w-8 hover:bg-white/10 text-zinc-400 hover:text-white rounded-lg"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => handleDelete(product.id, e)}
                                                disabled={deletingId === product.id}
                                                className="h-8 w-8 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 rounded-lg"
                                            >
                                                {deletingId === product.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-4 h-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </AdminTableCell>
                                </AdminTableRow>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="p-12 text-center text-zinc-500">
                                    {searchQuery
                                        ? `No products found matching "${searchQuery}"`
                                        : "No products found for this brand."
                                    }
                                </td>
                            </tr>
                        )}
                    </AdminTable>
                </div>
            )}

            <ProductSheet
                open={sheetOpen}
                onOpenChange={setSheetOpen}
                product={selectedProduct}
                onSuccess={handleSheetSuccess}
                initialBrand={selectedBrand || undefined} // Pass selected brand to pre-fill
            />

            <BrandManager
                open={brandManagerOpen}
                onOpenChange={setBrandManagerOpen}
            />
        </div>
    );
}
