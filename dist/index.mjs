import { ESLintUtils, AST_NODE_TYPES } from '@typescript-eslint/utils';

const createRule$1 = ESLintUtils.RuleCreator((name) => `moleculer/${name}`);
const PROPERTY_ORDER_DEPS = {
  methods: ["settings", "mixins"],
  actions: ["settings", "mixins", "methods"],
  events: ["settings", "mixins", "methods"],
  created: ["settings", "mixins", "methods"],
  started: ["settings", "mixins", "methods"],
  stopped: ["settings", "mixins", "methods"],
  merged: ["settings", "mixins", "methods"]
};
const rule$1 = createRule$1({
  create(context) {
    return {
      "CallExpression[callee.name=/wrapService|wrapMixin/] > ObjectExpression": function(node) {
        const visited = /* @__PURE__ */ new Map();
        for (let i = node.properties.length - 1; i >= 0; i -= 1) {
          const field = node.properties[i];
          if (field.type === AST_NODE_TYPES.Property && field.key.type === AST_NODE_TYPES.Identifier) {
            visited.set(field.key.name, field);
            for (const dep of PROPERTY_ORDER_DEPS[field.key.name] || []) {
              const depField = visited.get(dep);
              if (depField) {
                context.report({
                  messageId: "bad-order",
                  node: field.key,
                  data: { dependent: field.key.name, upper: dep },
                  *fix(fixer) {
                    const sourceCode = context.sourceCode.getText(
                      field,
                      3,
                      2
                    );
                    yield fixer.removeRange([
                      field.range[0] - 3,
                      field.range[1] + 2
                    ]);
                    yield fixer.insertTextAfterRange(
                      [0, depField.range[1] + 2],
                      sourceCode
                    );
                  }
                });
              }
            }
          }
        }
      }
    };
  },
  name: "service-property-order",
  meta: {
    fixable: "code",
    docs: {
      description: "Enforce that service properties are declared in a certain order."
    },
    messages: {
      "bad-order": "Property `{{dependent}}` should be declared after `{{upper}}`."
    },
    type: "problem",
    schema: []
  },
  defaultOptions: []
});

const createRule = ESLintUtils.RuleCreator((name) => `moleculer/${name}`);
const rule = createRule({
  create(context) {
    return {
      'CallExpression[callee.name="wrapService"] > ObjectExpression': function(node) {
        let queueWorker;
        for (const p of node.properties) {
          if (p.type === AST_NODE_TYPES.Property && p.key.type === AST_NODE_TYPES.Identifier && p.key.name === "mixins" && p.value.type === AST_NODE_TYPES.ArrayExpression) {
            queueWorker = p.value.elements.find(
              (el) => el?.type === AST_NODE_TYPES.CallExpression && el.callee.type === AST_NODE_TYPES.Identifier && el.callee.name === "QueueWorker"
            );
            if (queueWorker) {
              break;
            }
          }
        }
        if (!queueWorker) {
          return;
        }
        for (const p of node.properties) {
          if (p.type === AST_NODE_TYPES.Property && p.key.type === AST_NODE_TYPES.Identifier && p.key.name === "actions" && p.value.type === AST_NODE_TYPES.ObjectExpression) {
            for (const action of p.value.properties) {
              if (action.type === AST_NODE_TYPES.Property && action.value.type === AST_NODE_TYPES.ObjectExpression) {
                const publishedVisibility = action.value.properties.find(
                  (actionP) => actionP.type === AST_NODE_TYPES.Property && actionP.key.type === AST_NODE_TYPES.Identifier && actionP.key.name === "visibility" && actionP.value.type === AST_NODE_TYPES.Literal && actionP.value.value === "published"
                );
                if (publishedVisibility) {
                  context.report({
                    node: queueWorker,
                    messageId: "unallowed-queue-worker"
                  });
                }
              }
            }
          }
        }
      }
    };
  },
  name: "no-published-workers",
  meta: {
    docs: {
      description: "Enforce that QueueWorker is not used on a service that has published actions."
    },
    messages: {
      "unallowed-queue-worker": "QueueWorker should not be used on a service that has published actions."
    },
    type: "problem",
    schema: []
  },
  defaultOptions: []
});

const rules = {
  "service-property-order": rule$1,
  "no-published-workers": rule
};

export { rules };
