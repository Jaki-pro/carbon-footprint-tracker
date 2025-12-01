"use client";

import { useEffect, useState } from "react";

export default function Leaderboard() {
  const facts = [
    "Sorting through the greenest heroes...",
    "Measuring eco-footsteps with precision...",
    "Growing a forest of friendly competition...",
    "Almost ready to reveal the climate champions..."
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % facts.length);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-green-50 to-white p-6">
      
      {/* Floating animated eco particles */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 25 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-300 rounded-full opacity-70 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Glow ring */}
      <div className="absolute w-72 h-72 bg-green-200 blur-3xl opacity-30 rounded-full animate-pulse"></div>

      {/* Leaf Loader */}
      <div className="relative flex items-center justify-center mb-8">
        <div className="w-16 h-16 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
        <div className="absolute text-4xl">🍃</div>
      </div>

      {/* Header */}
      <h1 className="text-3xl sm:text-4xl font-bold text-green-700">
        The Eco-Leaderboard is Growing...
      </h1>

      {/* Dynamic teaser text */}
      <p className="text-lg text-gray-700 mt-4 h-6">
        {facts[index]}
      </p>

      {/* Sub-text */}
      <p className="mt-6 text-gray-500 max-w-md text-center leading-relaxed">
        We're analyzing footprints, ranking climate actions,  
        and preparing a one-of-a-kind leaderboard that celebrates your impact.
      </p>

      {/* Keyframe styling */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(-20px); opacity: 0.4; }
          100% { transform: translateY(0px); opacity: 0.8; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </main>
  );
}
