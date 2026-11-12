import { Router } from 'express';

/**
 * Creates the routes for /api/salaries.
 * Each salary is { id, date, amount }.
 *
 * @param {import('../repositories/Ledger.js').Ledger} ledger - Ledger that stores salaries.
 * @returns {Router}
 */
export function salaryRoutes(ledger) {
  const router = Router();

  // TODO: Respond with all salaries (200).
  router.get('/', notImplemented);

  // TODO: Respond with the salary with the given id (200), or 404 if not found.
  router.get('/:id', notImplemented);

  // TODO: Build a Salary from the request body, add it to the ledger,
  //       and respond with the saved salary (201).
  router.post('/', notImplemented);

  // TODO: Build a Salary from the request body, update the salary with
  //       the given id, and respond with it (200), or 404 if not found.
  router.put('/:id', notImplemented);

  // TODO: Delete the salary with the given id and respond with 204,
  //       or 404 if not found.
  router.delete('/:id', notImplemented);

  return router;
}

/**
 * Placeholder handler for routes that are not built yet.
 * Remove once every route above is implemented.
 */
function notImplemented(req, res) {
  res.status(501).json({ error: `${req.method} ${req.originalUrl} is not implemented yet` });
}