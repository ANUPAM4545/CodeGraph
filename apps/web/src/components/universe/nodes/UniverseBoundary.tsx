'use client';

import React from 'react';
import { Html } from '@react-three/drei';
import { ClusterBoundary } from '../../../types/universe';

interface Props {
  boundary: ClusterBoundary;
  isFaded: boolean;
}

export default function UniverseBoundary({ boundary, isFaded }: Props) {
  const { center, size, label, nodeId } = boundary;
  const isExternal = nodeId === 'external_packages_cluster';
  const color = isExternal ? '#d97706' : '#0284c7';
  const wireColor = isExternal ? '#f59e0b' : '#38bdf8';
  const opacity = isFaded ? 0.02 : 0.08;

  return (
    <group position={[center.x, center.y, center.z]}>
      {/* Translucent Fill */}
      <mesh>
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshBasicMaterial 
          color={color} 
          transparent={true} 
          opacity={opacity} 
          depthWrite={false}
        />
      </mesh>

      {/* Wireframe Outline */}
      <mesh>
        <boxGeometry args={[size.width, size.height, size.depth]} />
        <meshBasicMaterial 
          color={wireColor} 
          wireframe={true} 
          transparent={true} 
          opacity={isFaded ? 0.05 : 0.35} 
        />
      </mesh>

      {/* Top Corner Cluster Label */}
      {!isFaded && (
        <Html 
          position={[-size.width / 2 + 1, size.height / 2 + 0.6, -size.depth / 2 + 1]} 
          zIndexRange={[50, 0]}
        >
          <div className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded shadow-xs select-none pointer-events-none whitespace-nowrap border ${
            isExternal 
              ? 'bg-amber-950/80 text-amber-200 border-amber-500/40' 
              : 'bg-blue-950/80 text-blue-200 border-blue-500/40'
          }`}>
            {isExternal ? 'External Dependencies' : `${label} cluster`}
          </div>
        </Html>
      )}
    </group>
  );
}
