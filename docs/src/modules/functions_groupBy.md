[excel2yaml](../README.md) / functions/groupBy

# Module: functions/groupBy

## Table of contents

### Functions

- [groupBy](functions_groupBy.md#groupby)

## Functions

### groupBy

▸ **groupBy**\<`T`\>(`arr`, `key`): `Record`\<`string`, `T`[]\>

Groups an array of objects by a specified key.

#### Type parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `T` | extends `Object` | The type of objects in the array |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `arr` | `T`[] | Array to group |
| `key` | `string` | Key to group by |

#### Returns

`Record`\<`string`, `T`[]\>

Grouped data

#### Defined in

functions/groupBy.ts:8
