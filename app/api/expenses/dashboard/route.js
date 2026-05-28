import mongoose from 'mongoose';
import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import ExpenseHistory from '@/app/models/expenseHistory';
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

const getExpenseDate = (expense) => {
  const value = expense.created_at || expense.createdAt || expense.date || expense.updated_at;
  const date = value ? new Date(value) : new Date(0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
};

const monthKey = (date) => `${date.getFullYear()}-${date.getMonth()}`;

const getLastSixMonths = () => {
  const now = new Date();

  return Array.from({ length: 6 }, (_item, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      key: monthKey(date),
      label: date.toLocaleString('en-IN', { month: 'short' }),
      total: 0,
      count: 0,
    };
  });
};

export async function GET(req) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { success: false, message: "Valid user ID is required" },
        { status: 400 }
      );
    }

    const [expenses, tags, recentActivity] = await Promise.all([
      Expense.find({ userId }).lean(),
      Tag.find({ user_id: userId }).select('name color').lean(),
      ExpenseHistory.find({ changedBy: userId }).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const tagMap = new Map(
      tags.map((tag) => [
        tag._id.toString(),
        {
          _id: tag._id,
          id: tag._id.toString(),
          name: tag.name,
          color: tag.color,
        },
      ])
    );

    const totalSpent = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0);
    const averageExpense = expenses.length ? totalSpent / expenses.length : 0;

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const thisMonthSpent = expenses.reduce((sum, expense) => {
      const expenseDate = getExpenseDate(expense);
      return expenseDate >= monthStart ? sum + Number(expense.amount || 0) : sum;
    }, 0);

    const lastMonthSpent = expenses.reduce((sum, expense) => {
      const expenseDate = getExpenseDate(expense);
      return expenseDate >= lastMonthStart && expenseDate < monthStart
        ? sum + Number(expense.amount || 0)
        : sum;
    }, 0);

    const monthTrend = lastMonthSpent
      ? ((thisMonthSpent - lastMonthSpent) / lastMonthSpent) * 100
      : thisMonthSpent > 0
        ? 100
        : 0;

    const monthlySeries = getLastSixMonths();
    const monthlyMap = new Map(monthlySeries.map((item) => [item.key, item]));

    const tagTotals = new Map();

    expenses.forEach((expense) => {
      const amount = Number(expense.amount || 0);
      const expenseDate = getExpenseDate(expense);
      const bucket = monthlyMap.get(monthKey(expenseDate));

      if (bucket) {
        bucket.total += amount;
        bucket.count += 1;
      }

      getValidTagIds(expense.tagIds).forEach((tagId) => {
        const tag = tagMap.get(tagId);
        if (!tag) return;

        const current = tagTotals.get(tagId) || {
          ...tag,
          total: 0,
          count: 0,
        };

        current.total += amount;
        current.count += 1;
        tagTotals.set(tagId, current);
      });
    });

    const topTags = Array.from(tagTotals.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const recentExpenses = expenses
      .slice()
      .sort((a, b) => getExpenseDate(b) - getExpenseDate(a))
      .slice(0, 5)
      .map((expense) => {
        const expenseTagIds = getValidTagIds(expense.tagIds);
        const expenseTags = expenseTagIds.map((tagId) => tagMap.get(tagId)).filter(Boolean);

        return {
          _id: expense._id,
          title: expense.title,
          amount: expense.amount,
          description: expense.description,
          created_at: expense.created_at,
          tags: expenseTags,
          tagNames: expenseTags.map((tag) => tag.name),
        };
      });

    const actionCounts = recentActivity.reduce((counts, item) => {
      counts[item.action] = (counts[item.action] || 0) + 1;
      return counts;
    }, { created: 0, updated: 0, deleted: 0 });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSpent,
          totalExpenses: expenses.length,
          averageExpense,
          thisMonthSpent,
          monthTrend,
          tagCount: tags.length,
        },
        monthlySeries,
        topTags,
        recentExpenses,
        recentActivity,
        actionCounts,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch dashboard: " + error.message },
      { status: 500 }
    );
  }
}
