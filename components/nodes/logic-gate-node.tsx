import { useMemo } from "react";
import { Node, NodeProps, Handle, Position } from "@xyflow/react";
import { Label } from "@/components/ui/label";
import { Card } from "../ui/card";
import { cva, VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Defines the styling variants for a logic gate node.
 * Uses `cva` to manage conditional class names for styling.
 */
const logicGateNodeVariants = cva(
  "flex justify-center items-center border rounded-sm transition-colors duration-300",
  {
    variants: {
      color: {
        blue: "border-blue-950 bg-blue-600 hover:bg-blue-500",
        red: "border-red-950 bg-red-600 hover:bg-red-500",
        green: "border-green-950 bg-green-600 hover:bg-green-500",
      },
    },
    defaultVariants: {
      color: "blue",
    },
  }
);

/**
 * Represents the type definition for the logic gate node variants.
 * Extracts the available variant props from `logicGateNodeVariants`.
 */
type LogicGateNodeVariants = VariantProps<typeof logicGateNodeVariants>;

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
    variants?: LogicGateNodeVariants;
  },
  "logicGate"
>;

/**
 * Generates an array of Handle components based on the provided parameters.
 * @param {number} handleCount - The number of handles to generate.
 * @param {"target" | "source"} type - The type of handles to generate (target or source).
 * @param {Position} position - The position of the handles (e.g., Position.Left, Position.Right).
 * @param {number} dimensionsHeight - The height of the dimensions.
 * @returns {JSX.Element[]} - An array of Handle components.
 */
const generateHandles = (
  handleCount: number,
  type: "target" | "source",
  position: Position,
  height: number
) => {
  const spacing = height / (handleCount + 1);

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
  const { label, input, output, variants } = data;

  // Calculate the maximum number of handles to determine the dimensions height
  const maxHandles = useMemo(() => {
    return Math.max(input ?? 0, output ?? 0);
  }, [input, output]);

  // dimensionss based on the maximum number of handles
  const dimensions = useMemo(
    () => ({
      width: 70 + maxHandles * 10, // Adjust width based on the number of handles
      height: 15 + maxHandles * 15, // Adjust height based on the number of handles
    }),
    [maxHandles]
  );

  return (
    <Card
      style={{
        width: dimensions.width,
        height: dimensions.height,
      }}
      className={cn(logicGateNodeVariants(variants))}
    >
      <Label className="text-lg font-semibold text-white">{label}</Label>

      {/* Target Handles (Left Side) */}
      {generateHandles(input, "target", Position.Left, dimensions.height)}

      {/* Source Handles (Right Side) */}
      {generateHandles(output, "source", Position.Right, dimensions.height)}
    </Card>
  );
}
