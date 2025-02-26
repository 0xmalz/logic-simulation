import { Node, Edge } from "@xyflow/react";
import { useFlowStore } from "../stores/useFlowStore";
import { Action } from "../models/types/Action";
import { Time } from "../models/enums/Time";

export class Cut implements Action {
  private selectedNodes: Node[];
  private selectedEdges: Edge[];

  constructor() {
    const { selectedNodes, selectedEdges } = useFlowStore.getState();

    this.selectedNodes = selectedNodes;
    this.selectedEdges = selectedEdges;
  }

  execute(): void {
    const { setNodeClipboard, setEdgeClipboard, removeNodes, removeEdges } =
      useFlowStore.getState();

    console.log(this.selectedNodes);
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

  details(time: Time): { name: string; description: string } {
    const nodeCount = this.selectedNodes.length;
    const edgeCount = this.selectedEdges.length;

    const nodeText = `${nodeCount} node${nodeCount !== 1 ? "s" : ""}`;
    const edgeText =
      edgeCount > 0 ? `and ${edgeCount} edge${edgeCount !== 1 ? "s" : ""}` : "";

    const action = time === Time.Past ? "deleted" : "delete";

    return {
      name: "Cut",
      description: `${action} ${nodeText} ${edgeText}`.trim(),
    };
  }
}
