import React from 'react';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode;
  isSelected: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
}

export default function DirectoryRegion({ node, isSelected, isFaded, onClick }: Props) {
  return (
    <group position={[node.position.x, node.position.y, node.position.z]}>
      {/* Subtle translucent floor for the directory */}
      <mesh 
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={onClick}
      >
        <planeGeometry args={[node.size.width, node.size.depth]} />
        <meshBasicMaterial 
          color="#f0f0f0" 
          transparent={true} 
          opacity={isFaded ? 0.05 : 0.2}
          depthWrite={false}
        />
      </mesh>
      
      {/* Wireframe Border */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[node.size.width, node.size.depth]} />
        <meshBasicMaterial 
          color={isSelected ? "#000000" : "#d1d5db"} 
          wireframe={true} 
          transparent={true} 
          opacity={isFaded ? 0.2 : (isSelected ? 1 : 0.5)}
        />
      </mesh>
    </group>
  );
}
