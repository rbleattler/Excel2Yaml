[Excel2Yaml](../README.md) / [Exports](../modules.md) / [Excel2YAML](../modules/Excel2YAML.md) / OutputTemplate

# Interface: OutputTemplate

[Excel2YAML](../modules/Excel2YAML.md).OutputTemplate

Defines the structure of the output template.

**`Remarks`**

Used to control the output YAML structure and document formatting.

## Table of contents

### Properties

- [commentProperty](Excel2YAML.OutputTemplate.md#commentproperty)
- [documentHeader](Excel2YAML.OutputTemplate.md#documentheader)
- [root](Excel2YAML.OutputTemplate.md#root)

## Properties

### commentProperty

• `Optional` **commentProperty**: `string`

Property to be used as a comment in the output.

**`Example`**

If the user wants the heading of each document to be the League the document represents then the user can set this to "League" and the output will be:
```yaml
---
# NHL
...
---
# AHL
...
```
This is useful for generating multiple documents from a single template which are denoted in some way to clarify what they are.

#### Defined in

[interfaces/OutputTemplate.ts:48](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/OutputTemplate.ts#L48)

___

### documentHeader

• `Optional` **documentHeader**: `string`

Header to be added to each YAML document.

**`Example`**

If the user wants to add a header to each document, they can set this property to a string that will be added at the top of each document.
In YAML, the document separator is `---`.
So, if the user sets this property to "---", the output will be:
```yaml
---
# CommentProperty
...

---
# CommentProperty
...
```

#### Defined in

[interfaces/OutputTemplate.ts:31](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/OutputTemplate.ts#L31)

___

### root

• **root**: [`TemplateNode`](../modules/Excel2YAML.md#templatenode)

The root node of the template structure.

**`Link`**

TemplateNode

#### Defined in

[interfaces/OutputTemplate.ts:14](https://github.com/rbleattler/Excel2Yaml/blob/0fa89d9b50c0f12b0bb5739c1b46c02b0dc3aa9b/src/interfaces/OutputTemplate.ts#L14)
