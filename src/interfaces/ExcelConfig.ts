/**
 * Represents the configuration for an Excel sheet.
 *
 * @public
 * @remarks
 * Used to specify the output worksheet and input table.
 *
 * @property output_sheet_name - Name of the sheet where output will be written
 * @property tableName - Name of the input table containing the data
 */
export interface ExcelConfig {
  output_sheet_name: string;
  tableName: string;
}
