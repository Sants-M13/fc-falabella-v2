# 2. Arquitetura de Alto Nível

## Resumo Técnico

A aplicação será uma aplicação web fullstack construída sobre a plataforma Vercel e utilizando Supabase como Backend-as-a-Service (BaaS). A arquitetura seguirá o padrão Jamstack. O frontend será uma Single-Page Application (SPA) construída com Next.js, e a comunicação com o Supabase ocorrerá através da sua biblioteca de cliente oficial, com lógica de negócio encapsulada em Funções Serverless.

## Plataforma e Infraestrutura

**Plataforma Escolhida**: Vercel + Supabase

**Serviços Chave**:
- **Vercel**: Hospedagem do frontend, CI/CD, Funções Serverless
- **Supabase**: Banco de dados PostgreSQL, Autenticação, Armazenamento de Arquivos, APIs geradas automaticamente

## Estrutura do Repositório: Monorepo

**Estrutura**: Utilizaremos um monorepo para gerenciar o código, permitindo o compartilhamento fácil de tipos e lógica.

**Ferramenta**: npm workspaces ou similar.
## Diagrama da Arquitetura de Alto Nível

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
## Princípios Não-Negociáveis da Arquitetura

- **Tudo como Plataforma Gerenciada (MCP)**: Todas as peças da infraestrutura devem ser serviços gerenciados (Vercel, Supabase) para eliminar a necessidade de configuração e manutenção manual
- **Testes como Plataforma Gerenciada (MCP)**: Os testes E2E com Playwright serão executados como parte do fluxo de CI/CD gerenciado pela Vercel