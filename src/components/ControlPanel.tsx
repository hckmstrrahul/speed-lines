"use client";

import React, { useState, useCallback, useRef } from "react";
import { type SpeedLinesConfig, DEFAULT_CONFIG } from "./SpeedLinesBackground";

type ControlPanelProps = {
  config: SpeedLinesConfig;
  onChange: (config: SpeedLinesConfig) => void;
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
    <div className="border-b border-white/4 mt-2.5 mb-2.5">
      <button
        type="button"
        onClick={handleToggle}
        className="group flex w-full items-center justify-between px-6 py-2.5 cursor-pointer my-[15px]"
        aria-expanded={isOpen}
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-colors group-hover:text-white/65">
          {title}
        </span>
        <svg
          className={`h-3 w-3 text-white/20 transition-transform duration-200 group-hover:text-white/40 ${isOpen ? "rotate-0" : "-rotate-90"}`}
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
          <div className="flex flex-col gap-4 px-2.5 pt-[10px] pb-5 mb-[15px]">{children}</div>
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
    <div className="flex flex-col gap-2 px-2.5 pt-[10px] pb-5 mb-[15px]">
      <div className="flex items-baseline justify-between">
        <span className="text-[12px] font-medium text-white/40">{label}</span>
        <span className="text-[12px] tabular-nums text-white/50">
          {step < 1 ? value.toFixed(2) : value}
          {suffix}
        </span>
      </div>
      <div className="relative flex items-center h-5">
        <div className="absolute left-0 right-0 h-[3px] rounded-full bg-white/6" />
        <div
          className="absolute left-0 h-[3px] rounded-full"
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
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-white">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        onClick={handleToggle}
        className={`relative h-[22px] w-10 rounded-full transition-colors duration-200 cursor-pointer ${
          value
            ? "bg-linear-to-r from-[#308698] to-[#5ab899]"
            : "bg-white/8"
        }`}
      >
        <span
          className={`absolute top-[3px] left-[3px] h-4 w-4 rounded-full shadow-sm transition-transform duration-200 ${
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
    <div className="flex items-center justify-between">
      <span className="text-[12px] font-medium text-white/40">{label}</span>
      <div className="flex items-center gap-2.5">
        <span className="text-[12px] tabular-nums text-white/25 uppercase">{value}</span>
        <label className="relative cursor-pointer">
          <span
            className="block h-6 w-6 rounded-md border border-white/10 shadow-sm"
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

/* ─── Color Chip ─── */

type ColorChipProps = {
  color: string;
  onRemove: () => void;
  onChange: (value: string) => void;
};

const ColorChip: React.FC<ColorChipProps> = ({ color, onRemove, onChange }) => {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value),
    [onChange]
  );

  return (
    <div className="group relative">
      <label className="cursor-pointer">
        <span
          className="block h-7 w-7 rounded-lg border border-white/10 shadow-sm transition-transform hover:scale-110"
          style={{ backgroundColor: color }}
        />
        <input
          type="color"
          value={color}
          onChange={handleChange}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
          aria-label={`Beam color ${color}`}
        />
      </label>
      <button
        type="button"
        onClick={onRemove}
        className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-black/80 text-[9px] leading-none text-white/50 opacity-0 ring-1 ring-white/10 transition-opacity group-hover:opacity-100 hover:bg-red-600 hover:text-white cursor-pointer"
        aria-label={`Remove color ${color}`}
      >
        &times;
      </button>
    </div>
  );
};

/* ─── Download Config ─── */

const handleDownloadConfig = (config: SpeedLinesConfig) => {
  const lines = [
    "┌─────────────────────────────────────────┐",
    "│   Speed Lines — Configuration Export     │",
    `│   ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}                       │`,
    "└─────────────────────────────────────────┘",
    "",
    "BEAMS",
    `  numBeams             : ${config.numBeams}`,
    `  convergenceGap       : ${config.convergenceGap}`,
    `  verticalSpread       : ${config.verticalSpread}`,
    `  outerVerticalSpread  : ${config.outerVerticalSpread}`,
    "",
    "COLORS",
    `  beamColors           : ${JSON.stringify(config.beamColors)}`,
    `  accentColor          : ${config.accentColor}`,
    `  backgroundColor      : ${config.backgroundColor}`,
    "",
    "STROKE",
    `  opacityMin           : ${config.opacityMin}`,
    `  opacityMax           : ${config.opacityMax}`,
    `  strokeWidthMin       : ${config.strokeWidthMin}`,
    `  strokeWidthMax       : ${config.strokeWidthMax}`,
    "",
    "ANIMATION",
    `  animationChance      : ${config.animationChance}`,
    `  animationSpeedMin    : ${config.animationSpeedMin}s`,
    `  animationSpeedMax    : ${config.animationSpeedMax}s`,
    `  dashLength           : ${config.dashLength}px`,
    `  dashGap              : ${config.dashGap}px`,
    `  particleExtraWidth   : ${config.particleExtraWidth}px`,
    "",
    "GLOW & EFFECTS",
    `  glowBlur             : ${config.glowBlur}px`,
    `  showEdgeGlow         : ${config.showEdgeGlow}`,
    `  edgeGlowOpacity      : ${config.edgeGlowOpacity}`,
    `  showVignette         : ${config.showVignette}`,
    `  vignetteOpacity      : ${config.vignetteOpacity}`,
    "",
    "ACCENT BEAMS",
    `  showAccentBeams      : ${config.showAccentBeams}`,
    `  accentOpacity        : ${config.accentOpacity}`,
    `  accentStrokeWidth    : ${config.accentStrokeWidth}px`,
    "",
    "CANVAS",
    `  canvasWidth          : ${config.canvasWidth}`,
    `  canvasHeight         : ${config.canvasHeight}`,
    `  seed                 : ${config.seed}`,
    "",
    "─── RAW JSON ───",
    "",
    JSON.stringify(config, null, 2),
  ];

  const blob = new Blob([lines.join("\n")], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `speed-lines-config-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ─── Parse Config from TXT ─── */

const parseConfigFromText = (text: string): SpeedLinesConfig | null => {
  const jsonMarker = "─── RAW JSON ───";
  const markerIndex = text.indexOf(jsonMarker);
  if (markerIndex === -1) return null;

  const jsonStr = text.slice(markerIndex + jsonMarker.length).trim();
  try {
    const parsed = JSON.parse(jsonStr);
    const config: SpeedLinesConfig = { ...DEFAULT_CONFIG };

    const numberKeys: (keyof SpeedLinesConfig)[] = [
      "canvasWidth", "canvasHeight", "convergenceGap", "numBeams",
      "opacityMin", "opacityMax", "strokeWidthMin", "strokeWidthMax",
      "glowBlur", "animationSpeedMin", "animationSpeedMax", "animationChance",
      "dashLength", "dashGap", "particleExtraWidth", "accentOpacity",
      "accentStrokeWidth", "verticalSpread", "outerVerticalSpread",
      "edgeGlowOpacity", "vignetteOpacity", "seed",
    ];

    const booleanKeys: (keyof SpeedLinesConfig)[] = [
      "showAccentBeams", "showEdgeGlow", "showVignette",
    ];

    const stringKeys: (keyof SpeedLinesConfig)[] = [
      "accentColor", "backgroundColor",
    ];

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

    if (Array.isArray(parsed.beamColors) && parsed.beamColors.every((c: unknown) => typeof c === "string")) {
      config.beamColors = parsed.beamColors;
    }

    return config;
  } catch {
    return null;
  }
};

/* ─── Main Panel ─── */

const ControlPanel: React.FC<ControlPanelProps> = ({ config, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = useCallback(
    <K extends keyof SpeedLinesConfig>(key: K, value: SpeedLinesConfig[K]) => {
      onChange({ ...config, [key]: value });
    },
    [config, onChange]
  );

  const handleColorChange = useCallback(
    (index: number, value: string) => {
      const newColors = [...config.beamColors];
      newColors[index] = value;
      onChange({ ...config, beamColors: newColors });
    },
    [config, onChange]
  );

  const handleColorRemove = useCallback(
    (index: number) => {
      if (config.beamColors.length <= 1) return;
      onChange({ ...config, beamColors: config.beamColors.filter((_, i) => i !== index) });
    },
    [config, onChange]
  );

  const handleAddColor = useCallback(() => {
    onChange({ ...config, beamColors: [...config.beamColors, "#FFFFFF"] });
  }, [config, onChange]);

  const handleReset = useCallback(() => onChange({ ...DEFAULT_CONFIG }), [onChange]);
  const handleRandomize = useCallback(
    () => onChange({ ...config, seed: Math.floor(Math.random() * 999999) }),
    [config, onChange]
  );
  const handleToggleSidebar = useCallback(() => setIsOpen((p) => !p), []);

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
          alert("Could not parse config file. Make sure it was exported from Speed Lines.");
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
        className="fixed top-4 right-4 z-50 flex h-9 w-9 items-center justify-center rounded-full bg-white/5 backdrop-blur-xl border border-white/7 text-white/50 transition-all duration-200 hover:bg-white/10 hover:text-white/80 hover:scale-105 active:scale-95 cursor-pointer"
        aria-label={isOpen ? "Close control panel" : "Open control panel"}
        tabIndex={0}
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
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
        className={`panel-glass fixed top-0 right-0 z-40 flex h-full w-[340px] flex-col transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-label="Speed Lines Control Panel"
      >
        {/* Header */}
        <div className="border-b border-white/4 px-5 py-[15px]">
          <h2 className="text-[20px] font-semibold text-white/75 tracking-wide p-[15px]">Controls</h2>
          <p className="px-[15px] text-[11px] text-white/25">
            Made by{" "}
            <a
              href="https://x.com/palakjain2701"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline decoration-white/15 underline-offset-2 transition-colors hover:text-white/65"
              tabIndex={0}
              aria-label="Palak on X"
            >
              Palak
            </a>
            ,{" "}
            <a
              href="https://x.com/hckmstrrahul"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 underline decoration-white/15 underline-offset-2 transition-colors hover:text-white/65"
              tabIndex={0}
              aria-label="RCB on X"
            >
              RCB
            </a>
          </p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
          <Section title="Beams">
            <Slider label="Count" value={config.numBeams} min={1} max={80} step={1} onChange={(v) => handleUpdate("numBeams", v)} />
            <Slider label="Convergence gap" value={config.convergenceGap} min={0} max={0.4} step={0.01} onChange={(v) => handleUpdate("convergenceGap", v)} />
            <Slider label="Inner vertical spread" value={config.verticalSpread} min={0} max={0.3} step={0.01} onChange={(v) => handleUpdate("verticalSpread", v)} />
            <Slider label="Outer vertical spread" value={config.outerVerticalSpread} min={0.2} max={3} step={0.05} onChange={(v) => handleUpdate("outerVerticalSpread", v)} suffix="x" />
          </Section>

          <Section title="Colors">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-medium text-white/40">Beam palette</span>
                <button
                  type="button"
                  onClick={handleAddColor}
                  className="flex h-5 w-5 items-center justify-center rounded-md bg-white/6 text-[12px] leading-none text-white/40 transition-colors hover:bg-white/12 hover:text-white/70 cursor-pointer"
                  aria-label="Add color"
                  tabIndex={0}
                >
                  +
                </button>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {config.beamColors.map((color, i) => (
                  <ColorChip key={`${i}-${color}`} color={color} onChange={(v) => handleColorChange(i, v)} onRemove={() => handleColorRemove(i)} />
                ))}
              </div>
            </div>
            <ColorInput label="Accent" value={config.accentColor} onChange={(v) => handleUpdate("accentColor", v)} />
            <ColorInput label="Background" value={config.backgroundColor} onChange={(v) => handleUpdate("backgroundColor", v)} />
          </Section>

          <Section title="Stroke">
            <Slider label="Min opacity" value={config.opacityMin} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("opacityMin", v)} />
            <Slider label="Max opacity" value={config.opacityMax} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("opacityMax", v)} />
            <Slider label="Min width" value={config.strokeWidthMin} min={0.1} max={8} step={0.1} onChange={(v) => handleUpdate("strokeWidthMin", v)} suffix="px" />
            <Slider label="Max width" value={config.strokeWidthMax} min={0.1} max={8} step={0.1} onChange={(v) => handleUpdate("strokeWidthMax", v)} suffix="px" />
          </Section>

          <Section title="Animation" defaultOpen={false}>
            <Slider label="Chance" value={config.animationChance} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("animationChance", v)} />
            <Slider label="Min duration" value={config.animationSpeedMin} min={0.5} max={20} step={0.5} onChange={(v) => handleUpdate("animationSpeedMin", v)} suffix="s" />
            <Slider label="Max duration" value={config.animationSpeedMax} min={0.5} max={20} step={0.5} onChange={(v) => handleUpdate("animationSpeedMax", v)} suffix="s" />
            <Slider label="Dash length" value={config.dashLength} min={5} max={200} step={5} onChange={(v) => handleUpdate("dashLength", v)} suffix="px" />
            <Slider label="Dash gap" value={config.dashGap} min={100} max={3000} step={50} onChange={(v) => handleUpdate("dashGap", v)} suffix="px" />
            <Slider label="Particle extra width" value={config.particleExtraWidth} min={0} max={5} step={0.1} onChange={(v) => handleUpdate("particleExtraWidth", v)} suffix="px" />
          </Section>

          <Section title="Glow & Effects" defaultOpen={false}>
            <Slider label="Glow blur" value={config.glowBlur} min={0} max={20} step={0.5} onChange={(v) => handleUpdate("glowBlur", v)} suffix="px" />
            <Toggle label="Edge glow" value={config.showEdgeGlow} onChange={(v) => handleUpdate("showEdgeGlow", v)} />
            {config.showEdgeGlow && (
              <Slider label="Edge glow opacity" value={config.edgeGlowOpacity} min={0} max={0.5} step={0.01} onChange={(v) => handleUpdate("edgeGlowOpacity", v)} />
            )}
            <Toggle label="Center vignette" value={config.showVignette} onChange={(v) => handleUpdate("showVignette", v)} />
            {config.showVignette && (
              <Slider label="Vignette opacity" value={config.vignetteOpacity} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("vignetteOpacity", v)} />
            )}
          </Section>

          <Section title="Accent Beams" defaultOpen={false}>
            <Toggle label="Show accent beams" value={config.showAccentBeams} onChange={(v) => handleUpdate("showAccentBeams", v)} />
            {config.showAccentBeams && (
              <>
                <Slider label="Opacity" value={config.accentOpacity} min={0} max={1} step={0.01} onChange={(v) => handleUpdate("accentOpacity", v)} />
                <Slider label="Stroke width" value={config.accentStrokeWidth} min={0.5} max={8} step={0.1} onChange={(v) => handleUpdate("accentStrokeWidth", v)} suffix="px" />
              </>
            )}
          </Section>

          <Section title="Seed" defaultOpen={false}>
            <Slider label="Random seed" value={config.seed} min={1} max={999999} step={1} onChange={(v) => handleUpdate("seed", v)} />
          </Section>
        </div>

        {/* Footer actions */}
        <div className="border-t border-white/4 p-5 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={() => handleDownloadConfig(config)}
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-linear-to-r from-[#308698]/20 to-[#BDED8F]/10 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-white/65 ring-1 ring-inset ring-white/6 transition-all duration-200 hover:from-[#308698]/30 hover:to-[#BDED8F]/20 hover:text-white/85 active:scale-[0.98] cursor-pointer"
            aria-label="Download configuration"
            tabIndex={0}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
            className="flex w-full items-center justify-center gap-2.5 rounded-full bg-white/4 px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/6 transition-all duration-200 hover:bg-white/8 hover:text-white/65 active:scale-[0.98] cursor-pointer"
            aria-label="Upload configuration file"
            tabIndex={0}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 8l-4-4m0 0L8 8m4-4v13" />
            </svg>
            Upload Config (.TXT)
          </button>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={handleRandomize}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/4 transition-all duration-200 hover:bg-white/8 hover:text-white/65 active:scale-[0.98] cursor-pointer"
              aria-label="Randomize seed"
              tabIndex={0}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" />
              </svg>
              Randomize
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/4 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/40 ring-1 ring-inset ring-white/4 transition-all duration-200 hover:bg-red-500/15 hover:text-red-400 active:scale-[0.98] cursor-pointer"
              aria-label="Reset to defaults"
              tabIndex={0}
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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

export default ControlPanel;
