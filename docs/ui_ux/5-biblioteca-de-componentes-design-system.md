# 5. Biblioteca de Componentes / Design System

## Decisão Arquitetural Oficial

**DEFINIDO**: shadcn/ui como biblioteca base obrigatória + Magic UI para efeitos específicos em admin desktop.

### Bibliotecas Aprovadas

#### shadcn/ui (Base Obrigatória)
- **Uso**: Todos os componentes de interface
- **Racional**: Moderna, acessível (WCAG 2.1 AA), baseada em Radix UI + Tailwind
- **Implementação**: Componentes headless, zero CSS-in-JS
- **Contexto**: Admin + Promotora + Shared components

#### Magic UI (Efeitos Visuais)
- **Uso**: Apenas rotas admin desktop
- **Racional**: Efeitos visuais profissionais e sutis
- **Implementação**: Lazy loading obrigatório
- **Contexto**: Exclusivamente admin (desktop)

#### Tailwind CSS (Estilização)
- **Uso**: Todo o sistema de estilização
- **Racional**: Utility-first, performance otimizada
- **Implementação**: Sistema de tema configurado (cores Falabella)
- **Contexto**: Universal

### Arquitetura de Performance

| Usuário | Platform | Stack UI | Objetivo |
|---------|----------|----------|----------|
| **Admin** | Desktop | shadcn/ui + Magic UI | Visual profissional, "boa primeira impressão" |
| **Promotora** | Mobile | shadcn/ui apenas | Performance crítica, mobile-first |
| **Shared** | Universal | shadcn/ui apenas | Compatibilidade total |

### Componentes Principais

**shadcn/ui Components (Aprovados):**
- Button, Input, Card, Badge, Avatar
- Dropdown Menu, Sheet, Dialog, Toast
- Form, Table, Separator
- Typography, Layout components

**Magic UI Effects (Admin apenas):**
- BorderBeam (bordas elegantes)
- GradientText (texto com gradiente)
- NumberTicker (números animados)
- DotPattern (padrões sutis)

### Restrições Técnicas

**PROIBIDO em qualquer contexto:**
- Material-UI (MUI)
- Ant Design
- Chakra UI
- Bootstrap
- Foundation
- Qualquer outra biblioteca de componentes

**Motivo das restrições:**
- Conflitos de styling
- Inconsistência visual
- Performance degradada
- Manutenibilidade comprometida

### Sistema de Tema

**Cores Falabella (Configuradas):**
```css
:root {
  --falabella-red: #E31837;
  --falabella-dark-red: #B91C3C;
  --falabella-gray: #64748B;
  --falabella-light-gray: #F8FAFC;
}
```

**Typography:**
- **Font Family**: Inter (suporte a acentos es-CO)
- **Hierarchy**: Sistema Tailwind (text-sm, text-base, text-lg...)
- **Colors**: text-slate-900, text-slate-600, text-slate-400

### Implementação Técnica

**Estrutura de Arquivos:**
```
/apps/web/components/
├── ui/           # shadcn/ui (auto-generated)
├── admin/        # Magic UI wrappers (admin-only)
├── shared/       # Cross-platform components
└── auth/         # Authentication UI
```

**Import Pattern (Obrigatório):**
```typescript
// ✅ CORRETO
import { Button } from '@/components/ui/button'
import { BorderBeam } from '@magicui/react' // admin apenas

// ❌ PROIBIDO
import { Button } from '@mui/material'
```

### Consistência Visual

**Princípios de Design:**
- **Bem bonito**: Visual profissional e moderno
- **Boa primeira impressão**: Layout limpo e organizado
- **Sem exagero**: Efeitos sutis, não distrações
- **Mobile-first**: Promotora é usuário primário

**Guidelines Visuais:**
- Gradientes sutis e profissionais
- Sombras bem aplicadas (shadow-sm, shadow-md)
- Animações suaves de hover/focus
- Ícones bem posicionados (Lucide React)
- Spacing consistente (Tailwind system)

### Acessibilidade

**WCAG 2.1 AA (Obrigatório):**
- shadcn/ui garante acessibilidade nativa
- Contrast ratios adequados
- Keyboard navigation
- Screen reader support
- Focus management

### Governança e Validação

**Code Review Checklist:**
- [ ] Apenas shadcn/ui e Magic UI utilizados?
- [ ] Magic UI apenas em rotas admin?
- [ ] Tema e cores seguem padrão configurado?
- [ ] Visual consistente com páginas existentes?

**Para detalhes completos:**
Ver [Governança do Design System](./10-governanca-design-system.md)

### Evolução do Design System

**Versão atual**: 1.0 (2025-08-20)
**Próxima revisão**: Após primeira implementação completa
**Critérios para mudança**: Limitações críticas identificadas, aprovação arquitetural

---

**Status**: ✅ APROVADO e IMPLEMENTADO  
**Responsável**: Winston (Architect) 🏗️  
**Próximo passo**: Implementação nas páginas da Story 1.1
