/**
 * Configuration for data transformations.
 *
 * @public
 * @remarks
 * Used to define regex-based transformations for columns.
 *
 * @property regexp - Regular expression pattern for transformation
 * @property name - Name of the column to transform
 */
export interface TransformConfig {
  regexp: string;
  name: string;
}
