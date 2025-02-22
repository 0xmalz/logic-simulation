"use client";
import React from "react";
import "@xyflow/react/dist/style.css";
import { ReactFlowProvider } from "@xyflow/react";
import { ThemeDropDownMenu } from "@/components/ThemeDropDownMenu";
import StatusOverlay from "@/components/StatusOverlay";
import Flow from "@/components/flow";

/**
 * Main App component
 * @returns {JSX.Element} - The rendered app
 */
export default function App() {
  return (
    <div className="w-[100vw] h-[100vh]">
      <ReactFlowProvider>
        <StatusOverlay className="absolute top-3 left-3" />
        <Flow />
        <ThemeDropDownMenu className="absolute top-3 right-3 z-10" />
      </ReactFlowProvider>
    </div>
  );
}
