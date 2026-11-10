# Expense Tracker — Requirements

Nov 10, 2026 · @Sandy

## Problem statement

People often don't know where their money goes each month, or how much of their salary they actually keep. The Expense Tracker is a small web app where a user records their expenses and salary payments, then sees what they spent and what they saved.

Every expense is either a **basic need** (rent, groceries, bills) or an **extra** (eating out, entertainment). It helps the user know where their money was spent.

## Data

The app stores two things, **Expense** and **Salary**, each in its own CSV file (`expenses.csv` and `salaries.csv`) with a header row. The server creates the `id`; the user provides everything else.

**Expense**

| Field | Type | Rules |
| --- | --- | --- |
| id | string | Created by the server |
| description | string | Required, 1–100 characters |
| amount | number | Required, greater than 0, at most 2 decimal places |
| category | string | Required, either `basic` or `extra` |
| date | string | Required, format `YYYY-MM-DD` |

**Salary**

| Field | Type | Rules |
| --- | --- | --- |
| id | string | Created by the server |
| date | string | Required, format `YYYY-MM-DD` (the pay date) |
| amount | number | Required, greater than 0, at most 2 decimal places |

*All money totals are rounded to 2 decimal places.*


## Functional Requirements

### Use cases

| ID | Use case | Description |
| --- | --- | --- |
| UC-1 | Manage expenses | Add, view, edit and delete expenses |
| UC-2 | Manage salary | Add, view, edit and delete salary payments |
| UC-3 | View summary | See total salary, spending by category, and savings |

### UC-1: Manage expenses

**Description:** The user keeps a record of what they spend. Each expense has a description, amount, category (basic or extra) and date, and is saved in the expenses file.

**Main flow**

1. The user opens the app.
2. The system shows the list of expenses (S2).
3. The user chooses what to do: add an expense (S1), edit one (S3), or delete one (S4).
4. The system carries out that subflow and shows the updated list.
5. The user repeats step 3 as needed.

**S1: Add an expense**

1. The user fills in a description, amount, category and date.
2. The user clicks Add.
3. The system validates the data.
4. The system gives the expense a new id and saves it.
5. The new expense appears in the list.

**S2: View expenses**

1. The system reads all saved expenses.
2. The system shows them as a list. If there are none, the list is empty.

**S3: Edit an expense**

1. The user clicks Edit on an expense, which fills the form with its values, and changes one or more fields.
2. The user clicks Save.
3. The system finds the expense and validates the new data.
4. The system saves the changes.
5. The updated expense appears in the list.

**S4: Delete an expense**

1. The user clicks Delete on an expense.
2. The system finds the expense and removes it.
3. The expense disappears from the list.

**Alternative flows**

- **A1, invalid data (S1, S3):** a field is missing or breaks a rule from the Data section. The system shows an error dialog naming the field and saves nothing. The user corrects the data and retries.
- **A2, not found (S3, S4):** the expense no longer exists. The system shows an error dialog and changes nothing. Choosing Retry reloads the list.
- **A3, storage error (all):** the file cannot be read or written. The system shows an error dialog with a Retry option, and the data stays as it was. Choosing Retry repeats the action.

### UC-2: Manage salary

**Description:** The user records how much they earned each month, so the app can calculate savings. Each salary has a pay date and an amount, and is saved in the salaries file. A month can have more than one salary, for example two paychecks, or a main job and a side job.

**Main flow**

1. The user opens the app.
2. The system shows the list of salaries (S2).
3. The user chooses what to do: add a salary (S1), edit one (S3), or delete one (S4).
4. The system carries out that subflow and shows the updated list.
5. The user repeats step 3 as needed.

**S1: Add a salary**

1. The user enters a pay date and an amount.
2. The user clicks Add.
3. The system validates the data.
4. The system gives the salary a new id and saves it.
5. The new salary appears in the list.

**S2: View salaries**

1. The system reads all saved salaries.
2. The system shows them as a list. If there are none, the list is empty.

**S3: Edit a salary**

1. The user clicks Edit on a salary, which fills the form with its values, and changes the pay date, the amount, or both.
2. The user clicks Save.
3. The system finds the salary and validates the new data.
4. The system saves the changes.
5. The updated salary appears in the list.

**S4: Delete a salary**

1. The user clicks Delete on a salary.
2. The system finds the salary and removes it.
3. The salary disappears from the list.

**Alternative flows**

- **A1, invalid data (S1, S3):** the pay date is not `YYYY-MM-DD`, or the amount breaks a rule. The system shows an error dialog naming the field and saves nothing. The user corrects the data and retries.
- **A2, not found (S3, S4):** the salary no longer exists. The system shows an error dialog and changes nothing. Choosing Retry reloads the list.
- **A3, storage error (all):** the file cannot be read or written. The system shows an error dialog with a Retry option, and the data stays as it was. Choosing Retry repeats the action.

### UC-3: View summary

**Description:** The user sees totals across all saved data: total salary, how much went to basic needs and extras, total spent, and how much they saved.

**Main flow**

1. The user opens the app.
2. The system reads all expenses and adds them up: basic total, extra total, and overall total.
3. The system reads all salaries and adds them up.
4. The system calculates savings as total salary minus total expenses.
5. The system shows the total salary, the basic, extra and overall expense totals, and savings.
6. Whenever an expense or salary is added, edited or deleted, the system repeats steps 2–5.

**Alternative flows**

- **A1, no expenses (step 2):** all expense totals are 0; this is not an error.
- **A2, no salaries (step 3):** total salary is 0; this is not an error.
- **A3, overspent (step 4):** total expenses are higher than total salary. Savings is shown as a negative number.
- **A4, storage error (steps 2–3):** a file cannot be read. The system shows an error dialog with a Retry option. Choosing Retry loads the summary again.

## Non Functional Requirements

- **NFR-1, color contrast:** text has a contrast ratio of at least 4.5:1 against its background, as defined in [WCAG 1.4.3 Contrast (Minimum)](https://w3.org/WAI/WCAG20/Understanding/contrast-minimum). See also this [plain-language guide](https://webaim.org/articles/contrast/).
- **NFR-2, response time:** every request gets a response in under 3 seconds.

## Constraints

1. Node.js with Express.
2. Data is stored in CSV files.
3. Vitest for unit tests.
