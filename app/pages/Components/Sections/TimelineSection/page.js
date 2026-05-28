'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FaClock,
  FaEdit,
  FaFilter,
  FaPlus,
  FaSearch,
  FaSpinner,
  FaSyncAlt,
  FaTrash,
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const FALLBACK_USER_ID = '687389580ed404a9990cdbc6';

const getUserId = () => {
  try {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData)?._id : FALLBACK_USER_ID;
  } catch {
    return FALLBACK_USER_ID;
  }
};

const actionStyles = {
  created: {
    icon: FaPlus,
    label: 'Created',
    dot: 'bg-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
  },
  updated: {
    icon: FaEdit,
    label: 'Updated',
    dot: 'bg-indigo-500',
    text: 'text-indigo-700',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
  },
  deleted: {
    icon: FaTrash,
    label: 'Deleted',
    dot: 'bg-red-500',
    text: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

const formatDateTime = (dateValue) => {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleString('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

const formatAmount = (amount) => `Rs.${Number(amount || 0).toLocaleString('en-IN')}`;

export default function TimelineSection() {
  const userId = getUserId();
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('All');
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const filteredHistory = useMemo(() => {
    let result = [...history];
    const query = search.trim().toLowerCase();

    if (query) {
      result = result.filter((item) => (
        item.title?.toLowerCase().includes(query)
        || item.description?.toLowerCase().includes(query)
        || item.action?.toLowerCase().includes(query)
      ));
    }

    if (actionFilter !== 'All') {
      result = result.filter((item) => item.action === actionFilter);
    }

    return result;
  }, [actionFilter, history, search]);

  const getHistory = async () => {
    if (!userId) {
      setMessage('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/expenses/history?userId=${userId}&limit=${limit}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch timeline');
      }

      setHistory(data.data || []);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getHistory();
  }, [limit]);

  return (
    <div className="relative w-full min-h-[75vh] pb-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h2 className="flex items-center gap-3 text-2xl font-bold text-indigo-700">
            <FaClock className="text-indigo-600" />
            Expense Timeline
          </h2>
          <p className="text-sm text-gray-500 mt-1">{filteredHistory.length} activities</p>
        </div>

        <button
          onClick={getHistory}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          Refresh
        </button>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 mb-6">
        <div className="flex items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg lg:w-1/2 border border-violet-300">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search timeline..."
            className="bg-transparent w-full outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center bg-white/40 backdrop-blur-md px-3 py-2 rounded-lg border border-gray-300">
            <FaFilter className="text-gray-500 mr-2" />
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="bg-transparent outline-none"
            >
              <option value="All">All Actions</option>
              <option value="created">Created</option>
              <option value="updated">Updated</option>
              <option value="deleted">Deleted</option>
            </select>
          </div>

          <select
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-lg border border-gray-300"
          >
            <option value={10}>Latest 10</option>
            <option value={20}>Latest 20</option>
            <option value={50}>Latest 50</option>
          </select>
        </div>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      <div className="relative rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md p-4 sm:p-6">
        {loading && (
          <div className="py-10 text-center text-indigo-600">
            <FaSpinner className="inline animate-spin mr-2" />
            Loading timeline...
          </div>
        )}

        {!loading && filteredHistory.length === 0 && (
          <div className="py-10 text-center text-gray-500">No timeline records found.</div>
        )}

        {!loading && filteredHistory.length > 0 && (
          <div className="relative">
            <div className="absolute left-4 top-0 h-full w-px bg-indigo-100" />

            <div className="space-y-4">
              {filteredHistory.map((item) => {
                const style = actionStyles[item.action] || actionStyles.updated;
                const Icon = style.icon;
                const previous = item.previousData || {};

                return (
                  <div key={item._id} className="relative pl-12">
                    <div className={`absolute left-0 top-4 h-8 w-8 rounded-full ${style.dot} text-white flex items-center justify-center shadow`}>
                      <Icon size={14} />
                    </div>

                    <div className="rounded-xl border border-white/40 bg-white/60 p-4 shadow-sm">
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`inline-flex items-center rounded-lg px-2 py-1 text-xs font-semibold ${style.bg} ${style.text} border ${style.border}`}>
                              {style.label}
                            </span>
                            <h3 className="font-semibold text-gray-800">{item.title}</h3>
                          </div>
                          <p className="text-sm text-gray-500 mt-1">{formatDateTime(item.createdAt)}</p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-lg font-bold text-indigo-700">{formatAmount(item.amount)}</p>
                          {item.action === 'updated' && previous.amount !== undefined && previous.amount !== item.amount && (
                            <p className="text-xs text-gray-500">was {formatAmount(previous.amount)}</p>
                          )}
                        </div>
                      </div>

                      {item.description && (
                        <p className="mt-3 text-sm text-gray-600">{item.description}</p>
                      )}

                      {item.action === 'updated' && (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                          {previous.title && previous.title !== item.title && (
                            <div className="rounded-lg bg-white/60 border border-white/40 p-2">
                              <span className="text-gray-500">Title: </span>
                              <span className="text-gray-700">{previous.title}</span>
                            </div>
                          )}
                          {previous.description && previous.description !== item.description && (
                            <div className="rounded-lg bg-white/60 border border-white/40 p-2">
                              <span className="text-gray-500">Description: </span>
                              <span className="text-gray-700">{previous.description}</span>
                            </div>
                          )}
                          {previous.amount !== undefined && previous.amount !== item.amount && (
                            <div className="rounded-lg bg-white/60 border border-white/40 p-2">
                              <span className="text-gray-500">Amount: </span>
                              <span className="text-gray-700">{formatAmount(previous.amount)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
