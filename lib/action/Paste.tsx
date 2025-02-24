import { Node, Edge, XYPosition } from "@xyflow/react";
import { useFlowStore } from "../stores/useFlowStore";
import { Action } from "../types/Action";
import { GenerateId } from "@/util/generate-id";

export class Paste implements Action {
  private flowMousePosition: XYPosition;
  private newNodes: Node[];
  private newEdges: Edge[];

  constructor(flowMousePosition: XYPosition) {
    this.flowMousePosition = flowMousePosition;
    this.newNodes = [];
    this.newEdges = [];
  }

  execute(): void {
    console.log("Execute");
    const { nodeClipboard, edgeClipboard, addNodes, addEdges } =
      useFlowStore.getState();

    const idMap: Record<string, string> = {};
    const { x, y } = this.flowMousePosition;

    const [left, right, top, bottom] = [
      Math.min(...nodeClipboard.map((node) => node.position.x)),
      Math.max(...nodeClipboard.map((node) => node.position.x)),
      Math.min(...nodeClipboard.map((node) => node.position.y)),
      Math.max(...nodeClipboard.map((node) => node.position.y)),
    ];

    const xCenter = (left + right) / 2;
    const yCenter = (top + bottom) / 2;

    this.newNodes = nodeClipboard.map((node: Node) => {
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
    this.newEdges = edgeClipboard.map((edge) => ({
      ...edge,
      id: GenerateId(), // Generate a unique ID for the edge
      source: idMap[edge.source] || edge.source, // Map to new source ID
      target: idMap[edge.target] || edge.target, // Map to new target ID
    }));

    addNodes(this.newNodes);
    addEdges(this.newEdges);
  }

  undo(): void {
    const { removeNodes, removeEdges } = useFlowStore.getState();

    removeNodes(this.newNodes);
    removeEdges(this.newEdges);
  }
}
