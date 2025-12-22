import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./config";
import { deleteFileFromUrl } from "./storage";

// ============================================
// TYPES
// ============================================

export interface ProductInput {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number | null;
    sku: string;
    category: string;
    brand: string;
    strength: "WEAK" | "MEDIUM" | "STRONG" | "EXTRA" | "EXTREME";
    flavor: string;
    stock: number;
    images: string[]; // URLs after upload
    imagesBlurData?: string[]; // Base64 blur strings corresponding to images
    isActive: boolean;
    isFeatured: boolean;
    isBestSeller: boolean;
    isWeeklySpecial: boolean;
}

export interface Product extends ProductInput {
    id: string;
    slug: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface ProductFilters {
    category?: string;
    brand?: string;
    strength?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    isBestSeller?: boolean;
    isWeeklySpecial?: boolean;
}

// ============================================
// HELPERS
// ============================================

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// ============================================
// IMAGE UPLOAD
// ============================================

/**
 * Generate a slug from a string (for folder names)
 */
function generateStorageSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .substring(0, 50); // Limit length for storage paths
}

export interface ImageUploadOptions {
    brand: string;
    productName: string;
}

export async function uploadProductImage(
    file: File,
    index: number,
    options: ImageUploadOptions
): Promise<string> {
    const { brand, productName } = options;

    // Generate slugs for folder structure
    const brandSlug = generateStorageSlug(brand);
    const productSlug = generateStorageSlug(productName);

    const ext = file.name.split(".").pop() || "jpg";
    const filename = index === 0 ? `cover.${ext}` : `gallery_${index}.${ext}`;

    // Path structure: products/{brand}/{product}/{filename}
    // Example: products/rebel/energy-watermelon-ice/cover.jpg
    const path = `products/${brandSlug}/${productSlug}/${filename}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export async function uploadProductImages(
    files: File[],
    options: ImageUploadOptions
): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
        uploadProductImage(file, index, options)
    );
    return Promise.all(uploadPromises);
}

// ============================================
// CRUD OPERATIONS
// ============================================

export async function createProduct(data: ProductInput): Promise<string> {
    try {
        const productsRef = collection(db, "products");
        const newDocRef = doc(productsRef);
        const productId = newDocRef.id;

        const slug = generateSlug(data.name);

        const productData = {
            ...data,
            slug,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        await setDoc(newDocRef, productData);
        return productId;
    } catch (error: any) {
        throw new Error(error.message || "Failed to create product");
    }
}

export async function updateProduct(
    id: string,
    data: Partial<ProductInput>
): Promise<void> {
    try {
        const productRef = doc(db, "products", id);

        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        // Update slug if name changed
        if (data.name) {
            updateData.slug = generateSlug(data.name);
        }

        await updateDoc(productRef, updateData);
    } catch (error: any) {
        throw new Error(error.message || "Failed to update product");
    }
}

export async function deleteProduct(id: string): Promise<void> {
    try {
        // Fetch product first to get image URLs
        const product = await getProductById(id);

        if (product && product.images && product.images.length > 0) {
            // Delete all associated images
            const deletePromises = product.images.map(url => deleteFileFromUrl(url));
            await Promise.all(deletePromises);
        }

        // Then delete document
        const productRef = doc(db, "products", id);
        await deleteDoc(productRef);
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete product");
    }
}

// ============================================
// READ OPERATIONS
// ============================================

export async function getProductById(id: string): Promise<Product | null> {
    try {
        const productRef = doc(db, "products", id);
        const docSnap = await getDoc(productRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error("Error getting product:", error);
        return null;
    }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    try {
        const q = query(
            collection(db, "products"),
            where("slug", "==", slug),
            limit(1)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Product;
        }
        return null;
    } catch (error) {
        console.error("Error getting product by slug:", error);
        return null;
    }
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
    try {
        let q = query(collection(db, "products"));

        // Apply filters
        if (filters?.isActive !== undefined) {
            q = query(q, where("isActive", "==", filters.isActive));
        }
        if (filters?.category) {
            q = query(q, where("category", "==", filters.category));
        }
        if (filters?.brand) {
            q = query(q, where("brand", "==", filters.brand));
        }
        if (filters?.strength) {
            q = query(q, where("strength", "==", filters.strength));
        }
        if (filters?.isFeatured) {
            q = query(q, where("isFeatured", "==", true));
        }
        if (filters?.isBestSeller) {
            q = query(q, where("isBestSeller", "==", true));
        }
        if (filters?.isWeeklySpecial) {
            q = query(q, where("isWeeklySpecial", "==", true));
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error getting products:", error);
        return [];
    }
}

export async function getAllProducts(): Promise<Product[]> {
    return getProducts({ isActive: true });
}

export async function getFeaturedProducts(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, "products"),
            where("isActive", "==", true),
            where("isFeatured", "==", true),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error getting featured products:", error);
        return [];
    }
}

export async function getBestSellers(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, "products"),
            where("isActive", "==", true),
            where("isBestSeller", "==", true),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error getting best sellers:", error);
        return [];
    }
}

export async function getWeeklySpecials(limitCount: number = 10): Promise<Product[]> {
    try {
        const q = query(
            collection(db, "products"),
            where("isActive", "==", true),
            where("isWeeklySpecial", "==", true),
            limit(limitCount)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error getting weekly specials:", error);
        return [];
    }
}

// ============================================
// ADMIN OPERATIONS
// ============================================

export async function getAdminProducts(): Promise<Product[]> {
    try {
        const q = query(
            collection(db, "products"),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Product[];
    } catch (error) {
        console.error("Error getting admin products:", error);
        return [];
    }
}

export async function clearBrandStatuses(brandName: string): Promise<number> {
    try {
        const q = query(
            collection(db, "products"),
            where("brand", "==", brandName)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) return 0;

        const batch = writeBatch(db);
        let count = 0;

        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            // Only update if at least one status is active
            if (data.isFeatured || data.isBestSeller || data.isWeeklySpecial) {
                batch.update(doc.ref, {
                    isFeatured: false,
                    isBestSeller: false,
                    isWeeklySpecial: false,
                    updatedAt: serverTimestamp()
                });
                count++;
            }
        });

        if (count > 0) {
            await batch.commit();
        }

        return count;
    } catch (error: any) {
        throw new Error(error.message || "Failed to clear brand statuses");
    }
}
