/**
 * Main entry point for the Excel to YAML transformation.
 * @param workbook - The Excel workbook to process
 */

import { ExcelScript } from "./excel";
import { config } from "./config";
import { getTableData } from "./functions/getTableData";
import { filterTableData } from "./functions/filterTableData";
import { applyTransforms } from "./functions/applyTransforms";
import { applySpecialDirectives } from "./functions/applySpecialDirectives";
import { buildOutput } from "./functions/buildOutput";
import { toYAML } from "./functions/toYAML";

function main(workbook: ExcelScript.Workbook): void {
  const table: ExcelScript.Table | undefined = workbook.getTable(config.excel.tableName);
  if (!table) throw new Error("Table not found: " + config.excel.tableName);
  let data: Record<string, unknown>[] = getTableData(table);
  data = filterTableData(data, config.excludes, config);
  data = applyTransforms(data, config);
  data = applySpecialDirectives(data, config);
  const output: unknown = buildOutput(config.output.template.root, data, {}, config);
  const yaml: string = toYAML(output, config);
  let sheet: ExcelScript.Worksheet | undefined = workbook.getWorksheet(config.excel.output_sheet_name);
  if (!sheet) sheet = workbook.addWorksheet(config.excel.output_sheet_name);
  sheet.getRange("A1").setValue(yaml);
  sheet.activate();
}
