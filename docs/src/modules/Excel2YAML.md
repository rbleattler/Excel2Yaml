[Excel2Yaml](../README.md) / [Exports](../modules.md) / Excel2YAML

# Namespace: Excel2YAML

## Table of contents

### Interfaces

- [Config](../interfaces/Excel2YAML.Config.md)
- [ExcelConfig](../interfaces/Excel2YAML.ExcelConfig.md)
- [ExcludesConfig](../interfaces/Excel2YAML.ExcludesConfig.md)
- [GroupingNode](../interfaces/Excel2YAML.GroupingNode.md)
- [MappingNode](../interfaces/Excel2YAML.MappingNode.md)
- [OutputConfig](../interfaces/Excel2YAML.OutputConfig.md)
- [OutputTemplate](../interfaces/Excel2YAML.OutputTemplate.md)
- [ReplacementConfig](../interfaces/Excel2YAML.ReplacementConfig.md)
- [SpecialConfig](../interfaces/Excel2YAML.SpecialConfig.md)
- [TransformConfig](../interfaces/Excel2YAML.TransformConfig.md)

### Type Aliases

- [TemplateNode](Excel2YAML.md#templatenode)

### Functions

- [applySpecialDirectives](Excel2YAML.md#applyspecialdirectives)
- [applyTransforms](Excel2YAML.md#applytransforms)
- [buildOutput](Excel2YAML.md#buildoutput)
- [evaluateWhere](Excel2YAML.md#evaluatewhere)
- [filterTableData](Excel2YAML.md#filtertabledata)
- [groupBy](Excel2YAML.md#groupby)
- [resolveTemplateVar](Excel2YAML.md#resolvetemplatevar)
- [toYAML](Excel2YAML.md#toyaml)
- [toYAMLObject](Excel2YAML.md#toyamlobject)

## Type Aliases

### TemplateNode

Ƭ **TemplateNode**: [`MappingNode`](../interfaces/Excel2YAML.MappingNode.md) \| [`GroupingNode`](../interfaces/Excel2YAML.GroupingNode.md) \| `string` \| `number` \| `boolean`

TemplateNode type for recursive template structures.

**`Remarks`**

Used to represent any node in the template tree.

#### Defined in

[interfaces/TemplateNode.ts:8](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/interfaces/TemplateNode.ts#L8)

## Functions

### applySpecialDirectives

▸ **applySpecialDirectives**(`data`, `config`): `Record`\<`string`, `unknown`\>[]

Processes special directives for data handling.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Record`\<`string`, `unknown`\>[] | Data to process |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | Global configuration |

#### Returns

`Record`\<`string`, `unknown`\>[]

Processed data

#### Defined in

[functions/applySpecialDirectives.ts:8](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/applySpecialDirectives.ts#L8)

___

### applyTransforms

▸ **applyTransforms**(`data`, `config`): `Record`\<`string`, `unknown`\>[]

Applies regex transformations to data.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Record`\<`string`, `unknown`\>[] | Data to transform |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | Global configuration |

#### Returns

`Record`\<`string`, `unknown`\>[]

Transformed data

#### Defined in

[functions/applyTransforms.ts:8](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/applyTransforms.ts#L8)

___

### buildOutput

▸ **buildOutput**(`template`, `data`, `context?`, `config`): `unknown`

Recursively builds output structure based on template.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | `unknown` | Template structure |
| `data` | `Record`\<`string`, `unknown`\>[] | Data to process |
| `context` | `Record`\<`string`, `unknown`\> | Current context |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | - |

#### Returns

`unknown`

Processed output structure

#### Defined in

[functions/buildOutput.ts:10](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/buildOutput.ts#L10)

___

### evaluateWhere

▸ **evaluateWhere**(`condition`, `row`, `context`, `config`): `boolean`

Evaluates complex conditional expressions in where clauses.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `condition` | `string` | Condition to evaluate |
| `row` | `Record`\<`string`, `unknown`\> | Current data row |
| `context` | `Record`\<`string`, `unknown`\> | Current context |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | Global configuration |

#### Returns

`boolean`

Result of condition evaluation

#### Defined in

[functions/evaluateWhere.ts:10](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/evaluateWhere.ts#L10)

___

### filterTableData

▸ **filterTableData**(`data`, `excludes`, `config`): `Record`\<`string`, `unknown`\>[]

Filters table data based on exclusion rules.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `Record`\<`string`, `unknown`\>[] | The data to filter |
| `excludes` | `undefined` \| [`ExcludesConfig`](../interfaces/Excel2YAML.ExcludesConfig.md) | Exclusion rules |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | - |

#### Returns

`Record`\<`string`, `unknown`\>[]

Filtered data

#### Defined in

[functions/filterTableData.ts:8](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/filterTableData.ts#L8)

___

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

[functions/groupBy.ts:9](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/groupBy.ts#L9)

___

### resolveTemplateVar

▸ **resolveTemplateVar**(`name`, `row`, `context`, `config`): `unknown`

Resolves template variables from various contexts.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | Variable name to resolve |
| `row` | ``null`` \| `Record`\<`string`, `unknown`\> | Current data row |
| `context` | `Record`\<`string`, `unknown`\> | Current context |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | Global configuration |

#### Returns

`unknown`

Resolved value

#### Defined in

[functions/resolveTemplateVar.ts:10](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/resolveTemplateVar.ts#L10)

___

### toYAML

▸ **toYAML**(`obj`, `config`, `indent?`, `isRoot?`): `string`

Converts data structure to YAML string with proper formatting.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `obj` | `unknown` | `undefined` | Object to convert |
| `config` | [`Config`](../interfaces/Excel2YAML.Config.md) | `undefined` | Global configuration |
| `indent` | `number` | `0` | Current indentation level |
| `isRoot` | `boolean` | `true` | Whether this is the root object |

#### Returns

`string`

Formatted YAML string

#### Defined in

[functions/toYAML.ts:10](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/toYAML.ts#L10)

___

### toYAMLObject

▸ **toYAMLObject**(`obj`, `indent?`): `string`

Helper function for YAML formatting of individual objects.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `obj` | `unknown` | `undefined` | Object to format |
| `indent` | `number` | `0` | Current indentation level |

#### Returns

`string`

Formatted YAML string

#### Defined in

[functions/toYAMLObject.ts:9](https://github.com/rbleattler/Excel2Yaml/blob/ae3ad693799a8fb5c2361b7e1eb0ff2700eea5d6/src/functions/toYAMLObject.ts#L9)
