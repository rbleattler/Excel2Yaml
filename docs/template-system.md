# Template System

The template system lets you define how your Excel data is mapped and grouped into YAML. Templates are defined in the `config.output.template` section.

## Structure

A template is a nested object that describes how to group, filter, and map your table data to YAML. The main keys are:

- `forEach`: The column to group by (e.g., `<League>`)
- `in`: The parent group or table (e.g., `<tableName>`)
- `output`: The structure to output for each group
- `where`: (Optional) A condition to filter rows within a group

## Example Template

```ts
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
                where: "<Position> == 'D'",
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
}
```

## Grouping and Nesting

- Use `forEach` and `in` to group data at multiple levels (e.g., League > Team > Line > Player).
- Each level can have its own `where` filter.

## Filtering with `where`

- The `where` property lets you filter rows within a group.
- Supports logical operators (`AND`, `OR`, `NOT`), parentheses, and empty checks (`== []`, `!= []`).
- Example: `where: "<Position> == 'D' AND <Letter> != ''"`

## Variable Syntax

- Use `<ColumnName>` to reference a column from your Excel table.
- See [Variables](variables.md) for details and supported syntax.

## Best Practices

- Always match `<ColumnName>` to your actual Excel column headers (case-sensitive).
- Use `where` to filter out unwanted rows at any grouping level.
- Use `documentHeader` and `commentProperty` for multi-document YAML output.

See [Examples](examples/readme.md) for real-world templates.
