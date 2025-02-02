"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import Link from 'next/link';

const AddExpense = () => {
  const [form, setForm] = useState({ title: '', amount: '' });
  const [errors, setErrors] = useState({ title: '', amount: '' });
  const navigate = useRouter();
  const validateForm = () => {
    const newErrors = { title: '', amount: '' };
    let isValid = true;

    if (!form.title) {
      newErrors.title = 'Title is required';
      isValid = false;
    }
    if (!form.amount) {
      newErrors.amount = 'Amount is required';
      isValid = false;
    } else if (isNaN(form.amount) || form.amount <= 0) {
      newErrors.amount = 'Please enter a valid amount';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };
  const addExpense = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert("User not found. Please login again.");
      return;
    }
    const res = await fetch('/api/expenses/new', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({...form , userId}),
    });

    const data = await res.json();
    if (data.success) {
      setForm({ title: '', amount: '' });
      navigate.push('/pages/Home1');
    }
  else {
    alert("Failed to add expense: " + data.message);
  }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
    <div className='bg-white my-10 md:mx-20 px-4 py-10 rounded-2xl shadow-2xl w-full sm:w-96 mx-20'>
      <h1 className='text-center text-3xl font-bold uppercase'>Add Expense</h1>
      <form className='flex flex-col my-5 gap-5' onSubmit={addExpense}>
        <div className='flex flex-col gap-2'>
          <label htmlFor="title" className='text-xl uppercase font-bold'>Title:</label>
          <input
            className={`border rounded-lg px-3 ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
            id='title'
            type="text"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <p className='text-red-500 text-sm'>{errors.title}</p>}
        </div>
        <div className='flex flex-col gap-2'>
          <label htmlFor="amount" className='text-xl uppercase font-bold'>Amount</label>
          <input
            className={`border rounded-lg px-3 ${errors.amount ? 'border-red-500' : 'border-gray-300'}`}
            id='amount'
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          {errors.amount && <p className='text-red-500 text-sm'>{errors.amount}</p>}
        </div>
        <div className='flex justify-around'>
          <Link href="/pages/Home1" className="bg-blue-500 px-2 py-1 rounded-xl text-white">Back</Link>
          <button
            type="submit"
            className="bg-green-500 px-2 py-1 rounded-xl text-white transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default AddExpense;
