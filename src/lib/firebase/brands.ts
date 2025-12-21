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
} from "firebase/firestore";
import { db } from "./config";

// ============================================
// TYPES
// ============================================

export interface BrandInput {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    isActive: boolean;
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
        const q = query(
            collection(db, "brands"),
            orderBy("name", "asc")
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as Brand[];
    } catch (error) {
        console.error("Error getting brands:", error);
        return [];
    }
}

export async function getActiveBrands(): Promise<Brand[]> {
    try {
        const brands = await getAllBrands();
        return brands.filter(brand => brand.isActive);
    } catch (error) {
        console.error("Error getting active brands:", error);
        return [];
    }
}
