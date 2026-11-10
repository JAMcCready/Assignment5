import { MoneyEntry } from './MoneyEntry.js';
import { CATEGORIES } from './Category.js';

export const MAX_DESCRIPTION_LENGTH = 100;

/**
 * An expense with a description and category, in addition to the
 * fields inherited from MoneyEntry.
 */
export class Expense extends MoneyEntry {
  /**
   * @param {object} fields
   * @param {string} [fields.id]
   * @param {string} fields.description
   * @param {number} fields.amount
   * @param {string} fields.category - One of CATEGORIES.
   * @param {string} fields.date - YYYY-MM-DD
   */
  constructor({ id, description, amount, category, date }) {
    super({ id, amount, date });
    this.description = description;
    this.category = category;
  }

  /**
   * Validates the inherited fields, description and category.
   *
   * @returns {string[]} Validation error messages; empty if valid.
   */
  validate() {
    const errors = super.validate();

    if (
      typeof this.description !== 'string' ||
      this.description.trim().length === 0 ||
      this.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      errors.push(`description is required and must be at most ${MAX_DESCRIPTION_LENGTH} characters`);
    }
    if (!CATEGORIES.includes(this.category)) {
      errors.push(`category must be one of: ${CATEGORIES.join(', ')}`);
    }

    return errors;
  }
}