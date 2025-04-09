import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Track scroll position for navbar appearance change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Enhanced animation variants
  const navbarVariants = {
    initial: {
      boxShadow: "0 0 0 rgba(0,0,0,0)",
      background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)",
    },
    scrolled: {
      boxShadow: "0 4px 20px rgba(118, 75, 162, 0.3)",
      background: "linear-gradient(90deg, #764ba2 0%, #667eea 100%)",
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  const logoVariants = {
    hover: {
      scale: 1.1,
      rotate: 10,
      transition: { duration: 0.4, type: "spring", stiffness: 300 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.4,
        type: "spring",
        stiffness: 150,
      },
    }),
  };

  const mobileMenuVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.4,
        staggerChildren: 0.15,
      },
    },
  };

  return (
    <motion.nav
      className={`sticky top-0 z-50 ${
        scrolled ? "border-b border-purple-300 dark:border-purple-800" : ""
      }`}
      initial="initial"
      animate={scrolled ? "scrolled" : "initial"}
      variants={navbarVariants}
    >
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse group"
        >
          <motion.div
            className="bg-white p-1 rounded-full shadow-md"
            whileHover="hover"
            variants={logoVariants}
          >
            <motion.img
              src="https://static.vecteezy.com/system/resources/previews/008/460/149/non_2x/story-pen-ink-logo-vector.jpg"
              className="h-11 rounded-full"
              alt="Storytell Logo"
            />
          </motion.div>
          <motion.span
            className="self-center text-2xl font-semibold whitespace-nowrap text-white"
            whileHover={{
              textShadow: "0 0 8px rgba(255,255,255,0.8)",
              scale: 1.05,
              transition: { duration: 0.3 },
            }}
          >
            Storytell
          </motion.span>
        </NavLink>

        <motion.button
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-white"
          aria-controls="navbar-cta"
          aria-expanded={menuOpen}
          onClick={toggleMenu}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <span className="sr-only">Toggle menu</span>
          <motion.svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
            animate={
              menuOpen ? { rotate: 180, scale: 1.2 } : { rotate: 0, scale: 1 }
            }
            transition={{ duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </motion.svg>
        </motion.button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center justify-between w-auto md:w-auto md:order-1">
          <ul className="flex flex-row font-medium space-x-8 rtl:space-x-reverse">
            {["Home", "About", "Contact"].map((item, i) => (
              <motion.li
                key={item}
                custom={i}
                variants={menuItemVariants}
                initial="hidden"
                animate="visible"
              >
                <NavLink
                  exact={item === "Home"}
                  to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className={({ isActive }) =>
                    `relative block py-2 px-3 md:p-0 rounded text-lg ${
                      isActive ? "text-white font-bold" : "text-purple-100"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {item}
                      {isActive ? (
                        <motion.span
                          className="absolute bottom-0 left-0 w-full h-1 bg-white rounded-full -mb-1"
                          layoutId="underline"
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 25,
                          }}
                        />
                      ) : (
                        <motion.span
                          className="absolute bottom-0 left-0 w-0 h-1 bg-white rounded-full -mb-1"
                          whileHover={{
                            width: "100%",
                            transition: { duration: 0.3 },
                          }}
                        />
                      )}
                    </>
                  )}
                </NavLink>
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="items-center justify-between w-full md:hidden"
              id="navbar-cta"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <motion.ul
                className="flex flex-col font-medium p-4 mt-4 rounded-lg bg-purple-700 backdrop-blur-sm bg-opacity-90 shadow-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {["Home", "About", "Contact"].map((item, i) => (
                  <motion.li
                    key={item}
                    custom={i}
                    variants={menuItemVariants}
                    whileHover={{
                      x: 10,
                      backgroundColor: "rgba(255,255,255,0.1)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <NavLink
                      exact={item === "Home"}
                      to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                      className={({ isActive }) =>
                        `block py-3 px-4 my-1 rounded-md ${
                          isActive
                            ? "bg-purple-900 bg-opacity-50 text-white font-bold"
                            : "text-purple-100"
                        } hover:text-white transition-colors duration-200`
                      }
                      onClick={() => setMenuOpen(false)}
                    >
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: i * 0.1 + 0.2, duration: 0.3 }}
                      >
                        {item}
                      </motion.div>
                    </NavLink>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
