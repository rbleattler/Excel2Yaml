// build.js
// Concatenate all TS files in src/ into Excel2Yaml.ts, removing imports/exports for Office Scripts compatibility.
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const OUT_FILE = path.join(__dirname, 'Excel2Yaml.ts');

function getAllFiles(dir, ext = '.ts') {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllFiles(filePath, ext));
    } else if (file.endsWith(ext) && path.basename(file) !== 'excel.d.ts') {
      // Exclude any excel.d.ts file from the build output
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


function build() {
  // Get all files sorted, but make sure main.ts is at the end
  let files = getAllFiles(SRC_DIR).sort((a, b) => {
    // If file is main.ts, it should come last
    if (path.basename(a) === 'main.ts') return 1;
    if (path.basename(b) === 'main.ts') return -1;
    return a.localeCompare(b);
  });

  let output = '/**\n * AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.\n * Built for Office Scripts (ExcelScript) single-file requirement.\n */\n\n';

  // Process each file
  files.forEach(file => {
    let code = fs.readFileSync(file, 'utf8');
    code = stripImportsExports(code);
    // Skip files that become empty after stripping imports/exports
    if (code.trim() !== '') {
      output += `// File: ${path.relative(__dirname, file)}\n`;
      output += code + '\n\n';
    }
  });

  // No need to add the main function here as it's already included from main.ts

  fs.writeFileSync(OUT_FILE, output, 'utf8');
  console.log('Build complete: Excel2Yaml.ts');
}

build();
