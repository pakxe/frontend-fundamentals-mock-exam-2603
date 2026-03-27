const fs = require('fs');
const path = process.argv[2];

if (!path) process.exit(0);

const content = fs.readFileSync(path, 'utf8');

// 이미 있으면 아무것도 안 함
if (content.startsWith('// @ts-nocheck')) {
  process.exit(0);
}

fs.writeFileSync(path, `// @ts-nocheck\n\n${content}`, 'utf8');
