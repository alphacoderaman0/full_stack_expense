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

export async function POST(req) {
  try {
    await dbConnect();
    const { title, amount, date, userId, description, tagIds } = await req.json();

    // Validation
    if (!title || !amount || !userId) {
      return NextResponse.json(
        { success: false, message: "Title, amount and user ID are required" },
        { status: 400 }
      );
    }

    // Create new expense
    const newExpense = await Expense.create({
      title,
      amount,
      date: date || new Date(),
      userId,
      description: description || "",
      tagIds: normalizeTagIds(tagIds)
    });

    // Record in history
    await ExpenseHistory.create({
      expenseId: newExpense._id,
      title: newExpense.title,
      amount: newExpense.amount,
      description: newExpense.description,
      tagIds: newExpense.tagIds,
      action: "created",
      changedBy: userId
    });

    return NextResponse.json(
      { success: true, data: newExpense },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add expense: " + error.message },
      { status: 500 }
    );
  }
}
