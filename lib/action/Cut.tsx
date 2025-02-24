import { Node, Edge } from "@xyflow/react";
import { useFlowStore } from "../stores/useFlowStore";
import { Action } from "../types/Action";

export class Cut implements Action {
  private selectedNodes: Node[];
  private selectedEdges: Edge[];

  constructor() {
    const { selectedNodes, selectedEdges } = useFlowStore.getState();

    this.selectedNodes = selectedNodes;
    this.selectedEdges = selectedEdges;
  }

  execute(): void {
    console.log("Execute Cut");
    const { setNodeClipboard, setEdgeClipboard, removeNodes, removeEdges } =
      useFlowStore.getState();

    setNodeClipboard(this.selectedNodes);
    setEdgeClipboard(this.selectedEdges);

    removeNodes(this.selectedNodes);
    removeEdges(this.selectedEdges);
  }

  undo(): void {
    const { addNodes, addEdges } = useFlowStore.getState();

    addNodes(this.selectedNodes);
    addEdges(this.selectedEdges);
  }
}
