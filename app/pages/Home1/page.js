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
    <div className="max-w-6xl mx-5 pt-10 bg-white shadow-2xl rounded-2xl py-5 my-8 px-6 sm:px-10">
    {/* Title */}
    <h1 className="text-3xl font-bold uppercase text-center">Expense Tracker</h1>
  
    {/* Add Button */}
    <div className="flex justify-end py-4">
      <Link
        className="bg-green-500 px-4 py-2 rounded-xl text-white text-sm sm:text-base hover:bg-green-600 transition"
        href={"pages/AddExpense"}
      >
        Add
      </Link>
    </div>
  
    {/* Expense Cards */}
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {expenses.map((expense) => (
          <div
            className="bg-slate-50 rounded-lg px-5 py-5 shadow-md hover:shadow-lg transition"
            key={expense._id}
          >
            {/* Action Buttons */}
            <div className="flex justify-between items-center mb-4">
              <button onClick={() => handleDelete(expense._id)}>
                <img src="images/delete.png" alt="delete" className="w-6 sm:w-7" />
              </button>
              <Link href={`pages/UpdateExpense/${expense._id}`}>
                <img src="images/edit.png" alt="edit" className="w-6 sm:w-7" />
              </Link>
            </div>
  
            {/* Expense Details */}
            <p className="text-sm sm:text-base">
              <b>Date:</b> {new Date(expense.date).toLocaleDateString()}
            </p>
            <p className="text-sm sm:text-base">
              <b>Title:</b> {expense.title}
            </p>
            <p className="text-sm sm:text-base">
              <b>Amount:</b> 💲{expense.amount}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
}
