'use client';

import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { UniverseEdge as EdgeType, UniverseNode } from '../../types/universe';
import * as THREE from 'three';

interface Props {
  edge: EdgeType;
  sourceNode: UniverseNode;
  targetNode: UniverseNode;
  isHighlighted: boolean;
  isFaded: boolean;
}

export default function UniverseEdge({ edge, sourceNode, targetNode, isHighlighted, isFaded }: Props) {
  const points = useMemo(() => {
    const start = new THREE.Vector3(
      sourceNode.position.x, 
      sourceNode.position.y, 
      sourceNode.position.z
    );
    const end = new THREE.Vector3(
      targetNode.position.x, 
      targetNode.position.y, 
      targetNode.position.z
    );

    const distance = start.distanceTo(end);
    
    // Subtle forward bend for hierarchical flow
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2 + Math.min(6, distance * 0.08);
    const midZ = (start.z + end.z) / 2;

    const curve = new THREE.QuadraticBezierCurve3(
      start, 
      new THREE.Vector3(midX, midY, midZ), 
      end
    );
    return curve.getPoints(16);
  }, [sourceNode, targetNode]);

  const { color, defaultOpacity, defaultLineWidth, dashed } = useMemo(() => {
    switch (edge.type) {
      case 'CONTAINS':
        return { color: '#94a3b8', defaultOpacity: 0.35, defaultLineWidth: 1.2, dashed: false };
      case 'DEFINES':
        return { color: '#64748b', defaultOpacity: 0.40, defaultLineWidth: 1.4, dashed: false };
      case 'IMPORTS':
        return { color: '#3b82f6', defaultOpacity: 0.50, defaultLineWidth: 1.5, dashed: true };
      case 'CALLS':
        return { color: '#8b5cf6', defaultOpacity: 0.60, defaultLineWidth: 1.8, dashed: false };
      case 'INHERITS':
        return { color: '#10b981', defaultOpacity: 0.60, defaultLineWidth: 1.8, dashed: false };
      default:
        return { color: '#cbd5e1', defaultOpacity: 0.30, defaultLineWidth: 1.0, dashed: false };
    }
  }, [edge.type]);

  const opacity = isFaded ? 0.06 : (isHighlighted ? 1.0 : defaultOpacity);
  const lineWidth = isHighlighted ? 2.5 : defaultLineWidth;
  const edgeColor = isHighlighted ? '#1e293b' : color;

  return (
    <Line
      points={points}
      color={edgeColor}
      lineWidth={lineWidth}
      dashed={dashed && !isHighlighted}
      dashScale={3}
      dashSize={1.5}
      gapSize={1.0}
      transparent={true}
      opacity={opacity}
    />
  );
}
