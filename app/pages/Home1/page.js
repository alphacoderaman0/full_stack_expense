"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home1() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "" });

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses/new");
    const data = await res.json();
    if (data.success) setExpenses(data.expenses);
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  //handle delete function
  const handleDelete = async (id) => {
    await fetch("/api/expenses/new", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchExpenses();
  };
  return (
    <div className=" align-center justify-center pt-10 bg-white shadow-2xl rounded-2xl py-5 my-8 px-10">
      
      <h1 className="text-3xl font-bold uppercase text-center">
        Expense Tracker
      </h1>
      <div className="flex justify-end py-4"><Link className="bg-green-500 px-2 py-1 rounded-xl text-white" href={"pages/AddExpense"}>Add</Link></div>
        
        <table className="px-16">
          <thead className="border-b-2 border-black">
            <tr className="">
              <th className="px-10 justify-center">Title</th>
              <th className="px-10 justify-center">Amount</th>
              <th className="px-10 justify-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr className="text-center border-b-2 border-gray-400" key={expense._id}>
                <td className="py-4">{expense.title}</td>
                <td className="py-4">{expense.amount}</td>
                <td  className="flex gap-2 text-center py-4 ">
                  <button className="bg-red-500 px-2 py-1 rounded-xl text-white" onClick={()=>handleDelete(expense._id)}>Delete</button>
                  <h1>|</h1>
                  <Link className="bg-blue-500 px-2 py-1 rounded-xl text-white" href={`pages/UpdateExpense/${expense._id}`}>Update</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}
