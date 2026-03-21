"use client";

import React, { useState, useCallback, useRef } from "react";
import {
  type PaintingWheelConfig,
  DEFAULT_PAINTING_WHEEL_CONFIG,
} from "./PaintingWheelBackground";

type PaintingWheelControlPanelProps = {
  config: PaintingWheelConfig;
  onChange: (config: PaintingWheelConfig) => void;
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
          {step <= 0.02 ? value.toFixed(2) : step < 1 ? value.toFixed(1) : value}
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

/* ─── Toggle ─── */

type ToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

const Toggle: React.FC<ToggleProps> = ({ label, value, onChange }) => {
  const handleToggle = useCallback(() => onChange(!value), [value, onChange]);

  return (
    <div className="flex items-center justify-between px-[10px] py-[6px]">
      <span className="text-[12px] font-medium text-white/40">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={handleToggle}
        className={`relative h-[22px] w-[40px] rounded-[9999px] transition-colors duration-200 cursor-pointer ${
          value ? "bg-linear-to-r from-[#308698] to-[#5ab899]" : "bg-white/8"
        }`}
        tabIndex={0}
      >
        <span
          className={`absolute top-[3px] left-[3px] h-[16px] w-[16px] rounded-[9999px] shadow-sm transition-transform duration-200 ${
            value ? "translate-x-[18px] bg-white" : "translate-x-0 bg-white/50"
          }`}
        />
      </button>
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
            value={value.length === 7 ? value : "#ffffff"}
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

const handleDownloadConfig = (config: PaintingWheelConfig) => {
  const lines = [
    "┌─────────────────────────────────────────┐",
    "│   Painting Wheel — Configuration Export  │",
    `│   ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}                       │`,
    "└─────────────────────────────────────────┘",
    "",
    "CAMERA & AXIS",
    `  perspective          : ${config.perspective}px`,
    `  tiltX                : ${config.tiltX}°`,
    `  tiltY                : ${config.tiltY}°`,
    `  tiltZ                : ${config.tiltZ}°`,
    `  panX                 : ${config.panX}px`,
    `  panY                 : ${config.panY}px`,
    "",
    "GEOMETRY",
    `  numCards             : ${config.numCards}`,
    `  radius               : ${config.radius}px`,
    `  cardW                : ${config.cardW}px`,
    `  cardH                : ${config.cardH}px`,
    "",
    "CARD FRAME",
    `  cardBorderRadius     : ${config.cardBorderRadius}px`,
    `  cardStrokeVisible    : ${config.cardStrokeVisible}`,
    `  cardStrokeWidth      : ${config.cardStrokeWidth}px`,
    `  cardStrokeColor      : ${config.cardStrokeColor}`,
    `  cardStrokeOpacity    : ${config.cardStrokeOpacity}`,
    "",
    "CARD ROTATION",
    `  cardRotX             : ${config.cardRotX}°`,
    `  cardRotY             : ${config.cardRotY}°`,
    `  cardRotZ             : ${config.cardRotZ}°`,
    "",
    "ANIMATION",
    `  speed                : ${config.speed}s`,
    `  reverse              : ${config.reverse}`,
    `  paused               : ${config.paused}`,
    "",
    "PLACEHOLDER SHUFFLE",
    `  imageSeed            : ${config.imageSeed}  (unique first, then repeats)`,
    "",
    "─── RAW JSON ───",
    "",
    JSON.stringify(config, null, 2),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `painting-wheel-config-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const parsePaintingWheelConfigFromText = (text: string): PaintingWheelConfig | null => {
  const jsonMarker = "─── RAW JSON ───";
  const markerIndex = text.indexOf(jsonMarker);
  if (markerIndex === -1) return null;

  const jsonStr = text.slice(markerIndex + jsonMarker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr);
    const config: PaintingWheelConfig = { ...DEFAULT_PAINTING_WHEEL_CONFIG };

    const numberKeys: (keyof PaintingWheelConfig)[] = [
      "perspective",
      "tiltX",
      "tiltY",
      "tiltZ",
      "panX",
      "panY",
      "numCards",
      "radius",
      "cardW",
      "cardH",
      "cardRotX",
      "cardRotY",
      "cardRotZ",
      "speed",
      "imageSeed",
      "cardBorderRadius",
      "cardStrokeWidth",
      "cardStrokeOpacity",
    ];

    const booleanKeys: (keyof PaintingWheelConfig)[] = ["reverse", "paused", "cardStrokeVisible"];

    const stringKeys: (keyof PaintingWheelConfig)[] = ["cardStrokeColor"];

    for (const key of numberKeys) {
      if (key in parsed && typeof parsed[key] === "number") {
        (config as Record<string, unknown>)[key] = parsed[key];
      }
    }

    for (const key of booleanKeys) {
      if (key in parsed && typeof parsed[key] === "boolean") {
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

const PaintingWheelControlPanel: React.FC<PaintingWheelControlPanelProps> = ({
  config,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    <K extends keyof PaintingWheelConfig>(key: K, value: PaintingWheelConfig[K]) => {
      onChange({ ...config, [key]: value });
    },
    [config, onChange]
  );

  const handleReset = useCallback(() => onChange({ ...DEFAULT_PAINTING_WHEEL_CONFIG }), [onChange]);
  const handleToggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

  const handleRandomize = useCallback(() => {
    const rand = (min: number, max: number, step: number) => {
      const steps = Math.round((max - min) / step);
      return min + Math.floor(Math.random() * (steps + 1)) * step;
    };

    onChange({
      ...config,
      tiltX: rand(-90, 90, 1),
      tiltY: rand(-90, 90, 1),
      tiltZ: rand(-45, 45, 1),
      panX: rand(-200, 200, 1),
      panY: rand(-200, 200, 1),
      numCards: rand(4, 40, 1),
      radius: rand(150, 800, 10),
      cardW: rand(80, 320, 5),
      cardH: rand(60, 400, 5),
      cardRotX: rand(-30, 30, 1),
      cardRotY: rand(-45, 45, 1),
      cardRotZ: rand(-20, 20, 1),
      speed: rand(5, 80, 1),
      reverse: Math.random() > 0.5,
      paused: false,
      imageSeed: rand(1, 900, 1),
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

        const parsed = parsePaintingWheelConfigFromText(text);
        if (parsed) {
          onChange(parsed);
        } else {
          alert("Could not parse config file. Make sure it was exported from Painting Wheel.");
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
        aria-label="Painting Wheel Controls Panel"
        onPointerDown={(e) => e.stopPropagation()}
      >
        <div className="border-b border-white/4 px-[20px] py-[10px]">
          <h2 className="text-[20px] font-semibold text-white/75 tracking-wide pt-[15px] pb-0 px-0">
            Painting Wheel
          </h2>
          <p className="px-0 text-[11px] text-white/25">
            3D carousel — drag, zoom, and pan on the canvas
          </p>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin px-[10px] py-[15px]">
          <Section title="Camera & axis">
            <Slider
              label="Perspective"
              value={config.perspective}
              min={300}
              max={5000}
              step={50}
              onChange={(v) => handleUpdate("perspective", v)}
              suffix="px"
            />
            <Slider
              label="Tilt X (up / down)"
              value={config.tiltX}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("tiltX", v)}
              suffix="°"
            />
            <Slider
              label="Tilt Y (left / right)"
              value={config.tiltY}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("tiltY", v)}
              suffix="°"
            />
            <Slider
              label="Tilt Z (roll)"
              value={config.tiltZ}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("tiltZ", v)}
              suffix="°"
            />
            <Slider label="Pan X" value={config.panX} min={-2000} max={2000} step={1} onChange={(v) => handleUpdate("panX", v)} suffix="px" />
            <Slider label="Pan Y" value={config.panY} min={-2000} max={2000} step={1} onChange={(v) => handleUpdate("panY", v)} suffix="px" />
          </Section>

          <Section title="Geometry">
            <Slider label="Card count" value={config.numCards} min={4} max={60} step={1} onChange={(v) => handleUpdate("numCards", v)} />
            <Slider
              label="Wheel radius"
              value={config.radius}
              min={100}
              max={1500}
              step={10}
              onChange={(v) => handleUpdate("radius", v)}
              suffix="px"
            />
            <Slider label="Card width" value={config.cardW} min={50} max={400} step={5} onChange={(v) => handleUpdate("cardW", v)} suffix="px" />
            <Slider label="Card height" value={config.cardH} min={50} max={600} step={5} onChange={(v) => handleUpdate("cardH", v)} suffix="px" />
          </Section>

          <Section title="Card frame">
            <Slider
              label="Corner radius"
              value={config.cardBorderRadius}
              min={0}
              max={999}
              step={1}
              onChange={(v) => handleUpdate("cardBorderRadius", v)}
              suffix="px"
            />
            <Toggle label="Stroke visible" value={config.cardStrokeVisible} onChange={(v) => handleUpdate("cardStrokeVisible", v)} />
            <Slider
              label="Stroke width"
              value={config.cardStrokeWidth}
              min={0}
              max={6}
              step={0.5}
              onChange={(v) => handleUpdate("cardStrokeWidth", v)}
              suffix="px"
              disabled={!config.cardStrokeVisible}
            />
            <ColorInput
              label="Stroke color"
              value={config.cardStrokeColor}
              onChange={(v) => handleUpdate("cardStrokeColor", v)}
              disabled={!config.cardStrokeVisible}
            />
            <Slider
              label="Stroke opacity"
              value={config.cardStrokeOpacity}
              min={0}
              max={1}
              step={0.01}
              onChange={(v) => handleUpdate("cardStrokeOpacity", v)}
              disabled={!config.cardStrokeVisible}
            />
          </Section>

          <Section title="Card rotation">
            <Slider
              label="Local X (pitch)"
              value={config.cardRotX}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("cardRotX", v)}
              suffix="°"
            />
            <Slider
              label="Local Y (yaw)"
              value={config.cardRotY}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("cardRotY", v)}
              suffix="°"
            />
            <Slider
              label="Local Z (roll)"
              value={config.cardRotZ}
              min={-180}
              max={180}
              step={1}
              onChange={(v) => handleUpdate("cardRotZ", v)}
              suffix="°"
            />
          </Section>

          <Section title="Animation">
            <Slider
              label="Rotation duration"
              value={config.speed}
              min={2}
              max={120}
              step={1}
              onChange={(v) => handleUpdate("speed", v)}
              suffix="s"
            />
            <div className="flex gap-[10px] px-[10px] pb-[10px] pt-[5px]">
              <button
                type="button"
                onClick={() => handleUpdate("paused", !config.paused)}
                className={`flex-1 rounded-[9999px] border py-[10px] text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  config.paused
                    ? "border-amber-500/30 bg-amber-500/15 text-amber-300"
                    : "border-white/8 bg-white/4 text-white/45 hover:bg-white/8 hover:text-white/70"
                }`}
                aria-pressed={config.paused}
                tabIndex={0}
              >
                {config.paused ? "Resume" : "Pause"}
              </button>
              <button
                type="button"
                onClick={() => handleUpdate("reverse", !config.reverse)}
                className={`flex-1 rounded-[9999px] border py-[10px] text-[11px] font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  config.reverse
                    ? "border-[#308698]/40 bg-[#308698]/15 text-white/85"
                    : "border-white/8 bg-white/4 text-white/45 hover:bg-white/8 hover:text-white/70"
                }`}
                aria-pressed={config.reverse}
                tabIndex={0}
              >
                Reverse
              </button>
            </div>
          </Section>

          <Section title="Placeholders" defaultOpen={false}>
            <div className="px-[10px] pb-[8px]">
              <p className="text-[11px] text-white/20 leading-[16px]">
                First 11 cards each show a different file (order shuffled by seed); card 12+ repeats the pool with seeded random picks
              </p>
            </div>
            <Slider
              label="Shuffle seed"
              value={config.imageSeed}
              min={1}
              max={999}
              step={1}
              onChange={(v) => handleUpdate("imageSeed", v)}
            />
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

export default PaintingWheelControlPanel;
