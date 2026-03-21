"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { buildPaintingWheelCardImageSrcs } from "@/lib/paintingWheelPlaceholders";

export type PaintingWheelConfig = {
  perspective: number;
  /** Viewport zoom: scales the whole 3D scene (1 = 100%) */
  zoom: number;
  tiltX: number;
  tiltY: number;
  tiltZ: number;
  panX: number;
  panY: number;
  numCards: number;
  radius: number;
  cardW: number;
  cardH: number;
  cardRotX: number;
  cardRotY: number;
  cardRotZ: number;
  speed: number;
  reverse: boolean;
  paused: boolean;
  imageSeed: number;
  cardBorderRadius: number;
  cardStrokeVisible: boolean;
  cardStrokeWidth: number;
  cardStrokeColor: string;
  cardStrokeOpacity: number;
};

export const DEFAULT_PAINTING_WHEEL_CONFIG: PaintingWheelConfig = {
  perspective: 3000,
  zoom: 1.4,
  tiltX: -17,
  tiltY: -26,
  tiltZ: 22,
  panX: 0,
  panY: 0,
  numCards: 30,
  radius: 230,
  cardW: 200,
  cardH: 125,
  cardRotX: 0,
  cardRotY: 20,
  cardRotZ: 0,
  speed: 30,
  reverse: false,
  paused: false,
  imageSeed: 200,
  cardBorderRadius: 8,
  cardStrokeVisible: false,
  cardStrokeWidth: 1,
  cardStrokeColor: "#ffffff",
  cardStrokeOpacity: 0.1,
};

const CAMERA_RESET: Pick<
  PaintingWheelConfig,
  "perspective" | "zoom" | "tiltX" | "tiltY" | "tiltZ" | "panX" | "panY"
> = {
  perspective: DEFAULT_PAINTING_WHEEL_CONFIG.perspective,
  zoom: DEFAULT_PAINTING_WHEEL_CONFIG.zoom,
  tiltX: DEFAULT_PAINTING_WHEEL_CONFIG.tiltX,
  tiltY: DEFAULT_PAINTING_WHEEL_CONFIG.tiltY,
  tiltZ: DEFAULT_PAINTING_WHEEL_CONFIG.tiltZ,
  panX: DEFAULT_PAINTING_WHEEL_CONFIG.panX,
  panY: DEFAULT_PAINTING_WHEEL_CONFIG.panY,
};

type InteractiveCardProps = {
  index: number;
  total: number;
  imageSrc: string | undefined;
  radius: number;
  cardRotX: number;
  cardRotY: number;
  cardRotZ: number;
  borderRadiusPx: number;
  strokeVisible: boolean;
  strokeWidthPx: number;
  strokeColor: string;
  strokeOpacity: number;
};

const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const m = /^#?([0-9a-fA-F]{6})$/.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
};

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  index,
  total,
  imageSrc,
  radius,
  cardRotX,
  cardRotY,
  cardRotZ,
  borderRadiusPx,
  strokeVisible,
  strokeWidthPx,
  strokeColor,
  strokeOpacity,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), index * 25);
    return () => clearTimeout(timer);
  }, [index]);

  const targetAngle = (360 / total) * index;
  const currentAngle = isMounted ? targetAngle : 0;
  const currentRadius = isMounted ? radius : 0;
  const currentScale = isMounted ? 1 : 0.2;

  const rgb = hexToRgb(strokeColor);
  const borderColor =
    rgb && strokeVisible && strokeWidthPx > 0
      ? `rgba(${rgb.r},${rgb.g},${rgb.b},${Math.min(1, Math.max(0, strokeOpacity))})`
      : "transparent";

  const cardStyle: React.CSSProperties = {
    borderRadius: borderRadiusPx,
    borderWidth: strokeVisible && strokeWidthPx > 0 ? strokeWidthPx : 0,
    borderStyle: strokeVisible && strokeWidthPx > 0 ? "solid" : "none",
    borderColor,
  };

  return (
    <div
      className="absolute inset-0"
      style={{
        transitionProperty: "transform, opacity",
        transitionDuration: "500ms",
        transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)",
        transform: `
          rotateY(${currentAngle}deg)
          translateZ(${currentRadius}px)
          rotateX(${cardRotX}deg)
          rotateY(${cardRotY}deg)
          rotateZ(${cardRotZ}deg)
          scale(${currentScale})
        `,
        opacity: isMounted ? 1 : 0,
        backfaceVisibility: "visible",
      }}
    >
      <div
        className="group relative h-full w-full cursor-pointer overflow-hidden bg-gray-900 shadow-[0_0_30px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out hover:-translate-y-1"
        style={cardStyle}
      >
        {imageSrc && (
          <img
            src={imageSrc}
            alt={`Carousel image ${index + 1} of ${total}`}
            draggable={false}
            className="pointer-events-none h-full w-full select-none object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
          />
        )}
        <div
          className="pointer-events-none absolute inset-0 bg-linear-to-tr from-black/50 via-transparent to-white/10"
          style={{ borderRadius: borderRadiusPx }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

type PaintingWheelBackgroundProps = {
  config: PaintingWheelConfig;
  onConfigChange?: (config: PaintingWheelConfig) => void;
};

const PaintingWheelBackground: React.FC<PaintingWheelBackgroundProps> = ({
  config,
  onConfigChange,
}) => {
  const configRef = useRef(config);
  const onConfigChangeRef = useRef(onConfigChange);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDraggingRef = useRef(false);
  const lastPosRef = useRef({ x: 0, y: 0 });
  const dragButtonRef = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  configRef.current = config;
  onConfigChangeRef.current = onConfigChange;

  const cardImageSrcs = React.useMemo(
    () => buildPaintingWheelCardImageSrcs(config.imageSeed, config.numCards),
    [config.imageSeed, config.numCards]
  );

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isResetting) return;
    const t = setTimeout(() => setIsResetting(false), 2100);
    return () => clearTimeout(t);
  }, [isResetting]);

  const clearResetTimer = useCallback(() => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    setIsResetting(false);
  }, []);

  const pushConfig = useCallback((next: PaintingWheelConfig) => {
    onConfigChangeRef.current?.(next);
  }, []);

  const startResetTimer = useCallback(() => {
    clearResetTimer();
    resetTimerRef.current = setTimeout(() => {
      setIsResetting(true);
      const c = configRef.current;
      pushConfig({ ...c, ...CAMERA_RESET });
    }, 3000);
  }, [clearResetTimer, pushConfig]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      clearResetTimer();
      isDraggingRef.current = true;
      dragButtonRef.current = e.button;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      setIsDragging(true);
    },
    [clearResetTimer]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDraggingRef.current) return;
      clearResetTimer();
      const { x, y } = lastPosRef.current;
      const dx = e.clientX - x;
      const dy = e.clientY - y;
      lastPosRef.current = { x: e.clientX, y: e.clientY };
      const c = configRef.current;

      if (dragButtonRef.current === 2 || e.shiftKey) {
        pushConfig({
          ...c,
          panX: c.panX + dx,
          panY: c.panY + dy,
        });
      } else {
        pushConfig({
          ...c,
          tiltY: Math.min(Math.max(c.tiltY + dx * 0.3, -180), 180),
          tiltX: Math.min(Math.max(c.tiltX - dy * 0.3, -180), 180),
        });
      }
    },
    [clearResetTimer, pushConfig]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setIsDragging(false);
    startResetTimer();
  }, [startResetTimer]);

  const handleWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      e.preventDefault();
      clearResetTimer();
      const c = configRef.current;
      pushConfig({
        ...c,
        perspective: Math.min(Math.max(c.perspective + e.deltaY * 2, 300), 5000),
      });
      startResetTimer();
    },
    [clearResetTimer, pushConfig, startResetTimer]
  );

  return (
    <div
      className={`relative flex h-full w-full select-none items-center justify-center overflow-hidden bg-[#050505] font-sans text-white ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onWheel={handleWheel}
      onContextMenu={(e) => e.preventDefault()}
      role="application"
      aria-label="Painting wheel 3D carousel. Drag to rotate, scroll to zoom, right-click or shift-drag to pan."
    >
      <div className="pointer-events-none absolute bottom-6 left-6 z-10 flex items-center gap-2 text-gray-500/50">
        <svg
          className="h-[14px] w-[14px] shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3zM13 13l6 6"
          />
        </svg>
        <span className="text-xs tracking-wider uppercase">
          Drag to rotate · Scroll to zoom · Right-click to pan
        </span>
      </div>

      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          width: "100%",
          height: "100%",
          transform: `scale(${config.zoom})`,
          transformOrigin: "center center",
          transition: isDragging
            ? "none"
            : isResetting
              ? "transform 2s cubic-bezier(0.4, 0, 0.2, 1)"
              : "transform 0.15s ease-out",
        }}
      >
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            perspective: `${config.perspective}px`,
            transition: isResetting
              ? "perspective 2s cubic-bezier(0.4, 0, 0.2, 1)"
              : "perspective 0.15s ease-out",
          }}
        >
        <div
          className="relative flex items-center justify-center"
          style={{
            transform: `translate(${config.panX}px, ${config.panY}px) rotateX(${config.tiltX}deg) rotateY(${config.tiltY}deg) rotateZ(${config.tiltZ}deg)`,
            transformStyle: "preserve-3d",
            transition: isDragging
              ? "none"
              : isResetting
                ? "transform 2s cubic-bezier(0.4, 0, 0.2, 1)"
                : "transform 0.15s ease-out",
          }}
        >
          <div
            className="relative"
            style={{
              width: config.cardW,
              height: config.cardH,
              transformStyle: "preserve-3d",
              animationName: "painting-wheel-spin",
              animationDuration: `${config.speed}s`,
              animationTimingFunction: "linear",
              animationIterationCount: "infinite",
              animationDirection: config.reverse ? "reverse" : "normal",
              animationPlayState: config.paused ? "paused" : "running",
            }}
          >
            {Array.from({ length: config.numCards }).map((_, i) => (
              <InteractiveCard
                key={i}
                index={i}
                total={config.numCards}
                imageSrc={cardImageSrcs[i]}
                radius={config.radius}
                cardRotX={config.cardRotX}
                cardRotY={config.cardRotY}
                cardRotZ={config.cardRotZ}
                borderRadiusPx={config.cardBorderRadius}
                strokeVisible={config.cardStrokeVisible}
                strokeWidthPx={config.cardStrokeWidth}
                strokeColor={config.cardStrokeColor}
                strokeOpacity={config.cardStrokeOpacity}
              />
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingWheelBackground;
