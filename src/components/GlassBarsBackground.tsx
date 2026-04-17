"use client";

import React, { useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

export type GlassBarsConfig = {
  colorA: string;
  colorB: string;
  bgColor: string;
  showSurfaceGrid: boolean;
  gridColor: string;
  gridSize: number;
  gridDivisions: number;
  gridOpacity: number;
  glowStrength: number;
  glowBlur: number;
  glowThreshold: number;
  coreBrightness: number;
  transmission: number;
  glassOpacity: number;
  backdropBlur: number;
  thickness: number;
  ior: number;
  metalness: number;
  dataSeed: number;
  barWidth: number;
  barDepth: number;
  barRadius: number;
  barSpacing: number;
  groupSpacing: number;
  hatchSpacing: number;
  hatchThickness: number;
  animationTrigger: number;
  showOverlay: boolean;
  overlayHeading: string;
  overlaySubtext: string;
  overlayButtonText: string;
  overlayButtonUrl: string;
  overlayY: number;
  showGrid: boolean;
  gridSizeOverlay: number;
  gridOpacityOverlay: number;
  gridColorOverlay: string;
  showCenterGlow: boolean;
  centerGlowRadius: number;
  centerGlowOpacity: number;
  centerGlowColor: string;
  centerGlowColorOuter: string;
  centerGlowY: number;
};

export const DEFAULT_GLASS_BARS_CONFIG: GlassBarsConfig = {
  colorA: "#ff5c60",
  colorB: "#a4df7a",
  bgColor: "#14161a",
  showSurfaceGrid: true,
  gridColor: "#2a2e35",
  gridSize: 60,
  gridDivisions: 30,
  gridOpacity: 0.4,
  glowStrength: 0.1,
  glowBlur: 0.37,
  glowThreshold: 0.42,
  coreBrightness: 0.1,
  transmission: 0.65,
  glassOpacity: 1.0,
  backdropBlur: 0.73,
  thickness: 1.0,
  ior: 1.75,
  metalness: 0.09,
  dataSeed: 0,
  barWidth: 1.2,
  barDepth: 1.2,
  barRadius: 1.0,
  barSpacing: 0.5,
  groupSpacing: 2.5,
  hatchSpacing: 0.4,
  hatchThickness: 0.08,
  animationTrigger: 0,
  showOverlay: true,
  overlayHeading: "Glass Bars",
  overlaySubtext: "3D frosted glass bar visualization with bloom and physics",
  overlayButtonText: "Launch Viewer",
  overlayButtonUrl: "#",
  overlayY: -100,
  showGrid: false,
  gridSizeOverlay: 60,
  gridOpacityOverlay: 0.1,
  gridColorOverlay: "#46a09a",
  showCenterGlow: false,
  centerGlowRadius: 590,
  centerGlowOpacity: 0.2,
  centerGlowColor: "#9EFFB6",
  centerGlowColorOuter: "#244347",
  centerGlowY: 640,
};

type BarGroupData = {
  valA: number;
  valB: number;
  changeA: number;
  changeB: number;
  typeA: string;
  typeB: string;
};

const ORIGINAL_DATA: BarGroupData[] = [
  { valA: 1, valB: 20, changeA: 0, changeB: 3, typeA: "none", typeB: "outline" },
  { valA: 6, valB: 9, changeA: 2, changeB: 2, typeA: "hatched", typeB: "outline" },
  { valA: 13, valB: 10, changeA: 5, changeB: 8, typeA: "hatched", typeB: "outline" },
  { valA: 6, valB: 4, changeA: 8, changeB: 5, typeA: "hatched", typeB: "outline" },
  { valA: 9, valB: 3, changeA: 9, changeB: 2, typeA: "outline", typeB: "hatched" },
  { valA: 4, valB: 1.5, changeA: 3, changeB: 0, typeA: "hatched", typeB: "none" },
  { valA: 8, valB: 1.5, changeA: 1, changeB: 0.5, typeA: "outline", typeB: "solid" },
  { valA: 4, valB: 0.5, changeA: 1.5, changeB: 0.2, typeA: "hatched", typeB: "solid" },
];

const generateData = (seed: number): BarGroupData[] => {
  if (seed === 0) return JSON.parse(JSON.stringify(ORIGINAL_DATA));
  let s = seed;
  const random = () => {
    const x = Math.sin(s++) * 10000;
    return x - Math.floor(x);
  };
  return ORIGINAL_DATA.map((d) => ({
    valA: 2 + random() * 15,
    valB: 2 + random() * 15,
    changeA: random() > 0.2 ? random() * 8 : 0,
    changeB: random() > 0.2 ? random() * 8 : 0,
    typeA: d.typeA,
    typeB: d.typeB,
  }));
};

const getBarGeometry = (width: number, depth: number, height: number, radius: number): THREE.ExtrudeGeometry => {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -depth / 2;
  const r = Math.min(radius, Math.min(width / 2, depth / 2));

  if (r === 0) {
    shape.moveTo(x, y);
    shape.lineTo(x + width, y);
    shape.lineTo(x + width, y + depth);
    shape.lineTo(x, y + depth);
    shape.lineTo(x, y);
  } else {
    shape.moveTo(x, y + r);
    shape.lineTo(x, y + depth - r);
    shape.quadraticCurveTo(x, y + depth, x + r, y + depth);
    shape.lineTo(x + width - r, y + depth);
    shape.quadraticCurveTo(x + width, y + depth, x + width, y + depth - r);
    shape.lineTo(x + width, y + r);
    shape.quadraticCurveTo(x + width, y, x + width - r, y);
    shape.lineTo(x + r, y);
    shape.quadraticCurveTo(x, y, x, y + r);
  }

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height,
    bevelEnabled: false,
    curveSegments: 32,
  });
  geo.computeVertexNormals();
  return geo;
};

type HatchContainer = THREE.Group & {
  userData: { targetRotation: { x: number; z: number } };
};

type SceneState = {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  composer: EffectComposer;
  bloomPass: UnrealBloomPass;
  chartGroup: THREE.Group;
  backgroundGrid: THREE.Group;
  hatchContainers: HatchContainer[];
  matGlassA: THREE.MeshPhysicalMaterial;
  matGlassB: THREE.MeshPhysicalMaterial;
  matSolidA: THREE.MeshStandardMaterial;
  matSolidB: THREE.MeshStandardMaterial;
  matLineA: THREE.LineBasicMaterial;
  matLineB: THREE.LineBasicMaterial;
  matOutlineFillA: THREE.MeshPhysicalMaterial;
  matOutlineFillB: THREE.MeshPhysicalMaterial;
  raycaster: THREE.Raycaster;
  mouse: THREE.Vector2;
  mouseDirty: boolean;
  animState: { active: boolean; startTime: number };
  bgColor: THREE.Color;
  disposables: THREE.BufferGeometry[];
};

type GlassBarsBackgroundProps = {
  config: GlassBarsConfig;
};

const GlassBarsBackground: React.FC<GlassBarsBackgroundProps> = ({ config }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const configRef = useRef(config);
  configRef.current = config;
  const sceneRef = useRef<SceneState | null>(null);
  const animTriggerRef = useRef<(() => void) | null>(null);

  const disposeScene = useCallback((s: SceneState) => {
    s.disposables.forEach((g) => g.dispose());
    s.matGlassA.dispose();
    s.matGlassB.dispose();
    s.matSolidA.dispose();
    s.matSolidB.dispose();
    s.matLineA.dispose();
    s.matLineB.dispose();
    s.matOutlineFillA.dispose();
    s.matOutlineFillB.dispose();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cfg = configRef.current;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color(cfg.bgColor);
    scene.background = bgColor;
    scene.fog = new THREE.FogExp2(cfg.bgColor, 0.015);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 35);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 5, 0);
    controls.update();

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(20, 30, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
    backLight.position.set(-20, 20, -20);
    scene.add(backLight);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      cfg.glowStrength,
      cfg.glowBlur,
      cfg.glowThreshold
    );
    composer.addPass(bloomPass);

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-1000, -1000);

    const chartGroup = new THREE.Group();
    scene.add(chartGroup);
    const backgroundGrid = new THREE.Group();
    scene.add(backgroundGrid);

    const s: SceneState = {
      renderer,
      scene,
      camera,
      controls,
      composer,
      bloomPass,
      chartGroup,
      backgroundGrid,
      hatchContainers: [],
      matGlassA: null!,
      matGlassB: null!,
      matSolidA: null!,
      matSolidB: null!,
      matLineA: null!,
      matLineB: null!,
      matOutlineFillA: null!,
      matOutlineFillB: null!,
      raycaster,
      mouse,
      mouseDirty: false,
      animState: { active: false, startTime: 0 },
      bgColor,
      disposables: [],
    };
    sceneRef.current = s;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      s.mouseDirty = true;
    };
    const handleMouseLeave = () => {
      mouse.set(-1000, -1000);
      s.mouseDirty = true;
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    const handleResize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    const triggerAnimation = () => {
      s.animState.active = true;
      s.animState.startTime = performance.now();
      s.chartGroup.children.forEach((bar) => {
        bar.scale.y = 0.001;
      });
    };
    animTriggerRef.current = triggerAnimation;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const stiffness = 0.06;
    const damping = 0.5;
    const animDuration = 1000;

    let lastHoveredSlice: THREE.Object3D | null = null;

    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);

      const currentCfg = configRef.current;

      controls.update();

      bloomPass.strength = currentCfg.glowStrength;
      bloomPass.radius = currentCfg.glowBlur;
      bloomPass.threshold = currentCfg.glowThreshold;

      s.bgColor.set(currentCfg.bgColor);
      if (scene.fog instanceof THREE.FogExp2) {
        scene.fog.color.copy(s.bgColor);
      }

      if (s.animState.active) {
        const now = performance.now();
        let allDone = true;

        s.chartGroup.children.forEach((bar) => {
          const elapsed = now - (s.animState.startTime + (bar.userData.delay || 0));
          if (elapsed < 0) {
            bar.scale.y = 0.001;
            allDone = false;
          } else if (elapsed < animDuration) {
            bar.scale.y = easeOutCubic(elapsed / animDuration);
            allDone = false;
          } else {
            bar.scale.y = 1.0;
          }
        });

        if (allDone) s.animState.active = false;
      }

      if (s.mouseDirty || lastHoveredSlice) {
        s.raycaster.setFromCamera(s.mouse, s.camera);
        const intersects = s.raycaster.intersectObjects(s.chartGroup.children, true);

        const hoveredSet = new Set<THREE.Object3D>();
        for (let i = 0; i < intersects.length; i++) {
          if (intersects[i].object.userData.isHatchPart) {
            hoveredSet.add(intersects[i].object);
          }
        }
        lastHoveredSlice = hoveredSet.size > 0 ? hoveredSet.values().next().value! : null;
        s.mouseDirty = false;

        s.hatchContainers.forEach((hc) => {
          hc.rotation.x = 0;
          hc.rotation.z = 0;

          hc.children.forEach((child) => {
            const slice = child as THREE.Mesh;
            const ud = slice.userData;
            let targetRotX = ud.baseRotX;
            let targetRotZ = ud.baseRotZ;

            if (hoveredSet.has(slice)) {
              targetRotX += -s.mouse.y * 1.25;
              targetRotZ += -s.mouse.x * 1.25;
            }

            const forceX = (targetRotX - slice.rotation.x) * stiffness;
            ud.velRotX = (ud.velRotX + forceX) * damping;
            slice.rotation.x += ud.velRotX;

            const forceZ = (targetRotZ - slice.rotation.z) * stiffness;
            ud.velRotZ = (ud.velRotZ + forceZ) * damping;
            slice.rotation.z += ud.velRotZ;
          });
        });
      }

      s.composer.render();
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("resize", handleResize);
      controls.dispose();
      renderer.dispose();
      const current = sceneRef.current;
      if (current) disposeScene(current);
      sceneRef.current = null;
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [disposeScene]);

  const rebuildChart = useCallback(() => {
    const s = sceneRef.current;
    if (!s) return;

    const cfg = configRef.current;

    if (s.matGlassA) disposeScene(s);
    s.disposables = [];
    s.hatchContainers = [];

    while (s.chartGroup.children.length > 0) s.chartGroup.remove(s.chartGroup.children[0]);
    while (s.backgroundGrid.children.length > 0) s.backgroundGrid.remove(s.backgroundGrid.children[0]);

    const glassConfig = {
      transmission: cfg.transmission,
      opacity: cfg.glassOpacity,
      transparent: true,
      roughness: cfg.backdropBlur,
      thickness: cfg.thickness,
      ior: cfg.ior,
      metalness: cfg.metalness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
    };

    s.matGlassA = new THREE.MeshPhysicalMaterial({
      color: cfg.colorA, emissive: cfg.colorA, emissiveIntensity: cfg.coreBrightness, ...glassConfig,
    });
    s.matGlassB = new THREE.MeshPhysicalMaterial({
      color: cfg.colorB, emissive: cfg.colorB, emissiveIntensity: cfg.coreBrightness, ...glassConfig,
    });
    s.matSolidA = new THREE.MeshStandardMaterial({
      color: cfg.colorA, emissive: cfg.colorA, emissiveIntensity: cfg.coreBrightness * 2, roughness: 0.4, metalness: 0.1,
    });
    s.matSolidB = new THREE.MeshStandardMaterial({
      color: cfg.colorB, emissive: cfg.colorB, emissiveIntensity: cfg.coreBrightness * 2, roughness: 0.4, metalness: 0.1,
    });
    s.matLineA = new THREE.LineBasicMaterial({ color: cfg.colorA });
    s.matLineB = new THREE.LineBasicMaterial({ color: cfg.colorB });
    s.matOutlineFillA = new THREE.MeshPhysicalMaterial({
      ...glassConfig, color: cfg.colorA, emissive: cfg.colorA, emissiveIntensity: cfg.coreBrightness, opacity: 0.1, transmission: 0,
    });
    s.matOutlineFillB = new THREE.MeshPhysicalMaterial({
      ...glassConfig, color: cfg.colorB, emissive: cfg.colorB, emissiveIntensity: cfg.coreBrightness, opacity: 0.1, transmission: 0,
    });

    const data = generateData(cfg.dataSeed);
    const numGroups = data.length;
    const groupWidth = cfg.barWidth * 2 + cfg.barSpacing;
    const totalWidth = numGroups * groupWidth + (numGroups - 1) * cfg.groupSpacing;
    const startX = -totalWidth / 2 + groupWidth / 2;

    if (cfg.showSurfaceGrid) {
      const size = Math.max(totalWidth + 10, cfg.gridSize);
      const floorGrid = new THREE.GridHelper(size, cfg.gridDivisions, cfg.gridColor, cfg.gridColor);
      (floorGrid.material as THREE.Material).opacity = cfg.gridOpacity;
      (floorGrid.material as THREE.Material).transparent = true;
      s.backgroundGrid.add(floorGrid);
    }

    const createBar = (
      bx: number,
      bz: number,
      baseHeight: number,
      changeAmount: number,
      type: string,
      glassMat: THREE.MeshPhysicalMaterial,
      solidMat: THREE.MeshStandardMaterial,
      lineMat: THREE.LineBasicMaterial,
      outlineFillMat: THREE.MeshPhysicalMaterial
    ): THREE.Group => {
      const group = new THREE.Group();

      if (baseHeight > 0) {
        const baseGeo = getBarGeometry(cfg.barWidth, cfg.barDepth, baseHeight, cfg.barRadius);
        s.disposables.push(baseGeo);
        const baseMesh = new THREE.Mesh(baseGeo, glassMat);
        baseMesh.rotation.x = -Math.PI / 2;
        baseMesh.position.set(bx, 0, bz);
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        group.add(baseMesh);
      }

      const startY = baseHeight;

      if (type === "hatched" && changeAmount > 0) {
        const hatchContainer = new THREE.Group() as HatchContainer;
        hatchContainer.position.set(bx, startY, bz);
        hatchContainer.userData.targetRotation = { x: 0, z: 0 };
        s.hatchContainers.push(hatchContainer);
        group.add(hatchContainer);

        const numHatch = Math.max(1, Math.floor(changeAmount / cfg.hatchSpacing));
        const actualSpacing = changeAmount / numHatch;

        for (let i = 0; i < numHatch; i++) {
          const hGeo = getBarGeometry(cfg.barWidth, cfg.barDepth, cfg.hatchThickness, cfg.barRadius);
          s.disposables.push(hGeo);
          const hMesh = new THREE.Mesh(hGeo, solidMat);
          hMesh.rotation.x = -Math.PI / 2;
          hMesh.position.set(0, i * actualSpacing, 0);
          hMesh.castShadow = true;
          hMesh.userData = {
            isHatchPart: true,
            parentContainer: hatchContainer,
            index: i,
            baseRotX: -Math.PI / 2,
            baseRotZ: 0,
            velRotX: 0,
            velRotZ: 0,
          };
          hatchContainer.add(hMesh);
        }
      } else if (type === "outline" && changeAmount > 0) {
        const outGeo = getBarGeometry(cfg.barWidth, cfg.barDepth, changeAmount, cfg.barRadius);
        s.disposables.push(outGeo);
        const edges = new THREE.EdgesGeometry(outGeo, 15);
        s.disposables.push(edges);
        const lineMesh = new THREE.LineSegments(edges, lineMat);
        lineMesh.rotation.x = -Math.PI / 2;
        lineMesh.position.set(bx, startY, bz);
        group.add(lineMesh);

        const fillMesh = new THREE.Mesh(outGeo, outlineFillMat);
        fillMesh.rotation.x = -Math.PI / 2;
        fillMesh.position.set(bx, startY, bz);
        group.add(fillMesh);
      } else if (type === "solid" && changeAmount > 0) {
        const solidGeo = getBarGeometry(cfg.barWidth, cfg.barDepth, changeAmount, cfg.barRadius);
        s.disposables.push(solidGeo);
        const solidMesh = new THREE.Mesh(solidGeo, solidMat);
        solidMesh.rotation.x = -Math.PI / 2;
        solidMesh.position.set(bx, startY, bz);
        solidMesh.castShadow = true;
        group.add(solidMesh);
      }

      return group;
    };

    data.forEach((d, index) => {
      const groupX = startX + index * (groupWidth + cfg.groupSpacing);
      const barAx = groupX - cfg.barWidth / 2 - cfg.barSpacing / 2;
      const barBx = groupX + cfg.barWidth / 2 + cfg.barSpacing / 2;

      const meshA = createBar(barAx, 0, d.valA, d.changeA, d.typeA, s.matGlassA, s.matSolidA, s.matLineA, s.matOutlineFillA);
      meshA.userData.delay = index * 80;
      s.chartGroup.add(meshA);

      const meshB = createBar(barBx, 0, d.valB, d.changeB, d.typeB, s.matGlassB, s.matSolidB, s.matLineB, s.matOutlineFillB);
      meshB.userData.delay = index * 80 + 40;
      s.chartGroup.add(meshB);
    });
  }, [disposeScene]);

  useEffect(() => {
    if (sceneRef.current) rebuildChart();
  }, [
    config.dataSeed,
    config.barWidth,
    config.barDepth,
    config.barRadius,
    config.barSpacing,
    config.groupSpacing,
    config.hatchSpacing,
    config.hatchThickness,
    config.colorA,
    config.colorB,
    config.showSurfaceGrid,
    config.gridColor,
    config.gridSize,
    config.gridDivisions,
    config.gridOpacity,
    config.transmission,
    config.glassOpacity,
    config.backdropBlur,
    config.thickness,
    config.ior,
    config.metalness,
    config.coreBrightness,
    rebuildChart,
  ]);

  useEffect(() => {
    if (config.animationTrigger > 0 && animTriggerRef.current) {
      animTriggerRef.current();
    }
  }, [config.animationTrigger]);

  return (
    <div className="relative h-full w-full" style={{ minHeight: "100%" }} aria-hidden="true">
      <div ref={containerRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

export default GlassBarsBackground;
