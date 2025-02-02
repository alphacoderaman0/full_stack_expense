"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Home1() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchExpenses = async () => {
    try {
      const userId = localStorage.getItem("userId");
      console.log(userId);
      if (!userId) return;
  
      console.log("Fetching expenses for user:", userId);
  
      const res = await fetch(`/api/expenses/new?userId=${userId}`, { method: "GET" });
      const data = await res.json();
  
      if (data.success) {
        const sortedExpenses = data.expenses;
        setExpenses(sortedExpenses);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchExpenses();
  }, []);
  
  
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
  if (loading) return (
  <div className="absolute right-1/2 bottom-1/2 transform translate-x-1/2 translate-y-1/2">
  <div className="p-4 bg-gradient-to-tr animate-spin from-green-500 to-blue-500 via-purple-500 rounded-full">
      <div className="bg-white rounded-full">
          <div className="w-24 h-24 rounded-full"></div>
      </div>
  </div>
  </div>
  );
  if (error) return(
    <div className="w-full h-screen flex justify-center items-center sm:mx-20">
    <div className="max-w-md mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4 rounded-lg shadow-md">
  <div className="flex items-center">
    <svg className="w-10 h-10 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 12h2m-1-1v2m-7 9h18a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
    <p className="text-3xl font-medium">
      Error: {error}
    </p>
  </div>
    </div>
    </div>
  );

  return (
    <div className="px-4 flex justify-center w-full items-center my-10">
      {/* Main Div Starts */}
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
                    <b>Amount:</b><b className="text-lg"> ₹</b> {expense.amount}
                  </p>
                  <p className="text-sm sm:text-base">
                    <b>Created at:</b> {new Date(expense.created_at).toLocaleString()}
                  </p>
                  <p className="text-sm sm:text-base">
                    <b>Last Updated:</b> {new Date(expense.updated_at).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Main Div Ends */}
    </div>
  );
}
