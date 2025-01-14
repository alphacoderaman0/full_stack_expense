"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home1() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({ title: "", amount: "" });

  const fetchExpenses = async () => {
    const res = await fetch("/api/expenses/new");
    const data = await res.json();
    if (data.success) {
      // Sort expenses by date in descending order to show the latest one at the top
      const sortedExpenses = data.expenses.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      setExpenses(sortedExpenses);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  // Handle delete function
  const handleDelete = async (id) => {
    await fetch("/api/expenses/new", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchExpenses();
  };

  const handleLogout = async () => {
    try {
      // Call the logout API to clear the token cookie
      const res = await fetch("/api/expenses/logout", {
        method: "GET",
      });

      // Check if the response is okay and return a JSON object
      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Try to parse the response as JSON
      const data = await res.json();

      if (data?.message === "Logged out successfully") {
        // Redirect to login page after logout
        window.location.assign("/pages/Login");
      } else {
        alert(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out");
    }
  };

  return (
    <div className="max-w-6xl mx-5 pt-10 bg-white shadow-2xl rounded-2xl py-5 my-8 px-6 sm:px-10">
      {/* Title */}
      <h1 className="text-3xl font-bold uppercase text-center">Expense Tracker</h1>

      {/* Add Button */}
      <div className="flex justify-between flex-row-reverse py-4">
        <Link
          className="bg-green-500 px-6 py-3 rounded-xl text-white text-sm sm:text-base font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
          href={"/pages/AddExpense"}
        >
          ADD
        </Link>

        <button
          onClick={handleLogout}
          className="w-auto py-2 px-4 bg-red-500 hover:bg-red-700 rounded-md shadow-lg text-white font-semibold transition duration-200"
        >
          Logout
        </button>
      </div>

      {/* Expense Cards */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {expenses.map((expense) => (
            <div
              className="bg-slate-50 rounded-lg px-6 py-6 shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:scale-105"
              key={expense._id}
            >
              {/* Action Buttons */}
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={() => handleDelete(expense._id)}
                  className="p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <img src="/images/delete.png" alt="delete" className="w-6 sm:w-7" />
                </button>
                <Link
                  href={`/pages/UpdateExpense/${expense._id}`}
                  className="p-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  <img src="/images/edit.png" alt="edit" className="w-6 sm:w-7" />
                </Link>
              </div>

              {/* Expense Details */}
              <div className="space-y-2">
                <p className="text-sm sm:text-base">
                  <b>Title:</b> {expense.title}
                </p>
                <p className="text-sm sm:text-base">
                  <b>Amount:</b> 💲{expense.amount}
                </p>
                <p className="text-sm sm:text-base">
                  <b>Created at:</b> {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
