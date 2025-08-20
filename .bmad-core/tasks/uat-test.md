# uat-test

Execute User Acceptance Testing for a story using MCP Playwright browser automation tools.

## Inputs

```yaml
required:
  - story_id: '{epic}.{story}' # e.g., "1.1"
  - story_path: '{devStoryLocation}/{epic}.{story}.*.md' # Path from core-config.yaml
```

## Prerequisites

- Story status must be "Dev Complete" or "Review"
- MCP Playwright tools must be available (`mcp__playwright__*`)
- Development server must be running (`npm run dev`)
- Test data must be prepared in database

## UAT Execution Process

### 1. Verify MCP Playwright Availability

**CRITICAL**: This task REQUIRES MCP Playwright tools. If not available:
- STOP execution immediately
- Report the issue to the user
- Do NOT attempt to use standalone Playwright

Required tools:
- `mcp__playwright__browser_navigate`
- `mcp__playwright__browser_snapshot`
- `mcp__playwright__browser_click`
- `mcp__playwright__browser_type`
- `mcp__playwright__browser_wait_for`

### 2. Locate or Create UAT Test File

Check for existing test file:
- Path: `docs/qa/uat-tests/pending/{epic}.{story}-uat.md`
- If exists: Use existing test plan
- If not exists: Create from template

To create new test:
1. Load template from `.bmad-core/templates/uat-test-mcp-tmpl.md`
2. Replace placeholders with story information
3. Save to `docs/qa/uat-tests/pending/{epic}.{story}-uat.md`

### 3. Execute Test Steps

For each test case in the UAT file:

1. **Navigate to feature**
   ```yaml
   tool: mcp__playwright__browser_navigate
   url: "http://localhost:3000/{feature-path}"
   ```

2. **Capture initial state**
   ```yaml
   tool: mcp__playwright__browser_snapshot
   purpose: "Document starting conditions"
   ```

3. **Perform user actions**
   ```yaml
   tool: mcp__playwright__browser_click
   element: "Button description"
   ref: "CSS selector"
   
   tool: mcp__playwright__browser_type
   element: "Input field description"
   ref: "CSS selector"
   text: "User input"
   ```

4. **Wait for results**
   ```yaml
   tool: mcp__playwright__browser_wait_for
   text: "Expected text on page"
   ```

5. **Validate outcomes**
   ```yaml
   tool: mcp__playwright__browser_snapshot
   purpose: "Capture final state for validation"
   ```

### 4. Document Results

Update the UAT test file with actual results:

```markdown
### Test Execution Log
Date: {current_date}
Tester: Quinn (via MCP Playwright)
Environment: Local development

#### Test Results:
- Test 1: [PASS/FAIL] - [Notes]
- Test 2: [PASS/FAIL] - [Notes]
- Test 3: [PASS/FAIL] - [Notes]

#### Evidence:
- Initial snapshot: Captured
- User actions: Documented
- Final state: Validated
- Console errors: [None/Listed]

#### Issues Found:
[Document any failures or unexpected behavior]

#### Recommendations:
[Provide actionable feedback for improvements]
```

### 5. Validate Acceptance Criteria

For each acceptance criterion from the story:
- Mark as ✅ PASS or ❌ FAIL
- Document evidence of validation
- Note any gaps or concerns

### 6. Determine Test Outcome

Based on test results:

**PASS** - All criteria met:
- Move test file to `docs/qa/uat-tests/completed/`
- Update story QA Results section
- Create/update gate file with PASS status

**FAIL** - Issues found:
- Keep test file in `docs/qa/uat-tests/pending/`
- Document specific failures
- Update story QA Results section with issues
- Create/update gate file with FAIL/CONCERNS status

**BLOCKED** - Cannot complete:
- Move test file to `docs/qa/uat-tests/blocked/`
- Document blocking issue (e.g., MCP not available)
- Request resolution from team

## Output

### 1. Update UAT Test File

Complete all sections:
- Test execution log with timestamps
- Actual results for each test step
- Evidence collected (snapshots, console output)
- Issues and recommendations
- Final status determination

### 2. Update Story File - QA Results Section

Append UAT results to the QA Results section:

```markdown
## QA Results

### UAT Testing - {date}
- **Tester**: Quinn (via MCP Playwright)
- **Method**: Automated UAT with MCP Playwright
- **Result**: {PASS/FAIL/BLOCKED}

#### Tests Executed:
1. {Test name}: {PASS/FAIL} - {Brief note}
2. {Test name}: {PASS/FAIL} - {Brief note}

#### Acceptance Criteria Validation:
- AC1: ✅ Verified through {test}
- AC2: ✅ Verified through {test}
- AC3: ❌ Failed - {reason}

#### Issues Found:
{List any failures or concerns}

#### UAT File:
docs/qa/uat-tests/{status}/{epic}.{story}-uat.md
```

### 3. Create/Update Gate File

If this is the final QA step, create gate decision:
- Use template from `.bmad-core/templates/qa-gate-tmpl.yaml`
- Save to `docs/qa/gates/{epic}.{story}-{slug}.yml`
- Include UAT results in evidence section

## Blocking Conditions

Stop execution if:
- MCP Playwright tools not available
- Development server not running
- Story file missing or incomplete
- Database not accessible
- Critical errors prevent testing

## Best Practices

1. **Test from user perspective** - Focus on user journeys, not implementation
2. **Document everything** - Capture evidence for all decisions
3. **Be specific** - Provide exact error messages and selectors
4. **Follow the checklist** - Use `.bmad-core/checklists/uat-validation-checklist.md`
5. **Communicate clearly** - Explain issues in terms stakeholders understand

## Troubleshooting

### MCP Playwright Issues:
1. Verify Claude Code has MCP configured
2. Check `.mcp.json` includes Playwright server
3. Restart Claude Code if needed
4. Escalate to team if unresolved

### Test Failures:
1. Verify server is running on correct port
2. Check test data exists in database
3. Update selectors if UI has changed
4. Review console for JavaScript errors
5. Try manual testing to isolate issue

## Success Criteria

UAT is successful when:
- All acceptance criteria validated
- User journey completes without errors
- No blocking issues found
- Evidence documented
- Stakeholder value demonstrated