import React from "react";
import { Box } from "@/app/components/playbook";

type Variant = "bar" | "donut" | "horizontal";

interface Props {
  variant?: Variant;
  color?: string;
}

export const DashboardPreview: React.FC<Props> = ({ variant = "bar", color = "#ffffff" }) => {
  return (
    <Box
      sx={{
        width: "86%",
        maxWidth: "220px",
        aspectRatio: "16/9",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {variant === "bar" && (
        <svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="160" height="90" rx="6" fill="rgba(255,255,255,0.95)" />
          {/* Grid lines */}
          <line x1="16" y1="16" x2="144" y2="16" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="16" y1="32" x2="144" y2="32" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="16" y1="48" x2="144" y2="48" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="16" y1="64" x2="144" y2="64" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          
          {/* Bars with gradient effect */}
          <defs>
            <linearGradient id="barGrad1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="1" />
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="barGrad2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5BA3F5" stopOpacity="1" />
              <stop offset="100%" stopColor="#5BA3F5" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="barGrad3" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D7EC8" stopOpacity="1" />
              <stop offset="100%" stopColor="#3D7EC8" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="barGrad4" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6BB8FF" stopOpacity="1" />
              <stop offset="100%" stopColor="#6BB8FF" stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="barGrad5" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5296E8" stopOpacity="1" />
              <stop offset="100%" stopColor="#5296E8" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          
          <rect x="20" y="42" width="14" height="32" rx="2" fill="url(#barGrad1)" />
          <rect x="42" y="28" width="14" height="46" rx="2" fill="url(#barGrad2)" />
          <rect x="64" y="18" width="14" height="56" rx="2" fill="url(#barGrad3)" />
          <rect x="86" y="36" width="14" height="38" rx="2" fill="url(#barGrad4)" />
          <rect x="108" y="24" width="14" height="50" rx="2" fill="url(#barGrad5)" />
          <rect x="130" y="32" width="14" height="42" rx="2" fill="url(#barGrad1)" />
          
          {/* Axis */}
          <line x1="16" y1="74" x2="144" y2="74" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </svg>
      )}

      {variant === "donut" && (
        <svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="160" height="90" rx="6" fill="rgba(255,255,255,0.95)" />
          <defs>
            <filter id="donutShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1" />
            </filter>
          </defs>
          <g transform="translate(80,45)" filter="url(#donutShadow)">
            {/* Donut segments */}
            <path d="M 24 0 A 24 24 0 0 1 12 20.78 L 7.5 13 A 15 15 0 0 0 15 0 Z" fill="#4A90E2" opacity="0.95" />
            <path d="M 12 20.78 A 24 24 0 0 1 -12 20.78 L -7.5 13 A 15 15 0 0 0 7.5 13 Z" fill="#5BA3F5" opacity="0.9" />
            <path d="M -12 20.78 A 24 24 0 0 1 -24 0 L -15 0 A 15 15 0 0 0 -7.5 13 Z" fill="#6BB8FF" opacity="0.85" />
            <path d="M -24 0 A 24 24 0 0 1 -12 -20.78 L -7.5 -13 A 15 15 0 0 0 -15 0 Z" fill="#7DC8FF" opacity="0.8" />
            <path d="M -12 -20.78 A 24 24 0 0 1 12 -20.78 L 7.5 -13 A 15 15 0 0 0 -7.5 -13 Z" fill="#3D7EC8" opacity="0.9" />
            <path d="M 12 -20.78 A 24 24 0 0 1 24 0 L 15 0 A 15 15 0 0 0 7.5 -13 Z" fill="#5296E8" opacity="0.88" />
            {/* Center hole */}
            <circle r="15" fill="rgba(255,255,255,0.98)" />
          </g>
        </svg>
      )}

      {variant === "horizontal" && (
        <svg viewBox="0 0 160 90" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
          <rect x="0" y="0" width="160" height="90" rx="6" fill="rgba(255,255,255,0.95)" />
          {/* Grid lines */}
          <line x1="40" y1="12" x2="40" y2="78" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="70" y1="12" x2="70" y2="78" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="100" y1="12" x2="100" y2="78" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          <line x1="130" y1="12" x2="130" y2="78" stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" />
          
          <defs>
            <linearGradient id="hbarGrad1" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hbarGrad2" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5BA3F5" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#5BA3F5" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hbarGrad3" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6BB8FF" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#6BB8FF" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hbarGrad4" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#3D7EC8" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3D7EC8" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="hbarGrad5" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#5296E8" stopOpacity="0.88" />
              <stop offset="100%" stopColor="#5296E8" stopOpacity="1" />
            </linearGradient>
          </defs>
          
          {/* Horizontal bars */}
          <rect x="40" y="14" width="98" height="9" rx="2" fill="url(#hbarGrad1)" />
          <rect x="40" y="28" width="76" height="9" rx="2" fill="url(#hbarGrad2)" />
          <rect x="40" y="42" width="86" height="9" rx="2" fill="url(#hbarGrad3)" />
          <rect x="40" y="56" width="62" height="9" rx="2" fill="url(#hbarGrad4)" />
          <rect x="40" y="70" width="52" height="9" rx="2" fill="url(#hbarGrad5)" />
          
          {/* Y-axis */}
          <line x1="40" y1="12" x2="40" y2="80" stroke="rgba(0,0,0,0.15)" strokeWidth="1" />
        </svg>
      )}
    </Box>
  );
};

export default DashboardPreview;
