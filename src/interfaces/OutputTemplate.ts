/**
 * Defines the structure of the output template.
 *
 * @public
 * @remarks
 * Used to control the output YAML structure and document formatting.
 *
 * @property root - The root node of the template structure
 * @property documentHeader - Header to be added to each YAML document
 * @property commentProperty - Property to be used as a comment in the output
 */
import { TemplateNode } from './TemplateNode';

export interface OutputTemplate {
  root: TemplateNode;
  documentHeader?: string;
  commentProperty?: string;
}
