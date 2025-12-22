# Guia de Importação de Produtos - SnusMart Dataset

Este documento explica como importar produtos de novas marcas para a loja, utilizando o dataset do SnusMart.

## 📁 Estrutura do Dataset

O dataset está localizado em `/snusmart_data/` e contém:

```
snusmart_data/
├── images/                    # 532 imagens de produtos
├── products_json/             # Dados JSON por produto
└── snusmart_products.csv      # CSV com todos os produtos
```

### Formato do CSV

O arquivo `snusmart_products.csv` contém colunas:
- **Marca** - Nome da marca (ex: REBEL, KRATOS, PABLO)
- **Nome do Produto** - Nome completo
- **URL** - Link original do produto
- **Tags** - Sabor, força, etc.
- **SKU** - Código do produto
- **Preço** - Valor em EUR
- **Caminho da Imagem** - Localização da imagem original

---

## 🔧 Como Criar um Importador para Nova Marca

### Passo 1: Encontrar Produtos da Marca

```bash
# Ver quantos produtos cada marca tem
cut -d',' -f1 snusmart_data/snusmart_products.csv | sort | uniq -c | sort -rn

# Filtrar produtos de uma marca específica (ex: PABLO)
grep "PABLO" snusmart_data/snusmart_products.csv
```

### Passo 2: Copiar Imagens para `/public/products/`

```bash
# Criar pasta e copiar imagens
mkdir -p public/products/[marca]
cp snusmart_data/images/[marca]-* public/products/[marca]/
```

### Passo 3: Gerar Capas com Fundo Temático (Opcional)

Usar a ferramenta de geração de imagem para criar capas premium:
- Fundo gradiente relacionado ao sabor
- Elementos temáticos (frutas, gelo, mint, etc.)
- Iluminação profissional de e-commerce

### Passo 4: Criar o Arquivo Seed

Criar `/src/lib/firebase/seed-[marca].ts` com:

```typescript
import { collection, addDoc, serverTimestamp, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

const [MARCA]_PRODUCTS = [
    {
        name: "Nome do Produto",
        description: "Descrição detalhada",
        price: 3.69,
        sku: "[MARCA]-SKU-001",
        strength: "STRONG" | "MEDIUM" | "EXTRA" | "EXTREME" | "WEAK",
        flavor: "Sabor",
        images: [
            "/products/[marca]/capa.png",           // Capa gerada
            "/products/[marca]/original.jpg",       // Imagem original
        ],
        isFeatured: false,
        isBestSeller: false,
        isWeeklySpecial: false,
    },
    // ... mais produtos
];

function generateSlug(name: string): string {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export async function seed[Marca]Products(): Promise<{ success: boolean; count: number; message: string }> {
    try {
        // Verificar/criar marca
        const brandsRef = collection(db, "brands");
        const brandQuery = query(brandsRef, where("name", "==", "[Marca]"));
        const brandSnapshot = await getDocs(brandQuery);

        if (brandSnapshot.empty) {
            await addDoc(brandsRef, {
                name: "[Marca]",
                slug: "[marca]",
                description: "Descrição da marca",
                isActive: true,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
        }

        // Adicionar produtos (verificando duplicatas pelo SKU)
        const productsRef = collection(db, "products");
        const existingProducts = await getDocs(productsRef);
        const existingSkus = new Set(existingProducts.docs.map(doc => doc.data().sku));

        let addedCount = 0;

        for (const product of [MARCA]_PRODUCTS) {
            if (existingSkus.has(product.sku)) continue;

            await addDoc(productsRef, {
                ...product,
                category: "Nicotine Pouches",
                brand: "[Marca]",
                stock: 100,
                isActive: true,
                slug: generateSlug(product.name),
                compareAtPrice: null,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });
            addedCount++;
        }

        return {
            success: true,
            count: addedCount,
            message: `Successfully added ${addedCount} products!`
        };
    } catch (error: any) {
        return { success: false, count: 0, message: error.message };
    }
}
```

### Passo 5: Adicionar Botão no Admin

Em `/src/app/admin/products/page.tsx`:

1. Importar a função:
```typescript
import { seed[Marca]Products } from "@/lib/firebase/seed-[marca]";
```

2. Adicionar handler:
```typescript
const handleSeed[Marca] = async () => {
    setSeeding(true);
    try {
        const result = await seed[Marca]Products();
        if (result.success) {
            toast.success(result.message);
            if (result.count > 0) fetchProducts();
        } else {
            toast.error(result.message);
        }
    } catch (error: any) {
        toast.error(error.message || "Failed to seed products");
    } finally {
        setSeeding(false);
    }
};
```

3. Adicionar botão no JSX:
```tsx
<Button
    variant="outline"
    onClick={handleSeed[Marca]}
    disabled={seeding}
    className="h-10 px-4 bg-[cor]-500/10 border-[cor]-500/20 hover:bg-[cor]-500/20 text-[cor]-400 rounded-xl gap-2"
>
    {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
    {seeding ? "Importing..." : "Import [Marca]"}
</Button>
```

---

## 📊 Marcas Disponíveis no Dataset

### ✅ Já Importadas
| Marca | Produtos | Status |
|-------|----------|--------|
| KRATOS | 8 | ✅ Concluído |
| REBEL | 31 | ✅ Concluído |

### 📝 Pendentes de Importação (31 marcas, 464 produtos)

| Marca | Produtos | Descrição |
|-------|----------|-----------|
| **CUBA** | 46 | Maior variedade - Black, White, Ninja lines |
| **PABLO** | 44 | Popular - Ice Cold, Exclusive, Gold Edition |
| **ZEUS** | 40 | Premium - Legend, Arctic, vários sabores |
| **VELO** | 36 | BAT brand - Mini, Shift, várias intensidades |
| **77** | 32 | Diversos sabores e Ghost Mini line |
| **ICEBERG** | 29 | Gummy/Pie flavors, Dragon Fruit |
| **ZYN** | 26 | Philip Morris - Mini e Slim |
| **XQS** | 21 | Arctic Freeze, Cactus Sour, etc. |
| **BEZZER** | 21 | Blueberry, Cola, Mint, etc. |
| **CAMO** | 19 | Energy line, frutas e mints |
| **KILLA** | 17 | Popular - Cold Mint, Mini line |
| **RABBIT** | 12 | Blue Ice, Blueberry, Energy |
| **ICE** | 12 | Freeze, Frost, Grape, Lemon |
| **CLEW** | 12 | Cool Mint, Spearmint, etc. |
| **VONT** | 10 | Variados |
| **STNG** | 10 | Berry, Bubble, Double Mint |
| **NOIS** | 10 | Cool Strong, Cherry, Extreme |
| **RUSH** | 9 | Pro e Extreme lines |
| **KORS** | 9 | Cool Mint, Energy, Lemon |
| **PUFF & POUCH** | 8 | Berries, Citrus, Ice |
| **GARANT** | 8 | Extreme Edition, Ice Cool |
| **SNOWMAN** | 7 | Arctic Kick, Fresh Mint |
| **JIXX** | 7 | Bubblegum, Cola, Freeze |
| **SKRUF** | 6 | Crystal, Fresh Mint, Polar |
| **GREATEST** | 6 | Cold Dry, Arctic, Mega Can |
| **GLITCH** | 6 | Blueberry, Cool Ice, Kiwi |
| **ACE** | 6 | Cool Mint, Eucalyptus, X series |
| **WHITE FOX** | 5 | All White, Black, Double Mint |
| **ATHENA** | 5 | Arctic Mint, Peppermint, Watermelon |
| **SIBERIA** | 4 | Regular, Slim, Super Slim |
| **LIPS** | 2 | Original, Strawberry |
| **XTRIME** | 1 | X Freeze |

---

## 🎨 Cores Sugeridas por Marca (para botões)

| Marca | Cor | Classe TailwindCSS |
|-------|-----|-------------------|
| PABLO | Vermelho | `red-500` |
| VELO | Azul | `blue-500` |
| ZYN | Verde | `green-500` |
| ICEBERG | Ciano | `cyan-500` |
| KILLA | Roxo | `purple-500` |
| CUBA | Dourado | `amber-500` |
| ZEUS | Amarelo | `yellow-500` |
| WHITE FOX | Branco/Cinza | `zinc-400` |

---

## 🚀 Próximos Passos Recomendados

1. **Priorizar marcas populares**: PABLO, VELO, ZYN, ICEBERG, KILLA
2. **Gerar capas premium** para os products featured/bestseller
3. **Criar categorias** por linha de produto (Energy, Mini, etc.)
4. **Automatizar** o processo com um script que lê diretamente do CSV

---

## 📝 Notas

- O limite de geração de imagens é temporário (reseta a cada ~4h)
- Sempre verificar duplicatas pelo SKU antes de importar
- As imagens originais são JPG, as capas geradas são PNG
- O preço padrão é €3.69 mas pode variar por produto
