/**
 * Galaxy-specific layout data.
 * Imports pure business data from projects, domains, and technologies,
 * then adds angles, orbits, positions for the galaxy visualization.
 */

import { projects, type ProjectImportance } from "./projects";
import { domains as domainDefs } from "./domains";
import { technologyCategories } from "./technologies";

export type SystemImportance = ProjectImportance;

export type SystemNode = {
  id: string;
  name: string;
  url?: string;
  importance: SystemImportance;
  domains: string[];
  techClusters: string[];
  angle: number;
  orbit: number;
};

export type DomainNode = {
  id: string;
  name: string;
  angle: number;
  orbit: number;
  offset: { x: number; y: number };
};

export type TechClusterNode = {
  id: string;
  name: string;
  technologies: string[];
  position: { x: number; y: number };
};

export type OrbitConfig = {
  rx: number;
  ry: number;
  rotation: number;
  opacity: number;
};

// --- Orbit configuration ---

export const orbits: OrbitConfig[] = [
  { rx: 0.44, ry: 0.4, rotation: -0.12, opacity: 0.18 },
  { rx: 0.36, ry: 0.32, rotation: -0.08, opacity: 0.15 },
  { rx: 0.3, ry: 0.3, rotation: -0.05, opacity: 0.11 },
];

// --- Galaxy layout per project ---

const projectLayout: Record<string, { angle: number; orbit: number }> = {
  mobilet:      { angle: 0.5, orbit: 0 },
  shubuo:       { angle: 1.55, orbit: 0 },
  villasepeti:  { angle: 2.6, orbit: 0 },
  magicpags:    { angle: 3.65, orbit: 0 },
  beforesunset: { angle: 4.7, orbit: 0 },
  decktopus:    { angle: 5.75, orbit: 0 },
  ptttrade:     { angle: 0.6, orbit: 1 },
  room3d:       { angle: 2.2, orbit: 1 },
  ihtiyac:      { angle: 4.1, orbit: 1 },
  coknet:       { angle: 5.4, orbit: 1 },
  fsd:          { angle: 1.2, orbit: 2 },
  megatons:     { angle: 4.4, orbit: 2 },
};

// --- Galaxy layout per domain ---

const domainLayout: Record<string, { angle: number; orbit: number; offset: { x: number; y: number } }> = {
  ecommerce:    { angle: 1, orbit: 0, offset: { x: -0.07, y: 0.08 } },
  adtech:       { angle: 1.8, orbit: 0, offset: { x: 0.1, y: -0.1 } },
  productivity: { angle: 5.2, orbit: 0, offset: { x: 0.07, y: 0.06 } },
  distributed:  { angle: 3, orbit: 0, offset: { x: 0.06, y: -0.07 } },
  education:    { angle: 0.2, orbit: 1, offset: { x: 0.07, y: -0.06 } },
  nonprofit:    { angle: 4, orbit: 1, offset: { x: -0.07, y: 0.06 } },
  realtime:     { angle: 2.2, orbit: 1, offset: { x: -0.1, y: 0.08 } },
};

// --- Galaxy position per tech cluster ---

const techClusterPositions: Record<string, { x: number; y: number }> = {
  databases:     { x: 0.13, y: -0.02 },
  search:        { x: 0.03, y: -0.17 },
  cloud:         { x: -0.06, y: -0.12 },
  devops:        { x: -0.14, y: 0.06 },
  api:           { x: -0.02, y: 0.16 },
  architecture:  { x: 0.06, y: 0.15 },
  messaging:     { x: 0.12, y: -0.12 },
  frameworks:    { x: -0.13, y: -0.14 },
  monitoring:    { x: -0.14, y: -0.04 },
  data_analysis: { x: 0.14, y: 0.08 },
  methodologies: { x: -0.1, y: 0.14 },
};

// --- Build exported arrays by merging data + layout ---

export const systems: SystemNode[] = projects.map((p) => {
  const layout = projectLayout[p.id];
  return {
    id: p.id,
    name: p.name,
    url: p.url,
    importance: p.importance,
    domains: p.domains,
    techClusters: p.technologyCategories,
    angle: layout.angle,
    orbit: layout.orbit,
  };
});

export const domains: DomainNode[] = domainDefs.map((d) => {
  const layout = domainLayout[d.id];
  return {
    id: d.id,
    name: d.name,
    angle: layout.angle,
    orbit: layout.orbit,
    offset: layout.offset,
  };
});

export const techClusters: TechClusterNode[] = technologyCategories.map((tc) => ({
  id: tc.id,
  name: tc.name,
  technologies: tc.technologies,
  position: techClusterPositions[tc.id],
}));
