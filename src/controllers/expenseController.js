import Expense from '../models/Expense.js';
import Account from '../models/Account.js';
import ExpenseType from '../models/ExpenseType.js';
import filterProfanity from '../utils/filterProfanity.js';
import mongoose from 'mongoose';

export const addExpense = async (req, res) => {
  const { accountId, expenseTypeId, amount, date, note } = req.body;

  let transactionSlipUrl = '';
  if (req.file) {
    transactionSlipUrl = `uploads/${req.file.filename}`; 
  }

  const filteredNote = filterProfanity(note);
  if (!mongoose.isValidObjectId(accountId)) {
    return res.status(400).json({ message: req.__('invalid_account_format') });
  }
  if (!mongoose.isValidObjectId(expenseTypeId)) {
    return res.status(400).json({ message: req.__('invalid_expense_type_format') });
  }

  try {
    
    const account = await Account.findById(accountId);
    if (!account) {
      return res.status(404).json({ message: req.__('no_account') });
    }
    if (account.balance < amount) {
      return res.status(400).json({ message: req.__('not_enough_fund funds in the account') });
    }
    const expenseType = await ExpenseType.findById(expenseTypeId);
    if(!expenseType){
      return res.status(404).json({message: req.__('no_expense_type')});
    }
    const newExpense = new Expense({
      accountId,
      expenseTypeId,
      amount,
      date,
      note: filteredNote,
      transactionSlip: transactionSlipUrl,
    });

    await newExpense.save();
    account.balance -= amount;
    await account.save();

    res.status(201).json(newExpense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('accountId', 'name balance') 
      .populate('expenseTypeId', 'name'); 
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseSummary = async (req, res) => {
  const { startDate, endDate, accountId, expenseTypeId } = req.query;
  try {
   
    let filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (accountId) {
      if (!mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ message: req.__('invalid_account_format') });
      }
      filter.accountId = accountId;
    }
    if (expenseTypeId) {
      if (!mongoose.isValidObjectId(expenseTypeId)) {
        return res.status(400).json({ message: req.__('invalid_expense_type_format') });
      }
      filter.expenseTypeId = expenseTypeId;
    }

    
    const expenses = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null, 
          totalAmount: { $sum: "$amount" } 
        }
      }
    ]);

    if (expenses.length === 0) {
      return res.status(404).json({ message: req.__('no_expense') });
    }

    res.status(200).json({
      totalAmount: expenses[0].totalAmount 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFilteredExpenses = async (req, res) => {
  const { startDate, endDate, accountId, expenseTypeId, userId, limit = 10, page = 1  } = req.query;
  const skip = (page - 1) * limit; 

  try {
    let filter = {};
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (accountId) {
      if (!mongoose.isValidObjectId(accountId)) {
        return res.status(400).json({ message: req.__('invalid_account_format') });
      }
      filter.accountId = accountId;
    }
    if (expenseTypeId) {
      if (!mongoose.isValidObjectId(expenseTypeId)) {
        return res.status(400).json({ message: req.__('invalid_expense_type_format') });
      }
      filter.expenseTypeId = expenseTypeId;
    }
    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: req.__('invalid_user_format') });
      }
      filter.accountId = { $in: await Account.find({ userId }).select('_id') }; 
    }
   
    const expenses = await Expense.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('accountId')  
      .populate('expenseTypeId');

    const totalExpenses = await Expense.countDocuments(filter);

    const totalAmount = await Expense.aggregate([
      { $match: filter },
      { $group: { _id: null, totalAmount: { $sum: '$amount' } } },
    ]);

    if (expenses.length === 0) {
      return res.status(404).json({ message: req.__('no_expense') });
    }
    res.status(200).json({
      expenses,
      totalExpenses,
      totalPages: Math.ceil(totalExpenses / limit), 
      currentPage: parseInt(page),
      totalAmount: totalAmount[0]?.totalAmount || 0,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpense = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: req.__('invalid_expense_format') });
  }
  try{
    const expense = await Expense.findByIdAndDelete(id);
    const account = await Account.findById(expense.accountId);
    if (!account) {
      return res.status(404).json({ message: req.__('no_account') });
    }
    if (!expense) {
      return res.status(404).json({ message: req.__('no_expense') });
    }
    account.balance += expense.amount;
    await account.save();
    res.status(200).json({ message: req.__('del_expense') });
    
  } catch (error){
    res.status(500).json({ message: error.message });
  }
};

