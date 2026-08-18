import { Node, Edge, Position } from 'reactflow';
import { GraphDTO, GraphNodeDTO } from '../../types/graph';

export interface LayoutOptions {
  edgeDensity?: 'LOW' | 'MEDIUM' | 'HIGH';
  expandedNodeIds?: Set<string>;
  explorationLevel?: 'architecture' | 'file' | 'symbol';
  selectedNodeId?: string | null;
}

export function getNodeDimensions(type: string): { width: number; height: number } {
  switch (type) {
    case 'RepositoryVersion':
      return { width: 220, height: 68 };
    case 'Directory':
      return { width: 180, height: 60 };
    case 'File':
      return { width: 180, height: 56 };
    case 'Class':
    case 'Function':
    case 'ExternalPackage':
      return { width: 190, height: 60 };
    case 'Method':
      return { width: 180, height: 54 };
    default:
      return { width: 180, height: 56 };
  }
}

interface TreeNode {
  id: string;
  node: GraphNodeDTO;
  children: TreeNode[];
  width: number;
  x: number;
  y: number;
}

export function adaptGraphToReactFlow(
  graph: GraphDTO,
  options: LayoutOptions = {}
): { nodes: Node[]; edges: Edge[] } {
  const { edgeDensity = 'LOW', expandedNodeIds = new Set(), explorationLevel = 'architecture', selectedNodeId = null } = options;

  if (!graph.nodes || graph.nodes.length === 0) {
    return { nodes: [], edges: [] };
  }

  // 1. Build lookup tables
  const nodeMap = new Map<string, GraphNodeDTO>();
  graph.nodes.forEach((n) => nodeMap.set(n.id, n));

  const allChildrenMap = new Map<string, string[]>();
  const parentMap = new Map<string, string>();

  graph.nodes.forEach((n) => allChildrenMap.set(n.id, []));

  // Determine structural containment edges
  graph.edges.forEach((e) => {
    if (e.type === 'CONTAINS' || e.type === 'DEFINES') {
      if (allChildrenMap.has(e.source) && !allChildrenMap.get(e.source)!.includes(e.target)) {
        allChildrenMap.get(e.source)!.push(e.target);
      }
      if (!parentMap.has(e.target)) {
        parentMap.set(e.target, e.source);
      }
    }
  });

  // Sort children deterministically
  allChildrenMap.forEach((children) => {
    children.sort((aId, bId) => {
      const a = nodeMap.get(aId);
      const b = nodeMap.get(bId);
      if (!a || !b) return 0;

      const typeRank = (t: string) => {
        if (t === 'Directory') return 1;
        if (t === 'File') return 2;
        if (t === 'Class') return 3;
        if (t === 'Function') return 4;
        if (t === 'Method') return 5;
        if (t === 'ExternalPackage') return 6;
        return 7;
      };

      const filePriority = (label: string) => {
        if (label === 'src') return 1;
        if (label === 'docs') return 2;
        if (label === 'public') return 3;
        if (label === 'package.json') return 4;
        if (label === 'tsconfig.json') return 5;
        if (label === 'next.config.ts') return 6;
        if (label === 'README.md') return 7;
        return 20;
      };

      const rankDiff = typeRank(a.type) - typeRank(b.type);
      if (rankDiff !== 0) return rankDiff;

      const prioDiff = filePriority(a.label || '') - filePriority(b.label || '');
      if (prioDiff !== 0) return prioDiff;

      const labelCompare = (a.label || '').localeCompare(b.label || '');
      if (labelCompare !== 0) return labelCompare;

      return a.id.localeCompare(b.id);
    });
  });

  // 2. Identify Root Node (RepositoryVersion or top node)
  let rootNode = graph.nodes.find((n) => n.type === 'RepositoryVersion');
  if (!rootNode) {
    rootNode = graph.nodes.find((n) => !parentMap.has(n.id)) || graph.nodes[0];
  }

  // 3. Build visible hierarchical tree starting from Root
  const visibleNodeIds = new Set<string>();

  function buildTree(nodeId: string): TreeNode | null {
    const node = nodeMap.get(nodeId);
    if (!node) return null;

    visibleNodeIds.add(nodeId);

    const childIds = allChildrenMap.get(nodeId) || [];
    const children: TreeNode[] = [];

    // Progressive expansion rule:
    // - Root node's direct children are always visible initially (~4–8 immediate items)
    // - Descendants beyond root are ONLY visible if the parent nodeId is in expandedNodeIds
    const isRoot = nodeId === rootNode?.id;
    const isExpanded = isRoot || expandedNodeIds.has(nodeId);

    // If in File or Symbol level and this is the selected entity, auto-reveal its children
    const isFocusedLevel = (explorationLevel === 'file' || explorationLevel === 'symbol') && nodeId === selectedNodeId;

    if (isExpanded || isFocusedLevel) {
      // For root node, limit initial root files to top primary ones so initial tier is clean & readable
      const targetChildren = isRoot && childIds.length > 8 
        ? childIds.filter((cId, idx) => {
            const cNode = nodeMap.get(cId);
            return cNode?.type === 'Directory' || idx < 7;
          })
        : childIds;

      targetChildren.forEach((cId) => {
        const childTree = buildTree(cId);
        if (childTree) {
          children.push(childTree);
        }
      });
    }

    return {
      id: nodeId,
      node,
      children,
      width: 0,
      x: 0,
      y: 0,
    };
  }

  const rootTree = buildTree(rootNode.id);
  if (!rootTree) {
    return { nodes: [], edges: [] };
  }

  // 4. Recursive Layout: Compute Subtree Widths
  const nodeGap = 60; // Horizontal gap between sibling subtrees
  const rankHeight = 140; // Vertical distance between tiers

  function computeSubtreeWidth(t: TreeNode): number {
    const myDims = getNodeDimensions(t.node.type);
    if (t.children.length === 0) {
      t.width = myDims.width;
      return t.width;
    }

    let childrenSpan = 0;
    t.children.forEach((c, idx) => {
      const cw = computeSubtreeWidth(c);
      childrenSpan += cw;
      if (idx > 0) childrenSpan += nodeGap;
    });

    t.width = Math.max(myDims.width, childrenSpan);
    return t.width;
  }

  computeSubtreeWidth(rootTree);

  // 5. Recursive Layout: Assign (X, Y) Coordinates
  function assignCoordinates(t: TreeNode, leftX: number, depth: number) {
    const myDims = getNodeDimensions(t.node.type);
    t.y = depth * rankHeight;

    if (t.children.length === 0) {
      t.x = leftX + (t.width - myDims.width) / 2;
      return;
    }

    let currentChildX = leftX;
    t.children.forEach((c) => {
      assignCoordinates(c, currentChildX, depth + 1);
      currentChildX += c.width + nodeGap;
    });

    const firstChildCenter = t.children[0].x + getNodeDimensions(t.children[0].node.type).width / 2;
    const lastChildCenter = t.children[t.children.length - 1].x + getNodeDimensions(t.children[t.children.length - 1].node.type).width / 2;
    const childrenMidpoint = (firstChildCenter + lastChildCenter) / 2;

    t.x = childrenMidpoint - myDims.width / 2;
  }

  assignCoordinates(rootTree, 0, 0);

  // 6. Convert Tree into React Flow Nodes
  const rfNodes: Node[] = [];

  function collectNodes(t: TreeNode) {
    const rawChildren = allChildrenMap.get(t.id) || [];
    const hasChildren = rawChildren.length > 0;
    const isExpanded = expandedNodeIds.has(t.id);

    rfNodes.push({
      id: t.id,
      type: 'custom',
      position: { x: Math.round(t.x), y: Math.round(t.y) },
      sourcePosition: Position.Bottom,
      targetPosition: Position.Top,
      data: {
        label: t.node.label,
        type: t.node.type,
        metadata: t.node.metadata,
        hasChildren,
        isExpanded,
      },
    });

    t.children.forEach((c) => collectNodes(c));
  }

  collectNodes(rootTree);

  // 7. Build React Flow Edges (only between visible nodes)
  const rfEdges: Edge[] = [];
  graph.edges.forEach((e) => {
    if (!visibleNodeIds.has(e.source) || !visibleNodeIds.has(e.target)) {
      return;
    }

    // Filter by Edge Density
    if (edgeDensity === 'LOW') {
      if (e.type !== 'CONTAINS' && e.type !== 'DEFINES') {
        return;
      }
    } else if (edgeDensity === 'MEDIUM') {
      if (e.type === 'CALLS' || e.type === 'HAS_PARAMETER') {
        return;
      }
    }

    // Edge visual properties based on relationship type
    let strokeColor = '#94a3b8';
    let strokeWidth = 1.5;
    let strokeDasharray: string | undefined = undefined;
    let animated = false;
    let showLabel = false;

    if (e.type === 'CONTAINS') {
      strokeColor = '#cbd5e1';
      strokeWidth = 1.5;
      showLabel = false; // Hierarchical tree structure clearly indicates CONTAINS without text clutter
    } else if (e.type === 'DEFINES') {
      strokeColor = '#94a3b8';
      strokeWidth = 1.5;
      showLabel = true;
    } else if (e.type === 'IMPORTS') {
      strokeColor = '#94a3b8';
      strokeWidth = 1.5;
      strokeDasharray = '4 4';
      showLabel = true;
    } else if (e.type === 'CALLS') {
      strokeColor = '#8b5cf6';
      strokeWidth = 1.5;
      animated = true;
      showLabel = true;
    } else if (e.type === 'INHERITS') {
      strokeColor = '#10b981';
      strokeWidth = 1.5;
      showLabel = true;
    }

    rfEdges.push({
      id: e.id || `${e.source}-${e.type}-${e.target}`,
      source: e.source,
      target: e.target,
      type: 'default', // Smooth curved Bezier edges radiating cleanly from parent to children
      label: showLabel ? e.type : undefined,
      labelStyle: { fill: '#64748b', fontSize: 9, fontWeight: 500, fontFamily: 'monospace' },
      labelBgStyle: { fill: '#ffffff', fillOpacity: 0.92, rx: 3, ry: 3 },
      labelBgPadding: [4, 2],
      animated,
      style: {
        stroke: strokeColor,
        strokeWidth,
        strokeDasharray,
      },
    });
  });

  return { nodes: rfNodes, edges: rfEdges };
}


