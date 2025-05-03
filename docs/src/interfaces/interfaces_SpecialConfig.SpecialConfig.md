[excel2yaml](../README.md) / [interfaces/SpecialConfig](../modules/interfaces_SpecialConfig.md) / SpecialConfig

# Interface: SpecialConfig

[interfaces/SpecialConfig](../modules/interfaces_SpecialConfig.md).SpecialConfig

Configuration for special data handling operations.

**`Remarks`**

Used for advanced template row and group exclusion logic.

## Table of contents

### Properties

- [applyToAll](interfaces_SpecialConfig.SpecialConfig.md#applytoall)
- [excludeGrouping](interfaces_SpecialConfig.SpecialConfig.md#excludegrouping)

## Properties

### applyToAll

• `Optional` **applyToAll**: `Record`\<`string`, `string`\>

Defines template rows that should be applied across all groups

#### Defined in

interfaces/SpecialConfig.ts:12

___

### excludeGrouping

• `Optional` **excludeGrouping**: `Record`\<`string`, `string`\>

Defines groups that should be excluded from processing

#### Defined in

interfaces/SpecialConfig.ts:13
