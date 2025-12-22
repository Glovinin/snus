/**
 * Script to organize product images by brand
 * Run with: npx tsx scripts/organize-brand-images.ts
 */

import * as fs from "fs";
import * as path from "path";

// Paths
const CSV_PATH = path.join(__dirname, "../snusmart_data/snusmart_products.csv");
const IMAGES_SOURCE = path.join(__dirname, "../snusmart_data/images");
const IMAGES_DEST = path.join(__dirname, "../public/products");

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

// Normalize brand name to folder name
function normalizeToFolder(brand: string): string {
    return brand
        .toLowerCase()
        .replace(/\s+&\s+/g, "-")
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
}

// Get just the filename from the full path
function extractFilename(imagePath: string): string {
    // Handle multiple paths separated by semicolon
    const firstPath = imagePath.split(";")[0].trim();
    return path.basename(firstPath);
}

async function organizeImages() {
    console.log("📁 Starting image organization by brand...\n");

    // Read CSV
    const csvContent = fs.readFileSync(CSV_PATH, "utf-8");
    const lines = csvContent.split("\n").filter(line => line.trim());

    // Skip header
    const header = lines[0];
    const dataLines = lines.slice(1);

    console.log(`📊 Found ${dataLines.length} products in CSV\n`);

    // Track stats
    const brandStats: Record<string, { count: number; copied: number; errors: string[] }> = {};

    for (const line of dataLines) {
        const fields = parseCSVLine(line);

        if (fields.length < 9) continue;

        const brand = fields[0];
        const imagePaths = fields[8]; // Last field contains image path(s)

        if (!brand || !imagePaths) continue;

        const folderName = normalizeToFolder(brand);
        const destFolder = path.join(IMAGES_DEST, folderName);

        // Initialize stats
        if (!brandStats[brand]) {
            brandStats[brand] = { count: 0, copied: 0, errors: [] };
        }
        brandStats[brand].count++;

        // Create folder if not exists
        if (!fs.existsSync(destFolder)) {
            fs.mkdirSync(destFolder, { recursive: true });
            console.log(`📂 Created folder: ${folderName}/`);
        }

        // Get first image filename
        const filename = extractFilename(imagePaths);
        const sourcePath = path.join(IMAGES_SOURCE, filename);
        const destPath = path.join(destFolder, filename);

        // Copy file if source exists and dest doesn't
        if (fs.existsSync(sourcePath)) {
            if (!fs.existsSync(destPath)) {
                try {
                    fs.copyFileSync(sourcePath, destPath);
                    brandStats[brand].copied++;
                } catch (err: any) {
                    brandStats[brand].errors.push(`Failed to copy ${filename}: ${err.message}`);
                }
            } else {
                brandStats[brand].copied++; // Already exists
            }
        } else {
            brandStats[brand].errors.push(`Source not found: ${filename}`);
        }
    }

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("📊 SUMMARY BY BRAND");
    console.log("=".repeat(60) + "\n");

    const sortedBrands = Object.keys(brandStats).sort();
    let totalProducts = 0;
    let totalCopied = 0;
    let totalErrors = 0;

    for (const brand of sortedBrands) {
        const stats = brandStats[brand];
        const status = stats.errors.length === 0 ? "✅" : "⚠️";
        console.log(`${status} ${brand.padEnd(20)} ${stats.copied}/${stats.count} images`);

        if (stats.errors.length > 0) {
            stats.errors.slice(0, 3).forEach(err => console.log(`   ❌ ${err}`));
            if (stats.errors.length > 3) {
                console.log(`   ... and ${stats.errors.length - 3} more errors`);
            }
        }

        totalProducts += stats.count;
        totalCopied += stats.copied;
        totalErrors += stats.errors.length;
    }

    console.log("\n" + "=".repeat(60));
    console.log(`📦 Total: ${totalCopied}/${totalProducts} images copied`);
    console.log(`🎯 Brands: ${sortedBrands.length}`);
    if (totalErrors > 0) {
        console.log(`⚠️  Errors: ${totalErrors}`);
    }
    console.log("=".repeat(60));
    console.log("\n✅ Done!");
}

organizeImages().catch(console.error);
