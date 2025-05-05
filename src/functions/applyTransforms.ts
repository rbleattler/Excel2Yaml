namespace Excel2YAML {
  /**
   * Applies regex transformations to data.
   * @param data - Data to transform
   * @param config - Global configuration
   * @returns Transformed data
   */
  export function applyTransforms(data: Record<string, unknown>[], config: Config): Record<string, unknown>[] {
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
}