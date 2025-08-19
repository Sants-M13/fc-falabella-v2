# Fullstack Architecture Document: Controle de Inventário - Falabella CO

## 1. Introdução

Este documento descreve a arquitetura fullstack completa para o projeto de Controle de Inventário, incluindo os sistemas de backend, a implementação de frontend e a sua integração. Ele servirá como a única fonte da verdade para o desenvolvimento guiado por IA, garantindo a consistência em toda a pilha de tecnologia.

### Template Inicial ou Projeto Existente

A abordagem será utilizar um dos templates Vercel com integração Supabase como ponto de partida. Isso acelera a configuração, implementa as melhores práticas recomendadas por ambas as plataformas e se alinha com a filosofia de simplicidade e automação do projeto.

### Registro de Alterações

| Data | Versão | Descrição | Autor |
|------|--------|-----------|-------|
| 19/08/2025 | 1.0 | Versão inicial da arquitetura. | Winston (Architect) |
## 2. Arquitetura de Alto Nível

### Resumo Técnico

A aplicação será uma aplicação web fullstack construída sobre a plataforma Vercel e utilizando Supabase como Backend-as-a-Service (BaaS). A arquitetura seguirá o padrão Jamstack. O frontend será uma Single-Page Application (SPA) construída com Next.js, e a comunicação com o Supabase ocorrerá através da sua biblioteca de cliente oficial, com lógica de negócio encapsulada em Funções Serverless.

### Plataforma e Infraestrutura

**Plataforma Escolhida**: Vercel + Supabase

**Serviços Chave**:
- **Vercel**: Hospedagem do frontend, CI/CD, Funções Serverless
- **Supabase**: Banco de dados PostgreSQL, Autenticação, Armazenamento de Arquivos, APIs geradas automaticamente

### Estrutura do Repositório: Monorepo

**Estrutura**: Utilizaremos um monorepo para gerenciar o código, permitindo o compartilhamento fácil de tipos e lógica.

**Ferramenta**: npm workspaces ou similar.
### Diagrama da Arquitetura de Alto Nível

```mermaid
graph TD
    subgraph Usuários
        U1[Promotora (Celular)]
        U2[Administrador (Desktop)]
    end

    subgraph Plataforma Vercel (MCP)
        CDN[Edge Network / CDN]
        APP[Frontend Next.js]
        FN[Funções Serverless]
    end

    subgraph Plataforma Supabase (MCP)
        AUTH[Autenticação]
        DB[Banco de Dados (PostgreSQL)]
        API[APIs (PostgREST)]
        STORAGE[Armazenamento]
    end

    U1 --> CDN; U2 --> CDN;
    CDN --> APP; APP --> FN; APP --> API;
    FN --> API; API --> AUTH; API --> DB; API --> STORAGE;
```
### Princípios Não-Negociáveis da Arquitetura

- **Tudo como Plataforma Gerenciada (MCP)**: Todas as peças da infraestrutura devem ser serviços gerenciados (Vercel, Supabase) para eliminar a necessidade de configuração e manutenção manual
- **Testes como Plataforma Gerenciada (MCP)**: Os testes E2E com Playwright serão executados como parte do fluxo de CI/CD gerenciado pela Vercel
## 3. Pilha de Tecnologias (Tech Stack)

| Categoria | Tecnologia | Versão (Sugerida) | Propósito | Racional |
|-----------|------------|-------------------|-----------|----------|
| Linguagem | TypeScript | 5.x | Linguagem principal para todo o código | Segurança de tipos entre frontend e backend |
| Framework Fullstack | Next.js | 14.x | Framework principal para a aplicação | Integração perfeita com Vercel |
| Backend (BaaS) | Supabase | latest | Banco de dados, Auth, Armazenamento | Plataforma gerenciada (MCP) |
| UI Components | shadcn/ui | latest | Construção da interface do usuário | Moderna, acessível, baseada em Tailwind |
| Estilização | Tailwind CSS | 3.x | Framework de CSS utility-first | Agilidade no desenvolvimento de UI |
| Gestão de Estado (Server) | TanStack Query | 5.x | Sincronização de dados com o backend | Simplifica cache e atualização de dados |
| Gestão de Estado (Client) | Zustand | 4.x | Gerenciamento de estado global | Simples e com mínimo boilerplate |
| Formulários | React Hook Form + Zod | latest | Gerenciamento e validação de formulários | Performática e robusta |
| Testes E2E | Playwright | latest | Testes de ponta a ponta | Ferramenta poderosa para garantir qualidade |
| Testes Unitários | Vitest | latest | Testes de unidade para lógica de negócio | Rápido e compatível com o ecossistema |
| CI/CD | Vercel | N/A | Build, deploy e hospedagem automáticos | Plataforma gerenciada (MCP) |
| Linting / Formatação | ESLint / Prettier | latest | Qualidade e padronização do código | Ferramentas padrão da indústria |
## 4. Modelos de Dados

*Estruturas de tabelas para o banco de dados PostgreSQL no Supabase*

- **profiles (Usuários)**: id, email, role, store_id (FK para stores)
- **stores (Lojas)**: id, name, max_skus, max_brands, max_inventory
- **products (Produtos - Pai)**: id, sku_parent, brand, style, price, cost
- **variants (Variações - Filho)**: id, product_id (FK para products), sku_child, size
- **inventory (Inventário)**: id, store_id (FK), variant_id (FK), quantity
- **transactions (Transações)**: id, variant_id (FK), store_id (FK), user_id (FK), transaction_type, quantity_change
- **incomings (Ingressos)**: id, store_id_destination, status, etc. (com tabela incoming_items)
- **audits (Auditorias)**: id, store_id, status, scope, etc. (com tabela audit_items)
## 5. Especificação da API

A comunicação será via biblioteca de cliente JavaScript do Supabase e Funções Serverless para lógica de negócio. A segurança será garantida por Políticas de Segurança em Nível de Linha (RLS) do PostgreSQL.

### Endpoints de Negócio (Funções Serverless)

- `POST /api/sales`: Para registrar vendas
- `POST /api/incomings/{id}/confirm`: Para confirmar recebimentos
- `POST /api/transfers`: Para criar transferências
- `POST /api/audits/{id}/submit`: Para enviar resultados de auditoria
## 6. Estrutura Unificada do Projeto (Monorepo)

```
falabella-inventory-app/
├── apps/
│   └── web/                      # Aplicação Next.js
│       ├── app/
│       │   ├── (admin)/          # Rotas do Administrador
│       │   └── (promotora)/      # Rotas da Promotora
│       ├── components/
│       └── lib/
├── packages/
│   └── types/                    # Tipos TypeScript compartilhados
├── supabase/
│   ├── functions/                # Funções Serverless
│   └── migrations/               # Migrações do banco de dados (SQL)
├── .env.local
└── package.json
```
## 7. Fluxo de Trabalho de Desenvolvimento e Deploy

### Configuração do Ambiente Local

**Pré-requisitos Fundamentais (MCPs)**: Contas no GitHub, Vercel e Supabase

**Ferramentas Locais (CLIs)**: Node.js, Docker, Git, CLIs da Vercel e Supabase

### Comandos de Desenvolvimento

- **Iniciar Ambiente Completo**: `vercel dev`
- **Executar Testes E2E**: `npm run test:e2e`
## 8. Arquitetura de Deploy (CI/CD)

O deploy será totalmente automatizado pela Vercel. Um git push para a branch principal irá acionar o processo de build, teste e deploy para produção, incluindo a implantação das migrações e funções do Supabase.
## 9. Guia Rápido do Desenvolvedor (Prompts para Claude Code)

Esta seção serve como um guia de prompts para iniciar e gerenciar sua sessão de desenvolvimento usando o Claude Code como seu agente executor.

### Iniciando a Sessão

1. **Verificar Docker**: "Primeiro, preciso garantir que o Docker Desktop esteja rodando. Por favor, verifique o status do Docker."
2. **Sincronizar Código**: "Vamos começar. Sincronize o projeto com as últimas alterações do repositório remoto." (`git pull`)
3. **Iniciar Backend**: "Agora, inicie os serviços locais do Supabase." (`supabase start`)
4. **Iniciar Ambiente Completo**: "Ótimo. Agora, inicie o ambiente de desenvolvimento completo da Vercel." (`vercel dev`)
5. **Confirmar Status**: "Perfeito. Por favor, confirme a URL local em que a aplicação está rodando."

### Finalizando a Sessão

1. **Parar Servidor**: "Sessão concluída. Pare o servidor de desenvolvimento da Vercel."
2. **Parar Backend**: "Agora, pare os serviços locais do Supabase." (`supabase stop`)
3. **Salvar Trabalho**: "Por fim, adicione, faça o commit e envie as alterações para o repositório remoto."