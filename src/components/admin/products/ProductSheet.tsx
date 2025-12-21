"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Image as ImageIcon,
    X,
    GripVertical,
    Star,
    Flame,
    Sparkles,
    Upload,
    Loader2,
    ChevronDown
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
    createProduct,
    updateProduct,
    uploadProductImages,
    Product,
    ProductInput
} from "@/lib/firebase/products";
import { getAllBrands, Brand } from "@/lib/firebase/brands";
import {
    compressMultipleImages,
    isValidImageFile,
    createImagePreview,
    revokeImagePreview
} from "@/lib/imageUtils";
import toast from "react-hot-toast";

// ============================================
// SCHEMA
// ============================================

const productSchema = z.object({
    name: z.string().min(2, "Product name is required"),
    price: z.string().min(1, "Price is required"),
    compareAtPrice: z.string().optional(),
    sku: z.string().min(3, "SKU is required"),
    category: z.string().min(1, "Category is required"),
    brand: z.string().min(1, "Brand is required"),
    strength: z.enum(["WEAK", "MEDIUM", "STRONG", "EXTRA", "EXTREME"]),
    flavor: z.string().min(1, "Flavor is required"),
    stock: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, "Stock must be 0 or greater"),
    description: z.string().optional(),
    status: z.enum(["active", "draft", "archived"]).default("active"),
    isBestSeller: z.boolean().default(false),
    isWeeklySpecial: z.boolean().default(false),
    isFeatured: z.boolean().default(false),
});

type ProductFormValues = z.infer<typeof productSchema>;

// ============================================
// TYPES
// ============================================

interface ImageItem {
    id: string;
    file?: File;
    url: string;
    isNew: boolean;
}

interface ProductSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onSuccess?: () => void;
}

// ============================================
// CONSTANTS
// ============================================

const STRENGTH_OPTIONS = ["WEAK", "MEDIUM", "STRONG", "EXTRA", "EXTREME"] as const;

const CATEGORY_OPTIONS = [
    "Nicotine Pouches",
    "Snus",
    "Chewing Bags",
    "All White",
];

// ============================================
// COMPONENT
// ============================================

export function ProductSheet({ open, onOpenChange, product, onSuccess }: ProductSheetProps) {
    const isEditing = !!product;
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [brands, setBrands] = useState<Brand[]>([]);

    const defaultValues: ProductFormValues = {
        name: "",
        price: "",
        compareAtPrice: "",
        sku: "",
        category: "",
        brand: "",
        strength: "MEDIUM",
        flavor: "",
        stock: "0",
        description: "",
        status: "active",
        isBestSeller: false,
        isWeeklySpecial: false,
        isFeatured: false,
    };

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues,
    });

    // Reset form when product changes
    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.name,
                    price: String(product.price),
                    compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
                    sku: product.sku,
                    category: product.category,
                    brand: product.brand,
                    strength: product.strength,
                    flavor: product.flavor,
                    stock: String(product.stock),
                    description: product.description || "",
                    status: product.isActive ? "active" : "draft",
                    isBestSeller: product.isBestSeller || false,
                    isWeeklySpecial: product.isWeeklySpecial || false,
                    isFeatured: product.isFeatured || false,
                });
                // Load existing images
                setImages(
                    (product.images || []).map((url, i) => ({
                        id: `existing-${i}`,
                        url,
                        isNew: false,
                    }))
                );
            } else {
                reset(defaultValues);
                setImages([]);
            }
        }
    }, [open, product, reset]);

    // Fetch brands
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getAllBrands();
            setBrands(data);
        };
        if (open) {
            fetchBrands();
        }
    }, [open]);

    // Cleanup image previews on unmount
    useEffect(() => {
        return () => {
            images.forEach((img) => {
                if (img.isNew) {
                    revokeImagePreview(img.url);
                }
            });
        };
    }, []);

    // Handle file selection
    const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;

        // Filter valid images
        const validFiles = files.filter(isValidImageFile);
        if (validFiles.length === 0) {
            toast.error("Please select valid image files (JPEG, PNG, WebP)");
            return;
        }

        // Compress images
        setIsUploading(true);
        try {
            const compressedFiles = await compressMultipleImages(validFiles);

            const newImages: ImageItem[] = compressedFiles.map((file, i) => ({
                id: `new-${Date.now()}-${i}`,
                file,
                url: createImagePreview(file),
                isNew: true,
            }));

            setImages((prev) => [...prev, ...newImages]);
            toast.success(`${compressedFiles.length} image(s) added`);
        } catch (error) {
            toast.error("Failed to process images");
        } finally {
            setIsUploading(false);
        }

        // Reset input
        e.target.value = "";
    }, []);

    // Remove image
    const removeImage = useCallback((id: string) => {
        setImages((prev) => {
            const img = prev.find((i) => i.id === id);
            if (img?.isNew) {
                revokeImagePreview(img.url);
            }
            return prev.filter((i) => i.id !== id);
        });
    }, []);

    // Drag and drop reorder
    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        setImages((prev) => {
            const newImages = [...prev];
            const [draggedItem] = newImages.splice(draggedIndex, 1);
            newImages.splice(index, 0, draggedItem);
            return newImages;
        });
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    // Form submission
    const onSubmit = async (data: ProductFormValues) => {
        try {
            // Prepare product data
            const productData: ProductInput = {
                name: data.name,
                description: data.description || "",
                price: parseFloat(data.price),
                compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : undefined,
                sku: data.sku,
                category: data.category,
                brand: data.brand,
                strength: data.strength,
                flavor: data.flavor,
                stock: parseInt(data.stock),
                images: [], // Will be populated after upload
                isActive: data.status === "active",
                isFeatured: data.isFeatured,
                isBestSeller: data.isBestSeller,
                isWeeklySpecial: data.isWeeklySpecial,
            };

            let productId = product?.id;

            // Create or update product first to get ID
            if (isEditing && productId) {
                // Keep existing images that weren't removed
                const existingUrls = images.filter((img) => !img.isNew).map((img) => img.url);
                productData.images = existingUrls;

                await updateProduct(productId, productData);
            } else {
                productId = await createProduct(productData);
            }

            // Upload new images
            const newImageFiles = images.filter((img) => img.isNew && img.file).map((img) => img.file!);
            if (newImageFiles.length > 0 && productId) {
                const uploadedUrls = await uploadProductImages(productId, newImageFiles);

                // Merge with existing and update
                const allImageUrls = [
                    ...images.filter((img) => !img.isNew).map((img) => img.url),
                    ...uploadedUrls,
                ];

                // Reorder to match current order
                const orderedUrls = images.map((img) => {
                    if (img.isNew) {
                        const idx = images.filter((i) => i.isNew).indexOf(img);
                        return uploadedUrls[idx];
                    }
                    return img.url;
                });

                await updateProduct(productId, { images: orderedUrls });
            }

            toast.success(isEditing ? "Product updated!" : "Product created!");
            onOpenChange(false);
            onSuccess?.();
        } catch (error: any) {
            toast.error(error.message || "Failed to save product");
        }
    };

    const currentStatus = watch("status");
    const isBestSeller = watch("isBestSeller");
    const isWeeklySpecial = watch("isWeeklySpecial");
    const isFeatured = watch("isFeatured");

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                title={isEditing ? "Edit Product" : "Add Product"}
                className="w-full sm:max-w-2xl overflow-y-auto"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">
                                Product Images
                            </h3>
                            <span className="text-xs text-zinc-500">
                                {images.length} image{images.length !== 1 ? "s" : ""} • First is cover
                            </span>
                        </div>

                        {/* Image Grid */}
                        {images.length > 0 && (
                            <div className="grid grid-cols-4 gap-3">
                                {images.map((img, index) => (
                                    <div
                                        key={img.id}
                                        draggable
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`
                                            relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing
                                            ${index === 0 ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-800"}
                                            ${draggedIndex === index ? "opacity-50 scale-95" : ""}
                                        `}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Product ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Cover badge */}
                                        {index === 0 && (
                                            <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded">
                                                COVER
                                            </div>
                                        )}

                                        {/* Drag handle */}
                                        <div className="absolute top-1 right-7 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                            <GripVertical className="w-3 h-3 text-white" />
                                        </div>

                                        {/* Remove button */}
                                        <button
                                            type="button"
                                            onClick={() => removeImage(img.id)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors"
                                        >
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Upload Area */}
                        <label className="group relative flex flex-col items-center justify-center w-full h-32 rounded-xl bg-zinc-900/50 border-2 border-dashed border-zinc-800 cursor-pointer transition-all hover:border-zinc-600 hover:bg-zinc-900">
                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                multiple
                                onChange={handleFileSelect}
                                className="hidden"
                                disabled={isUploading}
                            />
                            {isUploading ? (
                                <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                            ) : (
                                <>
                                    <Upload className="w-8 h-8 text-zinc-500 group-hover:text-zinc-300 transition-colors mb-2" />
                                    <span className="text-sm text-zinc-500 group-hover:text-zinc-300">
                                        Click or drag images here
                                    </span>
                                    <span className="text-xs text-zinc-600 mt-1">
                                        JPEG, PNG, WebP • Auto-compressed
                                    </span>
                                </>
                            )}
                        </label>
                    </div>

                    {/* Basic Info Section */}
                    <div className="space-y-5">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Basic Information</h3>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200 pl-1">Product Name</label>
                                <Input
                                    {...register("name")}
                                    placeholder="e.g. Siberia Red -80 Degrees"
                                    className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                                />
                                {errors.name && <p className="text-red-400 text-xs pl-1">{errors.name.message}</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-200 pl-1">Brand</label>
                                    <div className="relative">
                                        <select
                                            {...register("brand")}
                                            className="w-full h-12 bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-4 pr-10 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        >
                                            <option value="" className="bg-zinc-900 text-zinc-400">Select brand</option>
                                            {brands.map((brand) => (
                                                <option key={brand.id} value={brand.name} className="bg-zinc-900 text-white py-2">{brand.name}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    </div>
                                    {brands.length === 0 && (
                                        <p className="text-amber-400 text-xs pl-1">No brands yet. Create one in "Manage Brands"</p>
                                    )}
                                    {errors.brand && <p className="text-red-400 text-xs pl-1">{errors.brand.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-200 pl-1">Category</label>
                                    <div className="relative">
                                        <select
                                            {...register("category")}
                                            className="w-full h-12 bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-4 pr-10 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        >
                                            <option value="" className="bg-zinc-900 text-zinc-400">Select category</option>
                                            {CATEGORY_OPTIONS.map((cat) => (
                                                <option key={cat} value={cat} className="bg-zinc-900 text-white py-2">{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    </div>
                                    {errors.category && <p className="text-red-400 text-xs pl-1">{errors.category.message}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-200 pl-1">Strength</label>
                                    <div className="relative">
                                        <select
                                            {...register("strength")}
                                            className="w-full h-12 bg-zinc-900 border border-zinc-800 text-white rounded-xl pl-4 pr-10 appearance-none cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-zinc-700 hover:bg-zinc-800/50"
                                        >
                                            {STRENGTH_OPTIONS.map((str) => (
                                                <option key={str} value={str} className="bg-zinc-900 text-white py-2">{str}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-200 pl-1">Flavor</label>
                                    <Input
                                        {...register("flavor")}
                                        placeholder="e.g. Spearmint"
                                        className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                                    />
                                    {errors.flavor && <p className="text-red-400 text-xs pl-1">{errors.flavor.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200 pl-1">Description</label>
                                <textarea
                                    {...register("description")}
                                    placeholder="Product description..."
                                    rows={3}
                                    className="w-full bg-zinc-900 border border-zinc-800 text-white placeholder:text-zinc-600 rounded-xl px-4 py-3 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="space-y-5 pt-6 border-t border-white/5">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Pricing & Inventory</h3>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200 pl-1">Price (€)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                                    <Input
                                        {...register("price")}
                                        type="number"
                                        step="0.01"
                                        className="h-12 pl-8 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                                        placeholder="0.00"
                                    />
                                </div>
                                {errors.price && <p className="text-red-400 text-xs pl-1">{errors.price.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200 pl-1">Compare Price</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">€</span>
                                    <Input
                                        {...register("compareAtPrice")}
                                        type="number"
                                        step="0.01"
                                        className="h-12 pl-8 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                                        placeholder="0.00"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-200 pl-1">Stock</label>
                                <Input
                                    {...register("stock")}
                                    type="number"
                                    className="h-12 bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                                    placeholder="0"
                                />
                                {errors.stock && <p className="text-red-400 text-xs pl-1">{errors.stock.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-200 pl-1">SKU</label>
                            <Input
                                {...register("sku")}
                                placeholder="SIB-RED-001"
                                className="h-12 font-mono text-sm bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-600 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500 rounded-xl"
                            />
                            {errors.sku && <p className="text-red-400 text-xs pl-1">{errors.sku.message}</p>}
                        </div>
                    </div>

                    {/* Status & Visibility Section */}
                    <div className="space-y-5 pt-6 border-t border-white/5">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Status & Visibility</h3>

                        {/* Status Buttons */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-zinc-200 pl-1">Status</label>
                            <div className="grid grid-cols-3 gap-3">
                                {(["active", "draft", "archived"] as const).map((status) => (
                                    <button
                                        key={status}
                                        type="button"
                                        onClick={() => setValue("status", status)}
                                        className={`
                                            relative flex items-center justify-center h-12 rounded-xl text-sm font-medium transition-all duration-200
                                            ${currentStatus === status
                                                ? "bg-white text-black shadow-lg shadow-white/5 ring-1 ring-white"
                                                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 hover:text-zinc-200"}
                                        `}
                                    >
                                        <span className="capitalize">{status}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Feature Toggles */}
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                type="button"
                                onClick={() => setValue("isFeatured", !isFeatured)}
                                className={`
                                    flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-all
                                    ${isFeatured
                                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/50"
                                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"}
                                `}
                            >
                                <Star className={`w-4 h-4 ${isFeatured ? "fill-amber-400" : ""}`} />
                                Featured
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("isBestSeller", !isBestSeller)}
                                className={`
                                    flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-all
                                    ${isBestSeller
                                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/50"
                                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"}
                                `}
                            >
                                <Flame className={`w-4 h-4 ${isBestSeller ? "fill-rose-400" : ""}`} />
                                Best Seller
                            </button>
                            <button
                                type="button"
                                onClick={() => setValue("isWeeklySpecial", !isWeeklySpecial)}
                                className={`
                                    flex items-center justify-center gap-2 h-12 rounded-xl text-sm font-medium transition-all
                                    ${isWeeklySpecial
                                        ? "bg-purple-500/20 text-purple-400 border border-purple-500/50"
                                        : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"}
                                `}
                            >
                                <Sparkles className={`w-4 h-4 ${isWeeklySpecial ? "fill-purple-400" : ""}`} />
                                Weekly Special
                            </button>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-8 flex gap-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1 h-12 bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-zinc-700 rounded-xl transition-all"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting || isUploading}
                            className="flex-1 h-12 bg-white text-black hover:bg-zinc-200 font-semibold rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                isEditing ? "Save Changes" : "Create Product"
                            )}
                        </Button>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    );
}
