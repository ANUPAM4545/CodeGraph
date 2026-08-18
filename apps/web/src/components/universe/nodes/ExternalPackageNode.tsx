import React from 'react';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode;
  isSelected: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
}

export default function ExternalPackageNode({ node, isSelected, isFaded, onClick }: Props) {
  return (
    <group position={[node.position.x, node.position.y + (node.size.height / 2), node.position.z]}>
      <mesh onClick={onClick}>
        <octahedronGeometry args={[node.size.width / 2, 0]} />
        <meshStandardMaterial 
          color={isSelected ? "#000000" : "#9ca3af"} 
          roughness={0.4}
          metalness={0.2}
          transparent={isFaded}
          opacity={isFaded ? 0.2 : 0.9}
        />
      </mesh>
    </group>
  );
}
