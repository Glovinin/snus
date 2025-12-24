"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Plus,
    GripVertical,
    Pencil,
    Trash2,
    Eye,
    EyeOff,
    Image as ImageIcon,
    Loader2,
    Link as LinkIcon,
    ExternalLink,
    AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/PageHeader";
import {
    getAllHeroSlides,
    deleteHeroSlide,
    updateHeroSlideOrders,
    toggleHeroSlideActive,
    HeroSlide
} from "@/lib/firebase/heroSlides";
import { SliderSheet } from "@/components/admin/banners/SliderSheet";
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
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Slide Item
function SortableSlideItem({
    slide,
    onEdit,
    onDelete,
    onToggle,
    isDeleting
}: {
    slide: HeroSlide;
    onEdit: () => void;
    onDelete: () => void;
    onToggle: () => void;
    isDeleting: boolean;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: slide.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="group">
            <div className={`relative flex items-center gap-4 p-4 rounded-2xl border transition-all duration-200 ${slide.isActive
                ? "bg-zinc-900/50 border-white/10 hover:border-white/20"
                : "bg-zinc-900/30 border-white/5 opacity-60"
                }`}>
                {/* Drag Handle */}
                <div
                    {...attributes}
                    {...listeners}
                    className="flex-shrink-0 cursor-grab active:cursor-grabbing p-2 -m-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                    <GripVertical className="w-5 h-5 text-zinc-600" />
                </div>

                {/* Thumbnail */}
                <div className="relative w-32 h-20 rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    {slide.imageUrl ? (
                        <img
                            src={slide.imageUrl}
                            alt={slide.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-600">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                    )}
                    {!slide.isActive && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <EyeOff className="w-5 h-5 text-white/70" />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white truncate">{slide.title}</h3>
                        {slide.brandName && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                {slide.brandName}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-zinc-500 line-clamp-1">{slide.subtitle}</p>
                    <div className="flex items-center gap-3 mt-2">
                        <span className="flex items-center gap-1 text-xs text-zinc-600">
                            <LinkIcon className="w-3 h-3" />
                            {slide.link}
                        </span>
                        {slide.badge && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">
                                {slide.badge}
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggle}
                        className={`w-9 h-9 rounded-lg transition-colors ${slide.isActive
                            ? "text-green-400 hover:bg-green-500/10"
                            : "text-zinc-500 hover:bg-white/5"
                            }`}
                    >
                        {slide.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onEdit}
                        className="w-9 h-9 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5"
                    >
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onDelete}
                        disabled={isDeleting}
                        className="w-9 h-9 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                    >
                        {isDeleting ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Trash2 className="w-4 h-4" />
                        )}
                    </Button>
                    <a
                        href={slide.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        <ExternalLink className="w-4 h-4" />
                    </a>
                </div>
            </div>
        </div>
    );
}

export default function BannersPage() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [confirmDelete, setConfirmDelete] = useState<HeroSlide | null>(null);

    // Sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 8 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Fetch slides
    const fetchSlides = async () => {
        setLoading(true);
        try {
            const data = await getAllHeroSlides();
            setSlides(data);
        } catch (error) {
            toast.error("Failed to load banners");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSlides();
    }, []);

    // Handle drag end
    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = slides.findIndex((s) => s.id === active.id);
            const newIndex = slides.findIndex((s) => s.id === over.id);
            const newSlides = arrayMove(slides, oldIndex, newIndex);

            setSlides(newSlides);

            // Update orders in Firebase
            try {
                const updates = newSlides.map((slide, index) => ({
                    id: slide.id,
                    order: index
                }));
                await updateHeroSlideOrders(updates);
            } catch (error) {
                toast.error("Failed to save order");
                fetchSlides(); // Revert on error
            }
        }
    };

    // Handle delete
    const handleDelete = async () => {
        if (!confirmDelete) return;

        setDeletingId(confirmDelete.id);
        setConfirmDelete(null);

        try {
            await deleteHeroSlide(confirmDelete.id);
            setSlides(slides.filter(s => s.id !== confirmDelete.id));
            toast.success("Banner deleted");
        } catch (error) {
            toast.error("Failed to delete banner");
        } finally {
            setDeletingId(null);
        }
    };

    // Handle toggle active
    const handleToggle = async (slide: HeroSlide) => {
        try {
            await toggleHeroSlideActive(slide.id);
            setSlides(slides.map(s =>
                s.id === slide.id ? { ...s, isActive: !s.isActive } : s
            ));
            toast.success(slide.isActive ? "Banner hidden" : "Banner visible");
        } catch (error) {
            toast.error("Failed to update banner");
        }
    };

    // Handle edit
    const handleEdit = (slide: HeroSlide) => {
        setEditingSlide(slide);
        setIsSheetOpen(true);
    };

    // Handle create new
    const handleCreate = () => {
        setEditingSlide(null);
        setIsSheetOpen(true);
    };

    // On sheet close
    const handleSheetClose = (refresh?: boolean) => {
        setIsSheetOpen(false);
        setEditingSlide(null);
        if (refresh) {
            fetchSlides();
        }
    };

    return (
        <div className="space-y-6">
            {/* Confirmation Dialog */}
            <AnimatePresence>
                {confirmDelete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4"
                        >
                            <div className="flex items-center gap-3 text-red-400">
                                <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
                                    <AlertTriangle className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold">Delete "{confirmDelete.title}"?</h3>
                            </div>

                            <p className="text-zinc-400 text-sm">
                                This will permanently delete this banner from the homepage. This action cannot be undone.
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
                                    onClick={handleDelete}
                                >
                                    Yes, Delete
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between">
                <PageHeader
                    title="Hero Banners"
                    description="Manage homepage slider banners and promotions."
                />
                <Button
                    onClick={handleCreate}
                    className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                </Button>
            </div>

            {/* Info Card */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm">
                <p>
                    <strong>Tip:</strong> Drag and drop to reorder banners. Only active banners will be displayed on the homepage.
                    Link banners to existing brands for quick product navigation.
                </p>
            </div>

            {/* Slides List */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-zinc-500 animate-spin" />
                </div>
            ) : slides.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                    <ImageIcon className="w-16 h-16 mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">No banners yet</p>
                    <p className="text-sm text-zinc-600 mb-6">Create your first homepage banner</p>
                    <Button
                        onClick={handleCreate}
                        className="rounded-xl bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Banner
                    </Button>
                </div>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={slides.map(s => s.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-3">
                            {slides.map((slide) => (
                                <SortableSlideItem
                                    key={slide.id}
                                    slide={slide}
                                    onEdit={() => handleEdit(slide)}
                                    onDelete={() => setConfirmDelete(slide)}
                                    onToggle={() => handleToggle(slide)}
                                    isDeleting={deletingId === slide.id}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Slider Sheet */}
            <SliderSheet
                isOpen={isSheetOpen}
                onClose={handleSheetClose}
                slide={editingSlide}
            />
        </div>
    );
}
