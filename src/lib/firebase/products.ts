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
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { db, storage } from "./config";

// ============================================
// TYPES
// ============================================

export interface ProductInput {
    name: string;
    description?: string;
    price: number;
    compareAtPrice?: number;
    sku: string;
    category: string;
    brand: string;
    strength: "WEAK" | "MEDIUM" | "STRONG" | "EXTRA" | "EXTREME";
    flavor: string;
    stock: number;
    images: string[]; // URLs after upload
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

export async function uploadProductImage(
    productId: string,
    file: File,
    index: number
): Promise<string> {
    const ext = file.name.split(".").pop() || "jpg";
    const filename = index === 0 ? `cover.${ext}` : `gallery_${index}.${ext}`;
    const path = `products/${productId}/${filename}`;

    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
}

export async function uploadProductImages(
    productId: string,
    files: File[]
): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
        uploadProductImage(productId, file, index)
    );
    return Promise.all(uploadPromises);
}

export async function deleteProductImages(productId: string): Promise<void> {
    const folderRef = ref(storage, `products/${productId}`);
    try {
        const result = await listAll(folderRef);
        const deletePromises = result.items.map((itemRef) => deleteObject(itemRef));
        await Promise.all(deletePromises);
    } catch (error) {
        console.error("Error deleting product images:", error);
    }
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
        // Delete images first
        await deleteProductImages(id);

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
