import { Node } from "@xyflow/react";
import { Action } from "../models/types/Action";
import { useFlowStore } from "../stores/useFlowStore";
import { Time } from "../models/enums/Time";

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

  details(time: Time): { name: string; description: string } {
    return {
      name: time === Time.Past ? "Created" : "Create",
      description: `node at x: ${this.node.position.x}, y: ${this.node.position.y}`,
    };
  }
}
