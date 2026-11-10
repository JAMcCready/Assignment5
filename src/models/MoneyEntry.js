import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';

dayjs.extend(customParseFormat);

export const DATE_FORMAT = 'YYYY-MM-DD';

/**
 * Base class for monetary entries. Holds the id, amount and date
 * shared by expenses and salaries, and validates them.
 *
 * @abstract
 */
export class MoneyEntry {
  /**
   * @param {object} fields
   * @param {string} [fields.id]
   * @param {number} fields.amount - Rounded to 2 decimal places.
   * @param {string} fields.date - YYYY-MM-DD
   * @throws {TypeError} If instantiated directly.
   */
  constructor({ id, amount, date }) {
    if (new.target === MoneyEntry) {
      throw new TypeError('MoneyEntry is abstract and cannot be instantiated directly');
    }
    this.id = id;
    this.amount = roundToCents(amount);
    this.date = date;
  }

  /**
   * Validates the shared fields.
   *
   * @returns {string[]} Validation error messages; empty if valid.
   */
  validate() {
    const errors = [];

    if (!isValidAmount(this.amount)) {
      errors.push('amount must be a number greater than 0');
    }
    if (!isValidDate(this.date)) {
      errors.push('date must be a valid date in the format YYYY-MM-DD');
    }

    return errors;
  }
}

/**
 * Rounds a number to 2 decimal places, half away from zero.
 * Non-numbers are returned unchanged so validate() can report them.
 */
function roundToCents(value) {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return value;
  }
  return Math.round(value * 100) / 100;
}

function isValidAmount(value) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function isValidDate(value) {
  return typeof value === 'string' && dayjs(value, DATE_FORMAT, true).isValid();
}