# 🔐 Configuração OAuth - Google

Este guia vai te ajudar a configurar o Google OAuth no Supabase para permitir login com Google.

---

## 📋 Passo a Passo

### 1. Criar Credenciais no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá em **APIs & Services** > **Credentials**
4. Clique em **Create Credentials** > **OAuth client ID**
5. Se for a primeira vez, configure o **OAuth consent screen**:
   - Escolha **External** (para testes)
   - Preencha:
     - **App name**: `SnusIdea`
     - **User support email**: Seu email
     - **Developer contact**: Seu email
   - Clique em **Save and Continue**
   - Adicione seu email como **Test user** (se necessário)
   - Clique em **Save and Continue** até finalizar

6. Configure o **OAuth client ID**:
   - **Application type**: `Web application`
   - **Name**: `SnusIdea Web Client`
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (desenvolvimento)
     - `https://yourdomain.com` (produção - adicione depois)
   - **Authorized redirect URIs**:
     - `https://cqypemlvuxgqqcodudcd.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (opcional para desenvolvimento local)
   - Clique em **Create**

7. **Copie as credenciais**:
   - **Client ID**: `xxxxx.apps.googleusercontent.com`
   - **Client Secret**: `xxxxx`

---

### 2. Configurar no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com/)
2. Vá em **Authentication** > **Providers**
3. Encontre **Google** na lista
4. Clique para expandir e ative o toggle
5. Cole as credenciais:
   - **Client ID (for OAuth)**: Cole o Client ID do Google
   - **Client Secret (for OAuth)**: Cole o Client Secret do Google
6. Clique em **Save**

---

### 3. Configurar URLs de Redirect

1. Ainda em **Authentication** > **URL Configuration**
2. Verifique se está configurado:
   - **Site URL**: `http://localhost:3000` (desenvolvimento)
   - **Redirect URLs**: 
     - `http://localhost:3000/auth/callback`
     - `http://localhost:3000/**` (wildcard para desenvolvimento)

---

### 4. Testar

1. Execute `npm run dev`
2. Acesse `http://localhost:3000/login`
3. Clique em **Continue with Google**
4. Deve redirecionar para o Google para autenticação
5. Após autenticar, deve voltar para o site

---

## ⚠️ Troubleshooting

### Erro: "Unsupported provider: provider is not enabled"
- **Solução**: Verifique se o Google OAuth está ativado no Supabase (Authentication > Providers)

### Erro: "redirect_uri_mismatch"
- **Solução**: Verifique se o redirect URI no Google Cloud Console está exatamente igual ao do Supabase:
  - Deve ser: `https://cqypemlvuxgqqcodudcd.supabase.co/auth/v1/callback`

### Erro: "invalid_client"
- **Solução**: Verifique se o Client ID e Client Secret estão corretos no Supabase

### OAuth funciona mas não cria perfil
- **Solução**: O código já está configurado para criar perfil automaticamente em `/auth/callback`

---

## 🔒 Segurança

- **NUNCA** commite o Client Secret no código
- Use variáveis de ambiente se necessário
- Em produção, adicione seu domínio real nas URLs autorizadas

---

## 📚 Recursos

- [Supabase OAuth Docs](https://supabase.com/docs/guides/auth/social-login/auth-google)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)

---

**Última atualização**: 2024

