import { create } from "zustand";

import {
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import { useShallow } from "zustand/react/shallow";

export const initialNodes = [
  {
    id: "1",
    type: "logicGate",
    data: { label: "And", input: 2, output: 1 },
    position: { x: 250, y: 25 },
  },
] as Node[];

export type FlowState = {
  nodes: Node[];
  edges: Edge[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  addNode: (node: Node) => void;
  addEdge: (edge: Edge) => void;

  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  selectedNodes: Node[];
  selectedEdges: Edge[];
  setSelectedNodes: (nodes: Node[]) => void;
  setSelectedEdges: (nodes: Edge[]) => void;
};

export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),
  addNode: (node) => set({ nodes: [...get().nodes, node] }),
  addEdge: (edge) => set({ edges: [...get().edges, edge] }),

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (connection) => {
    set({ edges: addEdge(connection, get().edges) });
  },

  selectedNodes: [],
  selectedEdges: [],
  setSelectedNodes: (selectedNodes) => set({ selectedNodes }),
  setSelectedEdges: (selectedEdges) => set({ selectedEdges }),
}));

// TODO: Check how this selector really works.
export const useFlowSelector = () =>
  useFlowStore(
    useShallow((state) => ({
      nodes: state.nodes,
      edges: state.edges,
      onNodesChange: state.onNodesChange,
      onEdgesChange: state.onEdgesChange,
      onConnect: state.onConnect,
      setNodes: state.setNodes,
      setEdges: state.setEdges,
      addNode: state.addNode,
      addEdge: state.addEdge,
      selectedNodes: state.selectedNodes,
      selectedEdges: state.selectedEdges,
      setSelectedNodes: state.setSelectedNodes,
      setSelectedEdges: state.setSelectedEdges,
    }))
  );
