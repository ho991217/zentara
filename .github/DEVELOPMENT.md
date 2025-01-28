# Development Guide

## Release Process

To release a new version of a package, use the following command:

```bash
pnpm release <package-directory> <version>
```

### Parameters

- `package-directory`: The directory name of the package under `packages/`
  - `core` for `@zentara/core`
  - `plugins/suggestions` for `@zentara/plugin-suggestions`
  - etc.
- `version`: Can be one of:
  - `patch` for bug fixes (0.0.x)
  - `minor` for new features (0.x.0)
  - `major` for breaking changes (x.0.0)
  - A specific version number (e.g., "1.0.0")

### Examples

```bash
# Release a patch version for core package
pnpm release core patch

# Release a minor version for suggestions plugin
pnpm release plugins/suggestions minor

# Release a specific version
pnpm release core 1.0.0
```

### What happens when you release?

1. The version in the package's `package.json` is updated
2. A git commit is created with the version change
3. A git tag is created in the format `@zentara/package-name@version`
4. The changes are pushed to GitHub
5. GitHub Actions automatically:
   - Builds the package
   - Publishes it to npm registry
   - Publishes it to GitHub Packages registry
   - Creates a GitHub Release with:
     - Changes since the last release (commits starting with feat:, fix:, docs:, refactor:)
     - List of merged pull requests

### Prerequisites

1. Make sure you have npm access to the `@zentara` organization
2. Ensure you're logged in to npm (`npm login`)
3. Have the necessary GitHub permissions to push tags and packages

### Package Installation

The packages are available from both npm and GitHub Packages registries:

```bash
# From npm registry (default)
npm install @zentara/core
pnpm add @zentara/core

# From GitHub Packages registry
npm install @zentara/core --registry=https://npm.pkg.github.com
pnpm add @zentara/core --registry=https://npm.pkg.github.com
```

### Notes

- Release packages in dependency order (e.g., release `core` before plugins)
- Always test your changes before releasing
- Follow semantic versioning guidelines:
  - MAJOR: Breaking changes
  - MINOR: New features (backwards compatible)
  - PATCH: Bug fixes (backwards compatible)

### Commit Message Format

For better release notes, follow these commit message formats:

- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation changes
- `refactor: description` - Code refactoring
- `test: description` - Adding or updating tests
- `chore: description` - Maintenance tasks

Pull request titles should also follow this format to be included in release notes.
