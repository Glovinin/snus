import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI with the API key from environment
const API_KEY = process.env.GEMINI_API_KEY || "";

export async function POST(request: NextRequest) {
    try {
        if (!API_KEY) {
            return NextResponse.json(
                { error: "GEMINI_API_KEY is not configured. Add it to .env.local" },
                { status: 500 }
            );
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        const body = await request.json();
        const { imageUrl, productName, flavor, strength, brand } = body;

        if (!imageUrl) {
            return NextResponse.json(
                { error: "Image URL is required" },
                { status: 400 }
            );
        }

        // Handle blob URLs - they can't be fetched server-side
        if (imageUrl.startsWith("blob:")) {
            return NextResponse.json(
                { error: "Cannot process blob URLs. Please save the product first, then generate the cover." },
                { status: 400 }
            );
        }

        // Fetch the image and convert to base64
        let base64Image: string;
        let mimeType: string;

        try {
            const imageResponse = await fetch(imageUrl);
            if (!imageResponse.ok) {
                return NextResponse.json(
                    { error: `Failed to fetch image: ${imageResponse.status}` },
                    { status: 400 }
                );
            }

            const imageBuffer = await imageResponse.arrayBuffer();
            base64Image = Buffer.from(imageBuffer).toString("base64");
            mimeType = imageResponse.headers.get("content-type") || "image/jpeg";
        } catch (fetchError: any) {
            return NextResponse.json(
                { error: `Could not access image: ${fetchError.message}` },
                { status: 400 }
            );
        }

        // Create themed prompt based on flavor
        const flavorThemes: Record<string, string> = {
            // Fruits
            "apple": "fresh crisp green and red apples, orchard background with sunlight, water droplets, fresh nature feel",
            "grape": "bunches of purple grapes, vineyard background, rich purple gradient, luxurious feel",
            "orange": "fresh sliced oranges, orange juice splashes, bright yellow-orange sunny styling, vitamin C vibe",
            "pineapple": "fresh sliced pineapple, tropical palm leaves, bright yellow sunshine, exotic mood",
            "banana": "ripe yellow bananas, tropical green leaves, smooth yellow gradient, energetic and fresh",
            "watermelon": "juicy watermelon slices with red flesh and green rind, splashing water, refreshing summer vibe",
            "kiwi": "sliced fresh green kiwi fruit with black seeds, vibrant green textures, energetic and exotic",
            "coconut": "cracked coconuts with fresh white meat, palm fronds, tropical beach vibes, creamy white tones",
            "raspberry": "fresh pink and red raspberries, wild berry bush leaves, rich magenta tones, macro detail",
            "mango": "juicy ripe mangoes, tropical sunset lighting, warm orange and yellow gradients, exotic heat",
            "dragon fruit": "sliced exotic dragon fruit (pitaya) with white flesh and black seeds, vibrant pink skin, exotic luxury",
            "peach": "soft fuzzy peaches, peach blossoms, warm soft orange and pink pastel tones, delicate lighting",
            "strawberry": "vibrant red fresh strawberries, green caps, splashing water, sweet and romantic red mood",
            "blackberry": "dark shiny blackberries, thorny branches, deep purple and black tones, moody forest atmosphere",
            "black currant": "rich dark cassis berries, deep violet and purple tones, premium sophisticated look",
            "blueberry": "fresh blue blueberries with frost, forest background, cool blue tones, cold refreshing look",
            "pear": "fresh green and yellow pears, soft orchard light, water drops, crisp and clean aesthetic",
            "grapefruit": "sliced pink grapefruit, citrus zest, refreshing pink and orange tones, bitter-sweet vibe",
            "lemon": "bright yellow lemons, lemon zest, sunshine lighting, fresh and clean yellow aesthetic",
            "lime": "vibrant green lime slices, splashing water, neon green zest, energetic citrus burst",
            "wild fruit": "forest floor with mixed wild berries, mysterious dark foliage, purple and green tones, raw nature",
            "wild berries": "mix of strawberries, raspberries, and blueberries, dark forest background, rich berry tones",
            "tropical": "mix of passion fruit, pineapple, and mango, palm leaves, vibrant saturated colors, island vacation mood",

            // Sweets & Drinks
            "energy drink": "electric blue lightning sparks, neon glowing effects, dynamic motion, power and adrenaline vibe",
            "bubble gum": "floating pink bubblegum bubbles, sweet pink and blue cotton candy clouds, playful pop aesthetic",
            "cola": "dark bubbly cola liquid, ice cubes with condensation, vintage glass bottle vibes, classic red and brown tones",
            "liquorice": "black liquorice rolls/wheels, star anise, dark premium salty aesthetic, sophisticated black styling",
            "candy": "colorful hard candies, swirls, sugar crystals, bright playful rainbow colors, sweet treats",
            "caramel": "flowing golden melted caramel, caramel cubes, warm rich brown and gold tones, creamy dessert look",
            "vanilla": "fresh vanilla pods, white orchid flowers, creamy soft beige and white tones, smooth elegance",
            "coffee": "roasted coffee beans, steam rising, dark espresso brown tones, premium cafe atmosphere",
            "cocktail": "fancy drink glass with umbrella, lime garnish, party lights background, sophisticated nightlife",

            // Mint & Spices
            "mint": "fresh green mint leaves, ice cubes, frost, cold blue-white gradient, freezing refreshing effect",
            "peppermint": "peppermint candy swirls, sharp red and white contrast, icy cold snow background",
            "spearmint": "bright green spearmint leaves, morning dew, herbal fresh aesthetic, clean green tones",
            "chili": "red hot chili peppers, subtle flames or smoke, warm red and orange lighting, spicy heat visual",
            "jalapeno": "fresh green jalapeño peppers, sliced peppers, spicy green vibes, zesty heat",
            "jalepeno": "fresh green jalapeño peppers, sliced peppers, spicy green vibes, zesty heat", // Typo handling

            // Traditional
            "tobacco": "dried tobacco leaves, rich leather textures, warm earthy brown and mahogany tones, classic vintage gentlemen style"
        };

        // Try to find the best matching theme, prioritize longer matches (specifics) over shorter ones (generics)
        const flavorLower = (flavor || "").toLowerCase();
        const sortedKeys = Object.keys(flavorThemes).sort((a, b) => b.length - a.length);

        const flavorKey = sortedKeys.find(key => flavorLower.includes(key));

        // If no match found, use the flavor name itself to guide the AI
        const themeElements = flavorKey ? flavorThemes[flavorKey] : `${flavorLower} themed elements, reflecting the flavor of ${flavorLower}`;

        const prompt = `Create a professional 3D product visualization.
        
Context: This is a premium nicotine pouch product.
Product Name: "${productName}"
Flavor Profile: "${flavor}"

TASK:
Generate a high-end, cinematic product shot featuring this exact product can centered in the frame.

BACKGROUND THEME & ATMOSPHERE:
${themeElements}

CRITICAL INSTRUCTIONS:
1. PRESERVE THE PRODUCT: The can in the center MUST look exactly like the input image provided. Do not alter the logo, text, or colors of the product can itself.
2. RELEVANCE: The background elements MUST strictly match the flavor "${flavor}". If the flavor says "Wild Fruit", show wild berries and forest elements. DO NOT show mint or ice unless the flavor explicitly says "Mint" or "Ice".
3. LIGHTING: Use professional studio lighting with rim lights to separate the product from the background.
4. COMPOSITION: Center the product. Use depth of field (bokeh) to slightly blur the background while keeping the product razor sharp.
5. STYLE: Modern, premium, clean, and appetizing.
6. COLOR PALETTE: Use colors that match the flavor (e.g., Purple/Blue for Wild Fruit, Yellow for Lemon, Green for Mint).

${strength === "EXTREME" || strength === "EXTRA" ? "MOOD: Intense, bold, dynamic, high contrast." : "MOOD: Fresh, clean, smooth, inviting."}

Output a photorealistic image that looks like a high-budget commercial ad.`;

        // Use Gemini model with image generation capability
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-image",
            generationConfig: {
                // @ts-ignore - experimental image generation config
                responseModalities: ["image", "text"],
            },
        });

        const result = await model.generateContent([
            {
                inlineData: {
                    mimeType: mimeType,
                    data: base64Image,
                },
            },
            { text: prompt },
        ]);

        const response = result.response;
        const candidates = response.candidates;

        if (!candidates || candidates.length === 0) {
            return NextResponse.json(
                { error: "No response from AI model" },
                { status: 500 }
            );
        }

        const parts = candidates[0].content?.parts;
        if (!parts) {
            return NextResponse.json(
                { error: "No content in response" },
                { status: 500 }
            );
        }

        // Find the image part in the response
        const imagePart = parts.find((part: any) => part.inlineData);

        if (!imagePart || !imagePart.inlineData) {
            // If no image, return text response for debugging
            const textPart = parts.find((part: any) => part.text);
            return NextResponse.json(
                { error: textPart?.text || "No image generated. The model may not support image generation." },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            image: {
                data: imagePart.inlineData.data,
                mimeType: imagePart.inlineData.mimeType || "image/png",
            },
        });

    } catch (error: any) {
        console.error("Error generating cover:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate cover" },
            { status: 500 }
        );
    }
}
