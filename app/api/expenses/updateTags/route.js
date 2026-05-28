import dbConnect from '@/app/lib/dbconnect';
import Tag from '@/app/models/tags';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  try {
    await dbConnect();

    const { id, userId, name, color } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Tag ID and user ID are required" },
        { status: 400 }
      );
    }

    const updateData = {};
    if (typeof name === 'string' && name.trim()) {
      updateData.name = name.trim();
    }
    if (typeof color === 'string' && color.trim()) {
      updateData.color = color.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, message: "Name or color is required to update tag" },
        { status: 400 }
      );
    }

    const updatedTag = await Tag.findOneAndUpdate(
      { _id: id, user_id: userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTag,
    });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Tag already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update tag: " + error.message },
      { status: 500 }
    );
  }
}
