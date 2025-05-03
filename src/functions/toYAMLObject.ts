/**
 * Helper function for YAML formatting of individual objects.
 * @param obj - Object to format
 * @param indent - Current indentation level
 * @returns Formatted YAML string
 */
export function toYAMLObject(obj: unknown, indent: number = 0): string {
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
