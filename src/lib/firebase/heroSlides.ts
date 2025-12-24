import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
} from "firebase/storage";
import { storage } from "./config";

// ============================================
// TYPES
// ============================================

export interface HeroSlideInput {
    title: string;
    subtitle: string;
    imageUrl: string;
    ctaPrimary: string;
    ctaSecondary?: string;
    link: string;
    brandId?: string; // Optional link to brand
    brandName?: string; // Store brand name for display
    order: number;
    isActive: boolean;
    theme: "light" | "dark";
    badge?: string; // e.g., "Premium Quality", "New Arrival"
}

export interface HeroSlide extends HeroSlideInput {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

// ============================================
// CRUD OPERATIONS
// ============================================

/**
 * Create a new hero slide
 */
export async function createHeroSlide(input: Omit<HeroSlideInput, "order">): Promise<string> {
    try {
        // Get current max order
        const slides = await getAllHeroSlides();
        const maxOrder = slides.length > 0
            ? Math.max(...slides.map(s => s.order))
            : -1;

        const newDocRef = doc(collection(db, "heroSlides"));

        const slideData: Omit<HeroSlide, "id"> = {
            ...input,
            order: maxOrder + 1,
            createdAt: serverTimestamp() as Timestamp,
            updatedAt: serverTimestamp() as Timestamp,
        };

        await setDoc(newDocRef, slideData);
        return newDocRef.id;
    } catch (error: any) {
        console.error("Error creating hero slide:", error);
        throw new Error(error.message || "Failed to create hero slide");
    }
}

/**
 * Get all hero slides ordered by order field
 */
export async function getAllHeroSlides(): Promise<HeroSlide[]> {
    try {
        const querySnapshot = await getDocs(collection(db, "heroSlides"));
        const slides = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as HeroSlide[];

        // Sort by order field
        return slides.sort((a, b) => a.order - b.order);
    } catch (error) {
        console.error("Error getting hero slides:", error);
        return [];
    }
}

/**
 * Get only active hero slides (for frontend display)
 */
export async function getActiveHeroSlides(): Promise<HeroSlide[]> {
    try {
        const slides = await getAllHeroSlides();
        return slides.filter(slide => slide.isActive);
    } catch (error) {
        console.error("Error getting active hero slides:", error);
        return [];
    }
}

/**
 * Get a single hero slide by ID
 */
export async function getHeroSlideById(id: string): Promise<HeroSlide | null> {
    try {
        const docRef = doc(db, "heroSlides", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as HeroSlide;
        }
        return null;
    } catch (error) {
        console.error("Error getting hero slide:", error);
        return null;
    }
}

/**
 * Update a hero slide
 */
export async function updateHeroSlide(
    id: string,
    updates: Partial<HeroSlideInput>
): Promise<void> {
    try {
        const docRef = doc(db, "heroSlides", id);
        await updateDoc(docRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
    } catch (error: any) {
        console.error("Error updating hero slide:", error);
        throw new Error(error.message || "Failed to update hero slide");
    }
}

/**
 * Delete a hero slide
 */
export async function deleteHeroSlide(id: string): Promise<void> {
    try {
        // Get slide to check for image
        const slide = await getHeroSlideById(id);

        // Delete from Firestore
        const docRef = doc(db, "heroSlides", id);
        await deleteDoc(docRef);

        // If image is in Firebase Storage, delete it
        if (slide?.imageUrl && slide.imageUrl.includes("firebase")) {
            try {
                const imageRef = ref(storage, slide.imageUrl);
                await deleteObject(imageRef);
            } catch (e) {
                // Image might not exist in storage, ignore
            }
        }
    } catch (error: any) {
        console.error("Error deleting hero slide:", error);
        throw new Error(error.message || "Failed to delete hero slide");
    }
}

/**
 * Update the order of multiple slides (for drag and drop)
 */
export async function updateHeroSlideOrders(
    items: { id: string; order: number }[]
): Promise<void> {
    try {
        const batch = writeBatch(db);

        items.forEach(({ id, order }) => {
            const docRef = doc(db, "heroSlides", id);
            batch.update(docRef, {
                order,
                updatedAt: serverTimestamp(),
            });
        });

        await batch.commit();
    } catch (error: any) {
        console.error("Error updating slide orders:", error);
        throw new Error(error.message || "Failed to update slide orders");
    }
}

/**
 * Upload banner image to Firebase Storage
 */
export async function uploadBannerImage(file: File): Promise<string> {
    try {
        const timestamp = Date.now();
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
        const path = `banners/${timestamp}_${safeName}`;

        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const downloadUrl = await getDownloadURL(storageRef);

        return downloadUrl;
    } catch (error: any) {
        console.error("Error uploading banner image:", error);
        throw new Error(error.message || "Failed to upload image");
    }
}

/**
 * Toggle slide active status
 */
export async function toggleHeroSlideActive(id: string): Promise<void> {
    try {
        const slide = await getHeroSlideById(id);
        if (slide) {
            await updateHeroSlide(id, { isActive: !slide.isActive });
        }
    } catch (error: any) {
        console.error("Error toggling slide status:", error);
        throw new Error(error.message || "Failed to toggle slide status");
    }
}
