# 🚀 SNUSIDEA - Project Status & Roadmap

> **Última atualização:** 21 de Dezembro, 2024

---

## 📊 Status Atual do Projeto

### ✅ O QUE ESTÁ FEITO

#### **Frontend & Design**
| Feature | Status | Notas |
|---------|--------|-------|
| Homepage | ✅ Completo | Hero, carrossel de produtos, deals, newsletter |
| Shop Page | ✅ Completo | Filtros (brands, strength, flavor, price), ordenação, breadcrumbs |
| Product Page | ✅ Completo | Galeria de imagens, seletor de quantidade, add to cart |
| Header/Navbar | ✅ Completo | Mega menus, brands dinâmicas, search, cart, login |
| Footer | ✅ Completo | Links, newsletter, redes sociais |
| Mobile Menu | ✅ Completo | Responsivo com animações |
| Dark Mode | ✅ Completo | Suporte completo em todas as páginas |

#### **Autenticação**
| Feature | Status | Notas |
|---------|--------|-------|
| Login | ✅ Completo | Email/password + Google |
| Registro | ✅ Completo | Com verificação de dados |
| Logout | ✅ Completo | |
| Contexto de Auth | ✅ Completo | useAuth hook |
| Roles (admin/user) | ✅ Completo | Controle de acesso |

#### **Carrinho**
| Feature | Status | Notas |
|---------|--------|-------|
| Adicionar ao carrinho | ✅ Completo | Com seleção de pack size |
| Remover itens | ✅ Completo | |
| Atualizar quantidade | ✅ Completo | |
| Cálculo de totais | ✅ Completo | |
| Persistência (Zustand) | ✅ Completo | Persiste no localStorage |
| Cart Sheet/Drawer | ✅ Completo | Animado com Framer Motion |

#### **Admin Dashboard**
| Feature | Status | Notas |
|---------|--------|-------|
| Layout do Admin | ✅ Completo | Sidebar, header |
| Dashboard Overview | ✅ Completo | Métricas, gráficos |
| Gestão de Produtos | ✅ Completo | CRUD completo com Firebase |
| Gestão de Brands | ✅ Completo | CRUD completo |
| Upload de Imagens | ✅ Completo | Com compressão |
| Página de Analytics | 🔶 Parcial | UI pronta, dados mock |
| Página de Orders | 🔶 Parcial | UI pronta, sem conexão real |
| Página de Customers | 🔶 Parcial | UI pronta, dados mock |
| Página de Settings | 🔶 Parcial | UI pronta |

#### **Páginas de Suporte**
| Feature | Status | Notas |
|---------|--------|-------|
| Contact Us | ✅ Completo | Formulário + info de contato |
| FAQs | ✅ Completo | Categorizado, pesquisável |
| Shipping Info | ✅ Completo | Zonas, preços, políticas |
| Track Order | ✅ Completo | UI pronta (demo funcional) |

#### **Firebase**
| Feature | Status | Notas |
|---------|--------|-------|
| Configuração | ✅ Completo | |
| Auth | ✅ Completo | |
| Firestore (Products) | ✅ Completo | CRUD |
| Firestore (Brands) | ✅ Completo | CRUD |
| Storage (Images) | ✅ Completo | Upload e delete |

---

## ⚠️ O QUE FALTA IMPLEMENTAR

### 🔴 **CRÍTICO - Necessário para lançar**

#### 1. Sistema de Checkout
```
[ ] Página de checkout (/checkout)
    [ ] Formulário de endereço de envio
    [ ] Seleção de método de envio
    [ ] Cálculo de frete
    [ ] Resumo do pedido
    [ ] Validação de campos
```

#### 2. Integração de Pagamento
```
[ ] Stripe/PayPal integration
    [ ] Configurar API keys
    [ ] Payment intent/session
    [ ] Webhook para confirmação
    [ ] Página de sucesso/falha
    [ ] Armazenar transação no Firebase
```

#### 3. Sistema de Pedidos
```
[ ] Criar pedido no Firebase após pagamento
    [ ] Estrutura: orders/{orderId}
    [ ] Campos: userId, items, total, status, timestamps
    [ ] Gerar número de pedido único
[ ] Decrementar stock dos produtos
[ ] Histórico de pedidos do usuário (conectar OrderHistorySheet)
[ ] Admin: ver/gerenciar pedidos reais
[ ] Atualização de status (pending → processing → shipped → delivered)
```

#### 4. Emails Transacionais
```
[ ] Configurar serviço (SendGrid, Resend, etc)
[ ] Email de confirmação de pedido
[ ] Email de atualização de status
[ ] Email de recuperação de senha
[ ] Email de boas-vindas
```

#### 5. Verificação de Idade
```
[ ] Modal/página de verificação 18+
[ ] Armazenar confirmação (cookie/localStorage)
[ ] Bloquear acesso se não confirmar
[ ] Checkbox no checkout
```

---

### 🟡 **IMPORTANTE - Melhora a experiência**

#### Perfil do Usuário
```
[ ] Página de perfil (/account ou /profile)
[ ] Editar informações pessoais
[ ] Gerenciar endereços salvos
[ ] Ver histórico de pedidos
[ ] Alterar senha
```

#### Reviews & Ratings
```
[ ] Estrutura no Firebase: reviews/{reviewId}
[ ] Componente de estrelas
[ ] Formulário de review (apenas compradores)
[ ] Média de rating no produto
[ ] Lista de reviews na página do produto
```

#### Wishlist
```
[ ] Botão de favorito nos produtos
[ ] Página de wishlist
[ ] Persistência no Firebase (se logado) ou localStorage
```

#### Sistema de Cupons
```
[ ] CRUD de cupons no admin
[ ] Campo de cupom no checkout
[ ] Cálculo de desconto
[ ] Validação (expiração, uso único, etc)
```

---

### 🟢 **NICE-TO-HAVE - Diferencial competitivo**

```
[ ] Notificações push (atualizações de pedido)
[ ] Sistema de pontos/recompensas
[ ] "Frequentemente comprados juntos"
[ ] Comparador de produtos
[ ] Filtro por sabor mais detalhado
[ ] Blog/conteúdo sobre snus
[ ] Programa de afiliados
[ ] Multi-idioma (PT, EN, ES)
[ ] Chat ao vivo com suporte
[ ] Integração com transportadoras (CTT, DHL API)
```

---

## 🎨 Avaliação do Design

### ✨ Pontos Fortes
- **Estética premium** - Visual Apple-like, clean e moderno
- **Consistência** - Mesmo padrão em todas as páginas
- **Animações** - Framer Motion bem utilizado, transições suaves
- **Responsivo** - Funciona bem em mobile e desktop
- **Dark Mode** - Implementado corretamente
- **Micro-interações** - Hovers, indicadores coloridos, feedback visual
- **Cores por Strength** - Sistema visual intuitivo (verde→roxo)

### 🔧 Pontos a Considerar
- Alguns textos placeholder precisam ser substituídos por conteúdo real
- Imagens de produtos precisam ser reais/de alta qualidade
- Testar acessibilidade (contraste, screen readers)
- SEO: meta tags, Open Graph, sitemap

---

## 📋 Ordem Sugerida de Implementação

### Fase 1: Core E-commerce (1-2 semanas)
1. Página de Checkout
2. Integração Stripe
3. Criação de Pedidos no Firebase
4. Emails de confirmação

### Fase 2: Gestão de Pedidos (1 semana)
1. Admin: conexão real com pedidos
2. Atualização de status
3. Histórico do usuário
4. Tracking real

### Fase 3: Compliance & UX (1 semana)
1. Verificação de idade
2. Termos e condições
3. Política de privacidade
4. Perfil do usuário

### Fase 4: Engajamento (ongoing)
1. Reviews
2. Wishlist
3. Cupons
4. Notificações

---

## 🔧 Stack Técnica Atual

| Tecnologia | Uso |
|------------|-----|
| Next.js 14 | Framework React |
| TypeScript | Type safety |
| Tailwind CSS | Estilos |
| Framer Motion | Animações |
| Firebase Auth | Autenticação |
| Firestore | Banco de dados |
| Firebase Storage | Imagens |
| Zustand | State management (cart) |
| React Hook Form | Formulários |
| Zod | Validação |
| Lucide React | Ícones |
| React Hot Toast | Notificações |

---

## 📝 Notas Finais

O projeto tem uma **base sólida e um design impressionante**. A arquitetura está bem organizada e pronta para escalar. O próximo passo crítico é implementar o fluxo de checkout/pagamento para transformar isso em uma loja funcional.

**Prioridade #1:** Checkout + Stripe + Orders

---

*Documento criado em 21/12/2024*
