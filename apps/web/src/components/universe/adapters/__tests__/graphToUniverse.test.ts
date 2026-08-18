import { expect, test, describe } from 'vitest';
import { buildUniverseHierarchy } from '../graphToUniverse';
import { GraphNodeDTO, GraphEdgeDTO } from '../../../../types/graph';

describe('Graph to Universe Adapter', () => {
  test('creates root and assigns children correctly', () => {
    const nodes: GraphNodeDTO[] = [
      { id: 'repo_v1', type: 'RepositoryVersion', label: 'v1', repository_version_id: 'v1', metadata: {} },
      { id: 'dir_1', type: 'Directory', label: 'src', repository_version_id: 'v1', metadata: {} },
      { id: 'file_1', type: 'File', label: 'main.py', repository_version_id: 'v1', metadata: {} }
    ];
    
    const edges: GraphEdgeDTO[] = [
      { id: 'e1', type: 'CONTAINS', source: 'repo_v1', target: 'dir_1', metadata: {} },
      { id: 'e2', type: 'CONTAINS', source: 'dir_1', target: 'file_1', metadata: {} }
    ];

    const hierarchy = buildUniverseHierarchy(nodes, edges, new Set(['dir_1']));
    
    expect(hierarchy.root.id).toBe('repo_v1');
    expect(hierarchy.root.children.length).toBe(1);
    expect(hierarchy.root.children[0].id).toBe('dir_1');
    expect(hierarchy.root.children[0].children.length).toBe(1);
    expect(hierarchy.root.children[0].children[0].id).toBe('file_1');
    
    // Check sizing
    expect(hierarchy.root.size.width).toBeGreaterThan(0);
    expect(hierarchy.root.position.x).toBe(0);
    
    // Check visible edges
    expect(hierarchy.visibleEdges.length).toBe(2);
  });
});
