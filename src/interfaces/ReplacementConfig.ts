/**
 * Defines a string replacement rule.
 *
 * @public
 * @remarks
 * Used to replace input strings with output strings during transformation.
 *
 * @property input - The string to match for replacement
 * @property output - The string to replace with
 */
export interface ReplacementConfig {
  input: string;
  output: string;
}
