# CodeGraph — 3D Codebase Universe Architecture

## 1. Core Principles
The CodeGraph 3D Universe (`/repositories/[id]/universe`) translates standard graph relationships into an interactive spatial environment. It strictly uses the unmodified `GraphDTO` from the backend, parsing flat nodes and edges into a deterministic hierarchical layout completely on the client.

The visual aesthetic strictly adheres to the monochrome design language. It is designed to be architectural and professional, explicitly avoiding gaming mechanics or cyber-punk aesthetics.

## 2. Spatial Hierarchy & Layout Algorithm
We explicitly avoided force-directed physics simulators due to their unpredictability and high CPU overhead on large graphs. Instead, we use a **Deterministic Hierarchical Grid Layout** computed on the XZ-plane.

1. **Hierarchy Building**: The `buildUniverseHierarchy` adapter scans `CONTAINS` and `DEFINES` edges to construct an in-memory tree (`Repository -> Directory -> File -> Symbol`).
2. **Bottom-Up Sizing**: The `computeSizes` algorithm calculates bounding boxes starting from leaf symbols. A file's size is the minimum bounding square required to pack its internal symbols. A directory's size is the bounding box of its files and subdirectories.
3. **Top-Down Positioning**: The `computePositions` algorithm starts at root `(0, 0, 0)` and recursively packs children into a grid. 
4. **Elevation**: The Y-axis represents physical hierarchy. Directories lie flat (`Y=0`). Files are elevated slabs (`Y=0.1`). Symbols rest on top of files (`Y=0.5`).
5. **External Zone**: `ExternalPackage` nodes are positioned in a distinct "Orbiting Ring" or offset region adjacent to the main repository grid.

## 3. Render Loop & Performance (LOD)
The scene is rendered using `@react-three/fiber` and `@react-three/drei`. Performance is maintained through several strategies:

- **Level of Detail (LOD)**: The `UniverseCanvas` tracks camera distance. At far distances (`cameraDistance > 200`), deep symbols (Methods, Variables) are culled from the React render tree entirely unless explicitly highlighted.
- **Progressive Drilling**: The `UniverseToolbar` provides "Exploration Levels" (`Architecture`, `File`, `Symbol`). Lower levels actively filter out smaller AST nodes to reduce geometry counts.
- **HTML Overlays**: Node labels use Drei's `<Html>` component. To prevent excessive DOM node creation, labels are strictly gated by distance and selection state.

## 4. UI Architecture & Navigation
- **State URL Synchronization**: Selecting a node updates the URL (`?node=node_id`). This preserves identity across browser reloads and enables direct 2D ↔ 3D toggling (the `View in 3D` button preserves the `node_id`).
- **Focus Mode**: Instead of deleting unrelated nodes, `Focus Mode` drastically fades unselected subgraphs, highlighting the selected node and its 1-hop neighborhood.
- **Edge Density**: Edges (`UniverseEdge`) use `THREE.QuadraticBezierCurve3`. They are filtered by modes: `STRUCTURAL` (Contains/Defines), `DEPENDENCIES` (Imports), `EXECUTION` (Calls/Inherits).

## 5. AI Integration
The 3D HUD injects the `AIAssistant` sidebar. The selected 3D node's ID is passed as context. When a user queries "Explain this function", the AI engine runs the same Hybrid Retrieval pipeline (Milestone 4) and returns a grounded response with source citations. 

## 6. Known Limitations
- **Dagre vs Grid**: The 2D React Flow canvas uses Dagre (layered directed acyclic layout) which is good for flow. The 3D layout uses hierarchical grid packing, which is excellent for structural containment but less ideal for visualizing strict execution pipelines.
- **Client Processing Limits**: Very large mono-repos (>10,000 files) will still struggle with the current React Three Fiber un-instanced mesh approach. Future iterations for massive scale would require replacing `<mesh>` components with `THREE.InstancedMesh`.
- **Runtime Verification**: E2E WebGL performance testing could not be executed due to the lack of a browser environment in the current sandbox.
