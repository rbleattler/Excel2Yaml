/**
 * Converts Excel table data into an array of objects.
 * @param table - The Excel table to process
 * @returns Array of objects representing table rows
 */

import { ExcelScript } from "../../excel";

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
