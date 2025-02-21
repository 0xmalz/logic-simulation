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
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import LogicGateNode from "./components/nodes/logic-gate-node";
import SignalNode from "./components/nodes/signal-node";

// Initial nodes for the flow diagram
const initialNodes = [
  {
    id: "node-1",
    type: "logicGate",
    position: { x: 0, y: 0 },
    data: {
      input: 5, // Number of input handles
      output: 2, // Number of output handles
    },
    text: "Title",
  },
];

// Initial edgesfor the flow diagram
const initialEdges = [
  { id: "edge-1", source: "node-1", sourceHandle: "a", target: "node-2" },
  { id: "edge-2", source: "node-1", sourceHandle: "b", target: "node-3" },
];

/**
 * Main App component that renders the ReactFlow diagram.
 * @returns {JSX.Element} - The rendered ReactFlow diagram.
 */
export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

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
