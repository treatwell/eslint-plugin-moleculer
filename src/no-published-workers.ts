import { AST_NODE_TYPES, TSESTree } from '@typescript-eslint/utils';
import { createRule } from './utils.js';

export const rule = createRule({
  create(context) {
    return {
      'CallExpression[callee.name="wrapService"] > ObjectExpression': function (
        node: TSESTree.ObjectExpression,
      ) {
        let queueWorker: TSESTree.CallExpression | undefined;

        for (const p of node.properties) {
          if (
            p.type === AST_NODE_TYPES.Property &&
            p.key.type === AST_NODE_TYPES.Identifier &&
            p.key.name === 'mixins' &&
            p.value.type === AST_NODE_TYPES.ArrayExpression
          ) {
            queueWorker = p.value.elements.find(
              el =>
                el?.type === AST_NODE_TYPES.CallExpression &&
                el.callee.type === AST_NODE_TYPES.Identifier &&
                el.callee.name === 'QueueWorker',
            ) as TSESTree.CallExpression | undefined;
            if (queueWorker) {
              break;
            }
          }
        }
        if (!queueWorker) {
          return;
        }

        for (const p of node.properties) {
          if (
            p.type === AST_NODE_TYPES.Property &&
            p.key.type === AST_NODE_TYPES.Identifier &&
            p.key.name === 'actions' &&
            p.value.type === AST_NODE_TYPES.ObjectExpression
          ) {
            for (const action of p.value.properties) {
              if (
                action.type === AST_NODE_TYPES.Property &&
                action.value.type === AST_NODE_TYPES.ObjectExpression
              ) {
                const publishedVisibility = action.value.properties.find(
                  actionP =>
                    actionP.type === AST_NODE_TYPES.Property &&
                    actionP.key.type === AST_NODE_TYPES.Identifier &&
                    actionP.key.name === 'visibility' &&
                    actionP.value.type === AST_NODE_TYPES.Literal &&
                    actionP.value.value === 'published',
                );

                if (publishedVisibility) {
                  context.report({
                    node: queueWorker,
                    messageId: 'unallowed-queue-worker',
                  });
                }
              }
            }
          }
        }
      },
    };
  },
  name: 'no-published-workers',
  meta: {
    docs: {
      description:
        'Enforce that QueueWorker is not used on a service that has published actions.',
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      'unallowed-queue-worker':
        'QueueWorker should not be used on a service that has published actions.',
    },
    type: 'problem',
    schema: [],
  },
  defaultOptions: [],
});
