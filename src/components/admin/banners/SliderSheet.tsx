"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Upload,
    Image as ImageIcon,
    Loader2,
    Link as LinkIcon,
    ChevronDown,
    Check,
    Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    createHeroSlide,
    updateHeroSlide,
    uploadBannerImage,
    HeroSlide,
    HeroSlideInput
} from "@/lib/firebase/heroSlides";
import { getAllBrands, Brand } from "@/lib/firebase/brands";
import toast from "react-hot-toast";

interface SliderSheetProps {
    isOpen: boolean;
    onClose: (refresh?: boolean) => void;
    slide: HeroSlide | null;
}

export function SliderSheet({ isOpen, onClose, slide }: SliderSheetProps) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<HeroSlideInput>>({
        title: "",
        subtitle: "",
        imageUrl: "",
        ctaPrimary: "Shop Now",
        ctaSecondary: "View All",
        link: "/shop",
        brandId: "",
        brandName: "",
        isActive: true,
        theme: "light",
        badge: "Premium Quality",
    });

    // Load brands
    useEffect(() => {
        const fetchBrands = async () => {
            const data = await getAllBrands();
            setBrands(data);
        };
        fetchBrands();
    }, []);

    // Populate form when editing
    useEffect(() => {
        if (slide) {
            setFormData({
                title: slide.title,
                subtitle: slide.subtitle,
                imageUrl: slide.imageUrl,
                ctaPrimary: slide.ctaPrimary,
                ctaSecondary: slide.ctaSecondary || "",
                link: slide.link,
                brandId: slide.brandId || "",
                brandName: slide.brandName || "",
                isActive: slide.isActive,
                theme: slide.theme,
                badge: slide.badge || "",
            });
        } else {
            // Reset for new slide
            setFormData({
                title: "",
                subtitle: "",
                imageUrl: "",
                ctaPrimary: "Shop Now",
                ctaSecondary: "View All",
                link: "/shop",
                brandId: "",
                brandName: "",
                isActive: true,
                theme: "light",
                badge: "Premium Quality",
            });
        }
    }, [slide, isOpen]);

    // Handle image upload
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be less than 5MB");
            return;
        }

        setUploading(true);
        try {
            const url = await uploadBannerImage(file);
            setFormData(prev => ({ ...prev, imageUrl: url }));
            toast.success("Image uploaded");
        } catch (error) {
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    // Handle brand selection
    const handleBrandSelect = (brand: Brand | null) => {
        if (brand) {
            setFormData(prev => ({
                ...prev,
                brandId: brand.id,
                brandName: brand.name,
                title: brand.name.toUpperCase(),
                link: `/shop?brand=${encodeURIComponent(brand.name.toLowerCase())}`,
                ctaPrimary: `Shop ${brand.name}`,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                brandId: "",
                brandName: "",
            }));
        }
        setBrandDropdownOpen(false);
    };

    // Handle form submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.title?.trim()) {
            toast.error("Title is required");
            return;
        }
        if (!formData.imageUrl) {
            toast.error("Image is required");
            return;
        }
        if (!formData.link?.trim()) {
            toast.error("Link is required");
            return;
        }

        setLoading(true);
        try {
            if (slide) {
                // Update existing
                await updateHeroSlide(slide.id, formData as HeroSlideInput);
                toast.success("Banner updated");
            } else {
                // Create new
                await createHeroSlide(formData as Omit<HeroSlideInput, "order">);
                toast.success("Banner created");
            }
            onClose(true);
        } catch (error: any) {
            toast.error(error.message || "Failed to save banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => onClose()}
                    />

                    {/* Sheet */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed inset-y-0 right-0 w-full max-w-lg bg-zinc-950 border-l border-white/10 z-50 flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/5">
                            <div>
                                <h2 className="text-xl font-bold text-white">
                                    {slide ? "Edit Banner" : "New Banner"}
                                </h2>
                                <p className="text-sm text-zinc-500 mt-1">
                                    {slide ? "Update banner details" : "Create a new homepage banner"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onClose()}
                                className="rounded-full hover:bg-white/10"
                            >
                                <X className="w-5 h-5" />
                            </Button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                            {/* Image Upload */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Banner Image <span className="text-red-400">*</span>
                                </label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className={`relative w-full aspect-[21/9] rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all ${formData.imageUrl
                                            ? "border-transparent"
                                            : "border-zinc-700 hover:border-zinc-600"
                                        }`}
                                >
                                    {formData.imageUrl ? (
                                        <>
                                            <img
                                                src={formData.imageUrl}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    Click to change
                                                </span>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500">
                                            {uploading ? (
                                                <Loader2 className="w-8 h-8 animate-spin" />
                                            ) : (
                                                <>
                                                    <Upload className="w-10 h-10 mb-2" />
                                                    <span className="text-sm">Click to upload image</span>
                                                    <span className="text-xs text-zinc-600 mt-1">Recommended: 1920x820px</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </div>

                            {/* Link to Brand */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Link to Brand (Optional)
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setBrandDropdownOpen(!brandDropdownOpen)}
                                        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-zinc-900 border border-white/10 text-left hover:border-white/20 transition-colors"
                                    >
                                        <span className={formData.brandName ? "text-white" : "text-zinc-500"}>
                                            {formData.brandName || "Select a brand..."}
                                        </span>
                                        <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${brandDropdownOpen ? "rotate-180" : ""}`} />
                                    </button>

                                    <AnimatePresence>
                                        {brandDropdownOpen && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                className="absolute top-full left-0 right-0 mt-2 max-h-60 overflow-y-auto rounded-xl bg-zinc-900 border border-white/10 shadow-xl z-10"
                                            >
                                                {/* No brand option */}
                                                <button
                                                    type="button"
                                                    onClick={() => handleBrandSelect(null)}
                                                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors text-zinc-400"
                                                >
                                                    <div className="w-5 h-5 rounded-full border border-zinc-600 flex items-center justify-center">
                                                        {!formData.brandId && <Check className="w-3 h-3" />}
                                                    </div>
                                                    No brand (custom link)
                                                </button>

                                                {brands.map(brand => (
                                                    <button
                                                        key={brand.id}
                                                        type="button"
                                                        onClick={() => handleBrandSelect(brand)}
                                                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors"
                                                    >
                                                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${formData.brandId === brand.id
                                                                ? "border-indigo-500 bg-indigo-500"
                                                                : "border-zinc-600"
                                                            }`}>
                                                            {formData.brandId === brand.id && (
                                                                <Check className="w-3 h-3 text-white" />
                                                            )}
                                                        </div>
                                                        <span className="text-white">{brand.name}</span>
                                                    </button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                                <p className="text-xs text-zinc-600">
                                    Selecting a brand auto-fills title, link, and button text
                                </p>
                            </div>

                            {/* Title */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="e.g., KRATOS"
                                    className="h-12 bg-zinc-900 border-white/10 text-white text-lg font-bold placeholder:text-zinc-600 rounded-xl"
                                />
                            </div>

                            {/* Subtitle */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Subtitle</label>
                                <textarea
                                    value={formData.subtitle}
                                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                                    placeholder="A short description..."
                                    rows={2}
                                    className="w-full px-4 py-3 bg-zinc-900 border border-white/10 text-white placeholder:text-zinc-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>

                            {/* Link */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">
                                    Link URL <span className="text-red-400">*</span>
                                </label>
                                <div className="relative">
                                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <Input
                                        value={formData.link}
                                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                        placeholder="/shop?brand=kratos"
                                        className="h-12 pl-10 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Primary Button</label>
                                    <Input
                                        value={formData.ctaPrimary}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ctaPrimary: e.target.value }))}
                                        placeholder="Shop Now"
                                        className="h-11 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-zinc-300">Secondary Button</label>
                                    <Input
                                        value={formData.ctaSecondary}
                                        onChange={(e) => setFormData(prev => ({ ...prev, ctaSecondary: e.target.value }))}
                                        placeholder="View All"
                                        className="h-11 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Badge */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Badge Text
                                </label>
                                <Input
                                    value={formData.badge}
                                    onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                                    placeholder="e.g., Premium Quality, New Arrival"
                                    className="h-11 bg-zinc-900 border-white/10 text-white placeholder:text-zinc-600 rounded-xl"
                                />
                            </div>

                            {/* Active Toggle */}
                            <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-900/50 border border-white/5">
                                <div>
                                    <p className="font-medium text-white">Active</p>
                                    <p className="text-sm text-zinc-500">Show on homepage</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                                    className={`relative w-14 h-8 rounded-full transition-colors ${formData.isActive ? "bg-indigo-600" : "bg-zinc-700"
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full shadow"
                                        animate={{ x: formData.isActive ? 24 : 0 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    />
                                </button>
                            </div>
                        </form>

                        {/* Footer */}
                        <div className="p-6 border-t border-white/5 flex gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onClose()}
                                className="flex-1 h-12 rounded-xl border-zinc-700 hover:bg-zinc-800 text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="flex-1 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : slide ? (
                                    "Update Banner"
                                ) : (
                                    "Create Banner"
                                )}
                            </Button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
