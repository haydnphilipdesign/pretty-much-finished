# Client-Server Code Separation

## Problem

The application was encountering an error during the build process:

```
Uncaught TypeError: Failed to resolve module specifier "fs"
```

This error occurs when there are attempts to use Node.js-specific modules (like `fs`, `path`, `crypto`, etc.) in client-side code that runs in the browser.

## Solution

We separated client-side and server-side code by:

1. Creating a strong type system in `src/types/clientTypes.ts` to ensure proper data structures for API communication
2. Updating client utilities in `src/utils/clientUtils.ts` to use the new type definitions
3. Creating proper API endpoints in `src/pages/api/` that handle server-side logic separately
4. Simplifying the Airtable utility in `src/utils/airtable.ts` to use client-side code only
5. Setting up dedicated API endpoints for PDF generation and email sending

## Architecture

The application now follows a cleaner architecture:

1. **Client-side code** (React components, hooks, utility functions)
   - Runs in the browser
   - Makes API calls to server endpoints
   - Uses only browser-compatible modules

2. **API endpoints** (Next.js API routes)
   - Accept requests from client code
   - Forward requests to server endpoints that handle Node.js operations
   - Return responses to client code

3. **Server-side code** (Node.js scripts, server utilities)
   - Uses Node.js-specific modules like `fs`, `path`, etc.
   - Handles file system operations, PDF generation, email sending, etc.
   - Is never loaded directly by the client

## Type Safety

We added proper TypeScript interfaces in `src/types/clientTypes.ts`:

- `CoverSheetOptions` for PDF generation options
- `CoverSheetResponse` for PDF generation responses
- `EmailOptions` for email sending options
- Various data structure interfaces for property, client, commission data, etc.

These types ensure consistent communication between client and server.

## How to Add New Features

1. For client-side features:
   - Add components in `src/components/`
   - Add hooks in `src/hooks/`
   - Add utility functions in `src/utils/`
   - Make API calls to endpoints in `src/pages/api/`

2. For server-side features:
   - Add API endpoints in `src/pages/api/`
   - Add server-side logic in `/server/` directory
   - Ensure server code is not imported in client code

## Testing

The build now completes successfully without the "Failed to resolve module specifier 'fs'" error, confirming that our changes have fixed the issue. 