[Excel2Yaml](../README.md) / [Exports](../modules.md) / [Excel2YAML](../modules/Excel2YAML.md) / GroupingNode

# Interface: GroupingNode

[Excel2YAML](../modules/Excel2YAML.md).GroupingNode

**`Summary`**

Represents a node in the template that defines grouping and iteration.

**`Remarks`**

Used for iterating over groups and applying filters.

## Table of contents

### Properties

- [forEach](Excel2YAML.GroupingNode.md#foreach)
- [in](Excel2YAML.GroupingNode.md#in)
- [output](Excel2YAML.GroupingNode.md#output)
- [where](Excel2YAML.GroupingNode.md#where)

## Properties

### forEach

• **forEach**: `string`

The property to iterate over

#### Defined in

[interfaces/GroupingNode.ts:26](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/GroupingNode.ts#L26)

___

### in

• **in**: `string`

The source of the data

#### Defined in

[interfaces/GroupingNode.ts:37](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/GroupingNode.ts#L37)

___

### output

• **output**: [`TemplateNode`](../modules/Excel2YAML.md#templatenode)

The template for each group's output

#### Defined in

[interfaces/GroupingNode.ts:56](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/GroupingNode.ts#L56)

___

### where

• `Optional` **where**: `string`

Optional filter condition

#### Defined in

[interfaces/GroupingNode.ts:67](https://github.com/rbleattler/Excel2Yaml/blob/a1aba8cdde2a76234aa9d6c5ebacf57ebabc31fe/src/interfaces/GroupingNode.ts#L67)
