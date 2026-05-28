import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import Tag from '@/app/models/tags';
import { NextResponse } from 'next/server';

export async function DELETE(req) {
  try {
    await dbConnect();

    const { id, userId } = await req.json();

    if (!id || !userId) {
      return NextResponse.json(
        { success: false, message: "Tag ID and user ID are required" },
        { status: 400 }
      );
    }

    const deletedTag = await Tag.findOneAndDelete({ _id: id, user_id: userId });

    if (!deletedTag) {
      return NextResponse.json(
        { success: false, message: "Tag not found" },
        { status: 404 }
      );
    }

    await Expense.updateMany(
      { userId, tagIds: deletedTag._id },
      { $pull: { tagIds: deletedTag._id } }
    );

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
      data: deletedTag,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete tag: " + error.message },
      { status: 500 }
    );
  }
}
