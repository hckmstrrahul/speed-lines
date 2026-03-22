"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { strategyIconSrc } from "@/lib/infiniteGridStrategyIcons";

const lerp = (start: number, end: number, factor: number) => start + (end - start) * factor;

const easeOutQuad = (t: number) => t * (2 - t);

/** Reaches full vignette color sooner than a two-stop ramp (stronger perceived falloff). */
const buildVignetteGradient = (innerPct: number, sizePct: number, color: string) => {
  const inner = Math.min(Math.max(innerPct, 0), 89);
  const band = 100 - inner;
  const solidAt = Math.min(inner + band * 0.26, 99.5);
  return `radial-gradient(ellipse ${sizePct}% ${sizePct}% at 50% 50%, transparent 0%, transparent ${inner}%, ${color} ${solidAt}%, ${color} 100%)`;
};

export type InfiniteGridConfig = {
  tileWidth: number;
  tileHeight: number;
  gap: number;
  hoverRadius: number;
  maxScale: number;
  pushForce: number;
  panSpeedX: number;
  panSpeedY: number;
  panPaused: boolean;
  /** Radial vignette: fades to this color at the edges (match page background on tab 4). */
  vignetteEnabled: boolean;
  vignetteColor: string;
  /** 0–90: larger = bigger clear center before fade. */
  vignetteInnerPercent: number;
  /** 80–200: ellipse size (% of box); larger = stronger corner reach. */
  vignetteSizePercent: number;
  /** 0–1.5: intensity; values above 1 stack a second pass for heavier edges. */
  vignetteStrength: number;
  /** Seeded shuffle for which strategy icon appears on each tile. */
  tileIconSeed: number;
};

export const DEFAULT_INFINITE_GRID_CONFIG: InfiniteGridConfig = {
  tileWidth: 125,
  tileHeight: 80,
  gap: 16,
  hoverRadius: 350,
  maxScale: 2.2,
  pushForce: 40,
  panSpeedX: 0.8,
  panSpeedY: 0.3,
  panPaused: false,
  vignetteEnabled: true,
  vignetteColor: "#0a0a0a",
  vignetteInnerPercent: 15,
  vignetteSizePercent: 136,
  vignetteStrength: 1.5,
  tileIconSeed: 274915,
};

type TileData = {
  id: string;
  col: number;
  row: number;
  logicalX: number;
  logicalY: number;
  iconSrc: string;
  currentScale: number;
};

type PoolState = {
  tiles: TileData[];
  cols: number;
  rows: number;
  totalW: number;
  totalH: number;
};

type InfiniteGridBackgroundProps = {
  config: InfiniteGridConfig;
};

const InfiniteGridBackground: React.FC<InfiniteGridBackgroundProps> = ({ config }) => {
  const configRef = useRef(config);
  configRef.current = config;

  const rafRef = useRef<number>(0);
  const pan = useRef({ x: 0, y: 0 });
  const mouse = useRef({ x: -1000, y: -1000, active: false });
  const drag = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    lastPanX: 0,
    lastPanY: 0,
  });
  const entrancePhase = useRef(0);
  const [pool, setPool] = useState<PoolState>({
    tiles: [],
    cols: 0,
    rows: 0,
    totalW: 0,
    totalH: 0,
  });
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const updatePool = () => {
      const cfg = configRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const strideX = cfg.tileWidth + cfg.gap;
      const strideY = cfg.tileHeight + cfg.gap;
      const cols = Math.ceil(w / strideX) + 4;
      const rows = Math.ceil(h / strideY) + 4;
      const totalW = cols * strideX;
      const totalH = rows * strideY;

      const newTiles: TileData[] = [];
      const iconSeed = cfg.tileIconSeed;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          newTiles.push({
            id: `tile-${r}-${c}`,
            col: c,
            row: r,
            logicalX: c * strideX,
            logicalY: r * strideY,
            iconSrc: strategyIconSrc(iconSeed, r, c),
            currentScale: 0,
          });
        }
      }

      setPool({ tiles: newTiles, cols, rows, totalW, totalH });
      entrancePhase.current = 0;
      pan.current = { x: 0, y: 0 };
      tileRefs.current = [];
    };

    updatePool();
    window.addEventListener("resize", updatePool);
    return () => window.removeEventListener("resize", updatePool);
  }, [config.tileWidth, config.tileHeight, config.gap, config.tileIconSeed]);

  useEffect(() => {
    if (pool.tiles.length === 0) return;

    const loop = () => {
      const cfg = configRef.current;
      const strideX = cfg.tileWidth + cfg.gap;
      const strideY = cfg.tileHeight + cfg.gap;

      if (!drag.current.isDragging && !cfg.panPaused) {
        pan.current.x += cfg.panSpeedX;
        pan.current.y += cfg.panSpeedY;
      }

      if (entrancePhase.current < 1) {
        entrancePhase.current += 0.015;
      }

      const screenCenterX = window.innerWidth / 2;
      const screenCenterY = window.innerHeight / 2;
      const maxScreenDist = Math.sqrt(screenCenterX ** 2 + screenCenterY ** 2);
      const currentEntranceRadius = entrancePhase.current * maxScreenDist * 1.5;

      pool.tiles.forEach((tileData, i) => {
        const node = tileRefs.current[i];
        if (!node) return;

        let rawX = (tileData.logicalX + pan.current.x) % pool.totalW;
        if (rawX < 0) rawX += pool.totalW;
        const x = rawX - strideX;

        let rawY = (tileData.logicalY + pan.current.y) % pool.totalH;
        if (rawY < 0) rawY += pool.totalH;
        const y = rawY - strideY;

        const tileCenterX = x + cfg.tileWidth / 2;
        const tileCenterY = y + cfg.tileHeight / 2;

        const distToScreenCenter = Math.sqrt(
          (tileCenterX - screenCenterX) ** 2 + (tileCenterY - screenCenterY) ** 2
        );

        const isActive = distToScreenCenter < currentEntranceRadius;
        let targetScale = isActive ? 1 : 0;
        let tX = x;
        let tY = y;

        if (isActive && mouse.current.active) {
          const dx = tileCenterX - mouse.current.x;
          const dy = tileCenterY - mouse.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cfg.hoverRadius) {
            const intensity = easeOutQuad(1 - dist / cfg.hoverRadius);
            targetScale += intensity * (cfg.maxScale - 1);

            if (cfg.pushForce > 0 && dist > 0.1) {
              const pushAmount = intensity * cfg.pushForce;
              tX += (dx / dist) * pushAmount;
              tY += (dy / dist) * pushAmount;
            }
          }
        }

        tileData.currentScale = lerp(tileData.currentScale, targetScale, 0.15);

        node.style.transform = `translate3d(${tX}px, ${tY}px, 0) scale(${tileData.currentScale})`;

        if (tileData.currentScale > 1.05) {
          node.style.zIndex = String(Math.round(tileData.currentScale * 10));
        } else {
          node.style.zIndex = "1";
        }
      });

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pool]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    drag.current.isDragging = true;
    drag.current.startX = e.clientX;
    drag.current.startY = e.clientY;
    drag.current.lastPanX = pan.current.x;
    drag.current.lastPanY = pan.current.y;
    document.body.style.cursor = "grabbing";
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    mouse.current.active = true;

    if (drag.current.isDragging) {
      const dx = e.clientX - drag.current.startX;
      const dy = e.clientY - drag.current.startY;
      pan.current.x = drag.current.lastPanX + dx;
      pan.current.y = drag.current.lastPanY + dy;
    }
  }, []);

  const handlePointerUp = useCallback(() => {
    drag.current.isDragging = false;
    document.body.style.cursor = "";
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouse.current.active = false;
    handlePointerUp();
  }, [handlePointerUp]);

  const cfg = config;

  return (
    <div
      className="absolute inset-0 h-full w-full cursor-grab touch-none active:cursor-grabbing"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      role="presentation"
    >
      {pool.tiles.map((tile, i) => (
        <div
          key={tile.id}
          ref={(el) => {
            tileRefs.current[i] = el;
          }}
          className="pointer-events-none absolute top-0 left-0 origin-center overflow-hidden rounded-2xl bg-neutral-900 shadow-2xl will-change-transform"
          style={{
            width: cfg.tileWidth,
            height: cfg.tileHeight,
            transform: "translate3d(-9999px, -9999px, 0) scale(0)",
          }}
        >
          <div className="relative flex h-full w-full min-h-0 min-w-0 items-center justify-center">
            <img
              src={tile.iconSrc}
              alt=""
              className="max-h-full max-w-full object-contain opacity-90 transition-opacity duration-300"
              loading="lazy"
              draggable={false}
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/40 to-transparent mix-blend-overlay" />
        </div>
      ))}
      {cfg.vignetteEnabled && cfg.vignetteStrength > 0 && (
        <>
          <div
            className="pointer-events-none absolute inset-0 z-2"
            style={{
              opacity: Math.min(1, cfg.vignetteStrength),
              background: buildVignetteGradient(
                cfg.vignetteInnerPercent,
                cfg.vignetteSizePercent,
                cfg.vignetteColor
              ),
            }}
            aria-hidden
          />
          {cfg.vignetteStrength > 1 && (
            <div
              className="pointer-events-none absolute inset-0 z-2"
              style={{
                opacity: cfg.vignetteStrength - 1,
                background: buildVignetteGradient(
                  cfg.vignetteInnerPercent,
                  cfg.vignetteSizePercent,
                  cfg.vignetteColor
                ),
              }}
              aria-hidden
            />
          )}
        </>
      )}
    </div>
  );
};

export default InfiniteGridBackground;
