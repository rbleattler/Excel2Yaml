// build.js
// Improved: Remove namespace surround and all Excel2YAML. prefixes from output.
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUT_FILE = path.join(__dirname, 'Excel2Yaml.ts');
const ROOT_NAMESPACE_FILE = 'excel2yaml.ns.ts';

function getAllFiles(dir, ext = '.ts') {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (
      file.endsWith(ext) &&
      path.basename(file) !== 'excel.d.ts' &&
      path.basename(file).toLowerCase() !== ROOT_NAMESPACE_FILE
    ) {
      results.push(filePath);
    }
  });
  return results;
}

function stripImportsExports(code) {
  return code
    // Remove any import statements, including multi-line ones
    .replace(/import\s+(?:{[^}]*}\s+from\s+)?['"][^'"]+['"];?\s*/g, '')
    .replace(/import\s+\*\s+as\s+[^\s]+\s+from\s+['"][^'"]+['"];?\s*/g, '')
    .replace(/import\s+[^\s]+\s+from\s+['"][^'"]+['"];?\s*/g, '')
    // Remove export keywords
    .replace(/^\s*export\s+(interface|type|function|const|let|var|class)\s+/gm, '$1 ')
    .replace(/^\s*export\s+\{[^}]+\};?\s*$/gm, '')
    .replace(/^\s*export\s+default\s+/gm, '');
}

function extractNamespaceContent(code, nsName = 'Excel2YAML') {
  // Remove all namespace Excel2YAML { ... } blocks, even if nested or single function
  let result = '';
  let searchPos = 0;
  while (true) {
    const nsStart = code.indexOf(`namespace ${nsName}`, searchPos);
    if (nsStart === -1) {
      // No more namespaces, append the rest
      result += code.slice(searchPos);
      break;
    }
    // Append code before the namespace
    result += code.slice(searchPos, nsStart);
    const braceStart = code.indexOf('{', nsStart);
    if (braceStart === -1) {
      // Malformed, just skip
      searchPos = nsStart + 1;
      continue;
    }
    let depth = 1;
    let i = braceStart + 1;
    for (; i < code.length; i++) {
      if (code[i] === '{') depth++;
      else if (code[i] === '}') depth--;
      if (depth === 0) break;
    }
    if (depth !== 0) {
      // unmatched braces, fallback
      searchPos = braceStart + 1;
      continue;
    }
    // Extract content inside the namespace
    let content = code.slice(braceStart + 1, i).trim();
    // Remove any leading/trailing blank lines and stray braces
    content = content.replace(/^[\r\n]+|[\r\n]+$/g, '');
    // Remove any trailing unmatched braces left behind
    content = content.replace(/^}\s*$/gm, '');
    // Add the extracted content to result
    result += content + '\n';
    searchPos = i + 1;
  }
  // Remove any stray namespace lines (in case of comments or partials)
  result = result.replace(/^\s*namespace\s+Excel2YAML\s*{?\s*}?/gm, '');
  // Remove multiple blank lines
  result = result.replace(/\n{3,}/g, '\n\n');
  // Remove any trailing unmatched braces left behind
  result = result.replace(/^}\s*$/gm, '');
  return result.trim();
}

function removeExcel2YAMLPrefixes(code) {
  // Remove Excel2YAML. from type/interface references, function calls, and definitions
  return code.replace(/\bExcel2YAML\./g, '');
}

function build() {
  // Get all files sorted, but make sure main.ts is at the end
  let files = getAllFiles(SRC_DIR).sort((a, b) => {
    if (path.basename(a) === 'main.ts') return 1;
    if (path.basename(b) === 'main.ts') return -1;
    return a.localeCompare(b);
  });

  let output = '/**\n * AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n * Built for Office Scripts (ExcelScript) single-file requirement.\n */\n\n';

  let nsContent = '';
  let nonNsContent = '';
  let configBlock = '';

  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    code = stripImportsExports(code);
    if (code.trim() === '') return;
    // Extract config block if present
    if (/const config\s*[:=]/.test(code)) {
      // Find the start of the config block
      const configStart = code.indexOf('const config');
      // Find the end of the config block (assume it ends with '};')
      const configEnd = code.indexOf('};', configStart);
      if (configStart !== -1 && configEnd !== -1) {
        configBlock = code.slice(configStart, configEnd + 2).trim();
        // Remove Excel2YAML. prefix from config type annotation
        configBlock = configBlock.replace(/const config:\s*Excel2YAML\./, 'const config: ');
        // Remove config block from code
        code = code.slice(0, configStart) + code.slice(configEnd + 2);
      }
    }
    if (/namespace\s+Excel2YAML\s*{/.test(code)) {
      nsContent += `// File: ${path.relative(__dirname, file)}\n`;
      nsContent += extractNamespaceContent(code) + '\n';
    } else {
      nonNsContent += `// File: ${path.relative(__dirname, file)}\n`;
      nonNsContent += code + '\n';
    }
  });

  // Place config block at the very top after the header
  if (configBlock) {
    output += configBlock + '\n\n';
  }
  // Remove namespace surround and all Excel2YAML. prefixes
  if (nsContent) {
    output += removeExcel2YAMLPrefixes(nsContent) + '\n';
  }
  output += removeExcel2YAMLPrefixes(nonNsContent);

  fs.writeFileSync(OUT_FILE, output, 'utf8');
  console.log('Build complete: Excel2Yaml.ts');
}

build();
