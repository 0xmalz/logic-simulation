import { Label } from "@/components/ui/label";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import { cva, VariantProps } from "class-variance-authority";
import { useMemo } from "react";

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
  } & VariantProps<typeof signalVariants>,
  "signal"
>;

const signalVariants = cva(
  "flex justify-center items-center w-[40px] h-[40px] border p-0 m-0 rounded-sm transition-colors duration-300",
  {
    variants: {
      variant: {
        input: "border-green-950 bg-green-600 hover:bg-green-500",
        output: "border-red-950 bg-red-600 hover:bg-red-500",
      },
    },
  }
);

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

  // Determine color based on variant
  const color = useMemo(
    () => (variant === "input" ? "green" : "red"),
    [variant]
  );

  return (
    <div className={signalVariants({ variant })}>
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
