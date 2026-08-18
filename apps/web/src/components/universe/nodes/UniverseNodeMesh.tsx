'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { UniverseNode } from '../../../types/universe';

interface Props {
  node: UniverseNode;
  isSelected: boolean;
  isFaded: boolean;
  isImpacted: boolean;
  onSelect: (e: any) => void;
  onToggleExpand?: (e: any) => void;
}

export default function UniverseNodeMesh({ 
  node, 
  isSelected, 
  isFaded, 
  isImpacted,
  onSelect,
  onToggleExpand 
}: Props) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += delta * 0.35;
    }
  });

  const getColors = () => {
    if (isImpacted) {
      return { base: '#f59e0b', emissive: '#b45309', border: '#d97706' };
    }
    switch (node.type) {
      case 'RepositoryVersion':
        return { base: '#0f172a', emissive: '#1e293b', border: '#475569' };
      case 'Directory':
        return { base: '#0284c7', emissive: '#0369a1', border: '#38bdf8' };
      case 'File':
        return { base: '#2563eb', emissive: '#1d4ed8', border: '#60a5fa' };
      case 'Class':
        return { base: '#059669', emissive: '#047857', border: '#34d399' };
      case 'Function':
        return { base: '#7c3aed', emissive: '#6d28d9', border: '#a78bfa' };
      case 'Method':
        return { base: '#6366f1', emissive: '#4f46e5', border: '#818cf8' };
      case 'ExternalPackage':
        return { base: '#ea580c', emissive: '#c2410c', border: '#fb923c' };
      default:
        return { base: '#334155', emissive: '#475569', border: '#94a3b8' };
    }
  };

  const { base, emissive, border } = getColors();
  const radius = node.scale * 1.0;
  const currentScale = hovered ? 1.08 : (isSelected ? 1.05 : 1.0);
  const opacity = isFaded ? 0.08 : (isSelected ? 1.0 : 0.94);

  const fanIn = node.metadata?.fan_in || 0;
  const isHotspot = fanIn > 5;

  return (
    <group 
      position={[node.position.x, node.position.y, node.position.z]}
      scale={[currentScale, currentScale, currentScale]}
    >
      {/* Hotspot Halo */}
      {isHotspot && !isFaded && (
        <mesh position={[0, -radius * 0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius * 1.3, radius * 1.6, 32]} />
          <meshBasicMaterial 
            color="#f59e0b" 
            transparent={true} 
            opacity={0.35} 
            side={THREE.DoubleSide} 
          />
        </mesh>
      )}

      {/* Geometry based on Node Type */}
      {node.type === 'RepositoryVersion' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <sphereGeometry args={[radius, 32, 32]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.8 : 0.3}
              roughness={0.25}
              metalness={0.2}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[radius * 1.15, 16, 16]} />
            <meshBasicMaterial 
              color={isSelected ? '#ffffff' : border} 
              wireframe={true} 
              transparent={true} 
              opacity={isFaded ? 0.04 : (isSelected ? 0.9 : 0.3)} 
            />
          </mesh>
        </group>
      ) : node.type === 'Directory' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <cylinderGeometry args={[radius * 0.95, radius * 1.05, radius * 0.85, 8]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.6 : 0.2}
              roughness={0.3}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
          <mesh>
            <cylinderGeometry args={[radius * 0.98, radius * 1.08, radius * 0.88, 8]} />
            <meshBasicMaterial 
              color={isSelected ? '#ffffff' : border} 
              wireframe={true} 
              transparent={true} 
              opacity={isFaded ? 0.04 : (isSelected ? 0.9 : 0.35)} 
            />
          </mesh>
        </group>
      ) : node.type === 'File' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <boxGeometry args={[radius * 1.5, radius * 0.7, radius * 1.5]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.6 : 0.2}
              roughness={0.35}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
          <mesh>
            <boxGeometry args={[radius * 1.54, radius * 0.74, radius * 1.54]} />
            <meshBasicMaterial 
              color={isSelected ? '#ffffff' : border} 
              wireframe={true} 
              transparent={true} 
              opacity={isFaded ? 0.04 : (isSelected ? 0.9 : 0.35)} 
            />
          </mesh>
        </group>
      ) : node.type === 'Class' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <boxGeometry args={[radius * 1.15, radius * 1.15, radius * 1.15]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.7 : 0.25}
              roughness={0.3}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
        </group>
      ) : node.type === 'Function' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <cylinderGeometry args={[radius * 0.6, radius * 0.6, radius * 1.2, 16]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.7 : 0.25}
              roughness={0.3}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
        </group>
      ) : node.type === 'ExternalPackage' ? (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <octahedronGeometry args={[radius * 0.9, 0]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.7 : 0.3}
              roughness={0.3}
              metalness={0.2}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
        </group>
      ) : (
        <group onClick={onSelect} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
          <mesh ref={meshRef}>
            <boxGeometry args={[radius, radius, radius]} />
            <meshStandardMaterial 
              color={base} 
              emissive={emissive}
              emissiveIntensity={isSelected ? 0.6 : 0.2}
              roughness={0.4}
              transparent={isFaded}
              opacity={opacity}
            />
          </mesh>
        </group>
      )}
    </group>
  );
}
