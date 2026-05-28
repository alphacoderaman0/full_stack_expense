import dbConnect from '@/app/lib/dbconnect';
import Tag from '@/app/models/tags';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    await dbConnect();

    const { userId, name, color } = await req.json();
    const tagName = typeof name === 'string' ? name.trim() : "";

    if (!userId || !tagName) {
      return NextResponse.json(
        { success: false, message: "User ID and tag name are required" },
        { status: 400 }
      );
    }

    const tag = await Tag.create({
      user_id: userId,
      name: tagName,
      color: color || undefined,
    });

    return NextResponse.json(
      { success: true, data: tag },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Tag already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to add tag: " + error.message },
      { status: 500 }
    );
  }
}
