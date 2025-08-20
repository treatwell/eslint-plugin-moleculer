import { TSESTree, AST_NODE_TYPES } from '@typescript-eslint/utils';
import { createRule } from './utils.js';

const PROPERTY_ORDER_DEPS: Record<string, string[]> = {
  methods: ['settings', 'mixins'],
  actions: ['settings', 'mixins', 'methods'],
  events: ['settings', 'mixins', 'methods'],
  created: ['settings', 'mixins', 'methods'],
  started: ['settings', 'mixins', 'methods'],
  stopped: ['settings', 'mixins', 'methods'],
  merged: ['settings', 'mixins', 'methods'],
};

export const rule = createRule({
  create(context) {
    return {
      'CallExpression[callee.name=/wrapService|wrapMixin/] > ObjectExpression':
        function (node: TSESTree.ObjectExpression) {
          const visited = new Map<string, TSESTree.Property>();

          // Go in reverse to find any dependent properties out of order
          for (let i = node.properties.length - 1; i >= 0; i -= 1) {
            const field = node.properties[i];
            if (
              field.type === AST_NODE_TYPES.Property &&
              field.key.type === AST_NODE_TYPES.Identifier
            ) {
              visited.set(field.key.name, field);

              for (const dep of PROPERTY_ORDER_DEPS[field.key.name] || []) {
                const depField = visited.get(dep);
                if (depField) {
                  context.report({
                    messageId: 'bad-order',
                    node: field.key,
                    data: { dependent: field.key.name, upper: dep },
                    *fix(fixer) {
                      // Get and delete original field
                      const sourceCode = context.sourceCode.getText(
                        field,
                        3,
                        2,
                      );
                      yield fixer.removeRange([
                        field.range[0] - 3,
                        field.range[1] + 2,
                      ]);
                      // Insert field after dependency + newline
                      yield fixer.insertTextAfterRange(
                        [0, depField.range[1] + 2],
                        sourceCode,
                      );
                    },
                  });
                }
              }
            }
          }
        },
    };
  },
  name: 'service-property-order',
  meta: {
    fixable: 'code',
    docs: {
      description:
        'Enforce that service properties are declared in a certain order.',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      'bad-order':
        'Property `{{dependent}}` should be declared after `{{upper}}`.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
});
