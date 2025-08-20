import fs from 'node:fs';
import type { TSESLint } from '@typescript-eslint/utils';
import { rule } from './service-property-order.js';
import { rule as noPublishedWorkers } from './no-published-workers.js';

const pkg = JSON.parse(
  fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'),
);

const namespace = '@treatwell/moleculer';

const plugin: TSESLint.Linter.Plugin = {
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
  rules: {
    'service-property-order': rule,
    'no-published-workers': noPublishedWorkers,
  },
};

plugin.configs = {
  recommended: {
    plugins: {
      // @ts-expect-error ts eslint doesn't support this syntax yet but is
      // the recommended way to define plugins per eslint docs
      [namespace]: plugin,
    },
    rules: {
      [`${namespace}/service-property-order`]: 'error',
      [`${namespace}/no-published-workers`]: 'error',
    },
  },
};

export default plugin;
