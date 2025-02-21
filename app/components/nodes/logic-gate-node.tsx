import { useMemo } from "react";
import { Node, NodeProps, Handle, Position } from "@xyflow/react";

/**
 * Represents the props for the LogicGate node.
 * @typedef {Object} LogicGateProps
 * @property {number} target - The number of target handles.
 * @property {number} source - The number of source handles.
 */
export type LogicGateProps = Node<
  {
    target: number;
    source: number;
  },
  "logicGate"
>;

/**
 * Generates an array of Handle components based on the provided parameters.
 * @param {number} handleCount - The number of handles to generate.
 * @param {"target" | "source"} type - The type of handles to generate (target or source).
 * @param {Position} position - The position of the handles (e.g., Position.Left, Position.Right).
 * @param {number} containerHeight - The height of the container.
 * @returns {JSX.Element[]} - An array of Handle components.
 */
const generateHandles = (
  handleCount: number,
  type: "target" | "source",
  position: Position,
  containerHeight: number
) => {
  const spacing = containerHeight / (handleCount + 1);

  return Array.from({ length: handleCount }, (_, index) => {
    const topPosition = spacing * (index + 1);
    const id: string = `${type}-${index}`;
    return (
      <Handle
        key={id}
        id={id}
        type={type}
        position={position}
        style={{ top: topPosition }}
        isConnectable
      />
    );
  });
};

/**
 * LogicGateNode component represents a custom node with target and source handles.
 * @param {NodeProps<LogicGateProps>} props - The props for the LogicGateNode component.
 * @returns {JSX.Element} - The rendered LogicGateNode component.
 */
export default function LogicGateNode(props: NodeProps<LogicGateProps>) {
  const { data } = props;
  const { target, source } = data;

  // Calculate the maximum number of handles to determine the container height
  const maxHandles = useMemo(() => {
    return Math.max(target ?? 0, source ?? 0);
  }, [target, source]);

  // Container dimensions based on the maximum number of handles
  const container = useMemo(
    () => ({
      width: 70 + maxHandles * 10, // Adjust width based on the number of handles
      height: 20 + maxHandles * 10, // Adjust height based on the number of handles
    }),
    [maxHandles]
  );

  return (
    <div
      style={{
        width: container.width,
        height: container.height,
      }}
      className="border border-blue-950 rounded-sm bg-blue-600 hover:bg-blue-500 transition-colors duration-300"
    >
      {/* Target Handles (Left Side) */}
      {generateHandles(target, "target", Position.Left, container.height)}

      {/* Source Handles (Right Side) */}
      {generateHandles(source, "source", Position.Right, container.height)}
    </div>
  );
}
