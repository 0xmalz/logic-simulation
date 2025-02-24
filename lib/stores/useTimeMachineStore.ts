import { create } from "zustand";
import { Action } from "../types/Action";

interface TimeMachineState {
  history: Action[];
  future: Action[];
  historyLimit: number;
  register: (action: Action, executeOnRegister?: boolean) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

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

  undo: (): void => {
    set((state) => {
      if (state.history.length === 0) return state;

      const newHistory = [...state.history];
      const lastAction = newHistory.pop();
      if (lastAction) {
        lastAction.undo();
        return { history: newHistory, future: [lastAction, ...state.future] };
      }
      return state;
    });
  },

  redo: (): void => {
    set((state) => {
      if (state.future.length === 0) return state;

      const newFuture = [...state.future];
      const lastAction = newFuture.shift();
      if (lastAction) {
        lastAction.execute();
        return { history: [...state.history, lastAction], future: newFuture };
      }
      return state;
    });
  },

  canUndo: (): boolean => get().history.length > 0,
  canRedo: (): boolean => get().future.length > 0,
}));
