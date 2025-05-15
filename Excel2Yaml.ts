/**
 * AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.
 * Built for Office Scripts (ExcelScript) single-file requirement.
 */

// File: src\functions\applySpecialDirectives.ts
/**
   * Processes special directives for data handling.
   * @param data - Data to process
   * @param config - Global configuration
   * @returns Processed data
   */function applySpecialDirectives(data: Record<string, unknown>[], config: Config): Record<string, unknown>[] {
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
// File: src\functions\applyTransforms.ts
/**
   * Applies regex transformations to data.
   * @param data - Data to transform
   * @param config - Global configuration
   * @returns Transformed data
   */function applyTransforms(data: Record<string, unknown>[], config: Config): Record<string, unknown>[] {
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
// File: src\functions\buildOutput.ts
/**
   * Recursively builds output structure based on template.
   * @param template - Template structure
   * @param data - Data to process
   * @param context - Current context
   * @returns Processed output structure
   */function buildOutput(template: unknown, data: Record<string, unknown>[], context: Record<string, unknown> = {}, config: Config): unknown {
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
// File: src\functions\evaluateWhere.ts
/**
   * Evaluates complex conditional expressions in where clauses.
   * @param condition - Condition to evaluate
   * @param row - Current data row
   * @param context - Current context
   * @param config - Global configuration
   * @returns Result of condition evaluation
   */function evaluateWhere(condition: string, row: Record<string, unknown>, context: Record<string, unknown>, config: Config): boolean {
    function evaluateSingleCondition(cond: string): boolean {
      const emptyMatch = cond.match(/^<(.+?)>\s*(==|!=)\s*\[\]\s*$/);
      if (emptyMatch) {
        const [, varName, operator] = emptyMatch;
        const rowValue = resolveTemplateVar(varName, row, context, config);
        const rowStr = rowValue == null || String(rowValue).trim() === '' ? '' : String(rowValue).trim();
        return operator === '==' ? rowStr === '' : rowStr !== '';
      }
      const match = cond.match(/^<(.+?)>\s*(==|!=)\s*['"](.*?)['"]\s*$/);
      if (!match) return true;
      const [, varName, operator, value] = match;
      const rowValue = resolveTemplateVar(varName, row, context, config);
      if (operator === '==') {
        return String(rowValue) === value;
      } else {
        return String(rowValue) !== value;
      }
    }
    function parseAndEvaluate(cond: string): boolean {
      while (cond.includes('(')) {
        cond = cond.replace(/\(([^()]+)\)/g, (_, inner) => String(parseAndEvaluate(inner)));
      }
      const orClauses = cond.split(/\s+OR\s+/i);
      if (orClauses.length > 1) {
        return orClauses.some(clause => parseAndEvaluate(clause));
      }
      const andClauses = cond.split(/\s+AND\s+/i);
      if (andClauses.length > 1) {
        return andClauses.every(clause => parseAndEvaluate(clause));
      }
      const notMatch = cond.match(/^NOT\s+(.+)/i);
      if (notMatch) {
        return !parseAndEvaluate(notMatch[1]);
      }
      return evaluateSingleCondition(cond.trim());
    }
    return parseAndEvaluate(condition);
  }
// File: src\functions\filterTableData.ts
/**
   * Filters table data based on exclusion rules.
   * @param data - The data to filter
   * @param excludes - Exclusion rules
   * @returns Filtered data
   */function filterTableData(data: Record<string, unknown>[], excludes: Config['excludes'], config: Config): Record<string, unknown>[] {
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
// File: src\functions\groupBy.ts
/**
   * Groups an array of objects by a specified key.
   * @typeParam T - The type of objects in the array
   * @param arr - Array to group
   * @param key - Key to group by
   * @returns Grouped data
   */function groupBy<T extends { [key: string]: unknown }>(arr: T[], key: string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
      const k: string = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }
// File: src\functions\resolveTemplateVar.ts
/**
   * Resolves template variables from various contexts.
   * @param name - Variable name to resolve
   * @param row - Current data row
   * @param context - Current context
   * @param config - Global configuration
   * @returns Resolved value
   */function resolveTemplateVar(name: string, row: Record<string, unknown> | null, context: Record<string, unknown>, config: Config): unknown {
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
// File: src\functions\toYAML.ts
/**
   * Converts data structure to YAML string with proper formatting.
   * @param obj - Object to convert
   * @param config - Global configuration
   * @param indent - Current indentation level
   * @param isRoot - Whether this is the root object
   * @returns Formatted YAML string
   */function toYAML(obj: unknown, config: Config, indent: number = 0, isRoot: boolean = true): string {
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
// File: src\functions\toYAMLObject.ts
/**
   * Helper function for YAML formatting of individual objects.
   * @param obj - Object to format
   * @param indent - Current indentation level
   * @returns Formatted YAML string
   */function toYAMLObject(obj: unknown, indent: number = 0): string {
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
// File: src\interfaces\Config.ts
/**
   * Main configuration object for the Excel to YAML transformer.
   * @remarks
   * Aggregates all configuration options for the script.
   */interface Config {
    /**
     * Excel sheet configuration.
     */
    excel: ExcelConfig;
    /**
     * Special data handling configuration.
     */
    special?: SpecialConfig;
    /**
     * String replacement rules.
     */
    replacement?: ReplacementConfig[];
    /**
     * Output generation configuration.
     */
    output: OutputConfig;
    /**
     * Data transformation configuration.
     */
    transforms?: TransformConfig[];
    /**
     * Data exclusion rules.
     */
    excludes?: ExcludesConfig;
  }
// File: src\interfaces\ExcelConfig.ts
/**
   * Represents the configuration for an Excel sheet.
   *
   * @public
   * @remarks
   * Used to specify the output worksheet and input table.
   */interface ExcelConfig {
    /**
     * Name of the sheet where output will be written.
     */
    output_sheet_name: string;
    /**
     * Name of the input table containing the data.
     */
    tableName: string;
  }
// File: src\interfaces\ExcludesConfig.ts
/**
   * Configuration for data exclusion rules.
   *
   * @remarks
   * Used to exclude empty values, columns, or groups based on values.
   */interface ExcludesConfig {
    /**
     * Whether to exclude empty values from the data.
     * @example emptyValues: true
     */
    emptyValues?: boolean;
    /**
     * List of columns to exclude.
     * @example excludeColumns: ["ColumnA", "ColumnB"]
     */
    excludeColumns?: string[];
    /**
     * Rules for excluding groups based on values.
     * @example groupingByValue: { "<ColumnName>": "Value" }
     */
    groupingByValue?: Record<string, string | { where: string }>;
  }
// File: src\interfaces\GroupingNode.ts
/**
  * @summary
  * Represents a node in the template that defines grouping and iteration.

  * @public
  * @remarks
  * Used for iterating over groups and applying filters.
  *
  * @property forEach - The property to iterate over
  * @property in - The source of the data
  * @property output - The template for each group's output
  * @property where - Optional filter condition
  */interface GroupingNode {
    /**
     * The property to iterate over.
     * @example // Create the output as a list of players, e.g.:
     * foreach: "<Player>"
     * @example // Create the output as a list of teams, e.g.:
     * foreach: "<Team>"
     * @example // Create the output as a list of positions, e.g.:
     * foreach: "<Position>"
     */
    forEach: string;
    /**
     * The source of the data to be grouped.
     * @example // Filter the target of `in` on the target of forEach, e.g.:
     * foreach: "<Player>"
     * in: "<Team>"
     * @example // Filter the target of `in` on the target of forEach, e.g.:
     * foreach: "<Player>"
     * in: "<Team>"
     * where: "<Position> == 'Forward'"
    */
    in: string;
    /**
     * The template to be applied for this level of grouping.
     * @example // general output
     * output: { "key": "<ColumnName>" }
     * @example // List a player's name, position, and letter
     * output: {
                    name: "<Player>",
                    position: "<Position>",
                    letter: "<Letter>",
                  }
      * @example // List a Player's name, position, letter, and team
                  output: {
                      name: "<Player>",
                      position: "<Position>",
                      letter: "<Letter>",
                      team: "<Team>",
                    }
     */
    output: TemplateNode;
    /**
     *
     * @example // Filter on 'ColumnName' where the value of that column is 'Value'
     * where: "<ColumnName> == 'Value'"
     * @example // Filter on 'ColumnName' where the value of that column is not 'Value'
     * where: "<ColumnName> != 'Value'"
     * @example // Filter on 'ColumnName' where the value of that column is not empty and another column is 'Value'
     * where: "<ColumnName> != '' AND <OtherColumnName> == 'Value'"
     *
    */
    where?: string;
  }
// File: src\interfaces\MappingNode.ts
/**
   * Represents a node in the template that maps keys to values.
   *
   * @module MappingNode
   * @public
   * @remarks
   * Used for mapping output keys to values or nested nodes.
   */interface MappingNode {
    /**
     * Output key mapped to a value or nested node.
     */
    [key: string]: TemplateNode | string | number | boolean;
  }
// File: src\interfaces\OutputConfig.ts
/**
   * Configuration for output generation.
   *
   * @remarks
   * Used to specify output format and template.
   */interface OutputConfig {
    /**
     * Output format (e.g., "yaml").
     */
    as: string;
    /**
     * Template structure for output generation.
     */
    template: OutputTemplate;
  }
// File: src\interfaces\OutputTemplate.ts
/**
   * Defines the structure of the output template.
   *
   * @public
   * @remarks
   * Used to control the output YAML structure and document formatting.
   */interface OutputTemplate {
    /**
     * The root node of the template structure.
     * @link TemplateNode
     */
    root: TemplateNode;
    /**
     * Header to be added to each YAML document.
     * @example
     * If the user wants to add a header to each document, they can set this property to a string that will be added at the top of each document.
     * In YAML, the document separator is `---`.
     * So, if the user sets this property to "---", the output will be:
     * ```yaml
     * ---
     * # CommentProperty
     * ...
     *
     * ---
     * # CommentProperty
     * ...
     * ```
     */
    documentHeader?: string;

    /**
     * Property to be used as a comment in the output.
     * @example
     *
     * If the user wants the heading of each document to be the League the document represents then the user can set this to "League" and the output will be:
     * ```yaml
     * ---
     * # NHL
     * ...
     * ---
     * # AHL
     * ...
     * ```
     * This is useful for generating multiple documents from a single template which are denoted in some way to clarify what they are.
     */
    commentProperty?: string;
  }
// File: src\interfaces\ReplacementConfig.ts
/**
   * Defines a string replacement rule.
   *
   * @public
   * @remarks
   * Used to replace input strings with output strings during transformation.
   */interface ReplacementConfig {
    /**
     * The string to match for replacement.
     */
    input: string;
    /**
     * The string to replace with.
     */
    output: string;
  }
// File: src\interfaces\SpecialConfig.ts
/**
   * Configuration for special data handling operations.
   *
   * @public
   * @remarks
   * Used for advanced template row and group exclusion logic.
   */interface SpecialConfig {
    /**
     * Defines template rows that should be applied across all groups.
     */
    applyToAll?: Record<string, string>;
    /**
     * Defines groups that should be excluded from processing.
     */
    excludeGrouping?: Record<string, string>;
  }
// File: src\interfaces\TemplateNode.ts
/**
   * TemplateNode type for recursive template structures.
   *
   * @remarks
   * Used to represent any node in the template tree.
   */type TemplateNode = MappingNode | GroupingNode | string | number | boolean;
// File: src\interfaces\TransformConfig.ts
/**
   * Configuration for data transformations.
   *
   * @remarks
   * Used to define regex-based transformations for columns.
   */interface TransformConfig {
    /**
     * Regular expression pattern for transformation.
     */
    regexp: string;
    /**
     * Name of the column to transform.
     */
    name: string;
  }

// File: src\config.ts
/**
 * Configuration object for Excel2YAML Office Script.
 *
 * @remarks
 * Update this file to change the script's behavior. This will be inlined for Office Scripts.
 */const config: Config = {
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
              captains: {
                forEach: "<Player>",
                in: "<Team>",
                where: "<Letter> == 'C' OR <Letter> == 'A'",
                output: {
                  name: "<Player>",
                  position: "<Position>",
                  letter: "<Letter>",
                },
              },
              defense: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'D' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'D'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              },
              offense: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'W' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'W'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              },
              goaltender: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'G' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'G'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              }
            },
          },
        },
      },
      documentHeader: "---",
      commentProperty: "League",
    },
  },
  transforms: [],
  excludes: {
    emptyValues: false,
    excludeColumns: [],
    groupingByValue: {},
  },
};

// File: src\main.ts
/// <reference path="./functions/getTableData.ts" />
/// <reference path="./functions/filterTableData.ts" />
/// <reference path="./functions/applyTransforms.ts" />
/// <reference path="./functions/applySpecialDirectives.ts" />
/// <reference path="./functions/buildOutput.ts" />
/// <reference path="./functions/toYAML.ts" />
/// <reference path="../excel.d.ts" />


/**
   * Converts Excel table data into an array of objects.
   * @param table - The Excel table to process
   * @returns Array of objects representing table rows
   */function getTableData(table: ExcelScript.Table): Record<string, unknown>[] {
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
 */function main(workbook: ExcelScript.Workbook): void {
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


