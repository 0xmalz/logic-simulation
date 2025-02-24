"use client";

import {
  Background,
  Controls,
  Node,
  Edge,
  ReactFlow,
  useOnSelectionChange,
  useReactFlow,
  XYPosition,
} from "@xyflow/react";
import { useKeyPress } from "@/hooks/useKeyPress";
import ContextMenuWrapper from "./ContextMenuWrapper";
import { useFlowStore } from "@/lib/stores/useFlowStore";
import { useCallback, useState } from "react";
import LogicGateNode from "./nodes/LogicGateNode";
import SignalNode from "./nodes/SignalNode";
import { timeMachine } from "@/lib/TimeMachine";
import { MoveNode } from "@/lib/action/MoveNode";

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
  const { updateNode } = useReactFlow();

  const { nodes } = useFlowStore();

  const {
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    setSelectedNodes,
    setSelectedEdges,
  } = useFlowStore.getState();

  const nodeTypes = { signal: SignalNode, logicGate: LogicGateNode };

  const [isSpacePressed, setIsSpacePressed] = useState(false);

  const [nodeDragStartPositions, setNodeDragStartPositions] = useState<
    Map<string, XYPosition>
  >(new Map());

  // Use the custom hook to listen for the Space key
  useKeyPress(
    () => setIsSpacePressed(true), // onKeyDown
    () => setIsSpacePressed(false), // onKeyUp
    ["Space"] // Key codes to listen for
  );

  const onChange = useCallback(
    ({ nodes, edges }: { nodes: Node[]; edges: Edge[] }) => {
      setSelectedNodes(nodes);
      setSelectedEdges(edges);
    },
    [setSelectedNodes, setSelectedEdges]
  );

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      setSelectedNodes(nodes);
      setSelectedEdges(edges);
    },
  });

  useOnSelectionChange({
    onChange,
  });

  const handleNodeDragStart = (nodes: Node[]) => {
    setNodeDragStartPositions(
      new Map(nodes.map((node) => [node.id, node.position]))
    );
  };

  const handleNodeDragStop = (nodes: Node[]) => {
    const nodeIds = Array.from(nodeDragStartPositions.keys());
    const oldPositions = Array.from(nodeDragStartPositions.values());
    const newPositions = nodes.map((node) => node.position);

    const moveAction = new MoveNode(
      nodeIds,
      oldPositions,
      newPositions,
      updateNode
    );

    timeMachine.register(moveAction, false);

    setNodeDragStartPositions(new Map());
  };

  return (
    <ContextMenuWrapper>
      <ReactFlow
        colorMode={"dark"} // Fix dynamic theming
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
        onNodeDragStart={(_, __, nodes) => handleNodeDragStart(nodes)}
        onNodeDragStop={(_, __, nodes) => handleNodeDragStop(nodes)}
      >
        <Background gap={15} /> {/* Grid background */}
        <Controls /> {/* Zoom and pan controls */}
      </ReactFlow>
    </ContextMenuWrapper>
  );
}
