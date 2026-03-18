"use client";

import { useRef, useEffect } from "react";
import { useGalaxySetup } from "./useGalaxySetup";
import { renderGalaxyFrame } from "@/lib/galaxyRenderLoop";
import { hitTest } from "@/lib/galaxyInteraction";
import { updateSatelliteAnim } from "@/lib/galaxyRenderers";
import { clampZoom, clampPan, computePinchZoom } from "@/lib/galaxyTouch";
import { techClusterMobilePositions } from "@/data/systemsGraph";

export default function MobileGalaxy() {
  const {
    canvasRef, containerRef, animFrameRef,
    bgStarsRef, nebulaeRef, nebulaCanvasRef,
    timeRef, dimensions,
    setHoveredId, hoveredIdRef,
    setHoveredType, hoveredTypeRef,
    satelliteAnimRef, lastHoveredClusterRef, prevTimestampRef,
    sfRef, domainToSystems, techToSystems,
  } = useGalaxySetup();
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const touchStateRef = useRef<{
    type: "none" | "pan" | "pinch";
    startX: number; startY: number;
    startPanX: number; startPanY: number;
    initialDistance: number; initialZoom: number;
  }>({ type: "none", startX: 0, startY: 0, startPanX: 0, startPanY: 0, initialDistance: 0, initialZoom: 1 });

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
        px: 0, py: 0,
        sf: sfRef.current,
        zoom: zoomRef.current, pan: panRef.current,
        hoveredId: hoveredIdRef.current,
        hoveredType: hoveredTypeRef.current,
        domainToSystems: domainToSystems.current,
        techToSystems: techToSystems.current,
        satelliteAnim: satelliteAnimRef.current,
        lastHoveredCluster: lastHoveredClusterRef.current,
        showLabels: { domains: !!hoveredIdRef.current, techClusters: !!hoveredIdRef.current, secondarySystems: false, minorSystems: false },
        centerGlowScale: 0.6,
        driftSpeedMultiplier: 0.5,
        techClusterPositionOverrides: techClusterMobilePositions,
      });

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrameRef.current);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable
  }, [dimensions]);

  function getTouchPos(e: React.TouchEvent<HTMLCanvasElement>, index: number) {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[index];
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  }

  function handleTouchStart(e: React.TouchEvent<HTMLCanvasElement>) {
    if (e.touches.length === 2) {
      const t0 = getTouchPos(e, 0);
      const t1 = getTouchPos(e, 1);
      const dist = Math.hypot(t1.x - t0.x, t1.y - t0.y);
      touchStateRef.current = {
        type: "pinch", startX: 0, startY: 0,
        startPanX: panRef.current.x, startPanY: panRef.current.y,
        initialDistance: dist, initialZoom: zoomRef.current,
      };
    } else if (e.touches.length === 1) {
      const t = getTouchPos(e, 0);
      touchStateRef.current = {
        type: "pan", startX: t.x, startY: t.y,
        startPanX: panRef.current.x, startPanY: panRef.current.y,
        initialDistance: 0, initialZoom: zoomRef.current,
      };
    }
  }

  function handleTouchMove(e: React.TouchEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const state = touchStateRef.current;
    const { width: w, height: h } = dimensions;

    if (state.type === "pinch" && e.touches.length === 2) {
      const t0 = getTouchPos(e, 0);
      const t1 = getTouchPos(e, 1);
      const dist = Math.hypot(t1.x - t0.x, t1.y - t0.y);
      zoomRef.current = clampZoom(computePinchZoom({
        initialDistance: state.initialDistance,
        currentDistance: dist,
        initialZoom: state.initialZoom,
      }));
    } else if (state.type === "pan" && e.touches.length === 1 && zoomRef.current > 1) {
      const t = getTouchPos(e, 0);
      const dx = t.x - state.startX;
      const dy = t.y - state.startY;
      panRef.current = clampPan(state.startPanX + dx, state.startPanY + dy, zoomRef.current, w, h);
    }
  }

  function handleTouchEnd(e: React.TouchEvent<HTMLCanvasElement>) {
    const state = touchStateRef.current;

    if (state.type === "pan" && e.changedTouches.length === 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const touch = e.changedTouches[0];
      const mx = touch.clientX - rect.left;
      const my = touch.clientY - rect.top;
      const dx = mx - state.startX;
      const dy = my - state.startY;

      if (Math.abs(dx) < 10 && Math.abs(dy) < 10) {
        const { width: w, height: h } = dimensions;
        const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf: sfRef.current });

        if (hit) {
          if (hit.id === hoveredIdRef.current && hit.type === "system" && hit.item.url) {
            window.open(hit.item.url, "_blank");
          } else {
            setHoveredId(hit.id);
            setHoveredType(hit.type);
          }
        } else {
          setHoveredId(null);
          setHoveredType(null);
        }
      }
    }

    touchStateRef.current = { type: "none", startX: 0, startY: 0, startPanX: 0, startPanY: 0, initialDistance: 0, initialZoom: 1 };
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl"
      style={{ height: dimensions.height }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        style={{ touchAction: "none" }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}
