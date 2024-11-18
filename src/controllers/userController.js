import User from '../models/User.js';
import Account from '../models/Account.js';
import Expense from '../models/Expense.js';
import mongoose from 'mongoose';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: req.__('exist_user') });
    }
    const user = await User.create({ name, email, password });
    if (user) {
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: req.__('invalid_user_data') });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUsers = async (req, res) => {
  const { userId, limit = 10, page = 1 } = req.query;
  const skip = (page - 1) * limit;

  try {
    let query = {};

    if (userId) {
      if (!mongoose.isValidObjectId(userId)) {
        return res.status(400).json({ message: req.__('invalid_user_format') });
      }
      query._id = userId;
    }
    console.log(req.query);

    const user = await User.find(query)
      .skip(skip)  
      .limit(parseInt(limit))
      .exec();

    const totalUser = await User.countDocuments(query);
     res.status(200).json({
      user,
      totalUser,
      totalPages: Math.ceil(totalUser / limit), 
      currentPage: parseInt(page),
    });
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const token = req.headers.authorization; 
  if (!token) return res.status(401).json({ message: req.__('authen_required') });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id; 
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ message: req.__('invalid_user_format') });
    }
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: req.__('invalid_user_format') });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message:  req.__('no_user') });
    }
    if (user.userId.toString() !== userId) {
      return res.status(403).json({ message: req.__('unauthorize') });
    }

    const account = await Account.find({userId: id});
    if(account.length >0 ){
      return res.status(400).json({ message: req.__('account_linked') });
    }

    const expenses = await Expense.find({ accountId: id });
    if (expenses.length > 0) {
      return res.status(400).json({ message: req.__('expense_linked') });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: req.__('del_user') });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
