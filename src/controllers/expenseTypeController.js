import ExpenseType from '../models/ExpenseType.js';
import mongoose from 'mongoose';

export const addExpenseType = async (req, res) => {
  const { name } = req.body;

  try {
    const newExpenseType = new ExpenseType({ name });
    await newExpenseType.save();
    res.status(201).json(newExpenseType);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getExpenseTypes = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  try {
    const expenseTypes = await ExpenseType.find()
      .skip(skip)  
      .limit(parseInt(limit));

    const totalExpenseTypes = await ExpenseType.countDocuments();
     res.status(200).json({
      expenseTypes,
      totalExpenseTypes,
      totalPages: Math.ceil(totalExpenseTypes / limit), 
      currentPage: parseInt(page),
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteExpenseType = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: req.__('invalid_expense_type_format') });
  }
  try{
    const expenseType = await ExpenseType.findByIdAndDelete(id);
    if (!expenseType) {
      return res.status(404).json({ message: req.__('no_expense_type') });
    }else{
        res.status(200).json({ message: req.__('del_expense_type') });
    }
  } catch (error){
    res.status(500).json({ message: error.message });
  }
};
