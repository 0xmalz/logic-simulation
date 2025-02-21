"use client";

import { useContext, useState } from "react";
import { Label } from "@radix-ui/react-label";

import useFlowMousePosition from "@/hooks/useFlowMousePosition";
import useMousePosition from "@/hooks/useMousePosition";
import { useKeyPress } from "@/hooks/useKeyPress";
import { twJoin, twMerge } from "tailwind-merge";
import { ThemeProvider } from "./theme-provider";
import { useTheme } from "next-themes";

export type StatusOverlayProps = {
  className?: string;
};

export default function StatusOverlay({ className }: StatusOverlayProps) {
  const { theme } = useTheme();

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
      className={twJoin(
        "flex flex-col max-w-max gap-2 text-xs p-3 z-10 rounded-sm transition-colors shadow-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-popover/50  border text-foreground",
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
