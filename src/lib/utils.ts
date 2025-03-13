// Utility functions

/**
 * Combines multiple class names into a single string
 */
export function combineClasses(
  ...classes: (string | undefined | null | false)[]
) {
  return classes.filter(Boolean).join(" ");
}
