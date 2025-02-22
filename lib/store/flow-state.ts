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

  addNodes: (nodes: Node | Node[]) => void;
  addEdges: (edges: Edge | Edge[]) => void;

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

      addNodes: state.addNodes,
      addEdges: state.addEdges,

      selectedNodes: state.selectedNodes,
      selectedEdges: state.selectedEdges,
      setSelectedNodes: state.setSelectedNodes,
      setSelectedEdges: state.setSelectedEdges,

      nodeClipboard: state.nodeClipboard,
      edgeClipboard: state.edgeClipboard,
      setNodeClipboard: state.setNodeClipboard,
      setEdgeClipboard: state.setEdgeClipboard,
    }))
  );
