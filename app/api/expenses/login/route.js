// import dbConnect from '@/app/lib/dbconnect';
// import User from '@/app/models/expense'; // Assuming User is defined in the same file as Expense
// import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   try {
//     await dbConnect();

//     const { email, password } = await request.json();

//     // Validation
//     if (!email || !password) {
//       return NextResponse.json(
//         { success: false, message: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // Check if the user exists
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid email or password 1' },
//         { status: 401 }
//       );
//     }

//     // Verify the password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return NextResponse.json(
//         { success: false, message: 'Invalid email or password 2' },
//         { status: 401 }
//       );
//     }

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, email: user.email },
//       process.env.JWT_SECRET,
//       { expiresIn: '1h' }
//     );

//     return NextResponse.json({
//       success: true,
//       message: 'Login successful',
//       token, // Send the token to the client
//     });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: error.message }, { status: 500 });
//   }
// }


import dbConnect from '@/app/lib/dbconnect';
import {User} from '@/app/models/user'; // Assuming User is defined in the same file as Expense
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found for email:", email); // Debugging log
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Password mismatch for user:", email); // Debugging log
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      token, // Send the token to the client
    });
    response.cookies.set('token',token)
    return response
  } catch (error) {
    console.log("Error occurred during login:", error.message); // Debugging log
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
