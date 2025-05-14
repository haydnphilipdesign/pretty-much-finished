/**
 * Fix Tailwind Modifier Spacing Issues
 * 
 * This script scans CSS and other files for improper Tailwind modifier syntax
 * with spaces between modifiers and classes (e.g., hover:bg-blue-500)
 * and replaces them with the correct syntax (hover:bg-blue-500)
 * 
 * For example: `hover:bg-blue-500` becomes `hover:bg-blue-500`
 */

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

// Fix spacing in utility classes (e.g., hover:bg-blue-500 -> hover:bg-blue-500)
async function fixFile(filePath) {
    try {
        console.log(`Checking file: ${filePath}`);

        let content = await readFile(filePath, 'utf8');

        // Common modifiers that might be incorrectly spaced
        const modifiers = ['hover:', 'focus:', 'active:', 'disabled:', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'];

        let hasChanges = false;

        // Find all instances where a modifier is followed by a space
        modifiers.forEach(modifier => {
            // This regex finds the modifier followed by a space and then any non-whitespace character
            const regex = new RegExp(`${modifier.replace(':', '\\:')}\\s+([a-zA-Z0-9\\-\\[\\]\\/]+)`, 'g');

            if (regex.test(content)) {
                hasChanges = true;
                // Replace the spacing issue - remove space between modifier and class
                content = content.replace(regex, `${modifier}$1`);
            }
        });

        if (hasChanges) {
            console.log(`Fixed spacing issues in: ${filePath}`);
            await writeFile(filePath, content, 'utf8');
            return true;
        }

        return false;
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        return false;
    }
}

// Walk through directories and process all relevant files
async function processDirectory(dir, fileExtensions = ['.css', '.jsx', '.js', '.tsx', '.ts']) {
    try {
        const files = fs.readdirSync(dir);
        let fixedFiles = 0;

        for (const file of files) {
            const fullPath = path.join(dir, file);

            if (fs.statSync(fullPath).isDirectory()) {
                // Skip node_modules and other common directories to ignore
                if (file !== 'node_modules' && file !== '.git' && file !== 'dist' && file !== 'build') {
                    fixedFiles += await processDirectory(fullPath, fileExtensions);
                }
            } else {
                const ext = path.extname(file);
                if (fileExtensions.includes(ext)) {
                    if (await fixFile(fullPath)) {
                        fixedFiles++;
                    }
                }
            }
        }

        return fixedFiles;
    } catch (error) {
        console.error(`Error processing directory ${dir}:`, error);
        return 0;
    }
}

// Main execution
async function main() {
    const startDir = process.argv[2] || '.';
    console.log(`Starting to fix Tailwind modifier spacing issues in ${startDir}`);

    const fixedFiles = await processDirectory(startDir);
    console.log(`Process complete. Fixed spacing in ${fixedFiles} files.`);
}

main().catch(console.error);