"use client";

import React from "react";
import Link from "next/link";

export default function PendingAccess({ name = "Team Member", type = "Team Member" }) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-700" />
      
      <div className="max-w-2xl w-full text-center relative z-10">
        {/* Animated Icon */}
        <div className="mb-8 relative inline-block">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 flex items-center justify-center mx-auto relative z-10 animate-in zoom-in duration-1000">
            <span className="material-symbols-outlined text-5xl text-primary animate-pulse">verified_user</span>
          </div>
          <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl animate-ping opacity-20" />
        </div>

        {/* Text Content */}
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <h1 className="text-4xl md:text-5xl font-headline font-black mb-4 text-white">
            Verification <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">In Progress</span>
          </h1>
          
          <p className="text-lg text-on-surface-variant mb-8 max-w-lg mx-auto leading-relaxed">
            Welcome to the frontier, <span className="text-white font-bold">{name}</span>. 
            Your <span className="text-secondary font-bold">{type}</span> account has been successfully created. 
          </p>

          <div className="glass-panel border-white/5 p-8 rounded-3xl mb-10 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="flex items-center gap-4 mb-6 justify-center">
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
              <p className="text-sm font-headline font-bold uppercase tracking-[0.2em] text-primary">Awaiting Admin Approval</p>
              <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed">
              To maintain the premium security of Aster Tech Hub, our CEO **Asif K** is personally reviewing your credentials. 
              Once verified, your specialized dashboard will unlock automatically.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="px-8 py-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-headline font-bold transition-all flex items-center gap-2 group"
            >
              <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
              Back to Home
            </Link>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-headline font-black shadow-[0_0_30px_rgba(0,212,255,0.3)] hover:scale-105 transition-all flex items-center gap-2"
            >
              Check Status
              <span className="material-symbols-outlined text-sm">refresh</span>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 pt-8 border-t border-white/5 animate-in fade-in duration-1000 delay-500">
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold">
            Aster Tech Hub • Secure Node • Davangere, India
          </p>
        </div>
      </div>
    </div>
  );
}
