'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  FaArrowDown,
  FaArrowUp,
  FaChartLine,
  FaClock,
  FaEdit,
  FaPlus,
  FaReceipt,
  FaSpinner,
  FaSyncAlt,
  FaTags,
  FaTrash,
  FaWallet,
} from 'react-icons/fa';
import Cookies from 'js-cookie';

const getUserId = () => {
  try {
    const userData = Cookies.get('userData');
    return userData ? JSON.parse(userData)?._id : null;
  } catch {
    return null;
  }
};

const formatCurrency = (amount) => `Rs.${Number(amount || 0).toLocaleString('en-IN')}`;

const formatDate = (dateValue) => {
  if (!dateValue) return '-';

  return new Date(dateValue).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });
};

const actionMeta = {
  created: { label: 'Created', icon: FaPlus, color: 'text-emerald-700', bg: 'bg-emerald-50' },
  updated: { label: 'Updated', icon: FaEdit, color: 'text-indigo-700', bg: 'bg-indigo-50' },
  deleted: { label: 'Deleted', icon: FaTrash, color: 'text-red-700', bg: 'bg-red-50' },
};

export default function DashboardSection() {
  const [userId, setUserId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const summary = dashboard?.summary || {};
  const monthlySeries = dashboard?.monthlySeries || [];
  const topTags = dashboard?.topTags || [];
  const recentExpenses = dashboard?.recentExpenses || [];
  const recentActivity = dashboard?.recentActivity || [];

  const maxMonthTotal = useMemo(
    () => Math.max(...monthlySeries.map((item) => Number(item.total || 0)), 1),
    [monthlySeries]
  );

  const stats = [
    {
      label: 'Total Spent',
      value: formatCurrency(summary.totalSpent),
      icon: FaWallet,
      accent: 'text-indigo-700',
      bg: 'bg-indigo-50',
    },
    {
      label: 'This Month',
      value: formatCurrency(summary.thisMonthSpent),
      icon: FaChartLine,
      accent: summary.monthTrend >= 0 ? 'text-emerald-700' : 'text-red-700',
      bg: summary.monthTrend >= 0 ? 'bg-emerald-50' : 'bg-red-50',
      hint: `${Math.abs(Number(summary.monthTrend || 0)).toFixed(1)}% vs last month`,
      trendUp: summary.monthTrend >= 0,
    },
    {
      label: 'Expenses',
      value: summary.totalExpenses || 0,
      icon: FaReceipt,
      accent: 'text-amber-700',
      bg: 'bg-amber-50',
      hint: `Avg ${formatCurrency(summary.averageExpense)}`,
    },
    {
      label: 'Tags',
      value: summary.tagCount || 0,
      icon: FaTags,
      accent: 'text-cyan-700',
      bg: 'bg-cyan-50',
      hint: 'Active categories',
    },
  ];

  const fetchDashboard = async (activeUserId = userId) => {
    if (!activeUserId) {
      setMessage('User not found. Please login again.');
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/expenses/dashboard?userId=${activeUserId}`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to fetch dashboard');
      }

      setDashboard(data.data);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialUserId = getUserId();
    if (initialUserId) {
      setUserId(initialUserId);
      return undefined;
    }

    const timer = setInterval(() => {
      const id = getUserId();
      if (id) {
        setUserId(id);
        clearInterval(timer);
      }
    }, 300);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (userId) fetchDashboard(userId);
  }, [userId]);

  return (
    <div className="relative w-full min-h-[75vh] pb-0 overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-indigo-700">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Your expense snapshot and recent activity</p>
        </div>

        <button
          onClick={() => fetchDashboard()}
          disabled={loading || !userId}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-indigo-700 transition shadow-lg disabled:opacity-50"
        >
          {loading ? <FaSpinner className="animate-spin" /> : <FaSyncAlt />}
          Refresh
        </button>
      </div>

      {message && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </div>
      )}

      {loading && !dashboard ? (
        <div className="rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md py-14 text-center text-indigo-600">
          <FaSpinner className="inline animate-spin mr-2" />
          Loading dashboard...
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div key={stat.label} className="rounded-xl border border-white/30 bg-white/40 backdrop-blur-md p-5 shadow-lg">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-gray-500">{stat.label}</p>
                      <p className="mt-2 text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl ${stat.bg} ${stat.accent} flex items-center justify-center`}>
                      <Icon />
                    </div>
                  </div>
                  {stat.hint && (
                    <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                      {stat.trendUp !== undefined && (
                        stat.trendUp ? <FaArrowUp className="text-emerald-600" /> : <FaArrowDown className="text-red-600" />
                      )}
                      {stat.hint}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md p-5">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-semibold text-gray-800">Monthly Spend</h3>
                <span className="text-xs text-gray-500">Last 6 months</span>
              </div>

              <div className="grid grid-cols-6 gap-3 items-end min-h-56">
                {monthlySeries.map((item) => {
                  const height = Math.max(12, (Number(item.total || 0) / maxMonthTotal) * 100);

                  return (
                    <div key={item.key} className="flex flex-col items-center gap-2">
                      <div className="flex h-40 w-full items-end">
                        <div
                          className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-cyan-400 shadow-sm"
                          style={{ height: `${height}%` }}
                          title={formatCurrency(item.total)}
                        />
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-700">{item.label}</p>
                        <p className="text-[11px] text-gray-500">{formatCurrency(item.total)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Tags</h3>
                <FaTags className="text-cyan-600" />
              </div>

              <div className="space-y-3">
                {topTags.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No tag spend yet.</p>
                )}

                {topTags.map((tag) => {
                  const width = summary.totalSpent ? Math.max(8, (Number(tag.total || 0) / summary.totalSpent) * 100) : 8;

                  return (
                    <div key={tag.id} className="rounded-lg border border-white/40 bg-white/50 p-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="h-3 w-3 rounded-full" style={{ backgroundColor: tag.color || '#6366f1' }} />
                          <span className="font-medium text-gray-800 truncate">{tag.name}</span>
                        </div>
                        <span className="text-sm font-semibold text-gray-700">{formatCurrency(tag.total)}</span>
                      </div>
                      <div className="mt-3 h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(100, width)}%` }} />
                      </div>
                      <p className="mt-2 text-xs text-gray-500">{tag.count} expenses</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Expenses</h3>
                <FaReceipt className="text-amber-600" />
              </div>

              <div className="space-y-3">
                {recentExpenses.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No recent expenses.</p>
                )}

                {recentExpenses.map((expense) => (
                  <div key={expense._id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-lg border border-white/40 bg-white/50 p-3">
                    <div className="min-w-0">
                      <p className="font-medium text-gray-800 truncate">{expense.title}</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {expense.tags?.length ? expense.tags.map((tag) => (
                          <span key={tag.id} className="inline-flex items-center gap-1 rounded-md bg-white/70 px-2 py-1 text-xs text-gray-600">
                            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: tag.color || '#6366f1' }} />
                            {tag.name}
                          </span>
                        )) : (
                          <span className="text-xs text-gray-400">No tags</span>
                        )}
                      </div>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="font-bold text-indigo-700">{formatCurrency(expense.amount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(expense.created_at)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-white/20 shadow-lg bg-white/30 backdrop-blur-md p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
                <FaClock className="text-indigo-600" />
              </div>

              <div className="space-y-3">
                {recentActivity.length === 0 && (
                  <p className="py-8 text-center text-sm text-gray-500">No recent activity.</p>
                )}

                {recentActivity.map((activity) => {
                  const meta = actionMeta[activity.action] || actionMeta.updated;
                  const Icon = meta.icon;

                  return (
                    <div key={activity._id} className="flex items-center justify-between gap-3 rounded-lg border border-white/40 bg-white/50 p-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`h-9 w-9 rounded-lg ${meta.bg} ${meta.color} flex items-center justify-center`}>
                          <Icon />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-800 truncate">{activity.title}</p>
                          <p className="text-xs text-gray-500">{meta.label}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-gray-700">{formatCurrency(activity.amount)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
