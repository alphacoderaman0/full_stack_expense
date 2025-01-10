import dbConnect from '@/app/lib/dbconnect';
import Expense from '@/app/models/expense';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    await dbConnect();

    const body = await request.json();
    const expense = await Expense.create(body);

    return NextResponse.json({ success: true, expense });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const expenses = await Expense.find({});
    return NextResponse.json({ success: true, expenses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request,params) {
    try {
      await dbConnect();
      const { id } = await request.json();
      // const  id  =  params;
      await Expense.findByIdAndDelete(id);
      // await Expense.findByIdAndDelete({ _id: new ObjectId(id) });
      return NextResponse.json({ message: "Expense deleted" }, { status: 200 });
  } catch (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
  }
}


// export async function PUT(request,{params}) {
//   try {
//       await dbConnect();
//       const{id}= params.id;
//       const {title, amount } = await request.json();
//       console.log({ id, title, amount });
      
//       const updatedExpense = await Expense.findByIdAndUpdate(
//           id,
//           { title, amount },
//           { new: true }
//       );
//       return NextResponse.json(updatedExpense, { status: 200 });
//   } catch (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
