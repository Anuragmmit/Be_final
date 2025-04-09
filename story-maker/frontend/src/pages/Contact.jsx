import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = () => {
  const [charCount, setCharCount] = useState(0);
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });
  const maxChars = 200;

  const handleTextareaChange = (event) => {
    setCharCount(event.target.value.length);
    setFormState({ ...formState, message: event.target.value });
  };

  const handleInputChange = (event) => {
    setFormState({
      ...formState,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    toast.success("Your message has been sent!", { position: "top-center" });
    // Reset form after successful submission
    setFormState({ firstName: "", lastName: "", email: "", message: "" });
    setCharCount(0);
  };

  // Contact emojis for the background
  const contactEmojis = [
    "📱",
    "📞",
    "📧",
    "💬",
    "📨",
    "🔔",
    "💌",
    "✉️",
    "📤",
    "📝",
  ];

  return (
    <div className="relative bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 min-h-screen flex items-center justify-center p-6 overflow-hidden">
      <ToastContainer />

      {/* Animated Background with Emoji */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated Emojis */}
        {[...Array(20)].map((_, i) => {
          const emoji = contactEmojis[i % contactEmojis.length];
          const startX = Math.random() * 100;
          const startY = Math.random() * -100;
          const size = 24 + Math.random() * 40;
          const duration = 15 + Math.random() * 30;
          const delay = Math.random() * 10;

          return (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-10 dark:opacity-5 select-none"
              style={{
                fontSize: `${size}px`,
                left: `${startX}vw`,
                top: `${startY}px`,
              }}
              initial={{ y: -100, rotate: 0 }}
              animate={{
                y: "120vh",
                rotate: Math.random() > 0.5 ? 360 : -360,
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
              }}
            >
              {emoji}
            </motion.div>
          );
        })}

        {/* Background Glow Elements */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`glow-${i}`}
            className="absolute rounded-full"
            style={{
              background:
                i % 2 === 0
                  ? "radial-gradient(circle, rgba(79, 70, 229, 0.15) 0%, rgba(79, 70, 229, 0) 70%)"
                  : "radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(139, 92, 246, 0) 70%)",
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${20 + i * 15}%`,
              top: `${20 + i * 10}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.7, 1, 0.7],
              x: [0, i % 2 === 0 ? 20 : -20, 0],
              y: [0, i % 2 === 0 ? -20 : 20, 0],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* Background Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "25px 25px",
          }}
        ></div>
      </div>

      <motion.div
        className="relative max-w-2xl w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/20 dark:border-gray-800/50 z-10"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <div className="h-20 w-20 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </motion.div>

        <motion.h1
          className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Get In Touch With Us
        </motion.h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                required
                className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="John"
                value={formState.firstName}
                onChange={handleInputChange}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                required
                className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Doe"
                value={formState.lastName}
                onChange={handleInputChange}
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                  />
                </svg>
              </div>
              <input
                type="email"
                id="email"
                required
                className="w-full pl-10 p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="example@email.com"
                value={formState.email}
                onChange={handleInputChange}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Message
            </label>
            <textarea
              id="message"
              rows="5"
              maxLength={maxChars}
              className="w-full p-3 bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Write your message here..."
              onChange={handleTextareaChange}
              value={formState.message}
            />
            <div className="flex justify-between mt-1">
              <span className="text-sm text-gray-500">
                We'll get back to you soon!
              </span>
              <span className="text-sm text-gray-500">
                {charCount}/{maxChars} characters
              </span>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg text-lg font-semibold shadow-lg transition-all"
            whileHover={{
              scale: 1.02,
              boxShadow:
                "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            Send Message
          </motion.button>
        </form>

        <motion.div
          className="mt-8 text-center text-gray-500 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <p>Or connect with us directly</p>
          <div className="flex justify-center gap-4 mt-3">
            <motion.a
              href="tel:+919860313450"
              className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center gap-2"
              whileHover={{ y: -3 }}
            >
              <span role="img" aria-label="phone" className="text-lg">
                📱
              </span>
              Phone
            </motion.a>

            <motion.a
              href="mailto:anurag.chopade@mmit.edu.in"
              className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center gap-2"
              whileHover={{ y: -3 }}
            >
              <span role="img" aria-label="email" className="text-lg">
                ✉️
              </span>
              Email
            </motion.a>

            <motion.a
              href="https://chat.whatsapp.com/FwUtMktRuOg0HBY3XGaGxm"
              className="px-3 py-2 bg-white/70 dark:bg-gray-800/70 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all flex items-center gap-2"
              whileHover={{ y: -3 }}
            >
              <span role="img" aria-label="chat" className="text-lg">
                💬
              </span>
              Chat
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Contact;
