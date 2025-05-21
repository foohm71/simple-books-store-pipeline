# API Tests for Simple Books Store

This directory contains API tests for the Simple Books Store application using Playwright.

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the tests directory with your API access token:
```bash
API_ACCESS_TOKEN=your_api_token_here
```

You can get your API access token by:
1. Making a POST request to `/api-clients` endpoint
2. Using the returned access token in your `.env` file

## Running Tests

To run all tests:
```bash
npm test
```

To run tests in UI mode:
```bash
npm run test:ui
```

## Test Structure

The tests are organized into two main suites:

### Books API Tests
- Get list of books
- Get a specific book
- Filter books by type

### Orders API Tests
- Get all orders
- Create a new order
- Get a specific order

## Environment Variables

The tests use the following environment variables:

- `API_ACCESS_TOKEN`: Your API access token for authentication

A `.env.example` file is provided as a template. Copy it to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

**Note:** The `.env` file is gitignored to keep sensitive information out of version control. Make sure to keep your API token secure and never commit it to the repository.

## Authentication

The tests handle authentication automatically:
1. Before running order-related tests, a new API client is registered
2. The access token is obtained and used for all authenticated requests
3. No manual token configuration is needed

## Test Reports

After running the tests, you can view the HTML report:

```bash
npx playwright show-report
```

## Troubleshooting

1. If tests fail to connect to the API:
   - Check your internet connection
   - Verify the API is accessible at https://simple-books-api.glitch.me
   - Check if the API is experiencing any downtime

2. If you get authentication errors:
   - The tests automatically handle authentication
   - If you see authentication errors, it might indicate an issue with the API's authentication service

3. If you get TypeScript errors:
   - Run `npm install` to ensure all dependencies are installed
   - Check that `tsconfig.json` is properly configured

## Adding New Tests

To add new tests:

1. Create a new test file in the `tests/api` directory
2. Follow the existing test structure
3. Use the `test` and `expect` functions from `@playwright/test`
4. For authenticated endpoints, use the `authToken` from the `beforeAll` hook

Example test structure:
```typescript
import { test, expect } from '@playwright/test';

test.describe('Your API', () => {
  test('should do something', async ({ request }) => {
    const response = await request.get('/your-endpoint');
    expect(response.ok()).toBeTruthy();
    // Add your assertions here
  });
});
```

## Notes

- The tests interact with the live API, so they may be affected by:
  - API rate limiting
  - Network conditions
  - API availability
  - Changes in the API's behavior
- Each test run creates a new API client, which helps prevent test interference
- The tests are designed to be independent and can be run in any order 