import fs from 'node:fs';
import type { TSESLint } from '@typescript-eslint/utils';
import { rule as servicePropertyOrder } from './service-property-order.js';
import { rule as noPublishedWorkers } from './no-published-workers.js';

const pkg = JSON.parse(
  fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'),
);

const namespace = '@treatwell/moleculer';

const meta = {
  name: pkg.name,
  version: pkg.version,
  namespace,
};

const rules = {
  'service-property-order': servicePropertyOrder,
  'no-published-workers': noPublishedWorkers,
};

const recommended: TSESLint.FlatConfig.Config = {
  plugins: { [namespace]: { meta, rules } },
  rules: {
    [`${namespace}/service-property-order`]: 'error',
    [`${namespace}/no-published-workers`]: 'error',
  },
};

const plugin = {
  meta,
  rules,
  configs: { recommended },
};

export default plugin;
