/**
 * Brand Products Seed Data
 * Generated from snusmart_products.csv
 * Contains all 34 brands with their product data
 */

import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Types
type Strength = "WEAK" | "MEDIUM" | "STRONG" | "EXTRA" | "EXTREME";

interface ProductSeedData {
    name: string;
    description: string;
    price: number;
    sku: string;
    strength: Strength;
    flavor: string;
    images: string[];
    isFeatured: boolean;
    isBestSeller: boolean;
    isWeeklySpecial: boolean;
}

interface BrandSeedData {
    brandName: string;
    brandSlug: string;
    folderName: string;
    products: ProductSeedData[];
}

// Helper to determine strength from MG value or tags
function getStrength(title: string, tags: string): Strength {
    const lowerTags = tags.toLowerCase();
    const lowerTitle = title.toLowerCase();

    // Check tags first
    if (lowerTags.includes("extremely strong") || lowerTags.includes("extreme")) return "EXTREME";
    if (lowerTags.includes("extra strong") || lowerTags.includes("extra")) return "EXTRA";
    if (lowerTags.includes("strong")) return "STRONG";
    if (lowerTags.includes("medium")) return "MEDIUM";
    if (lowerTags.includes("weak") || lowerTags.includes("light")) return "WEAK";

    // Try to extract MG from title
    const mgMatch = title.match(/(\d+(?:\.\d+)?)\s*mg/i);
    if (mgMatch) {
        const mg = parseFloat(mgMatch[1]);
        if (mg >= 40) return "EXTREME";
        if (mg >= 25) return "EXTRA";
        if (mg >= 15) return "STRONG";
        if (mg >= 8) return "MEDIUM";
        return "WEAK";
    }

    return "MEDIUM"; // Default
}

// Helper to extract flavor from tags or title
function getFlavor(title: string, tags: string): string {
    const lowerTags = tags.toLowerCase();

    const flavors = [
        "mint", "menthol", "spearmint", "peppermint", "cool mint", "fresh mint",
        "cherry", "berry", "blueberry", "strawberry", "raspberry", "watermelon",
        "grape", "apple", "mango", "peach", "citrus", "lime", "lemon", "orange",
        "cola", "coffee", "caramel", "vanilla", "bubblegum", "tropical",
        "banana", "pineapple", "coconut", "liquorice", "eucalyptus"
    ];

    for (const flavor of flavors) {
        if (lowerTags.includes(flavor) || title.toLowerCase().includes(flavor)) {
            return flavor.charAt(0).toUpperCase() + flavor.slice(1);
        }
    }

    return "Original";
}

// Helper to clean product name
function cleanProductName(title: string, brand: string): string {
    let name = title
        .replace(new RegExp(`^${brand}\\s+`, 'i'), '') // Remove brand prefix
        .replace(/\s*\d+(?:\.\d+)?\s*mg\s*/gi, '') // Remove MG
        .replace(/\s*-\s*$/g, '') // Remove trailing dash
        .trim();

    return name || title;
}

// Generate slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

// Generate description
function generateDescription(name: string, brand: string, strength: Strength, flavor: string): string {
    return `${name} nicotine pouches by ${brand}. ${strength === "WEAK" ? "Light and mild" :
        strength === "MEDIUM" ? "Balanced and satisfying" :
            strength === "STRONG" ? "Strong and intense" :
                strength === "EXTRA" ? "Extra strong experience" :
                    "Extreme and powerful"
        } with ${flavor.toLowerCase()} flavor.`;
}

// CSV Brand Data - Imported from generated file
import { BRAND_DATA, BRAND_LIST } from "./brand-seed-data";

export const BRAND_SEED_DATA = BRAND_DATA;
export { BRAND_LIST };

// Seed function for a specific brand
export async function seedBrandProducts(brandKey: string): Promise<{
    success: boolean;
    message: string;
    count: number;
}> {
    const brandData = BRAND_SEED_DATA[brandKey];

    if (!brandData) {
        return { success: false, message: `Brand "${brandKey}" not found`, count: 0 };
    }

    try {
        // Check if brand already has products
        const existingQuery = query(
            collection(db, "products"),
            where("brand", "==", brandData.brandName)
        );
        const existingSnapshot = await getDocs(existingQuery);

        if (!existingSnapshot.empty) {
            return {
                success: true,
                message: `${brandData.brandName} products already exist (${existingSnapshot.size} products)`,
                count: 0
            };
        }

        // Check if brand exists, if not create it
        const brandsQuery = query(
            collection(db, "brands"),
            where("name", "==", brandData.brandName)
        );
        const brandsSnapshot = await getDocs(brandsQuery);

        if (brandsSnapshot.empty) {
            await addDoc(collection(db, "brands"), {
                name: brandData.brandName,
                slug: brandData.brandSlug,
                description: `Premium nicotine pouches from ${brandData.brandName}`,
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        // Add products
        let addedCount = 0;
        for (const product of brandData.products) {
            await addDoc(collection(db, "products"), {
                name: product.name,
                description: product.description,
                price: product.price,
                compareAtPrice: null,
                sku: product.sku,
                category: "Nicotine Pouches",
                brand: brandData.brandName,
                strength: product.strength,
                flavor: product.flavor,
                stock: 100,
                images: product.images,
                isActive: true,
                isFeatured: product.isFeatured,
                isBestSeller: product.isBestSeller,
                isWeeklySpecial: product.isWeeklySpecial,
                slug: generateSlug(product.name),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            addedCount++;
        }

        return {
            success: true,
            message: `Successfully imported ${addedCount} ${brandData.brandName} products`,
            count: addedCount
        };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "Failed to seed products",
            count: 0
        };
    }
}

// Export helper functions for the generator script
export { getStrength, getFlavor, cleanProductName, generateDescription, generateSlug };
export type { ProductSeedData, BrandSeedData, Strength };
