"use client";
import React, { useState, useEffect , use  } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const UpdateExpense = ({ params }) => {
  const { id } = use(params);
  const navigate = useRouter();
  const [formData, setFormData] = useState({ title: "", amount: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/expenses/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch expense data");
        }
        const data = await response.json();
        setFormData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update expense");
      } else {
        navigate.push('/pages/Home1');
      }
    } catch (err) {
      setError(err.message);
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
    <div className="w-full h-screen flex justify-center items-center">
    <div className='bg-white my-10 md:mx-20 px-4 py-10 rounded-2xl shadow-2xl w-full sm:w-96 mx-20'>
      <h1 className='text-center text-3xl font-bold uppercase'>Update Expense</h1>
      <form className='flex flex-col my-5 gap-5' onSubmit={handleUpdate}>
      <div className='flex flex-col gap-2'>
  <label htmlFor="title" className='text-xl uppercase font-bold'>Title:</label>
  <input
    className='peer border rounded-lg px-3'
    id='title'
    type="text"
    name="title"
    placeholder="Title"
    value={formData.title}
    onChange={handleInputChange}
    required
  />
  <p className='hidden peer-invalid:block text-red-500 text-sm'>
    Title is required.
  </p>
      </div>
      <div className='flex flex-col gap-2'>
          <label htmlFor="amount" className='text-xl uppercase font-bold'>Amount</label>
          <input
            className='peer border rounded-lg px-3'
            id='amount'
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
            required
          />
          <p className='hidden peer-invalid:block text-red-500 text-sm'>
            Amount is required.
          </p>
      </div>

        {/* <div className='flex flex-col gap-2'>
          <label htmlFor="amount" className='text-xl uppercase font-bold'>Amount</label>
          <input
            className='border rounded-lg px-3'
            id='amount'
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleInputChange}
          />
        </div> */}
        <div className='flex justify-around'>
          <Link href="/pages/Home1" className="bg-blue-500 px-2 py-1 rounded-xl text-white">Back</Link>
          <button type="submit" className="bg-green-500 px-2 py-1 rounded-xl text-white">Update Expense</button>
        </div>
      </form>
    </div>
    </div>
  );
};

export default UpdateExpense;
