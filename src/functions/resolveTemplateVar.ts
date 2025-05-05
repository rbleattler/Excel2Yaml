namespace Excel2YAML {
  /**
   * Resolves template variables from various contexts.
   * @param name - Variable name to resolve
   * @param row - Current data row
   * @param context - Current context
   * @param config - Global configuration
   * @returns Resolved value
   */
  export function resolveTemplateVar(name: string, row: Record<string, unknown> | null, context: Record<string, unknown>, config: Config): unknown {
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
}