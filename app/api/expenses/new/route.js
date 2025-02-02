import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import { NextResponse } from 'next/server';

// Create Expense
export async function POST(req) {
  try {
    await dbConnect();
    const { title, amount, date, userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const newExpense = new Expense({ title, amount, date, userId });
    await newExpense.save();

    return NextResponse.json({ success: true, message: "Expense added", expense: newExpense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Expense add failed: " + error.message }, { status: 500 });
  }
}

// ✅ Fetch User-Specific Expenses
export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get("userId"); // Query Params se le rahe hain

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
    }

    const expenses = await Expense.find({ userId }).sort({ date: -1 }); // Latest first
    return NextResponse.json({ success: true, expenses }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Failed to fetch expenses: " + error.message }, { status: 500 });
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
