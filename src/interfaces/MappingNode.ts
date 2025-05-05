namespace Excel2YAML {
  /**
   * Represents a node in the template that maps keys to values.
   *
   * @module MappingNode
   * @public
   * @remarks
   * Used for mapping output keys to values or nested nodes.
   */
  export interface MappingNode {
    /**
     * Output key mapped to a value or nested node.
     */
    [key: string]: TemplateNode | string | number | boolean;
  }
}
