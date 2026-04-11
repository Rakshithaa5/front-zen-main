# Front Zen

## Testing and Quality Assurance

### Static Code Analysis

This repository uses ESLint and the TypeScript compiler as its static analysis layer.

- `npm run lint` checks the React and TypeScript source for style and correctness issues without running the app.
- The ESLint configuration in [eslint.config.js](eslint.config.js) applies the recommended JavaScript, TypeScript, React Hooks, and React Refresh rules.
- This codebase is not Python-based, so PyLint is not applicable here; ESLint is the equivalent static analysis tool for this project.

### Continuous Integration and Deployment

The CI pipeline is implemented with GitHub Actions and validates the main project quality gates on every push and pull request. The CD pipeline deploys the frontend to GitHub Pages from the `main` branch.

- Install dependencies with `npm ci`.
- Run static analysis with `npm run lint`.
- Execute unit tests with `npm run test`.
- Build the production bundle with `npm run build`.
- The backend is validated separately by installing dependencies from `backend/package-lock.json` and checking that the main server file parses correctly.

The workflow definitions live in [ci.yml](.github/workflows/ci.yml) and [cd.yml](.github/workflows/cd.yml).

### Unit Testing

Unit tests are written with Vitest.

- The test runner is configured in [vitest.config.ts](vitest.config.ts).
- Test setup lives in [src/test/setup.ts](src/test/setup.ts).
- The current test suite is minimal and includes a placeholder spec in [src/test/example.test.ts](src/test/example.test.ts).
- PyUnit is not applicable in this repository because the application is implemented in TypeScript and React rather than Python.

### Agile Testing Quadrants

| Quadrant | Focus | Example tests in this repo |
| --- | --- | --- |
| Automated, Technology-facing | Tooling and code correctness | ESLint checks, Vitest unit tests |
| Automated, Business-facing | User workflows and visible behavior | Component tests for login, cart, and checkout flows |
| Manual, Technology-facing | Environment and integration checks | Manual backend startup and API verification against Supabase |
| Manual, Business-facing | End-user validation | Browse restaurants, add items to cart, place an order, and track status |

## Project Setup

See [backend/SETUP.md](backend/SETUP.md) for backend and Supabase configuration.
