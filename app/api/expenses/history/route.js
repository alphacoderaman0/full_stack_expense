import dbConnect from '@/app/lib/dbconnect';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const expenseId = req.nextUrl.searchParams.get('expenseId');
    const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;

    // Validation
    if (!expenseId) {
      return NextResponse.json(
        { success: false, message: "Expense ID is required" },
        { status: 400 }
      );
    }

    // Fetch history
    const history = await ExpenseHistory.find({ expenseId })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      data: history,
      count: history.length
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch history: " + error.message },
      { status: 500 }
    );
  }
}