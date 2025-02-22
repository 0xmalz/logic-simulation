import { Label } from "@/components/ui/Label";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Button } from "../ui/Button";

export type SignalVariant = "input" | "output";
export type SignalState = "on" | "off";

/**
 * Defines the properties for a Signal node.
 * Extends the Node type with additional attributes specific to signal nodes.
 *
 * @typedef {Object} SignalProps
 * @property {string} label - The label displayed on the signal node.
 * @property {SignalVariant} variant - The type of the signal node, either "input" or "output".
 */
export type SignalProps = Node<
  {
    label: string;
    variant: SignalVariant;
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
 * @param {SignalVariant} props.data.variant - The variant of the signal node, determining its color and connection type.
 * @returns {JSX.Element} The rendered SignalNode component.
 */
export default function SignalNode(props: NodeProps<SignalProps>) {
  const { data } = props;
  const { label, variant } = data;

  const [state, setState] = useState<SignalState>("off");
  console.log(state);
  return (
    <Button
      onClick={() => setState(state == "on" ? "off" : "on")}
      className={twMerge(
        "flex justify-center items-center w-[45px] h-[45px] border p-0 m-0 rounded-sm transition-colors duration-100",
        state == "on"
          ? "border-red-950 bg-red-600 hover:bg-red-500"
          : "border-gray-950 bg-gray-600 hover:bg-gray-500"
      )}
    >
      <Label className={"text-lg font-semibold text-white"}>{label}</Label>

      <Handle
        id={variant}
        type={variant == "input" ? "source" : "target"}
        position={variant == "input" ? Position.Right : Position.Left}
      />
    </Button>
  );
}
