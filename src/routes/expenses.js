import { Router } from 'express';
import { Expense } from '../models/Expense.js';

/**
 * Creates the routes for /api/expenses.
 *
 * @param {import('../repositories/Ledger.js').Ledger} ledger - Ledger that stores expenses.
 * @returns {Router}
 */
export function expenseRoutes(ledger) {
  const router = Router();

  router.get('/', (req, res) => {
    res.json(ledger.findAll());
  });

  router.get('/:id', (req, res) => {
    const expense = ledger.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  });

  router.post('/', (req, res) => {
    const expense = ledger.add(toExpense(req.body));
    res.status(201).json(expense);
  });

  router.put('/:id', (req, res) => {
    const expense = ledger.update(req.params.id, toExpense(req.body));
    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.json(expense);
  });

  router.delete('/:id', (req, res) => {
    if (!ledger.delete(req.params.id)) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).end();
  });

  return router;
}

/**
 * Builds an Expense from a request body.
 *
 * @param {object} body
 * @returns {Expense}
 */
function toExpense(body = {}) {
  return new Expense({
    description: body.description,
    amount: Number(body.amount),
    category: body.category,
    date: body.date,
  });
}