# NFR Validation Checklist - QA Obrigatório

## Instruções para QA Agent

**CRÍTICO**: Este checklist DEVE ser executado em TODA story que contenha interface de usuário. Nenhuma story pode ser aprovada sem 100% dos itens NFR validados.

## 🌐 NFR1 - Localização es-CO (CRÍTICO - NUNCA PODE FALHAR)

### Code Review Phase:
- [ ] **HTML lang attribute**: Verificar `<html lang="es-CO">` (NUNCA "en")
- [ ] **Fontes configuradas**: Verificar `subsets: ["latin", "latin-ext"]` ou similar
- [ ] **Strings hardcoded**: Nenhuma string em inglês na interface
- [ ] **Formatação de moeda**: Implementado formato COP correto
- [ ] **Formatação de data**: Implementado DD/MM/YYYY (não MM/DD/YYYY)
- [ ] **Timezone configurado**: America/Bogota quando aplicável

### Testes Automatizados:
- [ ] **Unit tests**: Testes para formatação de moeda/data existem
- [ ] **E2E tests**: Incluem validação de idioma da interface
- [ ] **Type checking**: Build sem erros de TypeScript
- [ ] **Lint checking**: ESLint passa sem warnings de localização

### UAT Preparation:
- [ ] **UAT plan**: Inclui seção específica para validação de localização
- [ ] **Test data**: Dados de teste em espanhol quando aplicável
- [ ] **Currency validation**: Testes incluem verificação de formato COP
- [ ] **Date validation**: Testes verificam formato DD/MM/YYYY

## 🔐 NFR2 - Responsividade Mobile-First

### Code Review Phase:
- [ ] **Mobile-first CSS**: Tailwind classes mobile por padrão
- [ ] **Breakpoints apropriados**: sm:, md:, lg: usados corretamente
- [ ] **Touch targets**: Botões/links >= 44px em mobile
- [ ] **Viewport meta**: Configurado corretamente

### Testes Automatizados:
- [ ] **Responsive tests**: Testes E2E em diferentes viewports
- [ ] **Mobile UX tests**: Fluxos críticos testados em mobile

## 🔐 NFR3 - Controle de Acesso (RLS/RBAC)

### Code Review Phase:
- [ ] **RLS policies**: Tabelas novas têm RLS habilitado
- [ ] **Role validation**: Middleware valida roles corretamente
- [ ] **Route protection**: Rotas protegidas adequadamente
- [ ] **Data filtering**: Queries filtram por store_id quando aplicável

### Testes Automatizados:
- [ ] **Auth tests**: Fluxos de login/logout funcionais
- [ ] **Permission tests**: Testes de acesso negado implementados
- [ ] **Role switching tests**: Validação de diferentes papéis

## 🚀 Performance NFRs

### Code Review Phase:
- [ ] **Bundle size**: Imports otimizados, tree-shaking aplicado
- [ ] **Image optimization**: Next.js Image component usado
- [ ] **Lazy loading**: Componentes pesados carregados sob demanda
- [ ] **Database queries**: Queries otimizadas, sem N+1 problems

### Testes Automatizados:
- [ ] **Load time tests**: Carregamento inicial < 3s
- [ ] **Performance tests**: Core Web Vitals dentro do aceitável

## 🎯 Accessibility NFRs

### Code Review Phase:
- [ ] **Semantic HTML**: Tags apropriadas (button, nav, main, etc.)
- [ ] **ARIA labels**: Elementos interativos têm labels apropriados
- [ ] **Color contrast**: Tailwind classes garantem contraste adequado
- [ ] **Focus management**: Navegação por teclado funcional

## ✅ Approval Criteria

**Para aprovar uma story, TODOS os itens devem estar ✅:**

### Fase Code Review:
- NFR1 (Localização): **100% dos itens** ✅
- NFR2 (Responsividade): **100% dos itens** ✅  
- NFR3 (Segurança): **100% dos itens** ✅
- Performance: **80% dos itens** ✅
- Accessibility: **80% dos itens** ✅

### Fase Testes:
- Todos os testes automatizados NFR: **100% passando** ✅
- UAT incluindo validação de localização: **Aprovado** ✅

## 🚨 Escalation Process

**Se qualquer item NFR1 (Localização) falhar:**
1. **PARAR** review imediatamente
2. **RETORNAR** para Development com prioridade ALTA
3. **DOCUMENTAR** falha específica em detalhes
4. **NÃO APROVAR** até correção completa

**Para outros NFRs:**
- Documentar findings
- Negociar com PO se necessário
- Aprovar apenas com sign-off explícito

## Integration com BMAD Agents

### QA Agent Usage:
```yaml
# Sempre executar antes de aprovar qualquer story
task: execute-checklist
checklist: nfr-validation-checklist.md
requirement: 100% NFR1 compliance
```

### Story Template Integration:
- Todo template de story deve referenciar este checklist
- ACs devem incluir "NFR validation complete"
- DoD deve incluir "NFR checklist approved"