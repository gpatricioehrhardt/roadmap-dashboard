# 🚀 RoadMap Dashboard - CarbonZap

Dashboard em tempo real dos épicos do Jira, deployado em Vercel.

## 🔧 Pré-requisitos

- Conta Vercel conectada a este repositório GitHub
- Token API do Jira (gere em: https://id.atlassian.com/manage-profile/security/api-tokens)

## 📋 Configuração

### 1. Descobrir o projeto Jira correto

Execute este script para listar os projetos e épicos disponíveis:

```bash
node find-project.js "seu-api-token-aqui"
```

Isso mostrará todos os projetos e os épicos em cada um. Anote a **chave do projeto** (ex: CAW, PRJ, etc).

### 2. Atualizar o projeto no dashboard

Edite `index.html` e mude a linha:

```javascript
const JIRA_PROJECT = 'CAW'; // Mude para o projeto correto
```

### 3. Configurar variáveis de ambiente no Vercel

No painel do Vercel, vá para **Deployment** → **Settings** → **Environment Variables** e configure:

- `JIRA_API_TOKEN`: Seu token API do Jira
- `JIRA_EMAIL`: Seu email do Jira (padrão: gisele.patricio@carbontech.digital)
- `JIRA_SITE`: Seu site Jira (padrão: carbontech-team.atlassian.net)

### 4. Fazer deploy

```bash
git add -A
git commit -m "Update project key"
git push origin main
```

O Vercel fará o deploy automaticamente.

## 🛡️ Segurança

⚠️ **IMPORTANTE**: 
- Nunca coloque o token API no código-fonte
- Todas as credenciais são gerenciadas via variáveis de ambiente do Vercel
- O proxy backend (`api/proxy.js`) protege suas credenciais

## 🔗 Filtrar por Campo Personalizado

Se o filtro da Jira não está acessível, duas soluções:

### Solução 1: Deixar o filtro público
Na Jira, abra o filtro → **Compartilhar** → **Qualquer um com o link**

### Solução 2: Usar JQL diretamente
Edite a linha 391 no `index.html`:

```javascript
// Atual:
const jql = `type=Epic AND project=${JIRA_PROJECT}`;

// Para um JQL customizado:
const jql = `type=Epic AND (custom_field = "valor1" OR custom_field = "valor2")`;
```

## 📊 Campos Personalizados Suportados

- `customfield_10327`: Área
- `customfield_10329`: MoSCoW
- `customfield_10330`: Status da Funcionalidade

Se os IDs forem diferentes na sua Jira, execute o script `find-project.js` e veja os IDs retornados, depois atualize em `index.html`.

## 🚀 Deploy

O repositório está conectado ao Vercel. Cada push para `main` dispara um novo deploy automaticamente.

URL: https://carbontech-dashboard-zap.vercel.app

## 📝 Licença

MIT
