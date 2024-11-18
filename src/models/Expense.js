import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  expenseTypeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExpenseType', 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  note: {
    type: String,
    required: false
  },
  transactionSlip: {  
    type: String,     
  },
});

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
