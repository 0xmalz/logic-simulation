"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  Controls,
  Background,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import LogicGateNode from "./components/nodes/logic-gate-node";
import SignalNode from "./components/nodes/signal-node";

// Initial nodes for the flow diagram
const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "logicGate",
    position: { x: 0, y: 0 },
    data: {
      label: "AND", // Gate label
      input: 5, // Number of input handles
      output: 2, // Number of output handles
    },
  },
  {
    id: "node-2",
    type: "signal",
    position: { x: 100, y: 100 },
    data: {
      label: "A",
      variant: "output",
    },
  },

  {
    id: "node-3",
    type: "signal",
    position: { x: 100, y: 100 },
    data: {
      label: "A",
      variant: "input",
    },
  },
];

/**
 * Main App component that renders the ReactFlow diagram.
 * @returns {JSX.Element} - The rendered ReactFlow diagram.
 */
export default function App() {
  const mousePosition = useMousePosition();
  const flowMousePosition = useFlowMousePosition();

  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [shiftPressed, setShiftPressed] = useState<boolean>(false);

  // Use the hook to detect Shift key press and release
  useKeyPress(
    () => setShiftPressed(true), // Called when Shift is pressed
    () => setShiftPressed(false), // Called when Shift is released
    ["ShiftLeft", "ShiftRight"] // Key codes for both Shift keys
  );

  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Register custom node types (e.g., logicGate)
  const nodeTypes = useMemo(
    () => ({ logicGate: LogicGateNode, signal: SignalNode }),
    []
  );

  // Handler for node changes
  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Handler for edge changes
  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  // Handler for creating new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes} // Pass custom node types
        snapToGrid
        snapGrid={[10, 10]} // Grid size for snapping
        fitView // Automatically fit the diagram to the viewport
      >
        <Background /> {/* Grid background */}
        <Controls /> {/* Zoom and pan controls */}
      </ReactFlow>
    </div>
  );
}
