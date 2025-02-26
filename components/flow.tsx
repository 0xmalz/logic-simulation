"use client";

import {
  Background,
  Controls,
  Node,
  ReactFlow,
  useOnSelectionChange,
  useReactFlow,
  XYPosition,
} from "@xyflow/react";
import { useKeyPress } from "@/hooks/useKeyPress";
import ContextMenuWrapper from "./ContextMenuWrapper";
import { useFlowStore } from "@/lib/stores/useFlowStore";
import { useState } from "react";
import LogicGateNode from "./nodes/LogicGateNode";
import SignalNode from "./nodes/SignalNode";
import { MoveNode } from "@/lib/action/MoveNode";
import { useTimeMachineStore } from "@/lib/stores/useTimeMachineStore";
import { Delete } from "@/lib/action/Delete";

/**
 * Flow component that renders a React Flow diagram with custom nodes and edges.
 * Handles interactions like node movement, connection, and deletion, along with custom key events.
 *
 * @returns {JSX.Element} The rendered Flow component with a context menu for additional actions.
 */
export default function Flow() {
  // React Flow state and actions
  const { updateNode } = useReactFlow();
  const { register } = useTimeMachineStore();

  const { nodes } = useFlowStore();

  const {
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodes,
    setSelectedEdges,
  } = useFlowStore.getState();

  // Custom node types
  const nodeTypes = { signal: SignalNode, logicGate: LogicGateNode };

  // Local state management for key press and node drag positions
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [nodeDragStartPositions, setNodeDragStartPositions] = useState<
    Map<string, XYPosition>
  >(new Map());

  // Custom hook to listen for Spacebar key press
  useKeyPress(
    () => setIsSpacePressed(true), // onKeyDown handler
    () => setIsSpacePressed(false), // onKeyUp handler
    ["Space"] // Spacebar key
  );

  // Update selected nodes and edges on selection change
  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes);
      setSelectedEdges(edges);
    },
  });

  /**
   * Handle the start of node dragging. Records the initial positions of nodes.
   *
   * @param {Node[]} nodes - The nodes being dragged.
   */
  function handleNodeDragStart(nodes: Node[]) {
    setNodeDragStartPositions(
      new Map(nodes.map((node) => [node.id, node.position]))
    );
  }

  /**
   * Handle the end of node dragging. Registers the movement action and updates the node positions.
   *
   * @param {Node[]} nodes - The nodes after being dragged.
   */
  function handleNodeDragStop(nodes: Node[]) {
    const nodeIds = Array.from(nodeDragStartPositions.keys());
    const oldPositions = Array.from(nodeDragStartPositions.values());
    const newPositions = nodes.map((node) => node.position);

    const moveAction = new MoveNode(
      nodeIds,
      oldPositions,
      newPositions,
      updateNode
    );

    register(moveAction, false);
    setNodeDragStartPositions(new Map());
  }

  /**
   * Handle right-click on a node, setting the selected node for actions.
   *
   * @param {any} _ - The event object (not used).
   * @param {Node} node - The node that was right-clicked.
   */
  function onNodeContextMenu(_: any, node: Node) {
    setSelectedNodes([node]);
  }

  /**
   * Handle node deletion. Registers the delete action.
   *
   * @param {Node[]} nodes - The nodes to be deleted.
   */
  function handleNodesDelete(nodes: Node[]): void {
    register(new Delete(nodes));
  }

  return (
    <ContextMenuWrapper>
      <ReactFlow
        colorMode={"dark"} // Enable dark mode theming
        nodes={nodes}
        edges={edges}
        onNodesDelete={handleNodesDelete}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        selectionKeyCode={null} // Disable selection by key
        selectionOnDrag
        onNodeContextMenu={onNodeContextMenu}
        panOnDrag={isSpacePressed} // Allow panning when spacebar is pressed
        onConnect={onConnect}
        nodeTypes={nodeTypes} // Custom node types (SignalNode, LogicGateNode)
        snapToGrid // Enable grid snapping
        snapGrid={[1, 1]} // Define grid size
        fitView // Automatically adjust the view to fit the nodes and edges
        onNodeDragStart={(_, __, nodes) => handleNodeDragStart(nodes)} // Start drag handler
        onNodeDragStop={(_, __, nodes) => handleNodeDragStop(nodes)} // Stop drag handler
      >
        <Background gap={15} /> {/* Grid background with 15px gap */}
        <Controls /> {/* Display zoom and pan controls */}
      </ReactFlow>
    </ContextMenuWrapper>
  );
}
