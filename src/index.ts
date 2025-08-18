import { rule } from './service-property-order';
import { rule as noPublishedWorkers } from './no-published-workers';

export const rules = {
  'service-property-order': rule,
  'no-published-workers': noPublishedWorkers,
};
