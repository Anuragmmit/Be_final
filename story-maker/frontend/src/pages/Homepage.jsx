import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import Description from "./Description";

const Homepage = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Parallax effect values
  const x = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const y = useSpring(mouseY, { stiffness: 50, damping: 30 });

  // Images array for better management
  const carouselImages = [
    "https://media.slidesgo.com/storage/56208764/responsive-images/0-create-your-own-story___media_library_original_655_368.jpg",
    "https://www.shutterstock.com/image-photo/create-your-own-story-shown-260nw-2313986335.jpg",
    "https://www.shutterstock.com/image-photo/create-your-own-story-written-600nw-378537394.jpg",
    "https://www.shutterstock.com/image-vector/your-story-matters-sign-on-260nw-2064525593.jpg",
    "https://c8.alamy.com/comp/R85AX4/word-writing-text-create-your-own-story-business-concept-for-be-the-creator-of-your-demonstratingal-destiny-and-chances-color-pages-of-open-book-phot-R85AX4.jpg",
  ];

  // Titles and descriptions
  const slideContent = [
    {
      title: "Begin Your Creative Journey",
      description: "Transform ideas into captivating visual narratives",
      color: "from-blue-500 to-purple-600",
    },
    {
      title: "Design Your Narrative",
      description: "Powerful tools to bring your vision to life",
      color: "from-emerald-500 to-teal-600",
    },
    {
      title: "Craft Compelling Stories",
      description: "Create storyboards that inspire and engage",
      color: "from-amber-500 to-red-600",
    },
    {
      title: "Your Story Matters",
      description: "Share your unique perspective with the world",
      color: "from-violet-500 to-fuchsia-600",
    },
    {
      title: "Be The Author of Your Destiny",
      description: "Take control of your creative process",
      color: "from-rose-500 to-pink-600",
    },
  ];

  // Mouse move handler for parallax effect
  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.1);
      mouseY.set((e.clientY - centerY) * 0.1);
    }
  };

  // Auto-play functionality
  useEffect(() => {
    let interval;
    if (isAutoPlaying && !isHovering) {
      interval = setInterval(() => {
        setActiveIndex((prevIndex) =>
          prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovering, carouselImages.length]);

  // Functions to handle navigation
  const handlePrevClick = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setIsAutoPlaying(false);
    setActiveIndex((prevIndex) =>
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Resume auto-play after 10 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAutoPlaying(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, [activeIndex]);

  // Icons for animated background
  const iconElements = [
    "✏️",
    "📝",
    "📚",
    "🎬",
    "🎭",
    "📖",
    "🖋️",
    "📓",
    "🎨",
    "📱",
    "🌟",
    "💫",
    "💭",
    "💡",
    "🔮",
    "🎯",
    "🎪",
    "🎤",
    "🎼",
    "📷",
  ];

  return (
    <div
      className="relative min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950 overflow-hidden"
      ref={containerRef}
      onMouseMove={handleMouseMove}
    >
      {/* Interactive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Background Icons */}
        {[...Array(30)].map((_, i) => {
          const icon = iconElements[i % iconElements.length];
          const startX = Math.random() * 100;
          const startY = Math.random() * -100;
          const size = 18 + Math.random() * 24;
          const duration = 15 + Math.random() * 30;
          const delay = Math.random() * 15;
          const rotateDirection = Math.random() > 0.5 ? 360 : -360;
          const opacity = 0.05 + Math.random() * 0.15;

          return (
            <motion.div
              key={i}
              className="absolute select-none dark:text-white"
              style={{
                fontSize: `${size}px`,
                left: `${startX}vw`,
                top: `${startY}px`,
                opacity: opacity,
              }}
              initial={{ y: -100, rotate: 0 }}
              animate={{
                y: "120vh",
                rotate: rotateDirection,
                x: [0, Math.random() > 0.5 ? 50 : -50, 0],
              }}
              transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
                x: {
                  duration: duration / 3,
                  repeat: Infinity,
                  repeatType: "mirror",
                  ease: "easeInOut",
                },
              }}
            >
              {icon}
            </motion.div>
          );
        })}

        {/* Dynamic Glow Effects */}
        {[...Array(5)].map((_, i) => {
          const size = 300 + i * 120;
          const xOffset = useTransform(x, (value) => value * (i * 0.2 + 0.5));
          const yOffset = useTransform(y, (value) => value * (i * 0.2 + 0.5));

          return (
            <motion.div
              key={`glow-${i}`}
              className="absolute rounded-full"
              style={{
                background:
                  i % 2 === 0
                    ? "radial-gradient(circle, rgba(79, 70, 229, 0.12) 0%, rgba(79, 70, 229, 0) 70%)"
                    : "radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, rgba(139, 92, 246, 0) 70%)",
                width: `${size}px`,
                height: `${size}px`,
                x: xOffset,
                y: yOffset,
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
              }}
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.6, 0.8, 0.6],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}

        {/* Interactive Grid Background */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(rgba(99, 102, 241, 0.08) 1px, transparent 1px)`,
            backgroundSize: "25px 25px",
            x: useTransform(x, (value) => value * -0.05),
            y: useTransform(y, (value) => value * -0.05),
          }}
        ></motion.div>
      </div>

      {/* Main Content */}
      <div className="relative py-12 px-4 max-w-6xl mx-auto z-10">
        <motion.h1
          className="text-5xl md:text-6xl lg:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            x: useTransform(x, (value) => value * 0.3),
            y: useTransform(y, (value) => value * 0.3),
          }}
        >
          Create Your Story
        </motion.h1>

        {/* Creative Circular Carousel Instead of Box */}
        <motion.div
          className="relative h-[600px] mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Orbit Path */}
          <motion.div
            className="absolute w-[500px] h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-white/10 dark:border-gray-800/50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{
              x: useTransform(x, (value) => value * 0.1),
              y: useTransform(y, (value) => value * 0.1),
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 120,
              ease: "linear",
              repeat: Infinity,
            }}
          />

          {/* Feature Circle in Center */}
          <motion.div
            className="absolute w-[300px] h-[300px] md:w-[350px] md:h-[350px] rounded-full shadow-2xl overflow-hidden top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              x: useTransform(x, (value) => value * 0.15),
              y: useTransform(y, (value) => value * 0.15),
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20 z-10"
                  animate={{
                    background: [
                      "rgba(0,0,0,0.7)",
                      "rgba(0,0,0,0.5)",
                      "rgba(0,0,0,0.7)",
                    ],
                  }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
                <motion.img
                  src={carouselImages[activeIndex]}
                  className="absolute object-cover w-full h-full"
                  alt={`Featured image ${activeIndex + 1}`}
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.1 }}
                  transition={{ duration: 10, ease: "easeInOut" }}
                />
                <motion.div
                  className="absolute bottom-0 left-0 right-0 p-6 z-20 text-center flex flex-col items-center"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <motion.div
                    className={`px-4 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${slideContent[activeIndex].color} text-white mb-2`}
                    whileHover={{ scale: 1.05 }}
                  >
                    Story {activeIndex + 1}
                  </motion.div>
                  <h2 className="text-white text-2xl font-bold">
                    {slideContent[activeIndex].title}
                  </h2>
                  <p className="text-white/90 text-sm mt-1">
                    {slideContent[activeIndex].description}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Orbiting Elements */}
          {carouselImages.map((image, index) => {
            // Calculate position on orbit
            const angle = (index * (2 * Math.PI)) / carouselImages.length;
            const radius = 240; // Orbit radius
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;

            const isActive = index === activeIndex;

            return (
              <motion.div
                key={index}
                className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden cursor-pointer shadow-lg border-2 ${
                  isActive ? "border-white" : "border-white/50"
                } top-1/2 left-1/2`}
                style={{
                  x: x,
                  y: y,
                  translateX: "-50%",
                  translateY: "-50%",
                  zIndex: isActive ? 15 : 10,
                }}
                whileHover={{ scale: 1.2, zIndex: 30 }}
                animate={{
                  scale: isActive ? 1.3 : 1,
                }}
                onClick={() => {
                  setActiveIndex(index);
                  setIsAutoPlaying(false);
                }}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/40 to-purple-500/40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />
                )}
              </motion.div>
            );
          })}

          {/* Navigation Controls */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 flex justify-between w-[540px] pointer-events-none">
            <motion.button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/30 focus:outline-none pointer-events-auto"
              onClick={handlePrevClick}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </motion.button>
            <motion.button
              type="button"
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-lg hover:bg-white/30 focus:outline-none pointer-events-auto"
              onClick={handleNextClick}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-6 h-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </div>
        </motion.div>

        {/* Auto-play control with glow effect */}
        <motion.div
          className="flex justify-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <motion.button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-6 py-3 rounded-full text-sm flex items-center gap-2 transition-all ${
              isAutoPlaying
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                : "bg-white/10 backdrop-blur-sm text-gray-200 border border-white/20"
            }`}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 15px rgba(120, 120, 255, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            {isAutoPlaying ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Pause Slideshow
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Play Slideshow
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Interactive Call to Action */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 25px rgba(120, 120, 255, 0.7)",
              background: "linear-gradient(to right, #4f46e5, #7e22ce)",
            }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-lg font-medium shadow-lg"
          >
            Make It👇🏻
          </motion.button>
        </motion.div>

        {/* Description Component */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-20 pb-16"
        >
          <Description />
        </motion.div>
      </div>
    </div>
  );
};

export default Homepage;
