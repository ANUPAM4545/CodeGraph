import { GraphNodeDTO, GraphEdgeDTO } from '../../../types/graph';
import { UniverseNode, UniverseEdge, UniverseHierarchy, ClusterBoundary } from '../../../types/universe';

function getNodeLevel(type: string): number {
  switch (type) {
    case 'RepositoryVersion': return 0;
    case 'Directory': return 1;
    case 'File': return 2;
    case 'Class': 
    case 'Function': return 3;
    case 'Method':
    case 'Variable':
    case 'Parameter': return 4;
    case 'ExternalPackage': return 2;
    default: return 5;
  }
}

function getNodeScale(type: string): number {
  switch (type) {
    case 'RepositoryVersion': return 4.0;
    case 'Directory': return 2.6;
    case 'File': return 1.8;
    case 'Class': return 1.6;
    case 'Function': return 1.3;
    case 'Method': return 1.0;
    case 'ExternalPackage': return 1.6;
    default: return 1.2;
  }
}

export function buildUniverseHierarchy(
  nodes: GraphNodeDTO[], 
  edges: GraphEdgeDTO[],
  expandedNodeIds: Set<string> = new Set(),
  viewMode: 'ARCHITECTURE' | 'DEPENDENCIES' | 'IMPACT' = 'ARCHITECTURE',
  selectedNodeId: string | null = null
): UniverseHierarchy {
  const allNodes = new Map<string, UniverseNode>();
  const externalPackages: UniverseNode[] = [];
  
  // 1. Create base universe nodes with exact architectural visual scales
  nodes.forEach(n => {
    const scale = getNodeScale(n.type);
    allNodes.set(n.id, {
      id: n.id,
      type: n.type,
      label: n.label || 'Unnamed',
      position: { x: 0, y: 0, z: 0 },
      size: { width: scale * 2.2, height: scale * 1.4, depth: scale * 2.2 },
      scale,
      level: getNodeLevel(n.type),
      metadata: n.metadata || {},
      hasChildren: false,
      isExpanded: expandedNodeIds.has(n.id),
      children: []
    });
  });

  // 2. Resolve parent-child tree hierarchy from real CONTAINS & DEFINES edges
  edges.forEach(e => {
    if (e.type === 'CONTAINS' || e.type === 'DEFINES') {
      const parent = allNodes.get(e.source);
      const child = allNodes.get(e.target);
      if (parent && child && child.id !== parent.id) {
        child.parentId = parent.id;
        if (!parent.children.some(c => c.id === child.id)) {
          parent.children.push(child);
          parent.hasChildren = true;
        }
      }
    }
  });

  // 3. Identify Root RepositoryVersion
  let root: UniverseNode | undefined;
  nodes.forEach(n => {
    const un = allNodes.get(n.id)!;
    if (un.type === 'RepositoryVersion') {
      root = un;
    } else if (un.type === 'ExternalPackage') {
      externalPackages.push(un);
    }
  });

  // Fallback root if RepositoryVersion is missing
  if (!root) {
    root = {
      id: 'root_repo_version',
      type: 'RepositoryVersion',
      label: 'Repository',
      position: { x: 0, y: 15, z: 0 },
      size: { width: 8, height: 8, depth: 8 },
      scale: 4.0,
      level: 0,
      metadata: {},
      hasChildren: true,
      isExpanded: true,
      children: []
    };
    
    const rootEdges: GraphEdgeDTO[] = [];
    for (const un of Array.from(allNodes.values())) {
      if (!un.parentId && un.type !== 'ExternalPackage' && un.id !== root.id) {
        un.parentId = root.id;
        root.children.push(un);
        rootEdges.push({
          id: `contains_${root.id}_${un.id}`,
          type: 'CONTAINS',
          source: root.id,
          target: un.id,
          metadata: {}
        });
      }
    }
    allNodes.set(root.id, root);
    edges = [...edges, ...rootEdges];
  }

  // 4. Deterministic sorting for 100% stable spatial positioning
  const sortFn = (a: UniverseNode, b: UniverseNode) => {
    if (a.type !== b.type) return a.type.localeCompare(b.type);
    if (a.label !== b.label) return a.label.localeCompare(b.label);
    return a.id.localeCompare(b.id);
  };

  for (const un of Array.from(allNodes.values())) {
    un.children.sort(sortFn);
    un.hasChildren = un.children.length > 0;
    un.isExpanded = expandedNodeIds.has(un.id);
  }
  externalPackages.sort(sortFn);

  // 5. Determine Progressive Visibility
  const visibleNodesSet = new Set<UniverseNode>();
  visibleNodesSet.add(root);

  const rootDirectories = root.children.filter(c => c.type === 'Directory');
  const rootFiles = root.children.filter(c => c.type === 'File');

  // Top-level directories are always visible
  rootDirectories.forEach(dir => visibleNodesSet.add(dir));

  // Top-level root files (up to 12 primary configuration files)
  rootFiles.slice(0, 12).forEach(f => visibleNodesSet.add(f));

  // Recursively add descendants of expanded nodes
  const addVisibleDescendants = (parentNode: UniverseNode) => {
    if (expandedNodeIds.has(parentNode.id)) {
      parentNode.children.forEach(child => {
        visibleNodesSet.add(child);
        addVisibleDescendants(child);
      });
    }
  };

  rootDirectories.forEach(addVisibleDescendants);
  rootFiles.forEach(addVisibleDescendants);

  // External Packages Visibility
  const showExternalPackages = viewMode === 'DEPENDENCIES' || expandedNodeIds.has('external_packages_cluster');
  const visibleExternalPackages: UniverseNode[] = [];

  if (showExternalPackages) {
    externalPackages.slice(0, 24).forEach(ep => {
      visibleNodesSet.add(ep);
      visibleExternalPackages.push(ep);
    });
  } else if (selectedNodeId) {
    edges.forEach(e => {
      if ((e.source === selectedNodeId || e.target === selectedNodeId) && e.type === 'IMPORTS') {
        const otherId = e.source === selectedNodeId ? e.target : e.source;
        const otherNode = allNodes.get(otherId);
        if (otherNode && otherNode.type === 'ExternalPackage') {
          visibleNodesSet.add(otherNode);
          visibleExternalPackages.push(otherNode);
        }
      }
    });
  }

  // 6. Layered 3D Architectural Spatial Layout Calculation
  // Root Repository anchor at (0, 14, 0)
  root.position = { x: 0, y: 14, z: 0 };

  // Top-Level Directories (e.g. src, docs) placed in an elevated architectural tier at Z = -60
  const dirCount = Math.max(1, rootDirectories.length);
  const dirSpacing = Math.min(52, Math.max(36, 100 / dirCount));

  rootDirectories.forEach((dir, i) => {
    const x = (i - (dirCount - 1) / 2) * dirSpacing;
    dir.position = {
      x,
      y: 12 + (i % 2 === 0 ? 0 : 2.5),
      z: -60 - Math.abs(x) * 0.12
    };
  });

  // Top-Level Root Files arranged in an amphitheater semi-circular orbital arc
  const fileCount = Math.max(1, Math.min(12, rootFiles.length));
  const arcRadius = 42;

  rootFiles.slice(0, 12).forEach((f, j) => {
    const angle = fileCount > 1 
      ? -Math.PI * 0.75 + (j / (fileCount - 1)) * (Math.PI * 1.5)
      : 0;
    f.position = {
      x: arcRadius * Math.sin(angle),
      y: 2,
      z: -18 + arcRadius * Math.cos(angle) * 0.45
    };
  });

  // Recursive Cluster Layout for Expanded Subtrees
  const clusterBoundaries: ClusterBoundary[] = [];

  const layoutSubtreeCluster = (parent: UniverseNode, depthStep: number = 60) => {
    if (!expandedNodeIds.has(parent.id) || parent.children.length === 0) return;

    const visibleChildren = parent.children.filter(c => visibleNodesSet.has(c));
    if (visibleChildren.length === 0) return;

    const count = visibleChildren.length;
    const isDir = parent.type === 'Directory';
    
    // Group into subdirectories and files
    const subDirs = visibleChildren.filter(c => c.type === 'Directory');
    const subFiles = visibleChildren.filter(c => c.type !== 'Directory');

    const targetZ = parent.position.z - depthStep;
    const targetY = parent.position.y;

    let minX = parent.position.x, maxX = parent.position.x;
    let minY = targetY, maxY = targetY;
    let minZ = targetZ, maxZ = targetZ;

    // Layout Subdirectories in upper arc
    if (subDirs.length > 0) {
      const subDirRadius = Math.max(20, 5.5 * Math.sqrt(subDirs.length));
      subDirs.forEach((sd, sidx) => {
        const angle = (Math.PI * 2 * sidx) / subDirs.length;
        const cx = parent.position.x + subDirRadius * Math.cos(angle);
        const cz = targetZ + subDirRadius * Math.sin(angle) * 0.5;
        const cy = targetY + 6 + (sidx % 2 === 0 ? 0 : 2);

        sd.position = { x: cx, y: cy, z: cz };

        minX = Math.min(minX, cx - sd.scale * 2);
        maxX = Math.max(maxX, cx + sd.scale * 2);
        minY = Math.min(minY, cy - sd.scale * 2);
        maxY = Math.max(maxY, cy + sd.scale * 2);
        minZ = Math.min(minZ, cz - sd.scale * 2);
        maxZ = Math.max(maxZ, cz + sd.scale * 2);

        // Recurse for nested directories
        layoutSubtreeCluster(sd, depthStep * 0.85);
      });
    }

    // Layout SubFiles in structured rows and columns below
    if (subFiles.length > 0) {
      const cols = Math.min(5, Math.ceil(Math.sqrt(subFiles.length * 1.5)));
      const rows = Math.ceil(subFiles.length / cols);
      const colSpacing = 18;
      const rowSpacing = 14;

      subFiles.forEach((sf, fidx) => {
        const col = fidx % cols;
        const row = Math.floor(fidx / cols);
        const cx = parent.position.x + (col - (cols - 1) / 2) * colSpacing;
        const cy = targetY - 6 - row * rowSpacing;
        const cz = targetZ + (col % 2 === 0 ? 0 : 2);

        sf.position = { x: cx, y: cy, z: cz };

        minX = Math.min(minX, cx - sf.scale * 2);
        maxX = Math.max(maxX, cx + sf.scale * 2);
        minY = Math.min(minY, cy - sf.scale * 2);
        maxY = Math.max(maxY, cy + sf.scale * 2);
        minZ = Math.min(minZ, cz - sf.scale * 2);
        maxZ = Math.max(maxZ, cz + sf.scale * 2);

        // Recurse for nested symbols in files
        layoutSubtreeCluster(sf, depthStep * 0.7);
      });
    }

    if (isDir && count > 1) {
      clusterBoundaries.push({
        nodeId: parent.id,
        label: parent.label.toUpperCase(),
        center: {
          x: (minX + maxX) / 2,
          y: (minY + maxY) / 2,
          z: targetZ
        },
        size: {
          width: Math.max(24, (maxX - minX) + 12),
          height: Math.max(16, (maxY - minY) + 12),
          depth: Math.max(20, (maxZ - minZ) + 12)
        }
      });
    }
  };

  rootDirectories.forEach(dir => layoutSubtreeCluster(dir, 60));
  rootFiles.forEach(file => layoutSubtreeCluster(file, 45));

  // External Packages Zone (Dedicated cluster at X = +110, Z = -60)
  if (visibleExternalPackages.length > 0) {
    const pkgCount = visibleExternalPackages.length;
    const cols = Math.ceil(Math.sqrt(pkgCount));
    const spacing = 12;
    const originX = 110;
    const originZ = -60;
    const originY = 6;

    let pMinX = originX, pMaxX = originX;
    let pMinY = originY, pMaxY = originY;

    visibleExternalPackages.forEach((ep, idx) => {
      const col = idx % cols;
      const row = Math.floor(idx / cols);
      const px = originX + (col - (cols - 1) / 2) * spacing;
      const py = originY + ((Math.ceil(pkgCount / cols) - 1) / 2 - row) * spacing;
      const pz = originZ;

      ep.position = { x: px, y: py, z: pz };

      pMinX = Math.min(pMinX, px - 3);
      pMaxX = Math.max(pMaxX, px + 3);
      pMinY = Math.min(pMinY, py - 3);
      pMaxY = Math.max(pMaxY, py + 3);
    });

    clusterBoundaries.push({
      nodeId: 'external_packages_cluster',
      label: 'EXTERNAL DEPENDENCIES',
      center: {
        x: (pMinX + pMaxX) / 2,
        y: (pMinY + pMaxY) / 2,
        z: originZ
      },
      size: {
        width: Math.max(20, (pMaxX - pMinX) + 10),
        height: Math.max(16, (pMaxY - pMinY) + 10),
        depth: 14
      }
    });
  }

  const visibleNodes = Array.from(visibleNodesSet);
  const visibleNodeIdSet = new Set(visibleNodes.map(n => n.id));

  // 7. Filter Real Relationships for Visible Nodes
  const allEdges: UniverseEdge[] = edges.map(e => ({
    id: e.id,
    type: e.type,
    source: e.source,
    target: e.target,
    metadata: e.metadata || {},
    sourceNode: allNodes.get(e.source),
    targetNode: allNodes.get(e.target)
  }));

  const visibleEdges = allEdges.filter(e => 
    e.sourceNode && 
    e.targetNode && 
    visibleNodeIdSet.has(e.source) && 
    visibleNodeIdSet.has(e.target)
  );

  return {
    root,
    externalPackages,
    allNodes,
    visibleNodes,
    allEdges,
    visibleEdges,
    clusterBoundaries
  };
}
