"use client";

import { useState } from "react";
import { Label } from "@radix-ui/react-label";

import useFlowMousePosition from "@/hooks/useFlowMousePosition";
import useMousePosition from "@/hooks/useMousePosition";
import { useKeyPress } from "@/hooks/useKeyPress";
import { twMerge } from "tailwind-merge";

export type StatusOverlayProps = {
  className?: string;
};

export default function StatusOverlay({ className }: StatusOverlayProps) {
  const mousePosition = useMousePosition();
  const flowMousePosition = useFlowMousePosition();

  const [shiftPressed, setShiftPressed] = useState<boolean>(false);

  // Use the hook to detect Shift key press and release
  useKeyPress(
    () => setShiftPressed(true), // Called when Shift is pressed
    () => setShiftPressed(false), // Called when Shift is released
    ["ShiftLeft", "ShiftRight"] // Key codes for both Shift keys
  );

  return (
    <div
      className={twMerge(
        "flex flex-col gap-2 text-xs text-white bg-black bg-opacity-20 p-2 z-10",
        className
      )}
    >
      <Label>
        Mouse Position: ({mousePosition.x}, {mousePosition.y})
      </Label>
      <Label>
        Mouse Flow Position: ({flowMousePosition.x}, {flowMousePosition.y})
      </Label>
      <Label>Shift Pressed: {shiftPressed ? "true" : "false"}</Label>
    </div>
  );
}
