# 3. Pilha de Tecnologias (Tech Stack)

| Categoria | Tecnologia | Versão (Sugerida) | Propósito | Racional |
|-----------|------------|-------------------|-----------|----------|
| Linguagem | TypeScript | 5.x | Linguagem principal para todo o código | Segurança de tipos entre frontend e backend |
| Framework Fullstack | Next.js | 14.x | Framework principal para a aplicação | Integração perfeita com Vercel |
| Backend (BaaS) | Supabase | latest | Banco de dados, Auth, Armazenamento | Plataforma gerenciada (MCP) |
| UI Components | shadcn/ui | latest | Construção da interface do usuário | Moderna, acessível, baseada em Tailwind |
| UI Effects (Admin) | Magic UI | latest | Efeitos visuais para desktop admin | Profissional, lazy loading obrigatório |
| Estilização | Tailwind CSS | 3.x | Framework de CSS utility-first | Agilidade no desenvolvimento de UI |
| Gestão de Estado (Server) | TanStack Query | 5.x | Sincronização de dados com o backend | Simplifica cache e atualização de dados |
| Gestão de Estado (Client) | Zustand | 4.x | Gerenciamento de estado global | Simples e com mínimo boilerplate |
| Formulários | React Hook Form + Zod | latest | Gerenciamento e validação de formulários | Performática e robusta |
| Testes E2E | Playwright | latest | Testes de ponta a ponta | Ferramenta poderosa para garantir qualidade |
| Testes Unitários | Vitest | latest | Testes de unidade para lógica de negócio | Rápido e compatível com o ecossistema |
| CI/CD | Vercel | N/A | Build, deploy e hospedagem automáticos | Plataforma gerenciada (MCP) |
| Linting / Formatação | ESLint / Prettier | latest | Qualidade e padronização do código | Ferramentas padrão da indústria |

## 🌐 Requisitos de Internacionalização (NFR1 - CRÍTICO)

| Categoria | Tecnologia | Versão | Implementação Obrigatória | Validação |
|-----------|------------|---------|--------------------------|-----------|
| Localização | Next.js i18n | 14.x | `lang="es-CO"` em HTML | QA + UAT obrigatório |
| Formatação Números | Intl API | Native | `Intl.NumberFormat('es-CO')` | Testes automatizados |
| Formatação Moeda | Intl API | Native | `currency: 'COP', format: '$12.345 COP'` | UAT validação |
| Formatação Data | Intl API | Native | `DD/MM/YYYY, timezone: America/Bogota` | Testes unitários |
| Fontes | Google Fonts | latest | `subsets: ["latin", "latin-ext"]` | Visual review |

### Implementação Obrigatória por Story:

**TODA interface deve:**
1. **HTML**: `<html lang="es-CO">` - NUNCA "en"
2. **Textos**: 100% em espanhol colombiano
3. **Moeda**: Formato COP ($12.345 COP)
4. **Data**: DD/MM/YYYY (não MM/DD/YYYY americano)
5. **Fonts**: Suporte completo a caracteres com tildes/acentos

**Ferramentas de Validação:**
- ESLint: Custom rule para detectar `lang="en"`
- Testes: Automatizar validação de formato de moeda/data
- UAT: Checklist obrigatório de localização

## 🎨 Arquitetura de UI/UX

### Bibliotecas Aprovadas

| Biblioteca | Contexto de Uso | Implementação | Racional |
|------------|-----------------|---------------|----------|
| **shadcn/ui** | Todas as interfaces | Componentes base obrigatórios | Acessibilidade WCAG 2.1 AA nativa |
| **Magic UI** | Admin desktop apenas | Lazy loading obrigatório | Efeitos visuais profissionais |
| **Tailwind CSS** | Toda estilização | Sistema de tema configurado | Consistência visual e performance |

### Restrições Arquiteturais

**PROIBIDO em qualquer contexto:**
- Material-UI (MUI)
- Ant Design  
- Chakra UI
- Bootstrap
- Outras bibliotecas de componentes

### Performance por Contexto

| Usuário | Platform | UI Stack | Performance Target |
|---------|----------|----------|-------------------|
| **Admin** | Desktop | shadcn/ui + Magic UI | Visual profissional, performance secundária |
| **Promotora** | Mobile | shadcn/ui apenas | Performance crítica < 3s |
| **Shared** | Ambos | shadcn/ui apenas | Compatibilidade universal |

### Governança

- **Documentação completa**: [`docs/ui_ux/10-governanca-design-system.md`](../ui_ux/10-governanca-design-system.md)
- **Coding standards**: [`docs/architecture/coding-standards.md`](./coding-standards.md)
- **Validação obrigatória** em code review e UAT