
import React from 'react';

export const AuthVisualEffects: React.FC = () => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900/20 to-black overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-pink-600/30 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 via-transparent to-violet-500/20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 opacity-60">
        {/* Large floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s', animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-40 w-28 h-28 bg-gradient-to-r from-violet-400/20 to-purple-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '7s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 right-20 w-20 h-20 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '9s', animationDelay: '3s' }}></div>

        {/* Medium floating particles */}
        <div className="absolute top-32 left-1/3 w-12 h-12 bg-gradient-to-r from-yellow-400/30 to-orange-400/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-gradient-to-r from-green-400/25 to-emerald-400/25 rounded-full blur-lg animate-pulse" style={{ animationDuration: '5s', animationDelay: '1.5s' }}></div>
        <div className="absolute bottom-1/3 left-1/4 w-10 h-10 bg-gradient-to-r from-rose-400/30 to-pink-400/30 rounded-full blur-lg animate-pulse" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}></div>

        {/* Small twinkling dots */}
        <div className="absolute top-16 right-1/3 w-2 h-2 bg-white/60 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-1 h-1 bg-blue-300/80 rounded-full animate-ping" style={{ animationDuration: '3s', animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/4 right-1/2 w-2 h-2 bg-purple-300/70 rounded-full animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-16 left-1/3 w-1 h-1 bg-cyan-300/80 rounded-full animate-ping" style={{ animationDuration: '1.8s', animationDelay: '1.2s' }}></div>
      </div>

      {/* Enhanced Flowing Lines Effect */}
      <div className="absolute inset-0 opacity-40">
        <svg className="w-full h-full" viewBox="0 0 800 600" fill="none">
          <defs>
            <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="flowGradient2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6" />
              <stop offset="50%" stopColor="#ef4444" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="flowGradient3" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.5" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
          
          {/* Animated flowing curved lines */}
          <path
            d="M-100,300 Q200,100 400,250 T800,200"
            stroke="url(#flowGradient1)"
            strokeWidth="3"
            fill="none"
            className="animate-pulse"
          />
          <path
            d="M-100,400 Q300,200 500,350 T900,300"
            stroke="url(#flowGradient2)"
            strokeWidth="2"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1s' }}
          />
          <path
            d="M-100,150 Q250,50 450,200 T850,150"
            stroke="url(#flowGradient1)"
            strokeWidth="1.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '2s' }}
          />
          <path
            d="M-100,500 Q350,300 550,450 T950,400"
            stroke="url(#flowGradient3)"
            strokeWidth="2.5"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '1.5s' }}
          />
          <path
            d="M-100,100 Q400,0 600,150 T1000,100"
            stroke="url(#flowGradient2)"
            strokeWidth="1.8"
            fill="none"
            className="animate-pulse"
            style={{ animationDelay: '0.5s' }}
          />
        </svg>
      </div>
      
      {/* Enhanced Radial Gradient Overlay with Animation */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-600/20 via-transparent to-black/60 animate-pulse" style={{ animationDuration: '4s' }}></div>
      
      {/* Subtle moving background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 animate-pulse transform-gpu" style={{ animationDuration: '8s' }}></div>
        <div className="absolute inset-0 bg-gradient-to-l from-transparent via-blue-400/5 to-transparent -skew-x-12 animate-pulse transform-gpu" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
      </div>
    </div>
  );
};
