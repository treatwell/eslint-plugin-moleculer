# eslint-plugin-moleculer

[![](https://cdn1.treatwell.net/images/view/v2.i1756348.w200.h50.x4965194E.jpeg)](https://treatwell.com/tech)

[![npm](https://img.shields.io/npm/v/@treatwell/eslint-plugin-moleculer?style=flat-square)](https://www.npmjs.com/package/@treatwell/eslint-plugin-moleculer)

This plugin intends to add eslint rules in your [moleculer](https://github.com/moleculerjs/moleculer) project
when using the [`@treatwell/moleculer-essentials`](https://github.com/treatwell/moleculer-essentials)
and [`@treatwell/moleculer-call-wrapper`](https://github.com/treatwell/moleculer-call-wrapper) packages.

## Installation

Install `eslint-plugin-moleculer` with your package manager:

```bash
  yarn add -D @treatwell/eslint-plugin-moleculer
```

### ESLint Flat config (v9+)

Import the recommended config in your eslint config file (assuming you are using TS eslint):

```ts
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import moleculer from '@treatwell/eslint-plugin-moleculer';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  moleculer.configs.recommended,
);
```

### ESLint legacy config

Enable the plugin in your eslint config and add the rules you want to enforce:

```js
module.exports = {
  // ... rest of the config
  plugins: [
    // ... other plugins
    '@treatwell/eslint-plugin-moleculer',
  ],
  rules: {
    // ... other rules
    '@treatwell/moleculer/service-property-order': 'error',
    '@treatwell/moleculer/no-published-workers': 'error',
  },
};
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
