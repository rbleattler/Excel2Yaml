/**
 * Configuration for output generation.
 *
 * @public
 * @remarks
 * Used to specify output format and template.
 *
 * @property as - Output format (e.g., "yaml")
 * @property template - Template structure for output generation
 */
import { OutputTemplate } from './OutputTemplate';

export interface OutputConfig {
  as: string;
  template: OutputTemplate;
}
