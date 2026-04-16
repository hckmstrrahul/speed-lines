"use client";

import { useState, useCallback } from "react";
import SpeedLinesBackground, {
  type SpeedLinesConfig,
  DEFAULT_CONFIG,
} from "@/components/SpeedLinesBackground";
import ControlPanel from "@/components/ControlPanel";
import HeroSection from "@/components/HeroSection";
import PixelWaveBackground, {
  type PixelWaveConfig,
  DEFAULT_WAVE_CONFIG,
} from "@/components/PixelWaveBackground";
import WaveControlPanel from "@/components/WaveControlPanel";
import PaintingWheelBackground, {
  type PaintingWheelConfig,
  DEFAULT_PAINTING_WHEEL_CONFIG,
} from "@/components/PaintingWheelBackground";
import PaintingWheelControlPanel from "@/components/PaintingWheelControlPanel";
import InfiniteGridBackground, {
  type InfiniteGridConfig,
  DEFAULT_INFINITE_GRID_CONFIG,
} from "@/components/InfiniteGridBackground";
import InfiniteGridControlPanel from "@/components/InfiniteGridControlPanel";
import MusicLinesBackground, {
  type MusicLinesConfig,
  DEFAULT_MUSIC_LINES_CONFIG,
} from "@/components/MusicLinesBackground";
import MusicLinesControlPanel from "@/components/MusicLinesControlPanel";

type ActiveTab = 1 | 2 | 3 | 4 | 5;

const Home = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(1);
  const [config, setConfig] = useState<SpeedLinesConfig>(DEFAULT_CONFIG);
  const [waveConfig, setWaveConfig] = useState<PixelWaveConfig>(DEFAULT_WAVE_CONFIG);
  const [paintingWheelConfig, setPaintingWheelConfig] = useState<PaintingWheelConfig>(
    DEFAULT_PAINTING_WHEEL_CONFIG
  );
  const [infiniteGridConfig, setInfiniteGridConfig] = useState<InfiniteGridConfig>(
    DEFAULT_INFINITE_GRID_CONFIG
  );
  const [musicLinesConfig, setMusicLinesConfig] = useState<MusicLinesConfig>(
    DEFAULT_MUSIC_LINES_CONFIG
  );

  const handleConfigChange = useCallback((newConfig: SpeedLinesConfig) => {
    setConfig(newConfig);
  }, []);

  const handleWaveConfigChange = useCallback((newConfig: PixelWaveConfig) => {
    setWaveConfig(newConfig);
  }, []);

  const handlePaintingWheelConfigChange = useCallback((newConfig: PaintingWheelConfig) => {
    setPaintingWheelConfig(newConfig);
  }, []);

  const handleInfiniteGridConfigChange = useCallback((newConfig: InfiniteGridConfig) => {
    setInfiniteGridConfig(newConfig);
  }, []);

  const handleMusicLinesConfigChange = useCallback((newConfig: MusicLinesConfig) => {
    setMusicLinesConfig(newConfig);
  }, []);

  const handleTabSwitch = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{
        backgroundColor:
          activeTab === 1
            ? config.backgroundColor
            : activeTab === 2
              ? "#030303"
              : activeTab === 3
                ? "#050505"
                : activeTab === 4
                  ? infiniteGridConfig.vignetteColor
                  : musicLinesConfig.backgroundColor,
      }}
    >
      {/* Tab Switcher — circular pill at top center */}
      <div className="fixed top-[16px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-[2px] rounded-[9999px] bg-white/5 backdrop-blur-xl border border-white/7 p-[3px]">
        <button
          type="button"
          onClick={() => handleTabSwitch(1)}
          className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9999px] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 1
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/35 hover:text-white/60"
          }`}
          aria-label="Speed Lines effect"
          aria-pressed={activeTab === 1}
          tabIndex={0}
        >
          1
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch(2)}
          className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9999px] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 2
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/35 hover:text-white/60"
          }`}
          aria-label="Pixel Wave effect"
          aria-pressed={activeTab === 2}
          tabIndex={0}
        >
          2
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch(3)}
          className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9999px] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 3
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/35 hover:text-white/60"
          }`}
          aria-label="Painting Wheel effect"
          aria-pressed={activeTab === 3}
          tabIndex={0}
        >
          3
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch(4)}
          className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9999px] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 4
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/35 hover:text-white/60"
          }`}
          aria-label="Infinite Grid effect"
          aria-pressed={activeTab === 4}
          tabIndex={0}
        >
          4
        </button>
        <button
          type="button"
          onClick={() => handleTabSwitch(5)}
          className={`relative flex h-[30px] w-[30px] items-center justify-center rounded-[9999px] text-[12px] font-semibold transition-all duration-200 cursor-pointer ${
            activeTab === 5
              ? "bg-white/12 text-white shadow-sm"
              : "text-white/35 hover:text-white/60"
          }`}
          aria-label="Music Lines effect"
          aria-pressed={activeTab === 5}
          tabIndex={0}
        >
          5
        </button>
      </div>

      {/* Tab 1: Speed Lines */}
      {activeTab === 1 && (
        <>
          <div className="absolute inset-0">
            <SpeedLinesBackground config={config} />
          </div>
          <HeroSection config={config} />
          <ControlPanel config={config} onChange={handleConfigChange} />
        </>
      )}

      {/* Tab 2: Pixel Wave Grid */}
      {activeTab === 2 && (
        <>
          <div className="absolute inset-0">
            <PixelWaveBackground config={waveConfig} onConfigChange={handleWaveConfigChange} />
          </div>
          <WaveControlPanel config={waveConfig} onChange={handleWaveConfigChange} />
        </>
      )}

      {/* Tab 3: Painting Wheel */}
      {activeTab === 3 && (
        <>
          <div className="absolute inset-0">
            <PaintingWheelBackground
              config={paintingWheelConfig}
              onConfigChange={handlePaintingWheelConfigChange}
            />
          </div>
          <PaintingWheelControlPanel
            config={paintingWheelConfig}
            onChange={handlePaintingWheelConfigChange}
          />
        </>
      )}

      {/* Tab 4: Infinite Grid */}
      {activeTab === 4 && (
        <>
          <div className="absolute inset-0">
            <InfiniteGridBackground config={infiniteGridConfig} />
          </div>
          <InfiniteGridControlPanel config={infiniteGridConfig} onChange={handleInfiniteGridConfigChange} />
        </>
      )}

      {/* Tab 5: Music Lines */}
      {activeTab === 5 && (
        <>
          <div className="absolute inset-0">
            <MusicLinesBackground config={musicLinesConfig} />
          </div>
          <HeroSection config={musicLinesConfig} gridIdPrefix="ml-" />
          <MusicLinesControlPanel config={musicLinesConfig} onChange={handleMusicLinesConfigChange} />
        </>
      )}
    </main>
  );
};

export default Home;
