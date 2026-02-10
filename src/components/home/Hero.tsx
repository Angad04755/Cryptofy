"use client";
import { motion, useAnimationControls } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
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
  
    document.body.style.overflow="hidden";
    // Trigger text animation after hydration
    controls.start({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    });
   

    // Generate particles on client only (hydration safe)
    const generatedParticles = Array.from({ length: NUM_PARTICLES }, () => ({
      size: Math.random() * 4 + 1,
      top: Math.random() * 100,
      left: Math.random() * 100,
      xOffset: Math.random() * 30 - 10,
      yOffset: Math.random() * 30 - 10,
      duration: 2 + Math.random() * 4,
    }));

    setParticles(generatedParticles);

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [controls]);

   useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      })
    })

  return (
    <div className="relative min-w-full min-h-screen bg-black flex justify-center overflow-hidden">
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
        <Button text="View prices"/>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;