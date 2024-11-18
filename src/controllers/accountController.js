import Account from '../models/Account.js';
import Expense from '../models/Expense.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Add Account
export const addAccount = async (req, res) => {
  const { name, balance } = req.body;
  const userId = req.userId

  try {
    const newAccount = new Account({ name, balance, userId });
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Account
export const deleteAccount = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization; 
  if (!token) return res.status(401).json({ message: req.__('authen_required') });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userId = decoded.id; 
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: req.__('invalid_user_format') });
    }
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: req.__('invalid_user_format') });
    }

    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ message: req.__('no_account') });
    }
    if (account.userId.toString() !== userId) {
      return res.status(403).json({ message: req.__('unauthorized') });
    }

    const expenses = await Expense.find({ accountId: id });
    if (expenses.length > 0) {
      return res.status(400).json({ message: req.__('expense_linked') });
    }

    await Account.findByIdAndDelete(id);
    res.status(200).json({ message: req.__('del_account') });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Accounts
export const getAccounts = async (req, res) => {
  const { userId, accountId ,limit = 10, page = 1 } = req.query; 
  const skip = (page - 1) * limit; 

  try {
    let query = {};

    if (userId) {
      query.userId = userId;
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: req.__('invalid_user_format') });
      }
    }
    if (accountId) {
      query._id = accountId;
      if (!mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ message: req.__('invalid_account_format') });
      }
    }
    

    const accounts = await Account.find(query)
      .skip(skip)
      .limit(parseInt(limit)) 
      .exec(); 

    const totalAccounts = await Account.countDocuments(query);

    res.status(200).json({
      accounts,
      totalAccounts,
      totalPages: Math.ceil(totalAccounts / limit), 
      currentPage: parseInt(page),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
