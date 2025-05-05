namespace Excel2YAML {
  /**
   * Configuration for output generation.
   *
   * @remarks
   * Used to specify output format and template.
   */
  export interface OutputConfig {
    /**
     * Output format (e.g., "yaml").
     */
    as: string;
    /**
     * Template structure for output generation.
     */
    template: Excel2YAML.OutputTemplate;
  }
}

