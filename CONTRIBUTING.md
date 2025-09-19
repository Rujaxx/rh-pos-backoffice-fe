# 🤝 Contributing to RH POS Backoffice Frontend

Welcome! Thank you for considering contributing to the RH POS Backoffice Frontend project. This guide will help you understand our development workflow and quality standards.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- VS Code (recommended)

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd rh-pos-backoffice-fe

# Install dependencies
npm install

# Setup git hooks
npm run prepare

# Start development server
npm run dev
```

## 🌿 Branching Strategy

Please read our [Branching Strategy Guidelines](./.github/BRANCHING_STRATEGY.md) for detailed information about our Git workflow.

**Quick Reference:**

- `main` - Production-ready code
- `develop` - Integration branch
- `feature/TICKET-ID-description` - New features
- `bugfix/TICKET-ID-description` - Bug fixes
- `hotfix/TICKET-ID-description` - Critical production fixes

## 📝 Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**

- `feat`: New features
- `fix`: Bug fixes
- `ui`: UI/UX improvements
- `i18n`: Internationalization updates
- `refactor`: Code refactoring
- `docs`: Documentation changes
- `test`: Test updates
- `chore`: Build/tooling changes

**Examples:**

```bash
feat(brands): add brand creation form with validation
fix(auth): resolve login form validation issues
ui(dashboard): improve mobile responsive layout
i18n(nav): add Arabic translations for navigation menu
```

## 🔍 Code Quality

### Pre-commit Hooks

Our Husky setup automatically runs:

- `lint-staged` - Lints and formats staged files
- `npm run build` - Ensures code compiles

### Manual Quality Checks

```bash
# Lint code
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
npm run format:check

# Build check
npm run build
```

## 🌍 Internationalization (i18n)

This project supports English and Arabic languages with RTL layout.

### Requirements for i18n Changes

- [ ] Add translation keys to both `messages/en.json` and `messages/ar.json`
- [ ] Test in both languages using the language switcher
- [ ] Verify RTL layout works correctly in Arabic
- [ ] Ensure proper text direction and spacing

### Testing i18n Changes

1. Switch to Arabic language in the app
2. Verify all new text is translated
3. Check RTL layout alignment
4. Test on mobile devices
5. Switch back to English and verify everything still works

## 🐛 Bug Reports

Use our [Bug Report Template](./.github/ISSUE_TEMPLATE/bug_report.md) when creating bug reports.

**Essential Information:**

- Device/browser information
- Language (English/Arabic)
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/videos

## ✨ Feature Requests

Use our [Feature Request Template](./.github/ISSUE_TEMPLATE/feature_request.md) for new features.

**Include:**

- Clear problem statement
- Proposed solution
- POS-specific context
- i18n considerations
- Mockups/wireframes (if applicable)

## 🔄 Pull Request Process

### Before Creating a PR

- [ ] Branch is up to date with target branch
- [ ] All commits follow conventional commit format
- [ ] Code has been self-reviewed
- [ ] Build succeeds locally (`npm run build`)
- [ ] Linting passes (`npm run lint`)
- [ ] Features work in both English and Arabic
- [ ] Mobile responsive design verified

### PR Checklist

Use our [PR Template](./.github/pull_request_template.md) which includes:

- [ ] Clear description of changes
- [ ] Type of change (bug fix, feature, etc.)
- [ ] Testing completed
- [ ] Screenshots for UI changes
- [ ] i18n testing completed
- [ ] Accessibility checked

### Review Process

1. **Self-review**: Review your own code first
2. **Automated checks**: All CI checks must pass
3. **Peer review**: At least 1 approval required
4. **i18n testing**: Reviewer should test both languages
5. **Mobile testing**: Verify responsive design
6. **Merge**: Squash and merge is preferred

## 🏗️ Development Guidelines

### Code Style

- Follow existing patterns in the codebase
- Use TypeScript for type safety
- Keep components small and focused
- Use meaningful variable and function names
- Add comments for complex logic

### Component Structure

```tsx
// 1. Imports
import React from "react";
import { useTranslation } from "@/hooks/useTranslation";

// 2. Types/Interfaces
interface MyComponentProps {
  // props definition
}

// 3. Component
export function MyComponent({ prop1, prop2 }: MyComponentProps) {
  // 4. Hooks
  const { t } = useTranslation();

  // 5. Logic
  // component logic here

  // 6. Render
  return <div>{/* JSX here */}</div>;
}
```

### RTL Support Guidelines

- Use logical CSS properties when possible (`margin-inline-start` vs `margin-left`)
- Test all UI changes in both LTR and RTL modes
- Use `dir="rtl"` or `dir="ltr"` for specific content
- Consider text expansion in Arabic translations

### File Structure

```
src/
├── app/                 # Next.js app directory
├── components/
│   ├── ui/             # Reusable UI components
│   ├── common/         # Layout components
│   └── [feature]/      # Feature-specific components
├── hooks/              # Custom React hooks
├── lib/               # Utilities and configurations
├── providers/         # Context providers
└── types/            # TypeScript type definitions
```

## 🧪 Testing

### Current Testing Strategy

- **Type checking**: TypeScript compilation
- **Linting**: ESLint with Next.js rules
- **Build testing**: Ensure successful builds
- **Manual testing**: Feature and regression testing

### Testing Checklist

- [ ] Feature works as expected
- [ ] No TypeScript errors
- [ ] No lint errors or warnings
- [ ] Build succeeds
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] English and Arabic languages
- [ ] RTL layout correct
- [ ] No console errors

## 📦 Dependencies

### Adding Dependencies

1. Check if the functionality exists in the codebase
2. Consider bundle size impact
3. Ensure compatibility with Next.js and React 19
4. Update documentation if needed

```bash
# Production dependencies
npm install package-name

# Development dependencies
npm install -D package-name
```

## 🔧 Development Tools

### Recommended VS Code Extensions

- **ESLint**: Code linting
- **Prettier**: Code formatting
- **TypeScript Importer**: Auto imports
- **Tailwind CSS IntelliSense**: CSS class autocomplete
- **Git Graph**: Visualize git branches
- **GitLens**: Enhanced Git integration
- **Conventional Commits**: Commit message helper

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build           # Production build
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run type-check      # TypeScript type checking
npm run format          # Format with Prettier
npm run format:check    # Check Prettier formatting

# Git
npm run prepare         # Setup Husky hooks
```

## 🆘 Getting Help

### Resources

- **Branching Strategy**: [.github/BRANCHING_STRATEGY.md](./.github/BRANCHING_STRATEGY.md)
- **Issue Templates**: `.github/ISSUE_TEMPLATE/`
- **Next.js Docs**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Hook Form**: https://react-hook-form.com/

### Communication

- **Bug Reports**: Create GitHub issue with bug template
- **Feature Requests**: Create GitHub issue with feature template
- **Questions**: Ask in team chat or GitHub Discussions
- **Documentation**: Check README and project wiki

### Code Review

- Be constructive and respectful
- Focus on code, not the person
- Suggest improvements with examples
- Test thoroughly before approving
- Ask questions if something is unclear

## 🎯 Project-Specific Notes

### POS Domain Knowledge

- Understand restaurant operations workflow
- Consider multi-language requirements (EN/AR)
- Think about different user roles (admin, manager, staff)
- Consider mobile/tablet usage in restaurant environments

### Performance Considerations

- Keep bundle size reasonable
- Optimize images and assets
- Consider loading states for slow networks
- Test on various device sizes

---

Thank you for contributing to making RH POS better! 🙌

For questions or clarifications, don't hesitate to reach out to the team.
