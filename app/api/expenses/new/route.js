import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

// Helper to create history records
const logExpenseChange = async (expense, action, userId, previousData = null) => {
  await ExpenseHistory.create({
    expenseId: expense._id,
    title: expense.title,
    description: expense.description,
    amount: expense.amount,
    tagIds: expense.tagIds,
    action,
    changedBy: userId,
    previousData // Optional: Store complete previous state
  });
};

// CREATE Expense
export async function POST(req) {
  try {
    await dbConnect();
    const { title, amount, date, userId, description, tagIds } = await req.json();

    const newExpense = await Expense.create({ 
      title, 
      amount, 
      date, 
      userId,
      description: description || "",
      tagIds: tagIds || "" 
    });
    
    await logExpenseChange(newExpense, 'created', userId);

    return NextResponse.json({ 
      success: true, 
      data: newExpense 
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// UPDATE Expense (Creates history on EVERY change)
export async function PUT(req) {
  try {
    await dbConnect();
    const { id, userId, ...updateData } = await req.json();

    // Get current state before update
    const currentExpense = await Expense.findById(id);
    if (!currentExpense) {
      return NextResponse.json({ 
        success: false, 
        error: "Expense not found" 
      }, { status: 404 });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    await logExpenseChange(
      updatedExpense, 
      'updated', 
      userId,
      { // Store previous values
        title: currentExpense.title,
        amount: currentExpense.amount,
        description: currentExpense.description,
        tagIds: currentExpense.tagIds
      }
    );

    return NextResponse.json({ 
      success: true, 
      data: updatedExpense 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}

// DELETE Expense (With history)
export async function DELETE(req) {
  try {
    await dbConnect();
    const { id, userId } = await req.json();

    const expenseToDelete = await Expense.findById(id);
    if (!expenseToDelete) {
      return NextResponse.json({ 
        success: false, 
        error: "Expense not found" 
      }, { status: 404 });
    }

    await logExpenseChange(expenseToDelete, 'deleted', userId);
    await Expense.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      message: "Expense deleted" 
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}