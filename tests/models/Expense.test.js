import { describe, it, expect, beforeEach } from 'vitest';
import { Expense } from '../../src/models/Expense.js';

describe('Expense', () => {
  let expense;

  beforeEach(() => {
    expense = new Expense({ description: 'Groceries', amount: 42.75, category: 'basic', date: '2026-11-10' });
  });

  describe('validate()', () => {
    it('returns no errors for a valid expense', () => {
      expect(expense.validate()).toEqual([]);
    });

    it('includes the errors from MoneyEntry', () => {
      expense.amount = 0;

      expect(expense.validate()).toEqual(['amount must be a number greater than 0']);
    });

    it('accepts a description of 100 characters', () => {
      expense.description = 'a'.repeat(100);

      expect(expense.validate()).toEqual([]);
    });

    it('rejects an empty description', () => {
      expense.description = '';

      expect(expense.validate()).toEqual(['description is required and must be at most 100 characters']);
    });

    it('rejects a description of only spaces', () => {
      expense.description = '   ';

      expect(expense.validate()).toEqual(['description is required and must be at most 100 characters']);
    });

    it('rejects a description longer than 100 characters', () => {
      expense.description = 'a'.repeat(101);

      expect(expense.validate()).toEqual(['description is required and must be at most 100 characters']);
    });

    it('accepts the extra category', () => {
      expense.category = 'extra';

      expect(expense.validate()).toEqual([]);
    });

    it('rejects an unknown category', () => {
      expense.category = 'luxury';

      expect(expense.validate()).toEqual(['category must be one of: basic, extra']);
    });

    it('reports every invalid field', () => {
      expense.description = '';
      expense.amount = -1;
      expense.category = 'luxury';
      expense.date = 'tomorrow';

      expect(expense.validate()).toHaveLength(4);
    });
  });
});