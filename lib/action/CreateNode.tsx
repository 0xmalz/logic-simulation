import { Node } from "@xyflow/react";
import { Action } from "../types/Action";
import { useFlowStore } from "../stores/useFlowStore";

export class CreateNode implements Action {
  private node: Node;

  constructor(node: Node) {
    this.node = node;
  }

  execute() {
    const { addNodes } = useFlowStore.getState();
    addNodes(this.node);
  }

  undo(): void {
    const { removeNodes } = useFlowStore.getState();
    removeNodes(this.node);
  }
}
