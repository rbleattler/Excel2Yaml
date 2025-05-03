/**
 * TemplateNode type for recursive template structures.
 *
 * @remarks
 * Used to represent any node in the template tree.
 */
import { MappingNode } from './MappingNode';
import { GroupingNode } from './GroupingNode';

export type TemplateNode = MappingNode | GroupingNode | string | number | boolean;
