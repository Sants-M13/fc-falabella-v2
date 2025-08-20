# 10. Governança do Design System

## Objetivo

Garantir consistência visual e arquitetural em todas as implementações futuras do sistema FC Falabella v2, estabelecendo padrões obrigatórios para componentes de interface e experiência do usuário.

## Aplicabilidade

- ✅ **Todos os stories e features** que envolvem interface do usuário
- ✅ **Novos componentes** e páginas
- ✅ **Refatorações** de UI existente
- ✅ **Equipes de desenvolvimento** e Scrum Masters

---

## Regras de Governança

### 1. Biblioteca Oficial Obrigatória

**shadcn/ui como padrão base:**
- Única biblioteca de componentes aprovada para o projeto
- Baseada em Radix UI (acessibilidade nativa)
- Componentes headless + Tailwind CSS
- Zero CSS-in-JS para otimização de performance

**Magic UI para desktop admin:**
- Permitido apenas em rotas administrativas desktop
- Foco em efeitos visuais sutis e profissionais
- Implementação via lazy loading obrigatório

**Bibliotecas PROIBIDAS:**
- Material-UI (MUI)
- Ant Design
- Chakra UI
- Bootstrap
- Foundation
- Qualquer outra biblioteca de componentes

### 2. Padrão Visual Estabelecido

**Tema configurado (obrigatório):**
- Cores Falabella: Red (#E31837), Dark Red (#B91C3C)
- Typography: Inter como fonte padrão
- Espacements: Sistema Tailwind CSS padrão
- Shadows: Sistema shadcn/ui (shadow-sm, shadow-md)

**Consistência visual:**
- Componentes devem seguir o tema configurado
- Modificações no tema requerem aprovação arquitetural
- Referência obrigatória: páginas já implementadas

### 3. Performance por Contexto

**Admin (Desktop):**
- shadcn/ui + Magic UI permitido
- Foco em visual profissional
- Performance secundária (mas monitorada)

**Promotora (Mobile):**
- APENAS shadcn/ui
- Zero Magic UI ou efeitos visuais
- Performance é prioridade crítica

**Shared Components:**
- APENAS shadcn/ui
- Componentes neutros que funcionam em ambos contextos

---

## Responsabilidades por Papel

### Scrum Masters (SM)

**Ao criar Stories:**
1. Incluir especificação: "Implementar usando shadcn/ui conforme padrão do projeto"
2. Especificar contexto: Admin (desktop) ou Promotora (mobile) 
3. Referenciar componentes similares já existentes
4. Incluir AC de consistência visual no DoD

**Acceptance Criteria padrão para Stories de UI:**
```
- [ ] Implementação usa shadcn/ui conforme padrão do projeto
- [ ] Visual consistente com páginas existentes (admin/promotora)
- [ ] Performance adequada ao contexto (desktop/mobile)
- [ ] Zero bibliotecas de UI externas adicionadas
```

### Developers

**Workflow obrigatório:**
1. Verificar se componente existe no shadcn/ui antes de implementar
2. Se não existir: `npx shadcn-ui@latest add [component]`
3. Para efeitos visuais: Magic UI apenas em rotas admin com lazy loading
4. Consultar páginas existentes como referência

**Imports permitidos:**
```typescript
// ✅ CORRETO - shadcn/ui
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

// ✅ CORRETO - Magic UI (apenas admin)
import { BorderBeam } from '@magicui/react'

// ❌ PROIBIDO - outras bibliotecas
import { Button } from '@mui/material'
import { Card } from 'antd'
```

### Product Owner

**Durante acceptance:**
- Validar consistência visual com design system
- Verificar adequação UX ao tipo de usuário (admin/promotora)
- Confirmar boa primeira impressão profissional
- Validar performance adequada ao contexto

---

## Validação e Controle de Qualidade

### Checklist para Code Review

**Arquitetura:**
- [ ] Apenas shadcn/ui e Magic UI (se admin) utilizados?
- [ ] Nenhuma biblioteca de UI externa adicionada?
- [ ] Imports seguem padrão estabelecido?

**Visual:**
- [ ] Tema e cores seguem configuração padrão?
- [ ] Componente escolhido é o mais apropriado?
- [ ] Visual consistente com páginas existentes?

**Performance:**
- [ ] Magic UI com lazy loading (se aplicável)?
- [ ] Performance adequada ao contexto (desktop/mobile)?
- [ ] Core Web Vitals não comprometidos?

### Red Flags - Escalação Obrigatória

**Quando escalar para Architect:**
- Developer solicita adição de nova biblioteca de UI
- Componente shadcn/ui não atende necessidade específica
- Performance degradada após implementação
- Visual inconsistente com padrão estabelecido

**Processo de escalação:**
1. **Dev → SM**: Reportar limitação do shadcn/ui
2. **SM → Architect**: Solicitar análise técnica
3. **Architect**: Avaliar viabilidade e impacto
4. **Decisão**: Aprovar exceção ou propor alternativa
5. **Se aprovado**: Documentar nova exceção/padrão

---

## Implementação Técnica

### Estrutura de Arquivos Padrão

```
/apps/web/
├── components/
│   ├── ui/           # shadcn/ui (auto-generated)
│   ├── admin/        # Admin-specific (Magic UI permitido)
│   ├── shared/       # Cross-platform (apenas shadcn/ui)
│   └── auth/         # Authentication (shadcn/ui)
├── lib/
│   ├── utils.ts      # cn() utility
│   └── theme.ts      # Theme configuration
└── styles/
    └── globals.css   # shadcn/ui + Tailwind
```

### Comandos de Referência

```bash
# Verificar componentes disponíveis
npx shadcn-ui@latest

# Adicionar novo componente
npx shadcn-ui@latest add [component-name]

# Verificar componentes instalados
ls /apps/web/components/ui/

# Validar build sem erros
npm run build
npm run type-check
```

---

## Monitoramento e Métricas

### Indicadores de Sucesso

**Consistência:**
- 100% das novas implementações usando shadcn/ui
- Zero adições de bibliotecas UI externas
- Tempo de code review reduzido (padrões claros)

**Performance:**
- Core Web Vitals mantidos ou melhorados
- Bundle size controlado por contexto
- Time to Interactive < 3s (promotora)

**Qualidade:**
- Acessibilidade WCAG 2.1 AA mantida
- Zero regressões visuais
- Feedback positivo de usuários (primeira impressão)

---

## Recursos e Referências

### Documentação Oficial
- **shadcn/ui**: https://ui.shadcn.com
- **Magic UI**: https://magicui.design (apenas admin)
- **Radix UI**: https://radix-ui.com (base de acessibilidade)

### Referências no Projeto
- **Admin example**: `/apps/web/app/(admin)/admin/page.tsx`
- **Promotora example**: `/apps/web/app/(promotora)/promotora/page.tsx`
- **Theme config**: `/apps/web/tailwind.config.ts`
- **Components**: `/apps/web/components/ui/`

### Para Dúvidas e Suporte
- **Architect Agent**: Winston 🏗️
- **Architecture docs**: `/docs/architecture/coding-standards.md`
- **Implementation guide**: `/prompts/ui-modernization-implementation.md`

---

## Versionamento e Evolução

### Versão Atual: 1.0
- **Data**: 2025-08-20
- **Status**: Ativo
- **Próxima revisão**: Após primeira implementação completa

### Histórico de Mudanças
| Data | Versão | Mudanças | Autor |
|------|--------|----------|-------|
| 2025-08-20 | 1.0 | Criação inicial do documento | Winston (Architect) |

### Critérios para Evolução
- Feedback de desenvolvimento após implementação
- Limitações identificadas do shadcn/ui
- Necessidades não atendidas pela biblioteca atual
- Performance issues significativos

---

## Conclusão

Esta governança garante que todas as futuras implementações mantenham consistência visual, performance adequada e qualidade técnica, estabelecendo o FC Falabella v2 como sistema profissional, moderno e bem estruturado.

**Princípio fundamental**: Consistência visual = melhor experiência do usuário = sucesso do produto.