# Linting and Testing Setup

## Linting (ESLint + Prettier)
- Install: `npm install --save-dev eslint prettier eslint-plugin-react eslint-config-prettier`
- Add `.eslintrc.json`:
```
{
  "extends": ["eslint:recommended", "plugin:react/recommended", "prettier"],
  "plugins": ["react"],
  "env": { "browser": true, "es2021": true },
  "settings": { "react": { "version": "detect" } },
  "rules": {
    "react/prop-types": "off"
  }
}
```
- Add `.prettierrc`:
```
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 100
}
```
- Add scripts to `package.json`:
```
"lint": "eslint . --ext .js,.jsx",
"format": "prettier --write ."
```

## Testing (Vitest or Jest)
- Install: `npm install --save-dev vitest @testing-library/react @testing-library/jest-dom`
- Add `vitest.config.js`:
```
import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true
  }
});
```
- Add test script to `package.json`:
```
"test": "vitest"
```

## Usage
- Run `npm run lint` to check code style.
- Run `npm run format` to auto-format code.
- Run `npm run test` to run tests.

---

All code must pass linting and tests before merging or deploying.