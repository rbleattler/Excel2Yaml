[excel2yaml](../README.md) / [interfaces/ExcludesConfig](../modules/interfaces_ExcludesConfig.md) / ExcludesConfig

# Interface: ExcludesConfig

[interfaces/ExcludesConfig](../modules/interfaces_ExcludesConfig.md).ExcludesConfig

Configuration for data exclusion rules.

**`Remarks`**

Used to exclude empty values, columns, or groups based on values.

## Table of contents

### Properties

- [emptyValues](interfaces_ExcludesConfig.ExcludesConfig.md#emptyvalues)
- [excludeColumns](interfaces_ExcludesConfig.ExcludesConfig.md#excludecolumns)
- [groupingByValue](interfaces_ExcludesConfig.ExcludesConfig.md#groupingbyvalue)

## Properties

### emptyValues

• `Optional` **emptyValues**: `boolean`

Whether to exclude empty values

#### Defined in

interfaces/ExcludesConfig.ts:13

___

### excludeColumns

• `Optional` **excludeColumns**: `string`[]

List of columns to exclude

#### Defined in

interfaces/ExcludesConfig.ts:14

___

### groupingByValue

• `Optional` **groupingByValue**: `Record`\<`string`, `string` \| \{ `where`: `string`  }\>

Rules for excluding groups based on values

#### Defined in

interfaces/ExcludesConfig.ts:15
