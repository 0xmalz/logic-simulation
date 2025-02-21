import { Label } from "@/components/ui/label";
import { Handle, Node, NodeProps, Position, useStore } from "@xyflow/react";
import { useMemo } from "react";

/**
 * Represents the props for the LogicGate node.
 * @typedef {Object} LogicGateProps
 * @property {number} target - The number of target handles.
 * @property {number} source - The number of source handles.
 */
export type SignalProps = Node<
  {
    label: string;
    variant: "input" | "output";
  },
  "signal"
>;

export default function SignalNode(props: NodeProps<SignalProps>) {
  const { data } = props;
  const { label, variant } = data;

  const color = useMemo(() => (variant == "input" ? "green" : "red"), []);

  return (
    <div
      className={`flex justify-center items-center w-[40px] h-[40px] border border-blue-950 p-0 m-0 rounded-sm transition-colors duration-300 bg-${color}-600 hover:bg-${color}-500`}
    >
      <Label className={`text-lg font-semibold text-${color}-950`}>
        {label}
      </Label>

      <Handle
        id={variant}
        type={variant == "input" ? "source" : "target"}
        position={variant == "input" ? Position.Right : Position.Left}
      />
    </div>
  );
}
