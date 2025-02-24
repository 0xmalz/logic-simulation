/**
 * Represents an action with execute and undo functionality.
 */
export interface Action {
  execute(): void;
  undo(): void;
}
