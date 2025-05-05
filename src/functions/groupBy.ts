namespace Excel2YAML {
  /**
   * Groups an array of objects by a specified key.
   * @typeParam T - The type of objects in the array
   * @param arr - Array to group
   * @param key - Key to group by
   * @returns Grouped data
   */
  export function groupBy<T extends { [key: string]: unknown }>(arr: T[], key: string): Record<string, T[]> {
    return arr.reduce((acc, item) => {
      const k: string = String(item[key]);
      if (!acc[k]) acc[k] = [];
      acc[k].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }
}