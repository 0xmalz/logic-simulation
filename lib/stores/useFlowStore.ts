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

/**
 * Initial nodes setup for the flow store.
 */
export const initialNodes = [
  {
    id: "1",
    type: "logicGate",
    data: { label: "And", input: 2, output: 1 },
    position: { x: 250, y: 25 },
  },
] as Node[];

/**
 * Creates a Zustand store to manage the flow state including nodes, edges, and their interactions.
 */
export type FlowState = {
  nodes: Node[];
  edges: Edge[];

  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;

  addNodes: (nodes: Node | Node[]) => void;
  addEdges: (edges: Edge | Edge[]) => void;

  removeNodes: (nodes: Node | Node[]) => void;
  removeEdges: (edges: Edge | Edge[]) => void;

  onNodesChange: OnNodesChange<Node>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;

  selectedNodes: Node[];
  selectedEdges: Edge[];
  setSelectedNodes: (nodes: Node[]) => void;
  setSelectedEdges: (nodes: Edge[]) => void;

  nodeClipboard: Node[];
  edgeClipboard: Edge[];
  setNodeClipboard: (nodes: Node[]) => void;
  setEdgeClipboard: (edges: Edge[]) => void;
};

/**
 * Creates a Zustand store to manage the flow state including nodes, edges, and their interactions.
 */
export const useFlowStore = create<FlowState>((set, get) => ({
  nodes: initialNodes,
  edges: [],

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  addNodes: (nodes) =>
    set((state) => ({
      nodes: [...state.nodes, ...(Array.isArray(nodes) ? nodes : [nodes])],
    })),

  addEdges: (edge) =>
    set((state) => ({
      edges: [...state.edges, ...(Array.isArray(edge) ? edge : [edge])],
    })),

  removeNodes: (nodes) =>
    set((state) => {
      const idsToRemove = new Set(
        (Array.isArray(nodes) ? nodes : [nodes]).map((node) => node.id)
      );
      return { nodes: state.nodes.filter((node) => !idsToRemove.has(node.id)) };
    }),

  removeEdges: (edges) =>
    set((state) => {
      const idsToRemove = new Set(
        (Array.isArray(edges) ? edges : [edges]).map((edge) => edge.id)
      );
      return { edges: state.edges.filter((edge) => !idsToRemove.has(edge.id)) };
    }),

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

  nodeClipboard: [],
  edgeClipboard: [],
  setNodeClipboard: (nodeClipboard) => set({ nodeClipboard }),
  setEdgeClipboard: (edgeClipboard) => set({ edgeClipboard }),
}));
