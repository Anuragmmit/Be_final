import React, { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { motion, useInView, useScroll, useTransform } from "framer-motion";

const Description = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.6, 1],
    [0.3, 1, 1, 0.8]
  );

  // Text reveal animation variants
  const wordVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    }),
  };

  // Split title text to animate each word individually
  const titleWords = "Turn your imagination into a real story".split(" ");

  // Particle backgrounds
  const particles = [...Array(20)].map((_, i) => ({
    id: i,
    size: 3 + Math.random() * 7,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: 15 + Math.random() * 20,
  }));

  return (
    <motion.div
      ref={ref}
      className="relative flex flex-col items-center justify-center min-h-screen px-4 py-16 overflow-hidden"
      style={{
        y,
        opacity,
      }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 z-0"
        animate={{
          background: [
            "linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899)",
            "linear-gradient(to right, #3b82f6, #8b5cf6, #d946ef)",
            "linear-gradient(to right, #6366f1, #a855f7, #ec4899)",
            "linear-gradient(to right, #4f46e5, #8b5cf6, #ec4899)",
          ],
        }}
        transition={{
          duration: 15,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white opacity-30"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            x: [0, Math.random() > 0.5 ? 100 : -100],
            y: [0, Math.random() > 0.5 ? 50 : -50],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Animated Circles */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 30, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        style={{ top: "10%", left: "15%" }}
      />

      <motion.div
        className="absolute w-[300px] h-[300px] rounded-full bg-pink-500/10 blur-2xl"
        animate={{
          scale: [1, 1.1, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        style={{ bottom: "20%", right: "10%" }}
      />

      <div className="relative z-10 text-center">
        {/* Title with word-by-word animation */}
        <h1 className="mb-6 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl flex flex-wrap justify-center gap-x-3">
          {titleWords.map((word, i) => (
            <motion.span
              key={i}
              custom={i}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={wordVariants}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        {/* Description with staggered animation */}
        <motion.p
          className="mb-12 text-lg font-normal text-white lg:text-xl sm:px-16 xl:px-48 leading-relaxed"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            ease: [0.2, 0.65, 0.3, 0.9],
          }}
        >
          Welcome to our{" "}
          <span className="font-semibold text-blue-100">
            Imagination Platform
          </span>
          , where your creativity takes center stage. Here, you can bring your
          stories to life with vivid details, accompanied by images that capture
          the essence of each moment.
        </motion.p>

        {/* Animated Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{
            duration: 0.6,
            delay: 1.2,
            type: "spring",
            stiffness: 200,
          }}
          className="relative"
        >
          {/* Animated glow effect */}
          <motion.div
            className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-75 blur"
            animate={{
              opacity: [0.5, 0.8, 0.5],
              scale: [0.98, 1.02, 0.98],
              rotate: [0, 3, 0, -3, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />

          <NavLink
            to="story-genration"
            className="relative block px-8 py-4 font-bold text-white bg-gradient-to-r from-blue-600 to-purple-700 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 group overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center text-lg">
              Start Creation
              <motion.svg
                className="w-5 h-5 ml-2"
                animate={{
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 10"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 5h12m0 0L9 1m4 4L9 9"
                />
              </motion.svg>
            </span>

            {/* Shine effect */}
            <motion.span
              className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
              animate={{ translateX: ["100%", "-100%"] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            />
          </NavLink>
        </motion.div>

        {/* Inspirational Text with Typing Effect */}
        <motion.div
          className="mt-12 text-center perspective"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <motion.p
            className="text-lg font-medium text-white/90 max-w-md mx-auto"
            animate={{
              textShadow: [
                "0 0 8px rgba(255,255,255,0.4)",
                "0 0 16px rgba(255,255,255,0.6)",
                "0 0 8px rgba(255,255,255,0.4)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <em>Let your creativity unfold with every step!</em>
          </motion.p>

          {/* Creative Animated Icons */}
          <motion.div
            className="flex justify-center mt-4 space-x-4"
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.2,
                },
              },
            }}
          >
            {["✨", "🎨", "🖋️", "🌟", "📚"].map((icon, index) => (
              <motion.span
                key={index}
                className="text-2xl"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 },
                }}
                whileHover={{
                  scale: 1.5,
                  rotate: [0, 10, -10, 0],
                  transition: { duration: 0.3 },
                }}
              >
                {icon}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Description;
