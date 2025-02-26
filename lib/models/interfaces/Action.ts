import { Time } from "../enums/Time";

/**
 * Represents an action with execute and undo functionality.
 */
export interface Action {
  execute(): void;
  undo(): void;
  details(time?: Time): { name: string; description: string };
}
