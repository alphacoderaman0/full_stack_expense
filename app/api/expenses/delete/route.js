import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

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
    const expenseToDelete = await Expense.findById(id);
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
      tagIds: expenseToDelete.tagIds,
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