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

export default function SignalNode(props: NodeProps<SignalProps>) {
  const { data } = props;
  const { label, variant } = data;

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
