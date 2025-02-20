import { useCallback, useMemo } from "react";
import {
  Node,
  NodeProps,
  getStraightPath,
  Handle,
  Position,
} from "@xyflow/react";
import { Card } from "@/components/ui/card";

export type LogicGateProps = Node<
  {
    input?: number;
    output?: number;
  },
  "logicGate"
>;

export default function LogicGateNode(props: NodeProps<LogicGateProps>) {
  const { data } = props;
  const { input, output } = data;

  const maxHandles = useMemo(() => {
    return Math.max(input ?? 0, output ?? 0);
  }, [input, output]);

  const container = useMemo(
    () => ({
      width: 70 + maxHandles * 10,
      height: 20 + maxHandles * 10,
    }),
    [maxHandles]
  );

  const inputHandleTops = useMemo(() => {
    return Array.from(
      { length: input ?? 0 },
      (_, index) =>
        container.height / maxHandles / 2 +
        index * (container.height / maxHandles)
    );
  }, [input, maxHandles, container.height]);

  const outputHandleTops = useMemo(() => {
    return Array.from({ length: output ?? 0 }, (_, index) => 10 + index * 15);
  }, [output]);

  return (
    <div
      style={{
        width: container.width,
        height: container.height,
      }}
      className={`h-[80px] border border-blue-950 rounded-sm bg-blue-600 hover:bg-blue-500 transition-colors duration-300`}
    >
      {/* Target Handles for Input */}
      {inputHandleTops.map((top, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          style={{
            top: top,
          }}
        />
      ))}

      {/* Target Handles for Output */}
      {outputHandleTops.map((top, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          style={{
            top: top,
          }}
        />
      ))}
    </div>
  );
}
