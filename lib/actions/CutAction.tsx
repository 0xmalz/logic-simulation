import { Node, Edge } from "@xyflow/react";
import { useFlowStore } from "../stores/useFlowStore";
import { Action } from "../models/interfaces/Action";
import { Time } from "../models/enums/Time";

/**
 * Action that handles cutting selected nodes and edges from the flow.
 */
export class Cut implements Action {
  private selectedNodes: Node[];
  private selectedEdges: Edge[];

  /**
   * Creates an instance of the Cut action by retrieving the currently selected nodes and edges
   * from the flow store.
   */
  constructor() {
    const { selectedNodes, selectedEdges } = useFlowStore.getState();
    this.selectedNodes = selectedNodes;
    this.selectedEdges = selectedEdges;
  }

  /**
   * Executes the action of cutting by storing the selected nodes and edges in the clipboard
   * and removing them from the flow state.
   */
  execute(): void {
    const { setNodeClipboard, setEdgeClipboard, removeNodes, removeEdges } =
      useFlowStore.getState();

    setNodeClipboard(this.selectedNodes);
    setEdgeClipboard(this.selectedEdges);

    removeNodes(this.selectedNodes);
    removeEdges(this.selectedEdges);
  }

  /**
   * Undoes the cut action by restoring the previously cut nodes and edges back to the flow.
   */
  undo(): void {
    const { addNodes, addEdges } = useFlowStore.getState();

    addNodes(this.selectedNodes);
    addEdges(this.selectedEdges);
  }

  /**
   * Provides details of the cut action, including the number of nodes and edges involved,
   * with a description based on the time context (e.g., past or future).
   *
   * @returns {Object} An object containing the name and description of the cut action.
   */
  details(): { name: string; description: string } {
    const nodeCount = this.selectedNodes.length;
    const edgeCount = this.selectedEdges.length;

    const nodeText = `${nodeCount} node${nodeCount !== 1 ? "s" : ""}`;
    const edgeText =
      edgeCount > 0 ? `and ${edgeCount} edge${edgeCount !== 1 ? "s" : ""}` : "";

    return {
      name: "Cut",
      description: `${nodeText} ${edgeText}`.trim(),
    };
  }
}
