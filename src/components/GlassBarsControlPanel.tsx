"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  type GlassBarsConfig,
  DEFAULT_GLASS_BARS_CONFIG,
} from "./GlassBarsBackground";

type GlassBarsControlPanelProps = {
  config: GlassBarsConfig;
  onChange: (config: GlassBarsConfig) => void;
};

/* ─── Collapsible Section ─── */

type SectionProps = {
  title: string;
  defaultOpen?: boolean;
  contentClassName?: string;
  children: React.ReactNode;
};

const Section: React.FC<SectionProps> = ({ title, defaultOpen = true, contentClassName, children }) => {
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
          <div className={`flex flex-col gap-0 px-[10px] pt-[10px] pb-[10px] mb-0 ${contentClassName ?? ""}`}>{children}</div>
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
          {step < 1 ? value.toFixed(2) : value}
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

/* ─── Toggle ─── */

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
  const handleToggle = useCallback(() => onChange(!value), [value, onChange]);

  return (
    <div className="flex items-center justify-between mb-[12px]">
      <span className="text-[12px] font-medium text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={handleToggle}
        className={`relative h-[18px] w-[36px] rounded-[9999px] transition-colors duration-200 cursor-pointer ${
          value
            ? "bg-linear-to-r from-[#308698] to-[#5ab899]"
            : "bg-white/8"
        }`}
      >
        <span
          className={`absolute top-[2px] left-[2px] h-[14px] w-[14px] rounded-[9999px] shadow-sm transition-transform duration-200 ${
            value
              ? "translate-x-[18px] bg-white"
              : "translate-x-0 bg-white/50"
          }`}
        />
      </button>
    </div>
  );
};

/* ─── Color Input ─── */

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="flex items-center justify-between px-[10px] pt-0 pb-[12px]">
      <span className="text-[12px] font-medium text-white/40">{label}</span>
      <div className="flex items-center gap-[10px]">
        <span className="text-[12px] tabular-nums text-white/25 uppercase">{value}</span>
        <label className="relative cursor-pointer">
          <span
            className="block h-[24px] w-[24px] rounded-[6px] border border-white/10 shadow-sm"
            style={{ backgroundColor: value }}
          />
          <input
            type="color"
            value={value}
            onChange={handleChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
          />
        </label>
      </div>
    </div>
  );
};

/* ─── Text Input ─── */

type TextInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const TextInput: React.FC<TextInputProps> = ({ label, value, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="flex flex-col gap-[6px] px-[10px] pt-[5px] pb-[8px]">
      <span className="text-[12px] font-medium text-white/40">{label}</span>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        className="w-full rounded-[8px] border border-white/6 bg-white/4 px-[10px] py-[6px] text-[12px] text-white/70 outline-none transition-colors placeholder:text-white/20 focus:border-white/15 focus:bg-white/6"
        aria-label={label}
      />
    </div>
  );
};

/* ─── Download Config ─── */

const handleDownloadConfig = (config: GlassBarsConfig) => {
  const lines = [
    "┌─────────────────────────────────────────┐",
    "│   Glass Bars — Configuration Export      │",
    `│   ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}                       │`,
    "└─────────────────────────────────────────┘",
    "",
    "─── RAW JSON ───",
    "",
    JSON.stringify(config, null, 2),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `glass-bars-config-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ─── Parse Config from TXT ─── */

const parseConfigFromText = (text: string): GlassBarsConfig | null => {
  const jsonMarker = "─── RAW JSON ───";
  const markerIndex = text.indexOf(jsonMarker);
  if (markerIndex === -1) return null;

  const jsonStr = text.slice(markerIndex + jsonMarker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    const next: GlassBarsConfig = { ...DEFAULT_GLASS_BARS_CONFIG };

    const numberKeys: (keyof GlassBarsConfig)[] = [
      "gridSize", "gridDivisions", "gridOpacity",
      "glowStrength", "glowBlur", "glowThreshold", "coreBrightness",
      "transmission", "glassOpacity", "backdropBlur", "thickness", "ior", "metalness",
      "dataSeed", "barWidth", "barDepth", "barRadius", "barSpacing",
      "groupSpacing", "hatchSpacing", "hatchThickness", "animationTrigger",
      "overlayY", "gridSizeOverlay", "gridOpacityOverlay",
      "centerGlowRadius", "centerGlowOpacity", "centerGlowY",
    ];

    const booleanKeys: (keyof GlassBarsConfig)[] = [
      "showSurfaceGrid", "showOverlay", "showGrid", "showCenterGlow",
    ];

    const stringKeys: (keyof GlassBarsConfig)[] = [
      "colorA", "colorB", "bgColor", "gridColor",
      "overlayHeading", "overlaySubtext", "overlayButtonText", "overlayButtonUrl",
      "gridColorOverlay", "centerGlowColor", "centerGlowColorOuter",
    ];

    for (const key of numberKeys) {
      if (key in parsed && typeof parsed[key] === "number") {
        (next as Record<string, unknown>)[key] = parsed[key];
      }
    }

    for (const key of booleanKeys) {
      if (key in parsed && typeof parsed[key] === "boolean") {
        (next as Record<string, unknown>)[key] = parsed[key];
      }
    }

    for (const key of stringKeys) {
      if (key in parsed && typeof parsed[key] === "string") {
        (next as Record<string, unknown>)[key] = parsed[key];
      }
    }

    return next;
  } catch {
    return null;
  }
};

/* ─── Main Panel ─── */

const GlassBarsControlPanel: React.FC<GlassBarsControlPanelProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    <K extends keyof GlassBarsConfig>(key: K, value: GlassBarsConfig[K]) => {
      onChange({ ...config, [key]: value });
    },
    [config, onChange]
  );

  const handleReset = useCallback(() => onChange({ ...DEFAULT_GLASS_BARS_CONFIG }), [onChange]);
  const handleToggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

  const handleRandomize = useCallback(() => {
    const rand = (min: number, max: number, step: number) => {
      const steps = Math.round((max - min) / step);
      return min + Math.floor(Math.random() * (steps + 1)) * step;
    };
    const randColor = () => `#${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, "0")}`;

    onChange({
      ...config,
      dataSeed: Math.floor(Math.random() * 999999),
      barWidth: parseFloat(rand(0.2, 2, 0.05).toFixed(2)),
      barDepth: parseFloat(rand(0.2, 2, 0.05).toFixed(2)),
      barRadius: parseFloat(rand(0, 1, 0.05).toFixed(2)),
      barSpacing: parseFloat(rand(0.1, 2, 0.05).toFixed(2)),
      groupSpacing: parseFloat(rand(0.5, 5, 0.1).toFixed(1)),
      hatchSpacing: parseFloat(rand(0.05, 0.5, 0.01).toFixed(2)),
      hatchThickness: parseFloat(rand(0.02, 0.2, 0.01).toFixed(2)),
      colorA: randColor(),
      colorB: randColor(),
      glowStrength: parseFloat(rand(0, 1, 0.01).toFixed(2)),
      glowBlur: parseFloat(rand(0, 1, 0.01).toFixed(2)),
      coreBrightness: parseFloat(rand(0, 2, 0.1).toFixed(1)),
      transmission: parseFloat(rand(0, 1, 0.01).toFixed(2)),
      glassOpacity: parseFloat(rand(0, 1, 0.01).toFixed(2)),
      backdropBlur: parseFloat(rand(0, 1, 0.01).toFixed(2)),
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

        const parsed = parseConfigFromText(text);
        if (parsed) {
          onChange(parsed);
        } else {
          alert("Could not parse config file. Make sure it was exported from Glass Bars.");
        }
      };
      reader.readAsText(file);

      e.target.value = "";
    },
    [onChange]
  );

  return (
    <>
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

      <aside
        className={`panel-glass fixed top-0 right-0 z-40 flex h-full w-[340px] flex-col transition-transform duration-300 ease-out backdrop-blur-[10px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Glass Bars Control Panel"
      >
        <div className="border-b border-white/4 px-[20px] py-[10px]">
          <h2 className="text-[20px] font-semibold text-white/75 tracking-wide pt-[15px] pb-0 px-0">Glass Bars</h2>
          <p className="px-0 text-[11px] text-white/25">
            3D frosted glass bar graph with bloom and spring physics
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-[10px] py-[15px]">
          <Section title="Dimensions & Layout">
            <Slider label="Data seed" value={config.dataSeed} min={0} max={999999} step={1} onChange={(v) => handleUpdate("dataSeed", v)} />
            <Slider label="Bar width" value={config.barWidth} min={0.1} max={2} step={0.05} onChange={(v) => handleUpdate("barWidth", v)} />
            <Slider label="Bar depth" value={config.barDepth} min={0.1} max={2} step={0.05} onChange={(v) => handleUpdate("barDepth", v)} />
            <Slider label="Corner radius" value={config.barRadius} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("barRadius", v)} />
            <Slider label="Bar spacing" value={config.barSpacing} min={0.1} max={3} step={0.05} onChange={(v) => handleUpdate("barSpacing", v)} />
            <Slider label="Group spacing" value={config.groupSpacing} min={0.5} max={5} step={0.1} onChange={(v) => handleUpdate("groupSpacing", v)} />
          </Section>

          <Section title="Colors" contentClassName="gap-[16px]">
            <ColorInput label="Bar A color" value={config.colorA} onChange={(v) => handleUpdate("colorA", v)} />
            <ColorInput label="Bar B color" value={config.colorB} onChange={(v) => handleUpdate("colorB", v)} />
            <ColorInput label="Background" value={config.bgColor} onChange={(v) => handleUpdate("bgColor", v)} />
          </Section>

          <Section title="Glass Material">
            <Slider label="Transmission" value={config.transmission} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("transmission", v)} />
            <Slider label="Opacity" value={config.glassOpacity} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("glassOpacity", v)} />
            <Slider label="Backdrop blur" value={config.backdropBlur} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("backdropBlur", v)} />
            <Slider label="Thickness" value={config.thickness} min={0} max={2} step={0.05} onChange={(v) => handleUpdate("thickness", v)} />
            <Slider label="IOR" value={config.ior} min={1} max={2.5} step={0.05} onChange={(v) => handleUpdate("ior", v)} />
            <Slider label="Metalness" value={config.metalness} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("metalness", v)} />
          </Section>

          <Section title="Glow (Bloom)">
            <Slider label="Glow strength" value={config.glowStrength} min={0} max={2} step={0.01} onChange={(v) => handleUpdate("glowStrength", v)} />
            <Slider label="Glow blur" value={config.glowBlur} min={0} max={2} step={0.01} onChange={(v) => handleUpdate("glowBlur", v)} />
            <Slider label="Glow threshold" value={config.glowThreshold} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("glowThreshold", v)} />
            <Slider label="Core brightness" value={config.coreBrightness} min={0} max={3} step={0.1} onChange={(v) => handleUpdate("coreBrightness", v)} />
          </Section>

          <Section title="Change Indicators" defaultOpen={false}>
            <Slider label="Hatch spacing" value={config.hatchSpacing} min={0.02} max={0.5} step={0.01} onChange={(v) => handleUpdate("hatchSpacing", v)} />
            <Slider label="Hatch thickness" value={config.hatchThickness} min={0.01} max={0.2} step={0.01} onChange={(v) => handleUpdate("hatchThickness", v)} />
          </Section>

          <Section title="Surface Grid" defaultOpen={false}>
            <Toggle label="Show grid" value={config.showSurfaceGrid} onChange={(v) => handleUpdate("showSurfaceGrid", v)} />
            {config.showSurfaceGrid && (
              <>
                <Slider label="Size" value={config.gridSize} min={5} max={50} step={1} onChange={(v) => handleUpdate("gridSize", v)} />
                <Slider label="Divisions" value={config.gridDivisions} min={5} max={50} step={1} onChange={(v) => handleUpdate("gridDivisions", v)} />
                <Slider label="Opacity" value={config.gridOpacity} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("gridOpacity", v)} />
                <ColorInput label="Grid color" value={config.gridColor} onChange={(v) => handleUpdate("gridColor", v)} />
              </>
            )}
          </Section>

        </div>

        <div className="border-t border-white/4 p-[20px] flex flex-col gap-[10px] backdrop-blur-[8px]">
          <button
            type="button"
            onClick={() => handleUpdate("animationTrigger", (config.animationTrigger || 0) + 1)}
            className="flex w-full items-center justify-center gap-[10px] rounded-[9999px] bg-linear-to-r from-[#308698]/20 to-[#BDED8F]/10 px-[20px] py-[10px] text-[12px] font-semibold uppercase tracking-widest text-white/65 ring-1 ring-inset ring-white/6 transition-all duration-200 hover:from-[#308698]/30 hover:to-[#BDED8F]/20 hover:text-white/85 active:scale-[0.98] cursor-pointer"
            aria-label="Play animation"
            tabIndex={0}
          >
            <svg className="h-[16px] w-[16px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.986V5.653z" />
            </svg>
            Play Animation
          </button>
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

export default GlassBarsControlPanel;
