/**
 * Configuration object for Excel2YAML Office Script.
 *
 * @remarks
 * Update this file to change the script's behavior. This will be inlined for Office Scripts.
 */
// import { Config } from './interfaces/Config';


export const config: Excel2YAML.Config = {
  excel: {
    output_sheet_name: "Output",
    tableName: "Table1",
  },
  special: {
    applyToAll: {},
    excludeGrouping: {},
  },
  replacement: [],
  output: {
    as: "yaml",
    template: {
      root: {
        forEach: "<League>",
        in: "<tableName>",
        output: {
          team: {
            forEach: "<Team>",
            in: "<League>",
            output: {
              name: "<Team>",
              captains: {
                forEach: "<Player>",
                in: "<Team>",
                where: "<Letter> == 'C' OR <Letter> == 'A'",
                output: {
                  name: "<Player>",
                  position: "<Position>",
                  letter: "<Letter>",
                },
              },
              defense: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'D' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'D'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              },
              offense: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'W' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'W'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              },
              goaltender: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Position> == 'G' AND <Player> != []",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    where: "<Position> == 'G'",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              }
            },
          },
        },
      },
      documentHeader: "---",
      commentProperty: "League",
    },
  },
  transforms: [],
  excludes: {
    emptyValues: false,
    excludeColumns: [],
    groupingByValue: {},
  },
};
