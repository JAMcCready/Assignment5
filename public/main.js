/**
 * Expense Tracker frontend: tab switching, expense and salary forms,
 * the monthly summary, and the error dialog.
 */

// ---------- API ----------

/**
 * Error returned by the API, with the HTTP status (0 if the server was unreachable).
 */
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/**
 * Sends a request to the API and returns the parsed JSON response.
 *
 * @param {string} method
 * @param {string} url
 * @param {object} [body]
 * @returns {Promise<any>} The response body, or null for 204 No Content.
 * @throws {ApiError} If the request fails or the response is not 2xx.
 */
async function request(method, url, body) {
  const options = { method };
  if (body) {
    options.headers = { 'Content-Type': 'application/json' };
    options.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError('Could not reach the server.', 0);
  }

  if (response.status === 204) {
    return null;
  }

  const isJson = response.headers.get('Content-Type')?.includes('application/json');
  const data = isJson ? await response.json() : null;

  if (!response.ok) {
    const message = data?.errors?.join('\n') ?? data?.error ?? `Request failed (${response.status}).`;
    throw new ApiError(message, response.status);
  }
  return data;
}

// ---------- Error dialog ----------

const errorDialog = document.getElementById('error-dialog');
const retryButton = document.getElementById('retry-button');
let retryAction = null;

/**
 * Shows the error dialog. The Retry button is shown only when onRetry is given.
 *
 * @param {string} message
 * @param {Function} [onRetry]
 */
function showError(message, onRetry) {
  document.getElementById('error-message').textContent = message;
  retryAction = onRetry ?? null;
  retryButton.hidden = !onRetry;
  errorDialog.showModal();
}

retryButton.addEventListener('click', () => {
  errorDialog.close();
  retryAction?.();
});

document.getElementById('close-button').addEventListener('click', () => errorDialog.close());

/**
 * Runs an API action and shows the error dialog if it fails.
 * Invalid input (400) offers no retry; not found (404) retries by reloading;
 * any other error retries the same action.
 *
 * @param {Function} action - Async function that calls the API.
 * @param {Function} [reload] - Reloads the current list after a 404.
 */
async function attempt(action, reload) {
  try {
    await action();
  } catch (err) {
    if (err.status === 400) {
      showError(err.message);
    } else if (err.status === 404 && reload) {
      showError(err.message, reload);
    } else {
      showError(err.message, () => attempt(action, reload));
    }
  }
}

// ---------- Helpers ----------

function formatMoney(amount) {
  return amount === null || amount === undefined ? 'Not available' : amount.toFixed(2);
}

function cell(text, className) {
  const td = document.createElement('td');
  td.textContent = text;
  if (className) {
    td.className = className;
  }
  return td;
}

function actionButtons(onEdit, onDelete) {
  const td = document.createElement('td');
  td.className = 'actions';

  const edit = document.createElement('button');
  edit.className = 'secondary';
  edit.textContent = 'Edit';
  edit.addEventListener('click', onEdit);

  const remove = document.createElement('button');
  remove.className = 'danger';
  remove.textContent = 'Delete';
  remove.addEventListener('click', onDelete);

  td.append(edit, remove);
  return td;
}

/**
 * Wires up an add/edit form for one resource.
 * In edit mode the submit button reads "Save" and a Cancel button is shown.
 *
 * @param {HTMLFormElement} form
 * @param {object} handlers
 * @param {Function} handlers.toBody - Converts the form into a request body.
 * @param {Function} handlers.save - Async function (body, editingId) that calls the API.
 */
function setUpForm(form, { toBody, save }) {
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = form.querySelector('.cancel');
  let editingId = null;

  function reset() {
    editingId = null;
    form.reset();
    submitButton.textContent = 'Add';
    cancelButton.hidden = true;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    attempt(async () => {
      await save(toBody(form), editingId);
      reset();
    });
  });

  cancelButton.addEventListener('click', reset);

  return {
    edit(id, values) {
      editingId = id;
      for (const [name, value] of Object.entries(values)) {
        if (form.elements[name]) {
          form.elements[name].value = value;
        }
      }
      submitButton.textContent = 'Save';
      cancelButton.hidden = false;
    },
  };
}

// ---------- Expenses ----------

const expenseForm = setUpForm(document.getElementById('expense-form'), {
  toBody: (form) => ({
    description: form.elements.description.value,
    amount: Number(form.elements.amount.value),
    category: form.elements.category.value,
    date: form.elements.date.value,
  }),
  save: async (body, id) => {
    if (id) {
      await request('PUT', `/api/expenses/${id}`, body);
    } else {
      await request('POST', '/api/expenses', body);
    }
    await loadExpenses();
  },
});

async function loadExpenses() {
  const expenses = await request('GET', '/api/expenses');
  const rows = document.getElementById('expense-rows');
  rows.replaceChildren();

  for (const expense of expenses) {
    const row = document.createElement('tr');
    row.append(
      cell(expense.date),
      cell(expense.description),
      cell(expense.category === 'basic' ? 'Basic need' : 'Extra'),
      cell(formatMoney(expense.amount), 'number'),
      actionButtons(
        () => expenseForm.edit(expense.id, expense),
        () => attempt(async () => {
          await request('DELETE', `/api/expenses/${expense.id}`);
          await loadExpenses();
        }, refreshExpenses),
      ),
    );
    rows.append(row);
  }

  document.getElementById('expense-empty').hidden = expenses.length > 0;
}

function refreshExpenses() {
  attempt(loadExpenses);
}

// ---------- Salary ----------

const salaryForm = setUpForm(document.getElementById('salary-form'), {
  toBody: (form) => ({
    date: form.elements.date.value,
    amount: Number(form.elements.amount.value),
  }),
  save: async (body, id) => {
    if (id) {
      await request('PUT', `/api/salaries/${id}`, body);
    } else {
      await request('POST', '/api/salaries', body);
    }
    await loadSalaries();
  },
});

async function loadSalaries() {
  const salaries = await request('GET', '/api/salaries');
  const rows = document.getElementById('salary-rows');
  rows.replaceChildren();

  for (const salary of salaries) {
    const row = document.createElement('tr');
    row.append(
      cell(salary.date),
      cell(formatMoney(salary.amount), 'number'),
      actionButtons(
        () => salaryForm.edit(salary.id, salary),
        () => attempt(async () => {
          await request('DELETE', `/api/salaries/${salary.id}`);
          await loadSalaries();
        }, refreshSalaries),
      ),
    );
    rows.append(row);
  }

  document.getElementById('salary-empty').hidden = salaries.length > 0;
}

function refreshSalaries() {
  attempt(loadSalaries);
}

// ---------- Summary ----------

document.getElementById('summary-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const month = event.target.elements.month.value;
  attempt(() => loadSummary(month));
});

async function loadSummary(month) {
  const summary = await request('GET', `/api/summary?month=${encodeURIComponent(month)}`);
  const result = document.getElementById('summary-result');

  for (const field of ['salary', 'basic', 'extra', 'total', 'savings']) {
    result.querySelector(`[data-field="${field}"]`).textContent = formatMoney(summary[field]);
  }
  result.hidden = false;
}

// ---------- Tabs ----------

const loaders = {
  expenses: refreshExpenses,
  salary: refreshSalaries,
  summary: () => {},
};

for (const tab of document.querySelectorAll('.tab')) {
  tab.addEventListener('click', () => {
    for (const other of document.querySelectorAll('.tab')) {
      const selected = other === tab;
      other.setAttribute('aria-selected', String(selected));
      document.getElementById(other.dataset.tab).hidden = !selected;
    }
    loaders[tab.dataset.tab]();
  });
}

refreshExpenses();