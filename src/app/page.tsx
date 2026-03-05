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

type ActiveTab = 1 | 2;

const Home = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(1);
  const [config, setConfig] = useState<SpeedLinesConfig>(DEFAULT_CONFIG);
  const [waveConfig, setWaveConfig] = useState<PixelWaveConfig>(DEFAULT_WAVE_CONFIG);

  const handleConfigChange = useCallback((newConfig: SpeedLinesConfig) => {
    setConfig(newConfig);
  }, []);

  const handleWaveConfigChange = useCallback((newConfig: PixelWaveConfig) => {
    setWaveConfig(newConfig);
  }, []);

  const handleTabSwitch = useCallback((tab: ActiveTab) => {
    setActiveTab(tab);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: activeTab === 1 ? config.backgroundColor : "#030303" }}
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
    </main>
  );
};

export default Home;
