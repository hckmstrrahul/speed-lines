"use client";

import React, { useRef, useEffect, useCallback } from "react";

export type MusicLinesConfig = {
  barCount: number;
  barWidthPercent: number;
  barGap: number;
  barBorderRadius: number;
  minHeight: number;
  maxHeight: number;
  speed: number;
  pulseFreq: number;
  chaos: number;
  waveFreq: number;
  colorSharpness: number;
  colorOrange: string;
  colorBlue: string;
  backgroundColor: string;
  showEdgeGlow: boolean;
  edgeGlowOpacity: number;
  showVignette: boolean;
  vignetteOpacity: number;
  seed: number;
  showOverlay: boolean;
  overlayHeading: string;
  overlaySubtext: string;
  overlayButtonText: string;
  overlayButtonUrl: string;
  showGrid: boolean;
  gridSize: number;
  gridOpacity: number;
  gridColor: string;
  showCenterGlow: boolean;
  centerGlowRadius: number;
  centerGlowOpacity: number;
  centerGlowColor: string;
  centerGlowColorOuter: string;
  centerGlowY: number;
  overlayY: number;
  barsOffsetY: number;
  barBaseOpacity: number;
  barBaseColor: string;
};

export const DEFAULT_MUSIC_LINES_CONFIG: MusicLinesConfig = {
  barCount: 200,
  barWidthPercent: 60,
  barGap: 35,
  barBorderRadius: 5,
  minHeight: 70,
  maxHeight: 900,
  speed: 0.8,
  pulseFreq: 0.4,
  chaos: 0.48,
  waveFreq: 0.44,
  colorSharpness: 15,
  colorOrange: "#F59812",
  colorBlue: "#4DA8DA",
  backgroundColor: "#060809",
  showEdgeGlow: false,
  edgeGlowOpacity: 0.08,
  showVignette: true,
  vignetteOpacity: 1,
  seed: 77,
  showOverlay: true,
  overlayHeading: "Advanced Open Interest Analysis",
  overlaySubtext: "Stop guessing and start interpreting the market",
  overlayButtonText: "Launch Open Interest",
  overlayButtonUrl: "#",
  showGrid: true,
  gridSize: 60,
  gridOpacity: 0.1,
  gridColor: "#46a09a",
  showCenterGlow: true,
  centerGlowRadius: 690,
  centerGlowOpacity: 0.19,
  centerGlowColor: "#396A84",
  centerGlowColorOuter: "#342918",
  centerGlowY: 635,
  overlayY: -130,
  barsOffsetY: 0,
  barBaseOpacity: 0.12,
  barBaseColor: "#FFFFFF",
};

type BarData = {
  colorType: number;
  pulsePhase: number;
  phase: number;
  freq: number;
};

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const hexToRgba = (hex: string, a: number): string => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return `rgba(255,140,66,${a})`;
  return `rgba(${parseInt(m[1], 16)},${parseInt(m[2], 16)},${parseInt(m[3], 16)},${a})`;
};

const hexToRgb = (hex: string): string => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!m) return "48, 134, 152";
  return `${parseInt(m[1], 16)}, ${parseInt(m[2], 16)}, ${parseInt(m[3], 16)}`;
};

type MusicLinesBackgroundProps = {
  config: MusicLinesConfig;
};

const MusicLinesBackground: React.FC<MusicLinesBackgroundProps> = ({ config }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  configRef.current = config;

  const barDataRef = useRef<BarData[]>([]);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  const initBarData = useCallback((count: number, seed: number) => {
    const random = seededRandom(seed);
    const bars: BarData[] = [];
    for (let i = 0; i < count; i++) {
      bars.push({
        colorType: random() > 0.5 ? 1 : 0,
        pulsePhase: random(),
        phase: random() * Math.PI * 2,
        freq: 0.5 + random() * 1.5,
      });
    }
    barDataRef.current = bars;
  }, []);

  useEffect(() => {
    initBarData(config.barCount, config.seed);
  }, [config.barCount, config.seed, initBarData]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    const loop = (now: number) => {
      const cfg = configRef.current;
      const dt = lastTimeRef.current === 0 ? 16 : now - lastTimeRef.current;
      lastTimeRef.current = now;
      offsetRef.current += (dt / 1000) * cfg.speed;

      const W = window.innerWidth;
      const H = window.innerHeight;
      ctx.clearRect(0, 0, W, H);

      const bars = barDataRef.current;
      const count = Math.min(bars.length, cfg.barCount);
      if (count === 0) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      const totalBarSpace = W * (cfg.barWidthPercent / 100);
      const totalGapSpace = (count - 1) * cfg.barGap;
      const barW = Math.max(1, (totalBarSpace - totalGapSpace) / count);
      const startX = (W - (barW * count + totalGapSpace)) / 2;
      const centerY = H / 2 + cfg.barsOffsetY;
      const offset = offsetRef.current;
      const pulseOffset = (offset * cfg.pulseFreq) % 1.0;
      const colorStops = 20;
      const sharpness = cfg.colorSharpness;

      ctx.shadowBlur = 0;

      for (let i = 0; i < count; i++) {
        const bar = bars[i];
        const waveFactor = (Math.sin(offset + i * cfg.waveFreq) + 1) / 2;
        const chaosFactor = (Math.sin(offset * bar.freq + bar.phase) + 1) / 2;
        const factor = chaosFactor * cfg.chaos + waveFactor * (1 - cfg.chaos);
        const height = cfg.minHeight + factor * (cfg.maxHeight - cfg.minHeight);

        const x = startX + i * (barW + cfg.barGap);
        const y = centerY - height / 2;

        const grad = ctx.createLinearGradient(x, y, x, y + height);
        const pulseColor = bar.colorType === 0 ? cfg.colorOrange : cfg.colorBlue;
        const fillColor = cfg.barBaseColor || pulseColor;

        for (let s = 0; s <= colorStops; s++) {
          const t = s / colorStops;
          const pos = (pulseOffset + bar.pulsePhase) % 1.0;
          const dist = Math.abs(t - pos);
          const circularDist = Math.min(dist, 1 - dist);
          const intensity = Math.pow(Math.max(0, 1 - circularDist * (sharpness / 5)), 3);
          const alpha = cfg.barBaseOpacity + intensity * (1 - cfg.barBaseOpacity);
          const color = intensity > 0.01 ? pulseColor : fillColor;
          grad.addColorStop(t, hexToRgba(color, alpha));
        }

        ctx.fillStyle = grad;
        const r = Math.min(cfg.barBorderRadius, barW / 2, height / 2);
        ctx.beginPath();
        ctx.roundRect(x, y, barW, height, r);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const accentRgb = hexToRgb(config.gridColor);

  return (
    <div className="relative h-full w-full" style={{ minHeight: "100%" }} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />

      {config.showEdgeGlow && (
        <>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 28% 55% at 0% 50%, rgba(${accentRgb}, ${config.edgeGlowOpacity}) 0%, transparent 100%)`,
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: `radial-gradient(ellipse 28% 55% at 100% 50%, rgba(${accentRgb}, ${config.edgeGlowOpacity}) 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {config.showVignette && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 35% 70% at 50% 50%, rgba(0, 0, 0, ${config.vignetteOpacity}) 0%, transparent 100%)`,
          }}
        />
      )}
    </div>
  );
};

export default MusicLinesBackground;
