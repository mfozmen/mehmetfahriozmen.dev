"use client";

import { useRef, useEffect } from "react";
import { useGalaxySetup } from "./useGalaxySetup";
import { renderGalaxyFrame } from "@/lib/galaxyRenderLoop";
import { hitTest } from "@/lib/galaxyInteraction";
import { updateSatelliteAnim } from "@/lib/galaxyRenderers";

export default function DesktopGalaxy() {
  const {
    canvasRef, containerRef, animFrameRef,
    bgStarsRef, nebulaeRef, nebulaCanvasRef,
    timeRef, dimensions,
    hoveredId, setHoveredId, hoveredIdRef,
    hoveredType, setHoveredType, hoveredTypeRef,
    satelliteAnimRef, lastHoveredClusterRef, prevTimestampRef,
    sfRef, domainToSystems, techToSystems,
  } = useGalaxySetup();
  const mouseOffsetRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const animate = (timestamp: number) => {
      const ctx = canvas.getContext("2d");
      if (!ctx) { animFrameRef.current = requestAnimationFrame(animate); return; }

      const time = timestamp / 1000;
      timeRef.current = time;
      const dt = prevTimestampRef.current > 0 ? (timestamp - prevTimestampRef.current) / 1000 : 0;
      prevTimestampRef.current = timestamp;

      const satUpdate = updateSatelliteAnim(
        hoveredTypeRef.current, hoveredIdRef.current,
        lastHoveredClusterRef.current, satelliteAnimRef.current, dt,
      );
      satelliteAnimRef.current = satUpdate.anim;
      lastHoveredClusterRef.current = satUpdate.lastCluster;

      const dpr = window.devicePixelRatio || 1;
      const { width: w, height: h } = dimensions;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      renderGalaxyFrame(ctx, {
        w, h, time, timestamp,
        stars: bgStarsRef.current,
        nebulae: nebulaeRef.current,
        nebulaCanvas: nebulaCanvasRef.current,
        px: mouseOffsetRef.current.x,
        py: mouseOffsetRef.current.y,
        sf: sfRef.current,
        zoom: 1, pan: { x: 0, y: 0 },
        hoveredId: hoveredIdRef.current,
        hoveredType: hoveredTypeRef.current,
        domainToSystems: domainToSystems.current,
        techToSystems: techToSystems.current,
        satelliteAnim: satelliteAnimRef.current,
        lastHoveredCluster: lastHoveredClusterRef.current,
        showLabels: { domains: true, techClusters: true },
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [dimensions]);

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const nx = (mx / rect.width - 0.5) * 2;
    const ny = (my / rect.height - 0.5) * 2;
    mouseOffsetRef.current = { x: nx * 3, y: ny * 3 };

    const { width: w, height: h } = dimensions;
    const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf: sfRef.current });

    if (hit) { setHoveredId(hit.id); setHoveredType(hit.type); }
    else { setHoveredId(null); setHoveredType(null); }
  }

  function handleMouseLeave() {
    setHoveredId(null);
    setHoveredType(null);
    mouseOffsetRef.current = { x: 0, y: 0 };
  }

  function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const { width: w, height: h } = dimensions;
    const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf: sfRef.current });
    if (hit?.type === "system" && hit.item.url) {
      window.open(hit.item.url, "_blank");
    }
  }

  const cursorStyle = hoveredId && hoveredType === "system" ? "pointer" : "default";

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl"
      style={{ height: dimensions.height }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ cursor: cursorStyle }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />
    </div>
  );
}
