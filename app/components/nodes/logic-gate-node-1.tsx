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

export default function LogicGateNode(props: NodeProps<CounterNode>) {
  const onChange = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    console.log(evt.target.value);
  }, []);

  const numInput: number = 3;
  const numOutput: number = 3;

  return (
    <div className="w-[110px] h-[60px] border border-blue-950 rounded-sm bg-blue-600 hover:bg-blue-500 transition-colors duration-300 shadow">
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

      <Handle
        type="target"
        position={Position.Left}
        style={{
          top: 50,
        }}
      />
    </div>
  );
}
