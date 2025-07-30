'use client';

import React, { useState , useEffect } from 'react';
import {FaSignOutAlt, FaUserCircle, FaTachometerAlt, FaMoneyBillWave, FaClock, FaTags, FaUserEdit, FaLock, FaBars, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardSection from '../Sections/DashboardSection/page';
import TimelineSection from '../Sections/TimelineSection/page'
import TagsSection from '../Sections/TagsSection/page'
import ProfileSection from '../Sections/ProfileSection/page'
import ExpensesSection from '../Sections/ExpensesSection/page'
import PasswordSection from '../Sections/PasswordSection/page'
import Cookies from 'js-cookie';
const sidebarItems = [
  { icon: <FaTachometerAlt />, label: 'Dashboard' },
  { icon: <FaMoneyBillWave />, label: 'Expenses' },
  { icon: <FaClock />, label: 'Expense Timeline' },
  { icon: <FaTags />, label: 'Expense Tags' },
  { icon: <FaUserEdit />, label: 'Profile' },
  { icon: <FaLock />, label: 'Change Password' },
];

export default function Dashboard() {
  const [active, setActive] = useState('Dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const token =Cookies.get("token")
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleProfileMenu = () => setProfileMenuOpen(!profileMenuOpen);
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/getUserProfile', {
          headers: {
            // Authorization: `Bearer ${document.cookie.split('token=')[1]}`,
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        
        setUser(data.user);
        Cookies.set('userData', JSON.stringify(data.user),{expires:1,secure: true,sameSite: 'strict'});
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };
  
    useEffect(() => {
      fetchUser();
    }, []);
  

    const handleLogout = async () => {
    try {
      // Call the logout API to clear the token cookie
      const res = await fetch("/api/expenses/logout", {
        method: "GET",
      });

      // Check if the response is okay and return a JSON object
      if (!res.ok) {
        throw new Error("Logout failed");
      }

      // Try to parse the response as JSON
      const data = await res.json();

      if (data?.message === "Logged out successfully") {
        // Redirect to login page after logout
        window.location.assign("/");
      } else {
        alert(data?.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out");
    }
  };
  
  return (
    <div className="relative flex h-screen w-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 overflow-hidden">
      {/* Sidebar */}
      {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[200]"
            onClick={() => setShowLogoutModal(false)} // close when clicking outside
          >
            <div
              onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside modal
              className="bg-white p-6 rounded-2xl shadow-xl w-[90%] max-w-sm text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Are you sure you want to logout?</h3>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed z-[100] w-64 bg-white/60 backdrop-blur-lg shadow-xl p-4 flex-col h-screen md:static md:flex"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <FaUserCircle className="text-3xl text-indigo-600" />
                <div>
                  <p className="text-base font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-500">@{user?.username}</p>
                </div>
              </div>
              <button onClick={toggleSidebar} className="text-gray-600 hover:text-indigo-600 transition md:hidden">
                <FaTimes size={18} />
              </button>
            </div>
            <nav className="space-y-3">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setActive(item.label)}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left hover:bg-indigo-100 transition duration-300 ${
                    active === item.label ? 'bg-indigo-200 text-indigo-800 font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="mt-64">
              <button className="flex items-center space-x-3 px-3 py-2 rounded-lg w-full text-left text-red-600 hover:bg-red-100 transition duration-300" onClick={() => setShowLogoutModal(true)}>
                <FaSignOutAlt className="text-lg" />
                <span>Logout</span>
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Shifted Content Container */}
      <div className={`flex-1 flex flex-col h-screen transition-all duration-300 ${sidebarOpen}`}>
        {/* Navbar for All Screens */}
        <div className="w-full px-6 py-4 bg-white/40 backdrop-blur-lg border border-white/20 shadow-md flex justify-between items-center z-50">
          <button onClick={toggleSidebar} className="text-indigo-700 text-xl">
            <FaBars />
          </button>
          <div className="relative">
            <button onClick={toggleProfileMenu} className="flex items-center space-x-2">
              <FaUserCircle className="text-2xl text-indigo-700" />
              <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.name}</span>
            </button>
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-lg z-50">
                <button className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100" onClick={() => setActive('Profile')}><FaUserCircle className="ms-2 me-2 text-xl text-indigo-600"  />Profile</button>
                <button className="flex w-full text-left px-4 py-2 text-gray-700 hover:bg-indigo-100" onClick={() => setShowLogoutModal(true)}><FaSignOutAlt className="ms-2 me-2 text-xl text-red-600" />Logout</button>
              </div>
            )}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-10 overflow-auto">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass w-full rounded-3xl p-8 shadow-2xl backdrop-blur-md border border-white/20"
          >
            {active === 'Dashboard' && <DashboardSection />}
            {active === 'Expenses' && <ExpensesSection />}
            {active === 'Expense Timeline' && <TimelineSection />}
            {active === 'Expense Tags' && <TagsSection />}
            {active === 'Profile' && <ProfileSection User={user} />}
            {active === 'Change Password' && <PasswordSection />}
          </motion.div>
        </main>

      </div>
    </div>
  );
}

