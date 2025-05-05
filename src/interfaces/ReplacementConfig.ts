namespace Excel2YAML {
  /**
   * Defines a string replacement rule.
   *
   * @public
   * @remarks
   * Used to replace input strings with output strings during transformation.
   */
  export interface ReplacementConfig {
    /**
     * The string to match for replacement.
     */
    input: string;
    /**
     * The string to replace with.
     */
    output: string;
  }
}
