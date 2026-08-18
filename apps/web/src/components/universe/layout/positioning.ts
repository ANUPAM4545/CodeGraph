import { UniverseNode } from '../../../types/universe';
import { LAYOUT_CONSTANTS } from './constants';

function getBaseSizeForType(type: string) {
  switch (type) {
    case 'Class': return LAYOUT_CONSTANTS.CLASS_SIZE;
    case 'Function': return LAYOUT_CONSTANTS.CLASS_SIZE;
    case 'Method': return LAYOUT_CONSTANTS.SYMBOL_SIZE;
    case 'Variable': return LAYOUT_CONSTANTS.SYMBOL_SIZE;
    default: return LAYOUT_CONSTANTS.SYMBOL_SIZE;
  }
}

function getElevationForType(type: string) {
  switch (type) {
    case 'RepositoryVersion': return LAYOUT_CONSTANTS.DIR_ELEVATION;
    case 'Directory': return LAYOUT_CONSTANTS.DIR_ELEVATION;
    case 'File': return LAYOUT_CONSTANTS.FILE_ELEVATION;
    case 'ExternalPackage': return LAYOUT_CONSTANTS.DIR_ELEVATION;
    case 'Method': return LAYOUT_CONSTANTS.METHOD_ELEVATION;
    default: return LAYOUT_CONSTANTS.SYMBOL_ELEVATION; // Class, Function, etc
  }
}

/**
 * Bottom-up sizing of nodes.
 * Assumes tree is already built in node.children.
 */
export function computeSizes(node: UniverseNode) {
  if (node.children.length === 0) {
    // Leaf node (Symbol or empty File/Dir)
    if (node.type === 'File') {
      node.size = { width: LAYOUT_CONSTANTS.FILE_MIN_SIZE, height: 0.1, depth: LAYOUT_CONSTANTS.FILE_MIN_SIZE };
    } else if (node.type === 'Directory' || node.type === 'RepositoryVersion') {
      node.size = { width: LAYOUT_CONSTANTS.DIR_MIN_SIZE, height: 0.01, depth: LAYOUT_CONSTANTS.DIR_MIN_SIZE };
    } else {
      const s = getBaseSizeForType(node.type);
      node.size = { width: s, height: s, depth: s };
    }
    return;
  }

  // Compute children first
  for (const child of node.children) {
    computeSizes(child);
  }

  // Pack children into a rough square grid
  const gap = node.type === 'Directory' || node.type === 'RepositoryVersion' ? LAYOUT_CONSTANTS.DIR_GAP : (node.type === 'File' ? LAYOUT_CONSTANTS.FILE_GAP : LAYOUT_CONSTANTS.SYMBOL_GAP);
  const padding = node.type === 'Directory' || node.type === 'RepositoryVersion' ? LAYOUT_CONSTANTS.DIR_PADDING : (node.type === 'File' ? LAYOUT_CONSTANTS.FILE_PADDING : 0);

  let totalArea = 0;
  let maxWidth = 0;
  for (const child of node.children) {
    totalArea += (child.size.width + gap) * (child.size.depth + gap);
    maxWidth = Math.max(maxWidth, child.size.width);
  }

  const sideLength = Math.max(Math.sqrt(totalArea), maxWidth) + (padding * 2);

  node.size = {
    width: sideLength,
    height: node.type === 'Directory' ? 0.01 : (node.type === 'File' ? 0.1 : getBaseSizeForType(node.type)),
    depth: sideLength
  };
}

/**
 * Top-down positioning.
 * Root starts at x,y,z and positions its children inside its calculated bounds.
 */
export function computePositions(node: UniverseNode, x: number, y: number, z: number) {
  node.position = { x, y: y + getElevationForType(node.type), z };

  if (node.children.length === 0) return;

  const gap = node.type === 'Directory' || node.type === 'RepositoryVersion' ? LAYOUT_CONSTANTS.DIR_GAP : (node.type === 'File' ? LAYOUT_CONSTANTS.FILE_GAP : LAYOUT_CONSTANTS.SYMBOL_GAP);
  const padding = node.type === 'Directory' || node.type === 'RepositoryVersion' ? LAYOUT_CONSTANTS.DIR_PADDING : (node.type === 'File' ? LAYOUT_CONSTANTS.FILE_PADDING : 0);

  // Simple row-based packing within the calculated sideLength
  let currentX = x - (node.size.width / 2) + padding;
  let currentZ = z - (node.size.depth / 2) + padding;
  let rowMaxDepth = 0;

  for (const child of node.children) {
    if (currentX + child.size.width > x + (node.size.width / 2) - padding) {
      // Move to next row
      currentX = x - (node.size.width / 2) + padding;
      currentZ += rowMaxDepth + gap;
      rowMaxDepth = 0;
    }
    
    // Child position is its center
    const childX = currentX + (child.size.width / 2);
    const childZ = currentZ + (child.size.depth / 2);
    
    computePositions(child, childX, node.position.y, childZ);
    
    currentX += child.size.width + gap;
    rowMaxDepth = Math.max(rowMaxDepth, child.size.depth);
  }
}
