# Example 1: Organize NHL Teams and Players

## Use Case

You have an Excel table of hockey players with columns for League, Team, Position, Player, Line, and Letter (C/A for captain/alternate). You want to generate a YAML file that groups players by league and team, lists captains, and organizes players by line and position.

## Configuration

```typescript
const config: Config = {
  excel: {
    output_sheet_name: "Output",
    tableName: "Table1",
  },
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
              lines: {
                forEach: "<Line>",
                in: "<Team>",
                where: "<Line> != ''",
                output: {
                  line: "<Line>",
                  players: {
                    forEach: "<Player>",
                    in: "<Line>",
                    output: {
                      name: "<Player>",
                      position: "<Position>",
                    },
                  },
                },
              },
            },
          },
        },
      },
      documentHeader: "---",
      commentProperty: "League",
    },
  },
  excludes: {},
};
```

## Input Table

| League | Team     | Position | Player           | Line | Letter |
|--------|----------|----------|------------------|------|--------|
| NHL    | Flyers   | W        | Konecny, Travis  | 1    | A      |
| NHL    | Flyers   | C        | Couturier, Sean  | 1    | C      |
| NHL    | Flyers   | D        | Provorov, Ivan   | 1    |        |
| NHL    | Flyers   | W        | Farabee, Joel    | 2    |        |
| NHL    | Flyers   | D        | Sanheim, Travis  | 2    |        |
| NHL    | Flyers   | G        | Hart, Carter     | 1    |        |
| NHL    | Penguins | C        | Crosby, Sidney   | 1    | C      |
| NHL    | Penguins | W        | Guentzel, Jake   | 1    |        |
| NHL    | Penguins | D        | Letang, Kris     | 1    | A      |
| NHL    | Penguins | G        | Jarry, Tristan   | 1    |        |
| AHL    | Phantoms | W        | Wilson, Garrett  | 1    | C      |
| AHL    | Phantoms | D        | Zamula, Egor     | 1    |        |

## Expected YAML Output

```yaml
---
# NHL
team:
  - name: Flyers
    captains:
      - name: Konecny, Travis
        position: W
        letter: A
      - name: Couturier, Sean
        position: C
        letter: C
    lines:
      - line: 1
        players:
          - name: Konecny, Travis
            position: W
          - name: Couturier, Sean
            position: C
          - name: Provorov, Ivan
            position: D
          - name: Hart, Carter
            position: G
      - line: 2
        players:
          - name: Farabee, Joel
            position: W
          - name: Sanheim, Travis
            position: D
  - name: Penguins
    captains:
      - name: Crosby, Sidney
        position: C
        letter: C
      - name: Letang, Kris
        position: D
        letter: A
    lines:
      - line: 1
        players:
          - name: Crosby, Sidney
            position: C
          - name: Guentzel, Jake
            position: W
          - name: Letang, Kris
            position: D
          - name: Jarry, Tristan
            position: G
---
# AHL
team:
  - name: Phantoms
    captains:
      - name: Wilson, Garrett
        position: W
        letter: C
    lines:
      - line: 1
        players:
          - name: Wilson, Garrett
            position: W
          - name: Zamula, Egor
            position: D
```

## Notes

- The template groups by League, then Team, then Line, and filters captains using the `where` clause.
- You can adjust the template in the script config to match your own table structure.
- This example assumes the table is named `Table1` in Excel.
