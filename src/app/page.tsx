"use client";

import { useState, useCallback } from "react";
import SpeedLinesBackground, {
  type SpeedLinesConfig,
  DEFAULT_CONFIG,
} from "@/components/SpeedLinesBackground";
import ControlPanel from "@/components/ControlPanel";

const Home = () => {
  const [config, setConfig] = useState<SpeedLinesConfig>(DEFAULT_CONFIG);

  const handleConfigChange = useCallback((newConfig: SpeedLinesConfig) => {
    setConfig(newConfig);
  }, []);

  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ backgroundColor: config.backgroundColor }}
    >
      <div className="absolute inset-0">
        <SpeedLinesBackground config={config} />
      </div>

      <ControlPanel config={config} onChange={handleConfigChange} />
    </main>
  );
};

export default Home;
