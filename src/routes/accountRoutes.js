import express from 'express';
import { addAccount, deleteAccount, getAccounts } from '../controllers/accountController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware ,addAccount);
router.delete('/:id', authMiddleware, deleteAccount);
router.get('/', getAccounts);

export default router;
