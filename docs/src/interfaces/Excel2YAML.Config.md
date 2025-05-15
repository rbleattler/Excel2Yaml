[Excel2Yaml](../README.md) / [Exports](../modules.md) / [Excel2YAML](../modules/Excel2YAML.md) / Config

# Interface: Config

[Excel2YAML](../modules/Excel2YAML.md).Config

Main configuration object for the Excel to YAML transformer.

**`Remarks`**

Aggregates all configuration options for the script.

## Table of contents

### Properties

- [excel](Excel2YAML.Config.md#excel)
- [excludes](Excel2YAML.Config.md#excludes)
- [output](Excel2YAML.Config.md#output)
- [replacement](Excel2YAML.Config.md#replacement)
- [special](Excel2YAML.Config.md#special)
- [transforms](Excel2YAML.Config.md#transforms)

## Properties

### excel

• **excel**: [`ExcelConfig`](Excel2YAML.ExcelConfig.md)

Excel sheet configuration.

#### Defined in

[interfaces/Config.ts:11](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L11)

___

### excludes

• `Optional` **excludes**: [`ExcludesConfig`](Excel2YAML.ExcludesConfig.md)

Data exclusion rules.

#### Defined in

[interfaces/Config.ts:31](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L31)

___

### output

• **output**: [`OutputConfig`](Excel2YAML.OutputConfig.md)

Output generation configuration.

#### Defined in

[interfaces/Config.ts:23](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L23)

___

### replacement

• `Optional` **replacement**: [`ReplacementConfig`](Excel2YAML.ReplacementConfig.md)[]

String replacement rules.

#### Defined in

[interfaces/Config.ts:19](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L19)

___

### special

• `Optional` **special**: [`SpecialConfig`](Excel2YAML.SpecialConfig.md)

Special data handling configuration.

#### Defined in

[interfaces/Config.ts:15](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L15)

___

### transforms

• `Optional` **transforms**: [`TransformConfig`](Excel2YAML.TransformConfig.md)[]

Data transformation configuration.

#### Defined in

[interfaces/Config.ts:27](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/Config.ts#L27)
