
/**
 * Represents a node in the template that maps keys to values.
*
* @remarks
* Used for mapping output keys to values or nested nodes.
*/
import { TemplateNode } from "../interfaces/TemplateNode";
export interface MappingNode {
  [key: string]: TemplateNode | string | number | boolean;
}
