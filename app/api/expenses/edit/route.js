import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await dbConnect();
    const { id, userId, ...updateData } = await req.json();

    // Validation
    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Expense ID and user ID are required" },
        { status: 400 }
      );
    }

    // Get current expense before update
    const currentExpense = await Expense.findById(id);
    if (!currentExpense) {
      return NextResponse.json(
        { success: false, message: "Expense not found" },
        { status: 404 }
      );
    }

    // Update expense
    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    // Record in history
    await ExpenseHistory.create({
      expenseId: id,
      title: updatedExpense.title,
      amount: updatedExpense.amount,
      description: updatedExpense.description,
      tagIds: updatedExpense.tagIds,
      action: "updated",
      changedBy: userId,
      previousData: {
        title: currentExpense.title,
        amount: currentExpense.amount,
        description: currentExpense.description,
        tagIds: currentExpense.tagIds
      }
    });

    return NextResponse.json(
      { success: true, data: updatedExpense }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update expense: " + error.message },
      { status: 500 }
    );
  }
}