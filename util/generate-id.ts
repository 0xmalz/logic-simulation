import { useFlowStore } from "@/lib/stores/useFlowStore";

/**
 * Generates a unique 5-character ID composed of alphanumeric characters
 * and ensures no duplicates by checking the usedIds set
 *
 * @returns {string} The generated 5-character ID.
 */
export function generateUniqueId() {
  const { usedIds } = useFlowStore.getState();

  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let id = "";

  // Generate a unique ID
  while (true) {
    for (let i = 0; i < 5; i++) {
      id += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    // If the ID is not in the set, it's unique
    if (!usedIds.has(id)) {
      usedIds.add(id);
      return id;
    } else {
      id = ""; // Reset and try again if duplicate
    }
  }
}
