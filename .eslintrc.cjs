module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    // 'plugin:react-refresh/recommended', // Remove since react-refresh is not necessary for linting
    'next', // Add Next.js ESLint configuration
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  plugins: ['react', 'jsx-a11y'],
  rules: {
    'react/prop-types': 'off', // Turn off prop-types rule if you're using TypeScript or PropTypes are not being used
    // 'react/react-in-jsx-scope': 'off', // Leave this enabled for Next.js
    'react/jsx-uses-react': 'off', // This rule is deprecated, turn it off
    'react/jsx-uses-vars': 'error', // Emit a warning if variables used in JSX are not properly imported
    'react/display-name': 'off', // Turn off display-name rule, which can be noisy in certain cases
    'react-hooks/exhaustive-deps': 'warn', // Emit a warning if dependencies are not listed in useEffect/useCallback
    'jsx-a11y/anchor-is-valid': 'off', // Turn off anchor-is-valid rule if you're using libraries like Next.js or Gatsby
    // Additional rules can be added here
  },
};
