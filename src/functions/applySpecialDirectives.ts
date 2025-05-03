/**
 * Processes special directives for data handling.
 * @param data - Data to process
 * @param config - Global configuration
 * @returns Processed data
 */
import { Config } from "../interfaces/Config";
export function applySpecialDirectives(data: Record<string, unknown>[], config: Config): Record<string, unknown>[] {
  if (!config.special?.applyToAll) return data;
  const applyConfig = config.special.applyToAll;
  const excludeConfig = config.special.excludeGrouping;
  let processedData = [...data];
  for (const [columnName, templateValue] of Object.entries(applyConfig)) {
    const templateEntries = processedData.filter(item => String(item[columnName]).trim() === templateValue);
    if (templateEntries.length === 0) continue;
    const regularEntries = processedData.filter(item => String(item[columnName]).trim() !== templateValue);
    if (regularEntries.length === 0) continue;
    const uniqueKeys = Array.from(new Set(regularEntries.map(item => String(item[columnName]))));
    const result: Record<string, unknown>[] = [...regularEntries];
    for (const key of uniqueKeys) {
      for (const templateEntry of templateEntries) {
        const newEntry = { ...templateEntry, [columnName]: key };
        result.push(newEntry);
      }
    }
    const shouldExclude = excludeConfig && excludeConfig[columnName] === templateValue;
    processedData = shouldExclude ? result : [...result, ...templateEntries];
  }
  return processedData;
}
