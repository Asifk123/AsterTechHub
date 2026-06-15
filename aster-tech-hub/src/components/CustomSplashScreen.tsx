'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CustomSplashScreen() {
  const [show, setShow] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out after 1.2 seconds
    const fadeTimeout = setTimeout(() => {
      setFade(true);
    }, 1200);

    // Completely remove from DOM after 1.7 seconds (allowing 500ms for transition)
    const removeTimeout = setTimeout(() => {
      setShow(false);
    }, 1700);

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(removeTimeout);
    };
  }, []);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 bg-[#0a0a0f] flex flex-col items-center justify-center z-[99999] transition-opacity duration-500 ease-out ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center max-w-xs px-6 text-center animate-fade-in">
        {/* Glowing Logo Card */}
        <div className="relative w-28 h-28 mb-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center p-4 neon-glow">
          <Image
            src="/favicon.png"
            alt="Aster Tech Logo"
            width={80}
            height={80}
            className="object-contain"
            priority
          />
        </div>
        
        {/* Brand Name */}
        <h1 className="text-xl font-bold tracking-wider text-white mb-2" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          ASTER TECH HUB
        </h1>
        
        {/* Animated Slogan */}
        <p 
          className="text-xs tracking-widest text-[#00d4ff] font-medium uppercase animate-pulse" 
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Innovate Your Tomorrow
        </p>
      </div>
    </div>
  );
}
