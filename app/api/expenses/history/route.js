import dbConnect from '@/app/lib/dbconnect';
import ExpenseHistory from '@/app/models/expenseHistory';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get('userId');
    const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch history
    const history = await ExpenseHistory.find({ changedBy: userId })
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