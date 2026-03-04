"use client";

import React, { useRef, useEffect } from "react";

const SVG_NS = "http://www.w3.org/2000/svg";

export type SpeedLinesConfig = {
  canvasWidth: number;
  canvasHeight: number;
  convergenceGap: number;
  numBeams: number;
  beamColors: string[];
  accentColor: string;
  opacityMin: number;
  opacityMax: number;
  strokeWidthMin: number;
  strokeWidthMax: number;
  glowBlur: number;
  animationSpeedMin: number;
  animationSpeedMax: number;
  animationChance: number;
  dashLength: number;
  dashGap: number;
  particleExtraWidth: number;
  showAccentBeams: boolean;
  accentOpacity: number;
  accentStrokeWidth: number;
  verticalSpread: number;
  outerVerticalSpread: number;
  edgeGlowOpacity: number;
  vignetteOpacity: number;
  backgroundColor: string;
  showEdgeGlow: boolean;
  showVignette: boolean;
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
};

export const DEFAULT_CONFIG: SpeedLinesConfig = {
  canvasWidth: 1440,
  canvasHeight: 900,
  convergenceGap: 0.07,
  numBeams: 38,
  beamColors: ["#BDED8F", "#66bdcc"],
  accentColor: "#46a09a",
  opacityMin: 0.3,
  opacityMax: 0.65,
  strokeWidthMin: 0.4,
  strokeWidthMax: 1,
  glowBlur: 14.5,
  animationSpeedMin: 7.5,
  animationSpeedMax: 15,
  animationChance: 0.32,
  dashLength: 70,
  dashGap: 550,
  particleExtraWidth: 0.9,
  showAccentBeams: false,
  accentOpacity: 0.48,
  accentStrokeWidth: 1,
  verticalSpread: 0.02,
  outerVerticalSpread: 2.5,
  edgeGlowOpacity: 0.08,
  vignetteOpacity: 1,
  backgroundColor: "#060809",
  showEdgeGlow: false,
  showVignette: true,
  seed: 42,
  showOverlay: true,
  overlayHeading: "Built for Speed",
  overlaySubtext: "Quick execution, one-click orders, and keyboard shortcuts for speedy trading",
  overlayButtonText: "Launch Scalper Zone",
  overlayButtonUrl: "#",
  showGrid: true,
  gridSize: 60,
  gridOpacity: 0.10,
  gridColor: "#46a09a",
  showCenterGlow: true,
  centerGlowRadius: 590,
  centerGlowOpacity: 0.20,
  centerGlowColor: "#9EFFB6",
  centerGlowColorOuter: "#244347",
  centerGlowY: 640,
  overlayY: -100,
};

const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

const createGradient = (
  defs: SVGDefsElement,
  id: string,
  color: string,
  x1: number,
  x2: number
) => {
  const grad = document.createElementNS(SVG_NS, "linearGradient");
  grad.setAttribute("id", id);
  grad.setAttribute("gradientUnits", "userSpaceOnUse");
  grad.setAttribute("x1", String(x1));
  grad.setAttribute("y1", "0");
  grad.setAttribute("x2", String(x2));
  grad.setAttribute("y2", "0");

  const stop1 = document.createElementNS(SVG_NS, "stop");
  stop1.setAttribute("offset", "0%");
  stop1.setAttribute("stop-color", color);
  grad.appendChild(stop1);

  const stop2 = document.createElementNS(SVG_NS, "stop");
  stop2.setAttribute("offset", "70%");
  stop2.setAttribute("stop-color", color);
  stop2.setAttribute("stop-opacity", "0.4");
  grad.appendChild(stop2);

  const stop3 = document.createElementNS(SVG_NS, "stop");
  stop3.setAttribute("offset", "100%");
  stop3.setAttribute("stop-color", color);
  stop3.setAttribute("stop-opacity", "0");
  grad.appendChild(stop3);

  defs.appendChild(grad);
};

type SpeedLinesBackgroundProps = {
  config: SpeedLinesConfig;
};

const SpeedLinesBackground: React.FC<SpeedLinesBackgroundProps> = ({ config }) => {
  const svgContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = svgContainerRef.current;
    if (!container) return;

    const random = seededRandom(config.seed);

    const {
      canvasWidth,
      canvasHeight,
      convergenceGap,
      numBeams,
      beamColors,
      accentColor,
      opacityMin,
      opacityMax,
      strokeWidthMin,
      strokeWidthMax,
      glowBlur,
      animationSpeedMin,
      animationSpeedMax,
      animationChance,
      dashLength,
      dashGap,
      particleExtraWidth,
      showAccentBeams,
      accentOpacity,
      accentStrokeWidth,
      verticalSpread,
      outerVerticalSpread,
    } = config;

    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const gap = canvasWidth * convergenceGap;
    const leftConv = centerX - gap;
    const rightConv = centerX + gap;

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${canvasWidth} ${canvasHeight}`);
    svg.setAttribute("preserveAspectRatio", "xMidYMid slice");
    svg.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block;";

    const defs = document.createElementNS(SVG_NS, "defs");
    svg.appendChild(defs);

    beamColors.forEach((color, i) => {
      createGradient(defs, `bm-lg-${i}`, color, 0, leftConv);
      createGradient(defs, `bm-rg-${i}`, color, canvasWidth, rightConv);
    });

    createGradient(defs, "bm-accent-l", accentColor, 0, centerX - gap * 0.6);
    createGradient(defs, "bm-accent-r", accentColor, canvasWidth, centerX + gap * 0.6);

    const filter = document.createElementNS(SVG_NS, "filter");
    filter.setAttribute("id", "bm-glow");
    filter.setAttribute("x", "-20%");
    filter.setAttribute("y", "-20%");
    filter.setAttribute("width", "140%");
    filter.setAttribute("height", "140%");

    const blur = document.createElementNS(SVG_NS, "feGaussianBlur");
    blur.setAttribute("stdDeviation", String(glowBlur));
    blur.setAttribute("result", "b");
    filter.appendChild(blur);

    const merge = document.createElementNS(SVG_NS, "feMerge");
    const mergeNode1 = document.createElementNS(SVG_NS, "feMergeNode");
    mergeNode1.setAttribute("in", "b");
    merge.appendChild(mergeNode1);
    const mergeNode2 = document.createElementNS(SVG_NS, "feMergeNode");
    mergeNode2.setAttribute("in", "SourceGraphic");
    merge.appendChild(mergeNode2);
    filter.appendChild(merge);
    defs.appendChild(filter);

    const beamGroup = document.createElementNS(SVG_NS, "g");
    beamGroup.setAttribute("filter", "url(#bm-glow)");
    svg.appendChild(beamGroup);

    const opacityRange = opacityMax - opacityMin;
    const strokeWidthRange = strokeWidthMax - strokeWidthMin;

    for (let i = 0; i < numBeams; i++) {
      const t = numBeams === 1 ? 0.5 : i / (numBeams - 1);
      const baseY = t * canvasHeight;
      const outerY = centerY + (baseY - centerY) * outerVerticalSpread;
      const normalizedOffset = (baseY - centerY) / centerY;
      const convergeY = centerY + normalizedOffset * (canvasHeight * verticalSpread);

      const colorIndex = i % beamColors.length;
      const opacity = opacityMin + random() * opacityRange;
      const strokeWidth = strokeWidthMin + random() * strokeWidthRange;
      const ctrl1 = 0.3 + random() * 0.1;
      const ctrl2 = 0.65 + random() * 0.1;

      const leftPath = `M 0 ${outerY} C ${leftConv * ctrl1} ${outerY}, ${leftConv * ctrl2} ${convergeY}, ${leftConv} ${convergeY}`;
      const rightPath = `M ${canvasWidth} ${outerY} C ${canvasWidth - leftConv * ctrl1} ${outerY}, ${canvasWidth - leftConv * ctrl2} ${convergeY}, ${rightConv} ${convergeY}`;

      [
        { d: leftPath, gradId: `bm-lg-${colorIndex}` },
        { d: rightPath, gradId: `bm-rg-${colorIndex}` },
      ].forEach(({ d, gradId }) => {
        const staticPath = document.createElementNS(SVG_NS, "path");
        staticPath.setAttribute("d", d);
        staticPath.setAttribute("fill", "none");
        staticPath.setAttribute("stroke", `url(#${gradId})`);
        staticPath.setAttribute("stroke-width", String(strokeWidth));
        staticPath.setAttribute("stroke-opacity", String(opacity));
        beamGroup.appendChild(staticPath);

        if (random() < animationChance) {
          const animPath = document.createElementNS(SVG_NS, "path");
          animPath.setAttribute("d", d);
          animPath.setAttribute("fill", "none");
          animPath.setAttribute("stroke", `url(#${gradId})`);
          animPath.setAttribute("stroke-width", String(strokeWidth + particleExtraWidth));
          animPath.setAttribute("stroke-linecap", "round");
          animPath.setAttribute("stroke-dasharray", `${dashLength} ${dashGap}`);
          const duration = animationSpeedMin + random() * (animationSpeedMax - animationSpeedMin);
          animPath.style.animation = `beamConverge ${duration}s linear infinite`;
          animPath.style.animationDelay = `${random() * -8}s`;
          animPath.style.opacity = String(Math.min(opacity * 2, 0.7));
          beamGroup.appendChild(animPath);
        }
      });
    }

    if (showAccentBeams) {
      const addAccentBeam = (
        startX: number,
        gradientId: string,
        convergenceX: number,
        yOffset: number,
        width: number,
        beamOpacity: number
      ) => {
        const convX = startX === 0 ? leftConv : canvasWidth - leftConv;
        const d =
          startX === 0
            ? `M 0 ${centerY + yOffset} C ${convX * 0.3} ${centerY + yOffset}, ${convX * 0.7} ${centerY + yOffset * 0.2}, ${convergenceX} ${centerY + yOffset * 0.1}`
            : `M ${canvasWidth} ${centerY + yOffset} C ${canvasWidth - leftConv * 0.3} ${centerY + yOffset}, ${canvasWidth - leftConv * 0.7} ${centerY + yOffset * 0.2}, ${convergenceX} ${centerY + yOffset * 0.1}`;

        const path = document.createElementNS(SVG_NS, "path");
        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", `url(#${gradientId})`);
        path.setAttribute("stroke-width", String(width));
        path.setAttribute("stroke-opacity", String(beamOpacity));
        beamGroup.appendChild(path);
      };

      [
        { yOffset: -8, width: accentStrokeWidth + 0.5, opacity: accentOpacity - 0.1 },
        { yOffset: 0, width: accentStrokeWidth, opacity: accentOpacity },
        { yOffset: 8, width: accentStrokeWidth + 0.5, opacity: accentOpacity - 0.1 },
      ].forEach(({ yOffset, width, opacity: ao }) => {
        addAccentBeam(0, "bm-accent-l", leftConv, yOffset, width, ao);
        addAccentBeam(canvasWidth, "bm-accent-r", rightConv, yOffset, width, ao);
      });
    }

    container.appendChild(svg);

    return () => {
      if (container.contains(svg)) {
        container.removeChild(svg);
      }
    };
  }, [config]);

  const accentRgb = hexToRgb(config.accentColor);

  return (
    <div className="relative w-full h-full" style={{ minHeight: "100%" }} aria-hidden="true">
      <style>{`
        @keyframes beamConverge {
          0% { stroke-dashoffset: 1400; }
          100% { stroke-dashoffset: -1400; }
        }
      `}</style>

      {config.showEdgeGlow && (
        <>
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 28% 55% at 0% 50%, rgba(${accentRgb}, ${config.edgeGlowOpacity}) 0%, transparent 100%)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 28% 55% at 100% 50%, rgba(${accentRgb}, ${config.edgeGlowOpacity}) 0%, transparent 100%)`,
            }}
          />
        </>
      )}

      {config.showVignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 35% 70% at 50% 50%, rgba(0, 0, 0, ${config.vignetteOpacity}) 0%, transparent 100%)`,
          }}
        />
      )}

      <div ref={svgContainerRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};

const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "48, 134, 152";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
};

export default SpeedLinesBackground;
