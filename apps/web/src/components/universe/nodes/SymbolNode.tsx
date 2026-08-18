import React from 'react';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode;
  isSelected: boolean;
  isFaded: boolean;
  onClick: (e: any) => void;
}

export default function SymbolNode({ node, isSelected, isFaded, onClick }: Props) {
  // Different shapes for different types to maintain monochrome identity
  const isClass = node.type === 'Class';
  const isFunction = node.type === 'Function';
  
  return (
    <group position={[node.position.x, node.position.y + (node.size.height / 2), node.position.z]}>
      <mesh onClick={onClick}>
        {isClass ? (
          <boxGeometry args={[node.size.width, node.size.height, node.size.depth]} />
        ) : isFunction ? (
          <cylinderGeometry args={[node.size.width/2, node.size.width/2, node.size.height, 16]} />
        ) : (
          <boxGeometry args={[node.size.width, node.size.height, node.size.depth]} />
        )}
        <meshStandardMaterial 
          color={isSelected ? "#000000" : (isClass ? "#4b5563" : "#6b7280")} 
          roughness={0.6}
          transparent={isFaded}
          opacity={isFaded ? 0.1 : 1}
        />
      </mesh>
    </group>
  );
}
