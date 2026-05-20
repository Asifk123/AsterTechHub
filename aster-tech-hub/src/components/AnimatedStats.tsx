"use client";

import { useEffect, useState, useRef } from "react";

const AnimatedNumber = ({ target, duration = 2000, suffix = "" }: { target: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          observer.disconnect(); // Only animate once
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const increment = target / (duration / 16); // ~60fps
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [target, duration, inView]);

  return (
    <div ref={nodeRef} className="text-4xl md:text-5xl font-headline font-black text-on-surface mb-2">
      {count}{suffix}
    </div>
  );
};

export default function AnimatedStats() {
  return (
    <section className="py-8 md:py-12 bg-surface-container-low border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">
        <div className="relative group cursor-default flex flex-col items-center">
          <AnimatedNumber target={50} suffix="+" />
          <div className="text-on-surface-variant font-headline tracking-widest uppercase text-sm">
            Projects Delivered
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-12 transition-all duration-500"></div>
        </div>
        <div className="relative group cursor-default flex flex-col items-center">
          <AnimatedNumber target={45} suffix="+" />
          <div className="text-on-surface-variant font-headline tracking-widest uppercase text-sm">
            Happy Clients
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-1 bg-secondary group-hover:w-12 transition-all duration-500"></div>
        </div>
        <div className="relative group cursor-default flex flex-col items-center">
          <AnimatedNumber target={98} suffix="%" />
          <div className="text-on-surface-variant font-headline tracking-widest uppercase text-sm">
            Satisfaction Rate
          </div>
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-1 bg-primary group-hover:w-12 transition-all duration-500"></div>
        </div>
      </div>
    </section>
  );
}
