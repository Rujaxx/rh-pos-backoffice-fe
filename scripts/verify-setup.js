#!/usr/bin/env node

/**
 * Setup Verification Script
 * Verifies that all development workflow tools are properly configured
 */

import { fs } from "fs";

console.log("🔍 Verifying RH POS Development Setup...\n");

const checks = [
  {
    name: "📁 Husky directory",
    check: () => fs.existsSync(".husky"),
    fix: "Run: npx husky init",
  },
  {
    name: "🪝 Pre-commit hook",
    check: () => fs.existsSync(".husky/pre-commit"),
    fix: "Pre-commit hook should be created automatically",
  },
  {
    name: "💬 Commit-msg hook",
    check: () => fs.existsSync(".husky/commit-msg"),
    fix: "Commit-msg hook should be created automatically",
  },
  {
    name: "📝 CommitLint config",
    check: () => fs.existsSync("commitlint.config.js"),
    fix: "Create commitlint.config.js file",
  },
  {
    name: "🎭 Lint-staged config",
    check: () => fs.existsSync(".lintstagedrc.js"),
    fix: "Create .lintstagedrc.js file",
  },
  {
    name: "📋 PR Template",
    check: () => fs.existsSync(".github/pull_request_template.md"),
    fix: "Create .github/pull_request_template.md",
  },
  {
    name: "🐛 Bug Report Template",
    check: () => fs.existsSync(".github/ISSUE_TEMPLATE/bug_report.md"),
    fix: "Create .github/ISSUE_TEMPLATE/bug_report.md",
  },
  {
    name: "✨ Feature Request Template",
    check: () => fs.existsSync(".github/ISSUE_TEMPLATE/feature_request.md"),
    fix: "Create .github/ISSUE_TEMPLATE/feature_request.md",
  },
  {
    name: "🌿 Branching Strategy Guide",
    check: () => fs.existsSync(".github/BRANCHING_STRATEGY.md"),
    fix: "Create .github/BRANCHING_STRATEGY.md",
  },
  {
    name: "🤝 Contributing Guide",
    check: () => fs.existsSync("CONTRIBUTING.md"),
    fix: "Create CONTRIBUTING.md file",
  },
];

let allGood = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  const status = passed ? "✅" : "❌";
  console.log(`${status} ${name}`);

  if (!passed) {
    console.log(`   💡 Fix: ${fix}`);
    allGood = false;
  }
});

console.log("\n" + "=".repeat(50));

if (allGood) {
  console.log("🎉 All checks passed! Your development environment is ready.");
  console.log("\n📚 Next steps:");
  console.log(
    "   1. Read the branching strategy: .github/BRANCHING_STRATEGY.md",
  );
  console.log("   2. Check contributing guidelines: CONTRIBUTING.md");
  console.log("   3. Start developing with: npm run dev");
  console.log(
    '\n💡 Test commit linting with: echo "test commit" | npx commitlint',
  );
} else {
  console.log("❌ Some checks failed. Please fix the issues above.");
  process.exit(1);
}

console.log("\n🚀 Happy coding!");
