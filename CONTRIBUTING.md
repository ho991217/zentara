# Contributing to Zentara

[English](CONTRIBUTING.md) | [한국어](CONTRIBUTING.ko.md)

Thank you for considering contributing to Zentara! This document provides guidelines for the contribution process.

## Development Environment Setup

1. Fork and clone the repository:

```bash
git clone https://github.com/[your-username]/zentara.git
cd zentara
```

2. Install pnpm (if not already installed):

```bash
npm install -g pnpm
```

3. Install dependencies:

```bash
pnpm install
```

4. Run the development server:

```bash
pnpm dev
```

## Branch Strategy

- `main`: Stable release version
- `develop`: Integration branch for features in development
- `feature/*`: New feature development
- `fix/*`: Bug fixes
- `docs/*`: Documentation changes

## Pull Request Process

1. Create a new branch:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-fix-name
```

2. Commit your changes:

```bash
git add .
git commit -m "feat: add new feature"
# or
git commit -m "fix: resolve issue"
```

3. Push to your fork:

```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub.

## Commit Message Convention

- `feat`: Add new feature
- `fix`: Fix a bug
- `docs`: Documentation changes
- `style`: Code formatting, missing semicolons, etc.
- `refactor`: Code refactoring
- `test`: Test code
- `chore`: Build process or auxiliary tool changes

Examples:

```
feat: add emoji search functionality
fix: resolve keyboard navigation issue
docs: update plugin usage examples
```

## Code Style

- We use [Biome](https://biomejs.dev/) to maintain code style.
- Run these commands before submitting your PR:

```bash
pnpm lint
pnpm format
```

## Testing

- Write tests for new features or bug fixes.
- Ensure all tests pass before submitting your PR.

## Documentation

- Update documentation when adding new features.
- Write clear and necessary code comments only.
- Keep TypeScript type definitions up to date.

## License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## Questions or Issues?

- Create an issue for questions or bug reports.
- Use Discussions for proposing ideas or general discussions.

Thank you again for contributing! 🙏
