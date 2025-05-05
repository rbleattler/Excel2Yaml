namespace Excel2YAML {
  /**
   * Configuration for special data handling operations.
   *
   * @public
   * @remarks
   * Used for advanced template row and group exclusion logic.
   */
  export interface SpecialConfig {
    /**
     * Defines template rows that should be applied across all groups.
     */
    applyToAll?: Record<string, string>;
    /**
     * Defines groups that should be excluded from processing.
     */
    excludeGrouping?: Record<string, string>;
  }
}
