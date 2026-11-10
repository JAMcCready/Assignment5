import { createApp } from './app.js';

const port = process.env.PORT ?? 3000;
const dataDir = process.env.DATA_DIR ?? './data';

createApp({ dataDir }).listen(port, () => {
  console.log(`Expense Tracker running at http://localhost:${port}`);
});