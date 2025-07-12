'use client';

import React, { useState } from "react";
import BlobBackground from "../BlobBackground/page";
import Navbar from "../Navbar/page";
import { motion } from "framer-motion";
import { FaReact, FaNodeJs, FaDatabase, FaLock, FaCloud, FaCode, FaGithub, FaLinkedin, FaEnvelope } from "react-icons/fa";
import AuthModal from "../Modals/AuthModal/page";

export default function DeveloperPage() {
    const [showAuthForm , setShowAuthForm] = useState(false)
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-0 py-20 overflow-hidden">
      <BlobBackground />
     {showAuthForm && <AuthModal onClose={() => setShowAuthForm(false)} />}
     <div className="fixed top-0 left-0 w-full z-50">
       <Navbar onAuthClick={() => setShowAuthForm(true)} />
     </div>

      <section className="glass w-[90vw] mx-auto p-10 md:p-16 text-center rounded-3xl shadow-2xl backdrop-blur-lg mt-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-indigo-700 mb-6"
        >
          Developer — Aman Mittal
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-700 mb-8"
        >
          Hi, I'm Aman Mittal, a passionate Full Stack Developer dedicated to building intuitive and scalable web applications. I specialize in creating seamless, user-friendly, and high-performance applications, like Xpenso, that help users manage their finances effortlessly.
        </motion.p>

        <motion.h3 className="text-2xl font-semibold text-indigo-700 mb-4">My Skills & Expertise</motion.h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left mb-10">
          {[ 
            { icon: <FaCode className="text-indigo-600 text-2xl" />, text: "Full Stack Development | Frontend & Backend Mastery" },
            { icon: <FaReact className="text-indigo-600 text-2xl" />, text: "Frontend Technologies | React.js, Next.js, HTML, CSS, Tailwind CSS" },
            { icon: <FaNodeJs className="text-indigo-600 text-2xl" />, text: "Backend Technologies | Node.js, Express.js, Django, Flask" },
            { icon: <FaDatabase className="text-indigo-600 text-2xl" />, text: "Databases | MongoDB, PostgreSQL, MySQL" },
            { icon: <FaLock className="text-indigo-600 text-2xl" />, text: "Authentication & Security | JWT, OAuth, Firebase Auth" },
            { icon: <FaCloud className="text-indigo-600 text-2xl" />, text: "Cloud & Deployment | AWS, Vercel, Netlify, Docker" },
            { icon: <FaCode className="text-indigo-600 text-2xl" />, text: "API Development | RESTful APIs, GraphQL" },
            { icon: <FaGithub className="text-indigo-600 text-2xl" />, text: "Version Control | Git, GitHub" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass flex items-start space-x-4 p-5 rounded-xl shadow-md bg-white/60 backdrop-blur-md"
            >
              {item.icon}
              <p className="text-gray-800 text-base leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        <motion.h3 className="text-2xl font-semibold text-indigo-700 mb-4">My Mission</motion.h3>
        <p className="text-base text-gray-700 mb-10">
          I believe in building secure, efficient, and scalable applications that enhance user experiences. With a deep understanding of modern web technologies, I focus on performance optimization, security, and usability to deliver the best possible solutions.
        </p>

        <motion.h3 className="text-2xl font-semibold text-indigo-700 mb-4">Let's Connect & Build Something Amazing!</motion.h3>
        <p className="text-base text-indigo-600 mb-8">
          Email: aman.mittal@example.com | Portfolio: www.amanmittal.dev <br />
          GitHub: github.com/amanmittal | LinkedIn: linkedin.com/in/amanmittal
        </p>

        <div className="flex justify-center mt-10">
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="glass flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl w-full p-6 rounded-3xl shadow-xl bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/20"
          >
            <div className="md:w-2/3 text-left">
              <h3 className="text-2xl font-bold text-indigo-800 mb-1">Aman Mittal</h3>
              <p className="text-sm text-gray-600 mb-2">Full Stack Developer</p>
              <p className="text-sm text-gray-500">
                Passionate about crafting modern web apps using MERN, Next.js, and more. Dedicated to performance, scalability, and UX.
              </p>
            </div>
            <img
              src="/images/new.jpg"
              alt="Aman Mittal"
              className="md:w-48 md:h-48 w-32 h-32 rounded-full object-cover shadow-md border-4 border-indigo-200"
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}
