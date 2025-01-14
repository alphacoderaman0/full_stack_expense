import { NextResponse } from 'next/server';

const protectedRoutes = ['/pages/Home1', '/pages/AddExpense', '/pages/UpdateExpense' ,'/api/expenses/new'];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;

  // Protect pages and API routes
  if (protectedRoutes.includes(pathname)) {
    if (!token) {
      const loginUrl = new URL('/pages/Login', req.url);  // Redirect to login page if not authenticated
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();  // Continue to the requested page if authenticated
  }

  // Handle API route protection for expenses
  if (pathname.startsWith('/api')) {
    if (!token) {
      // If the token is missing, return a 401 Unauthorized response
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }
    return NextResponse.next();  // Continue to the API route if authenticated
  }

  // If the user is already logged in and trying to access Login or Signup, redirect to Home
  if (pathname === '/pages/Login' || pathname === '/pages/Signup') {
    if (token) {
    //   const dashboardUrl = new URL('/pages/Home1', req.url);  // Redirect to Home if logged in
      const HomeUrl = new URL('/pages/Home1', req.url);  // Redirect to Home if logged in
      const AddUrl = new URL('/pages/AddExpense', req.url);  // Redirect to Home if logged in
      const UpdateUrl = new URL('/pages/UpdateExpense', req.url);  // Redirect to Home if logged in
      const apiUrl = new URL('/api/expenses/new', req.url);  // Redirect to Home if logged in
      return NextResponse.redirect(HomeUrl,AddUrl,UpdateUrl ,apiUrl );
    //   return NextResponse.redirect(dashboardUrl);
    }
    return NextResponse.next();  // Continue to the Login or Signup page if not logged in
  }

  return NextResponse.next();  // Allow all other routes to continue
}

// Pages and API routes where this middleware will apply
export const config = {
  matcher: [
    '/pages/Home1', 
    '/pages/AddExpense', 
    '/pages/UpdateExpense', 
    '/pages/Login', 
    '/pages/Signup', 
    '/api/expenses/new'  // Direct match for /api/expenses, or list other API routes if needed
  ],
};
