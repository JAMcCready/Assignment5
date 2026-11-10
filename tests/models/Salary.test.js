import { describe, it } from 'vitest';

// TODO: Import expect and beforeEach from 'vitest'.
// TODO: Import Salary.

describe('Salary', () => {
  // TODO: Create a valid salary in beforeEach, as in Expense.test.js.

  // TODO: Replace each it.todo with an it test. Add any other cases you think of.
  it.todo('stores the amount and pay date');
  it.todo('rounds the amount to 2 decimal places');

  describe('validate()', () => {
    it.todo('returns no errors for a valid salary');
    it.todo('rejects an amount of zero');
    it.todo('rejects a negative amount');
    it.todo('rejects a pay date in the wrong format');
    it.todo('rejects a pay date that does not exist');
  });
});