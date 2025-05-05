namespace Excel2YAML {
  /**
   * TemplateNode type for recursive template structures.
   *
   * @remarks
   * Used to represent any node in the template tree.
   */
  export type TemplateNode = Excel2YAML.MappingNode | Excel2YAML.GroupingNode | string | number | boolean;
}
