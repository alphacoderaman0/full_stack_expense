import dbConnect from "@/app/lib/dbconnect";
import Expense from "@/app/models/expense";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
  try {
    await dbConnect();

    const { id } = await params;

    const body = await request.json();
    const { title, amount } = body;

    if (!title || !amount) {
      return NextResponse.json(
        { error: "Title and amount are required" },
        { status: 400 }
      );
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { title, amount },
      { new: true }
    );

    if (!updatedExpense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedExpense, { status: 200 });
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request, { params }) {
  try {
    await dbConnect();

    // Await params to ensure proper access
    const { id } = await params;

    // Find the expense by ID
    const expense = await Expense.findById(id);

    // Handle case where the expense is not found
    if (!expense) {
      return NextResponse.json(
        { error: "Expense not found" },
        { status: 404 }
      );
    }

    // Return the expense data
    return NextResponse.json(expense, { status: 200 });
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
