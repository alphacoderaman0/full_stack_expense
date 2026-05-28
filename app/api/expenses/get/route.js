import mongoose from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import Tag from '@/app/models/tags';
import { NextResponse } from 'next/server';

const getTagId = (tag) => {
  if (!tag) return "";
  if (typeof tag === 'object') return tag._id?.toString?.() || tag.toString?.() || "";
  return String(tag);
};

const getValidTagIds = (tagIds) => {
  const values = Array.isArray(tagIds) ? tagIds : tagIds ? [tagIds] : [];

  return values
    .map(getTagId)
    .filter((tagId) => tagId && mongoose.Types.ObjectId.isValid(tagId));
};

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
      .limit(limit)
      .lean();

    const validTagIds = [...new Set(expenses.flatMap((expense) => getValidTagIds(expense.tagIds)))];
    const tagDocs = validTagIds.length
      ? await Tag.find({ _id: { $in: validTagIds }, user_id: userId }).select('name color').lean()
      : [];
    const tagMap = new Map(
      tagDocs.map((tag) => [
        tag._id.toString(),
        {
          _id: tag._id,
          id: tag._id.toString(),
          name: tag.name,
          color: tag.color,
        },
      ])
    );

    const expensesWithTags = expenses.map((expense) => {
      const expenseTagIds = getValidTagIds(expense.tagIds);
      const tags = expenseTagIds.map((tagId) => tagMap.get(tagId)).filter(Boolean);

      return {
        ...expense,
        tagIds: expenseTagIds,
        tags,
        tagNames: tags.map((tag) => tag.name),
      };
    });

    // Get total count for pagination info
    const total = await Expense.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      data: expensesWithTags,
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