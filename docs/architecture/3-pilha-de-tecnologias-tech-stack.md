# 3. Pilha de Tecnologias (Tech Stack)

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