"use client";

import { useRef, useEffect } from "react";
import { useGalaxySetup } from "./useGalaxySetup";
import { renderGalaxyFrame } from "@/lib/galaxyRenderLoop";
import { hitTest } from "@/lib/galaxyInteraction";
import { prepareFrame } from "@/lib/galaxyAnimationSetup";
import { clampZoom, clampPan, computePinchZoom, isDoubleTap } from "@/lib/galaxyTouch";
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
  } = useGalaxySetup({ starCount: 600, centerBias: 0.4 });
  const zoomRef = useRef(1);
  const panRef = useRef({ x: 0, y: 0 });
  const lastEmptyTapRef = useRef(0);
  const touchStateRef = useRef<{
    type: "none" | "pan" | "pinch";
    startX: number; startY: number;
    startPanX: number; startPanY: number;
    initialDistance: number; initialZoom: number;
  }>({ type: "none", startX: 0, startY: 0, startPanX: 0, startPanY: 0, initialDistance: 0, initialZoom: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const refs = {
      canvasRef, animFrameRef, timeRef, prevTimestampRef,
      hoveredTypeRef, hoveredIdRef, lastHoveredClusterRef, satelliteAnimRef,
    };

    const animate = (timestamp: number) => {
      const frame = prepareFrame(canvas, timestamp, refs, dimensions);
      if (!frame) { animFrameRef.current = requestAnimationFrame(animate); return; }
      const { ctx, time, w, h } = frame;

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
        showLabels: { domains: !!hoveredIdRef.current, techClusters: !!hoveredIdRef.current, secondarySystems: !!hoveredIdRef.current, minorSystems: !!hoveredIdRef.current },
        centerGlowScale: 0.4,
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

  function handleTap(mx: number, my: number) {
    const { width: w, height: h } = dimensions;
    const hit = hitTest({ mx, my, time: timeRef.current, w, h, cx: w / 2, cy: h / 2, sf: sfRef.current, techClusterPositionOverrides: techClusterMobilePositions });
    if (hit) {
      if (hit.id === hoveredIdRef.current && hit.type === "system" && hit.item.url) {
        window.open(hit.item.url, "_blank");
      } else {
        setHoveredId(hit.id);
        setHoveredType(hit.type);
      }
      lastEmptyTapRef.current = 0;
    } else {
      const now = Date.now();
      if (isDoubleTap(lastEmptyTapRef.current, now)) {
        zoomRef.current = 1;
        panRef.current = { x: 0, y: 0 };
        lastEmptyTapRef.current = 0;
      } else {
        lastEmptyTapRef.current = now;
      }
      setHoveredId(null);
      setHoveredType(null);
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
      if (Math.abs(mx - state.startX) < 10 && Math.abs(my - state.startY) < 10) {
        handleTap(mx, my);
      }
    }

    touchStateRef.current = { type: "none", startX: 0, startY: 0, startPanX: 0, startPanY: 0, initialDistance: 0, initialZoom: 1 };
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl"
      style={{
        height: dimensions.height,
        maskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 90% 85% at 50% 50%, black 50%, transparent 100%)",
      }}
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
