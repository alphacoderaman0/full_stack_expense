import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    amount: { type: Number, required: true },
    description: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tagIds: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
      default: [],
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

if (mongoose.models.Expense && mongoose.models.Expense.schema.path('tagIds')?.instance !== 'Array') {
  mongoose.deleteModel('Expense');
}

export default mongoose.models.Expense || mongoose.model('Expense', ExpenseSchema);
