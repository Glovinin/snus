export interface Product {
    id: string;
    name: string;
    category: string;
    price: string;
    image: string; // CSS class for background
    textColor: string;
    description: string;
    features: string[];
    reviews: { user: string; rating: number; text: string }[];
    strength: string; // e.g. "Extremely Strong"
    flavor: string;
}

export const products: Product[] = [
    {
        id: "siberia-80-c",
        name: "Siberia -80°C",
        category: "Extremely Strong",
        price: "€5.90",
        image: "bg-red-50 dark:bg-red-950/30",
        textColor: "text-red-900 dark:text-red-100",
        description: "Experience the ultimate rush with Siberia -80°C. Known for its intense strength and refreshing spearmint flavor, this is not for the faint of heart. Designed for experienced users seeking distinct and powerful satisfaction.",
        features: ["43mg/g Nicotine", "Cool Mint Flavor", "Tobacco Free", "Long-lasting Kick"],
        reviews: [
            { user: "Alex K.", rating: 5, text: "Absolutely strictly for the pros. Hits hard and lasts long." },
            { user: "Sarah M.", rating: 4, text: "Strongest I've tried. Good flavor but intense." }
        ],
        strength: "Extremely Strong",
        flavor: "Spearmint"
    },
    {
        id: "pablo-ice-cold",
        name: "Pablo Ice Cold",
        category: "Extra Strong",
        price: "€4.50",
        image: "bg-blue-50 dark:bg-blue-950/30",
        textColor: "text-blue-900 dark:text-blue-100",
        description: "Pablo Ice Cold is the definition of danger. A very strong nicotine pouch with a burning ice-cold mint effect. Perfect for those who want that extra kick throughout the day.",
        features: ["30mg/g Nicotine", "Ice Cold Mint", "Fast Absorption", "Slim Pouch"],
        reviews: [
            { user: "Johan B.", rating: 5, text: "My daily driver. Perfect strength." },
            { user: "Mike T.", rating: 5, text: "Classic freeze feeling." }
        ],
        strength: "Extra Strong",
        flavor: "Ice Mint"
    },
    {
        id: "killa-cold-mint",
        name: "Killa Cold Mint",
        category: "Strong",
        price: "€4.20",
        image: "bg-slate-100 dark:bg-slate-900/30",
        textColor: "text-slate-900 dark:text-slate-100",
        description: "Killa Cold Mint is well known for its lethal kick and great taste. A balanced strong pouch that delivers a consistent nicotine release with a fresh minty aftertaste.",
        features: ["16mg/g Nicotine", "Great Taste", "Balanced Strength", "All White"],
        reviews: [
            { user: "Emma W.", rating: 4, text: "Good flavor, good strength." },
            { user: "David L.", rating: 5, text: "Reliable and consistent." }
        ],
        strength: "Strong",
        flavor: "Mint"
    },
    {
        id: "velo-freeze",
        name: "Velo Freeze",
        category: "Regular",
        price: "€5.50",
        image: "bg-emerald-50 dark:bg-emerald-950/30",
        textColor: "text-emerald-900 dark:text-emerald-100",
        description: "Velo Freeze takes your taste buds to the arctic. An intense peppermint sensation with an icy menthol cooling effect. One of the most popular choices worldwide.",
        features: ["10.9mg/g Nicotine", "Peppermint & Menthol", "Soft Pouch", "Discreet"],
        reviews: [
            { user: "Chris P.", rating: 5, text: "Can't go wrong with Velo." },
            { user: "Anna S.", rating: 4, text: "Fresh and clean." }
        ],
        strength: "Regular",
        flavor: "Peppermint Menthol"
    },
    {
        id: "lyft-ice-cool",
        name: "Lyft Ice Cool",
        category: "Mellow",
        price: "€5.50",
        image: "bg-sky-50 dark:bg-sky-950/30",
        textColor: "text-sky-900 dark:text-sky-100",
        description: "Lyft Ice Cool offers a refreshing and crisp peppermint flavor with hints of sweetness and herbs. A perfect choice for a balanced and flavorful experience.",
        features: ["8mg/g Nicotine", "Crisp Peppermint", "Premium Quality", "Slim Fit"],
        reviews: [
            { user: "Tom H.", rating: 5, text: "Very premium feel." },
            { user: "Lisa G.", rating: 5, text: "Smooth and tasty." }
        ],
        strength: "Mellow",
        flavor: "Peppermint"
    },
];
