import React, { ReactNode } from "react";
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSub,
  ContextMenuShortcut,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
  ContextMenuSeparator,
} from "./ui/context-menu";
import { useFlowSelector } from "@/lib/store/flow-state";
import useFlowMousePosition from "@/hooks/useFlowMousePosition";
import { Edge, Node } from "@xyflow/react";
import { GenerateId } from "@/util/generate-id";

export default function ContextMenuWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const {
    addNodes,
    addEdges,
    selectedNodes,
    selectedEdges,
    setNodeClipboard,
    setEdgeClipboard,
    nodeClipboard,
    edgeClipboard,
  } = useFlowSelector();

  const { x, y } = useFlowMousePosition();

  function handleAddNode() {
    addNodes({
      id: GenerateId(),
      type: "logicGate",
      data: { label: "And", input: 2, output: 1 },
      position: { x: x, y: y },
      origin: [0.5, 0.5],
    });
  }

  function handleCopyClipboard() {
    console.log("Copy:");
    console.log(selectedNodes);
    setNodeClipboard(selectedNodes);
    setEdgeClipboard(selectedEdges);
  }

  function handlePasteClipboard() {
    console.log("Paste:");

    const idMap: Record<string, string> = {};

    const [left, right, top, bottom] = [
      Math.min(...nodeClipboard.map((node) => node.position.x)),
      Math.max(...nodeClipboard.map((node) => node.position.x)),
      Math.min(...nodeClipboard.map((node) => node.position.y)),
      Math.max(...nodeClipboard.map((node) => node.position.y)),
    ];

    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    const newNodes: Node[] = nodeClipboard.map((node: Node) => {
      const newNodeId = GenerateId();
      idMap[node.id] = newNodeId; // Map the old ID to the new ID

      return {
        ...node,
        id: newNodeId,
        position: {
          x: x + (node.position.x - xCenter), // Normalize to origin and add mouse x
          y: y + (node.position.y - yCenter), // Normalize to origin and add mouse y
        },
        origin: [0.5, 0.5],
      };
    });

    // Create new edges using the ID mapping
    const newEdges: Edge[] = edgeClipboard.map((edge) => ({
      ...edge,
      id: GenerateId(), // Generate a unique ID for the edge
      source: idMap[edge.source] || edge.source, // Map to new source ID
      target: idMap[edge.target] || edge.target, // Map to new target ID
    }));

    addNodes(newNodes);
    addEdges(newEdges);
  }

  return (
    <ContextMenu>
      {/* Trigger area */}
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      {/* Context menu content */}
      <ContextMenuContent>
        {/* Submenu for "New Gate" */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>New Gate</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleAddNode()}>
              AND
            </ContextMenuItem>
            <ContextMenuItem>NOT</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Separator */}
        <ContextMenuSeparator />

        {/* Regular menu items */}
        <ContextMenuItem>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handleCopyClipboard()}>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handlePasteClipboard()}>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem>
          Undo
          <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          Redo
          <ContextMenuShortcut>⇧⌘Z</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
