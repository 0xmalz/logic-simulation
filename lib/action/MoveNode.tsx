// Actions/MoveNodeAction.ts
import { Action } from "../types/Action";
import { Node, XYPosition } from "@xyflow/react";

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

  execute(): void {
    this.updatePosition(this.newPosition);
  }

  undo(): void {
    this.updatePosition(this.oldPosition);
  }
}
