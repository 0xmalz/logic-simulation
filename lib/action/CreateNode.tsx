import { Node } from "@xyflow/react";
import { Action } from "../models/types/Action";
import { useFlowStore } from "../stores/useFlowStore";
import { Time } from "../models/enums/Time";

/**
 * Action that creates a new node in the flow and allows undoing the creation.
 */
export class CreateNode implements Action {
  private node: Node;

  /**
   * Creates an instance of CreateNode with the specified node.
   *
   * @param {Node} node - The node to be created in the flow.
   */
  constructor(node: Node) {
    this.node = node;
  }

  /**
   * Executes the action of creating the node by adding it to the flow store.
   */
  execute() {
    const { addNodes } = useFlowStore.getState();
    addNodes(this.node);
  }

  /**
   * Undoes the node creation by removing it from the flow store.
   */
  undo(): void {
    const { removeNodes } = useFlowStore.getState();
    removeNodes(this.node);
  }

  /**
   * Provides details of the action, including its name and description, based on the given time.
   *
   * @param {Time} time - The time context (past or future) that affects the action's name.
   * @returns {Object} An object containing the name and description of the action.
   */
  details(time: Time): { name: string; description: string } {
    return {
      name: time === Time.Past ? "Created" : "Create",
      description: `node at x: ${this.node.position.x}, y: ${this.node.position.y}`,
    };
  }
}
