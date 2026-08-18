import { GraphNodeDTO, GraphEdgeDTO } from './graph';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Size {
  width: number;
  height: number;
  depth: number;
}

export interface ClusterBoundary {
  nodeId: string;
  label: string;
  center: Position;
  size: Size;
}

export interface UniverseNode {
  id: string;
  type: string;
  label: string;
  parentId?: string;
  position: Position;
  size: Size;
  scale: number;
  level: number;
  metadata: any;
  hasChildren: boolean;
  isExpanded: boolean;
  children: UniverseNode[];
}

export interface UniverseEdge {
  id: string;
  type: string;
  source: string;
  target: string;
  metadata: any;
  sourceNode?: UniverseNode;
  targetNode?: UniverseNode;
}

export interface UniverseHierarchy {
  root: UniverseNode;
  externalPackages: UniverseNode[];
  allNodes: Map<string, UniverseNode>;
  visibleNodes: UniverseNode[];
  allEdges: UniverseEdge[];
  visibleEdges: UniverseEdge[];
  clusterBoundaries: ClusterBoundary[];
}

