# Repository Guidelines

## Project Structure & Module Organization
This repository is currently minimal and does not yet contain application source, tests, or asset folders. Keep the root clean and add code in clearly named top-level directories as the project grows.

Recommended layout:
- `src/` for application code
- `tests/` for automated tests
- `assets/` for static files such as images or fixtures
- `docs/` for design notes and contributor-facing documentation

## Build, Test, and Development Commands
No build or test toolchain is configured in the current checkout. When adding one, document the commands in this file and in the relevant manifest (`package.json`, `pyproject.toml`, `Makefile`, etc.).

Typical examples once tooling exists:
- `npm install` to install dependencies
- `npm run dev` to start a local development server
- `npm test` to run the test suite
- `npm run lint` to check formatting and style

## Coding Style & Naming Conventions
Use consistent formatting and keep files focused on a single responsibility. Prefer:
- 2 spaces for Markdown, JSON, and YAML indentation
- `camelCase` for variables and functions
- `PascalCase` for classes and component files
- `kebab-case` for folder names and standalone asset files

Add a formatter or linter early and run it before opening a pull request.

## Testing Guidelines
Place tests under `tests/` or beside source files using a clear suffix such as `.test.js`, `.spec.ts`, or equivalent for the chosen language. Cover new features and any bug fix with at least one regression test. If coverage tooling is introduced, record the expected threshold here.

## Commit & Pull Request Guidelines
Git history is not available in this checkout, so use short imperative commit subjects such as `Add login form validation`. Keep commits scoped to one change. Pull requests should include:
- a brief summary of the change
- linked issue or task reference when available
- test evidence
- screenshots for UI changes

## Configuration Notes
Do not commit secrets, local `.env` files, or machine-specific settings. Add new generated files and dependency directories to `.gitignore` as soon as they appear.
