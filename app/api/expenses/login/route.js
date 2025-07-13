import dbConnect from '@/app/lib/dbconnect';
import { User } from '@/app/models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, username, password } = await request.json();

    if (!password || (!email && !username)) {
      return NextResponse.json(
        { success: false, message: 'Email/Username and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne(
      email ? { email } : { username }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id
    });

    response.cookies.set('token', token);
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
