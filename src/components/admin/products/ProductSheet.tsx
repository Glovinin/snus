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
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ZoomIn,
    ZoomOut,
    Wand2
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import {
    createProduct,
    updateProduct,
    uploadProductImages,
    Product,
    ProductInput
} from "@/lib/firebase/products";
import { uploadImageFromUrl, deleteFileFromUrl } from "@/lib/firebase/storage";
import { getAllBrands, Brand } from "@/lib/firebase/brands";
import {
    compressMultipleImages,
    isValidImageFile,
    createImagePreview,
    revokeImagePreview,
    generateBlurDataUrl
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
    blurData?: string;
}

interface ProductSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    product?: Product | null;
    onSuccess?: () => void;
    initialBrand?: string;
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

export function ProductSheet({ open, onOpenChange, product, onSuccess, initialBrand }: ProductSheetProps) {
    const isEditing = !!product;
    const [images, setImages] = useState<ImageItem[]>([]);
    const [isUploading, setIsUploading] = useState(false);
    const [isGeneratingCover, setIsGeneratingCover] = useState(false);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            price: "",
            compareAtPrice: "",
            sku: "",
            category: "Nicotine Pouches",
            brand: initialBrand || "",
            strength: "MEDIUM",
            flavor: "",
            stock: "0",
            description: "",
            status: "active",
            isBestSeller: false,
            isWeeklySpecial: false,
            isFeatured: false,
        },
    });

    // Reset form when product changes or when opening for new product with initialBrand
    useEffect(() => {
        if (open) {
            if (product) {
                reset({
                    name: product.name,
                    price: product.price.toString(),
                    compareAtPrice: product.compareAtPrice?.toString() || "",
                    sku: product.sku,
                    category: product.category,
                    brand: product.brand,
                    strength: product.strength,
                    flavor: product.flavor,
                    stock: product.stock.toString(),
                    description: product.description || "",
                    status: product.isActive ? "active" : "draft",
                    isBestSeller: product.isBestSeller,
                    isWeeklySpecial: product.isWeeklySpecial,
                    isFeatured: product.isFeatured,
                });

                // Set images matches existing logic...
                if (product.images) {
                    setImages(
                        (product.images || []).map((url, i) => ({
                            id: `existing-${i}`,
                            url,
                            isNew: false,
                            blurData: product.imagesBlurData?.[i],
                        }))
                    );
                } else {
                    setImages([]);
                }
            } else {
                // Reset for new product
                reset({
                    name: "",
                    price: "",
                    compareAtPrice: "",
                    sku: "",
                    category: "Nicotine Pouches",
                    brand: initialBrand || "",
                    strength: "MEDIUM",
                    flavor: "",
                    stock: "0",
                    description: "",
                    status: "active",
                    isBestSeller: false,
                    isWeeklySpecial: false,
                    isFeatured: false,
                });
                setImages([]);
            }
        }
    }, [product, open, reset, initialBrand]);

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

    // Keyboard navigation for lightbox
    useEffect(() => {
        if (lightboxIndex === null) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'Escape':
                    setLightboxIndex(null);
                    setIsZoomed(false);
                    break;
                case 'ArrowLeft':
                    setLightboxIndex((prev) =>
                        prev !== null && prev > 0 ? prev - 1 : prev
                    );
                    setIsZoomed(false);
                    break;
                case 'ArrowRight':
                    setLightboxIndex((prev) =>
                        prev !== null && prev < images.length - 1 ? prev + 1 : prev
                    );
                    setIsZoomed(false);
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [lightboxIndex, images.length]);

    // Lightbox handlers
    const openLightbox = useCallback((index: number) => {
        setLightboxIndex(index);
        setIsZoomed(false);
    }, []);

    const closeLightbox = useCallback(() => {
        setLightboxIndex(null);
        setIsZoomed(false);
    }, []);

    const goToPrevImage = useCallback(() => {
        setLightboxIndex((prev) =>
            prev !== null && prev > 0 ? prev - 1 : prev
        );
        setIsZoomed(false);
    }, []);

    const goToNextImage = useCallback(() => {
        setLightboxIndex((prev) =>
            prev !== null && prev < images.length - 1 ? prev + 1 : prev
        );
        setIsZoomed(false);
    }, [images.length]);

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

            const newImages: ImageItem[] = await Promise.all(compressedFiles.map(async (file, i) => {
                const blurData = await generateBlurDataUrl(file);
                return {
                    id: `new-${Date.now()}-${i}`,
                    file,
                    url: createImagePreview(file),
                    isNew: true,
                    blurData
                };
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

    // Generate AI Cover
    const handleGenerateCover = async () => {
        if (images.length === 0) {
            toast.error("Please add at least one product image first");
            return;
        }

        const formData = watch();
        let sourceImage = images[images.length - 1]; // Use the last (original) image
        let imageUrlForApi = sourceImage.url;

        setIsGeneratingCover(true);
        try {
            // Check if the URL is internal (starts with /) - needs to be uploaded to Firebase first
            const isInternalUrl = sourceImage.url.startsWith('/') && !sourceImage.isNew;

            if (isInternalUrl) {
                toast.loading("Uploading image to cloud...", { id: "upload-progress" });

                // Generate slug from brand and product name for organized folder structure
                const brandSlug = formData.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                const productSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
                const storagePath = `products/${brandSlug}/${productSlug}/original_${Date.now()}.jpg`;

                // Upload the internal image to Firebase Storage (with compression)
                const firebaseUrl = await uploadImageFromUrl(sourceImage.url, storagePath);
                imageUrlForApi = firebaseUrl;

                // Update the image in state to use the new Firebase URL
                setImages(prev => prev.map(img =>
                    img.id === sourceImage.id
                        ? { ...img, url: firebaseUrl, isNew: false }
                        : img
                ));

                toast.dismiss("upload-progress");
                toast.success("Image uploaded to cloud");
            }

            toast.loading("Generating AI cover...", { id: "generate-progress" });

            const response = await fetch("/api/generate-cover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    imageUrl: imageUrlForApi,
                    productName: formData.name,
                    flavor: formData.flavor,
                    strength: formData.strength,
                    brand: formData.brand,
                }),
            });

            const data = await response.json();
            toast.dismiss("generate-progress");

            if (!response.ok) {
                throw new Error(data.error || "Failed to generate cover");
            }

            if (data.success && data.image) {
                // Convert base64 to blob and create File
                const byteCharacters = atob(data.image.data);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: data.image.mimeType });
                const file = new File([blob], `cover-${Date.now()}.png`, { type: data.image.mimeType });
                const coverUrl = URL.createObjectURL(blob);

                // Add cover as first image (without compression to preserve quality)
                const newCoverImage: ImageItem = {
                    id: `cover-${Date.now()}`,
                    file,
                    url: coverUrl,
                    isNew: true,
                };

                setImages((prev) => [newCoverImage, ...prev]);
                toast.success("Cover generated successfully!");
            }
        } catch (error: any) {
            toast.dismiss("upload-progress");
            toast.dismiss("generate-progress");
            console.error("Cover generation error:", error);
            toast.error(error.message || "Failed to generate cover");
        } finally {
            setIsGeneratingCover(false);
        }
    };

    // Form submission
    const onSubmit = async (data: ProductFormValues) => {
        try {
            // Prepare product data
            const productData: ProductInput = {
                name: data.name,
                description: data.description || "",
                price: parseFloat(data.price),
                compareAtPrice: data.compareAtPrice ? parseFloat(data.compareAtPrice) : null,
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
                imagesBlurData: [], // Will be populated below
            };

            let productId = product?.id;

            // Create or update product first to get ID
            if (isEditing && productId) {
                // Check for removed images to delete from Storage
                if (product?.images) {
                    const currentImageUrls = images.map(img => img.url);
                    const removedImages = product.images.filter(url => !currentImageUrls.includes(url));

                    if (removedImages.length > 0) {
                        // Delete removed images from Firebase Storage
                        // We do this in the background to not block the UI
                        Promise.all(removedImages.map(url => deleteFileFromUrl(url)))
                            .then(() => console.log("Cleaned up removed images"))
                            .catch(err => console.error("Failed to clean up images", err));
                    }
                }

                // Keep existing images that weren't removed
                const existingUrls = images.filter((img) => !img.isNew).map((img) => img.url);
                productData.images = existingUrls;

                await updateProduct(productId, productData);
            } else {
                productId = await createProduct(productData);
            }

            // Upload new images with organized folder structure (brand/product)
            const newImageFiles = images.filter((img) => img.isNew && img.file).map((img) => img.file!);
            if (newImageFiles.length > 0 && productId) {
                const uploadedUrls = await uploadProductImages(newImageFiles, {
                    brand: data.brand,
                    productName: data.name,
                });

                // Merge with existing and update
                const allImageUrls = [
                    ...images.filter((img) => !img.isNew).map((img) => img.url),
                    ...uploadedUrls,
                ];

                // Merge blur data
                const allBlurData = [
                    ...images.filter((img) => !img.isNew).map((img) => img.blurData || ""),
                    ...images.filter((img) => img.isNew).map((img) => img.blurData || ""),
                ];

                // Reorder to match current order
                const orderedUrls = images.map((img) => {
                    if (img.isNew) {
                        const idx = images.filter((i) => i.isNew).indexOf(img);
                        return uploadedUrls[idx];
                    }
                    return img.url;
                });

                const orderedBlurData = images.map((img) => {
                    return img.blurData || "";
                });

                await updateProduct(productId, { images: orderedUrls, imagesBlurData: orderedBlurData });
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
        <>
            {/* ============================================ */}
            {/* FULLSCREEN IMAGE LIGHTBOX */}
            {/* ============================================ */}
            {lightboxIndex !== null && images[lightboxIndex] && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center"
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image viewer"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-in fade-in duration-300"
                        onClick={closeLightbox}
                    />

                    {/* Close button */}
                    <button
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
                        aria-label="Close image viewer"
                    >
                        <X className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                        <span className="text-white font-medium">
                            {lightboxIndex + 1} / {images.length}
                        </span>
                    </div>

                    {/* Navigation arrows */}
                    {lightboxIndex > 0 && (
                        <button
                            onClick={goToPrevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
                            aria-label="Previous image"
                        >
                            <ChevronLeft className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    )}
                    {lightboxIndex < images.length - 1 && (
                        <button
                            onClick={goToNextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/10 transition-all duration-200 group"
                            aria-label="Next image"
                        >
                            <ChevronRight className="w-8 h-8 text-white group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Main image container */}
                    <div
                        className="relative z-10 max-w-[90vw] max-h-[85vh] animate-in zoom-in-95 fade-in duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[lightboxIndex].url}
                            alt={`Product image ${lightboxIndex + 1}`}
                            className={`
                                max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl
                                transition-transform duration-300 ease-out
                                ${isZoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'}
                            `}
                            onClick={() => setIsZoomed(!isZoomed)}
                            draggable={false}
                        />

                        {/* Image label */}
                        {lightboxIndex === 0 && (
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-lg">
                                COVER IMAGE
                            </div>
                        )}
                    </div>

                    {/* Bottom controls */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex items-center gap-4">
                        {/* Zoom toggle */}
                        <button
                            onClick={() => setIsZoomed(!isZoomed)}
                            className={`
                                p-3 rounded-full backdrop-blur-sm border transition-all duration-200
                                ${isZoomed
                                    ? 'bg-indigo-500/30 border-indigo-500/50 text-indigo-300'
                                    : 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                }
                            `}
                            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
                        >
                            {isZoomed ? <ZoomOut className="w-5 h-5" /> : <ZoomIn className="w-5 h-5" />}
                        </button>

                        {/* Image dots */}
                        {images.length > 1 && (
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
                                {images.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setLightboxIndex(idx);
                                            setIsZoomed(false);
                                        }}
                                        className={`
                                            w-2.5 h-2.5 rounded-full transition-all duration-200
                                            ${idx === lightboxIndex
                                                ? 'bg-white scale-125'
                                                : 'bg-white/40 hover:bg-white/60'
                                            }
                                        `}
                                        aria-label={`Go to image ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Keyboard hint */}
                    <div className="absolute bottom-6 right-6 z-10 text-white/40 text-xs hidden sm:block">
                        <span className="px-2 py-1 bg-white/10 rounded mr-2">←</span>
                        <span className="px-2 py-1 bg-white/10 rounded mr-2">→</span>
                        <span className="mr-4">Navigate</span>
                        <span className="px-2 py-1 bg-white/10 rounded mr-2">ESC</span>
                        <span>Close</span>
                    </div>
                </div>
            )}

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
                                            group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing
                                            ${index === 0 ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-zinc-800 hover:border-zinc-600"}
                                            ${draggedIndex === index ? "opacity-50 scale-95" : ""}
                                        `}
                                        >
                                            {/* Clickable image area */}
                                            <button
                                                type="button"
                                                onClick={() => openLightbox(index)}
                                                className="w-full h-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-zinc-900 rounded-lg"
                                            >
                                                <img
                                                    src={img.url}
                                                    alt={`Product ${index + 1}`}
                                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                />
                                                {/* Hover overlay */}
                                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                                                </div>
                                            </button>

                                            {/* Cover badge */}
                                            {index === 0 && (
                                                <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-indigo-500 text-white text-[10px] font-bold rounded pointer-events-none">
                                                    COVER
                                                </div>
                                            )}

                                            {/* Drag handle */}
                                            <div className="absolute top-1 right-7 p-1 bg-black/50 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <GripVertical className="w-3 h-3 text-white" />
                                            </div>

                                            {/* Remove button */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeImage(img.id);
                                                }}
                                                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 rounded-full transition-colors z-10"
                                            >
                                                <X className="w-3 h-3 text-white" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Generate Cover Button */}
                            {images.length > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleGenerateCover}
                                    disabled={isGeneratingCover || isUploading}
                                    className="w-full h-12 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-500/30 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20 hover:border-indigo-500/50 rounded-xl transition-all"
                                >
                                    {isGeneratingCover ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Generating Cover...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="w-4 h-4 mr-2" />
                                            Generate AI Cover
                                        </>
                                    )}
                                </Button>
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
        </>
    );
}
