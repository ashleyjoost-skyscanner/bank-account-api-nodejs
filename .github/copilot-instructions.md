# Copilot Instructions for Bank Account Solution

## Project Overview

This is a monorepo containing a **Bank Account** application with:
- **bank-account-api**: NestJS REST API backend (TypeScript)
- **bank-account-ui**: React frontend built with Vite (TypeScript)

## Tech Stack

### Backend (bank-account-api)
- **Framework**: NestJS 11
- **Language**: TypeScript
- **Testing**: Jest (unit tests, e2e tests)
- **Linting**: ESLint with Prettier

### Frontend (bank-account-ui)
- **Framework**: React 19 with Vite
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Testing**: Mocha + Chai + Selenium WebDriver

## Code Style & Conventions

### TypeScript
- Use strict TypeScript typing; avoid `any` when possible
- Use interfaces for data models and DTOs
- Prefer `const` over `let`; avoid `var`

### NestJS Backend
- Follow NestJS module structure: controllers, services, models
- Use dependency injection via constructors
- Apply decorators for routing (`@Controller`, `@Get`, `@Post`, `@Put`, `@Delete`)
- Throw NestJS exceptions (`NotFoundException`, `BadRequestException`) for error handling
- Use `@Injectable()` decorator for services
- API routes use PascalCase (e.g., `/api/BankAccount`)

### React Frontend
- Use functional components with React hooks (`useState`, `useEffect`)
- Keep components small and focused
- Place API calls in dedicated files under `src/api/`
- Use CSS modules or separate CSS files in `src/styles/`
- Handle loading and error states in components

## Project Structure

```
bank-account-api/
├── src/
│   ├── main.ts              # Application entry point
│   ├── app.module.ts        # Root module
│   └── bank-account/        # Feature module
│       ├── bank-account.controller.ts
│       ├── bank-account.service.ts
│       └── bank-account.model.ts
└── test/                    # Unit and e2e tests

bank-account-ui/
├── src/
│   ├── main.tsx             # React entry point
│   ├── App.tsx              # Root component
│   ├── api/                 # API client functions
│   ├── components/          # Reusable components
│   ├── pages/               # Page components
│   └── styles/              # CSS files
└── test/                    # UI tests
```

## Testing Guidelines

### Backend Tests
- Place unit tests in `bank-account-api/test/`
- Name test files with `.spec.ts` suffix
- Use `@nestjs/testing` for creating test modules
- Mock dependencies when testing controllers/services
- E2E tests use `jest-e2e.json` configuration

### Frontend Tests
- Place UI tests in `bank-account-ui/test/`
- Use Mocha + Chai for assertions
- Use Selenium WebDriver for browser automation

## Running the Project

### API
```bash
cd bank-account-api
npm install
npm run start        # Production
npm run start:dev    # Development with hot reload
```

### UI
```bash
cd bank-account-ui
npm install
npm run dev          # Development server at http://localhost:5173
```

### Tests
```bash
# Backend
cd bank-account-api
npm run test         # Unit tests
npm run test:e2e     # E2E tests
npm run test:all     # All tests

# Frontend
cd bank-account-ui
npm run test:ui      # UI tests
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/BankAccount` | Get all accounts |
| GET | `/api/BankAccount/:id` | Get account by ID |
| POST | `/api/BankAccount` | Create new account |
| PUT | `/api/BankAccount/:id` | Update account |
| DELETE | `/api/BankAccount/:id` | Delete account |

## Best Practices

1. **Error Handling**: Always handle errors gracefully in both API and UI
2. **Validation**: Validate input data on the API side using NestJS features
3. **Consistency**: Follow existing naming conventions and code patterns
4. **Testing**: Write tests for new features; maintain test coverage
5. **Type Safety**: Leverage TypeScript for compile-time checks
6. **Separation of Concerns**: Keep business logic in services, not controllers

## Maintaining This Document

> **Important**: This file must be kept up to date as the project structure changes.

When making changes to the codebase, update this document if you:
- Add, rename, or remove files/directories
- Introduce new dependencies or frameworks
- Add new API endpoints
- Change testing patterns or conventions
- Modify build or run commands

Keeping these instructions current ensures GitHub Copilot generates accurate, contextually appropriate code suggestions.

