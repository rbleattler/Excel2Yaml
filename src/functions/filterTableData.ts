/**
 * Filters table data based on exclusion rules.
 * @param data - The data to filter
 * @param excludes - Exclusion rules
 * @returns Filtered data
 */
import { Config } from "../interfaces/Config";
import { evaluateWhere } from "./evaluateWhere";

export function filterTableData(data: Record<string, unknown>[], excludes: Config['excludes'], config: Config): Record<string, unknown>[] {
  if (!excludes) return data;
  let filtered = data;
  if (excludes.excludeColumns) {
    filtered = filtered.map(row => {
      const copy = { ...row };
      for (const col of excludes.excludeColumns!) delete (copy as Record<string, unknown>)[col];
      return copy;
    });
  }
  if (excludes.emptyValues) {
    filtered = filtered.filter(row => Object.values(row).every(v => v !== null && v !== undefined && v !== ''));
  }
  if (excludes.groupingByValue) {
    filtered = filtered.filter(row => {
      for (const [column, condition] of Object.entries(excludes.groupingByValue!)) {
        const colName = column.replace(/[<>]/g, '');
        if (typeof condition === 'string') {
          if (String(row[colName]) === condition) return false;
        } else {
          if (evaluateWhere(condition.where, row, {}, config)) return false;
        }
      }
      return true;
    });
  }
  return filtered;
}
