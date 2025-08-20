# UAT Validation Checklist

## Pre-Test Requirements
- [ ] **MCP Playwright Available**: Verify all `mcp__playwright__*` tools accessible
- [ ] **Development Server Running**: `npm run dev` active on localhost:3000
- [ ] **Test Data Prepared**: Database has required test users and data
- [ ] **Story Status**: Marked as "Dev Complete" in story file
- [ ] **Browser Ready**: MCP Playwright browser instance can be created

## User Journey Validation

### Navigation & Access
- [ ] User can navigate to the feature as described in the story
- [ ] All expected UI elements are present and visible
- [ ] Navigation follows logical user flow
- [ ] Breadcrumbs/navigation aids work correctly

### Functionality Testing
- [ ] Primary user action completes successfully
- [ ] All acceptance criteria met from user perspective
- [ ] Feature produces expected outcomes
- [ ] Data changes persist correctly
- [ ] Success messages display appropriately

### Role-Based Access
- [ ] Correct role can access the feature
- [ ] Unauthorized roles are properly restricted
- [ ] Role-specific content displays correctly
- [ ] Permissions enforced at all levels

### Error Handling
- [ ] Invalid inputs show helpful error messages
- [ ] System handles edge cases gracefully
- [ ] Recovery from errors is possible
- [ ] No console errors during normal use

### Performance & UX
- [ ] Page loads within 3 seconds
- [ ] Actions respond immediately (< 500ms)
- [ ] Loading states display during operations
- [ ] Animations/transitions smooth

## MCP Playwright Execution

### Tool Usage
- [ ] `mcp__playwright__browser_navigate` - Navigate to pages
- [ ] `mcp__playwright__browser_snapshot` - Capture accessibility state
- [ ] `mcp__playwright__browser_click` - Interact with elements
- [ ] `mcp__playwright__browser_type` - Enter form data
- [ ] `mcp__playwright__browser_wait_for` - Validate outcomes
- [ ] `mcp__playwright__browser_take_screenshot` - Document evidence

### Evidence Collection
- [ ] Initial state screenshot captured
- [ ] User action screenshots taken
- [ ] Success state documented
- [ ] Error states captured (if applicable)
- [ ] Console output reviewed

## Business Value Validation

### Story Goals
- [ ] "So that" clause achieved
- [ ] User problem solved
- [ ] Business value delivered
- [ ] Measurable improvement possible

### Integration
- [ ] Feature integrates with existing functionality
- [ ] No regression in other features
- [ ] Data flows correctly between components
- [ ] Consistent with application patterns

## Test Documentation

### Results Recording
- [ ] Test execution date recorded
- [ ] All test steps documented
- [ ] Pass/Fail status for each AC
- [ ] Issues logged with details
- [ ] Recommendations provided

### File Management
- [ ] UAT test file created in correct location
- [ ] Evidence screenshots saved
- [ ] Test moved to appropriate folder (completed/blocked)
- [ ] Story file updated with UAT results

## Post-Test Actions

### If PASS
- [ ] Mark story as "Ready for Done"
- [ ] Move UAT test to completed folder
- [ ] Update gate status
- [ ] Notify team of success

### If FAIL
- [ ] Document specific failures
- [ ] Create actionable feedback
- [ ] Return story to development
- [ ] Schedule re-test

### If BLOCKED
- [ ] Document blocking issue
- [ ] Escalate MCP/environment problems
- [ ] Move test to blocked folder
- [ ] Track resolution

## Sign-off Criteria

### Test Complete When
- [ ] All checklist items addressed
- [ ] Evidence documented
- [ ] Results recorded in story
- [ ] Gate decision made
- [ ] Team notified of outcome

## MCP Troubleshooting

### Common Issues
- [ ] If MCP tools not available: Check Claude Code MCP config
- [ ] If browser won't launch: Verify MCP Playwright installed
- [ ] If elements not found: Update selectors/refs
- [ ] If timeouts occur: Increase wait times
- [ ] If navigation fails: Check URL and server status

### Escalation Path
1. Try basic troubleshooting steps
2. Restart Claude Code if needed
3. Check MCP configuration
4. Report persistent issues to team
5. Mark test as BLOCKED if unresolvable

## Quality Standards

### Test Must
- [ ] Use ONLY MCP Playwright (no standalone Playwright)
- [ ] Test from real user perspective
- [ ] Validate actual user value
- [ ] Document all findings
- [ ] Provide actionable feedback

### Test Should
- [ ] Be repeatable
- [ ] Cover happy path first
- [ ] Include edge cases
- [ ] Verify error handling
- [ ] Check performance

### Test Could
- [ ] Include accessibility checks
- [ ] Test multiple browsers
- [ ] Validate mobile responsiveness
- [ ] Check internationalization
- [ ] Measure performance metrics