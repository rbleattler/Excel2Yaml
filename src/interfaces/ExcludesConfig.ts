/**
 * Configuration for data exclusion rules.
 *
 * @public
 * @remarks
 * Used to exclude empty values, columns, or groups based on values.
 *
 * @property emptyValues - Whether to exclude empty values
 * @property excludeColumns - List of columns to exclude
 * @property groupingByValue - Rules for excluding groups based on values
 */
export interface ExcludesConfig {
  emptyValues?: boolean;
  excludeColumns?: string[];
  groupingByValue?: Record<string, string | { where: string }>;
}
