import { create } from "zustand";
import { Action } from "../models/interfaces/Action";

/*
 * Defines the state and actions for managing history and future actions in a time machine.
 */
interface TimeMachineState {
  history: Action[];
  future: Action[];
  historyLimit: number;
  register: (action: Action, executeOnRegister?: boolean) => void;
  undo: (index?: number) => void;
  redo: (index?: number) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

/*
 * Creates a Zustand store for managing time machine functionality (undo/redo history).
 */
export const useTimeMachineStore = create<TimeMachineState>((set, get) => ({
  history: [],
  future: [],
  historyLimit: 50,

  register: (action: Action, executeOnRegister: boolean = true): void => {
    if (executeOnRegister) action.execute();

    set((state) => {
      const newHistory = [...state.history, action];
      if (newHistory.length > state.historyLimit) {
        newHistory.shift();
      }
      return { history: newHistory, future: [] };
    });
  },

  undo: (index?: number): void => {
    set((state) => {
      if (state.history.length === 0) return state;

      // If no index is provided, default to undoing one step
      const targetIndex = index ?? state.history.length - 2;

      // Ensure the target index is valid
      if (targetIndex < -1 || targetIndex >= state.history.length - 1) {
        console.warn("Invalid undo index. No action performed.");
        return state;
      }

      // Calculate the number of steps to undo
      const steps = state.history.length - 1 - targetIndex;

      // Perform the undo steps
      const newHistory = [...state.history];
      const newFuture = [...state.future];
      let lastAction: Action | undefined;

      for (let i = 0; i < steps; i++) {
        lastAction = newHistory.pop();
        if (lastAction) {
          lastAction.undo();
          newFuture.unshift(lastAction);
        }
      }

      return { history: newHistory, future: newFuture };
    });
  },

  redo: (index?: number): void => {
    set((state) => {
      if (state.future.length === 0) return state;

      // If no index is provided, default to redoing one step
      const targetIndex = index ?? 0;

      // Ensure the target index is valid
      if (targetIndex < 0 || targetIndex >= state.future.length) {
        console.warn("Invalid redo index. No action performed.");
        return state;
      }

      // Calculate the number of steps to redo
      const steps = targetIndex + 1;

      // Perform the redo steps
      const newHistory = [...state.history];
      const newFuture = [...state.future];
      let lastAction: Action | undefined;

      for (let i = 0; i < steps; i++) {
        lastAction = newFuture.shift();
        if (lastAction) {
          lastAction.execute();
          newHistory.push(lastAction);
        }
      }

      return { history: newHistory, future: newFuture };
    });
  },

  canUndo: (): boolean => get().history.length > 0,
  canRedo: (): boolean => get().future.length > 0,
}));
