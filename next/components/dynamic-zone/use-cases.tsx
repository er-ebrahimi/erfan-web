'use client';

import { IconBriefcase } from '@tabler/icons-react';
import React from 'react';

import { Container } from '../container';
import { Heading } from '../elements/heading';
import { Subheading } from '../elements/subheading';
import { FeatureIconContainer } from './features/feature-icon-container';
import { Carousel, Card } from '../ui/apple-cards-carousel';
import { getStrapiMedia } from '../ui/strapi-image';
import { getLocaleConfig } from '@/lib/fonts';
import { cn } from '@/lib/utils';

interface UseCase {
  id?: number;
  title: string;
  category?: string;
  description?: string;
  image?: any;
}

interface UseCasesProps {
  heading: string;
  sub_heading: string;
  use_cases?: UseCase[];
  locale: string;
}

// ---------------------------------------------------------------------------
// Category-themed SVG illustrations (no external images)
// ---------------------------------------------------------------------------

const RetailVisual = () => (
  <svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="r-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1e1b4b" />
        <stop offset="100%" stopColor="#2e1065" />
      </linearGradient>
      <radialGradient id="r-glow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
        <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="r-bubble1" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4f46e5" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
    <rect width="400" height="640" fill="url(#r-bg)" />
    <rect width="400" height="640" fill="url(#r-glow)" />

    {/* Grid dots */}
    {[60, 120, 180, 240, 300, 360].map(x =>
      [80, 160, 240, 320, 400, 480, 560].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#818cf8" fillOpacity="0.18" />
      ))
    )}

    {/* Shopping bag */}
    <g transform="translate(125, 150)">
      <rect x="0" y="48" width="150" height="120" rx="14" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeOpacity="0.6" />
      <path d="M 38 48 Q 38 0 75 0 Q 112 0 112 48" fill="none" stroke="#818cf8" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round" />
      <circle cx="75" cy="108" r="16" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeOpacity="0.5" />
      <path d="M 67 108 L 72 113 L 83 102" fill="none" stroke="#a5b4fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" />
    </g>

    {/* Chat bubble – top left */}
    <g transform="translate(44, 100)">
      <rect x="0" y="0" width="130" height="44" rx="22" fill="url(#r-bubble1)" fillOpacity="0.85" />
      <rect x="14" y="14" width="70" height="5" rx="2.5" fill="white" fillOpacity="0.55" />
      <rect x="14" y="25" width="46" height="5" rx="2.5" fill="white" fillOpacity="0.35" />
      <polygon points="22,44 12,60 34,44" fill="#4f46e5" fillOpacity="0.85" />
    </g>

    {/* Chat bubble – right */}
    <g transform="translate(210, 340)">
      <rect x="0" y="0" width="148" height="48" rx="24" fill="#6366f1" fillOpacity="0.65" />
      <rect x="14" y="16" width="84" height="5" rx="2.5" fill="white" fillOpacity="0.5" />
      <rect x="14" y="27" width="54" height="5" rx="2.5" fill="white" fillOpacity="0.3" />
      <polygon points="128,48 138,64 110,48" fill="#6366f1" fillOpacity="0.65" />
    </g>

    {/* AI bot face */}
    <g transform="translate(148, 460)">
      <rect x="0" y="0" width="104" height="90" rx="16" fill="#312e81" fillOpacity="0.7" stroke="#6366f1" strokeWidth="1.5" strokeOpacity="0.5" />
      <rect x="38" y="-18" width="28" height="22" rx="6" fill="#4338ca" fillOpacity="0.8" />
      <circle cx="52" cy="-18" r="5" fill="#818cf8" fillOpacity="0.7" />
      <circle cx="34" cy="35" r="10" fill="#6366f1" fillOpacity="0.6" />
      <circle cx="70" cy="35" r="10" fill="#6366f1" fillOpacity="0.6" />
      <circle cx="34" cy="35" r="4" fill="#a5b4fc" />
      <circle cx="70" cy="35" r="4" fill="#a5b4fc" />
      <path d="M 28 65 Q 52 78 76 65" fill="none" stroke="#a5b4fc" strokeWidth="3" strokeOpacity="0.7" strokeLinecap="round" />
    </g>

    {/* Stars */}
    {[[58, 430, 3], [330, 180, 2.5], [346, 420, 2], [72, 310, 2], [344, 560, 3], [300, 480, 2]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#c7d2fe" fillOpacity="0.5" />
    ))}

    {/* Price badge */}
    <g transform="translate(272, 262)">
      <rect x="0" y="0" width="80" height="34" rx="17" fill="#4338ca" fillOpacity="0.7" stroke="#818cf8" strokeWidth="1" strokeOpacity="0.5" />
      <text x="40" y="22" textAnchor="middle" fill="#e0e7ff" fontSize="13" fontFamily="monospace" fillOpacity="0.9">AI ✓</text>
    </g>
  </svg>
);

const HealthVisual = () => (
  <svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="h-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#042f2e" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
      <radialGradient id="h-glow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.22" />
        <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="640" fill="url(#h-bg)" />
    <rect width="400" height="640" fill="url(#h-glow)" />

    {/* Grid dots */}
    {[60, 120, 180, 240, 300, 360].map(x =>
      [80, 160, 240, 320, 400, 480, 560].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#5eead4" fillOpacity="0.15" />
      ))
    )}

    {/* Scan rings */}
    <circle cx="200" cy="280" r="140" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.18" strokeDasharray="6 6" />
    <circle cx="200" cy="280" r="100" fill="none" stroke="#14b8a6" strokeWidth="1" strokeOpacity="0.22" strokeDasharray="4 4" />
    <circle cx="200" cy="280" r="60" fill="none" stroke="#14b8a6" strokeWidth="1.5" strokeOpacity="0.3" />

    {/* Medical cross */}
    <g transform="translate(200, 280)">
      <rect x="-18" y="-52" width="36" height="104" rx="10" fill="#0d9488" fillOpacity="0.7" />
      <rect x="-52" y="-18" width="104" height="36" rx="10" fill="#0d9488" fillOpacity="0.7" />
      <rect x="-14" y="-48" width="28" height="96" rx="8" fill="#2dd4bf" fillOpacity="0.35" />
      <rect x="-48" y="-14" width="96" height="28" rx="8" fill="#2dd4bf" fillOpacity="0.35" />
    </g>

    {/* Heartbeat ECG */}
    <g transform="translate(0, 450)">
      <path
        d="M 0 40 L 60 40 L 80 20 L 100 60 L 120 10 L 140 70 L 160 40 L 220 40 L 240 25 L 260 55 L 280 40 L 400 40"
        fill="none" stroke="#34d399" strokeWidth="2.5" strokeOpacity="0.75" strokeLinecap="round" strokeLinejoin="round"
      />
    </g>

    {/* Image scan frame */}
    <g transform="translate(136, 130)">
      <rect x="0" y="0" width="128" height="100" rx="8" fill="none" stroke="#5eead4" strokeWidth="1.5" strokeOpacity="0.45" />
      {/* Corner marks */}
      <path d="M0 20 L0 0 L20 0" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
      <path d="M108 0 L128 0 L128 20" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
      <path d="M0 80 L0 100 L20 100" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
      <path d="M108 100 L128 100 L128 80" fill="none" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round" />
      {/* Scan line */}
      <line x1="0" y1="50" x2="128" y2="50" stroke="#14b8a6" strokeWidth="1.5" strokeOpacity="0.4" strokeDasharray="4 4" />
    </g>

    {/* Result badge */}
    <g transform="translate(120, 540)">
      <rect x="0" y="0" width="160" height="42" rx="21" fill="#0f766e" fillOpacity="0.7" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="24" cy="21" r="10" fill="#14b8a6" fillOpacity="0.5" />
      <path d="M 18 21 L 22 25 L 30 17" fill="none" stroke="#5eead4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="44" y="13" width="80" height="5" rx="2.5" fill="#99f6e4" fillOpacity="0.6" />
      <rect x="44" y="24" width="56" height="5" rx="2.5" fill="#99f6e4" fillOpacity="0.4" />
    </g>

    {/* Dots */}
    {[[54, 200, 2.5], [340, 160, 2], [358, 400, 2.5], [50, 500, 2], [350, 520, 3]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#99f6e4" fillOpacity="0.45" />
    ))}
  </svg>
);

const FinanceVisual = () => (
  <svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="f-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#1c1917" />
        <stop offset="100%" stopColor="#431407" />
      </linearGradient>
      <radialGradient id="f-glow" cx="50%" cy="55%" r="55%">
        <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="f-bar1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor="#c2410c" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="f-bar2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f97316" />
        <stop offset="100%" stopColor="#9a3412" stopOpacity="0.6" />
      </linearGradient>
    </defs>
    <rect width="400" height="640" fill="url(#f-bg)" />
    <rect width="400" height="640" fill="url(#f-glow)" />

    {/* Grid lines */}
    {[160, 240, 320, 400, 480].map((y, i) => (
      <line key={i} x1="40" y1={y} x2="360" y2={y} stroke="#fed7aa" strokeWidth="0.5" strokeOpacity="0.12" />
    ))}

    {/* Bar chart */}
    {[
      { x: 52,  h: 80,  grad: 'f-bar2' },
      { x: 112, h: 130, grad: 'f-bar1' },
      { x: 172, h: 100, grad: 'f-bar2' },
      { x: 232, h: 180, grad: 'f-bar1' },
      { x: 292, h: 240, grad: 'f-bar1' },
    ].map(({ x, h, grad }, i) => (
      <g key={i}>
        <rect x={x} y={440 - h} width="46" height={h} rx="6" fill={`url(#${grad})`} fillOpacity="0.85" />
        <rect x={x} y={440 - h} width="46" height="8" rx="4" fill="white" fillOpacity="0.15" />
      </g>
    ))}

    {/* Chart baseline */}
    <line x1="40" y1="440" x2="360" y2="440" stroke="#fed7aa" strokeWidth="1.5" strokeOpacity="0.3" />

    {/* Trend line */}
    <path d="M 75 390 L 135 350 L 195 360 L 255 300 L 315 240" fill="none"
      stroke="#fbbf24" strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="315" cy="240" r="5" fill="#fbbf24" fillOpacity="0.9" />

    {/* Upward arrow */}
    <path d="M 328 256 L 340 228 L 352 256" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeOpacity="0.8" strokeLinecap="round" strokeLinejoin="round" />

    {/* Shield (fraud protection) */}
    <g transform="translate(148, 120)">
      <path d="M 52 0 L 104 24 L 104 68 Q 104 112 52 132 Q 0 112 0 68 L 0 24 Z"
        fill="#92400e" fillOpacity="0.5" stroke="#fb923c" strokeWidth="1.5" strokeOpacity="0.5" />
      <path d="M 52 8 L 96 28 L 96 68 Q 96 104 52 122 Q 8 104 8 68 L 8 28 Z"
        fill="#f97316" fillOpacity="0.2" />
      <path d="M 34 68 L 46 80 L 70 56" fill="none" stroke="#fdba74" strokeWidth="3" strokeOpacity="0.85" strokeLinecap="round" strokeLinejoin="round" />
    </g>

    {/* Alert badge */}
    <g transform="translate(256, 136)">
      <rect x="0" y="0" width="96" height="36" rx="18" fill="#7c2d12" fillOpacity="0.8" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.5" />
      <circle cx="18" cy="18" r="8" fill="#ef4444" fillOpacity="0.7" />
      <text x="18" y="23" textAnchor="middle" fill="white" fontSize="12" fillOpacity="0.9">!</text>
      <rect x="34" y="11" width="46" height="4" rx="2" fill="#fed7aa" fillOpacity="0.6" />
      <rect x="34" y="21" width="30" height="4" rx="2" fill="#fed7aa" fillOpacity="0.4" />
    </g>

    {/* Safe badge */}
    <g transform="translate(30, 480)">
      <rect x="0" y="0" width="120" height="38" rx="19" fill="#431407" fillOpacity="0.9" stroke="#f97316" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="20" cy="19" r="9" fill="#16a34a" fillOpacity="0.6" />
      <path d="M 14 19 L 18 23 L 26 15" fill="none" stroke="#86efac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="36" y="11" width="68" height="4" rx="2" fill="#fed7aa" fillOpacity="0.55" />
      <rect x="36" y="21" width="44" height="4" rx="2" fill="#fed7aa" fillOpacity="0.35" />
    </g>

    {/* Sparkle dots */}
    {[[50, 180, 2.5], [360, 200, 2], [370, 480, 2.5], [30, 420, 2], [370, 340, 2]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#fed7aa" fillOpacity="0.4" />
    ))}
  </svg>
);

const ManufacturingVisual = () => (
  <svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="m-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#1e3a5f" />
      </linearGradient>
      <radialGradient id="m-glow" cx="50%" cy="48%" r="50%">
        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="400" height="640" fill="url(#m-bg)" />
    <rect width="400" height="640" fill="url(#m-glow)" />

    {/* Circuit grid */}
    {[80, 160, 240, 320, 400, 480, 560].map((y, i) => (
      <line key={`h${i}`} x1="0" y1={y} x2="400" y2={y} stroke="#60a5fa" strokeWidth="0.5" strokeOpacity="0.08" />
    ))}
    {[80, 160, 240, 320].map((x, i) => (
      <line key={`v${i}`} x1={x} y1="0" x2={x} y2="640" stroke="#60a5fa" strokeWidth="0.5" strokeOpacity="0.08" />
    ))}

    {/* Large gear */}
    <g transform="translate(200, 280)">
      {/* Gear teeth — 8 teeth */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x = Math.cos(angle) * 105;
        const y = Math.sin(angle) * 105;
        const rot = i * 45;
        return (
          <rect
            key={i}
            x={x - 12}
            y={y - 18}
            width="24"
            height="36"
            rx="4"
            fill="#1d4ed8"
            fillOpacity="0.65"
            stroke="#60a5fa"
            strokeWidth="1"
            strokeOpacity="0.4"
            transform={`rotate(${rot}, ${x}, ${y})`}
          />
        );
      })}
      {/* Outer ring */}
      <circle cx="0" cy="0" r="90" fill="none" stroke="#3b82f6" strokeWidth="2" strokeOpacity="0.45" />
      {/* Inner ring */}
      <circle cx="0" cy="0" r="68" fill="#1e3a5f" fillOpacity="0.6" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.35" />
      {/* Spokes */}
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        return (
          <line key={i}
            x1={Math.cos(angle) * 24} y1={Math.sin(angle) * 24}
            x2={Math.cos(angle) * 64} y2={Math.sin(angle) * 64}
            stroke="#93c5fd" strokeWidth="2" strokeOpacity="0.4"
          />
        );
      })}
      {/* Center hub */}
      <circle cx="0" cy="0" r="24" fill="#1d4ed8" fillOpacity="0.7" />
      <circle cx="0" cy="0" r="14" fill="#2563eb" fillOpacity="0.5" />
      <circle cx="0" cy="0" r="6" fill="#93c5fd" fillOpacity="0.7" />
    </g>

    {/* Crosshair target */}
    <g transform="translate(200, 280)">
      <circle cx="0" cy="0" r="130" fill="none" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.2" strokeDasharray="8 6" />
      <line x1="-140" y1="0" x2="-96" y2="0" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="96" y1="0" x2="140" y2="0" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="0" y1="-140" x2="0" y2="-96" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="0" y1="96" x2="0" y2="140" stroke="#60a5fa" strokeWidth="1.5" strokeOpacity="0.4" />
    </g>

    {/* Status panel */}
    <g transform="translate(36, 100)">
      <rect x="0" y="0" width="130" height="80" rx="10" fill="#0f172a" fillOpacity="0.8" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.35" />
      {[0, 1, 2].map(i => (
        <g key={i} transform={`translate(12, ${16 + i * 22})`}>
          <circle cx="6" cy="6" r="5" fill={i === 1 ? '#ef4444' : '#22c55e'} fillOpacity="0.75" />
          <rect x="18" y="3" width="60" height="4" rx="2" fill="#93c5fd" fillOpacity="0.4" />
          <rect x="18" y="9" width={i === 1 ? 38 : 50} height="3" rx="1.5" fill="#93c5fd" fillOpacity="0.25" />
        </g>
      ))}
    </g>

    {/* Small gear top-right */}
    <g transform="translate(330, 140)">
      {Array.from({ length: 6 }, (_, i) => {
        const angle = (i * 60 * Math.PI) / 180;
        const x = Math.cos(angle) * 38;
        const y = Math.sin(angle) * 38;
        return (
          <rect key={i} x={x - 8} y={y - 12} width="16" height="24" rx="3"
            fill="#1d4ed8" fillOpacity="0.55" stroke="#60a5fa" strokeWidth="1" strokeOpacity="0.3"
            transform={`rotate(${i * 60}, ${x}, ${y})`} />
        );
      })}
      <circle cx="0" cy="0" r="32" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeOpacity="0.35" />
      <circle cx="0" cy="0" r="22" fill="#1e3a5f" fillOpacity="0.6" />
      <circle cx="0" cy="0" r="8" fill="#2563eb" fillOpacity="0.5" />
    </g>

    {/* Scan result badge */}
    <g transform="translate(110, 530)">
      <rect x="0" y="0" width="180" height="44" rx="22" fill="#1e3a5f" fillOpacity="0.85" stroke="#3b82f6" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="22" cy="22" r="11" fill="#22c55e" fillOpacity="0.5" />
      <path d="M 15 22 L 20 27 L 29 17" fill="none" stroke="#86efac" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="42" y="13" width="92" height="5" rx="2.5" fill="#bfdbfe" fillOpacity="0.6" />
      <rect x="42" y="24" width="60" height="5" rx="2.5" fill="#bfdbfe" fillOpacity="0.35" />
    </g>

    {[[ 46, 440, 2.5], [362, 200, 2], [370, 460, 2], [32, 300, 2], [354, 380, 2.5]].map(([cx, cy, r], i) => (
      <circle key={i} cx={cx} cy={cy} r={r} fill="#bfdbfe" fillOpacity="0.4" />
    ))}
  </svg>
);

const EducationVisual = () => (
  <svg viewBox="0 0 400 640" xmlns="http://www.w3.org/2000/svg" className="w-full h-full" preserveAspectRatio="xMidYMid slice">
    <defs>
      <linearGradient id="e-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#052e16" />
        <stop offset="100%" stopColor="#0c4a6e" />
      </linearGradient>
      <radialGradient id="e-glow" cx="50%" cy="45%" r="55%">
        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="e-bar" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#16a34a" />
        <stop offset="100%" stopColor="#4ade80" stopOpacity="0.7" />
      </linearGradient>
    </defs>
    <rect width="400" height="640" fill="url(#e-bg)" />
    <rect width="400" height="640" fill="url(#e-glow)" />

    {/* Dot grid */}
    {[60, 140, 220, 300, 380].map(x =>
      [80, 160, 240, 320, 400, 480, 560].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r="1" fill="#4ade80" fillOpacity="0.14" />
      ))
    )}

    {/* Open book */}
    <g transform="translate(200, 260)">
      {/* Left page */}
      <path d="M 0 0 L -90 -10 L -90 110 L 0 100 Z" fill="#14532d" fillOpacity="0.75" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Right page */}
      <path d="M 0 0 L 90 -10 L 90 110 L 0 100 Z" fill="#15803d" fillOpacity="0.65" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.4" />
      {/* Spine */}
      <path d="M 0 0 L 0 100" stroke="#86efac" strokeWidth="2" strokeOpacity="0.5" />
      {/* Text lines on left */}
      {[20, 38, 56, 74].map((y, i) => (
        <rect key={`l${i}`} x={-78} y={y} width={i % 2 === 0 ? 60 : 44} height="5" rx="2.5" fill="#86efac" fillOpacity="0.35" />
      ))}
      {/* Text lines on right */}
      {[20, 38, 56, 74].map((y, i) => (
        <rect key={`r${i}`} x={16} y={y} width={i % 2 === 0 ? 56 : 40} height="5" rx="2.5" fill="#86efac" fillOpacity="0.35" />
      ))}
    </g>

    {/* Graduation cap */}
    <g transform="translate(200, 130)">
      <polygon points="0,-32 80,0 0,32 -80,0" fill="#166534" fillOpacity="0.75" stroke="#4ade80" strokeWidth="1.5" strokeOpacity="0.4" />
      <rect x="-14" y="28" width="28" height="36" rx="0" fill="#166534" fillOpacity="0.6" />
      <rect x="-22" y="62" width="44" height="8" rx="4" fill="#14532d" fillOpacity="0.8" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="60" cy="0" r="5" fill="#4ade80" fillOpacity="0.5" />
      <path d="M 60 0 L 60 48" stroke="#4ade80" strokeWidth="2" strokeOpacity="0.4" />
      <circle cx="60" cy="50" r="7" fill="#16a34a" fillOpacity="0.6" />
    </g>

    {/* Progress bars (personalized learning) */}
    <g transform="translate(52, 460)">
      {[
        { label: 72, w: 210 },
        { label: 88, w: 256 },
        { label: 55, w: 160 },
      ].map(({ label, w }, i) => (
        <g key={i} transform={`translate(0, ${i * 38})`}>
          <rect x="0" y="0" width="296" height="18" rx="9" fill="#14532d" fillOpacity="0.6" />
          <rect x="0" y="0" width={w} height="18" rx="9" fill="url(#e-bar)" fillOpacity="0.85" />
          <text x={w - 6} y="13" textAnchor="end" fill="white" fontSize="10" fontFamily="monospace" fillOpacity="0.8">{label}%</text>
        </g>
      ))}
    </g>

    {/* Stars decorative */}
    {[[50, 200, 4], [344, 180, 3], [354, 440, 4], [42, 360, 3], [346, 330, 3]].map(([cx, cy, r], i) => (
      <polygon key={i}
        points={Array.from({ length: 5 }, (_, j) => {
          const angle = (j * 72 - 90) * Math.PI / 180;
          const ir = r as number * 0.4;
          const or = r as number;
          const even = `${cx + or * Math.cos(angle)},${cy + or * Math.sin(angle)}`;
          const midAngle = angle + (36 * Math.PI / 180);
          const odd = `${cx + ir * Math.cos(midAngle)},${cy + ir * Math.sin(midAngle)}`;
          return `${even} ${odd}`;
        }).join(' ')}
        fill="#86efac" fillOpacity="0.5"
      />
    ))}

    {/* AI badge */}
    <g transform="translate(260, 460)">
      <rect x="0" y="0" width="96" height="36" rx="18" fill="#14532d" fillOpacity="0.85" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.4" />
      <text x="48" y="23" textAnchor="middle" fill="#86efac" fontSize="13" fontFamily="monospace" fillOpacity="0.9">AI ✦</text>
    </g>
  </svg>
);

// Map category to a visual component
const CATEGORY_VISUALS: Record<string, React.ReactNode> = {
  'خرده‌فروشی': <RetailVisual />,
  'retail': <RetailVisual />,
  'سلامت': <HealthVisual />,
  'health': <HealthVisual />,
  'مالی': <FinanceVisual />,
  'finance': <FinanceVisual />,
  'تولید': <ManufacturingVisual />,
  'manufacturing': <ManufacturingVisual />,
  'آموزش': <EducationVisual />,
  'education': <EducationVisual />,
};

const FALLBACK_VISUALS = [
  <RetailVisual key="0" />,
  <HealthVisual key="1" />,
  <FinanceVisual key="2" />,
  <ManufacturingVisual key="3" />,
  <EducationVisual key="4" />,
];

function getCategoryVisual(category: string | undefined, index: number): React.ReactNode {
  if (category) {
    const lower = category.toLowerCase();
    const match = CATEGORY_VISUALS[category] ?? CATEGORY_VISUALS[lower];
    if (match) return match;
  }
  return FALLBACK_VISUALS[index % FALLBACK_VISUALS.length];
}

// ---------------------------------------------------------------------------

export const UseCases = ({
  heading,
  sub_heading,
  use_cases,
  locale,
}: UseCasesProps) => {
  const { fontClass, isRTL } = getLocaleConfig(locale);

  const cards = (use_cases ?? []).map((useCase, index) => {
    // Prefer Strapi-uploaded image; fall back to themed SVG visual
    const strapiUrl: string | null =
      useCase.image?.url && !useCase.image.url.startsWith('http')
        ? getStrapiMedia(useCase.image.url)
        : null;

    const visual = strapiUrl ? undefined : getCategoryVisual(useCase.category, index);

    const content = (
      <div
        dir={isRTL ? 'rtl' : 'ltr'}
        className={cn(
          'text-sm leading-relaxed text-neutral-600 dark:text-neutral-300',
          isRTL ? 'text-right font-iran-sans' : 'text-left'
        )}
      >
        {useCase.description ?? ''}
      </div>
    );

    return (
      <Card
        key={useCase.id ?? index}
        card={{
          src: strapiUrl ?? undefined,
          visual,
          title: useCase.title,
          category: useCase.category ?? '',
          content,
        }}
        index={index}
        layout
      />
    );
  });

  return (
    <section className={cn('py-20 relative overflow-hidden', fontClass)} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      <Container>
        <div className="flex flex-col items-center text-center mb-4">
          <FeatureIconContainer className="flex items-center justify-center overflow-hidden mb-4">
            <IconBriefcase className="h-6 w-6 text-foreground" />
          </FeatureIconContainer>
          <Heading className="pt-2">{heading}</Heading>
          <Subheading className="max-w-3xl mx-auto">{sub_heading}</Subheading>
        </div>
      </Container>

      {cards.length > 0 && <Carousel items={cards} isRTL={isRTL} />}
    </section>
  );
};
