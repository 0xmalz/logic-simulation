"use client";
import React from "react";
import "@xyflow/react/dist/style.css";
import Flow from "@/components/flow";
import StatusOverlay from "@/components/status-overlay";
import { ReactFlowProvider } from "@xyflow/react";

/**
 * Main App component
 * @returns {JSX.Element} - The rendered app
 */
export default function App() {
  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlowProvider>
        <StatusOverlay />
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
