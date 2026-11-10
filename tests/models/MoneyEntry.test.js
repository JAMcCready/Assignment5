import { describe, it, expect, beforeEach } from 'vitest';
import { MoneyEntry } from '../../src/models/MoneyEntry.js';

/** Minimal concrete subclass, so MoneyEntry can be tested on its own. */
class TestEntry extends MoneyEntry {}

describe('MoneyEntry', () => {
  it('cannot be instantiated directly', () => {
    expect(() => new MoneyEntry({ amount: 25, date: '2026-11-10' })).toThrow(TypeError);
  });

  it('rounds the amount to 2 decimal places', () => {
    expect(new TestEntry({ amount: 10.5555, date: '2026-11-10' }).amount).toBe(10.56);
    expect(new TestEntry({ amount: 10.554, date: '2026-11-10' }).amount).toBe(10.55);
    expect(new TestEntry({ amount: 0.1 + 0.2, date: '2026-11-10' }).amount).toBe(0.3);
  });

  describe('validate()', () => {
    let entry;

    beforeEach(() => {
      entry = new TestEntry({ amount: 25.5, date: '2026-11-10' });
    });

    it('returns no errors for a valid entry', () => {
      expect(entry.validate()).toEqual([]);
    });

    it('rejects an amount of zero', () => {
      entry.amount = 0;

      expect(entry.validate()).toEqual(['amount must be a number greater than 0']);
    });

    it('rejects a negative amount', () => {
      entry.amount = -5;

      expect(entry.validate()).toEqual(['amount must be a number greater than 0']);
    });

    it('rejects an amount given as text', () => {
      entry.amount = '25';

      expect(entry.validate()).toEqual(['amount must be a number greater than 0']);
    });

    it('rejects an amount that rounds to zero', () => {
      // Built through the constructor, which does the rounding.
      const tiny = new TestEntry({ amount: 0.001, date: '2026-11-10' });

      expect(tiny.validate()).toEqual(['amount must be a number greater than 0']);
    });

    it('rejects a date in the wrong format', () => {
      entry.date = '2026/11/10';

      expect(entry.validate()).toEqual(['date must be a valid date in the format YYYY-MM-DD']);
    });

    it('rejects a date that does not exist', () => {
      entry.date = '2026-02-30';

      expect(entry.validate()).toEqual(['date must be a valid date in the format YYYY-MM-DD']);
    });

    it('accepts a leap day', () => {
      entry.date = '2024-02-29';

      expect(entry.validate()).toEqual([]);
    });

    it('reports every invalid field', () => {
      entry.amount = -1;
      entry.date = 'tomorrow';

      expect(entry.validate()).toHaveLength(2);
    });
  });
});