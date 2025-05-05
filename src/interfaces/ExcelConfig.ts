namespace Excel2YAML {
  /**
   * Represents the configuration for an Excel sheet.
   *
   * @public
   * @remarks
   * Used to specify the output worksheet and input table.
   */
  export interface ExcelConfig {
    /**
     * Name of the sheet where output will be written.
     */
    output_sheet_name: string;
    /**
     * Name of the input table containing the data.
     */
    tableName: string;
  }
}
