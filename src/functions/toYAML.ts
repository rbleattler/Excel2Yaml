namespace Excel2YAML {
  /**
   * Converts data structure to YAML string with proper formatting.
   * @param obj - Object to convert
   * @param config - Global configuration
   * @param indent - Current indentation level
   * @param isRoot - Whether this is the root object
   * @returns Formatted YAML string
   */
  export function toYAML(obj: unknown, config: Config, indent: number = 0, isRoot: boolean = true): string {
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
}