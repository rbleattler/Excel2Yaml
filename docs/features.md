# Features

Excel2Yaml provides the following features:

- **Generic Table to YAML Conversion:** Works with any Excel table by using a configurable template.
- **Customizable Output:** Define your own YAML structure using a JSON-based template in the script configuration.
- **Column Filtering:** Exclude columns or empty values from the output as needed.
- **Grouping and Nesting:** Supports grouping rows by column values to create nested YAML structures (e.g., teams, lines, players).
- **Conditional Filtering (`where`):** Filter rows within groups based on conditions (e.g., only include players with a specific position).
- **Regex Transforms:** Apply regular expression transformations to column values before output.
- **Special Directives:** Apply template rows to all groups or exclude certain groupings.
- **YAML Formatting:** Outputs well-formatted, properly indented YAML with support for document headers and comments.
- **Sheet Management:** Automatically creates or updates the output worksheet.

## What It Can Do

- Convert any Excel table to YAML using a flexible, nested template.
- Group and nest data by any column(s).
- Filter data within groups using `where` clauses.
- Exclude columns or rows based on configuration.
- Apply regex transformations to clean or standardize data.
- Output multi-document YAML with headers and comments.

See [Examples](../examples/readme.md) for real-world use cases.

