'use client';

import React, { useRef, useState, useMemo, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import * as THREE from 'three';
import { UniverseHierarchy, UniverseNode, UniverseEdge as EdgeType } from '../../types/universe';
import UniverseNodeMesh from './nodes/UniverseNodeMesh';
import UniverseBoundary from './nodes/UniverseBoundary';
import UniverseEdge from './UniverseEdge';

interface Props {
  hierarchy: UniverseHierarchy;
  selectedNodeId: string | null;
  onNodeSelect: (id: string | null) => void;
  onToggleExpand: (id: string) => void;
  explorationLevel: 'architecture' | 'file' | 'symbol';
  setExplorationLevel: (level: 'architecture' | 'file' | 'symbol') => void;
  edgeDensity: 'LOW' | 'MEDIUM' | 'HIGH';
  focusMode: boolean;
  showLabels: boolean;
  showBoundaries: boolean;
  impactNodeIds?: Set<string>;
  resetSignal: number;
  focusSignal: number;
  topViewSignal: number;
}

function CameraController({ 
  selectedNode, 
  hierarchy,
  resetSignal, 
  focusSignal,
  topViewSignal 
}: { 
  selectedNode: UniverseNode | null; 
  hierarchy: UniverseHierarchy;
  resetSignal: number; 
  focusSignal: number; 
  topViewSignal: number; 
}) {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);
  const targetPos = useRef<THREE.Vector3 | null>(null);
  const targetLook = useRef<THREE.Vector3 | null>(null);

  // Subtree Bounding Box Framing
  const focusOnNode = useCallback((node: UniverseNode) => {
    if (node.type === 'Directory' && node.hasChildren && node.children.length > 0) {
      // Compute bounding center and span of directory + its visible children
      let minX = node.position.x, maxX = node.position.x;
      let minY = node.position.y, maxY = node.position.y;
      let minZ = node.position.z, maxZ = node.position.z;

      node.children.forEach(c => {
        minX = Math.min(minX, c.position.x);
        maxX = Math.max(maxX, c.position.x);
        minY = Math.min(minY, c.position.y);
        maxY = Math.max(maxY, c.position.y);
        minZ = Math.min(minZ, c.position.z);
        maxZ = Math.max(maxZ, c.position.z);
      });

      const centerX = (minX + maxX) / 2;
      const centerY = (minY + maxY) / 2;
      const centerZ = (minZ + maxZ) / 2;
      const span = Math.max(maxX - minX, maxZ - minZ, 35);

      targetLook.current = new THREE.Vector3(centerX, centerY, centerZ);
      targetPos.current = new THREE.Vector3(
        centerX,
        centerY + span * 0.95,
        centerZ + span * 1.15
      );
    } else {
      targetLook.current = new THREE.Vector3(node.position.x, node.position.y, node.position.z);
      const dist = Math.max(node.scale * 12, 22);
      targetPos.current = new THREE.Vector3(
        node.position.x,
        node.position.y + dist * 0.65,
        node.position.z + dist * 0.85
      );
    }
  }, []);

  const resetCamera = useCallback(() => {
    targetLook.current = new THREE.Vector3(0, 6, -30);
    targetPos.current = new THREE.Vector3(0, 56, 75);
  }, []);

  const topView = useCallback(() => {
    targetLook.current = new THREE.Vector3(0, 0, -35);
    targetPos.current = new THREE.Vector3(0, 140, -34.9);
  }, []);

  useEffect(() => {
    if (selectedNode) {
      focusOnNode(selectedNode);
    }
  }, [selectedNode, focusOnNode]);

  useEffect(() => {
    if (focusSignal > 0 && selectedNode) {
      focusOnNode(selectedNode);
    }
  }, [focusSignal, selectedNode, focusOnNode]);

  useEffect(() => {
    if (resetSignal > 0) {
      resetCamera();
    }
  }, [resetSignal, resetCamera]);

  useEffect(() => {
    if (topViewSignal > 0) {
      topView();
    }
  }, [topViewSignal, topView]);

  useFrame((_, delta) => {
    if (controlsRef.current) {
      if (targetPos.current && targetLook.current) {
        const step = Math.min(delta * 4.2, 0.20);
        camera.position.lerp(targetPos.current, step);
        controlsRef.current.target.lerp(targetLook.current, step);
        controlsRef.current.update();

        if (camera.position.distanceTo(targetPos.current) < 0.2) {
          targetPos.current = null;
          targetLook.current = null;
        }
      }
    }
  });

  return (
    <OrbitControls 
      ref={controlsRef}
      makeDefault 
      minDistance={6} 
      maxDistance={380}
      enableDamping={true}
      dampingFactor={0.08}
      maxPolarAngle={Math.PI / 2 - 0.02}
    />
  );
}

function Scene({ 
  hierarchy, 
  selectedNodeId, 
  onNodeSelect, 
  onToggleExpand,
  explorationLevel, 
  edgeDensity, 
  focusMode,
  showLabels,
  showBoundaries,
  impactNodeIds,
  resetSignal,
  focusSignal,
  topViewSignal
}: Props) {
  const { camera } = useThree();
  const [cameraDistance, setCameraDistance] = useState(80);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  useFrame(() => {
    setCameraDistance(camera.position.distanceTo(new THREE.Vector3(0, 6, -30)));
  });

  const selectedNode = selectedNodeId ? hierarchy.allNodes.get(selectedNodeId) || null : null;

  // Highlight logic for connected neighbors & parent hierarchy
  const isNodeHighlighted = (id: string) => {
    if (!selectedNodeId) return false;
    if (selectedNodeId === id) return true;
    return hierarchy.visibleEdges.some(e => 
      (e.source === selectedNodeId && e.target === id) || 
      (e.target === selectedNodeId && e.source === id)
    );
  };

  const isNodeFaded = (id: string) => {
    if (!selectedNodeId && !focusMode) return false;
    if (selectedNodeId) {
      return !isNodeHighlighted(id); 
    }
    return false;
  };

  const isEdgeHighlighted = (e: EdgeType) => {
    if (!selectedNodeId) return false;
    return e.source === selectedNodeId || e.target === selectedNodeId;
  };

  const isEdgeFaded = (e: EdgeType) => {
    if (!selectedNodeId) return false;
    return !isEdgeHighlighted(e);
  };

  // Edge filtering based on density & exploration level
  const activeEdges = useMemo(() => {
    return hierarchy.visibleEdges.filter(e => {
      if (!e.sourceNode || !e.targetNode) return false;
      
      if (edgeDensity === 'LOW') {
        if (e.type !== 'CONTAINS') return false;
      } else if (edgeDensity === 'MEDIUM') {
        if (!['CONTAINS', 'DEFINES', 'IMPORTS'].includes(e.type)) return false;
      }

      return true;
    });
  }, [hierarchy.visibleEdges, edgeDensity]);

  return (
    <>
      <CameraController 
        selectedNode={selectedNode} 
        hierarchy={hierarchy}
        resetSignal={resetSignal} 
        focusSignal={focusSignal} 
        topViewSignal={topViewSignal}
      />
      
      <ambientLight intensity={0.9} />
      <directionalLight position={[60, 140, 60]} intensity={0.65} />

      {/* Grid Floor */}
      <gridHelper args={[600, 60, '#cbd5e1', '#f1f5f9']} position={[0, -5, -30]} />

      {/* Render 3D Cluster Boundaries */}
      {showBoundaries && hierarchy.clusterBoundaries.map(b => (
        <UniverseBoundary 
          key={`boundary-${b.nodeId}`} 
          boundary={b} 
          isFaded={isNodeFaded(b.nodeId)} 
        />
      ))}

      {/* Render Visible Nodes */}
      {hierarchy.visibleNodes.map(n => {
        const isSelected = selectedNodeId === n.id;
        const isHovered = hoveredNodeId === n.id;
        const isFaded = isNodeFaded(n.id);
        const isImpacted = impactNodeIds?.has(n.id) || false;

        // Label Priority System: Directories ALWAYS show, Files show when zoomed/hovered/selected
        const showLabel = showLabels && (
          isSelected || 
          isHovered || 
          (!isFaded && (
            n.level <= 1 || 
            (n.level === 2 && (cameraDistance < 120 || n.isExpanded)) || 
            (cameraDistance < 60)
          ))
        );

        return (
          <group 
            key={`node-group-${n.id}`}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHoveredNodeId(n.id);
            }}
            onPointerOut={() => setHoveredNodeId(null)}
          >
            <UniverseNodeMesh 
              node={n} 
              isSelected={isSelected} 
              isFaded={isFaded} 
              isImpacted={isImpacted}
              onSelect={(e) => {
                e.stopPropagation();
                onNodeSelect(n.id);
              }}
              onToggleExpand={() => onToggleExpand(n.id)}
            />

            {/* Crisp Collision-Free HTML Label */}
            {showLabel && (
              <Html 
                position={[n.position.x, n.position.y + n.scale * 1.35 + 0.6, n.position.z]} 
                center 
                zIndexRange={[100, 0]}
              >
                <div 
                  onClick={(e) => {
                    e.stopPropagation();
                    onNodeSelect(n.id);
                  }}
                  className={`px-2 py-0.5 text-[11px] font-mono whitespace-nowrap bg-white/95 backdrop-blur-xs border rounded-md shadow-xs cursor-pointer select-none transition-all ${
                    isSelected 
                      ? 'border-black text-black font-bold shadow-md ring-2 ring-black/10 scale-105 z-20' 
                      : isImpacted
                      ? 'border-amber-500 text-amber-900 font-semibold bg-amber-50'
                      : 'border-gray-200 text-gray-700 hover:border-gray-400 hover:text-black'
                  } ${isFaded ? 'opacity-20' : 'opacity-100'}`}
                >
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-[8px] uppercase font-bold px-1 py-0.2 rounded ${
                      n.type === 'Directory' ? 'bg-blue-50 text-blue-700' :
                      n.type === 'File' ? 'bg-indigo-50 text-indigo-700' :
                      n.type === 'Class' ? 'bg-emerald-50 text-emerald-700' :
                      n.type === 'Function' ? 'bg-purple-50 text-purple-700' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {n.type.substring(0, 3)}
                    </span>
                    <span className="truncate max-w-[170px]">{n.label}</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}

      {/* Render Visible Relationships */}
      {activeEdges.map(e => (
        <UniverseEdge 
          key={e.id} 
          edge={e} 
          sourceNode={e.sourceNode!} 
          targetNode={e.targetNode!} 
          isHighlighted={isEdgeHighlighted(e)}
          isFaded={isEdgeFaded(e)}
        />
      ))}
    </>
  );
}

export default function UniverseCanvas(props: Props) {
  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return;
      }

      if (e.key === 'Escape') {
        props.onNodeSelect(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [props]);

  return (
    <div className="w-full h-full bg-[#fafafa] relative select-none">
      <Canvas 
        camera={{ position: [0, 56, 75], fov: 48 }} 
        className="w-full h-full bg-[#fafafa]"
        onPointerMissed={() => props.onNodeSelect(null)}
      >
        <color attach="background" args={['#fafafa']} />
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
