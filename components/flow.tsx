"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ColorMode,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useMemo, useState } from "react";
import LogicGateNode from "./nodes/logic-gate-node";
import SignalNode from "./nodes/signal-node";
import { useKeyPress } from "@/hooks/useKeyPress";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "./ui/context-menu";
import { useTheme } from "next-themes";

// Initial nodes for the flow diagram
const initialNodes: Node[] = [
  {
    id: "node-1",
    type: "logicGate",
    position: { x: 0, y: 0 },
    data: {
      label: "AND", // Gate label
      input: 3, // Number of input handles
      output: 1, // Number of output handles
    },
  },
  {
    id: "node-2",
    type: "signal",
    position: { x: 0, y: 0 },
    data: {
      label: "A",
      variant: "output",
      state: "on",
    },
  },

  {
    id: "node-3",
    type: "signal",
    position: { x: 0, y: 0 },
    data: {
      label: "A",
      variant: "input",
      state: "off",
    },
  },
];

function getColorMode(theme: string | undefined): ColorMode {
  if (theme === "light" || theme === "dark") {
    return theme; // Return valid ColorModeClass
  }
  return "system"; // Default to 'system'
}

/**
 * Flow component that renders a React Flow diagram with customizable nodes and edges.
 *
 * This component manages the state of nodes and edges, handling user interactions such as
 * adding connections between nodes and customizing the diagram's appearance. It also
 * listens for the Space key press to enable panning of the diagram when the space bar is held down.
 *
 * @returns {JSX.Element} The rendered Flow component with a context menu for additional actions.
 */
export default function Flow() {
  const { theme } = useTheme();
  const [isSpacePressed, setIsSpacePressed] = useState(false);

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

  // Use the custom hook to listen for the Space key
  useKeyPress(
    () => setIsSpacePressed(true), // onKeyDown
    () => setIsSpacePressed(false), // onKeyUp
    ["Space"] // Key codes to listen for
  );

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <ReactFlow
          colorMode={getColorMode(theme)}
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          selectionKeyCode={null}
          selectionOnDrag
          panOnDrag={isSpacePressed}
          onConnect={onConnect}
          nodeTypes={nodeTypes} // Pass custom node types
          snapToGrid // Enable snap to grid
          snapGrid={[1, 1]} // Grid size for snapping
          fitView // Automatically fit the diagram to the viewport
        >
          <Background gap={15} /> {/* Grid background */}
          <Controls /> {/* Zoom and pan controls */}
        </ReactFlow>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem>Profile</ContextMenuItem>
        <ContextMenuItem>Billing</ContextMenuItem>
        <ContextMenuItem>Team</ContextMenuItem>
        <ContextMenuItem>Subscription</ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
