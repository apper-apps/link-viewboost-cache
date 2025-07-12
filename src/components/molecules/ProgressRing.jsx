import React from "react";

const ProgressRing = ({ 
  progress, 
  size = 120, 
  strokeWidth = 8, 
  className = "" 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = `${progress * circumference / 100} ${circumference}`;

  return (
    <div className={`relative ${className}`}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#374151"
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress-gradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out progress-ring"
        />
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF0000" />
            <stop offset="100%" stopColor="#00F0FF" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-2xl font-bold font-display text-white">
          {Math.round(progress)}%
        </span>
      </div>
    </div>
  );
};

export default ProgressRing;