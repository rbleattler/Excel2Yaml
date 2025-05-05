/**
 * @module Excel2YAML
 * @description This module provides functions and types for converting Excel table data into YAML format.
 * @namespace Excel2YAML
 * It includes configuration interfaces, data transformation functions, and YAML generation utilities.
 *
 * @remarks
 * This module is designed to be used within an Excel Script environment and is intended for use with Office Scripts.
 * It provides a structured way to handle Excel data, apply transformations, and generate YAML output.
 */
namespace Excel2YAML {

}

// Re-export all namespaces and interfaces
/// <reference path="./interfaces/Config.ts" />
/// <reference path="./interfaces/ExcelConfig.ts" />
/// <reference path="./interfaces/ExcludesConfig.ts" />
/// <reference path="./interfaces/GroupingNode.ts" />
/// <reference path="./interfaces/MappingNode.ts" />
/// <reference path="./interfaces/OutputConfig.ts" />
/// <reference path="./interfaces/OutputTemplate.ts" />
/// <reference path="./interfaces/ReplacementConfig.ts" />
/// <reference path="./interfaces/SpecialConfig.ts" />
/// <reference path="./interfaces/TemplateNode.ts" />
/// <reference path="./interfaces/TransformConfig.ts" />

// Include all functions
/// <reference path="./functions/applySpecialDirectives.ts" />
/// <reference path="./functions/applyTransforms.ts" />
/// <reference path="./functions/buildOutput.ts" />
/// <reference path="./functions/evaluateWhere.ts" />
/// <reference path="./functions/filterTableData.ts" />
/// <reference path="./functions/getTableData.ts" />
/// <reference path="./functions/groupBy.ts" />
/// <reference path="./functions/resolveTemplateVar.ts" />
/// <reference path="./functions/toYAML.ts" />
/// <reference path="./functions/toYAMLObject.ts" />