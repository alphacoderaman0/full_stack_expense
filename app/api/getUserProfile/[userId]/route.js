import dbConnect from '@/app/lib/dbconnect';
import { User } from '@/app/models/user';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    await dbConnect();

    // Step 1: Token extract from cookies
    const token = request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. No token found.' },
        { status: 401 }
      );
    }

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

    // Step 3: Find user by ID (exclude password)
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Step 4: Return user data
    return NextResponse.json({
      success: true,
      user,
    });

  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
