'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaBriefcase, FaBuilding, FaPaperPlane, FaUser, FaEdit, FaCheck } from 'react-icons/fa';

export default function ProfileSection({User}) {
  const [editField, setEditField] = useState(null);
  const [user, setUser] = useState(User);
  const [editedUser, setEditedUser] = useState({ ...User });
  
  const token = Cookies.get("token")
  if (!user) {
    return <div className="text-center text-indigo-600 font-semibold">Loading...</div>;
  }

  const handleInputChange = (key, value) => {
    setEditedUser((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (key) => {
    try {
      const updatedField = { [key]: editedUser[key] };

      const res = await fetch('/api/updateUserProfile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedField),
      });

      if (!res.ok) {
        throw new Error('Failed to update user field');
      }

      const updatedUser = await res.json();

      console.log('User updated:', updatedUser);

      setUser((prev) => ({
        ...prev,
        [key]: editedUser[key],
      }));
      setEditField(null);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };


  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative grid grid-cols-1 md:grid-cols-3 gap-6 items-start w-full"
    >
      {/* Profile Summary Card */}
      <div className="col-span-1">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="mb-5 glass p-6 rounded-3xl shadow-xl backdrop-blur-md border border-white/30 transition-all"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-indigo-200 text-indigo-800 font-bold rounded-full w-24 h-20 flex items-center justify-center text-3xl shadow-inner">
              {user.name?.split(' ').map(word => word.charAt(0)).join('').toUpperCase() || 'A'}
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-700">{user.name}</h2>
              <p className="text-gray-500">@{user.username}</p>
              <p className="text-sm text-gray-400 mt-1">
                Joined: {new Date(user.createdAt).toDateString()}
              </p>
            </div>
          </div>
        </motion.div>
        {/* Access Token Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-2 w-full rounded-3xl bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-md border border-white/30 p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all"
      >
        <h2 className="text-xl font-semibold text-indigo-700 mb-2">Access Token</h2>
        <p className="break-all text-gray-800 text-sm bg-white/20 p-3 rounded-lg shadow-inner font-mono">
          {token || "No token available"}
        </p>
      </motion.div>

      </div>

      {/* User Details
      <div className="col-span-2 grid grid-cols-1 gap-4">
        {[
          { icon: FaEnvelope, label: 'Email', value: user.email },
          { icon: FaPhone, label: 'Phone', value: user.phone || 'N/A' },
          { icon: FaMapMarkerAlt, label: 'Address', value: user.address || 'N/A' },
          { icon: FaBriefcase, label: 'Profession', value: user.profession || 'N/A' },
          { icon: FaBuilding, label: 'City', value: user.city || 'N/A' },
          { icon: FaPaperPlane, label: 'State', value: user.state || 'N/A' },
        ].map(({ icon: Icon, label, value }, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            className="glass flex items-center space-x-4 p-[0.8rem] rounded-xl border border-white/20 backdrop-blur-sm bg-white/50 shadow-md"
          >
            <Icon className="text-indigo-600 text-xl" />
            <div>
              <p className="text-sm text-gray-500">{label}</p>
              <p className="text-md font-medium text-gray-700">{value}</p>
            </div>
          </motion.div>
        ))}
      </div> */}
<div className="col-span-2 grid grid-cols-1 gap-4">
  {[
    { icon: FaEnvelope, label: 'Email', value: user.email, keyName: 'email' },
    { icon: FaPhone, label: 'Phone', value: user.phone || 'N/A', keyName: 'phone' },
    { icon: FaMapMarkerAlt, label: 'Address', value: user.address || 'N/A', keyName: 'address' },
    { icon: FaBriefcase, label: 'Profession', value: user.profession || 'N/A', keyName: 'profession' },
    { icon: FaBuilding, label: 'City', value: user.city || 'N/A', keyName: 'city' },
    { icon: FaPaperPlane, label: 'State', value: user.state || 'N/A', keyName: 'state' },
  ].map(({ icon: Icon, label, value, keyName }, index) => (
    <motion.div
      key={index}
      whileHover={{ scale: 1.01 }}
      className="glass flex justify-between items-center space-x-4 p-[0.8rem] rounded-xl border border-white/20 backdrop-blur-sm bg-white/50 shadow-md"
    >
      <div className="flex items-center gap-4 w-full">
        <Icon className="text-indigo-600 text-xl" />
        <div className="flex-1">
          <p className="text-sm text-gray-500">{label}</p>
          {editField === keyName ? (
            <input
              type="text"
              className="text-md font-medium text-gray-700 bg-transparent border-b border-indigo-500 focus:outline-none w-full"
              value={editedUser[keyName]}
              onChange={(e) => handleInputChange(keyName, e.target.value)}
            />
          ) : (
            <p className="text-md font-medium text-gray-700">{value}</p>
          )}
        </div>
      </div>

      {/* Edit or Save Icon */}
      <div className="flex items-center gap-2">
        {editField === keyName ? (
          <button
            onClick={() => handleSave(keyName)}
            className="text-green-600 hover:text-green-800 transition"
          >
            <FaCheck />
          </button>
        ) : (
          <button
            onClick={() => {
              setEditedUser((prev) => ({ ...prev, [keyName]: user[keyName] || '' }));
              setEditField(keyName);
            }}
            className="text-indigo-600 hover:text-indigo-800 transition"
          >
            <FaEdit />
          </button>
        )}
      </div>
    </motion.div>
  ))}
</div>


    </motion.section>
  );
}
