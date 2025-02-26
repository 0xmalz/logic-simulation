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
import { useFlowStore } from "@/lib/stores/useFlowStore";
import useFlowMousePosition from "@/hooks/useFlowMousePosition";
import { Node } from "@xyflow/react";
import { generateUniqueId } from "@/util/generate-id";
import { SignalVariant } from "./nodes/SignalNode";
import { CreateNode } from "@/lib/actions/CreateNodeAction";
import { Cut } from "@/lib/actions/CutAction";
import { Paste } from "@/lib/actions/PasteAction";
import { useTimeMachineStore } from "@/lib/stores/useTimeMachineStore";
import { Delete } from "@/lib/actions/DeleteAction";
import {
  Undo,
  Redo,
  Trash2,
  ClipboardPaste,
  Scissors,
  ClipboardCopy,
} from "lucide-react";

/**
 * A wrapper component that provides a context menu for interacting with nodes in the flow diagram.
 * The menu offers options to create new nodes (logic gates and signals), perform copy-paste operations,
 * and undo/redo actions, as well as delete selected nodes.
 *
 * @param {ReactNode} children - The child elements that will trigger the context menu when right-clicked.
 *
 * @returns A context menu that provides node management actions and additional shortcuts.
 */
export default function ContextMenuWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const { register, redo, undo } = useTimeMachineStore();

  const {
    selectedNodes,
    selectedEdges,
    nodeClipboard,
    setNodeClipboard,
    setEdgeClipboard,
  } = useFlowStore.getState();

  const flowMousePosition = useFlowMousePosition();

  /**
   * Handle creation of a new logic gate node (AND, OR, NOT) at the current mouse position.
   *
   * @param {string} type - The type of logic gate ("AND", "NOT", "OR").
   */
  function handleNewGate(type: string) {
    let node: Node | null = null;

    switch (type) {
      case "AND":
        node = createLogicGateNode("AND", 2, 1, "blue");
        break;
      case "NOT":
        node = createLogicGateNode("NOT", 1, 1, "red");
        break;
      case "OR":
        node = createLogicGateNode("OR", 2, 1, "green");
        break;
      default:
        return;
    }

    if (node) {
      const createNodeAction = new CreateNode(node);
      register(createNodeAction);
    }
  }

  /**
   * Helper function to create a logic gate node with specific properties.
   *
   * @param {string} label - The label of the logic gate.
   * @param {number} input - The number of inputs for the logic gate.
   * @param {number} output - The number of outputs for the logic gate.
   * @param {string} color - The color variant of the gate.
   * @returns {Node} The created logic gate node.
   */
  function createLogicGateNode(
    label: string,
    input: number,
    output: number,
    color: string
  ): Node {
    const { x, y } = flowMousePosition;
    return {
      id: generateUniqueId(),
      type: "logicGate",
      data: {
        label: label,
        input: input,
        output: output,
        variants: { color: color },
      },
      position: { x, y },
      origin: [0.5, 0.5],
    };
  }

  /**
   * Handle the creation of a new signal node at the current mouse position.
   *
   * @param {SignalVariant} variant - The variant of the signal node (e.g., A, B).
   */
  function handleNewSignal(variant: SignalVariant) {
    const { x, y } = flowMousePosition;

    const node: Node = {
      id: generateUniqueId(),
      type: "signal",
      data: { label: "A", variant: variant },
      position: { x, y },
      origin: [0.5, 0.5],
    };

    const createNodeAction = new CreateNode(node);
    register(createNodeAction);
  }

  /**
   * Handle cutting of the selected nodes and edges.
   * Registers the Cut action if nodes are selected.
   */
  function handleCut() {
    if (selectedNodes.length > 0) {
      register(new Cut());
    }
  }

  /**
   * Handle copying of the selected nodes and edges to the clipboard.
   */
  function handleCopy() {
    setNodeClipboard(selectedNodes);
    setEdgeClipboard(selectedEdges);
  }

  /**
   * Handle pasting of nodes and edges from the clipboard to the current mouse position.
   * Registers the Paste action if nodes are in the clipboard.
   */
  function handlePaste() {
    if (nodeClipboard.length > 0) {
      const pasteAction = new Paste(flowMousePosition);
      register(pasteAction);
    }
  }

  /**
   * Handle deletion of the selected nodes and edges.
   * Registers the Delete action if nodes are selected.
   */
  function handleDelete() {
    if (selectedNodes.length > 0) {
      register(new Delete());
    }
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
          <Scissors className="mr-2 h-4 w-4" />
          Cut
          <ContextMenuShortcut>⌘X</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handleCopy()}>
          <ClipboardCopy className="mr-2 h-4 w-4" />
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => handlePaste()}>
          <ClipboardPaste className="mr-2 h-4 w-4" />
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={() => undo()}>
          <Undo className="mr-2 h-4 w-4" />
          Undo
          <ContextMenuShortcut>⌘Z</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={() => redo()}>
          <Redo className="mr-2 h-4 w-4" />
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
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
