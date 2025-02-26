import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { twJoin } from "tailwind-merge";
import { Button } from "./ui/Button";
import { Redo, Undo } from "lucide-react";
import { useTimeMachineStore } from "@/lib/stores/useTimeMachineStore";
import { Action } from "@/lib/models/interfaces/Action";
import { Separator } from "./ui/Separator";
import { Label } from "./ui/Label";
import { Time } from "@/lib/models/enums/Time";
import { useMemo, useRef, useState, useEffect } from "react";

export type TimelineProps = {
  className?: string;
};

/**
 * Timeline component that displays the history and future actions in a time machine interface.
 * Allows users to undo and redo actions, with a visual timeline of past and future actions.
 *
 * @param className - Optional custom class name to style the component.
 *
 * @returns A timeline that includes tables for past and future actions with undo and redo buttons, scroll handling, and labels indicating the status of actions.
 */
export default function Timeline({ className }: TimelineProps) {
  const { history, future, undo, redo } = useTimeMachineStore();

  const [isAtBottom, setIsAtBottom] = useState(false);
  const [isScrollable, setIsScrollable] = useState(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const timelineLabel = useMemo(() => {
    const pastActionsLabel = `↑ past action${history.length > 1 ? "s" : ""}`;
    const futureActionsLabel = `future action${future.length > 1 ? "s" : ""} ↓`;

    let result = "";

    if (history.length > 0) {
      result += pastActionsLabel;
    }

    if (future.length > 0) {
      if (result) {
        result += `, `;
      }
      result += futureActionsLabel;
    }

    return result;
  }, [history, future]);

  // Function to handle scroll events
  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } =
        tableContainerRef.current;
      // Check if scrolled to the bottom
      const atBottom = scrollTop + clientHeight >= scrollHeight;
      setIsAtBottom(atBottom);

      // Check if content is scrollable
      const isContentScrollable = scrollHeight > clientHeight;
      setIsScrollable(isContentScrollable);
    }
  };

  useEffect(() => {
    if (tableContainerRef.current) {
      const { scrollHeight, clientHeight } = tableContainerRef.current;

      // Check if content is scrollable
      const isContentScrollable = scrollHeight > clientHeight;
      setIsScrollable(isContentScrollable);

      // Scroll to the bottom if new items are added and we're already at the bottom
      if (isAtBottom) {
        tableContainerRef.current.scrollTop = scrollHeight;
      }
    }
  }, [history, future, isAtBottom]);

  return (
    <div
      className={twJoin(
        "relative flex flex-col gap-2 text-xs p-3 z-10 min-w-[300px] rounded-sm transition-colors shadow-lg bg-clip-padding backdrop-filter backdrop-blur-xl bg-popover/50 border text-foreground pb-1",
        className
      )}
    >
      <div className="flex flex-row">
        <div className="flex-1 flex items-center">
          <Label className="font-semibold">Timeline</Label>
        </div>

        <div className="flex flex-1 justify-end gap-2">
          <Button variant="outline" size="icon" onClick={() => undo()}>
            <Undo />
          </Button>
          <Button variant="outline" size="icon" onClick={() => redo()}>
            <Redo />
          </Button>
        </div>
      </div>

      {/* Bottom gradient to indicate scrollability */}
      {!isAtBottom && isScrollable && (
        <div className="absolute bottom-0 left-0 right-0 w-full h-[50px] z-10 bg-gradient-to-t from-black to-black/10"></div>
      )}

      {/* Scrollable container with scroll event handler */}
      <div
        ref={tableContainerRef}
        className="relative max-h-[500px] overflow-y-auto"
        onScroll={handleScroll}
      >
        {(history.length > 0 || future.length > 0) && (
          <>
            <Table className="hover:cursor-default text-xs">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Action</TableHead>
                  <TableHead>Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((action: Action, index) => (
                  <TableRow key={index} onClick={() => undo(index)}>
                    <TableCell className="font-medium">
                      {action.details(Time.Past).name}
                    </TableCell>
                    <TableCell>
                      {action.details(Time.Past).description}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex flex-row items-center justify-center space-x-4 w-full my-2">
              <Separator className="flex-auto" />
              <Label className="text-nowrap text-xs text-muted-foreground">
                {timelineLabel}
              </Label>
              <Separator className="flex-auto" />
            </div>

            {future.length > 0 && (
              <div className="max-h-[500px] overflow-y-auto">
                <Table className="hover:cursor-default text-xs">
                  <TableBody>
                    {future.map((action: Action, index) => (
                      <TableRow key={index} onClick={() => redo(index)}>
                        <TableCell className="font-medium w-[80px]">
                          {action.details(Time.Future).name}
                        </TableCell>
                        <TableCell>
                          {action.details(Time.Future).description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
