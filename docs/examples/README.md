# Examples

Each example in this directory will demonstrate a specific use case of the Excel2Yaml script. The examples are meant to be self-contained and can be run independently.

Each example will have:

- README file explaining the use case, input data, and expected output, and including the configuration used in the script
- Input csv file (to be used in an Excel table) that will be used as input for the example

Examples and their associated files will be organized into sub-directories, and named as follows:

Name: `ex-<example_number>-<short_name>`

Where:

- `ex` is a prefix indicating that this is an example
- `<example_number>` is a sequential number starting from 1 (e.g., `ex-1`)
- `<short_name>` is a brief description of the example (e.g., `ex-1-simple`)
- `<extension>` is the file extension of the example (e.g., `.xlsx`, `.csv`, `.yaml`, `md`)

```markdown
...
├── docs
│   ├── examples
│   │   ├── ex-1-sort_teams
│   │   │   ├── ex-1-sort_teams.csv
│   │   │   └── README.md
│   │   ├── ex-2-ansible_inventory
│   │   │   ├── ex-2-ansible_inventory.csv
│   │   │   └── README.md
...
```

## README structure

Each example's README file should include the following sections:

- **Title**: A brief title for the example.
- **Use Case**: A description of the use case for the example
- **Configuration**: The typescript configuration block which will produce the YAML output
- **Input Table**: A table showing the input data used in the example
- **Expected YAML Output**: A YAML snippet showing the expected output of the example
- **Notes**: Any additional notes or comments about the example, including any specific configurations used in the script
