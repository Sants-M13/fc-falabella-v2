# UAT Tests Directory

## Overview
This directory contains User Acceptance Tests (UAT) executed using MCP Playwright integration. Each test validates that completed stories deliver real value to end users.

## Structure
```
uat-tests/
├── README.md                 # This file
├── completed/               # Tests for completed stories
│   └── story-{id}-uat.md   # Individual UAT results
├── pending/                 # Tests awaiting execution
└── blocked/                 # Tests blocked by issues
```

## Test Execution Requirements

### CRITICAL: MCP Playwright Only
- **MANDATORY**: All tests use MCP Playwright tools (`mcp__playwright__*`)
- **NO ALTERNATIVES**: Do not install standalone Playwright
- **BLOCKING**: If MCP unavailable, tests cannot proceed

### Prerequisites
1. MCP Playwright configured in Claude Code
2. Local development server running (`npm run dev`)
3. Test database with sample data
4. Story marked as "Dev Complete"

## Test Workflow

### 1. Story Completion
When development completes a story:
- Story status changes to "Dev Complete"
- UAT test file created in `pending/`

### 2. UAT Execution
QA executes test using MCP Playwright:
- Navigate to application
- Perform user actions
- Validate outcomes
- Capture evidence

### 3. Results Documentation
- **PASS**: Move test to `completed/` with evidence
- **FAIL**: Document issues, return story to development
- **BLOCKED**: Move to `blocked/` with explanation

## MCP Playwright Tools Used

### Core Navigation
- `mcp__playwright__browser_navigate` - Open pages
- `mcp__playwright__browser_snapshot` - Capture state
- `mcp__playwright__browser_close` - Cleanup

### User Interactions
- `mcp__playwright__browser_click` - Click elements
- `mcp__playwright__browser_type` - Enter text
- `mcp__playwright__browser_select_option` - Choose options

### Validation
- `mcp__playwright__browser_wait_for` - Wait for content
- `mcp__playwright__browser_evaluate` - Custom checks
- `mcp__playwright__browser_take_screenshot` - Evidence

## Test Status Indicators

- ✅ **PASS**: User value delivered as promised
- ❌ **FAIL**: Acceptance criteria not met
- ⚠️ **BLOCKED**: Cannot execute due to environment issue
- 🔄 **PENDING**: Awaiting execution

## Quick Reference

### Execute a UAT Test
1. Ensure MCP Playwright available
2. Start dev server: `npm run dev`
3. Open test file from `pending/`
4. Execute MCP commands per test steps
5. Document results
6. Move file to appropriate folder

### Report an Issue
If MCP Playwright not available:
```markdown
STATUS: BLOCKED
Issue: MCP Playwright tools not accessible
Action Required: Fix MCP configuration
Cannot proceed until resolved
```

## Test Metrics

Track for each sprint:
- Tests executed
- Pass rate
- Blocked tests
- Average execution time
- User value validated

## Contact
- **QA Lead**: Quinn (Test Architect)
- **Issue Escalation**: Report MCP issues immediately
- **Documentation**: Update test files with all evidence