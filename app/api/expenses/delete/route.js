import mongoose from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

const normalizeTagIds = (tagIds) => {
  const values = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];
  return values
    .map((tagId) => tagId?._id?.toString?.() || String(tagId))
    .filter((tagId) => tagId && mongoose.Types.ObjectId.isValid(tagId));
};

export async function DELETE(req) {
  try {
    await dbConnect();
    const { id, userId } = await req.json();

    // Validation
    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Expense ID and user ID are required" },
        { status: 400 }
      );
    }

    // Get expense before deletion
    const expenseToDelete = await Expense.findById(id).lean();
    if (!expenseToDelete) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    // Record in history before deleting
    await ExpenseHistory.create({
      expenseId: id,
      title: expenseToDelete.title,
      amount: expenseToDelete.amount,
      description: expenseToDelete.description,
      tagIds: normalizeTagIds(expenseToDelete.tagIds),
      action: "deleted",
      changedBy: userId
    });

    // Delete the expense
    await Expense.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Expense deleted successfully" }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete expense: " + error.message },
      { status: 500 }
    );
  }
}
