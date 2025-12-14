# 🚀 Plano de Desenvolvimento - SnusIdea Marketplace

## 📋 Visão Geral

Este documento detalha o plano completo para transformar a SnusIdea em uma plataforma marketplace completa estilo Amazon/Shopify para produtos de snus, com sistema de autenticação dupla (compradores e vendedores), criação de lojas, gestão de produtos e integração com Stripe.

---

## 📑 Índice Rápido

- [Objetivos Principais](#-objetivos-principais)
- [Migração Supabase → Firebase](#️-migração-do-supabase-para-firebase)
- [Arquitetura Firebase](#️-arquitetura-firebase)
- [Fases de Desenvolvimento](#-fases-de-desenvolvimento)
  - [Fase 1: Autenticação](#-fase-1-configuração-base-e-autenticação-semana-1-2)
  - [Fase 2: Sistema de Lojas](#️-fase-2-sistema-de-lojas-semana-3-4)
  - [Fase 3: Gestão de Produtos](#-fase-3-gestão-de-produtos-semana-5-7)
  - [Fase 4: Carrinho e Checkout](#️-fase-4-carrinho-e-checkout-semana-8-9)
  - [Fase 5: Integração Stripe](#-fase-5-integração-stripe-semana-10-11)
  - [Fase 6-12: Funcionalidades Avançadas](#-fase-6-páginas-adicionais-semana-12)
- [Prioridades](#-prioridades-e-ordem-de-implementação)
- [Próximos Passos](#-próximos-passos-imediatos)

---

## 🎯 Resumo Executivo

### O que vamos construir?

Uma plataforma marketplace completa onde:
- **Compradores** podem navegar, comprar produtos de múltiplas lojas
- **Vendedores** podem criar suas próprias lojas, adicionar produtos e gerenciar vendas
- **Sistema de pagamento** seguro com Stripe
- **Experiência** similar ao Shopify para vendedores e Amazon para compradores

### Tecnologias Principais

- **Frontend**: Next.js 16, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Pagamentos**: Stripe
- **Deploy**: Vercel

### Timeline Estimado

- **MVP (Fases 1-5)**: 11 semanas
- **Versão Completa (Fases 1-12)**: 16+ semanas
- **Melhorias Contínuas**: Ongoing

---

## 🎯 Objetivos Principais

1. **Sistema de Autenticação Dupla**: Login separado para compradores e vendedores
2. **Criação de Lojas**: Vendedores podem criar e personalizar suas próprias lojas
3. **Gestão de Produtos**: Sistema completo de CRUD de produtos estilo Shopify
4. **Páginas de Produtos**: Páginas detalhadas de produtos com galeria, reviews, etc.
5. **Carrinho e Checkout**: Sistema completo de compras
6. **Integração Stripe**: Processamento de pagamentos seguro
7. **Dashboard de Vendedor**: Painel completo para gerenciar loja, produtos e pedidos

---

## ⚠️ Migração do Supabase para Firebase

### Passos de Migração

1. **Remover Dependências do Supabase**:
   ```bash
   npm uninstall @supabase/ssr @supabase/supabase-js
   ```

2. **Instalar Firebase**:
   ```bash
   npm install firebase
   ```

3. **Criar Arquivo de Configuração**:
   - Criar `lib/firebase/config.ts` com as credenciais fornecidas
   - Substituir todas as importações do Supabase por Firebase

4. **Atualizar Variáveis de Ambiente**:
   - Remover variáveis `NEXT_PUBLIC_SUPABASE_*`
   - Adicionar variáveis `NEXT_PUBLIC_FIREBASE_*` conforme `.env.example`

5. **Migrar Dados** (se houver):
   - Exportar dados do Supabase
   - Importar para Firestore (se necessário)

---

## 🏗️ Arquitetura Firebase

### Configuração Inicial

```typescript
// lib/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCdSah4hR-fMh3S2wB71j9OnOOI949Y314",
  authDomain: "snusidea.firebaseapp.com",
  databaseURL: "https://snusidea-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "snusidea",
  storageBucket: "snusidea.firebasestorage.app",
  messagingSenderId: "850638357570",
  appId: "1:850638357570:web:c476c45c41cf58254e99db"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

### Estrutura de Coleções Firestore

```
firestore/
├── users/                    # Perfis de usuários
│   └── {userId}/
│       ├── email: string
│       ├── displayName: string
│       ├── role: "buyer" | "seller" | "admin"
│       ├── createdAt: timestamp
│       ├── avatarUrl?: string
│       └── preferences: {}
│
├── stores/                   # Lojas dos vendedores
│   └── {storeId}/
│       ├── ownerId: string (userId)
│       ├── name: string
│       ├── slug: string (URL única)
│       ├── description: string
│       ├── logoUrl?: string
│       ├── bannerUrl?: string
│       ├── domain?: string (ex: mystore.snusidea.com)
│       ├── settings: {
│       │   ├── theme: "light" | "dark"
│       │   ├── primaryColor: string
│       │   └── currency: string
│       │ }
│       ├── isActive: boolean
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── products/                 # Produtos
│   └── {productId}/
│       ├── storeId: string
│       ├── name: string
│       ├── slug: string
│       ├── description: string
│       ├── shortDescription?: string
│       ├── price: number
│       ├── compareAtPrice?: number (preço original)
│       ├── cost?: number (custo para o vendedor)
│       ├── sku: string
│       ├── barcode?: string
│       ├── images: string[] (URLs do Firebase Storage)
│       ├── category: string
│       ├── tags: string[]
│       ├── brand?: string
│       ├── strength?: string (0-8mg, 9-16mg, etc.)
│       ├── flavor?: string[]
│       ├── stock: number
│       ├── trackInventory: boolean
│       ├── weight?: number (gramas)
│       ├── dimensions?: {
│       │   ├── length: number
│       │   ├── width: number
│       │   └── height: number
│       │ }
│       ├── isActive: boolean
│       ├── isFeatured: boolean
│       ├── views: number
│       ├── sales: number
│       ├── rating: number (0-5)
│       ├── reviewCount: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── categories/               # Categorias de produtos
│   └── {categoryId}/
│       ├── name: string
│       ├── slug: string
│       ├── description?: string
│       ├── imageUrl?: string
│       ├── parentId?: string (para subcategorias)
│       ├── order: number
│       └── isActive: boolean
│
├── cart/                     # Carrinhos de compra
│   └── {userId}/
│       ├── items: [{
│       │   ├── productId: string
│       │   ├── quantity: number
│       │   ├── price: number (preço no momento da adição)
│       │   └── addedAt: timestamp
│       │ }]
│       ├── updatedAt: timestamp
│       └── expiresAt: timestamp
│
├── orders/                   # Pedidos
│   └── {orderId}/
│       ├── userId: string
│       ├── storeId: string
│       ├── orderNumber: string (ex: ORD-2024-001234)
│       ├── status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
│       ├── items: [{
│       │   ├── productId: string
│       │   ├── productName: string
│       │   ├── quantity: number
│       │   ├── price: number
│       │   └── imageUrl: string
│       │ }]
│       ├── subtotal: number
│       ├── shipping: number
│       ├── tax: number
│       ├── total: number
│       ├── currency: string
│       ├── shippingAddress: {
│       │   ├── name: string
│       │   ├── street: string
│       │   ├── city: string
│       │   ├── state: string
│       │   ├── zipCode: string
│       │   ├── country: string
│       │   └── phone: string
│       │ }
│       ├── billingAddress: {}
│       ├── paymentMethod: string
│       ├── paymentStatus: "pending" | "paid" | "failed" | "refunded"
│       ├── stripePaymentIntentId?: string
│       ├── trackingNumber?: string
│       ├── notes?: string
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── reviews/                  # Avaliações de produtos
│   └── {reviewId}/
│       ├── productId: string
│       ├── userId: string
│       ├── orderId?: string (verificação de compra)
│       ├── rating: number (1-5)
│       ├── title?: string
│       ├── comment: string
│       ├── images?: string[]
│       ├── isVerified: boolean
│       ├── helpful: number
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
└── analytics/                # Analytics (opcional, para dashboard)
    └── {storeId}/
        └── {date}/
            ├── views: number
            ├── sales: number
            ├── revenue: number
            └── topProducts: []
```

---

## 📦 Fase 1: Configuração Base e Autenticação (Semana 1-2)

### 1.1 Setup Firebase
- [ ] Criar arquivo `lib/firebase/config.ts` com configuração
- [ ] Criar `lib/firebase/auth.ts` com funções de autenticação
- [ ] Criar `lib/firebase/firestore.ts` com helpers do Firestore
- [ ] Criar `lib/firebase/storage.ts` com helpers do Storage
- [ ] Configurar variáveis de ambiente no `.env.local`
- [ ] Instalar dependências: `firebase`, `@firebase/auth`, etc.

### 1.2 Sistema de Autenticação
- [ ] Criar `src/contexts/AuthContext.tsx` para gerenciar estado de autenticação
- [ ] Atualizar `src/app/login/page.tsx`:
  - [ ] Formulário de login (email/senha)
  - [ ] Opção de login como comprador ou vendedor
  - [ ] Link para registro
  - [ ] Recuperação de senha
  - [ ] OAuth (Google, Facebook) - opcional
- [ ] Criar `src/app/signup/page.tsx`:
  - [ ] Formulário de registro
  - [ ] Seleção de tipo: Comprador ou Vendedor
  - [ ] Validação de email
  - [ ] Criação de perfil no Firestore após registro
- [ ] Criar middleware de autenticação `src/middleware.ts`
- [ ] Criar hooks: `useAuth.ts`, `useUser.ts`
- [ ] Proteger rotas com autenticação

### 1.3 Tipos TypeScript
- [ ] Criar `src/types/user.ts`:
  ```typescript
  export type UserRole = "buyer" | "seller" | "admin";
  export interface User {
    id: string;
    email: string;
    displayName: string;
    role: UserRole;
    createdAt: Timestamp;
    avatarUrl?: string;
  }
  ```
- [ ] Criar `src/types/store.ts`
- [ ] Criar `src/types/product.ts`
- [ ] Criar `src/types/order.ts`

---

## 🏪 Fase 2: Sistema de Lojas (Semana 3-4)

### 2.1 Criação de Loja
- [ ] Criar `src/app/seller/create-store/page.tsx`:
  - [ ] Formulário de criação de loja
  - [ ] Upload de logo (Firebase Storage)
  - [ ] Upload de banner
  - [ ] Validação de slug único
  - [ ] Preview da loja
- [ ] Criar função `createStore()` em `lib/firebase/stores.ts`
- [ ] Validar se usuário já tem loja (um vendedor = uma loja)
- [ ] Criar documento na coleção `stores` do Firestore

### 2.2 Página da Loja
- [ ] Criar `src/app/store/[slug]/page.tsx`:
  - [ ] Buscar dados da loja no Firestore
  - [ ] Exibir produtos da loja
  - [ ] Header personalizado da loja
  - [ ] Banner e logo
  - [ ] Informações da loja
- [ ] Criar componente `src/components/store/StoreHeader.tsx`
- [ ] Criar componente `src/components/store/StoreProducts.tsx`

### 2.3 Dashboard do Vendedor
- [ ] Criar `src/app/seller/dashboard/page.tsx`:
  - [ ] Estatísticas rápidas (vendas, produtos, pedidos)
  - [ ] Gráficos de vendas (usar biblioteca de gráficos)
  - [ ] Últimos pedidos
  - [ ] Produtos mais vendidos
- [ ] Criar `src/app/seller/dashboard/layout.tsx` com sidebar de navegação
- [ ] Criar componentes:
  - [ ] `src/components/seller/StatsCard.tsx`
  - [ ] `src/components/seller/SalesChart.tsx`
  - [ ] `src/components/seller/RecentOrders.tsx`

### 2.4 Configurações da Loja
- [ ] Criar `src/app/seller/settings/page.tsx`:
  - [ ] Editar informações da loja
  - [ ] Upload de logo/banner
  - [ ] Configurações de tema
  - [ ] Configurações de domínio
  - [ ] Configurações de pagamento (Stripe Connect - futuro)

---

## 📦 Fase 3: Gestão de Produtos (Semana 5-7)

### 3.1 Listagem de Produtos
- [ ] Criar `src/app/seller/products/page.tsx`:
  - [ ] Tabela/listagem de produtos
  - [ ] Filtros e busca
  - [ ] Paginação
  - [ ] Ações: editar, deletar, ativar/desativar
- [ ] Criar componente `src/components/seller/ProductTable.tsx`
- [ ] Criar componente `src/components/seller/ProductCard.tsx`

### 3.2 Criação/Edição de Produtos
- [ ] Criar `src/app/seller/products/new/page.tsx`:
  - [ ] Formulário completo de produto
  - [ ] Upload múltiplo de imagens (Firebase Storage)
  - [ ] Editor de descrição rico (usar react-quill ou similar)
  - [ ] Seleção de categoria
  - [ ] Tags
  - [ ] Informações de estoque
  - [ ] Preços (preço de venda, preço comparativo)
  - [ ] Dimensões e peso
  - [ ] Preview do produto
- [ ] Criar `src/app/seller/products/[id]/edit/page.tsx` (similar)
- [ ] Criar componentes:
  - [ ] `src/components/seller/ProductForm.tsx`
  - [ ] `src/components/seller/ImageUpload.tsx`
  - [ ] `src/components/seller/CategorySelector.tsx`

### 3.3 Página Pública de Produto
- [ ] Criar `src/app/product/[slug]/page.tsx`:
  - [ ] Galeria de imagens (swiper/carousel)
  - [ ] Informações do produto
  - [ ] Seleção de quantidade
  - [ ] Botão "Adicionar ao carrinho"
  - [ ] Descrição detalhada
  - [ ] Especificações
  - [ ] Avaliações e reviews
  - [ ] Produtos relacionados
  - [ ] Breadcrumbs
- [ ] Criar componentes:
  - [ ] `src/components/product/ProductGallery.tsx`
  - [ ] `src/components/product/ProductInfo.tsx`
  - [ ] `src/components/product/ProductReviews.tsx`
  - [ ] `src/components/product/RelatedProducts.tsx`

### 3.4 Categorias
- [ ] Criar `src/app/categories/[slug]/page.tsx`:
  - [ ] Listagem de produtos por categoria
  - [ ] Filtros (preço, marca, força, sabor)
  - [ ] Ordenação (preço, popularidade, novo)
  - [ ] Paginação
- [ ] Criar componente `src/components/category/ProductFilters.tsx`
- [ ] Criar componente `src/components/category/ProductGrid.tsx`

---

## 🛒 Fase 4: Carrinho e Checkout (Semana 8-9)

### 4.1 Sistema de Carrinho
- [ ] Criar `src/contexts/CartContext.tsx`:
  - [ ] Gerenciar estado do carrinho
  - [ ] Sincronizar com Firestore (coleção `cart`)
  - [ ] Persistir carrinho entre sessões
- [ ] Atualizar `src/components/cart/Cart.tsx`:
  - [ ] Listar itens do carrinho
  - [ ] Atualizar quantidades
  - [ ] Remover itens
  - [ ] Calcular totais
  - [ ] Botão para checkout
- [ ] Criar componente `src/components/cart/CartItem.tsx`
- [ ] Criar hook `useCart.ts`

### 4.2 Página de Checkout
- [ ] Criar `src/app/checkout/page.tsx`:
  - [ ] Resumo do pedido
  - [ ] Formulário de endereço de entrega
  - [ ] Formulário de endereço de cobrança
  - [ ] Seleção de método de envio
  - [ ] Cálculo de frete (simulado inicialmente)
  - [ ] Cálculo de impostos
  - [ ] Integração Stripe (botão de pagamento)
- [ ] Criar componentes:
  - [ ] `src/components/checkout/CheckoutForm.tsx`
  - [ ] `src/components/checkout/OrderSummary.tsx`
  - [ ] `src/components/checkout/ShippingForm.tsx`
  - [ ] `src/components/checkout/PaymentForm.tsx`

### 4.3 Processamento de Pedido
- [ ] Criar função `createOrder()` em `lib/firebase/orders.ts`
- [ ] Após pagamento bem-sucedido:
  - [ ] Criar documento na coleção `orders`
  - [ ] Atualizar estoque dos produtos
  - [ ] Limpar carrinho
  - [ ] Enviar email de confirmação (futuro)
  - [ ] Redirecionar para página de sucesso

---

## 💳 Fase 5: Integração Stripe (Semana 10-11)

### 5.1 Setup Stripe
- [ ] Instalar `@stripe/stripe-js` e `stripe`
- [ ] Configurar variáveis de ambiente do Stripe
- [ ] Criar `lib/stripe/config.ts`
- [ ] Criar API route `src/app/api/stripe/create-payment-intent/route.ts`

### 5.2 Checkout com Stripe
- [ ] Integrar Stripe Elements no formulário de pagamento
- [ ] Criar Payment Intent no backend
- [ ] Processar pagamento no frontend
- [ ] Criar webhook `src/app/api/stripe/webhook/route.ts`:
  - [ ] `payment_intent.succeeded` - confirmar pedido
  - [ ] `payment_intent.payment_failed` - cancelar pedido
- [ ] Atualizar status do pedido após pagamento

### 5.3 Gestão de Pagamentos
- [ ] Criar `src/app/seller/payments/page.tsx`:
  - [ ] Histórico de pagamentos
  - [ ] Saldo pendente/disponível
  - [ ] Configurações de conta bancária (Stripe Connect - futuro)

---

## 📄 Fase 6: Páginas Adicionais (Semana 12)

### 6.1 Página de Loja (Shop)
- [ ] Criar `src/app/shop/page.tsx`:
  - [ ] Listagem de todos os produtos do marketplace
  - [ ] Filtros avançados
  - [ ] Busca
  - [ ] Ordenação
  - [ ] Paginação

### 6.2 Página de Marketplace
- [ ] Criar `src/app/marketplace/page.tsx`:
  - [ ] Listagem de todas as lojas
  - [ ] Busca de lojas
  - [ ] Filtros por categoria
  - [ ] Cards de lojas em destaque

### 6.3 Página de Vendedores
- [ ] Criar `src/app/sellers/page.tsx`:
  - [ ] Diretório de vendedores
  - [ ] Perfis de vendedores
  - [ ] Estatísticas públicas

### 6.4 Página de Pedidos (Comprador)
- [ ] Criar `src/app/account/orders/page.tsx`:
  - [ ] Listagem de pedidos do usuário
  - [ ] Detalhes do pedido
  - [ ] Rastreamento de envio
  - [ ] Cancelamento de pedido

### 6.5 Página de Pedidos (Vendedor)
- [ ] Criar `src/app/seller/orders/page.tsx`:
  - [ ] Listagem de pedidos da loja
  - [ ] Filtros por status
  - [ ] Atualização de status
  - [ ] Upload de número de rastreamento
  - [ ] Impressão de etiqueta de envio

---

## 🔍 Fase 7: Busca e Filtros Avançados (Semana 13)

### 7.1 Sistema de Busca
- [ ] Melhorar `src/components/search/SearchOverlay.tsx`:
  - [ ] Busca em tempo real no Firestore
  - [ ] Sugestões de busca
  - [ ] Busca por produto, loja, categoria
  - [ ] Histórico de buscas
- [ ] Criar `src/app/search/page.tsx`:
  - [ ] Resultados de busca
  - [ ] Filtros laterais
  - [ ] Ordenação

### 7.2 Filtros Avançados
- [ ] Criar componente `src/components/filters/ProductFilters.tsx`:
  - [ ] Filtro por preço (slider)
  - [ ] Filtro por categoria
  - [ ] Filtro por marca
  - [ ] Filtro por força (mg)
  - [ ] Filtro por sabor
  - [ ] Filtro por disponibilidade
- [ ] Implementar filtros no Firestore queries

---

## ⭐ Fase 8: Reviews e Avaliações (Semana 14)

### 8.1 Sistema de Reviews
- [ ] Criar `src/components/product/ProductReviews.tsx`:
  - [ ] Listagem de reviews
  - [ ] Formulário de review (após compra verificada)
  - [ ] Upload de imagens nas reviews
  - [ ] Sistema de "útil" (helpful)
  - [ ] Filtros (mais recentes, mais úteis, por rating)
- [ ] Criar função `createReview()` em `lib/firebase/reviews.ts`
- [ ] Atualizar rating médio do produto após review

### 8.2 Moderação
- [ ] Criar `src/app/seller/reviews/page.tsx`:
  - [ ] Listagem de reviews dos produtos da loja
  - [ ] Responder reviews
  - [ ] Reportar reviews inapropriadas

---

## 📊 Fase 9: Analytics e Relatórios (Semana 15)

### 9.1 Dashboard Analytics
- [ ] Expandir `src/app/seller/dashboard/page.tsx`:
  - [ ] Gráfico de vendas por período
  - [ ] Gráfico de produtos mais vendidos
  - [ ] Gráfico de receita
  - [ ] Métricas de conversão
  - [ ] Tráfego da loja
- [ ] Usar biblioteca de gráficos (recharts, chart.js)

### 9.2 Relatórios
- [ ] Criar `src/app/seller/reports/page.tsx`:
  - [ ] Relatório de vendas
  - [ ] Relatório de produtos
  - [ ] Relatório de clientes
  - [ ] Exportar para CSV/PDF

---

## 🔔 Fase 10: Notificações e Comunicação (Semana 16)

### 10.1 Notificações em Tempo Real
- [ ] Usar Firestore listeners para notificações:
  - [ ] Novos pedidos (vendedor)
  - [ ] Atualização de status (comprador)
  - [ ] Novos reviews
- [ ] Criar componente `src/components/notifications/NotificationBell.tsx`
- [ ] Criar `src/app/notifications/page.tsx`

### 10.2 Emails (Futuro)
- [ ] Configurar Firebase Extensions para emails
- [ ] Email de confirmação de pedido
- [ ] Email de envio
- [ ] Email de boas-vindas

---

## 🎨 Fase 11: UI/UX e Responsividade (Ongoing)

### 11.1 Design System
- [ ] Padronizar componentes UI
- [ ] Criar tema consistente
- [ ] Melhorar animações
- [ ] Otimizar performance

### 11.2 Mobile
- [ ] Testar e ajustar todas as páginas no mobile
- [ ] Criar versão mobile do dashboard do vendedor
- [ ] Otimizar carrinho para mobile

---

## 🔒 Fase 12: Segurança e Performance (Ongoing)

### 12.1 Firebase Security Rules
- [ ] Criar regras para Firestore:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      // Users podem ler/escrever apenas seus próprios dados
      match /users/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Stores: apenas o dono pode editar
      match /stores/{storeId} {
        allow read: if true; // Público pode ler
        allow write: if request.auth != null && 
                        resource.data.ownerId == request.auth.uid;
      }
      
      // Products: apenas dono da loja pode editar
      match /products/{productId} {
        allow read: if true;
        allow create: if request.auth != null && 
                         get(/databases/$(database)/documents/stores/$(request.resource.data.storeId)).data.ownerId == request.auth.uid;
        allow update, delete: if request.auth != null && 
                                 get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid;
      }
      
      // Orders: usuário pode ler seus pedidos, vendedor pode ler pedidos da sua loja
      match /orders/{orderId} {
        allow read: if request.auth != null && 
                       (resource.data.userId == request.auth.uid || 
                        get(/databases/$(database)/documents/stores/$(resource.data.storeId)).data.ownerId == request.auth.uid);
        allow create: if request.auth != null && 
                         request.resource.data.userId == request.auth.uid;
      }
      
      // Cart: apenas o dono pode acessar
      match /cart/{userId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```
- [ ] Criar regras para Storage:
  ```javascript
  rules_version = '2';
  service firebase.storage {
    match /b/{bucket}/o {
      // Produtos: apenas vendedores podem fazer upload
      match /products/{productId}/{allPaths=**} {
        allow read: if true;
        allow write: if request.auth != null && 
                        request.resource.size < 5 * 1024 * 1024; // Max 5MB
      }
      
      // Avatares: usuários podem fazer upload do próprio avatar
      match /avatars/{userId}/{allPaths=**} {
        allow read: if true;
        allow write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
  ```

### 12.2 Performance
- [ ] Implementar paginação em todas as listagens
- [ ] Otimizar queries do Firestore (índices)
- [ ] Implementar cache onde apropriado
- [ ] Lazy loading de imagens
- [ ] Code splitting

### 12.3 SEO
- [ ] Meta tags dinâmicas
- [ ] Sitemap.xml
- [ ] robots.txt
- [ ] Structured data (JSON-LD)

---

## 📱 Estrutura de Arquivos Final

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── signup/
│   ├── (buyer)/
│   │   ├── account/
│   │   │   ├── orders/
│   │   │   └── settings/
│   │   ├── shop/
│   │   ├── product/[slug]/
│   │   ├── category/[slug]/
│   │   ├── store/[slug]/
│   │   ├── marketplace/
│   │   ├── sellers/
│   │   ├── checkout/
│   │   └── search/
│   ├── (seller)/
│   │   ├── seller/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   │   ├── new/
│   │   │   │   └── [id]/edit/
│   │   │   ├── orders/
│   │   │   ├── settings/
│   │   │   ├── reviews/
│   │   │   ├── payments/
│   │   │   └── reports/
│   │   └── create-store/
│   ├── api/
│   │   └── stripe/
│   │       ├── create-payment-intent/
│   │       └── webhook/
│   └── layout.tsx
├── components/
│   ├── auth/
│   ├── product/
│   ├── store/
│   ├── seller/
│   ├── cart/
│   ├── checkout/
│   ├── filters/
│   ├── notifications/
│   └── ui/
├── contexts/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/
│   ├── firebase/
│   │   ├── config.ts
│   │   ├── auth.ts
│   │   ├── firestore.ts
│   │   ├── storage.ts
│   │   ├── stores.ts
│   │   ├── products.ts
│   │   ├── orders.ts
│   │   └── reviews.ts
│   └── stripe/
│       └── config.ts
└── types/
    ├── user.ts
    ├── store.ts
    ├── product.ts
    ├── order.ts
    └── review.ts
```

---

## 🎯 Prioridades e Ordem de Implementação

### Prioridade ALTA (MVP - Minimum Viable Product)
1. ✅ Fase 1: Autenticação
2. ✅ Fase 2: Sistema de Lojas
3. ✅ Fase 3: Gestão de Produtos (básico)
4. ✅ Fase 4: Carrinho e Checkout
5. ✅ Fase 5: Integração Stripe

### Prioridade MÉDIA
6. ✅ Fase 6: Páginas Adicionais
7. ✅ Fase 7: Busca e Filtros
8. ✅ Fase 8: Reviews

### Prioridade BAIXA (Melhorias)
9. ✅ Fase 9: Analytics
10. ✅ Fase 10: Notificações
11. ✅ Fase 11: UI/UX
12. ✅ Fase 12: Segurança e Performance

---

## 📝 Checklist de Dependências

### NPM Packages Necessários

#### Instalar Firebase (remover Supabase primeiro)
```bash
npm uninstall @supabase/ssr @supabase/supabase-js
npm install firebase
```

#### Instalar Dependências Adicionais
```bash
npm install @stripe/stripe-js stripe react-hook-form zod @hookform/resolvers react-quill recharts date-fns react-hot-toast
```

#### Package.json Completo
```json
{
  "dependencies": {
    "firebase": "^10.7.1",
    "@stripe/stripe-js": "^2.4.0",
    "stripe": "^14.21.0",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.4",
    "react-quill": "^2.0.0",
    "recharts": "^2.10.3",
    "date-fns": "^3.0.6",
    "react-hot-toast": "^2.4.1"
  }
}
```

---

## 🚀 Próximos Passos Imediatos

### Semana 1 - Setup Inicial

1. **Migrar de Supabase para Firebase**:
   ```bash
   # Remover Supabase
   npm uninstall @supabase/ssr @supabase/supabase-js
   
   # Instalar Firebase
   npm install firebase
   
   # Instalar outras dependências
   npm install react-hook-form zod @hookform/resolvers react-hot-toast
   ```

2. **Configurar Firebase**:
   - Criar `lib/firebase/config.ts` com as credenciais fornecidas
   - Criar `.env.local` com as variáveis de ambiente
   - Testar conexão com Firebase Console

3. **Criar Estrutura Base**:
   - Criar pasta `lib/firebase/` com arquivos:
     - `config.ts` - Configuração inicial
     - `auth.ts` - Funções de autenticação
     - `firestore.ts` - Helpers do Firestore
     - `storage.ts` - Helpers do Storage
   - Criar pasta `types/` com todos os tipos TypeScript

4. **Implementar Autenticação Básica**:
   - Criar `contexts/AuthContext.tsx`
   - Atualizar `app/login/page.tsx`
   - Criar `app/signup/page.tsx`
   - Testar login/registro

5. **Setup Firestore**:
   - Criar Security Rules básicas
   - Criar índices necessários
   - Testar escrita/leitura de dados

---

## 📚 Recursos e Documentação

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Data Modeling](https://firebase.google.com/docs/firestore/manage-data/structure-data)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js App Router](https://nextjs.org/docs/app)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Última atualização**: [Data]
**Versão**: 1.0.0

