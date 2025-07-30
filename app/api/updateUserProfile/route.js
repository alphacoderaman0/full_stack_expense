import dbConnect from '@/app/lib/dbconnect';
import { User } from '@/app/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function PATCH(request) {
  try {
    await dbConnect();

    // Step 1: Extract Bearer token
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. No token provided.' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];

    // Step 2: Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Step 3: Parse request body
    const body = await request.json();

    // Step 4: Allow only specific fields to be updated
    const allowedFields = [
      'name',
      'email',
      'username',
      'phone',
      'address',
      'profession',
      'city',
      'state',
    ];

    const updates = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { success: false, message: 'No valid fields provided to update.' },
        { status: 400 }
      );
    }

    // Step 5: Update user in DB
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: '-password',
    });

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    // Step 6: Send response
    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
