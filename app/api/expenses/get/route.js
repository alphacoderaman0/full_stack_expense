import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();
    const userId = req.nextUrl.searchParams.get('userId');
    const page = parseInt(req.nextUrl.searchParams.get('page')) || 1;
    const limit = parseInt(req.nextUrl.searchParams.get('limit')) || 10;

    // Validation
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch expenses with pagination
    const expenses = await Expense.find({ userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count for pagination info
    const total = await Expense.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      data: expenses,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch expenses: " + error.message },
      { status: 500 }
    );
  }
}