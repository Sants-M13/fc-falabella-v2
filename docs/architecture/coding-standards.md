# Coding Standards - FC Falabella v2

## Padrões de Desenvolvimento Obrigatórios

### 🌐 Localização e Internacionalização (NFR1 - CRÍTICO)

**OBRIGATÓRIO EM TODAS AS STORIES:**
- **Idioma**: es-CO (Espanhol Colombiano) - NUNCA inglês
- **Moeda**: COP (Peso Colombiano) - formato $12.345 COP
- **Fuso Horário**: America/Bogota
- **Formatação de Data**: DD/MM/YYYY

#### Implementação Técnica Obrigatória:
```typescript
// OBRIGATÓRIO: HTML lang attribute
<html lang="es-CO">

// OBRIGATÓRIO: Configuração Next.js
// next.config.ts
const nextConfig: NextConfig = {
  i18n: {
    locales: ['es-CO'],
    defaultLocale: 'es-CO',
  },
}

// OBRIGATÓRIO: Formatação de moeda
const formatCurrency = (amount: number) => 
  new Intl.NumberFormat('es-CO', { 
    style: 'currency', 
    currency: 'COP' 
  }).format(amount)

// OBRIGATÓRIO: Fontes com suporte a acentos
const font = Font({
  subsets: ["latin", "latin-ext"], // Inclui caracteres españoles
})
```

#### Checklist Obrigatório por Story:
- [ ] HTML lang="es-CO" configurado
- [ ] Todas as strings de interface em espanhol
- [ ] Formatação de moeda COP implementada
- [ ] Formatação de data DD/MM/YYYY
- [ ] Fontes suportam caracteres em espanhol
- [ ] Testes UAT validam idioma correto

### 🔐 Padrões de Segurança

- RLS policies obrigatórias em todas as tabelas
- Middleware de autenticação em rotas protegidas
- Validação de tipos TypeScript strict mode
- Sanitização de inputs com Zod

### 🧪 Padrões de Testes

- Testes unitários: Vitest para lógica de negócio
- Testes E2E: MCP Playwright para fluxos críticos
- Cobertura mínima: 80% para utils e services
- Todos os NFRs devem ter testes automatizados

### 📝 Padrões de Código

- TypeScript strict mode obrigatório
- ESLint + Prettier configurados
- Convenção de nomenclatura: camelCase para variáveis, PascalCase para componentes
- Documentação obrigatória para funções públicas

### 🎨 Padrões de UI/UX

- shadcn/ui components obrigatórios
- Tailwind CSS para estilização
- Design mobile-first (promotora é usuário primário)
- Acessibilidade WCAG 2.1 AA

## Definition of Done Expandida

**TODA STORY DEVE:**
1. ✅ Implementar funcionalidade conforme ACs
2. ✅ **VALIDAR TODOS OS NFRs APLICÁVEIS** (especialmente NFR1 - es-CO)
3. ✅ Passar em todos os testes unitários e E2E
4. ✅ Code review aprovado com checklist NFR
5. ✅ UAT aprovado incluindo validação de UX/localização
6. ✅ Build sem erros de lint/type-check
7. ✅ Documentação atualizada
8. ✅ Performance adequada (< 3s carregamento inicial)

## Uso pelos Agentes BMAD

### Para DEV Agent:
- SEMPRE consultar este arquivo antes de implementar
- SEMPRE validar NFR1 (es-CO) em toda interface
- SEMPRE incluir testes para requisitos de localização

### Para QA Agent:
- SEMPRE executar checklist NFR completo
- SEMPRE validar localização em code review
- SEMPRE incluir testes de UX/idioma em UAT

### Para Architect Agent:
- SEMPRE incluir considerações de i18n em arquiteturas
- SEMPRE revisar compliance com coding standards
- SEMPRE validar que tech stack suporta NFRs