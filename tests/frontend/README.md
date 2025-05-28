# Frontend Tests

This directory contains the frontend tests for the Books Store application. The tests are written using Playwright and are organized into two categories:

- `mocked-tests/`: Tests that use mocked API responses
- `preprod/`: Tests that run against the preprod environment

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Playwright

## Setup

1. Install dependencies:
```bash
npm install
```

2. Install Playwright browsers:
```bash
npx playwright install
```

3. Set up environment variables:
   - Create a `.env.preprod` file in the `frontend` directory with the following variables:
     ```
     API_ACCESS_TOKEN=your_access_token
     ```

## Running Tests

### Run All Tests
```bash
npx playwright test
```

### Run Preprod Tests
```bash
npx playwright test tests/frontend/preprod/books-store.spec.ts
```

### Run Mocked Tests
```bash
npx playwright test tests/frontend/mocked-tests/books-store.spec.ts
```

### Run Tests in UI Mode
```bash
npx playwright test --ui
```

### Run Tests in Debug Mode
```bash
npx playwright test --debug
```

## Test Structure

The tests are organized to cover the main functionality of the Books Store:

1. Book Listing
   - Displaying books
   - Filtering by type (fiction/non-fiction)

2. Book Details
   - Viewing book information
   - Ordering books

3. Orders
   - Creating orders
   - Viewing orders
   - Deleting orders

## Writing Tests

When writing new tests:
1. Use data-testid attributes to select elements
2. Follow the existing test structure
3. Add appropriate comments for test steps
4. Handle loading states and navigation
5. Clean up any test data after the test

## Best Practices

1. Use data-testid attributes for element selection
2. Handle loading states explicitly
3. Clean up test data
4. Use meaningful test descriptions
5. Keep tests independent
6. Use appropriate assertions
7. Handle dialogs and popups 