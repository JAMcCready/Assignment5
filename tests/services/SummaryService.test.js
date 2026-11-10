import { describe, it } from 'vitest';

// TODO: Import expect from 'vitest'.
// TODO: Import SummaryService from '../../src/services/SummaryService.js'.
// TODO: Import Expense from '../../src/models/Expense.js'.
// TODO: Import Salary from '../../src/models/Salary.js'.

describe('SummaryService', () => {
  // TODO: Make a fake ledger for your tests. It only needs a findAll()
  //       method that returns a list of entries. For example:
  //
  //   const expenses = {
  //     findAll() {
  //       return [
  //         new Expense({ description: 'Rent', amount: 1200, category: 'basic', date: '2026-11-01' }),
  //         new Expense({ description: 'Movie', amount: 15, category: 'extra', date: '2026-11-05' }),
  //       ];
  //     },
  //   };
  //
  //   const salaries = {
  //     findAll() {
  //       return [new Salary({ amount: 3000, date: '2026-11-01' })];
  //     },
  //   };
  //
  //   const summary = new SummaryService(expenses, salaries).getSummary();
  //
  //   Here summary.basic is 1200, summary.extra is 15, summary.total is 1215,
  //   and summary.savings is 1785.

  // TODO: Replace each it.todo with an it test. Add any other cases you think of.
  describe('getSummary()', () => {
    it.todo('returns all zeros when there are no expenses or salaries');
    it.todo('adds up all salaries');
    it.todo('adds up basic and extra expenses separately');
    it.todo('calculates the total of all expenses');
    it.todo('calculates savings as total salary minus total expenses');
    it.todo('returns negative savings when expenses are higher than salary');
    it.todo('rounds totals to 2 decimal places');
  });
});