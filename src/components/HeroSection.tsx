"use client";

import React from "react";
import { type SpeedLinesConfig } from "./SpeedLinesBackground";

type HeroSectionProps = {
  config: SpeedLinesConfig;
};

const HeroSection: React.FC<HeroSectionProps> = ({ config }) => {
  if (!config.showOverlay) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
      {/* Center glow — radial gradient from inner to outer color */}
      {config.showCenterGlow && (
        <div
          className="absolute"
          style={{
            width: config.centerGlowRadius * 2,
            height: config.centerGlowRadius * 2,
            top: `calc(50% + ${config.centerGlowY}px)`,
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${config.centerGlowColor} 0%, ${config.centerGlowColorOuter} 50%, transparent 70%)`,
            opacity: config.centerGlowOpacity,
          }}
        />
      )}

      {/* Orthogonal grid */}
      {config.showGrid && (
        <svg
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="grid-fade-v" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="30%" stopColor="white" stopOpacity="0.6" />
              <stop offset="60%" stopColor="white" stopOpacity="1" />
              <stop offset="90%" stopColor="white" stopOpacity="0.6" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="grid-fade-h" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="25%" stopColor="white" stopOpacity="1" />
              <stop offset="75%" stopColor="white" stopOpacity="1" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="grid-mask">
              <rect width="100%" height="100%" fill="url(#grid-fade-v)" />
              <rect width="100%" height="100%" fill="url(#grid-fade-h)" style={{ mixBlendMode: "multiply" }} />
            </mask>
            <pattern
              id="grid-pattern"
              width={config.gridSize}
              height={config.gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${config.gridSize} 0 L 0 0 0 ${config.gridSize}`}
                fill="none"
                stroke={config.gridColor}
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="url(#grid-pattern)"
            mask="url(#grid-mask)"
            opacity={config.gridOpacity}
          />
        </svg>
      )}

      {/* Text block */}
      <div
        className="pointer-events-auto relative z-20 flex w-[1200px] flex-col items-center gap-[10px] px-5 text-center"
        style={{ transform: `translateY(${config.overlayY}px)` }}
      >
        {config.overlayHeading && (
          <h1
            className="font-semibold tracking-tight text-white drop-shadow-lg"
            style={{ fontSize: 52, lineHeight: "70px" }}
          >
            {config.overlayHeading}
          </h1>
        )}

        {config.overlaySubtext && (
          <p
            className="max-w-[620px] flex w-fit text-white/30 mb-[25px]"
            style={{ fontSize: 26, lineHeight: "38px" }}
          >
            {config.overlaySubtext}
          </p>
        )}

        {config.overlayButtonText && (
          <a
            href={config.overlayButtonUrl || "#"}
            tabIndex={0}
            aria-label={config.overlayButtonText}
            className="group relative mt-[4px] overflow-hidden rounded-[60px] backdrop-blur-[38px] cursor-pointer transition-all duration-300 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/40"
            style={{
              height: 64,
              border: "none",
              background:
                "linear-gradient(93deg, rgba(255, 255, 255, 0.02) 0%, rgba(142, 144, 145, 0.02) 100%)",
              boxShadow: "0 8px 32px 0 rgba(144, 173, 157, 0.25) inset",
            }}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 overflow-hidden rounded-[60px]"
              style={{ mixBlendMode: "screen" }}
            >
              <div
                className="absolute top-0 left-0 h-full"
                style={{
                  width: "50%",
                  background:
                    "radial-gradient(ellipse 100% 100% at center, rgba(48, 134, 152, 0.35) 0%, rgba(48, 134, 152, 0.18) 40%, transparent 70%)",
                  filter: "blur(20px)",
                  animation: "glow-from-left 6s ease-in infinite",
                }}
              />
              <div
                className="absolute top-0 right-0 h-full"
                style={{
                  width: "50%",
                  background:
                    "radial-gradient(ellipse 100% 100% at center, rgba(140, 220, 150, 0.35) 0%, rgba(189, 237, 143, 0.18) 40%, transparent 70%)",
                  filter: "blur(20px)",
                  animation: "glow-from-right 6s ease-in infinite",
                }}
              />
            </div>
            <div
              className="relative flex h-full items-center justify-center rounded-full px-[36px]"
              style={{ boxShadow: "inset 0px 2px 8px 0px rgba(255, 255, 255, 0.02)" }}
            >
              <span
                className="bg-clip-text text-[20px] font-semibold leading-none tracking-[2px] text-transparent uppercase"
                style={{
                  backgroundImage:
                    "linear-gradient(267deg, rgb(189, 237, 143) 4%, rgb(48, 134, 152) 100%)",
                }}
              >
                {config.overlayButtonText}
              </span>
            </div>
          </a>
        )}
      </div>
    </div>
  );
};

export default HeroSection;
