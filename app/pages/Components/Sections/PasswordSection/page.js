'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function PasswordSection() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const token =Cookies.get("token")

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New Password and Confirm Password must match. !');
      return;
    }
    try {
      const res = await fetch('/api/changeUserPassword', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json',Authorization: `Bearer ${token}` },

        body: JSON.stringify({ password: confirmPassword }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess('Password changed successfully!');
        setError('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(data.message || 'Something went wrong!');
        setSuccess('');
      }
    } catch (err) {
      setError('Server error!');
      setSuccess('');
    }
  };

  return (
    <div className="relative flex items-center justify-center w-full min-h-[75vh] px-4 md:px-0">
      {/* Blobs */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-indigo-300 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-52 h-52 bg-pink-300 rounded-full blur-3xl opacity-20 animate-ping"></div>

      {/* Glass card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-6xl flex flex-col md:flex-row rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md bg-white/20 border border-white/20"
      >
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 p-8 md:p-10 backdrop-blur-lg bg-white/10">
          <h2 className="text-3xl font-bold text-indigo-700 mb-6 text-center">🔐 Change Password</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">New Password</label>
              <div className="flex items-center bg-white/30 border border-gray-300 backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
                <FaLock className="text-indigo-600 mr-2" />
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-800"
                  required
                />
                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirm New Password</label>
              <div className="flex items-center bg-white/30 border border-gray-300 backdrop-blur-md rounded-xl px-4 py-2 shadow-sm">
                <FaLock className="text-indigo-600 mr-2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-transparent w-full outline-none text-gray-800"
                  required
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash className="text-gray-500" /> : <FaEye className="text-gray-500" />}
                </button>
              </div>
            </div>

            {/* Error/Success */}
            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
            {success && <p className="text-green-600 text-sm text-center">{success}</p>}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-xl hover:bg-indigo-700 transition duration-300 shadow-md"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Right: Image */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="hidden lg:flex items-center justify-center w-full md:w-1/2 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100"
        >
          <img
            src="/images/changePass.png"
            alt="Change Password Illustration"
            className="max-w-[90%] h-auto object-contain drop-shadow-2xl"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
