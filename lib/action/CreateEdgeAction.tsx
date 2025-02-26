import { Edge } from "@xyflow/react";
import { Time } from "../models/enums/Time";
import { Action } from "../models/types/Action";
import { useFlowStore } from "../stores/useFlowStore";

export class AddEdgeAction implements Action {
  private edge: Edge;

  constructor(edge: Edge) {
    this.edge = edge;
  }

  execute(): void {
    const { addEdges } = useFlowStore.getState();
    addEdges(this.edge);
  }

  undo(): void {
    const { removeEdges } = useFlowStore.getState();
    removeEdges(this.edge);
  }

  details(time?: Time): { name: string; description: string } {
    return {
      name: time === Time.Past ? "Created" : "Create",
      description: `edge via nodes ${this.edge.source} and ${this.edge.target}`,
    };
  }
}
