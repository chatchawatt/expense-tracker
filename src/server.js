import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import expenseTypeRoutes from './routes/expenseTypeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import i18n from 'i18n';
import path from 'path';
import { fileURLToPath } from 'url';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

i18n.configure({
  locales: ['en', 'th'], 
  directory:  path.resolve(__dirname, 'locales'),
  defaultLocale: 'en', 
  queryParameter: 'lang',
  register: global, 
});
app.use(i18n.init);
app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/expense-types', expenseTypeRoutes);
app.use('/api/expense', expenseRoutes);
app.use('/api/login', loginRoutes);


connectDB();

app.get('/', (req, res) => {
  res.send('Expense Tracker API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
