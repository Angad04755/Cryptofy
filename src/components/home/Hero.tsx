"use client";
import { motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface Particle {
  size: number;
  top: number;
  left: number;
  xOffset: number;
  yOffset: number;
  duration: number;
}

const NUM_PARTICLES = 150;

const Hero = () => {
  const controls = useAnimationControls();
  const [particles, setParticles] = useState<Particle[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Prevent scrolling on mount
    document.body.style.overflow = 'hidden';
    
    // Trigger text animation after hydration
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.9,
        ease: "easeOut",
      },
    });

    // Generate particles on client only (hydration safe)
    const generatedParticles = Array.from({ length: NUM_PARTICLES }, () => ({
      size: Math.random() * 3 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      xOffset: Math.random() * 20 - 10,
      yOffset: Math.random() * 20 - 10,
      duration: 3 + Math.random() * 4,
    }));

    setParticles(generatedParticles);

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [controls]);

  return (
    <div className="relative w-full min-h-screen bg-black flex justify-center">
      {/* Spark Particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-white opacity-60"
          style={{
            width: p.size,
            height: p.size,
            top: `${p.top}%`,
            left: `${p.left}%`,
          }}
          animate={{
            x: [0, p.xOffset, 0],
            y: [0, p.yOffset, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Centered Content */}
      <motion.div
        className="relative z-10 text-center px-6 translate-y-20"
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
      >
         <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          Track Crypto in Real-Time
        </h1>
        <p className="text-xl md:text-2xl text-gray-400 font-light md:translate-y-5">
          Monitor prices, analyze trends, stay ahead of the market.
        </p>
        <div className="flex justify-center translate-y-5 md:translate-y-25" onClick={() => router.push("/prices")}>
        <button className="flex items-center gap-1 bg-white text-black px-2 py-1 text-lg rounded-xl
            hover:scale-110 hover:bg-black hover:text-white
            transition-all duration-300 active:scale-100">View prices</button>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;