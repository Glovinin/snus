# 📚 Documentação Completa - SnusIdea
## Relatório de Funcionalidades da Plataforma

**Para:** Atef (Proprietário da Plataforma)  
**Data:** 22 de Dezembro de 2024  
**Versão:** 1.0

---

## 📋 Índice

1. [Visão Geral da Plataforma](#visão-geral-da-plataforma)
2. [Área do Cliente (Loja Online)](#área-do-cliente-loja-online)
3. [Painel de Administração](#painel-de-administração)
4. [Como Funciona o Sistema](#como-funciona-o-sistema)
5. [Recursos de Segurança](#recursos-de-segurança)

---

## 🌐 Visão Geral da Plataforma

A **SnusIdea** é uma loja online moderna e completa para venda de produtos de nicotina (pouches/saches). A plataforma foi desenvolvida com tecnologia de ponta e está dividida em duas partes principais:

### 🛒 Parte 1: Loja Online (Visível aos Clientes)
Esta é a "vitrine" da loja, onde os clientes navegam, escolhem produtos e fazem compras.

### 🔐 Parte 2: Painel de Administração (Apenas para Gestão)
Esta é a área "nos bastidores", onde se gerem produtos, encomendas, clientes e estatísticas.

---

## 🛒 Área do Cliente (Loja Online)

### 1. Página Inicial (Home)

**O que faz:**  
É a primeira página que os visitantes veem ao entrar no site. Funciona como uma montra virtual.

**Funcionalidades:**

| Elemento | Descrição |
|----------|-----------|
| **Banner Rotativo (Hero)** | Imagens grandes que mudam automaticamente a cada 6 segundos. Mostram as marcas em destaque (Kratos, Rebel, Velo). Os visitantes podem clicar para ver os produtos dessas marcas. |
| **Grelha de Categorias** | Mostra diferentes formas de explorar os produtos (por sabor, força, marca, etc.) |
| **Carrossel de Marcas** | Uma faixa horizontal com os logótipos de todas as marcas disponíveis na loja |
| **Produtos em Destaque** | Os produtos mais populares ou que o administrador escolheu destacar |
| **Secção de Ofertas** | Produtos com desconto ou promoções especiais |
| **Testemunhos** | Comentários de clientes satisfeitos |
| **Rodapé** | Links úteis, informações de contacto e redes sociais |

**Como funciona:**  
Quando alguém visita o site, a página inicial carrega automaticamente. As imagens do banner mudam sozinhas para manter a página dinâmica e interessante.

---

### 2. Página da Loja (Shop)

**O que faz:**  
Mostra todos os produtos disponíveis para compra. É como entrar numa loja física e ver todas as prateleiras.

**Funcionalidades:**

| Funcionalidade | Descrição |
|----------------|-----------|
| **Lista de Produtos** | Todos os produtos aparecem em cartões bonitos com foto, nome, preço e força |
| **Filtros** | O cliente pode filtrar por: Marca, Força (Weak/Medium/Strong/Extra/Extreme), Sabor, Preço |
| **Barra de Pesquisa** | O cliente pode escrever o nome do produto que procura |
| **Ordenação** | Pode ordenar por: Destacados, Preço (baixo-alto), Preço (alto-baixo), Nome (A-Z) |
| **Carregamento Infinito** | Ao rolar a página, mais produtos aparecem automaticamente (não precisa clicar em "próxima página") |

**Detalhes dos Cartões de Produto:**
- Foto do produto
- Nome e marca
- Nível de força (com cor indicativa)
- Preço atual
- Preço antigo (riscado, se houver desconto)
- Etiqueta "Best Seller" (se for um dos mais vendidos)
- Selector de quantidade (1, 5, 10, 20, 40 unidades)
- Botão "Adicionar ao Carrinho"

---

### 3. Página de Produto Individual

**O que faz:**  
Quando o cliente clica num produto, vê todos os detalhes desse produto específico.

**Funcionalidades:**

| Elemento | Descrição |
|----------|-----------|
| **Galeria de Imagens** | Várias fotos do produto que podem ser ampliadas |
| **Informações Detalhadas** | Marca, sabor, força, peso, quantidade de nicotina |
| **Descrição** | Texto explicativo sobre o produto |
| **Selector de Quantidade** | O cliente escolhe quantas embalagens quer |
| **Preço Total** | Atualiza automaticamente conforme a quantidade |
| **Botão Comprar** | Adiciona ao carrinho e pode ir direto para o checkout |
| **Migalhas de Pão** | Mostra o caminho: Home > Loja > Produto (para fácil navegação) |

---

### 4. Carrinho de Compras

**O que faz:**  
É como o carrinho num supermercado. Guarda todos os produtos que o cliente escolheu antes de pagar.

**Funcionalidades:**

| Funcionalidade | Descrição |
|----------------|-----------|
| **Painel Deslizante** | Abre do lado direito da tela (não abre uma página nova) |
| **Lista de Itens** | Todos os produtos adicionados com foto, nome, quantidade e preço |
| **Editar Quantidade** | Botões + e - para alterar quantidades |
| **Remover Item** | Botão para tirar um produto do carrinho |
| **Subtotal** | Soma de todos os produtos |
| **Botão Checkout** | Leva para a página de pagamento |
| **Continuar Comprando** | Botão para fechar o carrinho e voltar à loja |

**Nota Especial:**  
O carrinho fica guardado mesmo se o cliente fechar o browser. Quando voltar, os produtos ainda estarão lá!

---

### 5. Página de Checkout (Pagamento)

**O que faz:**  
Onde o cliente coloca os dados de entrega e finaliza a compra.

**Funcionalidades:**

| Secção | Campos/Informações |
|--------|-------------------|
| **Informações de Contacto** | Email, Telefone |
| **Endereço de Entrega** | Nome, Morada, Cidade, Código Postal, País |
| **Resumo do Pedido** | Lista de produtos, quantidades, preços |
| **Método de Envio** | Opções de entrega com diferentes prazos e preços |
| **Código de Desconto** | Campo para inserir cupões promocionais |
| **Total Final** | Valor total incluindo produtos + portes |
| **Métodos de Pagamento** | Cartão de crédito, Multibanco, etc. |
| **Botão Finalizar** | Confirma e processa o pagamento |

---

### 6. Menu de Navegação (Navbar)

**O que faz:**  
A barra no topo do site que permite navegar para qualquer parte da loja.

**Funcionalidades Desktop:**

| Elemento | Descrição |
|----------|-----------|
| **Logo** | Clique para voltar à página inicial |
| **Loja** | Link direto para todos os produtos |
| **Categorias** | Menu que abre com: Sabores, Novidades, Forças |
| **Marcas** | Menu que abre com lista de TODAS as marcas (ordenadas pela sua preferência!) |
| **Ajuda** | Menu com: Contacto, FAQs, Envios, Rastrear Encomenda |
| **Pesquisa** | Ícone de lupa que abre uma barra de pesquisa |
| **Conta** | Se não estiver logado: abre formulário de login. Se estiver logado: mostra menu com opções da conta |
| **Carrinho** | Ícone do carrinho com indicador de quantos itens tem |

**Funcionalidades Mobile:**  
No telemóvel, aparece um ícone de menu (☰) que abre um painel lateral com todas as opções.

**Nota sobre Ordenação de Marcas:**  
As marcas aparecem pela ordem que definir no painel de administração. Se colocar "Kratos" e "Rebel" primeiro, elas aparecerão primeiro tanto no menu como na página da loja!

---

### 7. Páginas de Suporte ao Cliente

#### 7.1 Contacto

**O que faz:**  
Permite aos clientes enviar mensagens com dúvidas ou problemas.

**Funcionalidades:**
- Formulário com: Nome, Email, Assunto, Mensagem
- Informações de contacto direto (email, telefone, morada)
- Horário de funcionamento do suporte

---

#### 7.2 FAQs (Perguntas Frequentes)

**O que faz:**  
Responde às dúvidas mais comuns sem precisar contactar o suporte.

**Categorias de Perguntas:**
- Encomendas & Envios
- Produtos
- Pagamento & Segurança
- Conta & Suporte

Cada pergunta funciona como um "acordeão" - clique para expandir e ver a resposta.

---

#### 7.3 Informações de Envio

**O que faz:**  
Explica como funcionam as entregas.

**Informações Disponíveis:**
- Países onde entrega
- Prazos de entrega por região
- Preços de portes
- Envio grátis a partir de €99
- Embalagem discreta
- Processamento no mesmo dia (se pedido antes das 14h)

---

#### 7.4 Rastrear Encomenda

**O que faz:**  
Permite ver onde está a encomenda em tempo real.

**Como Funciona:**
1. O cliente insere o número da encomenda
2. O sistema mostra uma linha do tempo com todos os passos:
   - ✅ Pedido recebido
   - ✅ Processando
   - ✅ Enviado
   - 🔄 Em trânsito
   - ⏳ A caminho
   - ⏳ Entregue

---

### 8. Sistema de Contas de Cliente

**O que faz:**  
Permite aos clientes criar uma conta pessoal para uma experiência mais rápida.

**Benefícios de ter conta:**
- Checkout mais rápido (dados guardados)
- Ver histórico de encomendas
- Acompanhar estado das encomendas
- Guardar endereços de entrega favoritos

**Funcionalidades:**
- Criar conta (registo)
- Fazer login
- Recuperar palavra-passe
- Editar perfil
- Ver encomendas anteriores
- Terminar sessão

---

## 🔐 Painel de Administração

Esta área é apenas para si e para quem autorizar. Aqui gere toda a loja.

**Como Aceder:**  
Vá a `seusite.com/admin` e faça login com a conta de administrador.

---

### 1. Dashboard (Painel de Controlo)

**O que faz:**  
Mostra um resumo rápido de como a loja está a funcionar. É a "primeira página" quando entra no admin.

**Informações Mostradas:**

| Métrica | Descrição |
|---------|-----------|
| **Receita Total** | Quanto dinheiro a loja gerou |
| **Número de Encomendas** | Total de pedidos realizados |
| **Taxa de Retorno** | Percentagem de clientes que voltam a comprar |
| **Utilizadores Ativos** | Quantas pessoas estão no site agora |
| **Gráfico de Receitas** | Visual mostrando vendas ao longo do tempo |
| **Vendas Recentes** | Lista das últimas transações |

---

### 2. Gestão de Produtos

**O que faz:**  
Onde adiciona, edita e remove produtos da loja.

#### Vista de Marcas

Quando entra na página de produtos, vê primeiro todas as marcas organizadas em "cartões":

| Funcionalidade | Descrição |
|----------------|-----------|
| **Cartão de Marca** | Mostra: nome, número de produtos, 4 fotos de amostra |
| **Indicador de Status** | Uma luz âmbar (🟠) aparece se a marca tem produtos destacados |
| **Pesquisar Marcas** | Campo para filtrar marcas pelo nome |
| **Arrastar e Ordenar** | NOVIDADE! Pode arrastar os cartões para mudar a ordem em que aparecem na loja |
| **Eliminar Marca** | Botão de lixo para remover (pede confirmação) |

#### Vista de Produtos (dentro de uma marca)

Ao clicar numa marca, vê todos os produtos dessa marca:

| Funcionalidade | Descrição |
|----------------|-----------|
| **Tabela de Produtos** | Lista com: foto, nome, categoria, preço, stock, SKU |
| **Indicadores Visuais** | Estrela (Featured), Chama (Best Seller), Brilho (Weekly Special) |
| **Estado do Stock** | Verde (em stock), Amarelo (stock baixo), Vermelho (esgotado) |
| **Editar Produto** | Clique na linha para abrir formulário de edição |
| **Eliminar Produto** | Ícone de lixo para remover |
| **Limpar Status** | Botão para remover TODOS os status de uma marca de uma vez |
| **Voltar** | Botão para regressar à vista de marcas |

#### Adicionar/Editar Produto

Abre um formulário lateral com:

| Campo | Descrição |
|-------|-----------|
| **Nome** | Nome do produto |
| **Marca** | Qual marca pertence |
| **Categoria** | Tipo de produto |
| **Preço** | Preço de venda |
| **Preço Comparativo** | Preço antigo (para mostrar desconto) |
| **Stock** | Quantidade em armazém |
| **SKU** | Código único do produto |
| **Força** | Weak, Medium, Strong, Extra, Extreme |
| **Sabor** | Descrição do sabor |
| **Peso** | Peso do produto |
| **Nicotina** | Quantidade de nicotina |
| **Descrição** | Texto descritivo |
| **Imagens** | Upload de fotos do produto |
| **Featured** | Marcar como produto em destaque |
| **Best Seller** | Marcar como mais vendido |
| **Weekly Special** | Marcar como oferta da semana |

#### Gestão de Marcas

Botão "Brands" abre um painel para:
- Ver todas as marcas existentes
- Criar nova marca
- Editar nome da marca
- Activar/desactivar marca
- Eliminar marca

---

### 3. Gestão de Encomendas

**O que faz:**  
Mostra todas as encomendas feitas pelos clientes.

**Informações por Encomenda:**

| Coluna | Descrição |
|--------|-----------|
| **Nº Encomenda** | Identificador único (ex: ORD-001) |
| **Data** | Quando foi feita |
| **Cliente** | Nome e email de quem comprou |
| **Estado** | Pending (pendente), Processing (a processar), Shipped (enviada), Delivered (entregue), Cancelled (cancelada) |
| **Total** | Valor total da encomenda |
| **Itens** | Quantos produtos |
| **Ações** | Botão para ver detalhes |

**Estados das Encomendas (com cores):**
- 🟡 **Pending** - Aguarda confirmação de pagamento
- 🔵 **Processing** - A preparar para envio
- 🟣 **Shipped** - Já saiu do armazém
- 🟢 **Delivered** - Entregue ao cliente
- 🔴 **Cancelled** - Cancelada

---

### 4. Gestão de Clientes

**O que faz:**  
Lista todos os clientes registados na loja.

**Informações por Cliente:**

| Coluna | Descrição |
|--------|-----------|
| **Nome** | Nome do cliente |
| **Email** | Endereço de email |
| **Localização** | Cidade/País |
| **Encomendas** | Quantas compras fez |
| **Total Gasto** | Quanto gastou na loja |

Esta informação ajuda a identificar os melhores clientes!

---

### 5. Analytics (Estatísticas)

**O que faz:**  
Fornece dados detalhados sobre o desempenho da loja.

**Métricas Disponíveis:**

| Métrica | O que significa |
|---------|-----------------|
| **Vendas Totais** | Dinheiro total ganho |
| **Sessões da Loja** | Quantas visitas o site teve |
| **Taxa de Conversão** | % de visitantes que compraram |
| **Nº de Encomendas** | Total de pedidos |

**Gráficos:**
- **Vendas ao Longo do Tempo** - Mostra como as vendas variam por dia/semana/mês
- **Produtos Mais Vendidos** - Gráfico de barras com os produtos top

---

### 6. Definições

**O que faz:**  
Configurações gerais da loja e da sua conta de admin.

**Opções Disponíveis:**

| Secção | Configurações |
|--------|---------------|
| **Detalhes da Loja** | Nome da loja, Email de contacto, Moeda (EUR) |
| **Segurança** | Alterar palavra-passe, Ativar autenticação em 2 passos |

---

## ⚙️ Como Funciona o Sistema

### Base de Dados (Firebase)

A plataforma usa o **Firebase**, um serviço da Google que funciona como o "cérebro" onde ficam guardados todos os dados:

| Coleção | O que guarda |
|---------|--------------|
| **products** | Todos os produtos da loja |
| **brands** | Lista de marcas com ordem de exibição |
| **orders** | Todas as encomendas |
| **users** | Contas de clientes e admins |

**Vantagens:**
- ✅ Dados guardados na nuvem (seguros)
- ✅ Atualizações em tempo real
- ✅ Funciona rápido em todo o mundo
- ✅ Escala automaticamente (se tiver muitos visitantes)

---

### Armazenamento de Imagens

As fotos dos produtos são guardadas no **Firebase Storage**, um serviço de armazenamento de ficheiros:

- Quando faz upload de uma foto, ela é guardada na nuvem
- O sistema gera um link automático para a imagem
- As imagens são comprimidas automaticamente para carregar mais rápido

---

### Sistema de Ordenação de Marcas

**Como funciona a nova funcionalidade de ordenar marcas:**

1. No painel admin, vá a "Products"
2. Arraste os cartões das marcas para a ordem desejada
3. A ordem é gravada automaticamente na base de dados
4. Quando um visitante abre a loja, as marcas aparecem nessa ordem

**Onde aparece a ordem:**
- ✅ Menu "Brands" no navbar
- ✅ Menu mobile
- ✅ Filtro de marcas na página da loja
- ✅ Painel de administração

---

### Autenticação (Login)

O sistema de login funciona com **Firebase Authentication**:

- Os utilizadores podem criar contas com email/password
- Há diferentes níveis de acesso: Cliente, Vendedor, Administrador
- As passwords são encriptadas (ninguém consegue vê-las)
- Existe opção de "Esqueci a password"

---

## 🔒 Recursos de Segurança

| Recurso | Descrição |
|---------|-----------|
| **Encriptação** | Todos os dados sensíveis são encriptados |
| **HTTPS** | Toda a comunicação é segura (cadeado verde no browser) |
| **Autenticação** | Só utilizadores autorizados acedem ao admin |
| **Validação** | Todos os formulários são validados para prevenir ataques |
| **Backups** | A Firebase faz backups automáticos dos dados |

---

## 📱 Compatibilidade

A plataforma é **totalmente responsiva**, o que significa que funciona bem em:

- 🖥️ Computadores (Windows, Mac, Linux)
- 💻 Portáteis
- 📱 Telemóveis (iPhone, Android)
- 📟 Tablets (iPad, Android)

O design adapta-se automaticamente ao tamanho do ecrã.

---

## 🎨 Elementos Visuais Especiais

A plataforma inclui vários efeitos visuais modernos:

| Efeito | Onde aparece |
|--------|--------------|
| **Animações Suaves** | Transições entre páginas, abertura de menus |
| **Hover Effects** | Produtos "crescem" quando passa o rato por cima |
| **Loading States** | Ícones giratórios enquanto carrega dados |
| **Toast Notifications** | Mensagens que aparecem no canto (ex: "Produto adicionado!") |
| **Skeleton Loading** | Formas cinzentas que indicam onde o conteúdo vai aparecer |

---

## 📞 Suporte Técnico

Para questões técnicas sobre a plataforma, a equipa de desenvolvimento está disponível para:

- Adicionar novas funcionalidades
- Corrigir problemas
- Fazer alterações de design
- Otimizar performance

---

## ✅ Resumo das Funcionalidades Principais

### Para Clientes:
- ✅ Navegar e pesquisar produtos
- ✅ Filtrar por marca, força, sabor, preço
- ✅ Adicionar ao carrinho
- ✅ Fazer checkout completo
- ✅ Criar conta e fazer login
- ✅ Ver histórico de compras
- ✅ Rastrear encomendas
- ✅ Contactar suporte

### Para Administração:
- ✅ Dashboard com métricas
- ✅ Gerir produtos completo
- ✅ Organizar marcas (arrastar e ordenar)
- ✅ Ver encomendas
- ✅ Ver lista de clientes
- ✅ Estatísticas detalhadas
- ✅ Configurações da loja

---

**Documento preparado para:** Atef  
**Desenvolvido por:** Equipa de Desenvolvimento SnusIdea  
**Dezembro 2024**
