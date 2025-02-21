import { useReactFlow } from "@xyflow/react";
import useMousePosition from "./useMousePosition";

/**
 * Custom hook that tracks to mouse position relative to flow grid.
 *
 * @returns {{ x: number, y: number }} The transformed mouse position.
 */
const useFlowMousePosition = () => {
  const { screenToFlowPosition } = useReactFlow();
  const mousePosition = useMousePosition();

  const x = mousePosition.x ?? 0;
  const y = mousePosition.y ?? 0;

  return screenToFlowPosition({ x, y });
};

export default useFlowMousePosition;
