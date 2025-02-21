import { Label } from "@/components/ui/label";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { cva, VariantProps } from "class-variance-authority";
import { useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/button";

/**
 * Represents the props for the Signal node.
 * Extends the Node type with additional properties and variant styles.
 *
 * @typedef {Object} SignalProps
 * @property {string} label - The label for the signal node.
 * @property {VariantProps<typeof signalVariants>} variantProps - The variant properties for styling the signal node.
 */
export type SignalProps = Node<
  {
    label: string;
    variant: "input" | "output";
  },
  "signal"
>;

/**
 * SignalNode component that represents a signal node
 * - **Input:** Represents a signal that can be turned on or off.
 * - **Output:** Represents a node that receives a signal.
 *
 * @param {NodeProps<SignalProps>} props - The props for the SignalNode component.
 * @param {string} props.data.label - The label to be displayed for the signal node.
 * @param {"input" | "output"} props.data.variant - The variant of the signal node, determining its color and connection type.
 * @returns {JSX.Element} The rendered SignalNode component.
 */
export default function SignalNode(props: NodeProps<SignalProps>) {
  const { data } = props;
  const { label, variant } = data;

  const [state, setState] = useState<"on" | "off">();

  return (
    <Button
      onClick={() => setState(state == "on" ? "off" : "on")}
      className={twMerge(
        "flex justify-center items-center w-[45px] h-[45px] border p-0 m-0 rounded-sm transition-colors duration-100",
        state == "on"
          ? "border-gray-950 bg-gray-600 hover:bg-gray-500"
          : "border-red-950 bg-red-600 hover:bg-red-500"
      )}
    >
      <Label className={twMerge("text-lg font-semibold")}>{label}</Label>

      <Handle
        id={variant}
        type={variant == "input" ? "source" : "target"}
        position={variant == "input" ? Position.Right : Position.Left}
      />
    </Button>
  );
}
