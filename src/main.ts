/// <reference path="./functions/getTableData.ts" />
/// <reference path="./functions/filterTableData.ts" />
/// <reference path="./functions/applyTransforms.ts" />
/// <reference path="./functions/applySpecialDirectives.ts" />
/// <reference path="./functions/buildOutput.ts" />
/// <reference path="./functions/toYAML.ts" />
/// <reference path="../excel.d.ts" />


import { ExcelScript } from "../excel";
import { config } from "./config";



/**
   * Converts Excel table data into an array of objects.
   * @param table - The Excel table to process
   * @returns Array of objects representing table rows
   */
export function getTableData(table: ExcelScript.Table): Record<string, unknown>[] {
  const headers: string[] = table.getHeaderRowRange().getValues()[0] as string[];
  const rows: (string | number | boolean)[][] = table.getRange().getValues().slice(1);
  return rows.map(row => {
    const result: Record<string, unknown> = {};
    for (let i = 0; i < headers.length; i++) {
      result[headers[i]] = row[i];
    }
    return result;
  });
}


/**
 * Main entry point for the Excel to YAML transformation.
 * @param workbook - The Excel workbook to process
 */
export function main(workbook: ExcelScript.Workbook): void {
  const table: ExcelScript.Table | undefined = workbook.getTable(config.excel.tableName);
  if (!table) throw new Error("Table not found: " + config.excel.tableName);
  let data: Record<string, unknown>[] = getTableData(table);
  data = Excel2YAML.filterTableData(data, config.excludes, config);
  data = Excel2YAML.applyTransforms(data, config);
  data = Excel2YAML.applySpecialDirectives(data, config);
  const output: unknown = Excel2YAML.buildOutput(config.output.template.root, data, {}, config);
  const yaml: string = Excel2YAML.toYAML(output, config);
  let sheet: ExcelScript.Worksheet | undefined = workbook.getWorksheet(config.excel.output_sheet_name);
  if (!sheet) sheet = workbook.addWorksheet(config.excel.output_sheet_name);
  sheet.getRange("A1").setValue(yaml);
  sheet.activate();
}

