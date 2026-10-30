import react from 'eslint-plugin-react';
export default [{ files: ['src/**/*.{js,jsx}'], plugins: { react }, languageOptions: { ecmaVersion: 2023, sourceType: 'module', parserOptions: { ecmaFeatures: { jsx: true } }, globals: { localStorage: 'readonly', fetch: 'readonly', document: 'readonly' } }, rules: { 'react/jsx-uses-vars': 'error', 'react/jsx-uses-react': 'error' } }];
