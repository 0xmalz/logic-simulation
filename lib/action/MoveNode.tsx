// Actions/MoveNodeAction.ts
import { Time } from "../models/enums/Time";
import { Action } from "../models/types/Action";
import { Node, XYPosition } from "@xyflow/react";

/**
 * Action that handles moving nodes within the flow.
 */
export class MoveNode implements Action {
  private nodeIds: string[];
  private oldPosition: XYPosition[];
  private newPosition: XYPosition[];
  private updateNode: (
    id: string,
    update: any,
    options?: {
      replace: boolean;
    }
  ) => void;

  /**
   * Creates an instance of the MoveNode action with the necessary parameters to track node movements.
   *
   * @param {string[]} nodeIds - The ids of the nodes being moved.
   * @param {XYPosition[]} oldPosition - The old positions of the nodes.
   * @param {XYPosition[]} newPosition - The new positions of the nodes.
   * @param {Function} updateNode - The function to update the nodes in the flow.
   */
  constructor(
    nodeIds: string[],
    oldPosition: XYPosition[],
    newPosition: XYPosition[],
    updateNode: (
      id: string,
      update: any,
      options?: {
        replace: boolean;
      }
    ) => void
  ) {
    this.nodeIds = nodeIds;
    this.oldPosition = oldPosition;
    this.newPosition = newPosition;
    this.updateNode = updateNode;
  }

  /**
   * Updates the position of the nodes.
   *
   * @param {XYPosition[]} position - The positions to set for the nodes.
   */
  updatePosition(position: XYPosition[]): void {
    this.nodeIds.forEach((id, index) => {
      this.updateNode(id, (node: Node) => {
        const updatedNode = {
          ...node,
          position: position[index],
        };
        return updatedNode;
      });
    });
  }

  /**
   * Executes the action of moving the nodes to their new positions.
   */
  execute(): void {
    this.updatePosition(this.newPosition);
  }

  /**
   * Undoes the move action by restoring the nodes to their original positions.
   */
  undo(): void {
    this.updatePosition(this.oldPosition);
  }

  /**
   * Provides details about the move action, including the number of nodes moved
   * or the specific positions for a single node, based on the time context.
   *
   * @param {Time} time - The time context (e.g., Time.Past or Time.Future) to influence the action name.
   * @returns {Object} An object containing the name and description of the move action.
   */
  details(time: Time): { name: string; description: string } {
    const name: string = time === Time.Past ? "Moved" : "Move";
    const nodeCount = this.nodeIds.length;

    if (nodeCount > 1) {
      return {
        name: name,
        description: `${nodeCount} nodes`,
      };
    } else {
      const oldPos = this.oldPosition[0];
      const newPos = this.newPosition[0];

      return {
        name: name,
        description: `from (x: ${oldPos.x}, y: ${oldPos.y}) to (x: ${newPos.x}, y: ${newPos.y})`,
      };
    }
  }
}
