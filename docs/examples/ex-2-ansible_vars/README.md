# Example 2: Generate Ansible Host Vars from Excel

## Use Case

You have an Excel table listing hosts and their variables (e.g., IP address, environment, role). You want to generate a YAML file for each host to use as an Ansible host_vars file.

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
        forEach: "<Hostname>",
        in: "<tableName>",
        output: {
          hostname: "<Hostname>",
          ip_address: "<IP Address>",
          environment: "<Environment>",
          role: "<Role>",
        },
      },
      documentHeader: "---",
      commentProperty: "Hostname",
    },
  },
  excludes: {},
};
```

## Input Table

| Hostname | IP Address | Environment | Role |
|----------|------------|-------------|------|
| web01    | 10.0.0.1   | prod        | web  |
| db01     | 10.0.0.2   | prod        | db   |
| web02    | 10.0.1.1   | staging     | web  |
| db02     | 10.0.1.2   | staging     | db   |

## Expected YAML Output

```yaml
---
# web01
hostname: web01
ip_address: 10.0.0.1
environment: prod
role: web
---
# db01
hostname: db01
ip_address: 10.0.0.2
environment: prod
role: db
---
# web02
hostname: web02
ip_address: 10.0.1.1
environment: staging
role: web
---
# db02
hostname: db02
ip_address: 10.0.1.2
environment: staging
role: db
```

## Notes
- The template uses `forEach: <Hostname>` to create a document per host.
- You can adjust the columns and output fields to match your infrastructure.
- This example assumes the table is named `Table1` in Excel.
