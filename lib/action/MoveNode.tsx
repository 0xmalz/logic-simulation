// Actions/MoveNodeAction.ts
import { Time } from "../models/enums/Time";
import { Action } from "../models/types/Action";
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
