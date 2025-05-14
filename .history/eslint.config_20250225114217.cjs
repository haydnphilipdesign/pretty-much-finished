import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from "eslint-plugin-unused-imports";

export default typescriptEslint.config({ ignores: ['dist'] }, {
    extends: [js.configs.recommended, ...require('@typescript-eslint/eslint-plugin').configs.recommended],
    files: ['**/*.{ts,tsx}'],
    // rest of the configuration remains unchanged
}); 