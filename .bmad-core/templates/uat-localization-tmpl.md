# UAT Template - Localização e UX Validation

## CRÍTICO: NFR Validation Template
⚠️ **MANDATORY**: Este template DEVE ser usado para toda story com interface de usuário
⚠️ **BLOCKING**: Se qualquer NFR1 (localização) falhar, PARAR e retornar para dev

## Story Information Template
- **ID**: {{STORY_ID}}
- **Title**: {{STORY_TITLE}}
- **User Persona**: {{USER_ROLE}}
- **Test Date**: {{CURRENT_DATE}}
- **Tester**: Quinn (via MCP Playwright)

## 🚨 MANDATORY NFR1 - Localização es-CO (CRITICAL)

### Pre-Test Validation
```yaml
environment_check:
  - [ ] MCP Playwright tools available (`mcp__playwright__*`)
  - [ ] Local dev server running (`npm run dev`)
  - [ ] Browser configured for Spanish locale detection
  - [ ] Test data includes Spanish text samples
```

### Automated Localization Tests
```yaml
test_1_html_language:
  test: "HTML document language attribute"
  priority: CRITICAL
  steps:
    1_navigate:
      tool: mcp__playwright__browser_navigate
      url: "{{APPLICATION_URL}}"
      expected: "Page loads successfully"
      
    2_check_html_lang:
      tool: mcp__playwright__browser_evaluate
      function: "() => document.documentElement.lang"
      expected: "es-CO"
      critical: true
      failure_action: "STOP_TEST_RETURN_TO_DEV"

test_2_interface_language:
  test: "All interface elements in Spanish"
  priority: CRITICAL
  steps:
    1_capture_page:
      tool: mcp__playwright__browser_snapshot
      validation: "Visual inspection for English text"
      
    2_check_common_elements:
      tool: mcp__playwright__browser_evaluate
      function: |
        () => {
          const commonEnglish = ['Login', 'Password', 'Email', 'Submit', 'Cancel', 'Save', 'Delete', 'Edit', 'Home', 'Dashboard'];
          const pageText = document.body.innerText;
          return commonEnglish.filter(word => pageText.includes(word));
        }
      expected: "Empty array (no English words found)"
      critical: true
      
test_3_currency_format:
  test: "Colombian Peso (COP) currency formatting"
  priority: HIGH
  steps:
    1_find_currency:
      tool: mcp__playwright__browser_evaluate
      function: |
        () => {
          const currencyElements = document.querySelectorAll('[data-testid*="price"], [data-testid*="currency"], .price, .currency, *[class*="price"], *[class*="currency"]');
          return Array.from(currencyElements).map(el => el.textContent);
        }
      expected: "COP format: $X.XXX COP or similar Colombian format"
      
test_4_date_format:
  test: "Colombian date format (DD/MM/YYYY)"
  priority: MEDIUM
  steps:
    1_find_dates:
      tool: mcp__playwright__browser_evaluate
      function: |
        () => {
          const dateInputs = document.querySelectorAll('input[type="date"], .date, [data-testid*="date"]');
          return Array.from(dateInputs).map(el => el.value || el.textContent || el.placeholder);
        }
      expected: "DD/MM/YYYY format (not MM/DD/YYYY American format)"
```

### Manual UX Validation Checklist
```yaml
spanish_interface_validation:
  - [ ] **Navigation Menu**: All menu items in Spanish
  - [ ] **Button Labels**: All buttons labeled in Spanish (e.g., "Iniciar Sesión", not "Login")
  - [ ] **Form Labels**: All form fields labeled in Spanish
  - [ ] **Error Messages**: Error messages appear in Spanish
  - [ ] **Success Messages**: Success messages appear in Spanish
  - [ ] **Placeholder Text**: Input placeholders in Spanish
  - [ ] **Page Titles**: Browser title and h1 tags in Spanish
  - [ ] **Help Text**: Any help/tooltip text in Spanish
  
colombian_cultural_validation:
  - [ ] **Currency Symbol**: Uses $ (peso sign), not USD symbols
  - [ ] **Number Format**: Uses periods for thousands (12.345), commas for decimals
  - [ ] **Date Format**: DD/MM/YYYY format consistently used
  - [ ] **Address Format**: Colombian address format (if applicable)
  - [ ] **Phone Format**: Colombian phone format (if applicable)
  
font_and_character_validation:
  - [ ] **Accent Characters**: á, é, í, ó, ú display correctly
  - [ ] **Special Characters**: ñ, ü display correctly
  - [ ] **Quotes**: Spanish quotes (« ») if used
  - [ ] **Font Rendering**: No character encoding issues visible
```

## 🚨 MANDATORY NFR2 - Responsiveness (Mobile-First)

### Responsive Behavior Tests
```yaml
test_mobile_320px:
  test: "Minimum mobile width functionality"
  steps:
    1_resize_mobile:
      tool: mcp__playwright__browser_resize
      width: 320
      height: 568
      
    2_snapshot_mobile:
      tool: mcp__playwright__browser_snapshot
      validation: "Interface usable at 320px width"
      
    3_test_navigation:
      tool: mcp__playwright__browser_click
      element: "Mobile navigation menu"
      validation: "Navigation accessible on mobile"

test_tablet_768px:
  test: "Tablet view functionality"
  steps:
    1_resize_tablet:
      tool: mcp__playwright__browser_resize
      width: 768
      height: 1024
      
    2_snapshot_tablet:
      tool: mcp__playwright__browser_snapshot
      validation: "Interface properly sized for tablet"

test_desktop_1024px:
  test: "Desktop view functionality"
  steps:
    1_resize_desktop:
      tool: mcp__playwright__browser_resize
      width: 1024
      height: 768
      
    2_snapshot_desktop:
      tool: mcp__playwright__browser_snapshot
      validation: "Desktop interface scales properly"
```

## 📋 Test Execution Protocol

### Step 1: Pre-Test Setup
```bash
# Environment preparation
npm run dev
# Wait for server to be ready
# Ensure test data is in Spanish
```

### Step 2: Execute NFR Tests (MANDATORY FIRST)
1. **NFR1 Localization** (CRITICAL - Must be 100%)
   - Execute all localization automated tests
   - Perform manual Spanish interface validation
   - IF ANY FAIL: STOP and return to development

2. **NFR2 Responsiveness** (HIGH Priority)
   - Test all major breakpoints
   - Validate mobile-first approach works
   - Document any responsive issues

### Step 3: Document Results
```yaml
nfr_test_results:
  nfr1_localization:
    html_lang: "✅ es-CO / ❌ {found_value}"
    interface_language: "✅ 100% Spanish / ❌ English found: {examples}"
    currency_format: "✅ COP format / ❌ {found_format}"
    date_format: "✅ DD/MM/YYYY / ❌ {found_format}"
    overall_status: "PASS/FAIL"
    
  nfr2_responsiveness:
    mobile_320px: "✅ Functional / ❌ {issues}"
    tablet_768px: "✅ Functional / ❌ {issues}"
    desktop_1024px: "✅ Functional / ❌ {issues}"
    overall_status: "PASS/FAIL"
```

## ❌ Failure Scenarios and Actions

### NFR1 (Localization) Failure
```markdown
🚨 CRITICAL FAILURE - Return to Development Immediately

Found Issues:
- [ ] HTML lang="en" instead of "es-CO"
- [ ] English text in interface: "{specific_examples}"
- [ ] Wrong currency format: "{found}" should be "$X.XXX COP"  
- [ ] American date format: "{found}" should be "DD/MM/YYYY"

Actions Required:
1. STOP all testing immediately
2. Document specific localization failures
3. Return story to development with HIGHEST priority
4. Do NOT proceed with functional testing until fixed
```

### NFR2 (Responsiveness) Failure
```markdown
⚠️ HIGH PRIORITY - Document and Negotiate

Found Issues:
- [ ] Mobile breakage at {width}px: {description}
- [ ] Touch targets too small: {elements}
- [ ] Content overflow: {specific_locations}

Actions Required:
1. Document responsive issues with screenshots
2. Negotiate with PO if story can proceed
3. Create follow-up story if acceptable to defer
```

## ✅ Success Criteria

### For Story Approval:
- **NFR1 Localization**: 100% PASS required (non-negotiable)
- **NFR2 Responsiveness**: 90% PASS acceptable with PO sign-off
- **Functional Requirements**: All ACs validated
- **UX Quality**: Spanish user experience is natural and intuitive

### Evidence Required:
- Screenshots of Spanish interface at multiple breakpoints
- Documentation of currency/date formats working correctly
- Console output showing `document.documentElement.lang === "es-CO"`
- Test execution log with all NFR validations

## Integration with BMAD Agents

### For QA Agent Usage:
```yaml
# Execute this UAT template for any UI story
execute_uat_localization:
  template: uat-localization-tmpl.md
  mandatory_validation: ["NFR1_localization"]
  blocking_failures: ["html_lang_wrong", "english_interface_found"]
  escalation_required: true
```

### For Story Completion:
- This template MUST be completed before any UI story is marked "Done"
- NFR1 failures require immediate development rework
- All NFR evidence must be documented in story file