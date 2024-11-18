import mongoose from 'mongoose';

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: { type: String, required: true },
  balance: { type: Number, required: true, default: 0 },
},{ timestamps: true });

export default mongoose.model('Account', accountSchema);
