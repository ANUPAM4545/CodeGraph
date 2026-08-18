import React from 'react';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode;
  isSelected: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
}

export default function FileNode({ node, isSelected, isFaded, onClick }: Props) {
  // A slab for the file
  return (
    <group position={[node.position.x, node.position.y + (node.size.height / 2), node.position.z]}>
      <mesh onClick={onClick}>
        <boxGeometry args={[node.size.width, node.size.height, node.size.depth]} />
        <meshStandardMaterial 
          color={isSelected ? "#e5e7eb" : "#ffffff"} 
          roughness={0.8}
          metalness={0.1}
          transparent={isFaded}
          opacity={isFaded ? 0.2 : 1}
        />
      </mesh>
      {/* Edge highlight */}
      <lineSegments>
        <edgesGeometry args={[new (require('three')).BoxGeometry(node.size.width, node.size.height, node.size.depth)]} />
        <lineBasicMaterial 
          color={isSelected ? "#000000" : "#9ca3af"} 
          transparent={isFaded}
          opacity={isFaded ? 0.2 : 0.8} 
        />
      </lineSegments>
    </group>
  );
}
