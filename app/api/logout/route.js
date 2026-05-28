// /pages/api/logout.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  // Clear the token cookie or perform any logout-related logic
  const res = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });

  // You can clear cookies like this:
  res.cookies.delete('token');

  return res;
}
