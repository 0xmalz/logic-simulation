import { Node, Edge } from "@xyflow/react";
import { Time } from "../models/enums/Time";
import { Action } from "../models/types/Action";
import { useFlowStore } from "../stores/useFlowStore";

export class Delete implements Action {
  private nodes: Node[];
  private edges: Edge[];

  constructor(nodes?: Node[]) {
    if (nodes) {
      // Case 1: Nodes are provided directly
      this.nodes = nodes;
      this.edges = [];
    } else {
      // Case 2: Nodes and edges are fetched from the store
      const { selectedNodes, selectedEdges } = useFlowStore.getState();
      this.nodes = selectedNodes;
      this.edges = selectedEdges;
    }
  }

  execute(): void {
    const { removeNodes, removeEdges } = useFlowStore.getState();

    removeNodes(this.nodes);
    removeEdges(this.edges);
  }

  undo(): void {
    const { addNodes, addEdges } = useFlowStore.getState();

    addNodes(this.nodes);
    addEdges(this.edges);
  }

  details(time: Time): { name: string; description: string } {
    const nodeCount = this.nodes.length;
    const edgeCount = this.edges.length;

    let nodeText;
    if (nodeCount === 1) {
      // If there's only one node, show its position
      nodeText = `node at x: ${this.nodes[0].position.x}, y: ${this.nodes[0].position.y}`;
    } else {
      // Otherwise, show the count
      nodeText = `${nodeCount} nodes`;
    }

    const edgeText =
      edgeCount > 0
        ? ` and ${edgeCount} edge${edgeCount !== 1 ? "s" : ""}`
        : "";

    return {
      name: time === Time.Past ? "Deleted" : "Delete",
      description: `${nodeText}${edgeText}`,
    };
  }
}
