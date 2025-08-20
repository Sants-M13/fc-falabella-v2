# 7. Fluxo de Trabalho de Desenvolvimento e Deploy

## Configuração do Ambiente Local

**Pré-requisitos Fundamentais (MCPs)**: Contas no GitHub, Vercel e Supabase

**Ferramentas Locais (CLIs)**: Node.js, Docker, Git, CLIs da Vercel e Supabase

### Configuração Inicial do Supabase CLI

**Instalação (macOS):**
```bash
brew install supabase/tap/supabase
```

**Setup do Projeto:**
```bash
# Inicializar Supabase no projeto
supabase init

# Linkar com projeto remoto
supabase link --project-ref pbcdbmzrumntbhpispvb

# Iniciar ambiente local (primeira vez baixa Docker images)
supabase start
```

**Pré-requisitos:**
- Docker Desktop instalado e configurado
- Acesso ao projeto Supabase remoto

### Configuração MCP Servers

**MCP Servers Instalados:**
```bash
# Supabase MCP (configurado automaticamente)
claude mcp add supabase @supabase/mcp-server-supabase@latest --project-ref pbcdbmzrumntbhpispvb

# Playwright MCP (instalado)
claude mcp add playwright npx @playwright/mcp@latest
```

**Arquivo `.mcp.json`:**
- Supabase: Configurado automaticamente com credenciais do projeto
- Playwright: Configurado e pronto para uso via Claude Code
- Adicionado ao `.gitignore` por segurança
- Template disponível em `.mcp.json.example`

**IMPORTANTE**: Use os MCP servers para desenvolvimento. Não instale manualmente Playwright ou configure Supabase separadamente - use os MCP servers via Claude Code.

## Comandos de Desenvolvimento

### Ambiente Completo
- **Iniciar Ambiente Completo**: `vercel dev` (Next.js + API routes)
- **Iniciar Supabase Local**: `supabase start` (Database + Studio local)
- **Parar Supabase Local**: `supabase stop`

### Desenvolvimento de Schema
- **Criar Migration**: `supabase migration new <name>`
- **Aplicar Migrations**: `supabase db push`
- **Gerar Types**: `supabase gen types typescript`
- **Reset Database**: `supabase db reset`

### Testes
- **Executar Testes E2E**: `npm run test:e2e`

### URLs Locais (quando `supabase start` ativo)
- **Supabase Studio**: http://localhost:54323
- **Database URL**: postgresql://postgres:postgres@localhost:54322/postgres
- **API URL**: http://localhost:54321