# Variables

Variables in Excel2Yaml templates let you reference data from your Excel table dynamically.

## Syntax

- `<ColumnName>`: Inserts the value from the column named `ColumnName` for the current row or group.
- The variable name must match the column header exactly (case-sensitive).

## Where You Can Use Variables

- In the template structure (e.g., `name: <Player>`)
- In `where` conditions (e.g., `<Position> == 'D'`)
- In configuration (e.g., `groupingByValue` keys)

## Supported Variable Types

| Syntax         | Description                                      |
|---------------|--------------------------------------------------|
| `<ColumnName>`| Value from the specified column                   |
| `<tableName>` | The name of the Excel table (from config)         |

## Examples

- `name: <Player>` will output the player's name from the `Player` column.
- `where: <Letter> == 'C'` will filter for rows where the `Letter` column is `C`.

## Notes

- Variables are replaced at runtime for each row or group.
- If a variable does not match any column, it will be empty.

See [Template System](template-system.md) for more usage examples.