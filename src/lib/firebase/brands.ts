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
    serverTimestamp,
    Timestamp,
    writeBatch, // Added
} from "firebase/firestore";
import { db } from "./config";
import { deleteProduct } from "./products";

// ============================================
// TYPES
// ============================================

export interface BrandInput {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    isActive: boolean;
    order?: number; // Added
}

export interface Brand extends BrandInput {
    id: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
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
// CRUD OPERATIONS
// ============================================

export async function createBrand(name: string, description?: string): Promise<string> {
    try {
        const brandsRef = collection(db, "brands");
        const newDocRef = doc(brandsRef);
        const brandId = newDocRef.id;

        const brandData: Omit<Brand, "id"> = {
            name,
            slug: generateSlug(name),
            description: description || "",
            logoUrl: "",
            isActive: true,
            order: 0, // Added default
            createdAt: serverTimestamp() as Timestamp,
            updatedAt: serverTimestamp() as Timestamp,
        };

        await setDoc(newDocRef, brandData);
        return brandId;
    } catch (error: any) {
        throw new Error(error.message || "Failed to create brand");
    }
}

export async function updateBrand(
    id: string,
    data: Partial<BrandInput>
): Promise<void> {
    try {
        const brandRef = doc(db, "brands", id);

        const updateData: any = {
            ...data,
            updatedAt: serverTimestamp(),
        };

        // Update slug if name changed
        if (data.name) {
            updateData.slug = generateSlug(data.name);
        }

        await updateDoc(brandRef, updateData);
    } catch (error: any) {
        throw new Error(error.message || "Failed to update brand");
    }
}

export async function deleteBrand(id: string): Promise<void> {
    try {
        const brandRef = doc(db, "brands", id);
        await deleteDoc(brandRef);
    } catch (error: any) {
        throw new Error(error.message || "Failed to delete brand");
    }
}

export async function deleteBrandByName(brandName: string): Promise<{ success: boolean; message: string }> {
    try {
        // 1. Get all products for this brand
        const productsRef = collection(db, "products");
        const qProducts = query(productsRef, where("brand", "==", brandName));
        const productSnap = await getDocs(qProducts);

        // 2. Delete all products (this will handle image deletion via deleteProduct)
        const deletePromises = productSnap.docs.map(doc => deleteProduct(doc.id));
        await Promise.all(deletePromises);

        // 3. Get brand document(s)
        const brandsRef = collection(db, "brands");
        const qBrands = query(brandsRef, where("name", "==", brandName));
        const brandSnap = await getDocs(qBrands);

        // 4. Delete brand document(s)
        const deleteBrandPromises = brandSnap.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deleteBrandPromises);

        return {
            success: true,
            message: `Successfully deleted ${brandName} and ${productSnap.size} products`
        };
    } catch (error: any) {
        console.error("Delete brand error:", error);
        return {
            success: false,
            message: error.message || "Failed to delete brand"
        };
    }
}

// ============================================
// READ OPERATIONS
// ============================================

export async function getBrandById(id: string): Promise<Brand | null> {
    try {
        const brandRef = doc(db, "brands", id);
        const docSnap = await getDoc(brandRef);

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Brand;
        }
        return null;
    } catch (error) {
        console.error("Error getting brand:", error);
        return null;
    }
}

export async function getAllBrands(): Promise<Brand[]> {
    try {
        // Fetch all brands without orderBy since order field might not exist on all docs yet
        const querySnapshot = await getDocs(collection(db, "brands"));
        const brands = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Brand[];

        // Sort by order field first (undefined = max), then by name
        return brands.sort((a, b) => {
            const orderA = a.order ?? 9999;
            const orderB = b.order ?? 9999;
            if (orderA !== orderB) return orderA - orderB;
            return a.name.localeCompare(b.name);
        });
    } catch (error) {
        console.error("Error getting brands:", error);
        return [];
    }
}

export async function getActiveBrands(): Promise<Brand[]> {
    try {
        const brands = await getAllBrands();
        // Already sorted by getAllBrands, just filter active ones
        return brands.filter(brand => brand.isActive);
    } catch (error) {
        console.error("Error getting active brands:", error);
        return [];
    }
}

export async function updateBrandOrders(items: { id: string; order: number }[]): Promise<void> {
    try {
        const batch = writeBatch(db);

        items.forEach(({ id, order }) => {
            const ref = doc(db, "brands", id);
            batch.update(ref, {
                order,
                updatedAt: serverTimestamp()
            });
        });

        await batch.commit();
    } catch (error: any) {
        throw new Error(error.message || "Failed to update brand orders");
    }
}
