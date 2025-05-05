namespace Excel2YAML {
  /**
   * Configuration for data transformations.
   *
   * @remarks
   * Used to define regex-based transformations for columns.
   */
  export interface TransformConfig {
    /**
     * Regular expression pattern for transformation.
     */
    regexp: string;
    /**
     * Name of the column to transform.
     */
    name: string;
  }
}

