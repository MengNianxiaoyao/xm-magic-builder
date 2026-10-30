import { readFileSync } from 'node:fs';

const version = process.argv[2];
if (!version) {
    console.error('用法: node scripts/extract-changelog.mjs <版本号>');
    process.exit(1);
}

const changelog = readFileSync('CHANGELOG.md', 'utf8');
const lines = changelog.split(/\r?\n/);
const escaped = version.replace(/\./g, '\\.');
const heading = new RegExp(`^#{2,3}\\s*v?${escaped}\\s*$`);

const start = lines.findIndex((line) => heading.test(line.trim()));
if (start === -1) {
    console.error(`CHANGELOG.md 中找不到版本 ${version} 的更新说明`);
    process.exit(1);
}

let end = lines.length;
for (let i = start + 1; i < lines.length; i += 1) {
    if (/^#{2,3}\s/.test(lines[i])) {
        end = i;
        break;
    }
}

const body = lines.slice(start + 1, end).join('\n').trim();
if (body === '') {
    console.error(`版本 ${version} 的更新说明为空`);
    process.exit(1);
}

console.log(body);
