"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  type PixelWaveConfig,
  DEFAULT_WAVE_CONFIG,
  WAVE_EFFECTS,
} from "./PixelWaveBackground";

type WaveControlPanelProps = {
  config: PixelWaveConfig;
  onChange: (config: PixelWaveConfig) => void;
};

/* ─── Collapsible Section ─── */

type SectionProps = {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const handleToggle = useCallback(() => setIsOpen((p) => !p), []);

  return (
    <div className="border-b border-white/4 mt-[10px] mb-[10px]">
      <button
        type="button"
        onClick={handleToggle}
        className="group flex w-full items-center justify-between px-[10px] py-[10px] cursor-pointer mt-[10px] mb-0"
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors group-hover:text-white/65">
          {title}
        </span>
        <svg
          className={`h-[12px] w-[12px] text-white/20 transition-transform duration-200 group-hover:text-white/40 ${isOpen ? "rotate-0" : "-rotate-90"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-250 ease-out"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-0 px-[10px] pt-[10px] pb-[10px] mb-0">{children}</div>
        </div>
      </div>
    </div>
  );
};

/* ─── Slider ─── */

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  suffix?: string;
};

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange, suffix = "" }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
    [onChange]
  );

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex flex-col gap-[8px] px-[10px] pt-[5px] pb-[8px] mb-0">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-white/40">{label}</span>
        <span className="text-[12px] tabular-nums text-white/50">
          {step < 1 ? value.toFixed(1) : value}
          {suffix}
        </span>
      </div>
      <div className="relative flex items-center h-[20px]">
        <div className="absolute left-0 right-0 h-[3px] rounded-[9999px] bg-white/6" />
        <div
          className="absolute left-0 h-[3px] rounded-[9999px]"
          style={{
            width: `${pct}%`,
            background: "linear-gradient(90deg, #308698, #BDED8F)",
          }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          className="slider-input"
          aria-label={label}
        />
      </div>
    </div>
  );
};

/* ─── Chip Grid ─── */

type ChipGridProps = {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (value: string) => void;
};

const ChipGrid: React.FC<ChipGridProps> = ({ value, options, onChange }) => (
  <div className="flex flex-col gap-[8px] px-[10px] pt-[5px] pb-[15px]">
    <span className="text-[12px] font-medium text-white/40">Effect</span>
    <div className="grid grid-cols-4 gap-[6px]">
    {options.map((opt) => (
      <button
        key={opt.value}
        type="button"
        onClick={() => onChange(opt.value)}
        className={`rounded-[8px] px-[6px] py-[6px] text-[11px] font-medium transition-all duration-150 cursor-pointer border ${
          value === opt.value
            ? "bg-white/12 text-white border-white/15 shadow-sm"
            : "bg-white/3 text-white/35 border-white/5 hover:bg-white/6 hover:text-white/55"
        }`}
        aria-label={opt.label}
        aria-pressed={value === opt.value}
        tabIndex={0}
      >
        {opt.label}
      </button>
    ))}
    </div>
  </div>
);

/* ─── Download Config ─── */

const handleDownloadConfig = (config: PixelWaveConfig) => {
  const effectLabel = WAVE_EFFECTS.find((e) => e.value === config.effect)?.label ?? config.effect;
  const lines = [
    "┌─────────────────────────────────────────┐",
    "│   Pixel Wave — Configuration Export      │",
    `│   ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}                       │`,
    "└─────────────────────────────────────────┘",
    "",
    "INTERACTION",
    `  effect               : ${effectLabel}`,
    `  interactionRadius    : ${config.interactionRadius}px`,
    `  interactionForce     : ${config.interactionForce}`,
    `  rippleStrength       : ${config.rippleStrength}`,
    "",
    "GRID",
    `  density              : ${config.density}`,
    `  size                 : ${config.size}`,
    "",
    "WAVE",
    `  wavelength           : ${config.wavelength}`,
    `  amplitude            : ${config.amplitude}`,
    `  speed                : ${config.speed}x`,
    "",
    "VIEWPORT",
    `  camX                 : ${config.camX}`,
    `  camY                 : ${config.camY}`,
    `  camZ                 : ${config.camZ}`,
    `  fov                  : ${config.fov}`,
    `  gridWidth            : ${config.gridWidth}`,
    `  gridDepth            : ${config.gridDepth}`,
    "",
    "─── RAW JSON ───",
    "",
    JSON.stringify(config, null, 2),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `pixel-wave-config-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ─── Parse Config from TXT ─── */

const parseWaveConfigFromText = (text: string): PixelWaveConfig | null => {
  const jsonMarker = "─── RAW JSON ───";
  const markerIndex = text.indexOf(jsonMarker);
  if (markerIndex === -1) return null;

  const jsonStr = text.slice(markerIndex + jsonMarker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr);
    const config: PixelWaveConfig = { ...DEFAULT_WAVE_CONFIG };

    const numberKeys: (keyof PixelWaveConfig)[] = [
      "density", "size", "wavelength", "amplitude", "speed",
      "interactionRadius", "interactionForce", "rippleStrength",
      "camX", "camY", "camZ", "fov", "gridWidth", "gridDepth",
    ];

    const stringKeys: (keyof PixelWaveConfig)[] = ["effect"];

    for (const key of numberKeys) {
      if (key in parsed && typeof parsed[key] === "number") {
        (config as Record<string, unknown>)[key] = parsed[key];
      }
    }

    for (const key of stringKeys) {
      if (key in parsed && typeof parsed[key] === "string") {
        (config as Record<string, unknown>)[key] = parsed[key];
      }
    }

    return config;
  } catch {
    return null;
  }
};

/* ─── Main Panel ─── */

const WaveControlPanel: React.FC<WaveControlPanelProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    <K extends keyof PixelWaveConfig>(key: K, value: PixelWaveConfig[K]) => {
      onChange({ ...config, [key]: value });
    },
    [config, onChange]
  );

  const handleReset = useCallback(() => onChange({ ...DEFAULT_WAVE_CONFIG }), [onChange]);
  const handleToggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

  const handleRandomize = useCallback(() => {
    const rand = (min: number, max: number, step: number) => {
      const steps = Math.round((max - min) / step);
      return min + Math.floor(Math.random() * (steps + 1)) * step;
    };

    const effects = WAVE_EFFECTS.map((e) => e.value);
    const randomEffect = effects[Math.floor(Math.random() * effects.length)];

    onChange({
      ...config,
      effect: randomEffect,
      density: rand(20, 100, 1),
      size: parseFloat(rand(0.5, 6.0, 0.1).toFixed(1)),
      wavelength: parseFloat(rand(0.5, 8.0, 0.1).toFixed(1)),
      amplitude: rand(20, 200, 1),
      speed: parseFloat(rand(0.2, 3.0, 0.1).toFixed(1)),
      interactionRadius: rand(50, 350, 1),
      interactionForce: rand(10, 120, 1),
      rippleStrength: rand(5, 80, 1),
      camX: rand(-800, 800, 1),
      camY: rand(-200, 800, 1),
      camZ: rand(-800, 400, 1),
    });
  }, [config, onChange]);

  const handleUploadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result;
        if (typeof text !== "string") return;

        const parsed = parseWaveConfigFromText(text);
        if (parsed) {
          onChange(parsed);
        } else {
          alert("Could not parse config file. Make sure it was exported from Pixel Wave.");
        }
      };
      reader.readAsText(file);

      e.target.value = "";
    },
    [onChange]
  );

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={handleToggleSidebar}
        className="fixed top-[16px] right-[16px] z-50 flex h-[36px] w-[36px] items-center justify-center rounded-[9999px] bg-white/5 backdrop-blur-xl border border-white/7 text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white/80 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isOpen ? "Close control panel" : "Open control panel"}
        tabIndex={0}
      >
        <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`panel-glass fixed top-0 right-0 z-40 flex h-full w-[340px] flex-col transition-transform duration-300 ease-out backdrop-blur-[10px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Wave Controls Panel"
      >
        {/* Header */}
        <div className="border-b border-white/4 px-[20px] py-[10px]">
          <h2 className="text-[20px] font-semibold text-white/75 tracking-wide pt-[15px] pb-0 px-0">Pixel Wave</h2>
          <p className="px-0 text-[11px] text-white/25">
            Floating pixel grid with cursor-driven waves, ripples, and depth
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-[10px] py-[15px]">
          <Section title="Interaction">
            <ChipGrid
              value={config.effect}
              options={WAVE_EFFECTS}
              onChange={(v) => handleUpdate("effect", v)}
            />
            <Slider label="Hover radius" value={config.interactionRadius} min={0} max={400} step={1} onChange={(v) => handleUpdate("interactionRadius", v)} suffix="px" />
            <Slider label="Interaction force" value={config.interactionForce} min={0} max={150} step={1} onChange={(v) => handleUpdate("interactionForce", v)} />
            <Slider label="Ripple strength" value={config.rippleStrength} min={0} max={100} step={1} onChange={(v) => handleUpdate("rippleStrength", v)} />
          </Section>

          <Section title="Grid">
            <Slider label="Density" value={config.density} min={20} max={150} step={1} onChange={(v) => handleUpdate("density", v)} />
            <Slider label="Particle size" value={config.size} min={0.5} max={8.0} step={0.1} onChange={(v) => handleUpdate("size", v)} />
          </Section>

          <Section title="Wave">
            <Slider label="Wavelength" value={config.wavelength} min={0.5} max={8.0} step={0.1} onChange={(v) => handleUpdate("wavelength", v)} />
            <Slider label="Height" value={config.amplitude} min={10} max={250} step={1} onChange={(v) => handleUpdate("amplitude", v)} />
            <Slider label="Speed" value={config.speed} min={0.1} max={4.0} step={0.1} onChange={(v) => handleUpdate("speed", v)} suffix="x" />
          </Section>

          <Section title="Viewport" defaultOpen={true}>
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">
                Right-click + drag to pan X/Y. Scroll to zoom Z.
              </p>
            </div>
            <Slider label="X" value={config.camX} min={-1500} max={1500} step={1} onChange={(v) => handleUpdate("camX", v)} />
            <Slider label="Y" value={config.camY} min={-500} max={1500} step={1} onChange={(v) => handleUpdate("camY", v)} />
            <Slider label="Z" value={config.camZ} min={-1500} max={1500} step={1} onChange={(v) => handleUpdate("camZ", v)} />
          </Section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/4 p-[20px] flex flex-col gap-[10px] backdrop-blur-sm">
          <button
            type="button"
            onClick={() => handleDownloadConfig(config)}
            className="flex w-full items-center justify-center gap-[10px] rounded-[9999px] bg-linear-to-r from-[#308698]/20 to-[#BDED8F]/10 px-[20px] py-[10px] text-[12px] font-semibold uppercase tracking-widest text-white/65 ring-1 ring-inset ring-white/6 transition-all duration-200 hover:from-[#308698]/30 hover:to-[#BDED8F]/20 hover:text-white/85 active:scale-[0.98] cursor-pointer"
            aria-label="Download configuration"
            tabIndex={0}
          >
            <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3" />
            </svg>
            Download Config (.TXT)
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="hidden"
            aria-hidden="true"
          />
          <button
            type="button"
            onClick={handleUploadClick}
            className="flex w-full items-center justify-center gap-[10px] rounded-[9999px] bg-white/4 px-[20px] py-[10px] text-[12px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/6 transition-all duration-200 hover:bg-white/8 hover:text-white/65 active:scale-[0.98] cursor-pointer"
            aria-label="Upload configuration file"
            tabIndex={0}
          >
            <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v13" />
            </svg>
            Upload Config (.TXT)
          </button>
          <div className="flex gap-[10px]">
            <button
              type="button"
              onClick={handleRandomize}
              className="flex flex-1 items-center justify-center gap-[8px] rounded-[9999px] bg-white/4 px-[16px] py-[10px] text-[11px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/4 transition-all duration-200 hover:bg-white/8 hover:text-white/65 active:scale-[0.98] cursor-pointer"
              aria-label="Randomize parameters"
              tabIndex={0}
            >
              <svg className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              Randomize
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-[8px] rounded-[9999px] bg-white/4 px-[16px] py-[10px] text-[11px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/4 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:scale-[0.98] cursor-pointer"
              aria-label="Reset to defaults"
              tabIndex={0}
            >
              <svg className="h-[14px] w-[14px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              Reset
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default WaveControlPanel;
