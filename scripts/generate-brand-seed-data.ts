/**
 * Script to generate brand seed data from CSV
 * Run with: npx tsx scripts/generate-brand-seed-data.ts
 */

import * as fs from "fs";
import * as path from "path";

// Paths
const CSV_PATH = path.join(__dirname, "../snusmart_data/snusmart_products.csv");
const OUTPUT_PATH = path.join(__dirname, "../src/lib/firebase/brand-seed-data.ts");

// Parse CSV line handling quoted fields
function parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === "," && !inQuotes) {
            result.push(current.trim());
            current = "";
        } else {
            current += char;
        }
    }
    result.push(current.trim());
    return result;
}

// Normalize brand name to folder/key
function normalizeToKey(brand: string): string {
    return brand
        .toLowerCase()
        .replace(/\s+&\s+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

// Helper to determine strength from MG value or tags
function getStrength(title: string, tags: string): string {
    const lowerTags = tags.toLowerCase();

    if (lowerTags.includes("extremely strong") || lowerTags.includes("extreme")) return "EXTREME";
    if (lowerTags.includes("extra strong") || lowerTags.includes("extra")) return "EXTRA";
    if (lowerTags.includes("strong")) return "STRONG";
    if (lowerTags.includes("medium")) return "MEDIUM";
    if (lowerTags.includes("weak") || lowerTags.includes("light")) return "WEAK";

    const mgMatch = title.match(/(\d+(?:\.\d+)?)\s*mg/i);
    if (mgMatch) {
        const mg = parseFloat(mgMatch[1]);
        if (mg >= 40) return "EXTREME";
        if (mg >= 25) return "EXTRA";
        if (mg >= 15) return "STRONG";
        if (mg >= 8) return "MEDIUM";
        return "WEAK";
    }

    return "MEDIUM";
}

// Helper to extract flavor from tags or title
function getFlavor(title: string, tags: string): string {
    const lowerTags = tags.toLowerCase();
    const lowerTitle = title.toLowerCase();

    const flavors = [
        "peppermint", "spearmint", "cool mint", "fresh mint", "mint",
        "cherry", "blueberry", "strawberry", "raspberry", "watermelon",
        "grape", "apple", "mango", "peach", "citrus", "lime", "lemon", "orange",
        "cola", "coffee", "caramel", "vanilla", "bubblegum", "tropical",
        "banana", "pineapple", "coconut", "liquorice", "eucalyptus", "menthol"
    ];

    for (const flavor of flavors) {
        if (lowerTags.includes(flavor) || lowerTitle.includes(flavor)) {
            return flavor.charAt(0).toUpperCase() + flavor.slice(1);
        }
    }

    return "Original";
}

// Clean product name
function cleanProductName(title: string, brand: string): string {
    let name = title
        .replace(new RegExp(`^${brand}\\s+`, 'i'), '')
        .replace(/\s*\d+(?:\.\d+)?\s*mg\s*/gi, '')
        .replace(/\s*-\s*$/g, '')
        .trim();

    return name || title;
}

// Get first image filename
function extractFilename(imagePath: string): string {
    const firstPath = imagePath.split(";")[0].trim();
    return path.basename(firstPath);
}

// Generate description
function generateDescription(name: string, brand: string, strength: string, flavor: string): string {
    const strengthDesc =
        strength === "WEAK" ? "Light and mild" :
            strength === "MEDIUM" ? "Balanced and satisfying" :
                strength === "STRONG" ? "Strong and intense" :
                    strength === "EXTRA" ? "Extra strong experience" :
                        "Extreme and powerful";

    return `${name} nicotine pouches by ${brand}. ${strengthDesc} with ${flavor.toLowerCase()} flavor.`;
}

// Generate SKU
function generateSku(brand: string, name: string, index: number): string {
    const brandCode = brand.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase();
    const nameCode = name.replace(/[^A-Z0-9]/gi, '').substring(0, 4).toUpperCase();
    return `${brandCode}-${nameCode}-${String(index).padStart(3, '0')}`;
}

async function generateBrandSeedData() {
    console.log("📊 Generating brand seed data from CSV...\n");

    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const lines = csvContent.split("\n").filter(line => line.trim());
    const dataLines = lines.slice(1);

    console.log(`📦 Processing ${dataLines.length} products...\n`);

    // Group products by brand
    const brandProducts: Record<string, any[]> = {};

    for (const line of dataLines) {
        const fields = parseCSVLine(line);
        if (fields.length < 9) continue;

        const [brand, title, url, description, tags, variant, sku, priceStr, imagePaths] = fields;

        if (!brand || !title) continue;

        const key = normalizeToKey(brand);
        if (!brandProducts[key]) {
            brandProducts[key] = [];
        }

        const price = parseFloat(priceStr) || 3.69;
        const strength = getStrength(title, tags);
        const flavor = getFlavor(title, tags);
        const cleanName = cleanProductName(title, brand);
        const filename = extractFilename(imagePaths || "");

        brandProducts[key].push({
            brand,
            name: cleanName,
            description: generateDescription(cleanName, brand, strength, flavor),
            price,
            sku: sku || generateSku(brand, cleanName, brandProducts[key].length + 1),
            strength,
            flavor,
            imageFile: filename,
            folderName: key,
        });
    }

    // Generate TypeScript file
    let output = `/**
 * Brand Seed Data - Auto-generated from snusmart_products.csv
 * Generated on: ${new Date().toISOString()}
 * 
 * DO NOT EDIT MANUALLY - Run: npx tsx scripts/generate-brand-seed-data.ts
 */

import type { BrandSeedData, Strength } from "./brand-seeds";

export const BRAND_DATA: Record<string, BrandSeedData> = {\n`;

    const sortedKeys = Object.keys(brandProducts).sort();

    for (const key of sortedKeys) {
        const products = brandProducts[key];
        const brandName = products[0].brand;

        output += `    "${key}": {\n`;
        output += `        brandName: "${brandName}",\n`;
        output += `        brandSlug: "${key}",\n`;
        output += `        folderName: "${key}",\n`;
        output += `        products: [\n`;

        products.forEach((p, idx) => {
            const isFeatured = idx === 0;
            const isBestSeller = idx === 1 && products.length > 5;
            const isWeeklySpecial = idx === 2 && products.length > 8;

            output += `            {\n`;
            output += `                name: ${JSON.stringify(p.name)},\n`;
            output += `                description: ${JSON.stringify(p.description)},\n`;
            output += `                price: ${p.price},\n`;
            output += `                sku: ${JSON.stringify(p.sku)},\n`;
            output += `                strength: "${p.strength}" as Strength,\n`;
            output += `                flavor: ${JSON.stringify(p.flavor)},\n`;
            output += `                images: ["/products/${p.folderName}/${p.imageFile}"],\n`;
            output += `                isFeatured: ${isFeatured},\n`;
            output += `                isBestSeller: ${isBestSeller},\n`;
            output += `                isWeeklySpecial: ${isWeeklySpecial},\n`;
            output += `            },\n`;
        });

        output += `        ],\n`;
        output += `    },\n`;
    }

    output += `};\n\n`;
    output += `// Brand list for UI\n`;
    output += `export const BRAND_LIST = [\n`;

    for (const key of sortedKeys) {
        const products = brandProducts[key];
        const brandName = products[0].brand;
        output += `    { key: "${key}", name: "${brandName}", count: ${products.length} },\n`;
    }

    output += `];\n`;

    fs.writeFileSync(OUTPUT_PATH, output);

    console.log("✅ Generated brand seed data:");
    console.log(`   📁 Output: ${OUTPUT_PATH}`);
    console.log(`   🎯 Brands: ${sortedKeys.length}`);
    console.log(`   📦 Products: ${dataLines.length}`);
}

generateBrandSeedData().catch(console.error);
