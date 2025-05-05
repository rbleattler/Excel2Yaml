namespace Excel2YAML {
  /**
   * Main configuration object for the Excel to YAML transformer.
   * @remarks
   * Aggregates all configuration options for the script.
   */
  export interface Config {
    /**
     * Excel sheet configuration.
     */
    excel: Excel2YAML.ExcelConfig;
    /**
     * Special data handling configuration.
     */
    special?: Excel2YAML.SpecialConfig;
    /**
     * String replacement rules.
     */
    replacement?: Excel2YAML.ReplacementConfig[];
    /**
     * Output generation configuration.
     */
    output: Excel2YAML.OutputConfig;
    /**
     * Data transformation configuration.
     */
    transforms?: Excel2YAML.TransformConfig[];
    /**
     * Data exclusion rules.
     */
    excludes?: Excel2YAML.ExcludesConfig;
  }
}
