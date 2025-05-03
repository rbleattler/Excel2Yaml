/**
 * Main configuration object for the Excel to YAML transformer.
 *
 * @public
 * @remarks
 * Aggregates all configuration options for the script.
 */
import { ExcelConfig } from './ExcelConfig';
import { SpecialConfig } from './SpecialConfig';
import { ReplacementConfig } from './ReplacementConfig';
import { OutputConfig } from './OutputConfig';
import { TransformConfig } from './TransformConfig';
import { ExcludesConfig } from './ExcludesConfig';

export interface Config {
  excel: ExcelConfig;
  special?: SpecialConfig;
  replacement?: ReplacementConfig[];
  output: OutputConfig;
  transforms?: TransformConfig[];
  excludes?: ExcludesConfig;
}
