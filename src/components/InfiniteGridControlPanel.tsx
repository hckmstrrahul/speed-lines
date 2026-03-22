"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  type InfiniteGridConfig,
  DEFAULT_INFINITE_GRID_CONFIG,
} from "./InfiniteGridBackground";

type InfiniteGridControlPanelProps = {
  config: InfiniteGridConfig;
  onChange: (config: InfiniteGridConfig) => void;
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
  disabled?: boolean;
};

const Slider: React.FC<SliderProps> = ({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix = "",
  disabled = false,
}) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value)),
    [onChange]
  );

  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div
      className={`flex flex-col gap-[8px] px-[10px] pt-[5px] pb-[8px] mb-0 ${disabled ? "pointer-events-none opacity-40" : ""}`}
    >
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-white/40">{label}</span>
        <span className="text-[12px] tabular-nums text-white/50">
          {step < 0.1 ? value.toFixed(2) : step < 1 ? value.toFixed(1) : value}
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
          disabled={disabled}
        />
      </div>
    </div>
  );
};

/* ─── Color input ─── */

type ColorInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const ColorInput: React.FC<ColorInputProps> = ({ label, value, onChange, disabled = false }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div
      className={`flex items-center justify-between px-[10px] pt-[5px] pb-[8px] ${disabled ? "opacity-40 pointer-events-none" : ""}`}
    >
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
            value={value.length === 7 ? value : "#0a0a0a"}
            onChange={handleChange}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label={label}
            disabled={disabled}
          />
        </label>
      </div>
    </div>
  );
};

/* ─── Download Config ─── */

const handleDownloadConfig = (config: InfiniteGridConfig) => {
  const lines = [
    "┌─────────────────────────────────────────┐",
    "│   Infinite Grid — Configuration Export   │",
    `│   ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}                       │`,
    "└─────────────────────────────────────────┘",
    "",
    "GRID",
    `  tileWidth            : ${config.tileWidth}px`,
    `  tileHeight           : ${config.tileHeight}px`,
    `  gap                  : ${config.gap}px`,
    `  tileIconSeed         : ${config.tileIconSeed}`,
    "",
    "HOVER",
    `  hoverRadius          : ${config.hoverRadius}px`,
    `  maxScale             : ${config.maxScale}`,
    `  pushForce            : ${config.pushForce}`,
    "",
    "PAN",
    `  panSpeedX            : ${config.panSpeedX}`,
    `  panSpeedY            : ${config.panSpeedY}`,
    `  panPaused            : ${config.panPaused}`,
    "",
    "VIGNETTE",
    `  vignetteEnabled      : ${config.vignetteEnabled}`,
    `  vignetteColor        : ${config.vignetteColor}`,
    `  vignetteInnerPercent : ${config.vignetteInnerPercent}%`,
    `  vignetteSizePercent  : ${config.vignetteSizePercent}%`,
    `  vignetteStrength     : ${config.vignetteStrength}`,
    "",
    "─── RAW JSON ───",
    "",
    JSON.stringify(config, null, 2),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `infinite-grid-config-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ─── Parse Config from TXT ─── */

const parseInfiniteGridConfigFromText = (text: string): InfiniteGridConfig | null => {
  const jsonMarker = "─── RAW JSON ───";
  const markerIndex = text.indexOf(jsonMarker);
  if (markerIndex === -1) return null;

  const jsonStr = text.slice(markerIndex + jsonMarker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr) as Record<string, unknown>;
    const next: InfiniteGridConfig = { ...DEFAULT_INFINITE_GRID_CONFIG };

    const numberKeys: (keyof InfiniteGridConfig)[] = [
      "tileWidth",
      "tileHeight",
      "gap",
      "hoverRadius",
      "maxScale",
      "pushForce",
      "panSpeedX",
      "panSpeedY",
      "vignetteInnerPercent",
      "vignetteSizePercent",
      "vignetteStrength",
      "tileIconSeed",
    ];

    for (const key of numberKeys) {
      if (key in parsed && typeof parsed[key] === "number") {
        (next as Record<string, unknown>)[key] = parsed[key];
      }
    }

    if ("panPaused" in parsed && typeof parsed.panPaused === "boolean") {
      next.panPaused = parsed.panPaused;
    }

    if ("vignetteEnabled" in parsed && typeof parsed.vignetteEnabled === "boolean") {
      next.vignetteEnabled = parsed.vignetteEnabled;
    }

    if ("vignetteColor" in parsed && typeof parsed.vignetteColor === "string") {
      next.vignetteColor = parsed.vignetteColor;
    }

    return next;
  } catch {
    return null;
  }
};

/* ─── Main Panel ─── */

const InfiniteGridControlPanel: React.FC<InfiniteGridControlPanelProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    <K extends keyof InfiniteGridConfig>(key: K, value: InfiniteGridConfig[K]) => {
      onChange({ ...config, [key]: value });
    },
    [config, onChange]
  );

  const handleReset = useCallback(() => onChange({ ...DEFAULT_INFINITE_GRID_CONFIG }), [onChange]);
  const handleToggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

  const handleRandomize = useCallback(() => {
    const rand = (min: number, max: number, step: number) => {
      const steps = Math.round((max - min) / step);
      return min + Math.floor(Math.random() * (steps + 1)) * step;
    };

    onChange({
      ...config,
      tileWidth: rand(10, 300, 1),
      tileHeight: rand(10, 300, 1),
      gap: rand(0, 50, 1),
      hoverRadius: rand(100, 800, 1),
      maxScale: parseFloat(rand(1, 4, 0.1).toFixed(1)),
      pushForce: rand(0, 100, 1),
      panSpeedX: parseFloat(rand(-5, 5, 0.1).toFixed(1)),
      panSpeedY: parseFloat(rand(-5, 5, 0.1).toFixed(1)),
      tileIconSeed: Math.floor(Math.random() * 100_000_000),
      vignetteInnerPercent: rand(20, 60, 1),
      vignetteSizePercent: rand(110, 170, 1),
      vignetteStrength: parseFloat(rand(0.5, 1.5, 0.05).toFixed(2)),
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

        const parsed = parseInfiniteGridConfigFromText(text);
        if (parsed) {
          onChange(parsed);
        } else {
          alert("Could not parse config file. Make sure it was exported from Infinite Grid.");
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
        aria-label="Infinite Grid Controls Panel"
      >
        <div className="border-b border-white/4 px-[20px] py-[10px]">
          <h2 className="text-[20px] font-semibold text-white/75 tracking-wide pt-[15px] pb-0 px-0">Infinite Grid</h2>
          <p className="px-0 text-[11px] text-white/25">
            Icons on a wrapped grid — auto-pan, drag, and cursor fisheye
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-[10px] py-[15px]">
          <Section title="Grid">
            <Slider
              label="Tile width"
              value={config.tileWidth}
              min={10}
              max={300}
              step={1}
              onChange={(v) => handleUpdate("tileWidth", v)}
              suffix="px"
            />
            <Slider
              label="Tile height"
              value={config.tileHeight}
              min={10}
              max={300}
              step={1}
              onChange={(v) => handleUpdate("tileHeight", v)}
              suffix="px"
            />
            <Slider label="Gap" value={config.gap} min={0} max={50} step={1} onChange={(v) => handleUpdate("gap", v)} suffix="px" />
            <div className="flex flex-col gap-[8px] px-[10px] pt-[5px] pb-[8px]">
              <span className="text-[12px] font-medium text-white/40">Icon mix seed</span>
              <div className="flex gap-[8px]">
                <input
                  type="number"
                  min={0}
                  max={2147483647}
                  value={config.tileIconSeed}
                  onChange={(e) => {
                    const raw = e.target.value;
                    if (raw === "" || raw === "-") return;
                    const n = parseInt(raw, 10);
                    if (!Number.isFinite(n)) return;
                    handleUpdate("tileIconSeed", Math.max(0, Math.min(2147483647, n)));
                  }}
                  className="min-w-0 flex-1 rounded-[10px] border border-white/10 bg-white/5 px-[12px] py-[10px] text-[13px] tabular-nums text-white/80 outline-none focus-visible:ring-2 focus-visible:ring-[#308698]/50"
                  aria-label="Icon mix seed"
                />
                <button
                  type="button"
                  onClick={() => handleUpdate("tileIconSeed", Math.floor(Math.random() * 100_000_000))}
                  className="shrink-0 rounded-[9999px] border border-white/8 bg-white/4 px-[14px] py-[10px] text-[11px] font-semibold uppercase tracking-widest text-white/45 transition-colors hover:bg-white/8 hover:text-white/70 cursor-pointer"
                  tabIndex={0}
                >
                  Shuffle
                </button>
              </div>
            </div>
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">
                Same seed keeps the icon layout; change seed to remix which SVG appears on each tile.
              </p>
            </div>
          </Section>

          <Section title="Hover">
            <Slider
              label="Hover radius"
              value={config.hoverRadius}
              min={100}
              max={800}
              step={1}
              onChange={(v) => handleUpdate("hoverRadius", v)}
              suffix="px"
            />
            <Slider
              label="Hover scale"
              value={config.maxScale}
              min={1}
              max={4}
              step={0.1}
              onChange={(v) => handleUpdate("maxScale", v)}
            />
            <Slider label="Push force" value={config.pushForce} min={0} max={100} step={1} onChange={(v) => handleUpdate("pushForce", v)} />
          </Section>

          <Section title="Vignette">
            <div className="flex gap-[10px] px-[10px] pb-[10px] pt-[5px]">
              <button
                type="button"
                onClick={() => handleUpdate("vignetteEnabled", !config.vignetteEnabled)}
                className={`flex-1 rounded-[9999px] border py-[10px] text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  config.vignetteEnabled
                    ? "border-[#308698]/40 bg-[#308698]/15 text-white/85"
                    : "border-white/8 bg-white/4 text-white/45 hover:bg-white/8 hover:text-white/70"
                }`}
                aria-pressed={config.vignetteEnabled}
                tabIndex={0}
              >
                {config.vignetteEnabled ? "On" : "Off"}
              </button>
            </div>
            <ColorInput
              label="Fade color"
              value={config.vignetteColor}
              onChange={(v) => handleUpdate("vignetteColor", v)}
              disabled={!config.vignetteEnabled}
            />
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">
                Matches tab background; edges fade into this color.
              </p>
            </div>
            <Slider
              label="Clear center"
              value={config.vignetteInnerPercent}
              min={5}
              max={85}
              step={1}
              onChange={(v) => handleUpdate("vignetteInnerPercent", v)}
              suffix="%"
              disabled={!config.vignetteEnabled}
            />
            <Slider
              label="Reach"
              value={config.vignetteSizePercent}
              min={80}
              max={200}
              step={1}
              onChange={(v) => handleUpdate("vignetteSizePercent", v)}
              suffix="%"
              disabled={!config.vignetteEnabled}
            />
            <Slider
              label="Strength"
              value={config.vignetteStrength}
              min={0}
              max={1.5}
              step={0.05}
              onChange={(v) => handleUpdate("vignetteStrength", v)}
              disabled={!config.vignetteEnabled}
            />
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">
                Above 1 adds a second pass for heavier edges.
              </p>
            </div>
          </Section>

          <Section title="Pan">
            <Slider
              label="Pan speed X"
              value={config.panSpeedX}
              min={-5}
              max={5}
              step={0.1}
              onChange={(v) => handleUpdate("panSpeedX", v)}
            />
            <Slider
              label="Pan speed Y"
              value={config.panSpeedY}
              min={-5}
              max={5}
              step={0.1}
              onChange={(v) => handleUpdate("panSpeedY", v)}
            />
            <div className="flex gap-[10px] px-[10px] pb-[10px] pt-[5px]">
              <button
                type="button"
                onClick={() => handleUpdate("panPaused", !config.panPaused)}
                className={`flex-1 rounded-[9999px] border py-[10px] text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  config.panPaused
                    ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                    : "border-white/8 bg-white/4 text-white/45 hover:bg-white/8 hover:text-white/70"
                }`}
                aria-pressed={config.panPaused}
                tabIndex={0}
              >
                {config.panPaused ? "Resume pan" : "Pause pan"}
              </button>
            </div>
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">Drag to pan manually. Hover tiles for scale and push.</p>
            </div>
          </Section>
        </div>

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

export default InfiniteGridControlPanel;
