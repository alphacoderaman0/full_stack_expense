"use client"
import React from 'react'
import { useState , use ,useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
const UpdateExpense = ({params}) => {
  const {id} = use(params);   
  const navigate = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
  });

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
        setFormData(data); // Populate the form with the fetched data
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update expense");
      }
      else{
        
        navigate.push('/pages/Home1')
        // alert("Expense updated <su></su>ccessfully!");
      }
      const updatedData = await response.json();

    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;



  return (
    <div className='bg-white my-10 px-4 py-10 rounded-2xl shadow-2xl'>
    <h1 className='text-center text-3xl font-bold uppercase'>Update Expense</h1>
    <form className='flex flex-col my-5 gap-5' onSubmit={handleUpdate}>
      <div className='flex flex-col gap-2'>
        <label htmlFor="title" className='text-xl uppercase font-bold'>Title:</label>
      <input
        className='border rounded-lg px-3'
        id='title'
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        // onChange={(e) => setForm({ ...form, title: e.target.value })}
        onChange={handleInputChange}
      />
      </div>
      <div className='flex flex-col gap-2'>
        <label htmlFor="amount" className='text-xl uppercase font-bold'>Amount</label>
        <input
        className='border rounded-lg px-3'
        id='amount'
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleInputChange}
        // onChange={(e) => setForm({ ...form, amount: e.target.value })}
      />
      </div>
      
      <div className='flex justify-around'>
      <Link href={"/pages/Home1"} className="bg-blue-500 px-2 py-1 rounded-xl text-white">Back</Link>
      <button type="submit" className="bg-green-500 px-2 py-1 rounded-xl text-white">Update Expense</button>
      </div>
    </form>
  </div>
  )
}

export default UpdateExpense;