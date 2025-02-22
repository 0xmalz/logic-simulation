"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  ColorMode,
  Connection,
  Controls,
  Node,
  Edge,
  Node,
  ReactFlow,
  useOnSelectionChange,
} from "@xyflow/react";
import { useKeyPress } from "@/hooks/useKeyPress";

import ContextMenuWrapper from "./context-menu-wrapper";
import { useFlowSelector } from "@/lib/store/flow-state";
import { useCallback, useState } from "react";
import LogicGateNode from "./nodes/logic-gate-node";
import SignalNode from "./nodes/signal-node";

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
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodes,
    setSelectedEdges,
  } = useFlowSelector();

  const nodeTypes = { signal: SignalNode, logicGate: LogicGateNode };

  const [isSpacePressed, setIsSpacePressed] = useState(false);

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
