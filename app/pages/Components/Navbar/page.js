'use client'
import React, { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";

export default function Navbar({ onAuthClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 mx-auto max-w-7xl backdrop-blur-md border border-white/20 rounded-xl mt-4 shadow-lg">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600 hover:scale-105 transition-transform duration-200 cursor-pointer">
          <Link href="/">XpensoSync</Link>
        </h1>

        <div className="md:hidden text-gray-700 text-2xl cursor-pointer" onClick={toggleMenu}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <ul className="hidden md:flex gap-6 text-gray-800 font-medium">
          <li className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/About">About</Link>
          </li>
          <li className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Features">Features</Link>
          </li>
          <li className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Faqs">FAQ</Link>
          </li>
          <li className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Developer">Developer</Link>
          </li>
          <li>
            <button
              onClick={onAuthClick}
              className="bg-indigo-500 text-white px-4 py-1 rounded-lg hover:bg-indigo-600 transition duration-300 shadow"
            >
              Login / Signup
            </button>
          </li>
        </ul>
      </div>

      {menuOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 text-gray-800 font-medium">
          <li onClick={closeMenu} className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/">Home</Link>
          </li>
          <li onClick={closeMenu} className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/About">About</Link>
          </li>
          <li onClick={closeMenu} className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Features">Features</Link>
          </li>
          <li onClick={closeMenu} className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Faqs">FAQ</Link>
          </li>
          <li onClick={closeMenu} className="hover:text-indigo-600 transition-colors duration-200">
            <Link href="/pages/Components/Developer">Developer</Link>
          </li>
          <li>
            <button
              onClick={() => {
                closeMenu();
                onAuthClick();
              }}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition duration-300 shadow"
            >
              Login / Signup
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
}