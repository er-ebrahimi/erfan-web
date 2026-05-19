#!/usr/bin/env node
/**
 * Check-only lint script for Next.js files in lint-staged
 * This script checks for linting issues but does NOT modify the code
 */
import { execSync } from 'child_process';
import path from 'path';
import process from 'process';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get the files passed as arguments
const files = process.argv.slice(2);

if (files.length === 0) {
  console.log('No files to lint');
  process.exit(0);
}

// Convert absolute paths to relative paths from the next directory
const nextDir = path.join(__dirname, '..', 'next');
const relativeFiles = files
  .map((file) => {
    // Convert to absolute path first, then make relative to next directory
    const absolutePath = path.resolve(file);
    const relativePath = path.relative(nextDir, absolutePath);
    return relativePath;
  })
  .filter((file) => {
    // Only include files that are actually within the next directory
    return !file.startsWith('..') && !path.isAbsolute(file);
  });

if (relativeFiles.length === 0) {
  console.log('No Next.js files to lint');
  process.exit(0);
}

try {
  // Change to the next directory and run eslint (CHECK ONLY, NO --fix)
  process.chdir(nextDir);

  // Use npx eslint WITHOUT --fix flag for read-only checking
  const command = `npx eslint ${relativeFiles.map((f) => `"${f}"`).join(' ')}`;

  console.log(`Running: ${command}`);
  execSync(command, { stdio: 'inherit' });

  console.log('Linting check completed successfully');
} catch (error) {
  console.error('Linting check failed:', error.message);
  console.error('💡 Run "yarn fix" to automatically fix these issues');
  process.exit(1);
}
