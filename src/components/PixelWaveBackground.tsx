"use client";

import React, { useRef, useEffect, useCallback } from "react";

export type PixelWaveConfig = {
  effect: string;
  density: number;
  size: number;
  wavelength: number;
  amplitude: number;
  speed: number;
  interactionRadius: number;
  interactionForce: number;
  rippleStrength: number;
  camX: number;
  camY: number;
  camZ: number;
  fov: number;
  gridWidth: number;
  gridDepth: number;
};

export const DEFAULT_WAVE_CONFIG: PixelWaveConfig = {
  effect: "repel",
  density: 40,
  size: 1.9,
  wavelength: 3.8,
  amplitude: 70,
  speed: 0.7,
  interactionRadius: 220,
  interactionForce: 45,
  rippleStrength: 45,
  camX: 21,
  camY: 549,
  camZ: -264,
  fov: 300,
  gridWidth: 3000,
  gridDepth: 3000,
};

export const WAVE_EFFECTS = [
  { value: "ripple", label: "Ripple" },
  { value: "repel", label: "Repel" },
  { value: "attract", label: "Attract" },
  { value: "vortex", label: "Vortex" },
  { value: "crater", label: "Crater" },
  { value: "scatter", label: "Scatter" },
  { value: "freeze", label: "Freeze" },
  { value: "glitch", label: "Glitch" },
] as const;

type PixelWaveBackgroundProps = {
  config: PixelWaveConfig;
  onConfigChange?: (config: PixelWaveConfig) => void;
};

const MAX_DENSITY = 150;

const PixelWaveBackground: React.FC<PixelWaveBackgroundProps> = ({ config, onConfigChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const configRef = useRef(config);
  const onConfigChangeRef = useRef(onConfigChange);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const timeRef = useRef(0);
  const animFrameRef = useRef<number>(0);
  const screenOffsetXRef = useRef(new Float32Array(MAX_DENSITY * MAX_DENSITY));
  const screenOffsetYRef = useRef(new Float32Array(MAX_DENSITY * MAX_DENSITY));
  const dragRef = useRef<{ active: boolean; startX: number; startY: number; startCamX: number; startCamY: number }>({
    active: false, startX: 0, startY: 0, startCamX: 0, startCamY: 0,
  });

  configRef.current = config;
  onConfigChangeRef.current = onConfigChange;

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };

    if (dragRef.current.active) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      const sensitivity = 3;
      const newCamX = Math.round(Math.max(-1500, Math.min(1500, dragRef.current.startCamX - dx * sensitivity)));
      const newCamY = Math.round(Math.max(-500, Math.min(1500, dragRef.current.startCamY + dy * sensitivity)));

      const current = configRef.current;
      if (newCamX !== current.camX || newCamY !== current.camY) {
        onConfigChangeRef.current?.({ ...current, camX: newCamX, camY: newCamY });
      }
    }
  }, []);

  const handleMouseOut = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 };
  }, []);

  const handleMouseDown = useCallback((e: MouseEvent) => {
    if (e.button === 2 || (e.button === 0 && e.shiftKey)) {
      e.preventDefault();
      const current = configRef.current;
      dragRef.current = {
        active: true,
        startX: e.clientX,
        startY: e.clientY,
        startCamX: current.camX,
        startCamY: current.camY,
      };
    }
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (e.button === 2 || e.button === 0) {
      dragRef.current.active = false;
    }
  }, []);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    e.preventDefault();
  }, []);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const current = configRef.current;
    const sensitivity = 2;
    const delta = e.deltaY * sensitivity;
    const newCamZ = Math.round(Math.max(-1500, Math.min(1500, current.camZ + delta)));
    if (newCamZ !== current.camZ) {
      onConfigChangeRef.current?.({ ...current, camZ: newCamZ });
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseOut);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("contextmenu", handleContextMenu);
    canvas.addEventListener("wheel", handleWheel, { passive: false });

    const animate = () => {
      const params = configRef.current;
      const mouse = mouseRef.current;
      const screenOffsetX = screenOffsetXRef.current;
      const screenOffsetY = screenOffsetYRef.current;

      ctx.fillStyle = "#030303";
      ctx.fillRect(0, 0, width, height);

      timeRef.current += 0.015 * params.speed;
      const time = timeRef.current;

      const countX = Math.floor(params.density);
      const countZ = Math.floor(params.density);

      for (let iz = 0; iz < countZ; iz++) {
        for (let ix = 0; ix < countX; ix++) {
          let nx = ix / (countX - 1);
          let nz = iz / (countZ - 1);
          let centeredNx = nx * 2 - 1;

          let x = centeredNx * (params.gridWidth / 2);
          let z = nz * params.gridDepth;

          let wave1 =
            Math.sin(centeredNx * Math.PI * params.wavelength + time) *
            Math.cos(nz * Math.PI * params.wavelength + time);
          let wave2 =
            Math.sin(centeredNx * Math.PI * params.wavelength * 1.5 - time * 0.8) *
            Math.cos(nz * Math.PI * params.wavelength * 0.8 + time * 1.2);

          let y = (wave1 * 0.7 + wave2 * 0.3) * params.amplitude;

          let dz = z - params.camZ;
          if (dz <= 0) continue;

          let scale = params.fov / dz;

          let screenX = width / 2 + (x - params.camX) * scale;
          let screenY = height / 2 - (y - params.camY) * scale;

          let pSize = params.size * scale;

          let alpha = 1 - nz;
          alpha = Math.pow(alpha, 1.8);

          let dx = screenX - mouse.x;
          let dy = screenY - mouse.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          let index = iz * MAX_DENSITY + ix;
          let targetOffX = 0;
          let targetOffY = 0;

          if (params.effect === "ripple") {
            if (dist < params.interactionRadius) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 2);
              let ripple = Math.cos(dist * 0.15 - time * 5) * params.rippleStrength * baseForce;
              let totalLift = baseForce * params.interactionForce + ripple;
              screenY -= totalLift;
              pSize += Math.max(0, totalLift * 0.15 * scale);
              alpha = Math.min(1, alpha + baseForce * 0.8);
            }
          } else if (params.effect === "repel") {
            if (dist < params.interactionRadius && dist > 0.1) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 1.5);
              targetOffX = (dx / dist) * baseForce * params.interactionForce * 2.5;
              targetOffY = (dy / dist) * baseForce * params.interactionForce * 2.5;
              alpha = Math.min(1, alpha + baseForce * 0.4);
            }
          } else if (params.effect === "attract") {
            if (dist < params.interactionRadius && dist > 0.1) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 1.5);
              targetOffX = -(dx / dist) * baseForce * params.interactionForce * 2.0;
              targetOffY = -(dy / dist) * baseForce * params.interactionForce * 2.0;
              alpha = Math.min(1, alpha + baseForce * 0.8);
              pSize += baseForce * 3 * scale;
            }
          } else if (params.effect === "vortex") {
            if (dist < params.interactionRadius && dist > 0.1) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 2);
              let angle = Math.atan2(dy, dx);
              let swirl = baseForce * (params.interactionForce / 15);
              let newDx = Math.cos(angle + swirl) * dist;
              let newDy = Math.sin(angle + swirl) * dist;
              targetOffX = newDx - dx;
              targetOffY = newDy - dy;
              alpha = Math.min(1, alpha + baseForce * 0.5);
            }
          } else if (params.effect === "crater") {
            if (dist < params.interactionRadius) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 2);
              screenY += baseForce * params.interactionForce * 1.5;
              pSize -= baseForce * params.size * scale * 0.6;
              alpha = Math.max(0.05, alpha - baseForce * 0.5);
            }
          } else if (params.effect === "scatter") {
            if (dist < params.interactionRadius) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 1.5);
              let noiseX = Math.sin(nx * 50 + time * 15) * baseForce * params.interactionForce * 1.5;
              let noiseY = Math.cos(nz * 50 + time * 15) * baseForce * params.interactionForce * 1.5;
              targetOffX = noiseX;
              targetOffY = noiseY;
              alpha = Math.min(1, alpha + baseForce);
            }
          } else if (params.effect === "freeze") {
            if (dist < params.interactionRadius) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 2);
              let flatScreenY = height / 2 - (0 - params.camY) * scale;
              screenY = screenY * (1 - baseForce) + flatScreenY * baseForce;
              alpha = Math.min(1, alpha + baseForce * 0.5);
            }
          } else if (params.effect === "glitch") {
            if (dist < params.interactionRadius) {
              let baseForce = Math.pow(1 - dist / params.interactionRadius, 1);
              let blockX = Math.floor(nx * 15);
              let blockZ = Math.floor(nz * 15);
              let glitchOffset = blockX % 2 === blockZ % 2 ? 1 : -1;

              if (Math.sin(time * 5 + blockX) > 0) {
                targetOffX = glitchOffset * baseForce * params.interactionForce;
                targetOffY = -glitchOffset * baseForce * params.interactionForce;
              }
              if (Math.sin(time * 15 + index) > 0.8) {
                alpha = Math.max(0, alpha - 0.5);
                pSize *= 1.5;
              }
            }
          }

          screenOffsetX[index] += (targetOffX - screenOffsetX[index]) * 0.08;
          screenOffsetY[index] += (targetOffY - screenOffsetY[index]) * 0.08;

          screenX += screenOffsetX[index];
          screenY += screenOffsetY[index];

          if (screenX > 0 && screenX < width && screenY > 0 && screenY < height && pSize > 0.1) {
            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(screenX, screenY, pSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseOut);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("contextmenu", handleContextMenu);
      canvas.removeEventListener("wheel", handleWheel);
    };
  }, [handleMouseMove, handleMouseOut, handleMouseDown, handleMouseUp, handleContextMenu, handleWheel]);

  return (
    <canvas
      ref={canvasRef}
      className="block w-full h-full"
      style={{ background: "#030303" }}
      aria-hidden="true"
    />
  );
};

export default PixelWaveBackground;
