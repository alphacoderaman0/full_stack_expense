'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaPlus, FaSearch, FaSpinner, FaTag, FaTrash } from 'react-icons/fa';
import Cookies from "js-cookie";

const ITEMS_PER_PAGE = 10;

const getUserId = () => {
  try {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData)?._id : null;
  } catch {
    return null;
  }
};

const getItemId = (item) => {
  if (!item) return "";
  if (typeof item === 'object') return String(item._id || item.id || "");
  return String(item);
};

const getIds = (items = []) => items.map(getItemId).filter(Boolean);

export default function ExpensesSection() {
  const UserId = getUserId();
  const [expenses, setExpenses] = useState([]);
  const [tags, setTags] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRange, setFilterRange] = useState('All');
  const [selectedTagId, setSelectedTagId] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, limit: ITEMS_PER_PAGE });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', description: '', tagIds: [] });
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingTags, setLoadingTags] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState('');

  const totalPages = Math.max(1, pagination.pages || 1);
  const currentData = filtered;

  const getAllExpenses = async () => {
    if (!UserId) {
      setMessage('User not found. Please login again.');
      return;
    }

    try {
      setLoadingExpenses(true);
      const res = await fetch(`/api/expenses/get?userId=${UserId}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch expenses');
      }

      setExpenses(data.data || []);
      setPagination(data.pagination || { total: 0, page: currentPage, pages: 1, limit: ITEMS_PER_PAGE });
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const getAllTags = async () => {
    if (!UserId) return;

    try {
      setLoadingTags(true);
      const res = await fetch(`/api/expenses/getAllTags?userId=${UserId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch tags');
      }

      setTags(data.data || []);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoadingTags(false);
    }
  };

  useEffect(() => {
    getAllExpenses();
  }, [currentPage]);

  useEffect(() => {
    getAllTags();
  }, []);

  useEffect(() => {
    let result = [...expenses];

    if (search) {
      result = result.filter((expense) => expense.title?.toLowerCase().includes(search.toLowerCase()));
    }

    if (filterRange === 'Low') result = result.filter((expense) => Number(expense.amount) <= 1000);
    else if (filterRange === 'Mid') result = result.filter((expense) => Number(expense.amount) > 1000 && Number(expense.amount) <= 3000);
    else if (filterRange === 'High') result = result.filter((expense) => Number(expense.amount) > 3000);

    if (selectedTagId !== 'All') {
      result = result.filter((expense) => {
        const expenseTagIds = getIds(expense.tagIds?.length ? expense.tagIds : expense.tags);
        return expenseTagIds.includes(selectedTagId);
      });
    }

    setFiltered(result);
  }, [search, filterRange, selectedTagId, expenses]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterRange, selectedTagId]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    if (selectedTagId !== 'All' && !tags.some((tag) => getItemId(tag) === selectedTagId)) {
      setSelectedTagId('All');
    }
  }, [selectedTagId, tags]);

  const resetForm = () => {
    setFormData({ title: '', amount: '', description: '', tagIds: [] });
    setEditId(null);
    setShowModal(false);
  };

  const toggleTag = (tagId) => {
    setFormData((prev) => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter((id) => id !== tagId)
        : [...prev.tagIds, tagId],
    }));
  };

  const getExpenseTags = (expense) => {
    if (Array.isArray(expense.tags) && expense.tags.length) return expense.tags;

    const expenseTagIds = getIds(expense.tagIds);
    return tags.filter((tag) => expenseTagIds.includes(getItemId(tag)));
  };

  const handleSave = async () => {
    if (!formData.title || !formData.amount || !UserId || saving) return;

    try {
      setSaving(true);
      const res = await fetch(editId ? '/api/expenses/edit' : '/api/expenses/add', {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tagIds: formData.tagIds,
          id: editId,
          userId: UserId,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save expense');
      }

      await getAllExpenses();
      resetForm();
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      title: expense.title || '',
      amount: expense.amount || '',
      description: expense.description || '',
      tagIds: getIds(expense.tagIds?.length ? expense.tagIds : expense.tags),
    });
    setEditId(expense._id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!UserId || deletingId) return;

    try {
      setDeletingId(id);
      const res = await fetch('/api/expenses/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userId: UserId }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete expense');
      }

      setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="relative w-full min-h-[75vh] pb-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-2xl font-bold text-indigo-700">My Expenses</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg"
        >
          <FaPlus /> Add Expense
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6">
        <div className="flex items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg lg:w-1/2 border border-violet-300">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search expenses..."
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
            className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value="All">All Amounts</option>
            <option value="Low">₹0 - ₹1000</option>
            <option value="Mid">₹1000 - ₹3000</option>
            <option value="High">Above ₹3000</option>
          </select>

          <select
            value={selectedTagId}
            onChange={(e) => setSelectedTagId(e.target.value)}
            disabled={loadingTags}
            className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-300 disabled:opacity-50"
          >
            <option value="All">{loadingTags ? 'Loading tags...' : 'All Tags'}</option>
            {tags.map((tag) => (
              <option key={getItemId(tag)} value={getItemId(tag)}>
                {tag.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="overflow-auto rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md">
        <table className="w-full table-auto text-sm md:text-md">
          <thead className="bg-indigo-100 text-indigo-800">
            <tr>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Description</th>
              <th className="px-4 py-2">Tags</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loadingExpenses && (
              <tr>
                <td colSpan="5" className="py-8 text-center text-indigo-600">
                  <FaSpinner className="inline animate-spin mr-2" />
                  Loading expenses...
                </td>
              </tr>
            )}

            {!loadingExpenses && currentData.reverse().map((expense) => {
              const expenseTags = getExpenseTags(expense);

              return (
                <tr key={expense._id} className="hover:bg-indigo-50 transition">
                  <td className="px-4 py-2 text-center">{(expense.title)}</td>
                  <td className="px-4 py-2 text-center">₹ {expense.amount}</td>
                  <td className="px-4 py-2 text-center">{expense.description}</td>
                  <td className="px-4 py-2">
                    <div className="flex flex-wrap justify-center gap-2">
                      {expenseTags.length > 0 ? expenseTags.map((tag) => (
                        <span
                          key={getItemId(tag)}
                          className="inline-flex items-center gap-2 rounded-lg bg-white/50 px-2 py-1 text-xs font-medium text-gray-700 border border-white/40"
                        >
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: tag.color || '#6366f1' }}
                          />
                          {tag.name}
                        </span>
                      )) : (
                        <span className="text-xs text-gray-400">No tags</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-3 justify-center">
                      <button onClick={() => handleEdit(expense)} className="text-indigo-600 hover:text-indigo-800">
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(expense._id)}
                        disabled={deletingId === expense._id}
                        className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      >
                        {deletingId === expense._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!loadingExpenses && currentData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">No expenses found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={loadingExpenses || currentPage === 1}
          className="px-4 py-1 rounded-lg bg-white/40 hover:bg-white/70 text-sm disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={loadingExpenses || currentPage === totalPages}
          className="px-4 py-1 rounded-lg bg-white/40 hover:bg-white/70 text-sm disabled:opacity-30"
        >
          Next
        </button>
      </div>

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
              className="bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-xl"
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

                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <FaTag className="text-indigo-600" />
                    Tags
                  </div>
                  <div className="min-h-12 rounded-xl border border-gray-300 p-3">
                    {loadingTags && (
                      <div className="py-2 text-sm text-indigo-600">
                        <FaSpinner className="inline animate-spin mr-2" />
                        Loading tags...
                      </div>
                    )}

                    {!loadingTags && tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                          const tagId = getItemId(tag);
                          const selected = formData.tagIds.includes(tagId);

                          return (
                            <button
                              key={tagId}
                              type="button"
                              onClick={() => toggleTag(tagId)}
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm border transition ${
                                selected
                                  ? 'bg-indigo-600 text-white border-indigo-600'
                                  : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                              }`}
                            >
                              <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: tag.color || '#6366f1' }}
                              />
                              {tag.name}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {!loadingTags && tags.length === 0 && (
                      <p className="py-2 text-sm text-gray-500">No tags available.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={resetForm}
                  disabled={saving}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-xl disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.title || !formData.amount}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <FaSpinner className="animate-spin" />}
                  {saving ? (editId ? 'Updating...' : 'Saving...') : editId ? 'Update' : 'Add'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
