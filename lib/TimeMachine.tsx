import { Action } from "./types/Action";

/**
 * A class that manages a history of actions, allowing undo and redo functionality.
 */
class TimeMachine {
  private history: Action[] = [];
  private future: Action[] = [];
  private readonly historyLimit = 50; // Limit history size

  /**
   * Registers an action and optionally executes it immediately.
   * @param Action - The action to register.
   * @param executeOnRegister - Whether to execute the action immediately.
   */
  register(Action: Action, executeOnRegister: boolean = false): void {
    if (process.env.NODE_ENV === "development") {
      console.log("Action:", Action);
      console.log("History:", this.history);
    }

    if (executeOnRegister) Action.execute();

    this.history.push(Action);
    if (this.history.length > this.historyLimit) {
      this.history.shift(); // Remove the oldest action
    }

    this.future = []; // Clear the future stack when a new action is added
  }

  /**
   * Undoes the last action, moving it to the future stack.
   */
  undo(): void {
    const Action = this.history.pop();
    if (Action) {
      Action.undo();
      this.future.push(Action);
    }
  }

  /**
   * Redoes the last undone action, moving it back to the history stack.
   */
  redo(): void {
    const Action = this.future.pop();
    if (Action) {
      Action.execute();
      this.history.push(Action);
    }
  }

  /**
   * Checks if there are actions available to undo.
   * @returns True if undo is possible, otherwise false.
   */
  canUndo(): boolean {
    return this.history.length > 0;
  }

  /**
   * Checks if there are actions available to redo.
   * @returns True if redo is possible, otherwise false.
   */
  canRedo(): boolean {
    return this.future.length > 0;
  }
}

/**
 * A singleton instance of the TimeMachine class.
 */
export const timeMachine = new TimeMachine();
