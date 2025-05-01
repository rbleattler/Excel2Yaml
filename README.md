# Excel2Yaml

Excel2Yaml is an Office Scripts TypeScript script that converts an Excel table into YAML format and writes the output to a target worksheet. It is designed to be flexible and configurable, supporting a wide range of table structures and YAML output templates.

## Features

- **Generic Table to YAML Conversion:** Works with any Excel table by using a configurable template.
- **Customizable Output:** Define your own YAML structure using a JSON-based template in the script configuration.
- **Column Filtering:** Exclude columns or empty values from the output as needed.
- **Grouping and Nesting:** Supports grouping rows by column values to create nested YAML structures (e.g., teams, lines, players).
- **Regex Transforms:** Apply regular expression transformations to column values before output.
- **Special Directives:** Apply template rows to all groups or exclude certain groupings.
- **YAML Formatting:** Outputs well-formatted, properly indented YAML with support for document headers and comments.
- **Sheet Management:** Automatically creates or updates the output worksheet.

## How It Works

1. **Configuration:**
   - The script uses a `config` object to define the table name, output sheet, YAML template, and other options.
   - The template uses placeholders (e.g., `<Player>`, `<Team>`) to map Excel columns to YAML fields.
2. **Data Extraction:**
   - Reads the specified table from the workbook and converts it to an array of objects.
3. **Filtering and Transformation:**
   - Applies column exclusions, removes empty values, and performs regex-based transformations if configured.
4. **Template Processing:**
   - Recursively builds the output YAML structure by grouping and mapping data according to the template.
5. **YAML Output:**
   - Converts the structured data to YAML and writes it to the specified output worksheet.

## Usage

1. **Add the Script:**
   - Copy the contents of `Excel2Yaml.ts` into a new Office Script in Excel Online or use it in a local TypeScript environment with the provided `excel.d.ts` for type definitions.
2. **Configure:**
   - Edit the `config` object at the top of the script to match your table name, output sheet, and desired YAML structure.
3. **Run the Script:**
   - Execute the script from the Automate tab in Excel. The YAML output will appear in the specified worksheet.

### Example Table

| League | Team   | Position | Player           | Line | Letter |
|--------|--------|----------|------------------|------|--------|
| NHL    | Flyers | W        | Konecny, Travis  | 1    | A      |
| NHL    | Flyers | C        | Couturier, Sean  | 1    | C      |
| ...    | ...    | ...      | ...              | ...  | ...    |

### Example YAML Output

```yml
---
# NHL
team:
  - name: Flyers
    lines:
      - line: 1
        players:
          - name: Konecny, Travis
            position: W
            letter: A
          - name: Couturier, Sean
            position: C
            letter: C
      # ...
---
# AHL
team:
  - name: Phantoms
    lines:
      - line: 1
        players:
          - name: Wilson, Garrett
            position: W
            letter: C
      # ...
```

## What It Can Do

- Convert any Excel table to YAML using a flexible, nested template.
- Group and nest data by any column(s).
- Exclude columns or rows based on configuration.
- Apply regex transformations to clean or standardize data.
- Output multi-document YAML with headers and comments.

## Limitations

- The script must be manually configured for each table/template structure.
- Only supports features implemented in the configuration and template system.
- Does not support writing YAML back to Excel as a table (output is plain text).
- Complex YAML features (anchors, references, custom tags) are not supported.
- Designed for use in Excel Online/Office Scripts; may require adaptation for other environments.

## Advanced Configuration

- See the `config` object in `Excel2Yaml.ts` for all available options, including:
  - `output.template`: Define the YAML structure and grouping.
  - `Excludes`: Exclude columns, empty values, or specific groupings.
  - `transforms`: Apply regex-based value transformations.
  - `special`: Apply template rows to all groups or exclude groupings.

## Example: Customizing the Template

To change the YAML output structure, edit the `template` section in the config. For example, to add a new field:

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
          city: "<City>", // Add this line if your table has a City column
          # ...
        }
      }
    }
  },
  # ...
}
```

## Template Variable Syntax: `<ColumnName>`

Within the `template` section of the config, you can use bracketed variable syntax to reference columns from your Excel table. This is done by wrapping the column name in angle brackets, like `<ColumnName>`. When the script processes the template, it will replace each bracketed variable with the value from the corresponding column in the current row or group.

**How it works:**

- `<ColumnName>`: Inserts the value from the column named `ColumnName` for the current row or group.
- You can use these variables at any level of the template to map Excel data to YAML fields.
- The variable name must match the column header exactly (case-sensitive).

**Example:**
If your table has a column called `Player`, then using `name: <Player>` in the template will output the player's name in the YAML.

**Sample usage in template:**

```ts
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
            city: "<City>",
            // ...
          },
        },
      },
    },
    // ...
  },
}
```

This will replace `<Team>` and `<City>` with the actual values from each row in your table.

## Configuration Reference

The core of Excel2Yaml's flexibility is the `config` object in `Excel2Yaml.ts`. This object controls how your Excel table is read, filtered, transformed, and mapped to YAML. Below is a breakdown of each section:

### Top-Level Structure

```ts
const config: Config = {
  excel: { ... },
  special: { ... },
  replacement: [ ... ],
  output: { ... },
  transforms: [ ... ],
  Excludes: { ... },
};
```

### `excel`

- `output_sheet_name`: Name of the worksheet where YAML output will be written.
- `tableName`: Name of the Excel table to read as input.

### `special`

- `applyToAll`: (Optional) Object mapping column names to values. Template rows with these values are applied to all groups (e.g., for adding a captain to every line).
- `excludeGrouping`: (Optional) Object mapping column names to values. Excludes groups with these values from output.

### `replacement`

- Array of `{ input, output }` objects. If a column value matches `input`, it is replaced with `output` in the YAML.

### `output`

- `as`: Output format (should be `yaml`).
- `template`: The most important part. This is a nested object describing how to group and map your table data to YAML. Use `<ColumnName>` to reference columns. Supports recursive grouping (see below).
  - `root`: The root template for the YAML structure.
  - `documentHeader`: (Optional) String to use as YAML document header (default: `---`).
  - `commentProperty`: (Optional) Column name to use as a YAML comment at the start of each document.

#### Example Template

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
          lines: {
            forEach: "<Line>",
            in: "<Team>",
            output: {
              line: "<Line>",
              players: {
                forEach: "<Player>",
                in: "<Line>",
                output: {
                  name: "<Player>",
                  position: "<Position>",
                  letter: "<Letter>",
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

### `transforms`

- Array of objects `{ regexp, name }`. Applies a regex to the column `name` and replaces its value with the first capture group (lowercased). Useful for cleaning or extracting data.

### `Excludes`

- `emptyValues`: If true, rows with any empty value are excluded.
- `excludeColumns`: Array of column names to exclude from output.
- `groupingByValue`: Object mapping column names to values; rows with these values are excluded from grouping.

---

## How Config Affects Output

- **Grouping**: The `forEach`/`in`/`output` pattern in the template recursively groups your data. For example, grouping by League, then Team, then Line, then Player.
- **Column Mapping**: `<ColumnName>` in the template is replaced by the value from that column in each row.
- **Filtering**: `Excludes` and `special.excludeGrouping` remove unwanted rows or groups.
- **Replacement**: `replacement` swaps out values before output.
- **Regex Transforms**: `transforms` can clean up or standardize data before output.
- **YAML Formatting**: `documentHeader` and `commentProperty` control document breaks and comments in the YAML.

---

## Example: Customizing for Your Table

Suppose your table has columns: `League`, `Team`, `Player`, `Position`, `Line`, `Letter`, `City`.

To add `city` to the YAML output, update the template:

```ts
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
            city: "<City>", // <-- new field
            // ...
          },
        },
      },
    },
    // ...
  },
}
```

## Tips

- Always match `<ColumnName>` in the template to your actual Excel column headers.
- Use `excludeColumns` to remove sensitive or irrelevant data.
- Use `transforms` for data cleaning (e.g., extracting numbers from strings).
- Use `applyToAll` to add template rows to every group (e.g., a default player on every line).
- Use `excludeGrouping` to skip certain groups (e.g., exclude a practice squad).

For more advanced examples, see the comments and structure in `Excel2Yaml.ts`.

## License

MIT License. See LICENSE file for details.

## TODO

Planned additions and improvements:

- Add support for filters/where statements in the template
- Improve error handling and logging

## Contributing

Contributions are welcome! If you have suggestions, bug reports, or feature requests, please open an issue or submit a pull request.
Feel free to fork the repository and make changes as needed. If you have a specific use case or enhancement, please share it with the community.

