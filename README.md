# eslint-plugin-moleculer

[![](https://cdn1.treatwell.net/images/view/v2.i1756348.w200.h50.x4965194E.jpeg)](https://treatwell.com/tech)

[![npm](https://img.shields.io/npm/v/@treatwell/eslint-plugin-moleculer?style=flat-square)](https://www.npmjs.com/package/@treatwell/eslint-plugin-moleculer)

This plugin intends to add eslint rules in your [moleculer](https://github.com/moleculerjs/moleculer) project
when using the `@treatwell/moleculer-essentials` and `@treatwell/moleculer-call-wrapper` packages.

## Installation

Install `eslint-plugin-moleculer` with your package manager:

```bash
  yarn add -D eslint-plugin-moleculer
```

Enable the plugin in your eslint config:

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
