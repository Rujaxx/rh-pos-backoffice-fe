# 🛠️ Development Workflow - Quick Reference

## 🎯 Overview

This document provides a quick reference for the development workflow tools and processes set up for the RH POS Backoffice Frontend project.

## ✅ What's Set Up

### 🪝 Git Hooks (Husky)

- **Pre-commit**: Runs `lint-staged` and `npm run build`
- **Commit-msg**: Validates commit messages using CommitLint

### 📝 Commit Message Linting

- Uses **Conventional Commits** format
- Custom types: `feat`, `fix`, `ui`, `i18n`, `refactor`, `docs`, `test`, `chore`
- Max header length: 72 characters
- Enforces consistent commit history

### 🧹 Code Quality (lint-staged)

- Runs `next lint --fix` on TypeScript/JavaScript files
- Formats JSON, CSS, and Markdown files with Prettier
- Only processes staged files for faster execution

### 📋 GitHub Templates

- **Pull Request Template**: Comprehensive checklist including i18n testing
- **Bug Report Template**: POS-specific bug reporting
- **Feature Request Template**: Includes technical considerations and i18n impact

### 🌿 Branching Strategy

- **Git Flow** inspired workflow
- Protected `main` and `develop` branches
- Feature branches: `feature/TICKET-ID-description`
- Bug fix branches: `bugfix/TICKET-ID-description`
- Hotfix branches: `hotfix/TICKET-ID-description`

## 🚀 Quick Commands

```bash
# Verify setup
npm run verify-setup

# Development
npm run dev                 # Start dev server
npm run build              # Production build
npm run lint               # Run linting
npm run lint:fix           # Fix linting issues
npm run type-check         # TypeScript check
npm run format             # Format code

# Commits (⭐ RECOMMENDED)
npm run commit              # 🎯 Interactive guided commit creation

# Test commit linting (manual testing)
echo "feat: add new feature" | npx commitlint    # ✅ Valid
echo "invalid message" | npx commitlint          # ❌ Invalid
```

## 🔄 Typical Workflow

### 1. Start New Feature

```bash
git checkout develop
git pull origin develop
git checkout -b feature/POS-123-brand-management
```

### 2. Development

```bash
# Make changes
git add .
# Use interactive commit tool (recommended)
npm run commit

# Pre-commit hooks run automatically:
# - Lints and formats staged files
# - Validates commit message format
# - Runs build check
```

### 3. Push and PR

```bash
git push origin feature/POS-123-brand-management
# Create PR using GitHub template
# Automated checks run on PR
```

## 📊 Commit Message Examples

### ✅ Using npm run commit (Recommended)

```bash
npm run commit  # Follow interactive prompts for:
# ✅ Type selection (feat, fix, ui, i18n, etc.)
# ✅ Scope input (optional)
# ✅ Description input
# ✅ Automatic validation
```

### ✅ Manual Commit Examples (Alternative)

```bash
feat(auth): add login form validation
fix(dashboard): resolve mobile layout issue
ui(brands): improve responsive design
i18n(nav): add Arabic translations for menu
refactor(utils): optimize date formatting function
docs: update installation guide
test(auth): add login form unit tests
chore(deps): update dependencies to latest
```

### ❌ Bad Commit Messages

```bash
fixed bug                    # No type, not descriptive
Update styles               # Wrong case, no type
feat: Added new feature.    # Ends with period
WIP                        # Not descriptive
```

## 🌍 i18n Considerations

Every feature should consider:

- [ ] English and Arabic language support
- [ ] RTL layout compatibility
- [ ] Text expansion in Arabic
- [ ] Cultural considerations
- [ ] Date/currency formatting

## 📋 Pre-PR Checklist

Before creating a Pull Request:

- [ ] Branch is up to date with target branch
- [ ] Commits follow conventional format
- [ ] Code builds successfully
- [ ] Linting passes without errors
- [ ] Feature tested in both English and Arabic
- [ ] Mobile responsiveness verified
- [ ] No TypeScript errors
- [ ] Self-code review completed

## 🔧 Troubleshooting

### Husky Hooks Not Working

```bash
# Reinstall husky
npm run prepare
```

### Commit Message Rejected

- Check format: `type(scope): description`
- Ensure type is from allowed list
- Keep header under 72 characters
- Don't end with period

### Lint-staged Fails

```bash
# Run manually to see errors
npm run lint
npm run build
```

### Pre-commit Hook Fails

- Fix linting issues: `npm run lint:fix`
- Ensure build passes: `npm run build`
- Check commit message format

## 📁 File Structure

```
.github/
├── ISSUE_TEMPLATE/
│   ├── bug_report.md
│   └── feature_request.md
├── pull_request_template.md
└── BRANCHING_STRATEGY.md

.husky/
├── pre-commit              # Runs lint-staged + build
└── commit-msg              # Validates commit messages

scripts/
└── verify-setup.js         # Verify development setup

docs/
└── DEVELOPMENT_WORKFLOW.md # This file

Root files:
├── .lintstagedrc.js        # Lint-staged configuration
├── commitlint.config.js    # CommitLint rules
└── CONTRIBUTING.md         # Contributing guidelines
```

## 🆘 Getting Help

### Resources

- **Branching Strategy**: `.github/BRANCHING_STRATEGY.md`
- **Contributing Guide**: `CONTRIBUTING.md`
- **Conventional Commits**: https://www.conventionalcommits.org/

### Common Issues

- **Hook not found**: Run `npm run prepare`
- **Permission denied**: Check file permissions on hooks
- **Commit rejected**: Verify message format with `npx commitlint`

### Commands to Remember

```bash
npm run verify-setup        # Check if everything is configured
npm run lint:fix            # Fix most linting issues
npm run type-check          # Verify TypeScript
echo "message" | npx commitlint  # Test commit message
```

---

## 🎉 Success!

With this setup, you have:

- ✅ Automatic code quality enforcement
- ✅ Consistent commit message format
- ✅ Structured branching strategy
- ✅ Comprehensive PR and issue templates
- ✅ Next.js optimized tooling
- ✅ i18n and RTL considerations built-in

Happy coding! 🚀
