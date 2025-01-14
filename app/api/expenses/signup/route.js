import dbConnect from '@/app/lib/dbconnect';
import {User} from '@/app/models/user'; // Assuming User is defined in the same file as Expense
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Name, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email is already registered' },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json({
      success: true,
      message: 'User registered successfully',
      user: { id: user._id, name: user.name, email: user.email }, // Exclude password
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
