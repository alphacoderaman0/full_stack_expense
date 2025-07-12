'use client';

import BlobBackground from './pages/Components/BlobBackground/page';
import Navbar from './pages/Components/Navbar/page';
import { FaUserShield, FaLaptopCode, FaMobileAlt, FaLayerGroup, FaLock, FaCheckCircle, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AuthModal from './pages/Components/Modals/AuthModal/page';

function SortableItem({ id, children }) {
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
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
}

export default function Home() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const [features, setFeatures] = useState([
    {
      id: '1',
      text: 'Your Data, Your Privacy — Only you can view and manage your expenses.',
      icon: <FaUserShield className="text-indigo-500 text-2xl" />
    },
    {
      id: '2',
      text: 'Easy-to-Use Dashboard — Add, edit, or delete expenses in just a few clicks.',
      icon: <FaLaptopCode className="text-indigo-500 text-2xl" />
    },
    {
      id: '3',
      text: 'Anywhere, Anytime Access — Track from any device.',
      icon: <FaMobileAlt className="text-indigo-500 text-2xl" />
    },
    {
      id: '4',
      text: 'Smart Categorization — Organized, stress-free budgeting.',
      icon: <FaLayerGroup className="text-indigo-500 text-2xl" />
    },
    {
      id: '5',
      text: 'Secure & Reliable — Safe authentication and storage.',
      icon: <FaLock className="text-indigo-500 text-2xl" />
    }
  ]);

  const [perfectFor, setPerfectFor] = useState([
    'Students managing monthly budgets',
    'Professionals tracking work expenses',
    'Families organizing household spending',
    'Anyone wanting better financial control'
  ]);

  const [showAuthForm, setShowAuthForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleDragEnd = (event, items, setItems) => {

    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  };
  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 overflow-hidden px-0 md:px-0 pt-32">
      <BlobBackground />

      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar onAuthClick={() => setShowAuthForm(true)} />
      </div>

      {/* Auth Modal */}
      {showAuthForm && <AuthModal onClose={() => setShowAuthForm(false)} />}

      <motion.section
        className="glass w-[90vw] mx-auto p-10 text-center rounded-3xl shadow-2xl backdrop-blur-md"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-indigo-700 mb-6 leading-tight">
          Take Control of Your Finances <br /> with <span className="text-indigo-500">XpensoSync</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-700 mb-6">
          Track your expenses, analyze spending, and manage your finances smarter with our 3D glass-styled dashboard.
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAuthForm(true)}
          className="bg-indigo-500 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-600 transition-colors duration-300 mb-10"
        >
          Start Tracking Your Expenses Today
        </motion.button>
              {hasMounted && (
        <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, features, setFeatures)}>
          <SortableContext items={features} strategy={rectSortingStrategy}>
            <div className="grid md:grid-cols-2 gap-6 text-left mb-10">
              {features.map((feature) => (
                <SortableItem key={feature.id} id={feature.id}>
                  <div className="glass flex items-start space-x-4 p-5 rounded-xl shadow-md bg-white/40 backdrop-blur-md cursor-grab">
                    <div className="flex-shrink-0">
                      {feature.icon}
                    </div>
                    <p className="text-gray-800 text-base leading-relaxed">
                      {feature.text}
                    </p>
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          <span style={{color:'#4338ca'}}>Xpenso</span> is perfect for:
        </h2>
      {hasMounted && (
        <DndContext collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, perfectFor.map((item, i) => ({ id: `${i}`, text: item })), (newList) => setPerfectFor(newList.map(i => i.text)))}>
          <SortableContext items={perfectFor.map((_, i) => `${i}`)} strategy={rectSortingStrategy}>
            <div className="grid md:grid-cols-2 gap-4 text-left mb-8">
              {perfectFor.map((item, index) => (
                <SortableItem key={`${index}`} id={`${index}`}>
                  <div className="glass p-4 rounded-xl shadow-md backdrop-blur-sm bg-white/40 cursor-grab">
                    <FaCheckCircle className="text-indigo-500 inline-block mr-2" />
                    {item}
                  </div>
                </SortableItem>
              ))}
            </div>
          </SortableContext>
        </DndContext>)}
      </motion.section>
    </main>
  );
}