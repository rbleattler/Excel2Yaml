// Uncomment this line if you are using a local TypeScript environment with ExcelScript types
// Comment this line if you are using the Office Scripts environment in Excel
// The types file is available at: https://github.com/OfficeDev/office-scripts-docs-reference/blob/main/generate-docs/api-extractor-inputs-excel/excel.d.ts
import { ExcelScript } from "./excel"

/**
 * Generic Excel table to YAML transformer based on a configuration template.
 * This script is designed to work with any table and template structure.
 */

// Heredoc string for the configuration JSON (replace with actual config as needed)
interface Config {
  excel: { output_sheet_name: string; tableName: string };
  special?: {
    applyToAll?: Record<string, string>;
    excludeGrouping?: Record<string, string>;
  };
  replacement?: {
    input: string
    output: string;
  }[];
  output: {
    as: string;
    template: {
      root: unknown;
      documentHeader?: string;
      commentProperty?: string;
    }
  } & Record<string, unknown>;
  transforms?: {
    regexp: string;
    name: string;
  }[];
  excludes?: {
    emptyValues?: boolean;
    excludeColumns?: string[];
    groupingByValue?: Record<string, string>;
  };
}

// Configuration object for the script, update this to match your needs

const config: Config = {
  excel: {
    output_sheet_name: "Output",
    tableName: "Table1",
  },
  special: {
    applyToAll: {},
    excludeGrouping: {},
  },
  replacement: [],
  output: {
    as: "yaml",
    template: {
      root: {
        forEach: "<League>",
        in: "<tableName>",
        output: {
          team: {
            forEach: "<Team>",
            in: "<League>",
            output: {
              name: "<Team>",
              lines: {
                forEach: "<Line>",
                in: "<Team>",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                      letter: "<Letter>",
                    },
                  },
                },
              },
            },
          },
        },
      },
      documentHeader: "---",
      commentProperty: "League",
    },
  },
  transforms: [
    // Match the regex and name to your needs
    // {
    //   regexp:
    //     "",
    //   name: "Column Name",
    // },
  ],
  excludes: {
    emptyValues: false,
    excludeColumns: [],
    groupingByValue: {
    },
  },
};


// Utility: Get table data as array of objects
function getTableData(table: ExcelScript.Table): Record<string, unknown>[] {
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

// Utility: Exclude columns and empty values
function filterTableData(data: Record<string, unknown>[], excludes: Config['excludes']): Record<string, unknown>[] {
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
    for (const [column, valueToExclude] of Object.entries(excludes.groupingByValue)) {
      filtered = filtered.filter(row => String(row[column]) !== String(valueToExclude));
    }
  }
  return filtered;
}

// Utility: Group by a column value
function groupBy<T extends { [key: string]: unknown }>(arr: T[], key: string): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k: string = String(item[key]);
    if (!acc[k]) acc[k] = [];
    acc[k].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

// Utility: Resolve template variable from row, context, or config
function resolveTemplateVar(name: string, row: Record<string, unknown> | null, context: Record<string, unknown>, config: Config): unknown {
  let value: unknown = undefined;
  if (row && name in row) value = row[name];
  else if (context && name in context) value = context[name];
  else if (name === 'tableName') value = config.excel.tableName;

  if (typeof value === 'string' && config.replacement) {
    for (const rep of config.replacement) {
      if (value === rep.input) {
        value = rep.output;
        break;
      }
    }
  }
  return value;
}

// Utility: Recursively build output structure from template
function buildOutput(template: unknown, data: Record<string, unknown>[], context: Record<string, unknown> = {}): unknown {
  if (typeof template !== 'object' || template === null) {
    if (typeof template === 'string' && template.match(/^<.+>$/)) {
      const varName = template.replace(/[<>]/g, '');
      return resolveTemplateVar(varName, data.length > 0 ? data[0] : null, context, config);
    }
    return template;
  }

  if (Array.isArray(template)) {
    return template.map(item => buildOutput(item, data, context));
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

      const newContext = { ...context, [groupCol]: groupKey };
      const groupOutput = buildOutput(templateObj.output, groupRows, newContext);

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
            rowOutput[key] = buildOutput(valueTemplate, [row], context);
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
          output[key] = buildOutput(valueTemplate, data, context);
        }
      }
      return output;
    }
  }
}

// Utility: Apply regex transformations
function applyTransforms(data: Record<string, unknown>[]): Record<string, unknown>[] {
  if (!config.transforms || config.transforms.length === 0) return data;

  return data.map(item => {
    const newItem = { ...item };
    for (const transform of config.transforms!) {
      if (transform.regexp && transform.name) {
        const columnName = transform.name;
        const value = String(newItem[columnName] || '');
        const regex = new RegExp(transform.regexp);
        const match = regex.exec(value);
        if (match && match[1]) {
          newItem[`original_${columnName}`] = value;
          newItem[columnName] = match[1].toLowerCase();
        }
      }
    }
    return newItem;
  });
}

// Utility: Handle special directives like applying template rows to all groups
function applySpecialDirectives(data: Record<string, unknown>[]): Record<string, unknown>[] {
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

// Rewritten YAML stringifier for proper indentation and formatting
function toYAML(obj: unknown, indent: number = 0, isRoot: boolean = true): string {
  if (obj === null || obj === undefined) return '';

  if (isRoot && Array.isArray(obj)) {
    const documentHeader = config.output.template.documentHeader || '---';
    const commentProperty = config.output.template.commentProperty || '';

    return obj.map((item: object, index) => {
      let docString = index > 0 ? `\n${documentHeader}\n` : `${documentHeader}\n`;
      let itemToFormat = item;

      if (commentProperty && item && typeof item === 'object' && commentProperty in item) {
        const commentValue = (item as Record<string, unknown>)[commentProperty];
        docString += `# ${commentValue}\n\n`;
        itemToFormat = { ...item as object };
        delete (itemToFormat as Record<string, unknown>)[commentProperty];
      }

      return docString + toYAMLObject(itemToFormat, indent);
    }).join('');
  }

  return toYAMLObject(obj, indent);
}

// Rewritten helper for YAML formatting with proper list indentation
function toYAMLObject(obj: unknown, indent: number = 0): string {
  if (obj === null || obj === undefined) return 'null';

  const pad = '  '.repeat(indent);

  if (Array.isArray(obj)) {
    if (obj.length === 0) return '[]';
    const itemIndent = indent + 1;
    return obj.map(item => {
      const itemYaml = toYAMLObject(item, itemIndent);
      if (itemYaml.includes('\n')) {
        const lines = itemYaml.split('\n');
        const itemPad = '  '.repeat(itemIndent);
        const firstLineContent = lines[0].startsWith(itemPad) ? lines[0].substring(itemPad.length) : lines[0];
        const firstLine = `${pad}- ${firstLineContent}`;
        const restLines = lines.slice(1).map(line => {
          const lineContent = line.startsWith(itemPad) ? line.substring(itemPad.length) : line;
          return `${pad}  ${lineContent}`;
        });
        return [firstLine, ...restLines].join('\n');
      } else {
        return `${pad}- ${itemYaml}`;
      }
    }).join('\n');
  } else if (typeof obj === 'object' && obj !== null) {
    const entries = Object.entries(obj);
    if (entries.length === 0) return '{}';
    const valueIndent = indent + 1;
    return entries.map(([k, v]: [string, unknown]) => {
      const valueYaml = toYAMLObject(v, valueIndent);
      if (valueYaml.includes('\n')) {
        return `${pad}${k}:\n${valueYaml}`;
      } else {
        return `${pad}${k}: ${valueYaml}`;
      }
    }).join('\n');
  } else {
    const valueStr = String(obj);
    if (typeof obj === 'string' && (valueStr.includes(': ') || valueStr.startsWith('-') || valueStr.startsWith('{') || valueStr.startsWith('[') || ['null', 'true', 'false'].includes(valueStr.toLowerCase()))) {
      return `'${valueStr.replace(/'/g, "''")}'`;
    }
    return valueStr;
  }
}

// Main function to run in Excel
function main(workbook: ExcelScript.Workbook): void {
  const table: ExcelScript.Table | undefined = workbook.getTable(config.excel.tableName);
  if (!table) throw new Error("Table not found: " + config.excel.tableName);

  let data: Record<string, unknown>[] = getTableData(table);
  data = filterTableData(data, config.excludes);
  data = applyTransforms(data);
  data = applySpecialDirectives(data);

  const output: unknown = buildOutput(config.output.template.root, data);
  const yaml: string = toYAML(output);

  let sheet: ExcelScript.Worksheet | undefined = workbook.getWorksheet(config.excel.output_sheet_name);
  if (!sheet) sheet = workbook.addWorksheet(config.excel.output_sheet_name);
  sheet.getRange("A1").setValue(yaml);
  sheet.activate();
}

// No export line needed for Office Scripts