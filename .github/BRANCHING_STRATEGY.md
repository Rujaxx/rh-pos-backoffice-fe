# 🌿 Branching Strategy Guidelines

## 📋 Overview

This document outlines the branching strategy for the RH POS Backoffice Frontend project. We follow a **Git Flow** inspired approach with modifications for our Next.js development workflow.

## 🌳 Branch Structure

### Main Branches

#### `main` (Production)

- **Purpose**: Production-ready code
- **Protection**: ✅ Protected, requires PR reviews
- **Deploy**: Automatically deploys to production
- **Merge**: Only from `release/*` or `hotfix/*` branches
- **Naming**: `main`

#### `develop` (Development)

- **Purpose**: Integration branch for features
- **Protection**: ✅ Protected, requires PR reviews
- **Deploy**: Automatically deploys to staging/development environment
- **Merge**: From `feature/*`, `bugfix/*` branches
- **Naming**: `develop`

### Supporting Branches

#### Feature Branches

- **Purpose**: New features and enhancements
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `feature/TICKET-ID-short-description`
- **Examples**:
  - `feature/POS-123-brand-management`
  - `feature/POS-456-arabic-rtl-support`
  - `feature/POS-789-dashboard-analytics`

#### Bugfix Branches

- **Purpose**: Fix bugs in development
- **Branch from**: `develop`
- **Merge to**: `develop`
- **Naming**: `bugfix/TICKET-ID-short-description`
- **Examples**:
  - `bugfix/POS-321-login-form-validation`
  - `bugfix/POS-654-rtl-layout-issues`

#### Hotfix Branches

- **Purpose**: Critical fixes for production
- **Branch from**: `main`
- **Merge to**: `main` AND `develop`
- **Naming**: `hotfix/TICKET-ID-short-description`
- **Examples**:
  - `hotfix/POS-999-critical-login-bug`
  - `hotfix/POS-888-payment-processing-fix`

#### Release Branches

- **Purpose**: Prepare for production release
- **Branch from**: `develop`
- **Merge to**: `main` AND `develop`
- **Naming**: `release/vX.Y.Z`
- **Examples**:
  - `release/v1.0.0`
  - `release/v1.2.3`

## 🔄 Workflow Process

### 1. Feature Development

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create feature branch
git checkout -b feature/POS-123-brand-management

# 3. Work on feature with regular commits
git add .
# Use npm run commit for interactive commit creation (recommended)
npm run commit
# Or use git commit directly with conventional format
# git commit -m "feat(brands): add brand creation form"

# 4. Push branch and create PR
git push origin feature/POS-123-brand-management
```

### 2. Bug Fixes

```bash
# 1. Start from develop
git checkout develop
git pull origin develop

# 2. Create bugfix branch
git checkout -b bugfix/POS-321-login-validation

# 3. Fix the bug
git add .
# Use npm run commit for interactive commit creation (recommended)
npm run commit
# Or use git commit directly
# git commit -m "fix(auth): validate email format in login form"

# 4. Push and create PR
git push origin bugfix/POS-321-login-validation
```

### 3. Release Process

```bash
# 1. Create release branch from develop
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. Bump version and make final adjustments
npm version 1.1.0
# Use npm run commit for interactive commit creation (recommended)
npm run commit
# Or use git commit directly for release commits
# git commit -m "chore(release): bump version to 1.1.0"

# 3. Push release branch
git push origin release/v1.1.0

# 4. Create PR to main
# 5. After merge, tag the release
git tag -a v1.1.0 -m "Release version 1.1.0"
git push origin v1.1.0
```

### 4. Hotfix Process

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/POS-999-critical-bug

# 2. Fix the issue
git add .
# Use npm run commit for interactive commit creation (recommended)
npm run commit
# Or use git commit directly for urgent hotfixes
# git commit -m "fix: resolve critical payment processing bug"

# 3. Push and create PR to main
git push origin hotfix/POS-999-critical-bug

# 4. After merge to main, also merge to develop
```

## 📝 Naming Conventions

### Branch Names

- Use lowercase with hyphens
- Include ticket/issue ID when available
- Keep descriptions short but meaningful
- Use prefixes: `feature/`, `bugfix/`, `hotfix/`, `release/`

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

**💡 Recommended: Use Interactive Commit Tool**

```bash
npm run commit  # Interactive prompts guide you through proper format
```

**Alternative: Manual Commit Format**

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

The `npm run commit` command provides:

- ✅ Guided prompts for commit type, scope, and description
- ✅ Automatic validation of conventional commit format
- ✅ Prevention of invalid commit messages
- ✅ Consistent formatting across the team

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Test updates
- `chore`: Build process, dependencies
- `ui`: UI/UX improvements
- `i18n`: Internationalization updates

**Examples:**

```bash
feat(brands): add brand creation form with validation
fix(auth): resolve login form validation issues
ui(dashboard): improve mobile responsive layout
i18n(common): add Arabic translations for navigation
```

## 🛡️ Branch Protection Rules

### `main` Branch

- ✅ Require pull request reviews (2 reviewers minimum)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Include administrators
- ✅ Restrict pushes to administrators only

### `develop` Branch

- ✅ Require pull request reviews (1 reviewer minimum)
- ✅ Require status checks to pass
- ✅ Require branches to be up to date
- ✅ Allow force pushes for administrators only

## ✅ Status Checks Required

Before merging to protected branches, the following checks must pass:

- 🔍 **ESLint**: Code linting
- 🏗️ **Build**: `npm run build` successful
- 🧪 **Type Check**: TypeScript compilation
- 🎨 **Format Check**: Prettier formatting
- 📱 **Responsive Test**: Mobile/tablet compatibility
- 🌍 **i18n Test**: English and Arabic language support
- ♿ **Accessibility**: Basic accessibility checks

## 🚀 Deployment Strategy

### Environments

| Branch      | Environment | URL                                        | Auto Deploy |
| ----------- | ----------- | ------------------------------------------ | ----------- |
| `main`      | Production  | `https://pos.example.com`                  | ✅          |
| `develop`   | Staging     | `https://staging-pos.example.com`          | ✅          |
| `feature/*` | Preview     | `https://preview-[branch].pos.example.com` | ✅          |

## 📋 Pull Request Guidelines

### Before Creating PR

- [ ] Branch is up to date with target branch
- [ ] All commits follow conventional commit format
- [ ] Code has been self-reviewed
- [ ] Tests pass locally
- [ ] Build succeeds locally
- [ ] Features work in both English and Arabic
- [ ] Mobile responsive design verified

### PR Requirements

- [ ] Clear title and description
- [ ] Link to related issue/ticket
- [ ] Screenshots for UI changes
- [ ] Test instructions provided
- [ ] Breaking changes documented
- [ ] Migration notes (if applicable)

## 🆘 Emergency Procedures

### Critical Production Bug

1. Create hotfix branch from `main`
2. Fix the issue with minimal changes
3. Test thoroughly in staging
4. Create PR to `main` with priority label
5. Get immediate review and approval
6. Merge and deploy immediately
7. Create follow-up PR to merge into `develop`

### Rollback Procedure

1. Identify last known good commit on `main`
2. Create hotfix branch from that commit
3. Deploy the rollback
4. Investigate and fix the issue properly
5. Follow normal hotfix process

## 🔧 Tools and Automation

### Required Tools

- **Husky**: Git hooks for quality gates
- **CommitLint**: Enforce commit message format
- **lint-staged**: Run checks on staged files
- **GitHub Actions**: CI/CD pipeline

### Recommended Extensions

- **Git Graph** (VS Code): Visualize branch structure
- **GitLens** (VS Code): Enhanced Git capabilities
- **Conventional Commits** (VS Code): Commit message helper

## 📚 Best Practices

### Do's ✅

- Keep branches small and focused
- Merge frequently to avoid conflicts
- Use descriptive commit messages
- Test in both languages before merging
- Delete merged branches
- Use draft PRs for work-in-progress

### Don'ts ❌

- Don't commit directly to `main` or `develop`
- Don't merge your own PRs (unless emergency)
- Don't force push to shared branches
- Don't leave stale branches
- Don't merge without proper review
- Don't skip testing RTL layout changes

---

## 📞 Need Help?

- 🐛 **Bug Reports**: Use bug report template
- ✨ **Feature Requests**: Use feature request template
- 💬 **Questions**: Ask in team chat or create discussion
- 📖 **Documentation**: Check project README and wiki

Remember: When in doubt, ask! It's better to clarify the process than to fix mistakes later. 🙌
