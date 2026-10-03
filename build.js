const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Installing & Building Frontend ---');
execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('--- Step 2: Preparing Vercel Static Output ---');
const srcDir = path.join(__dirname, 'frontend', 'dist');
const destDir = path.join(__dirname, '.vercel', 'output', 'static');

fs.mkdirSync(destDir, { recursive: true });
fs.cpSync(srcDir, destDir, { recursive: true });
console.log('Copied frontend/dist -> .vercel/output/static successfully!');
