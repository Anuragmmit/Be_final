import React, { useEffect, useState, useMemo, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

const About = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const controls = useAnimation();
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  // Custom intersection observer without the library
  useEffect(() => {
    const currentRef = ref.current;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  // Trigger animations when component comes into view
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  // Track mouse position for parallax effect with throttling
  useEffect(() => {
    let frameId;
    let lastMousePosition = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      lastMousePosition = { x: e.clientX, y: e.clientY };

      // Throttle the state updates using requestAnimationFrame
      if (!frameId) {
        frameId = requestAnimationFrame(() => {
          setMousePosition(lastMousePosition);
          frameId = null;
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (frameId) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);

  // Memoize the background circles to avoid unnecessary re-renders
  const backgroundCircles = useMemo(() => {
    return [...Array(6)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full opacity-20 dark:opacity-10"
        style={{
          background: `radial-gradient(circle, rgba(79, 70, 229, 0.8) 0%, rgba(79, 70, 229, 0) 70%)`,
          width: `${150 + i * 100}px`,
          height: `${150 + i * 100}px`,
          left: `${10 + i * 12}%`,
          top: `${10 + i * 10}%`,
        }}
        animate={{
          x: mousePosition.x * (0.01 - i * 0.002),
          y: mousePosition.y * (0.01 - i * 0.002),
        }}
        transition={{ type: "spring", stiffness: 50, damping: 30 }}
      />
    ));
  }, [mousePosition]);

  // Enhanced card data with gradient colors and SVG paths
  const cardData = [
    {
      title: "Collaborative Platform",
      description:
        "A Collaborative Storyboarding Platform is a digital tool that allows multiple users to work together on creating, organizing, and visualizing stories.",
      gradientFrom: "#4F46E5",
      gradientTo: "#7C3AED",
      iconPath:
        "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
      delay: 0.5,
      animationDelay: 0.2,
    },
    {
      title: "Fast & Efficient",
      description:
        "Deliver great service experiences quickly without complexity. Accelerate development, eliminate toil, and deploy changes with ease.",
      gradientFrom: "#EF4444",
      gradientTo: "#EC4899",
      iconPath: "M13 10V3L4 14h7v7l9-11h-7z",
      delay: 0.6,
      animationDelay: 0.4,
    },
    {
      title: "Automated Workflows",
      description:
        "Automate repetitive tasks and integrate data from multiple sources to improve efficiency and reduce manual errors.",
      gradientFrom: "#10B981",
      gradientTo: "#3B82F6",
      iconPath:
        "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15",
      delay: 0.7,
      animationDelay: 0.6,
    },
    {
      title: "Scalable & Secure",
      description:
        "Built with enterprise-grade security and scalability, ensuring seamless operations as your business grows.",
      gradientFrom: "#F59E0B",
      gradientTo: "#EF4444",
      iconPath:
        "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
      delay: 0.8,
      animationDelay: 0.8,
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Icon animation variants
  const iconContainerVariants = {
    hidden: { scale: 0, rotate: -30 },
    visible: (delay) => ({
      scale: 1,
      rotate: 0,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: delay,
      },
    }),
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (delay) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay: delay,
          type: "spring",
          duration: 1.5,
          bounce: 0,
        },
        opacity: {
          delay: delay,
          duration: 0.3,
        },
      },
    }),
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse",
      },
    },
  };

  return (
    <div className="relative min-h-screen overflow-hidden py-20 px-6">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950"></div>

        {/* Animated Circles */}
        {backgroundCircles}

        {/* Background Mesh Pattern */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto text-center z-10">
        {/* Hero Section */}
        <motion.div
          initial="hidden"
          animate={controls}
          variants={containerVariants}
        >
          {/* Title with Animation */}
          <motion.h1
            className="mb-6 text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
            variants={itemVariants}
          >
            Get back to growth with{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              world's No.1
            </span>{" "}
            Story Boarding Platform.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-lg font-normal text-gray-800 lg:text-xl dark:text-gray-300 mb-12"
            variants={itemVariants}
          >
            Here at{" "}
            <span className="font-bold text-blue-600 dark:text-blue-400">
              Storytell
            </span>
            , we focus on markets where technology, innovation, and capital can
            unlock long-term value and drive economic growth.
          </motion.p>

          {/* Information Cards */}
          <motion.div
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
          >
            {cardData.map((card, index) => (
              <motion.div
                key={index}
                className="p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-xl border border-gray-100 dark:border-gray-700 flex flex-col h-full"
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                }}
                transition={{ duration: 0.3 }}
              >
                {/* Enhanced Animated Icon */}
                <motion.div
                  className="mx-auto mb-6"
                  variants={iconContainerVariants}
                  custom={card.animationDelay}
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 10 }}
                >
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    {/* Glowing background effect */}
                    <motion.div
                      className="absolute inset-0 rounded-full opacity-70"
                      style={{
                        background: `radial-gradient(circle, ${card.gradientFrom}40 0%, ${card.gradientTo}00 70%)`,
                      }}
                      variants={pulseVariants}
                      animate="pulse"
                    />

                    {/* Icon container with gradient */}
                    <div
                      className="h-14 w-14 rounded-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${card.gradientFrom} 0%, ${card.gradientTo} 100%)`,
                        boxShadow: `0 10px 15px -3px ${card.gradientFrom}40`,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d={card.iconPath}
                          variants={pathVariants}
                          custom={card.animationDelay}
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>

                <h3
                  className="text-xl font-semibold mb-3"
                  style={{
                    background: `linear-gradient(to right, ${card.gradientFrom}, ${card.gradientTo})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {card.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action Button */}
          <motion.div className="mt-14" variants={itemVariants}>
            <motion.a
              href="https://www.storytellingwithdata.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-white rounded-lg"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="absolute w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600"></span>
              <span className="absolute bottom-0 right-0 block w-64 h-64 mb-32 mr-4 transition duration-500 origin-bottom-left transform rotate-45 translate-x-24 bg-pink-500 rounded-full opacity-30 group-hover:rotate-90 ease"></span>
              <span className="relative flex items-center">
                Learn More
                <svg
                  className="w-5 h-5 ml-2 transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
