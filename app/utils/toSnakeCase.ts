import { snakeCase } from "lodash"

/**
 * Recursively converts object keys to snake_case, preserving non-object values like strings and dates.
 * @param obj - The object to transform.
 * @returns The transformed object with snake_case keys.
 */
export function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase) // Recursively handle arrays
  } else if (obj !== null && typeof obj === "object" && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((acc, key) => {
      const snakeKey = snakeCase(key) // Convert the key to snake_case
      acc[snakeKey] = toSnakeCase(obj[key]) // Recursively handle nested objects
      return acc
    }, {} as any)
  }
  return obj // Return primitive values and dates as-is
}
