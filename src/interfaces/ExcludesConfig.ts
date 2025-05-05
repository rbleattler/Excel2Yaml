namespace Excel2YAML {
  /**
   * Configuration for data exclusion rules.
   *
   * @remarks
   * Used to exclude empty values, columns, or groups based on values.
   */
  export interface ExcludesConfig {
    /**
     * Whether to exclude empty values from the data.
     * @example emptyValues: true
     */
    emptyValues?: boolean;
    /**
     * List of columns to exclude.
     * @example excludeColumns: ["ColumnA", "ColumnB"]
     */
    excludeColumns?: string[];
    /**
     * Rules for excluding groups based on values.
     * @example groupingByValue: { "<ColumnName>": "Value" }
     */
    groupingByValue?: Record<string, string | { where: string }>;
  }
}
