'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function AuthModal({ onClose }) {
  const router = useRouter();
  const modalRef = useRef();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.name.length < 3) {
      setErrorMessage('Name must be at least 3 characters long.');
      setLoading(false);
      return;
    } else if (/[^a-zA-Z ]/.test(formData.name)) {
      setErrorMessage('Name must include only letters.');
      setLoading(false);
      return;
    } else if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/expenses/signup', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        const loginRes = await fetch('/api/expenses/login', {
          method: 'POST',
          body: JSON.stringify({ email: formData.email, password: formData.password }),
          headers: { 'Content-Type': 'application/json' },
        });

        const loginData = await loginRes.json();
        if (loginRes.ok && loginData.userId) {
          localStorage.setItem('token', loginData.token);
          localStorage.setItem('userId', loginData.userId);
          router.push('/pages/Home1');
        }
      } else {
        setErrorMessage(data.message || 'Error during signup');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (formData.password.length <= 5) {
      setErrorMessage('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/expenses/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok && data.userId) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userId', data.userId);
        router.push('/pages/Home1');
      } else {
        setErrorMessage(data.message || 'Invalid credentials');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-[4px]">
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="glass relative max-w-md w-full mx-4 px-6 py-8 rounded-2xl shadow-2xl bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/30"
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-indigo-600"
          onClick={onClose}
        >
          <FaTimes size={18} />
        </button>

        <h3 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
          {isLogin ? 'Login to XpensoSync' : 'Create Your XpensoSync Account'}
        </h3>

        <form className="space-y-4" onSubmit={isLogin ? handleLogin : handleSignup}>
          {!isLogin && (
            <div>
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="relative">
            <input
              type={passwordVisible ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-white/70 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <span
              className="absolute right-3 top-2.5 text-gray-600 cursor-pointer"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {errorMessage && (
            <p className="text-sm text-red-500 mt-1 text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-500 text-white py-2 rounded-lg shadow hover:bg-indigo-600 transition duration-300 disabled:opacity-50"
          >
            {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-600 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-500 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
