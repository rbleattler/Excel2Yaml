/**
 * Configuration for special data handling operations.
 *
 * @public
 * @remarks
 * Used for advanced template row and group exclusion logic.
 *
 * @property applyToAll - Defines template rows that should be applied across all groups
 * @property excludeGrouping - Defines groups that should be excluded from processing
 */
export interface SpecialConfig {
  applyToAll?: Record<string, string>;
  excludeGrouping?: Record<string, string>;
}
