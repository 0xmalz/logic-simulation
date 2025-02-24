// Actions/MoveNodeAction.ts
import { Action } from "../types/Action";
import { Node, XYPosition } from "@xyflow/react";
import { timeMachine } from "../TimeMachine";

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

export const handleNodeDragStart = (
  nodes: Node[],
  setNodeDragStartPositions: React.Dispatch<
    React.SetStateAction<Map<string, XYPosition>>
  >
) => {
  // Create a new Map from the nodes array and update the state
  setNodeDragStartPositions(
    new Map(nodes.map((node) => [node.id, node.position]))
  );
};

export const handleNodeDragStop = (
  nodes: Node[],
  nodeDragStartPositions: Map<string, XYPosition>,
  setNodeDragStartPositions: React.Dispatch<
    React.SetStateAction<Map<string, XYPosition>>
  >,
  updateNode: (
    id: string,
    update: any,
    options?: {
      replace: boolean;
    }
  ) => void
) => {
  // Extract node IDs and their old positions from the Map
  const nodeIds = Array.from(nodeDragStartPositions.keys());
  const oldPositions = Array.from(nodeDragStartPositions.values());

  // Extract new positions from the nodes
  const newPositions = nodes.map((node) => node.position);

  // Create and execute the move Action
  const moveAction = new MoveNode(
    nodeIds,
    oldPositions,
    newPositions,
    updateNode
  );

  timeMachine.register(moveAction);

  // Clear the initial positions
  setNodeDragStartPositions(new Map());
};
