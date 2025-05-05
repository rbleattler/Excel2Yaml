
namespace Excel2YAML {
  /**
  * @summary
  * Represents a node in the template that defines grouping and iteration.

  * @public
  * @remarks
  * Used for iterating over groups and applying filters.
  *
  * @property forEach - The property to iterate over
  * @property in - The source of the data
  * @property output - The template for each group's output
  * @property where - Optional filter condition
  */
  export interface GroupingNode {
    /**
     * The property to iterate over.
     * @example // Create the output as a list of players, e.g.:
     * foreach: "<Player>"
     * @example // Create the output as a list of teams, e.g.:
     * foreach: "<Team>"
     * @example // Create the output as a list of positions, e.g.:
     * foreach: "<Position>"
     */
    forEach: string;
    /**
     * The source of the data to be grouped.
     * @example // Filter the target of `in` on the target of forEach, e.g.:
     * foreach: "<Player>"
     * in: "<Team>"
     * @example // Filter the target of `in` on the target of forEach, e.g.:
     * foreach: "<Player>"
     * in: "<Team>"
     * where: "<Position> == 'Forward'"
    */
    in: string;
    /**
     * The template to be applied for this level of grouping.
     * @example // general output
     * output: { "key": "<ColumnName>" }
     * @example // List a player's name, position, and letter
     * output: {
                    name: "<Player>",
                    position: "<Position>",
                    letter: "<Letter>",
                  }
      * @example // List a Player's name, position, letter, and team
                  output: {
                      name: "<Player>",
                      position: "<Position>",
                      letter: "<Letter>",
                      team: "<Team>",
                    }
     */
    output: Excel2YAML.TemplateNode;
    /**
     *
     * @example // Filter on 'ColumnName' where the value of that column is 'Value'
     * where: "<ColumnName> == 'Value'"
     * @example // Filter on 'ColumnName' where the value of that column is not 'Value'
     * where: "<ColumnName> != 'Value'"
     * @example // Filter on 'ColumnName' where the value of that column is not empty and another column is 'Value'
     * where: "<ColumnName> != '' AND <OtherColumnName> == 'Value'"
     *
    */
    where?: string;
  }
}
