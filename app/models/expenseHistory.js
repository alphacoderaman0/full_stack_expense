import mongoose from 'mongoose';

const ExpenseHistorySchema = new mongoose.Schema({
  expenseId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Expense",
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  amount: { type: Number, required: true },
  tagIds: { type: String }, // Store the tags at time of change
  action: { 
    type: String, 
    enum: ['created', 'updated', 'deleted'],
    required: true 
  },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Who made the change
  previousData: { type: Object } // Store complete previous state (optional)
}, { timestamps: true });

export default mongoose.models.ExpenseHistory || mongoose.model('ExpenseHistory', ExpenseHistorySchema);