'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSearch } from 'react-icons/fa';
import Cookies from "js-cookie";

const ITEMS_PER_PAGE = 10;

export default function ExpensesSection() {
  const [expenses, setExpenses] = useState([]);
  const UserId = Cookies.get('userData') ? JSON.parse(Cookies.get('userData'))._id : null;
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRange, setFilterRange] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', description: ''});
  const getAllExpenses = async () => {
    try {
      const res = await fetch(`/api/expenses/get?userId=${UserId}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();
      if (data.success) {
        setExpenses(data.data);
      } else {
        console.error("Failed to fetch expenses:", data.message);
      }
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };
  useEffect(() => {
    getAllExpenses();
  }, [currentPage]);
  useEffect(() => {
    let result = [...expenses];
    if (search) {
      result = result.filter(e => e.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (filterRange === 'Low') result = result.filter(e => e.amount <= 1000);
    else if (filterRange === 'Mid') result = result.filter(e => e.amount > 1000 && e.amount <= 3000);
    else if (filterRange === 'High') result = result.filter(e => e.amount > 3000);

    setFiltered(result);
    setCurrentPage(1);
  }, [search, filterRange, expenses]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const currentData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSave = async () => {
    if (!formData.title || !formData.amount) return;
    if (editId) {
      await fetch('/api/expenses/edit', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, id: editId,userId: UserId }),
      });
      setExpenses(prev => prev.map(e => (e.id === editId ? { ...e, ...formData } : e)));
    } else {
      await fetch('/api/expenses/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, userId: UserId }),
      });
      setExpenses(prev => [...prev, { ...formData, id: Date.now(), userId: UserId }]);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({ title: '', amount: '', description: '' });
    setEditId(null);
    setShowModal(false);
  };

  const handleEdit = (expense) => {
    setFormData(expense);
    setEditId(expense._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await fetch('/api/expenses/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',      },
      body: JSON.stringify({ id, userId: UserId }),
    });
    setExpenses(prev => prev.filter(e => e._id !== id));
  };

  return (
    <div className="relative w-full min-h-[75vh] pb-0 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-indigo-700">💸 My Expenses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg"
        >
          <FaPlus /> Add Expense
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg md:w-1/2 border border-violet-300">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-300"
        >
          <option value="All">All</option>
          <option value="Low">₹0 - ₹1000</option>
          <option value="Mid">₹1000 - ₹3000</option>
          <option value="High">Above ₹3000</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-auto rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md">
        <table className="w-full table-auto text-sm md:text-md">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentData.reverse().map((expense) => (
              <tr key={expense._id} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-2 text-center">{expense.title}</td>
                <td className="px-4 py-2 text-center">₹{expense.amount}</td>
                <td className="px-4 py-2 text-center">{expense.description}</td>
                <td className="px-4 py-2 flex gap-3 justify-center">
                  <button onClick={() => handleEdit(expense)} className="text-indigo-600 hover:text-indigo-800">
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(expense._id)} className="text-red-500 hover:text-red-700">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr><td colSpan="4" className="text-center py-6 text-gray-500">No expenses found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="px-4 py-1 rounded-lg bg-white/40 hover:bg-white/70 text-sm disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="px-4 py-1 rounded-lg bg-white/40 hover:bg-white/70 text-sm disabled:opacity-30"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center backdrop-blur-sm"
            onClick={resetForm}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-indigo-700">
                {editId ? 'Edit Expense' : 'Add New Expense'}
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                />
                <textarea
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetForm}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl"
                >
                  {editId ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
