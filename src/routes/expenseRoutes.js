import express from 'express';
import upload from '../config/multerConfig.js';
import { addExpense, getExpenses, getExpenseSummary,getFilteredExpenses, deleteExpense } from '../controllers/expenseController.js';

const router = express.Router();

router.post('/', upload.single('transactionSlip'), addExpense);
router.get('/', getExpenses);
router.get('/summary', getExpenseSummary);
router.get('/filter',getFilteredExpenses);
router.delete('/:id', deleteExpense)

export default router;