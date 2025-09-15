module.exports = {
  // Lint and type check TypeScript/JavaScript files
  '*.{ts,tsx,js,jsx}': [
    'next lint --fix --file',
  ],
  
  // Format other files if prettier is configured
  '*.{json,css,md}': [
    'prettier --write',
  ],
};