import { useMemo } from "react";
import { Node, NodeProps, Handle, Position } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";

/**
 * Represents the props for the LogicGate node.
 * @typedef {Object} LogicGateProps
 * @property {number} input - The number of target handles.
 * @property {number} output - The number of source handles.
 */
export type LogicGateProps = Node<
  {
    label: string;
    input: number;
    output: number;
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
      />
    );
  });
};

/**
 * LogicGateNode component represents a custom node with input and output handles.
 * @param {NodeProps<LogicGateProps>} props - The props for the LogicGateNode component.
 * @returns {JSX.Element} - The rendered LogicGateNode component.
 */
export default function LogicGateNode(props: NodeProps<LogicGateProps>) {
  const { data } = props;
  const { label, input, output } = data;

  // Calculate the maximum number of handles to determine the container height
  const maxHandles = useMemo(() => {
    return Math.max(input ?? 0, output ?? 0);
  }, [input, output]);

  // Container dimensions based on the maximum number of handles
  const container = useMemo(
    () => ({
      width: 70 + maxHandles * 10, // Adjust width based on the number of handles
      height: 15 + maxHandles * 15, // Adjust height based on the number of handles
    }),
    [maxHandles]
  );

  return (
    <Card
      style={{
        width: container.width,
        height: container.height,
      }}
      className="flex justify-center items-center border border-blue-950 rounded-sm bg-blue-600 hover:bg-blue-500 transition-colors duration-300"
    >
      <Label className="text-lg font-semibold text-white">{label}</Label>

      {/* Target Handles (Left Side) */}
      {generateHandles(input, "target", Position.Left, container.height)}

      {/* Source Handles (Right Side) */}
      {generateHandles(output, "source", Position.Right, container.height)}
    </Card>
  );
}
