import { useEffect } from "react";

/**
 * Custom hook that listens for keydown and keyup events and triggers callbacks
 * when specified key codes are pressed or released.
 *
 * @param {() => void} onKeyDown - Function to be executed on key press.
 * @param {() => void} onKeyUp - Function to be executed on key release.
 * @param {string[]} keyCodes - Array of key codes to listen for.
 */
export function useKeyPress(
  onKeyDown: () => void,
  onKeyUp: () => void,
  keyCodes: string[]
): void {
  const handleKeyDown = ({ code }: KeyboardEvent) => {
    if (keyCodes.includes(code)) {
      onKeyDown();
    }
  };

  const handleKeyUp = ({ code }: KeyboardEvent) => {
    if (keyCodes.includes(code)) {
      onKeyUp();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onKeyDown, onKeyUp, keyCodes]); // Add dependencies to re-run the effect if these change
}
