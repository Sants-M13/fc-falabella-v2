# UAT Tests - MCP Playwright Integration

## Overview
This directory contains User Acceptance Tests (UAT) executed using MCP Playwright tools integrated with Claude Code.

## Directory Structure
```
uat-tests/
├── README.md           # This file
├── pending/           # Tests waiting to be executed
├── in-progress/       # Currently executing tests
├── completed/         # Successfully completed tests
└── blocked/          # Tests blocked by issues
```

## Test Execution Requirements

### CRITICAL: MCP Playwright Only
⚠️ **ALL UAT tests MUST use MCP Playwright tools**
- Tools prefix: `mcp__playwright__*`
- NO standalone Playwright installation
- NO alternative testing frameworks

### Prerequisites
1. **Claude Code with MCP configured**
2. **Development server running** (`npm run dev`)
3. **Test data in database**
4. **Story marked as "Dev Complete"**

## How to Execute UAT Tests

### Step 1: Verify MCP Playwright
```bash
# Check if MCP Playwright tools are available
# Look for tools like:
- mcp__playwright__browser_navigate
- mcp__playwright__browser_click
- mcp__playwright__browser_type
- mcp__playwright__browser_snapshot
```

### Step 2: Prepare Test Environment
```bash
# Start the development server
npm run dev

# Ensure Supabase is running
supabase start
```

### Step 3: Execute Test
1. Navigate to the story's UAT test file
2. Follow the test steps using MCP Playwright tools
3. Document results in the test file
4. Move to appropriate folder based on outcome

## Test File Template
All UAT tests should follow the template at:
`.bmad-core/templates/uat-test-mcp-tmpl.md`

## Test Workflow

### For New Stories
1. Create UAT test file from template
2. Place in `pending/` folder
3. Execute when story is dev complete
4. Move to `completed/` or `blocked/`

### Test Outcomes
- **PASS**: Move to `completed/`, update story status
- **FAIL**: Document issues, return to development
- **BLOCKED**: Move to `blocked/`, escalate issue

## MCP Playwright Commands Reference

### Navigation
```yaml
mcp__playwright__browser_navigate:
  url: "http://localhost:3000/login"
```

### User Interaction
```yaml
mcp__playwright__browser_click:
  element: "Sign in button"
  ref: "button[type='submit']"

mcp__playwright__browser_type:
  element: "Email field"
  ref: "input[name='email']"
  text: "user@example.com"
```

### Validation
```yaml
mcp__playwright__browser_wait_for:
  text: "Welcome"

mcp__playwright__browser_snapshot:
  # Captures accessibility tree
```

## Troubleshooting

### MCP Playwright Not Available
1. Check Claude Code MCP configuration
2. Restart Claude Code
3. Verify `.mcp.json` configuration
4. Contact team for support

### Test Failures
1. Check server is running
2. Verify test data exists
3. Update selectors if UI changed
4. Review console for errors

## Test Standards

### Quality Criteria
- Test from user perspective
- Validate business value
- Document all findings
- Provide actionable feedback

### Evidence Requirements
- Initial state screenshot
- Action screenshots
- Final state validation
- Error documentation

## Support
For issues with UAT testing:
1. Check this README
2. Review checklist at `.bmad-core/checklists/uat-validation-checklist.md`
3. Consult QA agent (`@qa` in BMAD)
4. Escalate to team if blocked