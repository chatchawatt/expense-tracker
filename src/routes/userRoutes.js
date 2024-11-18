import express from 'express';
import { registerUser, getUsers, deleteUser } from '../controllers/userController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';


const router = express.Router();

router.post('/register', registerUser);
router.get('/', getUsers);
router.delete('/', authMiddleware , deleteUser);

export default router;
