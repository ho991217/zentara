# Development Guide

## Release Process

We use [Changesets](https://github.com/changesets/changesets) to manage versions and publish packages.

### Adding a Changeset

When you make changes that need to be released, add a changeset:

```bash
pnpm changeset
```

This will prompt you to:

1. Select the packages you've changed
2. Choose the type of version change (major/minor/patch)
3. Provide a description of the changes

The description you provide will be used in the package's changelog and the release notes.

### Example Changeset Descriptions

```
# For a new feature
Added new `renderSuggestion` prop to customize suggestion items

# For a bug fix
Fixed keyboard navigation in suggestion list

# For documentation
Updated installation guide with npm/pnpm examples

# For breaking changes
Removed deprecated `autoComplete` prop. Use `suggestions` instead.
```

### Release Process

1. Create a PR with your changes and the changeset
2. When the PR is merged to main:
   - If there are changesets, a "Version Packages" PR will be created
   - This PR updates package versions and changelogs
3. Merging the "Version Packages" PR will:
   - Update versions and changelogs
   - Create git tags
   - Publish packages to npm
   - Create GitHub releases

### Prerequisites

1. Make sure you have npm access to the `@zentara` organization
2. Ensure you're logged in to npm (`npm login`)
3. Have the necessary GitHub permissions

### Package Installation

```bash
# Install from npm registry
npm install @zentara/core
# or
pnpm add @zentara/core
```

### Notes

- Always include a changeset when making changes that should be released
- Follow semantic versioning guidelines:
  - MAJOR: Breaking changes
  - MINOR: New features (backwards compatible)
  - PATCH: Bug fixes (backwards compatible)
- Test your changes before creating a changeset
- Write clear and descriptive changeset messages

### Commit Message Format

For better organization, follow these commit message formats:

- `feat: description` - New feature
- `fix: description` - Bug fix
- `docs: description` - Documentation changes
- `refactor: description` - Code refactoring
- `test: description` - Adding or updating tests
- `chore: description` - Maintenance tasks

Pull request titles should also follow this format.
