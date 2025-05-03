
/**
 * Represents a node in the template that defines grouping and iteration.
*
* @remarks
 * Used for iterating over groups and applying filters.
 *
 * @property forEach - The property to iterate over
 * @property in - The source of the data
 * @property output - The template for each group's output
 * @property where - Optional filter condition
*/
import { TemplateNode } from "../interfaces/TemplateNode";

export interface GroupingNode {
  forEach: string;
  in: string;
  output: TemplateNode;
  where?: string;
}
