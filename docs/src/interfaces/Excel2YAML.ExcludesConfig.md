[Excel2Yaml](../README.md) / [Exports](../modules.md) / [Excel2YAML](../modules/Excel2YAML.md) / ExcludesConfig

# Interface: ExcludesConfig

[Excel2YAML](../modules/Excel2YAML.md).ExcludesConfig

Configuration for data exclusion rules.

**`Remarks`**

Used to exclude empty values, columns, or groups based on values.

## Table of contents

### Properties

- [emptyValues](Excel2YAML.ExcludesConfig.md#emptyvalues)
- [excludeColumns](Excel2YAML.ExcludesConfig.md#excludecolumns)
- [groupingByValue](Excel2YAML.ExcludesConfig.md#groupingbyvalue)

## Properties

### emptyValues

• `Optional` **emptyValues**: `boolean`

Whether to exclude empty values from the data.

**`Example`**

```ts
emptyValues: true
```

#### Defined in

[interfaces/ExcludesConfig.ts:13](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/ExcludesConfig.ts#L13)

___

### excludeColumns

• `Optional` **excludeColumns**: `string`[]

List of columns to exclude.

**`Example`**

```ts
excludeColumns: ["ColumnA", "ColumnB"]
```

#### Defined in

[interfaces/ExcludesConfig.ts:18](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/ExcludesConfig.ts#L18)

___

### groupingByValue

• `Optional` **groupingByValue**: `Record`\<`string`, `string` \| \{ `where`: `string`  }\>

Rules for excluding groups based on values.

**`Example`**

```ts
groupingByValue: { "<ColumnName>": "Value" }
```

#### Defined in

[interfaces/ExcludesConfig.ts:23](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/ExcludesConfig.ts#L23)
