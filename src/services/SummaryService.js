/**
 * Calculates totals across all expenses and salaries.
 */
export class SummaryService {
  /**
   * @param {import('../repositories/Ledger.js').Ledger} expenses - Ledger of expenses.
   * @param {import('../repositories/Ledger.js').Ledger} salaries - Ledger of salaries.
   */
  constructor(expenses, salaries) {
    this.expenses = expenses;
    this.salaries = salaries;
  }

  /**
   * Returns the summary totals, each rounded to 2 decimal places.
   *
   * @returns {{ salary: number, basic: number, extra: number, total: number, savings: number }}
   */
  getSummary() {
    // TODO: Add up the amounts of all salaries.
    // TODO: Add up the expense amounts by category (basic and extra),
    //       and the overall total of all expenses.
    // TODO: Calculate savings as total salary minus total expenses.
    // TODO: Round every total to 2 decimal places.
    return { salary: 0, basic: 0, extra: 0, total: 0, savings: 0 };
  }
}