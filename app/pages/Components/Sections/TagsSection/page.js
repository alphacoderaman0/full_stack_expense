'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  FaCheck,
  FaEdit,
  FaPalette,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaTags,
  FaTimes,
  FaTrash,
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const DEFAULT_COLOR = '#6366f1';
const ITEMS_PER_PAGE = 10;
const TAG_COLORS = [
  '#6366f1',
  '#14b8a6',
  '#f97316',
  '#ef4444',
  '#22c55e',
  '#0ea5e9',
  '#a855f7',
  '#eab308',
];

const getUserId = () => {
  try {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData)?._id : null;
  } catch {
    return null;
  }
};

const getTagId = (tag) => tag?._id || tag?.id;
const getColorValue = (color) => (/^#[0-9a-f]{6}$/i.test(color || '') ? color : DEFAULT_COLOR);

export default function TagsSection() {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({ name: '', color: DEFAULT_COLOR });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const userId = getUserId();

  const filteredTags = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return tags;
    return tags.filter((tag) => tag.name?.toLowerCase().includes(query));
  }, [search, tags]);

  const totalPages = Math.max(1, Math.ceil(filteredTags.length / ITEMS_PER_PAGE));
  const activePage = Math.min(currentPage, totalPages);
  const pageStart = filteredTags.length === 0 ? 0 : (activePage - 1) * ITEMS_PER_PAGE + 1;
  const pageEnd = Math.min(activePage * ITEMS_PER_PAGE, filteredTags.length);
  const paginatedTags = filteredTags.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  const getAllTags = async () => {
    if (!userId) {
      setMessage('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/expenses/getAllTags?userId=${userId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch tags');
      }

      setTags(data.data || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTags();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  const resetForm = () => {
    setFormData({ name: '', color: DEFAULT_COLOR });
    setEditId(null);
    setShowModal(false);
    setSaving(false);
  };

  const handleSave = async () => {
    const tagName = formData.name.trim();
    if (!tagName || !userId) return;

    try {
      setSaving(true);
      const res = await fetch(editId ? '/api/expenses/updateTags' : '/api/expenses/addTags', {
        method: editId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editId,
          userId,
          name: tagName,
          color: formData.color || DEFAULT_COLOR,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to save tag');
      }

      if (editId) {
        setTags((prev) => prev.map((tag) => (getTagId(tag) === editId ? data.data : tag)));
      } else {
        setTags((prev) => [data.data, ...prev]);
      }

      resetForm();
      setMessage('');
    } catch (error) {
      setMessage(error.message);
      setSaving(false);
    }
  };

  const handleEdit = (tag) => {
    setFormData({
      name: tag.name || '',
      color: getColorValue(tag.color),
    });
    setEditId(getTagId(tag));
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!userId || !window.confirm('Delete this tag?')) return;

    try {
      const res = await fetch('/api/expenses/deleteTags', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, userId }),
      });
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to delete tag');
      }

      setTags((prev) => prev.filter((tag) => getTagId(tag) !== id));
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="relative w-full min-h-[75vh] pb-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-indigo-700">
            <FaTags className="text-indigo-600" />
            Expense Tags
          </h2>
          <p className="text-sm text-gray-500 mt-1">{tags.length} total tags</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg"
        >
          <FaPlus /> Add Tag
        </button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 mb-6">
        <div className="flex items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg md:w-1/2 border border-violet-300">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search tags..."
            className="bg-transparent w-full outline-none text-gray-700"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between md:justify-end gap-3 text-sm text-gray-600">
          <span className="px-3 py-2 rounded-lg bg-white/40 border border-white/30">
            Showing {pageStart}-{pageEnd} of {filteredTags.length}
          </span>
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
              <th className="px-4 py-3 text-left">Tag</th>
              <th className="px-4 py-3 text-left">Color</th>
              <th className="px-4 py-3 text-left hidden md:table-cell">Created</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="4" className="py-8 text-center text-indigo-600">
                  <FaSpinner className="inline animate-spin mr-2" />
                  Loading tags...
                </td>
              </tr>
            )}

            {!loading && paginatedTags.map((tag) => (
              <tr key={getTagId(tag)} className="hover:bg-indigo-50 transition">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span
                      className="h-4 w-4 rounded-full border border-white shadow"
                      style={{ backgroundColor: tag.color || DEFAULT_COLOR }}
                    />
                    <span className="font-medium text-gray-800">{tag.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-white/50 px-3 py-1 text-gray-700 border border-white/40">
                    <FaPalette className="text-gray-500" />
                    {tag.color || DEFAULT_COLOR}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                  {tag.created_at ? new Date(tag.created_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleEdit(tag)}
                      className="text-indigo-600 hover:text-indigo-800 transition"
                      title="Edit tag"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(getTagId(tag))}
                      className="text-red-500 hover:text-red-700 transition"
                      title="Delete tag"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!loading && filteredTags.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-500">
                  No tags found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
          disabled={loading || activePage === 1}
          className="px-4 py-1 rounded-lg bg-white/40 hover:bg-white/70 text-sm disabled:opacity-30"
        >
          Prev
        </button>
        <span className="text-sm text-gray-600">Page {activePage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
          disabled={loading || activePage === totalPages}
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
              className="bg-white rounded-3xl shadow-2xl p-6 w-[90%] max-w-lg"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl font-semibold text-indigo-700">
                  {editId ? 'Edit Tag' : 'Add New Tag'}
                </h3>
                <button onClick={resetForm} className="text-gray-400 hover:text-gray-700">
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-5">
                <input
                  type="text"
                  placeholder="Tag name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:border-indigo-500"
                />

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      className="h-10 w-14 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
                    />
                    <span className="text-sm font-medium text-gray-700">{formData.color}</span>
                  </div>

                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {TAG_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, color })}
                        className={`h-9 rounded-lg border-2 transition ${
                          formData.color === color ? 'border-gray-900 scale-105' : 'border-white'
                        }`}
                        style={{ backgroundColor: color }}
                        title={color}
                      >
                        {formData.color === color && <FaCheck className="mx-auto text-white drop-shadow" />}
                      </button>
                    ))}
                  </div>
                </div>
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
                  disabled={saving || !formData.name.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <FaSpinner className="animate-spin" />}
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
