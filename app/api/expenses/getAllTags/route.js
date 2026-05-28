import dbConnect from '@/app/lib/dbconnect';
import Tag from '@/app/models/tags';
import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    await dbConnect();

    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const tags = await Tag.find({ user_id: userId }).sort({ created_at: -1 });

    return NextResponse.json({
      success: true,
      data: tags,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch tags: " + error.message },
      { status: 500 }
    );
  }
}
