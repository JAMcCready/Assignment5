/**
 * Expense Tracker frontend: lists expenses and salaries, handles the
 * add/edit forms, shows the summary and reports errors.
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
  const data = await response.json();
  if (!response.ok) {
    throw new ApiError(data.error, response.status);
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
  if (!errorDialog.open) {
    errorDialog.showModal();
  }
}

retryButton.addEventListener('click', () => {
  errorDialog.close();
  retryAction?.();
});

document.getElementById('close-button').addEventListener('click', () => errorDialog.close());

/**
 * Runs an API action and shows the error dialog if it fails.
 * Invalid input (400) offers no retry; not found (404) retries by reloading
 * the page data; any other error retries the same action.
 *
 * @param {Function} action - Async function that calls the API.
 * @returns {Promise<boolean>} True if the action succeeded.
 */
async function attempt(action) {
  try {
    await action();
    return true;
  } catch (err) {
    if (err.status === 400) {
      showError(err.message);
    } else if (err.status === 404) {
      showError(err.message, loadAll);
    } else {
      showError(err.message, () => attempt(action));
    }
    return false;
  }
}

// ---------- Helpers ----------

function formatMoney(amount) {
  return amount === null || amount === undefined ? 'Not available' : amount.toFixed(2);
}

/**
 * Formats a YYYY-MM-DD date as a month and year, e.g. "Nov 2026".
 */
function formatMonth(date) {
  return new Date(`${date}T00:00`).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

function todayString() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${today.getFullYear()}-${month}-${day}`;
}

function cell(content, className) {
  const td = document.createElement('td');
  td.append(content);
  if (className) {
    td.className = className;
  }
  return td;
}

function badge(category) {
  const span = document.createElement('span');
  span.className = `badge ${category}`;
  span.textContent = category === 'basic' ? 'Basic need' : 'Extra';
  return span;
}

function actionButtons(onEdit, onDelete) {
  const td = document.createElement('td');
  td.className = 'actions';

  const edit = document.createElement('button');
  edit.className = 'secondary outline';
  edit.textContent = 'Edit';
  edit.addEventListener('click', onEdit);

  const remove = document.createElement('button');
  remove.className = 'contrast outline';
  remove.textContent = 'Delete';
  remove.addEventListener('click', onDelete);

  td.append(edit, remove);
  return td;
}

/**
 * Wires up an inline add/edit form for one resource.
 * In edit mode the submit button reads "Save" and a Cancel button is shown.
 *
 * @param {object} config
 * @param {HTMLFormElement} config.form
 * @param {string} config.noun - Name used in the submit button, e.g. "expense".
 * @param {Function} config.toBody - Converts the form into a request body.
 * @param {Function} config.save - Async function (body, editingId) that calls the API.
 * @returns {{ edit: Function }} edit(entry) fills the form with an existing entry.
 */
function setUpForm({ form, noun, toBody, save }) {
  const submitButton = form.querySelector('button[type="submit"]');
  const cancelButton = form.querySelector('.cancel');
  let editingId = null;

  function reset() {
    editingId = null;
    form.reset();
    form.elements.date.value = todayString();
    submitButton.textContent = `Add ${noun}`;
    cancelButton.hidden = true;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const saved = await attempt(() => save(toBody(form), editingId));
    if (saved) {
      reset();
    }
  });

  cancelButton.addEventListener('click', reset);
  reset();

  return {
    edit(entry) {
      editingId = entry.id;
      for (const [name, value] of Object.entries(entry)) {
        if (form.elements[name]) {
          form.elements[name].value = value;
        }
      }
      submitButton.textContent = `Save ${noun}`;
      cancelButton.hidden = false;
      form.elements[0].focus();
    },
  };
}

/**
 * Reloads a list after a change, then the summary. A summary failure
 * does not fail the change that was already saved.
 *
 * @param {Function} loadList - loadExpenses or loadSalaries.
 */
async function refresh(loadList) {
  await loadList();
  await loadSummary().catch((err) => console.error(err.message));
}

/** Number of entries shown before "Show all" is pressed. */
const RECENT_COUNT = 3;

/**
 * Renders a list of entries into a table, newest date first.
 * Shows the most recent entries until "Show all" is pressed.
 *
 * @param {object} config
 * @param {string} config.name - Prefix of the element ids, e.g. "expense".
 * @param {Function} config.toRow - Builds a table row for one entry.
 * @returns {{ show: Function }} show(entries) renders a new list.
 */
function setUpList({ name, toRow }) {
  const rows = document.getElementById(`${name}-rows`);
  const empty = document.getElementById(`${name}-empty`);
  const toggle = document.getElementById(`${name}-toggle`);
  let entries = [];
  let showAll = false;

  function render() {
    const newestFirst = [...entries].reverse().sort((a, b) => b.date.localeCompare(a.date));
    const visible = showAll ? newestFirst : newestFirst.slice(0, RECENT_COUNT);

    rows.replaceChildren(...visible.map(toRow));
    empty.hidden = entries.length > 0;
    toggle.hidden = entries.length <= RECENT_COUNT;
    toggle.textContent = showAll ? 'Show recent' : `Show all (${entries.length})`;
  }

  toggle.addEventListener('click', () => {
    showAll = !showAll;
    render();
  });

  return {
    show(newEntries) {
      entries = newEntries;
      render();
    },
  };
}

// ---------- Expenses ----------

const expenseForm = setUpForm({
  form: document.getElementById('expense-form'),
  noun: 'expense',
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
    await refresh(loadExpenses);
  },
});

const expenseList = setUpList({
  name: 'expense',
  toRow: (expense) => {
    const row = document.createElement('tr');
    row.append(
      cell(expense.date, 'nowrap'),
      cell(expense.description),
      cell(badge(expense.category)),
      cell(formatMoney(expense.amount), 'number'),
      actionButtons(
        () => expenseForm.edit(expense),
        () => attempt(async () => {
          await request('DELETE', `/api/expenses/${expense.id}`);
          await refresh(loadExpenses);
        }),
      ),
    );
    return row;
  },
});

async function loadExpenses() {
  expenseList.show(await request('GET', '/api/expenses'));
}

// ---------- Salary ----------

const salaryForm = setUpForm({
  form: document.getElementById('salary-form'),
  noun: 'salary',
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
    await refresh(loadSalaries);
  },
});

const salaryList = setUpList({
  name: 'salary',
  toRow: (salary) => {
    const row = document.createElement('tr');
    row.append(
      cell(formatMonth(salary.date), 'nowrap'),
      cell(formatMoney(salary.amount), 'number'),
      actionButtons(
        () => salaryForm.edit(salary),
        () => attempt(async () => {
          await request('DELETE', `/api/salaries/${salary.id}`);
          await refresh(loadSalaries);
        }),
      ),
    );
    return row;
  },
});

async function loadSalaries() {
  salaryList.show(await request('GET', '/api/salaries'));
}

// ---------- Summary ----------

/**
 * Loads the summary totals from the API and shows them.
 */
async function loadSummary() {
  const summary = await request('GET', '/api/summary');

  for (const field of ['salary', 'basic', 'extra', 'total', 'savings']) {
    const value = document.querySelector(`[data-field="${field}"]`);
    value.textContent = formatMoney(summary[field]);
    value.classList.toggle('negative', summary[field] < 0);
  }
}

// ---------- Startup ----------

/**
 * Loads expenses, salaries and the summary. Failures are logged to the
 * console; the affected section keeps its empty state.
 */
async function loadAll() {
  const results = await Promise.allSettled([loadExpenses(), loadSalaries(), loadSummary()]);
  for (const result of results) {
    if (result.status === 'rejected') {
      console.error(result.reason.message);
    }
  }
}

loadAll();