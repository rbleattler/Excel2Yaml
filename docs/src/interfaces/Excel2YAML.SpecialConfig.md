[Excel2Yaml](../README.md) / [Exports](../modules.md) / [Excel2YAML](../modules/Excel2YAML.md) / SpecialConfig

# Interface: SpecialConfig

[Excel2YAML](../modules/Excel2YAML.md).SpecialConfig

Configuration for special data handling operations.

**`Remarks`**

Used for advanced template row and group exclusion logic.

## Table of contents

### Properties

- [applyToAll](Excel2YAML.SpecialConfig.md#applytoall)
- [excludeGrouping](Excel2YAML.SpecialConfig.md#excludegrouping)

## Properties

### applyToAll

• `Optional` **applyToAll**: `Record`\<`string`, `string`\>

Defines template rows that should be applied across all groups.

#### Defined in

[interfaces/SpecialConfig.ts:13](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/SpecialConfig.ts#L13)

___

### excludeGrouping

• `Optional` **excludeGrouping**: `Record`\<`string`, `string`\>

Defines groups that should be excluded from processing.

#### Defined in

[interfaces/SpecialConfig.ts:17](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/SpecialConfig.ts#L17)
