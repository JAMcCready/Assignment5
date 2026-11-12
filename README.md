# Expense Tracker: Instructions

The goal of the assignment is to help prepare you for the project. You will work with similar tools and follow the same process as in the project.

## Expense Tracker

The Expense Tracker is a web application for keeping track of personal finances. The user records expenses, each marked as either a Basic need or an Extra, and the salary payments they receive. The app then shows a summary of how much was earned, how much was spent in each category and how much was saved. 

The Expense Tracker has three use cases. UC-1 is already implemented and can be used as an example. You will complete UC-2 and UC-3.

The repository contains the following:

* The requirements document (docs/SRS.md) and the design document (docs/SDD.md)  
* The frontend in the public/ folder, which is complete and does not need to be changed  
* The code and unit tests for UC-1  
* Placeholder code and unit tests with TODO comments for UC-2 and UC-3  
* System test cases in docs/system-tests.md, where some tests are written and others are marked as TODO  
* A tutorial (docs/TUTORIAL.md) that explains how the code works and how to run it

### Getting your own copy

You will work in your own GitHub repository, which also lets you show the project in your portfolio later.

1. On GitHub, create a new empty repository. Make it public, and do not add a README, .gitignore or license.  
2. Clone the starter repository and open the folder:

git clone https\://github.com/smcm-cosc-301/COSC301-ExpenseTracker-JS.git  
cd COSC301-ExpenseTracker-JS

3. Point the folder to your new repository and push the starter code to it:

git remote set-url origin https\://github.com/\<your-username\>/\<your-repository\>.git  
git push \-u origin main

## Use cases

The full description of each use case is in docs/SRS.md.

| Use case | Description | Status |
| :---- | :---- | :---- |
| UC-1 Manage expenses | Add, view, edit and delete expenses.  | Implemented |
| UC-2 Manage salary | Add, view, edit and delete salary payments.  | To be completed |
| UC-3 View summary | Show the total salary, the totals of Basic need and Extra expenses, the total of all expenses, and the savings | To be completed |

## How to start

Read these instructions.

1. Read the tutorial from start to end to get an overview of the project.  
2. Go through the tutorial a second time and follow along on your computer: install the tools, run the commands and open the files that the tutorial mentions.  
3. Use the app in the browser. Add, edit and delete a few expenses. Then try to add a salary and look at the message in the browser console. The salary part does not work yet because UC-2 has not been implemented.  
4. Read UC-2 in the requirements document and the Salary class in the design document.  
5. Write the unit tests in tests/models/Salary.test.js by replacing the it.todo lines. These tests will fail until the Salary class is complete.  
6. Complete src/models/Salary.js until the unit tests pass. You can use src/models/Expense.js as an example.  
7. Complete the routes in src/routes/salaries.js, using src/routes/expenses.js as an example. Check in the browser that you can add, edit and delete a salary.  
8. Write and run the system tests for UC-2 in docs/system-tests.md.  
9. Read UC-3 in the requirements document and SummaryService in the design document.  
10. Write the unit tests in tests/services/SummaryService.test.js, and then complete src/services/SummaryService.js until they pass.  
11. Complete the route in src/routes/summary.js, and check in the browser that the summary shows the correct totals.  
12. Write and run the system tests for UC-3.  
13. Check in VS Code that all tests pass in the Testing view and that ESLint does not underline any problems in your files.

It is a good idea to commit your work to Git after each step that works, so that you can go back to a working version if something breaks later.

## Midpoint submission

For the midpoint submission, submit the document ([link](https://docs.google.com/document/d/1eKWOPvgu96g4_JbU5YGd6E5gtLAfEX2ewsXzkkN3uns/copy)) in Blackboard. It includes:

1. A link to your Repo that has cloned components from the main repo.  
2. A screenshot of the app running. The screenshot should show the terminal with the output of npm run dev and the browser with the app open at [http\://localhost:3000](http://localhost:3000).  
3. Short answers to the following questions:  
   * Which parts of the tutorial or the code do you feel confident about?  
   * Which parts are unclear to you?  
   * Which parts would you need help with?

Submit Midpoint Checkpoint Document ([link](https://docs.google.com/document/d/1eKWOPvgu96g4_JbU5YGd6E5gtLAfEX2ewsXzkkN3uns/copy)) by **Nov 20 11:45 PM** in Blackboard. Submit it in the Final Assignment 5 submission.

## Final submission

For the final submission, submit the following:

1\.      **A link to your Git repository** with your code, unit tests and system tests. The repository must be **public** so that I can open it. *You do not need to invite the instructor to the repository*.  
2\.      The **checkpoint document**

## 

## Grading Rubrics

The assignment is worth 110 points. **All the points are for following the process. Correct code on its own gives no points.** The goal is to get comfortable writing code in a larger codebase.

| Part | What is graded | Points |
| :---- | :---- | :---- |
| Midpoint | Screenshot of the app running | 5 |
| Midpoint | Answer: which parts you feel confident about | 5 |
| Midpoint | Answer: which parts are unclear or need help | 5 |
| Final | Setting up and running the app ( add Check point Document to the Blackboard submission) | 40 |
| Final | Code and unit tests written for the Salary class and the salary API (src/routes/salaries.js) | 20 |
| Final | Code and unit tests written for SummaryService and the summary API (src/routes/summary.js) | 20 |
| Final | System tests for UC-2 and UC-3 written and run, with the actual output filled in (fill in errors if the code is not working) | 10 |
| Final | Frequent Git Commits (usually after a method or file is written or test is written) | 5 |
|   | Total | 110 |

**Note:** *You can only get 95 points if you do not complete MidPoint submission. Also you need to submit the same document for Final in Blackboard for 40 points, there is no reason not to submit the midpoint check.*

