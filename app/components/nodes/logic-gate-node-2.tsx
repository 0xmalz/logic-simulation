import { useCallback } from "react";
import {
  Node,
  NodeProps,
  getStraightPath,
  Handle,
  Position,
} from "@xyflow/react";
import { Card } from "@/components/ui/card";

export type CounterNode = Node<
  {
    initialCount?: number;
  },
  "counter"
>;

//

export default function LogicGateNodeB(props: NodeProps<CounterNode>) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  const numInput: number = 3;
  const numOutput: number = 3;

  return (
    <div className="w-[95px] h-[40px] border border-blue-950 rounded-sm bg-blue-600 hover:bg-blue-500 transition-colors duration-300">
      <Handle type="source" position={Position.Right} />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: 10,
        }}
      />
      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: 30,
        }}
      />
    </div>
  );
}
