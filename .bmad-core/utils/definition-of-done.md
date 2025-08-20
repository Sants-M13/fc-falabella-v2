# Definition of Done - FC Falabella v2

## 🎯 Overview
Esta Definition of Done é **OBRIGATÓRIA** para todas as stories e deve ser validada antes de qualquer story ser marcada como "Done". Nenhuma exceção é permitida para NFR1 (localização es-CO).

## 📋 Critérios Funcionais (Functional Requirements)

### Development Phase:
- [ ] **Acceptance Criteria**: Todos os ACs implementados e funcionais
- [ ] **Code Standards**: Código segue `docs/architecture/coding-standards.md`
- [ ] **Tech Stack Compliance**: Implementação usa stack aprovado em `docs/architecture/3-pilha-de-tecnologias-tech-stack.md`
- [ ] **TypeScript**: Código TypeScript strict mode sem erros
- [ ] **ESLint**: Sem warnings ou errors de linting
- [ ] **Unit Tests**: Testes unitários implementados (>80% cobertura para lógica crítica)

### Code Review Phase:
- [ ] **Peer Review**: Code review aprovado por tech lead ou senior dev
- [ ] **Architecture Compliance**: Solução alinhada com arquitetura definida
- [ ] **Security Review**: Validação de segurança (auth, RLS, input validation)
- [ ] **Performance Review**: Sem impactos negativos de performance óbvios

## 🚨 Critérios NFR - OBRIGATÓRIOS E NÃO-NEGOCIÁVEIS

### NFR1 - Localização es-CO (CRÍTICO - 100% COMPLIANCE)
**⚠️ BLOCKING**: Se qualquer item NFR1 falhar, story DEVE retornar para dev**

- [ ] **HTML Language**: `<html lang="es-CO">` configurado (NUNCA "en")
- [ ] **Interface 100% Spanish**: Zero texto em inglês na interface
- [ ] **Currency Format**: Formato COP implementado ($12.345 COP)
- [ ] **Date Format**: Formato DD/MM/YYYY (não MM/DD/YYYY americano)
- [ ] **Font Support**: Fontes suportam caracteres españoles (á, é, í, ó, ú, ñ, ü)
- [ ] **Cultural Accuracy**: Formatação numérica colombiana (ponto para milhares)

**NFR1 Validation Evidence Required:**
- [ ] Screenshot da interface mostrando textos em espanhol
- [ ] Console output confirmando `document.documentElement.lang === "es-CO"`
- [ ] Exemplos de formatação de moeda/data funcionando
- [ ] UAT completo usando `uat-localization-tmpl.md`

### NFR2 - Responsividade Mobile-First (HIGH PRIORITY)
- [ ] **Mobile Functional**: Interface funcional em 320px+ (teste obrigatório)
- [ ] **Breakpoint Coverage**: Testado em mobile (320px), tablet (768px), desktop (1024px+)
- [ ] **Touch Targets**: Botões e links >= 44px em dispositivos móveis
- [ ] **Content Scaling**: Conteúdo legível em todas as resoluções

### NFR3 - Controle de Acesso RBAC (SECURITY CRITICAL)
- [ ] **RLS Policies**: Implementadas para todas as tabelas novas/modificadas
- [ ] **Role Validation**: Middleware valida papéis de usuário corretamente
- [ ] **Route Protection**: Rotas protegidas baseadas em role
- [ ] **Data Filtering**: Promotoras veem apenas dados de sua loja (store_id)

### Performance & Accessibility:
- [ ] **Load Time**: Carregamento inicial < 3 segundos (teste local)
- [ ] **WCAG 2.1 AA**: Padrões básicos de acessibilidade atendidos
- [ ] **SEO Basic**: Meta tags apropriadas para páginas públicas

## 🧪 Critérios de Qualidade (Quality Assurance)

### QA Code Review (MANDATORY):
- [ ] **NFR Checklist**: `nfr-validation-checklist.md` 100% completo
- [ ] **Security Validation**: RLS policies e auth flow validados
- [ ] **Responsive Testing**: Multi-viewport testing completo
- [ ] **Localization Review**: Interface em espanhol validada

### UAT Testing (MANDATORY):
- [ ] **User Story Validation**: Story satisfaz necessidade do usuário
- [ ] **Happy Path Testing**: Fluxo principal funciona corretamente
- [ ] **Error Handling**: Tratamento de erros apropriado
- [ ] **UX Localization**: Experiência do usuário em espanhol é natural

**UAT Evidence Required:**
- [ ] Screenshots de teste em diferentes resoluções
- [ ] Documentação de fluxos de usuário testados
- [ ] Validação de mensagens de erro/sucesso em espanhol

## 📊 Build & Deployment

### Technical Validation:
- [ ] **Build Success**: `npm run build` sem erros
- [ ] **Type Check**: `npm run type-check` sem erros
- [ ] **Lint Check**: `npm run lint` sem warnings
- [ ] **Test Suite**: `npm run test` todos os testes passando

### Environment Readiness:
- [ ] **Environment Variables**: Configurações apropriadas para target environment
- [ ] **Database Migrations**: Scripts de migration testados e documentados
- [ ] **Dependencies**: Novas dependências aprovadas e documentadas

## ✅ Final Approval Workflow

### Phase 1 - Development Complete:
1. **Self-Check**: Dev executa todos os critérios funcionais
2. **NFR Self-Validation**: Dev valida NFR1 (localização) localmente
3. **Story Status**: Atualiza para "Ready for QA Review"

### Phase 2 - QA Code Review:
1. **NFR Validation**: QA executa `nfr-validation-checklist.md` completo
2. **Code Quality**: QA revisa código contra padrões estabelecidos
3. **IF NFR1 FAILS**: Story retorna imediatamente para dev (não continua para UAT)
4. **Story Status**: Atualiza para "Ready for UAT" apenas se NFR1 100% pass

### Phase 3 - UAT Testing:
1. **UAT Execution**: QA executa UAT usando `uat-localization-tmpl.md`
2. **User Validation**: Valida que story entrega valor ao usuário final
3. **Localization UX**: Confirma experiência em espanhol é apropriada
4. **Story Status**: Atualiza para "UAT Complete"

### Phase 4 - Final Sign-off:
1. **PO Review**: Product Owner aprova funcionalidade entregue
2. **Tech Lead Sign-off**: Aprovação técnica final
3. **QA Sign-off**: Confirmação que todos os NFRs foram validados
4. **Story Status**: "DONE"

## 🚫 Escalation & Exception Handling

### NFR1 (Localization) - NO EXCEPTIONS ALLOWED:
- ❌ **NEVER**: Aprovar story com qualquer falha de localização
- ❌ **NEVER**: "Deixar para próxima sprint" questões de idioma
- ❌ **NEVER**: Aceitar "funciona em inglês por enquanto"
- ✅ **ALWAYS**: Retornar para dev imediatamente se NFR1 falhar

### Other NFRs - Controlled Exceptions:
- **NFR2/3 Issues**: Podem ser negociadas com PO se impacto baixo
- **Performance Issues**: Podem ser aceitas com plano de otimização
- **Accessibility**: Pode ser diferida se não afeta usuários críticos

### Exception Approval Process:
1. **Document Issue**: Detalhamento específico do problema
2. **Impact Assessment**: Análise de impacto no usuário/negócio  
3. **PO Decision**: Product Owner decide se aceita ou rejeita
4. **Follow-up Story**: Obrigatório criar story para resolver issue
5. **Documentation**: Registrar exceção em story notes

## 🔄 Integration com BMAD Framework

### Agent Responsibilities:

#### DEV Agent:
- Deve consultar `coding-standards.md` antes de implementar
- Deve auto-validar NFR1 antes de marcar story como pronta
- Deve incluir evidência de localização nos commits

#### QA Agent:
- Deve executar `nfr-validation-checklist.md` obrigatoriamente
- Deve usar `uat-localization-tmpl.md` para todas as stories UI
- Deve escalar imediatamente falhas de NFR1

#### ARCHITECT Agent:
- Deve revisar compliance com Definition of Done durante reviews
- Deve atualizar DoD quando novos NFRs são identificados
- Deve garantir que tech stack suporta todos os NFRs

### BMAD Commands Integration:
```yaml
# Para validar DoD compliance
*execute-checklist: definition-of-done.md

# Para validar NFRs específicos  
*execute-checklist: nfr-validation-checklist.md

# Para executar UAT com foco em localização
*execute-uat: uat-localization-tmpl.md
```

## 📈 Continuous Improvement

### DoD Review Schedule:
- **Monthly**: Review e atualização baseada em learnings
- **Post-Release**: Análise de issues encontradas em produção
- **Quarterly**: Revisão estratégica com stakeholders

### Metrics to Track:
- **NFR1 Failure Rate**: % de stories que falham validação de localização
- **Rework Rate**: % de stories retornadas por falhas de DoD
- **Time to Done**: Tempo médio entre development complete e final Done
- **UAT Pass Rate**: % de stories que passam UAT na primeira tentativa

**🎯 Goal**: NFR1 failure rate = 0% (localização nunca pode falhar)