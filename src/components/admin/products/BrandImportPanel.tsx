"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Download, Check, ChevronDown, Package } from "lucide-react";
import { BRAND_LIST, seedBrandProducts } from "@/lib/firebase/brand-seeds";
import toast from "react-hot-toast";

interface BrandImportPanelProps {
    onImportSuccess?: () => void;
}

const STORAGE_KEY = "imported-brands";

export function BrandImportPanel({ onImportSuccess }: BrandImportPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [importedBrands, setImportedBrands] = useState<Set<string>>(new Set());
    const [importingBrand, setImportingBrand] = useState<string | null>(null);

    // Load imported brands from localStorage
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setImportedBrands(new Set(JSON.parse(saved)));
            } catch (e) {
                // Invalid data, reset
            }
        }
    }, []);

    // Save imported brands to localStorage
    const saveImported = (brands: Set<string>) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...brands]));
    };

    const handleImport = async (brandKey: string, brandName: string) => {
        setImportingBrand(brandKey);
        try {
            const result = await seedBrandProducts(brandKey);

            if (result.success) {
                if (result.count > 0) {
                    toast.success(`✓ ${result.message}`);
                    onImportSuccess?.();
                } else {
                    toast.success(result.message);
                }

                // Mark as imported
                const newImported = new Set(importedBrands);
                newImported.add(brandKey);
                setImportedBrands(newImported);
                saveImported(newImported);
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Import failed");
        } finally {
            setImportingBrand(null);
        }
    };

    const importedCount = importedBrands.size;
    const totalCount = BRAND_LIST.length;

    return (
        <div className="relative">
            {/* Toggle Button */}
            <Button
                variant="outline"
                onClick={() => setIsOpen(!isOpen)}
                className="h-10 px-4 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/30 text-emerald-400 rounded-xl gap-2"
            >
                <Package className="w-4 h-4" />
                Import Brands
                <span className="text-xs opacity-70">
                    ({importedCount}/{totalCount})
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-[600px] max-h-[400px] overflow-y-auto bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 p-4">
                    <div className="grid grid-cols-3 gap-2">
                        {BRAND_LIST.map((brand) => {
                            const isImported = importedBrands.has(brand.key);
                            const isImporting = importingBrand === brand.key;

                            return (
                                <Button
                                    key={brand.key}
                                    variant="ghost"
                                    size="sm"
                                    disabled={isImporting}
                                    onClick={() => handleImport(brand.key, brand.name)}
                                    className={`
                                        h-auto py-2 px-3 justify-start text-left
                                        ${isImported
                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                            : "bg-zinc-800/50 border border-zinc-700/50 text-zinc-300 hover:bg-zinc-800 hover:border-zinc-600"
                                        }
                                        rounded-lg
                                    `}
                                >
                                    <div className="flex items-center gap-2 w-full">
                                        {isImporting ? (
                                            <Loader2 className="w-3 h-3 animate-spin shrink-0" />
                                        ) : isImported ? (
                                            <Check className="w-3 h-3 shrink-0" />
                                        ) : (
                                            <Download className="w-3 h-3 shrink-0 opacity-50" />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-xs truncate">
                                                {brand.name}
                                            </div>
                                            <div className="text-[10px] opacity-60">
                                                {brand.count} products
                                            </div>
                                        </div>
                                    </div>
                                </Button>
                            );
                        })}
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                        <span>
                            {importedCount === 0
                                ? "Click a brand to import its products"
                                : `${importedCount} of ${totalCount} brands imported`
                            }
                        </span>
                        {importedCount > 0 && (
                            <button
                                onClick={() => {
                                    setImportedBrands(new Set());
                                    localStorage.removeItem(STORAGE_KEY);
                                }}
                                className="text-zinc-500 hover:text-zinc-300 transition-colors"
                            >
                                Reset status
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Click outside to close */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
