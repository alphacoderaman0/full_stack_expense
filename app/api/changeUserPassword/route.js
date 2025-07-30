import dbConnect from '@/app/lib/dbconnect';
import { User } from '@/app/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function PATCH(request) {
  try {
    await dbConnect();

    // Step 1: Get Bearer token
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
        { success: false, message: 'Invalid or expired token.' },
        { status: 401 }
      );
    }

    const userId = decoded.id;

    // Step 3: Get password from body
    const body = await request.json();
    const { password } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters.' },
        { status: 400 }
      );
    }

    // Step 4: Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 5: Update password in DB
    const user = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully.',
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
