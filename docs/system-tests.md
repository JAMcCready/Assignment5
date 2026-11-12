# Expense Tracker: System Test Cases

Run each test and fill in **Actual output**: write **Pass** if it matches the expected output, or describe what happened instead. **Author** is the person who wrote the test.

## Before each test

Do a **clean start**, so every test begins with no data:

1. Stop the server (`Ctrl+C`).
2. Delete the `data/` folder.
3. Run `npm run dev` and open `http://localhost:3000`.

**Preconditions** in a test are extra steps on top of the clean start. Unless a test says otherwise, use today's date and the category **Basic need**.

## Glossary

### Test IDs

`ST-UC1-S1-03` means:

| Part | Meaning |
| --- | --- |
| `ST` | System test |
| `UC1` | Use case UC-1 (Manage expenses) in the SRS. `UC2` is Manage salary, `UC3` is View summary |
| `S1` | Subflow S1 (Add). `S2` View, `S3` Edit, `S4` Delete. `A2` would be alternative flow A2, and `MF` the main flow |
| `03` | Third test for that flow |

### Techniques

| Code | Technique | What it checks |
| --- | --- | --- |
| REQ | Requirement-based | A flow from the SRS works as written |
| EC | Equivalence class | One input stands for a whole group that should behave the same (e.g. any valid category) |
| BV | Boundary value | Inputs **below**, **at** and **above** a limit. Each boundary has all three tests |
| DT | Diabolical testing | Inputs meant to break the app: special characters, code, extreme values |

## Test cases

| Test ID | Author | Description | Expected output | Actual output |
| --- | --- | --- | --- | --- |
| ST-UC1-S1-01 | Instructor | Add a valid expense<br>**Technique:** REQ<br>**Input:** Description `Rent`, amount `1200`, category Basic need, date `2026-11-01`. Click **Add expense** | Row `2026-11-01 · Rent · Basic need · 1200.00` appears. The form clears and the date resets to today |  |
| ST-UC1-S1-02 | Instructor | Add an expense in the other valid category<br>**Technique:** EC<br>**Input:** Description `Movie`, amount `15`, category **Extra**. Click **Add expense** | Row appears with the **Extra** badge and amount `15.00` |  |
| ST-UC1-S1-03 | Instructor | Description of only spaces (invalid class)<br>**Technique:** EC<br>**Input:** Description `   ` (three spaces), amount `10`. Click **Add expense** | Error dialog: "description is required and must be at most 100 characters", with **Close** and no **Retry**. Nothing is added |  |
| ST-UC1-S1-04 | Instructor | Amount **below** the minimum (0.01)<br>**Technique:** BV (below)<br>**Input:** Description `Gum`, amount `0.00`. Click **Add expense** | Browser shows "Value must be greater than or equal to 0.01." Nothing is added |  |
| ST-UC1-S1-05 | Instructor | Amount **at** the minimum<br>**Technique:** BV (at)<br>**Input:** Description `Gum`, amount `0.01`. Click **Add expense** | Row appears with amount `0.01` |  |
| ST-UC1-S1-06 | Instructor | Amount **above** the minimum<br>**Technique:** BV (above)<br>**Input:** Description `Gum`, amount `0.02`. Click **Add expense** | Row appears with amount `0.02` |  |
| ST-UC1-S1-07 | Instructor | Amount with more than 2 decimals, rounds up<br>**Technique:** EC<br>**Input:** Description `Movie`, amount `10.5555`. Click **Add expense** | Row shows amount `10.56` |  |
| ST-UC1-S1-08 | Instructor | Description with a comma and quotes<br>**Technique:** DT<br>**Input:** Description `Dinner, with "friends"`, amount `40`. Click **Add expense**. Then restart the server and refresh | The description shows exactly `Dinner, with "friends"`, before and after the restart |  |
| ST-UC1-S3-01 | Instructor | Edit an expense<br>**Technique:** REQ<br>**Preconditions:** ST-UC1-S1-01 done<br>**Input:** Click **Edit** on `Rent`. Change amount to `1250`. Click **Save expense** | While editing, the form shows the expense's values, the button reads **Save expense**, and **Cancel** appears. After saving, the row shows `1250.00` and the button reads **Add expense** |  |
| ST-UC1-S4-01 | Instructor | Delete an expense<br>**Technique:** REQ<br>**Preconditions:** ST-UC1-S1-01 done<br>**Input:** Click **Delete** on `Rent`. Then refresh the page | The row disappears and stays gone after the refresh. "No expenses found." is shown |  |
| ST-UC2-S1-01 | Instructor | Add a valid salary<br>**Technique:** REQ<br>**Input:** Pay date `2026-11-01`, amount `3000`. Click **Add salary** | Row `Nov 2026 · 3000.00` appears. The form clears |  |
| ST-UC2-S1-02 | Instructor | Negative amount<br>**Technique:** DT<br>**Input:** Pay date `2026-11-01`, amount `-500`. Click **Add salary** | Browser shows "Value must be greater than or equal to 0.01." Nothing is added |  |
|  |  | TODO (UC-2): Add a salary whose amount has more than 2 decimals |  |  |
|  |  | TODO (UC-2): Edit a salary |  |  |
|  |  | TODO (UC-2): Delete a salary |  |  |
|  |  | TODO (UC-2): Pay date left empty |  |  |
|  |  | TODO (UC-3): Totals after adding a basic expense, an extra expense and a salary |  |  |
|  |  | TODO (UC-3): No salaries saved |  |  |
|  |  | TODO (UC-3): Expenses higher than salary (negative savings) |  |  |
|  |  | TODO (UC-3): Summary updates after an expense is deleted |  |  |

**Notes:**

- Feel free to add additional tests.
- **Boundary values:** the boundary in our case is `0.01`. This is because the smallest money amount we accept is 0.01 not 0. So, the three tests are `0.00` (below), `0.01` (at) and `0.02` (above).
- **In a real project there would be many more tests.** We kept this list short for the assignment. For example, a full test plan would also cover what happens when the server is not running or the data file cannot be saved, when the same expense is deleted in two browser tabs, the list limit of 3 (below, at and above), descriptions at the 100-character limit, and unusual input such as `<script>` tags or very large amounts.
