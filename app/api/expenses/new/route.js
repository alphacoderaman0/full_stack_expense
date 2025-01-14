import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import { NextResponse } from 'next/server';

// Create a new expense
export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const expense = await Expense.create(body);

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Get all expenses
export async function GET() {
  try {
    await dbConnect();

    const expenses = await Expense.find({});
    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Delete an expense by ID
export async function DELETE(request) {
  try {
    await dbConnect();

    const { id } = await request.json(); // Extract ID from the request body
    if (!id) {
      return NextResponse.json({ success: false, message: "ID is required" }, { status: 400 });
    }

    await Expense.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Update an expense by ID
export async function PUT(request) {
  try {
    await dbConnect();

    const { id, title, amount } = await request.json(); // Extract data from request body
    if (!id || !title || !amount) {
      return NextResponse.json(
        { success: false, message: "ID, title, and amount are required" },
        { status: 400 }
      );
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount },
      { new: true, runValidators: true } // Return updated document and validate inputs
    );

    if (!updatedExpense) {
      return NextResponse.json({ success: false, message: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, expense: updatedExpense });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
