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
import LogicGateNodeA from "./components/nodes/logic-gate-node-1";
import LogicGateNodeB from "./components/nodes/logic-gate-node-2";

const initialEdges = [
  { id: "edge-1", source: "node-1", sourceHandle: "a", target: "node-2" },
  { id: "edge-2", source: "node-1", sourceHandle: "b", target: "node-3" },
];

const initialNodes = [
  {
    id: "node-1",
    type: "logicGate",
    position: { x: 0, y: 0 },
    data: { input: 3, output: 2 },
    text: "Title",
  },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(
    () => ({
      logicGate: LogicGateNode,
      logicGateA: LogicGateNodeA,
      logicGateB: LogicGateNodeB,
    }),
    []
  );

  const onNodesChange = useCallback(
    (changes: any) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: any) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

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
        nodeTypes={nodeTypes}
        snapToGrid
        snapGrid={[10, 10]}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
