import express from 'express';
import { addExpenseType, getExpenseTypes, deleteExpenseType } from '../controllers/expenseTypeController.js';

const router = express.Router();

router.post('/', addExpenseType);

router.get('/', getExpenseTypes);
router.delete('/:id', deleteExpenseType);

export default router;
