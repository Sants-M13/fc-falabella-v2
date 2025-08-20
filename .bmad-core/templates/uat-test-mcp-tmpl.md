# UAT Test Template - MCP Playwright Integration

## CRITICAL REQUIREMENTS
⚠️ **MANDATORY**: This test MUST use MCP Playwright (mcp__playwright__*) tools
⚠️ **BLOCKING**: If MCP Playwright is not available, STOP and report the issue
⚠️ **NO ALTERNATIVES**: Do NOT install or use standalone Playwright

## Test Configuration for Story {{STORY_ID}}

### Story Information
- **ID**: {{STORY_ID}}
- **Title**: {{STORY_TITLE}}
- **User Persona**: {{USER_ROLE}}
- **Business Value**: {{BUSINESS_VALUE}}

## MCP Playwright Validation Process

### Step 1: Verify MCP Playwright Availability
```yaml
required_tools:
  - mcp__playwright__browser_navigate
  - mcp__playwright__browser_snapshot
  - mcp__playwright__browser_click
  - mcp__playwright__browser_type
  - mcp__playwright__browser_wait_for
```

### Step 2: User Journey Test Structure

#### Test Case: {{PRIMARY_USER_FLOW}}
```yaml
test_scenario: "As a {{USER_ROLE}}, I can {{USER_GOAL}}"

preconditions:
  - System state: {{INITIAL_STATE}}
  - User credentials: {{TEST_USER_TYPE}}
  - Data setup: {{REQUIRED_DATA}}

test_steps:
  1_navigate:
    tool: mcp__playwright__browser_navigate
    url: "{{APPLICATION_URL}}"
    expected: "Page loads successfully"
    
  2_capture_initial:
    tool: mcp__playwright__browser_snapshot
    purpose: "Document initial state"
    
  3_user_action:
    tool: mcp__playwright__browser_{{ACTION_TYPE}}
    element: "{{ELEMENT_DESCRIPTION}}"
    ref: "{{ELEMENT_REF}}"
    value: "{{INPUT_VALUE}}"
    
  4_wait_for_result:
    tool: mcp__playwright__browser_wait_for
    text: "{{SUCCESS_INDICATOR}}"
    
  5_validate_outcome:
    tool: mcp__playwright__browser_snapshot
    validate: "{{EXPECTED_OUTCOME}}"

success_criteria:
  - User achieves: {{USER_GOAL}}
  - System shows: {{SUCCESS_STATE}}
  - Data reflects: {{DATA_CHANGE}}
```

## MCP Playwright Commands Reference

### Essential Commands for UAT
```yaml
# Navigation
mcp__playwright__browser_navigate:
  url: "http://localhost:3000/{{PATH}}"

# Page State Capture
mcp__playwright__browser_snapshot:
  purpose: "Accessibility tree for validation"

# User Interactions
mcp__playwright__browser_click:
  element: "Button with text 'Login'"
  ref: "button[type='submit']"

mcp__playwright__browser_type:
  element: "Email input field"
  ref: "input[name='email']"
  text: "test@example.com"

# Validation
mcp__playwright__browser_wait_for:
  text: "Welcome, {{USER_NAME}}"
  
mcp__playwright__browser_evaluate:
  function: "() => document.querySelector('.error-message')?.textContent"
```

## User Value Assertions

### Functional Validation
- [ ] Feature accessible via expected path
- [ ] All UI elements present and functional
- [ ] User flow completes without errors
- [ ] Data persists correctly

### Experience Validation  
- [ ] Page loads within 3 seconds
- [ ] Feedback messages appear appropriately
- [ ] Navigation is intuitive
- [ ] Errors are handled gracefully

### Business Impact
- [ ] Story's "so that" clause is achieved
- [ ] Measurable value delivered
- [ ] No regression in existing features

## Test Execution Protocol

### Pre-Test Checklist
1. [ ] MCP Playwright tools available (`mcp__playwright__*`)
2. [ ] Local dev server running (`npm run dev`)
3. [ ] Test data prepared in database
4. [ ] Browser instance ready

### During Test
1. Navigate to feature
2. Capture initial state (snapshot)
3. Execute user actions
4. Wait for expected results
5. Capture final state (snapshot)
6. Validate against acceptance criteria

### Post-Test
1. Document results in story file
2. Save screenshots/evidence
3. Update QA gate status

## Blocking Issues Protocol

### If MCP Playwright Not Available:
```markdown
⚠️ TEST BLOCKED - MCP Playwright Unavailable
- Issue: Cannot access mcp__playwright__ tools
- Action: STOP testing immediately
- Report: Notify team of MCP configuration issue
- Resolution: Fix MCP setup before continuing
```

### If Test Fails:
```markdown
❌ TEST FAILED - User Value Not Delivered
- Story: {{STORY_ID}}
- Failed Criteria: {{SPECIFIC_AC}}
- Evidence: {{SCREENSHOT/ERROR}}
- Next Steps: Return story to development
```

## Example Test Execution Log

```markdown
### UAT Execution: {{DATE}}
- Tester: Quinn (QA via MCP Playwright)
- Environment: Local development
- Result: {{PASS/FAIL}}

#### Steps Executed:
1. ✅ Navigated to {{URL}}
2. ✅ Captured initial state
3. ✅ Performed {{USER_ACTION}}
4. ✅/❌ Validated {{EXPECTED_RESULT}}

#### Evidence:
- Initial snapshot: {{SNAPSHOT_1}}
- Final snapshot: {{SNAPSHOT_2}}
- Error (if any): {{ERROR_MESSAGE}}
```

## Story-Specific Test Data

### Test Users
```yaml
admin_user:
  email: "admin@test.local"
  password: "test123"
  role: "admin"

promotora_user:
  email: "promotora@test.local"  
  password: "test123"
  role: "promotora"
  store_id: "{{TEST_STORE_ID}}"
```

### Test Scenarios
1. **Happy Path**: {{MAIN_SUCCESS_FLOW}}
2. **Edge Case**: {{BOUNDARY_CONDITION}}
3. **Error Case**: {{ERROR_HANDLING}}

## Integration with QA Workflow

This UAT test should be executed:
1. After development marks story as complete
2. Before QA signs off on story
3. As part of regression testing for releases
4. When validating production deployments

**Remember**: WITHOUT MCP Playwright, NO TEST PROCEEDS!