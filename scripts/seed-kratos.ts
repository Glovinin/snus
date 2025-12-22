// Script para adicionar produtos Kratos ao Firebase
// Execute com: npx tsx scripts/seed-kratos.ts

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc, serverTimestamp, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as fs from "fs";
import * as path from "path";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDO3n-RxNzUDoO_qg-fmK9wYj9y_HK7OTs",
    authDomain: "snusidea-e8ef2.firebaseapp.com",
    projectId: "snusidea-e8ef2",
    storageBucket: "snusidea-e8ef2.firebasestorage.app",
    messagingSenderId: "795889068457",
    appId: "1:795889068457:web:60f74e92e95e9cf3fe5b78",
    measurementId: "G-SV9EDN6YJD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Diretório das imagens
const IMAGES_DIR = path.join(__dirname, "../snusmart_data/images");

// Mapeamento de produtos
const kratosProducts = [
    {
        name: "Black Cherry Ice",
        description: "Black Cherry Ice nicotine pouches by Kratos. 30mg nicotine content for a strong experience. Refreshing black cherry flavor with an icy finish.",
        price: 3.69,
        sku: "KRATOS-BCI-30",
        strength: "STRONG" as const,
        flavor: "Black Cherry",
        imageFile: "kratos-nicotine-black-cherry-ice_81050344456518.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Citrus Burst",
        description: "Citrus Burst nicotine pouches by Kratos. 16mg nicotine content for a medium experience. Explosive citrus flavor that awakens your senses.",
        price: 3.69,
        sku: "KRATOS-CB-16",
        strength: "MEDIUM" as const,
        flavor: "Citrus",
        imageFile: "kratos-nicotine-citrus-burst_81050344489286.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Cool Mint",
        description: "Cool Mint nicotine pouches by Kratos. 50mg nicotine content for an extra strong experience. Classic cool mint flavor with intense freshness.",
        price: 3.69,
        sku: "KRATOS-CM-50",
        strength: "EXTRA" as const,
        flavor: "Mint",
        imageFile: "kratos-nicotine-cool-mint_81050344554822.jpg",
        isFeatured: true,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Double Mint",
        description: "Double Mint nicotine pouches by Kratos. 50mg nicotine content for an extra strong experience. Double the mint, double the freshness.",
        price: 3.69,
        sku: "KRATOS-DM-50",
        strength: "EXTRA" as const,
        flavor: "Mint",
        imageFile: "kratos-nicotine-double-mint_81050344522054.jpg",
        isFeatured: false,
        isBestSeller: true,
        isWeeklySpecial: false,
    },
    {
        name: "Grape Ice",
        description: "Grape Ice nicotine pouches by Kratos. 16mg nicotine content for a medium experience. Sweet grape flavor with a cooling ice sensation.",
        price: 3.69,
        sku: "KRATOS-GI-16",
        strength: "MEDIUM" as const,
        flavor: "Grape",
        imageFile: "kratos-nicotine-grape-ice_81050382270790.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Mango Inferno",
        description: "Mango Inferno nicotine pouches by Kratos. 16mg nicotine content for a medium experience. Tropical mango flavor with a fiery kick.",
        price: 3.69,
        sku: "KRATOS-MI-16",
        strength: "MEDIUM" as const,
        flavor: "Mango",
        imageFile: "kratos-nicotine-mango-inferno_81050344620358.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: true,
    },
    {
        name: "Peach Frost",
        description: "Peach Frost nicotine pouches by Kratos. 30mg nicotine content for a strong experience. Sweet peach flavor with a frosty finish.",
        price: 3.69,
        sku: "KRATOS-PF-30",
        strength: "STRONG" as const,
        flavor: "Peach",
        imageFile: "kratos-nicotine-peach-frost_81050344653126.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    {
        name: "Strawberry Ice",
        description: "Strawberry Ice nicotine pouches by Kratos. 30mg nicotine content for a strong experience. Sweet strawberry flavor with a refreshing icy twist.",
        price: 3.69,
        sku: "KRATOS-SI-30",
        strength: "STRONG" as const,
        flavor: "Strawberry",
        imageFile: "kratos-nicotine-strawberry-ice_81050344685894.jpg",
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
];

// Função para fazer upload de imagem
async function uploadImage(fileName: string): Promise<string> {
    const filePath = path.join(IMAGES_DIR, fileName);
    const fileBuffer = fs.readFileSync(filePath);

    const storageRef = ref(storage, `products/${fileName}`);
    await uploadBytes(storageRef, fileBuffer, { contentType: "image/jpeg" });

    return getDownloadURL(storageRef);
}

// Função para gerar slug
function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function seedKratosProducts() {
    console.log("🚀 Starting to seed Kratos products...\n");

    try {
        // 1. Criar a marca Kratos
        console.log("📦 Creating Kratos brand...");
        await addDoc(collection(db, "brands"), {
            name: "Kratos",
            slug: "kratos",
            description: "Premium nicotine pouches from Kratos",
            isActive: true,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        console.log("✅ Kratos brand created!\n");

        // 2. Adicionar cada produto
        console.log("📤 Uploading images and creating products...\n");

        for (const product of kratosProducts) {
            try {
                // Upload da imagem
                console.log(`  ⬆️  Uploading ${product.imageFile}...`);
                const imageUrl = await uploadImage(product.imageFile);

                // Criar produto
                const productData = {
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    compareAtPrice: null,
                    sku: product.sku,
                    category: "Nicotine Pouches",
                    brand: "Kratos",
                    strength: product.strength,
                    flavor: product.flavor,
                    stock: 100,
                    images: [imageUrl],
                    isActive: true,
                    isFeatured: product.isFeatured,
                    isBestSeller: product.isBestSeller,
                    isWeeklySpecial: product.isWeeklySpecial,
                    slug: generateSlug(product.name),
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                };

                await addDoc(collection(db, "products"), productData);
                console.log(`  ✅ Added: ${product.name} (${product.strength})`);

            } catch (error) {
                console.error(`  ❌ Failed to add ${product.name}:`, error);
            }
        }

        console.log("\n🎉 All Kratos products added successfully!");
        console.log(`📊 Total: ${kratosProducts.length} products`);

    } catch (error) {
        console.error("❌ Error:", error);
    }

    process.exit(0);
}

// Executar
seedKratosProducts();
