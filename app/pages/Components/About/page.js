'use client'
import React, { useState } from "react";
import BlobBackground from "../BlobBackground/page";
import Navbar from "../Navbar/page";
import { motion } from "framer-motion";
import {
  DndContext,
  closestCenter
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { FaShieldAlt, FaChartLine, FaMobileAlt, FaUserFriends } from "react-icons/fa";
import AuthModal from "../Modals/AuthModal/page";

function SortableFeature({ id, icon, title, desc }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="glass p-6 rounded-xl shadow-md flex items-start space-x-4 bg-white/60 cursor-move"
    >
      {icon}
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [features, setFeatures] = useState([
    {
      id: '1',
      icon: <FaShieldAlt className="text-indigo-600 text-2xl mt-1" />,
      title: "100% Private & Secure",
      desc: "Your financial data is encrypted and stored with top-grade security."
    },
    {
      id: '2',
      icon: <FaChartLine className="text-indigo-600 text-2xl mt-1" />,
      title: "Smart Analytics",
      desc: "Gain insights and track spending habits with intelligent charts."
    },
    {
      id: '3',
      icon: <FaMobileAlt className="text-indigo-600 text-2xl mt-1" />,
      title: "Multi-Device Access",
      desc: "Use Xpenso on mobile, tablet, or desktop anytime, anywhere."
    },
    {
      id: '4',
      icon: <FaUserFriends className="text-indigo-600 text-2xl mt-1" />,
      title: "User-Friendly Interface",
      desc: "Designed for simplicity — manage your finances effortlessly."
    },
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = features.findIndex((item) => item.id === active.id);
      const newIndex = features.findIndex((item) => item.id === over.id);
      setFeatures(arrayMove(features, oldIndex, newIndex));
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-0 py-20 overflow-hidden">
      <BlobBackground />
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar onAuthClick={() => setShowAuthForm(true)} />
      </div>
      {showAuthForm && <AuthModal onClose={() => setShowAuthForm(false)} />}
      <section className="glass w-[90vw] mx-auto p-10 md:p-16 text-center rounded-3xl shadow-2xl backdrop-blur-lg mt-10">
        <motion.h2 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-indigo-700 mb-6"
        >
          Xpenso — Your Trusted Expense Tracker
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-gray-700 mb-6"
        >
          At Xpenso, we understand that tracking your spending is the first step toward financial freedom. That’s why we’ve built a simple, secure, and effective platform to help you monitor your expenses with ease.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our <span style={{color:'#4338ca'}}>Vision</span></h3>
          <p className="mb-6 text-gray-700">
            Everyone should have access to a seamless financial management tool. Whether you’re tracking daily coffee runs, managing household expenses, or handling business costs — Xpenso empowers you with financial clarity and confidence.
          </p>
        </motion.div>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
                <img
                src="/images/about1.jpg"
                alt="Xpenso vision 1"
                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-xl">Secure & Insightful</p>
                </div>
            </div>
            <div className="relative overflow-hidden rounded-2xl shadow-lg group h-80">
                <img
                src="/images/about2.jpg"
                alt="Xpenso vision 2"
                className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-60"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-white text-lg font-semibold bg-black/50 px-4 py-2 rounded-xl">Intuitive Design</p>
                </div>
            </div>
            </div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">What Makes Xpenso Unique?</h3>

          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={features} strategy={rectSortingStrategy}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
                {features.map((feature) => (
                  <SortableFeature
                    key={feature.id}
                    id={feature.id}
                    icon={feature.icon}
                    title={feature.title}
                    desc={feature.desc}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </motion.div>
      </section>
    </main>
  );
}
