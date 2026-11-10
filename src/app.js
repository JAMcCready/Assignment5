import path from 'node:path';
import express from 'express';
import { Ledger, ValidationError } from './repositories/Ledger.js';
import { Expense } from './models/Expense.js';
import { Salary } from './models/Salary.js';
import { SummaryService } from './services/SummaryService.js';
import { expenseRoutes } from './routes/expenses.js';
import { salaryRoutes } from './routes/salaries.js';
import { summaryRoutes } from './routes/summary.js';

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
  const salaries = new Ledger(path.join(dataDir, 'salaries.csv'), Salary);
  const summaryService = new SummaryService(expenses, salaries);

  app.use(express.json());
  app.use(express.static('public'));
  app.use('/vendor/pico', express.static('node_modules/@picocss/pico/css'));

  app.use('/api/expenses', expenseRoutes(expenses));
  app.use('/api/salaries', salaryRoutes(salaries));
  app.use('/api/summary', summaryRoutes(summaryService));

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

/**
 * Sends errors as JSON: 400 for invalid input, 500 for anything else.
 */
// eslint-disable-next-line no-unused-vars
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

/**
 * Handles URLs that match no route: JSON for API requests, the 404 page otherwise.
 */
function notFound(req, res) {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: `${req.method} ${req.path} not found` });
  }
  res.status(404).sendFile('404.html', { root: 'public' });
}