# E2E Test Example with MCP Playwright

This file demonstrates how to use MCP Playwright for E2E testing.

## Test Scenario: Basic Navigation and Authentication Flow

```javascript
// This would be executed via MCP Playwright commands:

// 1. Navigate to home page
mcp__playwright__browser_navigate("http://localhost:3000")

// 2. Take screenshot of home page
mcp__playwright__browser_take_screenshot()

// 3. Click on Sign In button
mcp__playwright__browser_click("Sign In button", "text=Sign In")

// 4. Fill in login form
mcp__playwright__browser_type("email input", "input[type=email]", "admin@example.com")
mcp__playwright__browser_type("password input", "input[type=password]", "password")

// 5. Submit form
mcp__playwright__browser_click("Sign In submit", "button[type=submit]")

// 6. Verify redirect to admin dashboard
mcp__playwright__browser_wait_for("text=Admin Dashboard")

// 7. Take screenshot of dashboard
mcp__playwright__browser_take_screenshot()
```

## Key Features Tested:
- Home page rendering
- Navigation to login
- Form filling and submission
- Authentication flow
- Role-based redirects
- Protected route access

## Setup Requirements:
1. Supabase local environment running
2. Next.js dev server running
3. Test users created in database
4. MCP Playwright configured