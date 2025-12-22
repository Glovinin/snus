import { collection, addDoc, serverTimestamp, getDocs, query, where, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

// Produtos Rebel com imagens locais (pasta public/products/rebel)
const REBEL_PRODUCTS = [
    // === CHERRY ===
    {
        name: "Cherry Intense",
        description: "Cherry Intense nicotine pouches by Rebel. Intense cherry flavor with a powerful nicotine kick.",
        price: 3.69,
        sku: "REBEL-CI-INT",
        strength: "STRONG" as const,
        flavor: "Cherry",
        images: [
            "/products/rebel/rebel-cherry-intense.png",
            "/products/rebel/rebel-cherry-intense_80574664933702.jpg",
        ],
        isFeatured: true,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Cherry Ultimate",
        description: "Cherry Ultimate nicotine pouches by Rebel. Ultimate cherry experience with maximum intensity.",
        price: 3.69,
        sku: "REBEL-CU-ULT",
        strength: "EXTRA" as const,
        flavor: "Cherry",
        images: [
            "/products/rebel/rebel-cherry-ultimate.png",
            "/products/rebel/rebel-cherry-ultimate_80574666146118.jpg",
        ],
        isFeatured: false,
        isBestSeller: true,
        isWeeklySpecial: false,
    },
    // === CITRUS ===
    {
        name: "Crisp Citrus Strong",
        description: "Crisp Citrus Strong nicotine pouches by Rebel. Zesty citrus burst with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-CC-STR",
        strength: "STRONG" as const,
        flavor: "Citrus",
        images: [
            "/products/rebel/rebel-crisp-citrus-strong.png",
            "/products/rebel/rebel-crisp-citrus-strong_80574652154182.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === FREEZE MINT ===
    {
        name: "Freeze Mint Extreme",
        description: "Freeze Mint Extreme nicotine pouches by Rebel. Arctic freezing mint with extreme nicotine intensity.",
        price: 3.69,
        sku: "REBEL-FM-EXT",
        strength: "EXTRA" as const,
        flavor: "Mint",
        images: [
            "/products/rebel/rebel-freeze-mint-extreme.png",
            "/products/rebel/rebel-freeze-mint-extreme_80574665916742.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: true,
    },
    {
        name: "Freeze Mint Ultimate",
        description: "Freeze Mint Ultimate nicotine pouches by Rebel. The ultimate frozen mint experience.",
        price: 3.69,
        sku: "REBEL-FM-ULT",
        strength: "EXTREME" as const,
        flavor: "Mint",
        images: [
            "/products/rebel/rebel-freeze-mint-ultimate.png",
            "/products/rebel/rebel-freeze-mint-ultimate_80574666244422.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === ICE MINT ===
    {
        name: "Ice Mint Strong",
        description: "Ice Mint Strong nicotine pouches by Rebel. Fresh icy mint with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-IM-STR",
        strength: "STRONG" as const,
        flavor: "Mint",
        images: [
            "/products/rebel/rebel-ice-mint-strong_80574656938310.jpg",
            "/products/rebel/rebel-ice-mint-strong_80574656938310.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Ice Mint Extreme",
        description: "Ice Mint Extreme nicotine pouches by Rebel. Icy cool mint with extreme nicotine intensity.",
        price: 3.69,
        sku: "REBEL-IM-EXT",
        strength: "EXTRA" as const,
        flavor: "Mint",
        images: [
            "/products/rebel/rebel-ice-mint-extreme.png",
            "/products/rebel/rebel-ice-mint-extreme_80574665621830.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === JUICY GRAPE ===
    {
        name: "Juicy Grape Strong",
        description: "Juicy Grape Strong nicotine pouches by Rebel. Sweet juicy grape with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-JG-STR",
        strength: "STRONG" as const,
        flavor: "Grape",
        images: [
            "/products/rebel/rebel-juicy-grape-strong_80574655889734.jpg",
            "/products/rebel/rebel-juicy-grape-strong_80574655889734.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Juicy Grape Extreme",
        description: "Juicy Grape Extreme nicotine pouches by Rebel. Intense grape flavor with extreme nicotine kick.",
        price: 3.69,
        sku: "REBEL-JG-EXT",
        strength: "EXTRA" as const,
        flavor: "Grape",
        images: [
            "/products/rebel/rebel-juicy-grape-extreme_80574665818438.jpg",
            "/products/rebel/rebel-juicy-grape-extreme_80574665818438.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === MANGO ===
    {
        name: "Mango Medium",
        description: "Mango Medium nicotine pouches by Rebel. Tropical mango flavor with medium nicotine content.",
        price: 3.69,
        sku: "REBEL-MG-MED",
        strength: "MEDIUM" as const,
        flavor: "Mango",
        images: [
            "/products/rebel/rebel-mango-medium_80574651662662.jpg",
            "/products/rebel/rebel-mango-medium_80574651662662.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Mango Intense",
        description: "Mango Intense nicotine pouches by Rebel. Intense tropical mango with a powerful nicotine kick.",
        price: 3.69,
        sku: "REBEL-MG-INT",
        strength: "STRONG" as const,
        flavor: "Mango",
        images: [
            "/products/rebel/rebel-mango-intense_80574664704326.jpg",
            "/products/rebel/rebel-mango-intense_80574664704326.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === PEACH ===
    {
        name: "Peach Medium",
        description: "Peach Medium nicotine pouches by Rebel. Sweet peach flavor with medium nicotine content.",
        price: 3.69,
        sku: "REBEL-PC-MED",
        strength: "MEDIUM" as const,
        flavor: "Peach",
        images: [
            "/products/rebel/rebel-peach-medium_80574650974534.jpg",
            "/products/rebel/rebel-peach-medium_80574650974534.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Peach Extreme",
        description: "Peach Extreme nicotine pouches by Rebel. Juicy peach with extreme nicotine intensity.",
        price: 3.69,
        sku: "REBEL-PC-EXT",
        strength: "EXTRA" as const,
        flavor: "Peach",
        images: [
            "/products/rebel/rebel-peach-extreme_80574665326918.jpg",
            "/products/rebel/rebel-peach-extreme_80574665326918.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === PEPPERMINT ===
    {
        name: "Peppermint Strong",
        description: "Peppermint Strong nicotine pouches by Rebel. Classic peppermint with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-PM-STR",
        strength: "STRONG" as const,
        flavor: "Peppermint",
        images: [
            "/products/rebel/rebel-peppermint-strong_80574660215110.jpg",
            "/products/rebel/rebel-peppermint-strong_80574660215110.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Peppermint Extreme",
        description: "Peppermint Extreme nicotine pouches by Rebel. Intense peppermint with extreme nicotine kick.",
        price: 3.69,
        sku: "REBEL-PM-EXT",
        strength: "EXTRA" as const,
        flavor: "Peppermint",
        images: [
            "/products/rebel/rebel-peppermint-extreme_80574665195846.jpg",
            "/products/rebel/rebel-peppermint-extreme_80574665195846.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === SPEARMINT ===
    {
        name: "Spearmint Strong",
        description: "Spearmint Strong nicotine pouches by Rebel. Fresh spearmint with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-SM-STR",
        strength: "STRONG" as const,
        flavor: "Spearmint",
        images: [
            "/products/rebel/rebel-spearmint-strong_80574662476102.jpg",
            "/products/rebel/rebel-spearmint-strong_80574662476102.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Spearmint Extreme",
        description: "Spearmint Extreme nicotine pouches by Rebel. Powerful spearmint with extreme nicotine intensity.",
        price: 3.69,
        sku: "REBEL-SM-EXT",
        strength: "EXTRA" as const,
        flavor: "Spearmint",
        images: [
            "/products/rebel/rebel-spearmint-extreme_80574665064774.jpg",
            "/products/rebel/rebel-spearmint-extreme_80574665064774.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === WATERMELON ===
    {
        name: "Watermelon Intense",
        description: "Watermelon Intense nicotine pouches by Rebel. Juicy watermelon with intense nicotine kick.",
        price: 3.69,
        sku: "REBEL-WM-INT",
        strength: "STRONG" as const,
        flavor: "Watermelon",
        images: [
            "/products/rebel/rebel-watermelon-intense_80574664802630.jpg",
            "/products/rebel/rebel-watermelon-intense_80574664802630.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Watermelon Ultimate",
        description: "Watermelon Ultimate nicotine pouches by Rebel. Ultimate watermelon experience with maximum intensity.",
        price: 3.69,
        sku: "REBEL-WM-ULT",
        strength: "EXTREME" as const,
        flavor: "Watermelon",
        images: [
            "/products/rebel/rebel-watermelon-ultimate_80574666047814.jpg",
            "/products/rebel/rebel-watermelon-ultimate_80574666047814.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === WILD FRUIT ===
    {
        name: "Wild Fruit Strong",
        description: "Wild Fruit Strong nicotine pouches by Rebel. Mix of wild fruits with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-WF-STR",
        strength: "STRONG" as const,
        flavor: "Wild Fruit",
        images: [
            "/products/rebel/rebel-wild-fruit-strong_80574652645702.jpg",
            "/products/rebel/rebel-wild-fruit-strong_80574652645702.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === ZESTY LIME ===
    {
        name: "Zesty Lime Strong",
        description: "Zesty Lime Strong nicotine pouches by Rebel. Tangy lime flavor with strong nicotine content.",
        price: 3.69,
        sku: "REBEL-ZL-STR",
        strength: "STRONG" as const,
        flavor: "Lime",
        images: [
            "/products/rebel/rebel-zesty-lime-strong_80574657921350.jpg",
            "/products/rebel/rebel-zesty-lime-strong_80574657921350.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Zesty Lime Extreme",
        description: "Zesty Lime Extreme nicotine pouches by Rebel. Intense lime zing with extreme nicotine kick.",
        price: 3.69,
        sku: "REBEL-ZL-EXT",
        strength: "EXTRA" as const,
        flavor: "Lime",
        images: [
            "/products/rebel/rebel-zesty-lime-extreme_80574665457990.jpg",
            "/products/rebel/rebel-zesty-lime-extreme_80574665457990.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // === ENERGY LINE ===
    {
        name: "Energy Bubblegum",
        description: "Energy Bubblegum nicotine pouches by Rebel. Sweet bubblegum flavor with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-BG",
        strength: "STRONG" as const,
        flavor: "Bubblegum",
        images: [
            "/products/rebel/rebel-energy-bubblegum_81216664699206.jpg",
            "/products/rebel/rebel-energy-bubblegum_81216664699206.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Cherry Cola",
        description: "Energy Cherry Cola nicotine pouches by Rebel. Classic cherry cola with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-CC",
        strength: "STRONG" as const,
        flavor: "Cherry Cola",
        images: [
            "/products/rebel/rebel-energy-cherry-cola_81216664568134.jpg",
            "/products/rebel/rebel-energy-cherry-cola_81216664568134.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Citrus",
        description: "Energy Citrus nicotine pouches by Rebel. Zesty citrus with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-CT",
        strength: "STRONG" as const,
        flavor: "Citrus",
        images: [
            "/products/rebel/rebel-energy-citrus_81216664535366.jpg",
            "/products/rebel/rebel-energy-citrus_81216664535366.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Double Mint Ice",
        description: "Energy Double Mint Ice nicotine pouches by Rebel. Double mint freshness with icy energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-DM",
        strength: "STRONG" as const,
        flavor: "Mint",
        images: [
            "/products/rebel/rebel-energy-double-mint-ice_81216664764742.jpg",
            "/products/rebel/rebel-energy-double-mint-ice_81216664764742.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Energy",
        description: "Energy Energy nicotine pouches by Rebel. Pure energy drink flavor with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-EN",
        strength: "STRONG" as const,
        flavor: "Energy Drink",
        images: [
            "/products/rebel/rebel-energy-energy_81216664469830.jpg",
            "/products/rebel/rebel-energy-energy_81216664469830.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Mango",
        description: "Energy Mango nicotine pouches by Rebel. Tropical mango with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-MG",
        strength: "STRONG" as const,
        flavor: "Mango",
        images: [
            "/products/rebel/rebel-energy-mango_81216664600902.jpg",
            "/products/rebel/rebel-energy-mango_81216664600902.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Strawberry Ice",
        description: "Energy Strawberry Ice nicotine pouches by Rebel. Sweet strawberry with icy energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-SI",
        strength: "STRONG" as const,
        flavor: "Strawberry",
        images: [
            "/products/rebel/rebel-energy-strawberry-ice_81216664666438.jpg",
            "/products/rebel/rebel-energy-strawberry-ice_81216664666438.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Tropical",
        description: "Energy Tropical nicotine pouches by Rebel. Exotic tropical blend with energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-TR",
        strength: "STRONG" as const,
        flavor: "Tropical",
        images: [
            "/products/rebel/rebel-energy-tropical_81216664633670.jpg",
            "/products/rebel/rebel-energy-tropical_81216664633670.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Energy Watermelon Ice",
        description: "Energy Watermelon Ice nicotine pouches by Rebel. Juicy watermelon with icy energy boost and strong nicotine.",
        price: 3.69,
        sku: "REBEL-EN-WI",
        strength: "STRONG" as const,
        flavor: "Watermelon",
        images: [
            "/products/rebel/rebel-energy-watermelon-ice_81216664502598.jpg",
            "/products/rebel/rebel-energy-watermelon-ice_81216664502598.jpg",
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
];

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export async function seedRebelProducts(): Promise<{ success: boolean; count: number; message: string }> {
    try {
        // Verificar se a marca Rebel já existe
        const brandsRef = collection(db, "brands");
        const brandQuery = query(brandsRef, where("name", "==", "Rebel"));
        const brandSnapshot = await getDocs(brandQuery);

        if (brandSnapshot.empty) {
            // Criar a marca Rebel
            await addDoc(brandsRef, {
                name: "Rebel",
                slug: "rebel",
                description: "Premium nicotine pouches from Rebel - Bold flavors for bold people",
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        // Verificar quais produtos já existem (pelo SKU)
        const productsRef = collection(db, "products");
        const existingProducts = await getDocs(productsRef);
        const existingSkus = new Set(existingProducts.docs.map(doc => doc.data().sku));

        let addedCount = 0;

        for (const product of REBEL_PRODUCTS) {
            // Pular se já existe
            if (existingSkus.has(product.sku)) {
                continue;
            }

            const productData = {
                name: product.name,
                description: product.description,
                price: product.price,
                compareAtPrice: null,
                sku: product.sku,
                category: "Nicotine Pouches",
                brand: "Rebel",
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
            };

            await addDoc(productsRef, productData);
            addedCount++;
        }

        if (addedCount === 0) {
            return {
                success: true,
                count: 0,
                message: "All Rebel products already exist in the database."
            };
        }

        return {
            success: true,
            count: addedCount,
            message: `Successfully added ${addedCount} Rebel products!`
        };

    } catch (error: any) {
        console.error("Error seeding Rebel products:", error);
        return {
            success: false,
            count: 0,
            message: error.message || "Failed to seed products"
        };
    }
}

// Função para atualizar as imagens dos produtos Rebel existentes (quando capas forem geradas)
export async function updateRebelProductImages(): Promise<{ success: boolean; count: number; message: string }> {
    try {
        const productsRef = collection(db, "products");
        const rebelQuery = query(productsRef, where("brand", "==", "Rebel"));
        const rebelProducts = await getDocs(rebelQuery);

        if (rebelProducts.empty) {
            return {
                success: false,
                count: 0,
                message: "No Rebel products found in the database."
            };
        }

        // Mapeamento de SKU para imagens com capas (adicionar conforme gerar capas)
        const REBEL_COVERS: Record<string, string> = {
            "REBEL-CI-INT": "/products/rebel/rebel-cherry-intense.png",
            "REBEL-CU-ULT": "/products/rebel/rebel-cherry-ultimate.png",
            "REBEL-CC-STR": "/products/rebel/rebel-crisp-citrus-strong.png",
            "REBEL-FM-EXT": "/products/rebel/rebel-freeze-mint-extreme.png",
            "REBEL-FM-ULT": "/products/rebel/rebel-freeze-mint-ultimate.png",
            "REBEL-IM-EXT": "/products/rebel/rebel-ice-mint-extreme.png",
        };

        let updatedCount = 0;

        for (const productDoc of rebelProducts.docs) {
            const productData = productDoc.data();
            const sku = productData.sku;
            const cover = REBEL_COVERS[sku];

            if (cover && productData.images) {
                const originalImage = productData.images[productData.images.length - 1];
                const productRef = doc(db, "products", productDoc.id);
                await updateDoc(productRef, {
                    images: [cover, originalImage],
                    updatedAt: serverTimestamp(),
                });
                updatedCount++;
            }
        }

        return {
            success: true,
            count: updatedCount,
            message: `Successfully updated images for ${updatedCount} Rebel products!`
        };

    } catch (error: any) {
        console.error("Error updating Rebel product images:", error);
        return {
            success: false,
            count: 0,
            message: error.message || "Failed to update images"
        };
    }
}
