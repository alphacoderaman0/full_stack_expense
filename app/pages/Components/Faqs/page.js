'use client';

import React, { useState , useEffect } from "react";
import BlobBackground from "../BlobBackground/page";
import Navbar from "../Navbar/page";
import { motion, AnimatePresence } from "framer-motion";
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
import { FaLock, FaSyncAlt, FaTrash, FaMoneyCheckAlt, FaQuestionCircle } from "react-icons/fa";
import AuthModal from "../Modals/AuthModal/page";

const initialFaqs = [
  {
    id: '1',
    icon: <FaLock className="text-indigo-600 text-2xl" />, 
    q: "Is my expense data private?",
    a: "Yes! Your expense data is completely private. Only you can see your expenses when you log in."
  },
  {
    id: '2',
    icon: <FaSyncAlt className="text-indigo-600 text-2xl" />,
    q: "Can I access Xpenso from multiple devices?",
    a: "Absolutely! You can log in from any device with internet access and track your expenses on the go."
  },
  {
    id: '3',
    icon: <FaMoneyCheckAlt className="text-indigo-600 text-2xl" />,
    q: "How do I add an expense?",
    a: "Once logged in, simply click on the 'Add Expense' button, enter the details, and save. It's that easy!"
  },
  {
    id: '4',
    icon: <FaQuestionCircle className="text-indigo-600 text-2xl" />,
    q: "Do I need to pay to use Xpenso?",
    a: "Xpenso offers a free version with essential features. We may introduce premium features in the future."
  },
  {
    id: '5',
    icon: <FaLock className="text-indigo-600 text-2xl" />,
    q: "How secure is my data?",
    a: "We use secure login authentication to protect your data, ensuring that only you can access your financial records."
  },
  {
    id: '6',
    icon: <FaTrash className="text-indigo-600 text-2xl" />,
    q: "How do I delete an expense?",
    a: "You can delete any expense from your dashboard by selecting the entry and clicking 'Delete'."
  }
];

function SortableFeature({ id, icon, title, desc, openId, setOpenId }) {
  
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
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="glass p-6 md:p-8 rounded-3xl shadow-lg bg-gradient-to-br from-white/70 to-white/50 backdrop-blur-md border border-white/20 transition-all duration-300 ease-in-out hover:scale-[1.03] hover:shadow-2xl cursor-move"
    >
      <div className="flex items-start gap-3 mb-2">
        {icon}
        <button onDoubleClick={() => setOpenId(openId === id ? null : id)} className="text-left w-full flex justify-between items-center gap-2">
          <span className="text-lg font-semibold text-indigo-700">{title}</span>
          <span className="text-indigo-600 font-bold text-lg">{openId === id ? '−' : '+'}</span>
        </button>
      </div>
      <AnimatePresence initial={false}>
        {openId === id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="text-gray-700 text-sm overflow-hidden"
          >
            {desc}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQPage() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  const [openId, setOpenId] = useState(null);
  const [showAuthForm, setShowAuthForm] = useState(false);
   const [faqs, setFaqs] = useState(initialFaqs);

  useEffect(() => {
    // Only runs in the browser
    const saved = localStorage.getItem('faqOrder');
    if (saved) {
      const savedIds = JSON.parse(saved);
      const reordered = savedIds
        .map(id => initialFaqs.find(faq => faq.id === id))
        .filter(Boolean); // Remove nulls
      setFaqs(reordered);
    }
  }, []);
  // const [faqs, setFaqs] = useState(() => {
  //   const saved = localStorage.getItem('faqOrder');
  //   if (saved) {
  //     const savedIds = JSON.parse(saved);
  //     return savedIds.map(id => initialFaqs.find(faq => faq.id === id)).filter(Boolean);
  //   }
  //   return initialFaqs;
  // });

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = faqs.findIndex((item) => item.id === active.id);
      const newIndex = faqs.findIndex((item) => item.id === over.id);
      const newOrder = arrayMove(faqs, oldIndex, newIndex);
      setFaqs(newOrder);
      const idOrder = newOrder.map(item => item.id);
      localStorage.setItem('faqOrder', JSON.stringify(idOrder));
    }
  };

  return (
    <main className="relative w-full min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-200 px-0 py-20 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 select-none pointer-events-none">
        <FaQuestionCircle className="absolute top-10 left-10 text-[10rem] text-indigo-200 rotate-[-15deg]" />
        <FaSyncAlt className="absolute bottom-10 right-10 text-[10rem] text-indigo-200 rotate-[10deg]" />
      </div>
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
          className="text-4xl md:text-5xl font-bold text-indigo-700 mb-4"
        >
          Frequently Asked Questions
        </motion.h2>
<p className="text-sm text-gray-600 italic mb-6">💡 Double click on a question to expand or collapse the answer.</p>
        {hasMounted && (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={faqs} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {faqs.map((faq) => (
                <SortableFeature
                  key={faq.id}
                  id={faq.id}
                  icon={faq.icon}
                  title={faq.q}
                  desc={faq.a}
                  openId={openId}
                  setOpenId={setOpenId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>)}
      </section>
    </main>
  );
}
