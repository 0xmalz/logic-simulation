import { Node, Edge } from "@xyflow/react";
import { Time } from "../models/enums/Time";
import { Action } from "../models/interfaces/Action";
import { useFlowStore } from "../stores/useFlowStore";

/**
 * Action that deletes selected nodes and edges from the flow.
 * It supports undoing the deletion by restoring the nodes and edges to the flow.
 */
export class Delete implements Action {
  private nodes: Node[];
  private edges: Edge[];

  /**
   * Creates an instance of the Delete action. It either takes a list of nodes as input or fetches the
   * currently selected nodes and edges from the flow store.
   *
   * @param {Node[]} [nodes] - An optional array of nodes to be deleted.
   */
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

  /**
   * Executes the action of deleting the specified nodes and edges by removing them from the flow state.
   */
  execute(): void {
    const { removeNodes, removeEdges } = useFlowStore.getState();

    removeNodes(this.nodes);
    removeEdges(this.edges);
  }

  /**
   * Undoes the delete action by adding the previously deleted nodes and edges back to the flow state.
   */
  undo(): void {
    const { addNodes, addEdges } = useFlowStore.getState();

    addNodes(this.nodes);
    addEdges(this.edges);
  }

  /**
   * Provides details of the delete action, including the number of nodes and edges involved,
   * with a description based on the time context (e.g., past or future).
   *
   * @param {Time} time - The time context (e.g., Time.Past or Time.Future) to influence the action name.
   * @returns {Object} An object containing the name and description of the delete action.
   */
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
