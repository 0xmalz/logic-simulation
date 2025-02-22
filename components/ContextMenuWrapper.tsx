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
} from "./ui/ContextMenu";
import { useFlowSelector } from "@/lib/store/flow-state";
import useFlowMousePosition from "@/hooks/useFlowMousePosition";
import { Edge, Node } from "@xyflow/react";
import { GenerateId } from "@/util/generate-id";
import { SignalVariant } from "./nodes/SignalNode";
import { Trash2 } from "lucide-react";

export default function ContextMenuWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const {
    addNodes,
    addEdges,
    removeNodes,
    removeEdges,
    selectedNodes,
    selectedEdges,
    setNodeClipboard,
    setEdgeClipboard,
    nodeClipboard,
    edgeClipboard,
  } = useFlowSelector();

  const { x, y } = useFlowMousePosition();

  function handleNewGate(type: string) {
    console.log("Create AND");

    if (type === "AND") {
      addNodes({
        id: GenerateId(),
        type: "logicGate",
        data: {
          label: "AND",
          input: 2,
          output: 1,
          variants: {
            color: "blue",
          },
        },
        position: { x: x, y: y },
        origin: [0.5, 0.5],
      });
    } else if (type === "NOT") {
      addNodes({
        id: GenerateId(),
        type: "logicGate",
        data: {
          label: "NOT",
          input: 1,
          output: 1,
          variants: {
            color: "red",
          },
        },
        position: { x: x, y: y },
        origin: [0.5, 0.5],
      });
    } else if (type === "OR") {
      addNodes({
        id: GenerateId(),
        type: "logicGate",
        data: {
          label: "OR",
          input: 2,
          output: 1,
          variants: {
            color: "green",
          },
        },
        position: { x: x, y: y },
        origin: [0.5, 0.5],
      });
    }
  }

  function handleNewSignal(variant: SignalVariant) {
    addNodes({
      id: GenerateId(),
      type: "signal",
      data: {
        label: "A",
        variant: variant,
      },
      position: { x: x, y: y },
      origin: [0.5, 0.5],
    });
  }

  function handleCut() {
    setNodeClipboard(selectedNodes);
    setEdgeClipboard(selectedEdges);

    removeNodes(selectedNodes);
    removeEdges(selectedEdges);
  }

  function handleCopy() {
    setNodeClipboard(selectedNodes);
    setEdgeClipboard(selectedEdges);
  }

  function handlePaste() {
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

  function handleDelete() {
    removeNodes(selectedNodes);
    removeEdges(selectedEdges);
  }

  return (
    <ContextMenu>
      {/* Trigger area */}
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>

      {/* Context menu content */}
      <ContextMenuContent className="w-[200px]">
        {/* Submenu for "New Signal" */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>New Signal</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleNewSignal("input")}>
              Input
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNewSignal("output")}>
              Output
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Submenu for "New Gate" */}
        <ContextMenuSub>
          <ContextMenuSubTrigger>New Gate</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleNewGate("AND")}>
              AND
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNewGate("NOT")}>
              NOT
            </ContextMenuItem>

            <ContextMenuItem onClick={() => handleNewGate("OR")}>
              OR
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        {/* Separator */}
        <ContextMenuSeparator />

        {/* Regular menu items */}
        <ContextMenuItem onClick={() => handleCut()}>
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handleCopy()}>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handlePaste()}>
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

        {/* Separator */}
        <ContextMenuSeparator />

        {/* Delete */}
        <ContextMenuItem
          onClick={() => handleDelete()}
          className="text-red-500"
        >
          <Trash2 className="mr-2 h-4 w-4" /> {/* Icon */}
          Delete
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
