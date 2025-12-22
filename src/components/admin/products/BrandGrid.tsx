"use client";

import { motion } from "framer-motion";
import { PackageOpen, ChevronRight, Package, Search, Trash2, Loader2, AlertTriangle, Sparkles, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import { deleteBrandByName, Brand } from "@/lib/firebase/brands";
import toast from "react-hot-toast";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BrandStats {
    count: number;
    images: string[];
    hasActiveStatus: boolean;
}

interface BrandGridProps {
    products: any[];
    brands?: Brand[];
    onSelectBrand: (brand: string) => void;
    onRefresh: () => void;
    onReorder?: (items: { id: string; order: number }[]) => void;
}

// Sortable Item Wrapper
function SortableBrandItem({
    brand,
    children
}: {
    brand: Brand;
    children: React.ReactNode
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: brand.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
        position: 'relative' as const,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {children}
        </div>
    );
}

export function BrandGrid({ products, brands: firebaseBrands, onSelectBrand, onRefresh, onReorder }: BrandGridProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [deletingBrand, setDeletingBrand] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
    const [orderedBrands, setOrderedBrands] = useState<Brand[]>([]);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Initialize ordered brands from props
    useEffect(() => {
        if (firebaseBrands) {
            // Sort by order field, fallback to name
            const sorted = [...firebaseBrands].sort((a, b) => {
                if (a.order !== undefined && b.order !== undefined) {
                    return a.order - b.order;
                }
                return 0;
            });
            setOrderedBrands(sorted);
        }
    }, [firebaseBrands]);

    // Calculate stats per brand from actual products
    // Memoize to avoid recalculation on drag
    const brandStats = useMemo(() => {
        return products.reduce((acc, product) => {
            const brand = product.brand || "Unknown";
            if (!acc[brand]) {
                acc[brand] = { count: 0, images: [], hasActiveStatus: false };
            }
            acc[brand].count++;

            // Check for active statuses
            if (product.isFeatured || product.isBestSeller || product.isWeeklySpecial) {
                acc[brand].hasActiveStatus = true;
            }

            // Keep up to 4 unique images for preview
            if (acc[brand].images.length < 4 && product.images?.[0]) {
                if (!acc[brand].images.includes(product.images[0])) {
                    acc[brand].images.push(product.images[0]);
                }
            }
            return acc;
        }, {} as Record<string, BrandStats>);
    }, [products]);

    // Handle Drag End
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setOrderedBrands((items) => {
                const oldIndex = items.findIndex((i) => i.id === active.id);
                const newIndex = items.findIndex((i) => i.id === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);

                // Call parent update
                if (onReorder) {
                    const updates = newItems.map((item, index) => ({
                        id: item.id,
                        order: index
                    }));
                    onReorder(updates);
                }

                return newItems;
            });
        }
    };

    // Filter brands based on search
    const filteredBrands = orderedBrands.filter(brand =>
        brand.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (brandName: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setConfirmDelete(brandName);
    };

    const confirmDeletion = async () => {
        if (!confirmDelete) return;

        const brandName = confirmDelete;
        setDeletingBrand(brandName);
        setConfirmDelete(null);

        try {
            const result = await deleteBrandByName(brandName);
            if (result.success) {
                toast.success(result.message);
                onRefresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete brand");
        } finally {
            setDeletingBrand(null);
        }
    };

    // Render Card Content (Shared)
    const renderCardContent = (brandName: string) => {
        const stats = brandStats[brandName] || { count: 0, images: [], hasActiveStatus: false };
        const { count, images, hasActiveStatus } = stats;

        return (
            <>
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/10 to-zinc-900/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative h-full bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 hover:bg-zinc-900 hover:border-zinc-700 transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-black/50 flex flex-col">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                            {/* Drag Handle or Icon */}
                            {onReorder ? (
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-500 group-hover:text-zinc-300 group-hover:bg-zinc-800 transition-colors cursor-grab active:cursor-grabbing">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                            ) : (
                                <div className="w-10 h-10 rounded-xl bg-zinc-800/50 flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:bg-zinc-800 transition-colors relative">
                                    <Package className="w-5 h-5" />
                                    {hasActiveStatus && (
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-zinc-900 shadow-[0_0_8px] shadow-amber-500/50 animate-pulse" />
                                    )}
                                </div>
                            )}

                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="font-medium text-zinc-200 group-hover:text-white transition-colors">
                                        {brandName}
                                    </h3>
                                    {hasActiveStatus && (
                                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500/20" />
                                    )}
                                </div>
                                <div className="text-xs text-zinc-500">
                                    {count} product{count !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => handleDelete(brandName, e)}
                                disabled={deletingBrand === brandName}
                                className="w-8 h-8 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                onPointerDown={(e) => e.stopPropagation()} // Prevent drag start on button
                            >
                                {deletingBrand === brandName ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Trash2 className="w-4 h-4" />
                                )}
                            </Button>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 group-hover:text-zinc-300 bg-transparent group-hover:bg-white/5 transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-4 gap-2 mt-auto">
                        {Array.from({ length: 4 }).map((_, i) => {
                            const img = images[i];
                            return (
                                <div
                                    key={i}
                                    className="aspect-square rounded-lg bg-zinc-800/30 overflow-hidden border border-white/5"
                                >
                                    {img ? (
                                        <img
                                            src={img}
                                            alt=""
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                            <div className="w-1.5 h-1.5 rounded-full bg-current opacity-20" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </>
        );
    }

    return (
        <div className="space-y-6">
            {/* Confirmation Dialog */}
            {confirmDelete && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
                        <div className="flex items-center gap-3 text-red-400">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="text-lg font-bold">Delete {confirmDelete}?</h3>
                        </div>

                        <p className="text-zinc-400 text-sm leading-relaxed">
                            This action is permanent and cannot be undone. It will delete:
                            <ul className="list-disc list-inside mt-2 space-y-1 text-zinc-500">
                                <li>The brand "{confirmDelete}"</li>
                                <li>All associated products</li>
                                <li>All product images from storage</li>
                            </ul>
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <Button
                                variant="outline"
                                className="flex-1 h-11 rounded-xl border-zinc-700 hover:bg-zinc-800 text-zinc-300"
                                onClick={() => setConfirmDelete(null)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-medium"
                                onClick={confirmDeletion}
                            >
                                Yes, Delete Everything
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search */}
            <div className="relative w-full sm:w-72 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-zinc-300 transition-colors" />
                <Input
                    placeholder="Filter brands..."
                    className="pl-10 h-10 bg-zinc-900/50 border-zinc-800 focus:bg-zinc-900 focus:ring-1 focus:ring-white/10 transition-all text-sm text-white rounded-xl placeholder:text-zinc-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Grid */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={filteredBrands.map(b => b.id)}
                    strategy={rectSortingStrategy}
                >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredBrands.length > 0 ? (
                            filteredBrands.map((brand) => (
                                <SortableBrandItem key={brand.id} brand={brand}>
                                    <div
                                        onClick={() => onSelectBrand(brand.name)}
                                        className="group relative cursor-pointer h-full"
                                    >
                                        {renderCardContent(brand.name)}
                                    </div>
                                </SortableBrandItem>
                            ))
                        ) : (
                            // Fallback if no brands stored yet (legacy mode or empty)
                            // But usually we should have brands if parent fetches them
                            // If brands are empty but products exist, we might want to show product-derived brands?
                            // For now, assuming brands are synced. If filtered list is empty, display msg.
                            filteredBrands.length === 0 && firebaseBrands && firebaseBrands.length > 0 ? (
                                <div className="col-span-full flex flex-col items-center justify-center py-20 text-zinc-500">
                                    <p>No brands match "{searchQuery}"</p>
                                </div>
                            ) : null
                        )}
                    </div>
                </SortableContext>
            </DndContext>

            {orderedBrands.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <PackageOpen className="w-12 h-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No brands found</p>
                    <p className="text-sm">
                        Start by adding brands in "Brands" manager.
                    </p>
                </div>
            )}
        </div>
    );
}
