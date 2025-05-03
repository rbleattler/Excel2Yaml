/**
 * Recursively builds output structure based on template.
 * @param template - Template structure
 * @param data - Data to process
 * @param context - Current context
 * @returns Processed output structure
 */
import { Config } from "../interfaces/Config";
import { groupBy } from "./groupBy";
import { resolveTemplateVar } from "./resolveTemplateVar";
import { evaluateWhere } from "./evaluateWhere";

export function buildOutput(template: unknown, data: Record<string, unknown>[], context: Record<string, unknown> = {}, config: Config): unknown {
  if (typeof template !== 'object' || template === null) {
    if (typeof template === 'string' && template.match(/^<.+>$/)) {
      const varName = template.replace(/[<>]/g, '');
      return resolveTemplateVar(varName, data.length > 0 ? data[0] : null, context, config);
    }
    return template;
  }
  if (Array.isArray(template)) {
    return template.map(item => buildOutput(item, data, context, config));
  }
  const templateObj = template as Record<string, unknown>;
  if (templateObj.forEach && templateObj.in && templateObj.output) {
    const groupCol = String(templateObj.forEach).replace(/[<>]/g, '');
    const groupedData = groupBy(data, groupCol);
    const excludeConfig = config.special?.excludeGrouping;
    const excludeValue = excludeConfig ? excludeConfig[groupCol] : undefined;
    const results: unknown[] = [];
    Object.entries(groupedData).forEach(([groupKey, groupRows]) => {
      if (excludeValue !== undefined && groupKey === excludeValue) {
        return;
      }
      let filteredRows = groupRows;
      if (templateObj.where && typeof templateObj.where === 'string') {
        filteredRows = groupRows.filter(row => evaluateWhere(templateObj.where as string, row, context, config));
        if (filteredRows.length === 0) return;
      }
      const newContext = { ...context, [groupCol]: groupKey };
      const groupOutput = buildOutput(templateObj.output, filteredRows, newContext, config);
      const commentProperty = config.output.template.commentProperty;
      let processedOutput = groupOutput;
      if (commentProperty && groupCol === commentProperty && typeof groupOutput === 'object' && groupOutput !== null && !(Array.isArray(groupOutput))) {
        processedOutput = { [commentProperty]: groupKey, ...(groupOutput as object) };
      } else if (commentProperty && groupCol === commentProperty && Array.isArray(groupOutput)) {
        processedOutput = groupOutput.map(item => {
          if (typeof item === 'object' && item !== null) {
            return { [commentProperty]: groupKey, ...(item as object) };
          }
          return item;
        });
      }
      if (Array.isArray(processedOutput)) {
        results.push(...processedOutput);
      } else {
        results.push(processedOutput);
      }
    });
    return results;
  } else {
    const templateUsesRowData = Object.values(templateObj).some(v =>
      typeof v === 'string' && v.match(/^<.+>$/) && !(v.replace(/[<>]/g, '') in context)
    );
    if (templateUsesRowData && data.length > 0) {
      return data.map(row => {
        const rowOutput: Record<string, unknown> = {};
        for (const [key, valueTemplate] of Object.entries(templateObj)) {
          if (typeof valueTemplate === 'string' && valueTemplate.match(/^<.+>$/)) {
            const varName = valueTemplate.replace(/[<>]/g, '');
            rowOutput[key] = resolveTemplateVar(varName, row, context, config);
          } else {
            rowOutput[key] = buildOutput(valueTemplate, [row], context, config);
          }
        }
        return rowOutput;
      });
    } else {
      const output: Record<string, unknown> = {};
      const currentRow = data.length > 0 ? data[0] : null;
      for (const [key, valueTemplate] of Object.entries(templateObj)) {
        if (typeof valueTemplate === 'string' && valueTemplate.match(/^<.+>$/)) {
          const varName = valueTemplate.replace(/[<>]/g, '');
          output[key] = resolveTemplateVar(varName, currentRow, context, config);
        } else {
          output[key] = buildOutput(valueTemplate, data, context, config);
        }
      }
      return output;
    }
  }
}
