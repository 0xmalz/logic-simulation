import { Node, Edge, XYPosition } from "@xyflow/react";
import { useFlowStore } from "../stores/useFlowStore";
import { Action } from "../models/interfaces/Action";
import { generateUniqueId } from "@/util/generate-id";
import { Time } from "../models/enums/Time";

/**
 * Action that handles pasting nodes and edges from the clipboard at a specified position.
 */
export class Paste implements Action {
  private flowMousePosition: XYPosition;
  private newNodes: Node[];
  private newEdges: Edge[];

  /**
   * Creates an instance of the Paste action, initializing the clipboard data for nodes and edges.
   *
   * @param {XYPosition} flowMousePosition - The position at which to paste the nodes and edges.
   */
  constructor(flowMousePosition: XYPosition) {
    this.flowMousePosition = flowMousePosition;
    this.newNodes = [];
    this.newEdges = [];
  }

  /**
   * Executes the paste action by copying nodes and edges from the clipboard, assigning new IDs,
   * and positioning them relative to the current mouse position.
   */
  execute(): void {
    const { nodeClipboard, edgeClipboard, addNodes, addEdges } =
      useFlowStore.getState();

    const idMap: Record<string, string> = {};
    const { x, y } = this.flowMousePosition;

    // Calculate the bounding box of the selected nodes to center them relative to the paste position
    const [left, right, top, bottom] = [
      Math.min(...nodeClipboard.map((node) => node.position.x)),
      Math.max(...nodeClipboard.map((node) => node.position.x)),
      Math.min(...nodeClipboard.map((node) => node.position.y)),
      Math.max(...nodeClipboard.map((node) => node.position.y)),
    ];

    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    // Create new nodes with updated IDs and positions
    this.newNodes = nodeClipboard.map((node: Node) => {
      const newNodeId = generateUniqueId();
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
    this.newEdges = edgeClipboard.map((edge) => ({
      ...edge,
      // TODO: improve id generation
      id: generateUniqueId(), // Generate a unique ID for the edge
      source: idMap[edge.source] || edge.source, // Map to new source ID
      target: idMap[edge.target] || edge.target, // Map to new target ID
    }));

    addNodes(this.newNodes);
    addEdges(this.newEdges);
  }

  /**
   * Undoes the paste action by removing the newly added nodes and edges.
   */
  undo(): void {
    const { removeNodes, removeEdges } = useFlowStore.getState();

    removeNodes(this.newNodes);
    removeEdges(this.newEdges);
  }

  /**
   * Provides details about the paste action, including the number of nodes and edges pasted,
   * or specific details for a single node.
   *
   * @param {Time} time - The time context (e.g., Time.Past or Time.Future) to influence the action name.
   * @returns {Object} An object containing the name and description of the paste action.
   */
  details(time: Time): { name: string; description: string } {
    const nodeCount = this.newNodes.length;
    const edgeCount = this.newEdges.length;

    let nodeText;
    if (nodeCount === 1) {
      // If there's only one node, show its position
      nodeText = `node at x: ${this.newNodes[0].position.x}, y: ${this.newNodes[0].position.y}`;
    } else {
      // Otherwise, show the count
      nodeText = `${nodeCount} nodes`;
    }

    const edgeText =
      edgeCount > 0
        ? ` and ${edgeCount} edge${edgeCount !== 1 ? "s" : ""}`
        : "";

    return {
      name: time === Time.Past ? "Pasted" : "Paste",
      description: `${nodeText}${edgeText}`,
    };
  }
}
