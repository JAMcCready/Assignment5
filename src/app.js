import path from 'node:path';
import express from 'express';
import { Ledger, ValidationError } from './repositories/Ledger.js';
import { Expense } from './models/Expense.js';
import { expenseRoutes } from './routes/expenses.js';

/**
 * Creates the Express application.
 *
 * @param {object} options
 * @param {string} options.dataDir - Folder that holds the CSV files.
 * @returns {import('express').Express}
 */
export function createApp({ dataDir }) {
  const app = express();
  const expenses = new Ledger(path.join(dataDir, 'expenses.csv'), Expense);

  app.use(express.json());
  app.use(express.static('public'));

  app.use('/api/expenses', expenseRoutes(expenses));

  app.use(errorHandler);

  return app;
}

/**
 * Sends errors as JSON: 400 for invalid input, 500 for anything else.
 */
function errorHandler(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.errors });
  }
  if (err.status === 400) {
    return res.status(400).json({ errors: ['request body must be valid JSON'] });
  }

  console.error(err);
  res.status(500).json({ error: 'Could not read or write data' });
}