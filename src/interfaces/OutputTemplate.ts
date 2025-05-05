namespace Excel2YAML {
  /**
   * Defines the structure of the output template.
   *
   * @public
   * @remarks
   * Used to control the output YAML structure and document formatting.
   */
  export interface OutputTemplate {
    /**
     * The root node of the template structure.
     * @link TemplateNode
     */
    root: Excel2YAML.TemplateNode;
    /**
     * Header to be added to each YAML document.
     * @example
     * If the user wants to add a header to each document, they can set this property to a string that will be added at the top of each document.
     * In YAML, the document separator is `---`.
     * So, if the user sets this property to "---", the output will be:
     * ```yaml
     * ---
     * # CommentProperty
     * ...
     *
     * ---
     * # CommentProperty
     * ...
     * ```
     */
    documentHeader?: string;

    /**
     * Property to be used as a comment in the output.
     * @example
     *
     * If the user wants the heading of each document to be the League the document represents then the user can set this to "League" and the output will be:
     * ```yaml
     * ---
     * # NHL
     * ...
     * ---
     * # AHL
     * ...
     * ```
     * This is useful for generating multiple documents from a single template which are denoted in some way to clarify what they are.
     */
    commentProperty?: string;
  }
}
