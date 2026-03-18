"use client";

import { useRef, useState, useEffect } from "react";
import { systems } from "@/data/systemsGraph";
import { type BgStar, generateBgStars } from "@/lib/galaxyStars";
import { generateNebulaTexture } from "@/lib/galaxyNebula";
import { type Nebula, generateNebulae } from "@/lib/galaxyRenderers";
import { ASPECT_RATIO } from "@/lib/galaxyTouch";

const DEFAULT_STAR_COUNT = 1200;
const DEFAULT_CENTER_BIAS = 0.25;

export function useGalaxySetup(opts?: { starCount?: number; centerBias?: number }) {
  const starCount = opts?.starCount ?? DEFAULT_STAR_COUNT;
  const centerBias = opts?.centerBias ?? DEFAULT_CENTER_BIAS;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const bgStarsRef = useRef<BgStar[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const nebulaCanvasRef = useRef<OffscreenCanvas | null>(null);
  const timeRef = useRef(0);

  const [dimensions, setDimensions] = useState({ width: 900, height: 563 });
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hoveredType, setHoveredType] = useState<"system" | "domain" | "tech" | null>(null);
  const hoveredIdRef = useRef<string | null>(null);
  const hoveredTypeRef = useRef<"system" | "domain" | "tech" | null>(null);
  const satelliteAnimRef = useRef(0);
  const lastHoveredClusterRef = useRef<string | null>(null);
  const prevTimestampRef = useRef(0);
  const sfRef = useRef(Math.min(1, dimensions.width / 900));

  useEffect(() => { hoveredIdRef.current = hoveredId; }, [hoveredId]);
  useEffect(() => { hoveredTypeRef.current = hoveredType; }, [hoveredType]);
  useEffect(() => { sfRef.current = Math.min(1, dimensions.width / 900); }, [dimensions]);

  // Lookup maps
  const domainToSystems = useRef(new Map<string, string[]>());
  const techToSystems = useRef(new Map<string, string[]>());
  useEffect(() => {
    const domMap = new Map<string, string[]>();
    const techMap = new Map<string, string[]>();
    for (const sys of systems) {
      for (const domId of sys.domains) {
        if (!domMap.has(domId)) { domMap.set(domId, []); }
        domMap.get(domId)!.push(sys.id);
      }
      for (const tcId of sys.techClusters) {
        if (!techMap.has(tcId)) { techMap.set(tcId, []); }
        techMap.get(tcId)!.push(sys.id);
      }
    }
    domainToSystems.current = domMap;
    techToSystems.current = techMap;
  }, []);

  // Measure + generate
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const w = Math.round(el.getBoundingClientRect().width);
      if (w <= 0) return;
      const h = Math.round(w / ASPECT_RATIO);
      setDimensions({ width: w, height: h });
      bgStarsRef.current = generateBgStars(w, h, starCount, centerBias);
      nebulaeRef.current = generateNebulae(w, h);

      const nebulaTexture = generateNebulaTexture(w, h);
      const offscreen = new OffscreenCanvas(w, h);
      const offCtx = offscreen.getContext("2d");
      if (offCtx) {
        const imgData = new ImageData(new Uint8ClampedArray(nebulaTexture.data), w, h);
        offCtx.putImageData(imgData, 0, 0);
      }
      nebulaCanvasRef.current = offscreen;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return {
    canvasRef, containerRef, animFrameRef,
    bgStarsRef, nebulaeRef, nebulaCanvasRef,
    timeRef, dimensions,
    hoveredId, setHoveredId, hoveredIdRef,
    hoveredType, setHoveredType, hoveredTypeRef,
    satelliteAnimRef, lastHoveredClusterRef, prevTimestampRef,
    sfRef, domainToSystems, techToSystems,
  };
}
