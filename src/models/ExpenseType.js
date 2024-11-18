import mongoose from 'mongoose';

const expenseTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
});

export default mongoose.model('ExpenseType', expenseTypeSchema);
