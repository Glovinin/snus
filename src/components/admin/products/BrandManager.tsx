"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Loader2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
} from "@/components/ui/sheet";
import {
    getAllBrands,
    createBrand,
    updateBrand,
    deleteBrand,
    Brand,
} from "@/lib/firebase/brands";
import toast from "react-hot-toast";

interface BrandManagerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onBrandsUpdate?: () => void;
}

export function BrandManager({ open, onOpenChange, onBrandsUpdate }: BrandManagerProps) {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
    const [newBrandName, setNewBrandName] = useState("");
    const [editName, setEditName] = useState("");

    // Fetch brands
    const fetchBrands = async () => {
        try {
            const data = await getAllBrands();
            setBrands(data);
        } catch (error) {
            console.error("Failed to fetch brands:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            fetchBrands();
        }
    }, [open]);

    // Create brand
    const handleCreate = async () => {
        if (!newBrandName.trim()) {
            toast.error("Please enter a brand name");
            return;
        }

        // Check if brand already exists
        if (brands.some(b => b.name.toLowerCase() === newBrandName.trim().toLowerCase())) {
            toast.error("This brand already exists");
            return;
        }

        setSaving(true);
        try {
            await createBrand(newBrandName.trim());
            toast.success("Brand created!");
            setNewBrandName("");
            await fetchBrands();
            onBrandsUpdate?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to create brand");
        } finally {
            setSaving(false);
        }
    };

    // Update brand
    const handleUpdate = async () => {
        if (!editingBrand || !editName.trim()) return;

        setSaving(true);
        try {
            await updateBrand(editingBrand.id, { name: editName.trim() });
            toast.success("Brand updated!");
            setEditingBrand(null);
            setEditName("");
            await fetchBrands();
            onBrandsUpdate?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to update brand");
        } finally {
            setSaving(false);
        }
    };

    // Delete brand
    const handleDelete = async (brand: Brand) => {
        if (!confirm(`Are you sure you want to delete "${brand.name}"?`)) return;

        try {
            await deleteBrand(brand.id);
            toast.success("Brand deleted!");
            await fetchBrands();
            onBrandsUpdate?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to delete brand");
        }
    };

    // Start editing
    const startEdit = (brand: Brand) => {
        setEditingBrand(brand);
        setEditName(brand.name);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingBrand(null);
        setEditName("");
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent title="Manage Brands" className="w-full sm:max-w-md overflow-y-auto">
                <div className="space-y-6">
                    {/* Add New Brand */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                            Add New Brand
                        </h3>
                        <div className="flex gap-2">
                            <Input
                                value={newBrandName}
                                onChange={(e) => setNewBrandName(e.target.value)}
                                placeholder="e.g. VELO, ZYN, LYFT..."
                                className="h-11 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl flex-1"
                                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                            />
                            <Button
                                onClick={handleCreate}
                                disabled={saving || !newBrandName.trim()}
                                className="h-11 px-4 bg-white text-black hover:bg-zinc-200 rounded-xl"
                            >
                                {saving ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Plus className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Brands List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                                All Brands
                            </h3>
                            <span className="text-xs text-zinc-500">
                                {brands.length} brand{brands.length !== 1 ? "s" : ""}
                            </span>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="w-6 h-6 text-zinc-500 animate-spin" />
                            </div>
                        ) : brands.length === 0 ? (
                            <div className="text-center py-12 text-zinc-500">
                                <Tag className="w-10 h-10 mx-auto mb-3 opacity-50" />
                                <p className="text-sm">No brands yet</p>
                                <p className="text-xs text-zinc-600 mt-1">Add your first brand above</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <AnimatePresence mode="popLayout">
                                    {brands.map((brand) => (
                                        <motion.div
                                            key={brand.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            className="group flex items-center gap-3 p-3 bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 rounded-xl transition-colors"
                                        >
                                            {editingBrand?.id === brand.id ? (
                                                // Edit Mode
                                                <>
                                                    <Input
                                                        value={editName}
                                                        onChange={(e) => setEditName(e.target.value)}
                                                        className="h-9 bg-zinc-800 border-zinc-700 text-white rounded-lg flex-1 text-sm"
                                                        autoFocus
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") handleUpdate();
                                                            if (e.key === "Escape") cancelEdit();
                                                        }}
                                                    />
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={handleUpdate}
                                                        disabled={saving}
                                                        className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/10"
                                                    >
                                                        {saving ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Plus className="w-4 h-4 rotate-45" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={cancelEdit}
                                                        className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </Button>
                                                </>
                                            ) : (
                                                // View Mode
                                                <>
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs font-bold uppercase">
                                                        {brand.name.charAt(0)}
                                                    </div>
                                                    <span className="flex-1 font-medium text-white text-sm">
                                                        {brand.name}
                                                    </span>
                                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => startEdit(brand)}
                                                            className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-zinc-800"
                                                        >
                                                            <Pencil className="w-3.5 h-3.5" />
                                                        </Button>
                                                        <Button
                                                            size="icon"
                                                            variant="ghost"
                                                            onClick={() => handleDelete(brand)}
                                                            className="h-8 w-8 text-zinc-500 hover:text-red-500 hover:bg-red-500/10"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5" />
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
