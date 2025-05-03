# Configuration

The core of Excel2Yaml's flexibility is the `config` object in `Excel2Yaml.ts`. This object controls how your Excel table is read, filtered, transformed, and mapped to YAML.

## Top-Level Structure

```ts
const config: Config = {
  excel: { ... },
  special: { ... },
  replacement: [ ... ],
  output: { ... },
  transforms: [ ... ],
  excludes: { ... },
};
```

## `excel`

- `output_sheet_name`: Name of the worksheet where YAML output will be written.
- `tableName`: Name of the Excel table to read as input.

## `special`

- `applyToAll`: (Optional) Object mapping column names to values. Template rows with these values are applied to all groups (e.g., for adding a captain to every line).
- `excludeGrouping`: (Optional) Object mapping column names to values. Excludes groups with these values from output.

## `replacement`

- Array of `{ input, output }` objects. If a column value matches `input`, it is replaced with `output` in the YAML.

## `output`

- `as`: Output format (should be `yaml`).
- `template`: The most important part. This is a nested object describing how to group and map your table data to YAML. Use `<ColumnName>` to reference columns. Supports recursive grouping and filtering with `where` (see [Template System](template-system.md)).
  - `root`: The root template for the YAML structure.
  - `documentHeader`: (Optional) String to use as YAML document header (default: `---`).
  - `commentProperty`: (Optional) Column name to use as a YAML comment at the start of each document.

## `transforms`

- Array of objects `{ regexp, name }`. Applies a regex to the column `name` and replaces its value with the first capture group (lowercased). Useful for cleaning or extracting data.

## `excludes`

- `emptyValues`: If true, rows with any empty, null, or undefined value are excluded.
- `excludeColumns`: Array of column names to exclude from output.
- `groupingByValue`: Object mapping column names (or `<ColumnName>`) to exclusion criteria. Rows matching these criteria are excluded before grouping and template processing.
  - **Simple Exclusion:** `{ "<ColumnName>": "ValueToExclude" }` — excludes rows where the column equals that value.
  - **Conditional Exclusion:** `{ "<AnyKey>": { where: "<ColumnName> == 'SomeValue' OR <AnotherColumn> != ''" } }` — excludes any row where the `where` condition is true. Use `== []` to test for empty (null/undefined/empty/whitespace) or `!= []` to test for non-empty.

See [Template System](template-system.md) for more on how templates work.
