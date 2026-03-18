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
  const router = useRouter();

  useEffect(() => {
    // Prevent scrolling on mount
  
    document.body.style.overflow="hidden";
    // Trigger text animation after hydration
   

    

    // Cleanup: restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

   useEffect(() => {
      window.scrollTo({
        top: 0,
        behavior: "instant"
      })
    })

  return (
    <section className="relative w-full min-h-screen bg-black flex justify-center overflow-hidden bg-gradient-to-b from-red-300 to-orange-300" style={{animation: "fadeup 0.6s ease-in-out"}}>
      

      {/* Centered Content */}
      <article
        className="relative z-10 text-center px-6 translate-y-20">
         <h1 className="text-6xl md:text-8xl font-bold text-white mb-4">
          Track Crypto in Real-Time
        </h1>
        <p className="text-xl md:text-2xl text-black-400 font-light md:translate-y-10">
          Monitor prices, analyze trends, stay ahead of the market.
        </p>
        <div className="flex justify-center translate-y-5 md:translate-y-25" onClick={() => router.push("/prices")}>
        <Button text="View prices" classname="flex items-center gap-1 bg-blue-500 text-white px-2 py-1 text-lg w-fit rounded-xl cursor-pointer
hover:scale-110 hover:bg-white hover:text-black
transition-all duration-300 active:scale-100"/>
        </div>
        
    </article>
    </section>

  );
};

export default Hero;