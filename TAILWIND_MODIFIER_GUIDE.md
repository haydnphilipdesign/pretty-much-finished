# Tailwind CSS Modifier Guide

This document provides important guidance for using Tailwind CSS modifiers correctly in our project to avoid build errors.

## Common Modifier Issue

One of the most common issues with Tailwind CSS is improper spacing around modifiers. This can lead to build errors such as:

```
[postcss] The `hover:` class does not exist. If `hover:` is a custom class, make sure it is defined within a `@layer` directive.
```

## Correct Modifier Syntax

When using Tailwind modifiers, you must never add a space between the modifier and the class it modifies.

### ✅ Correct Usage

```css
.element {
  @apply text-gray-900 hover:text-blue-500;
}

/* In HTML/JSX */
<div className="bg-white hover:bg-gray-100">...</div>
```

### ❌ Incorrect Usage

```css
.element {
  @apply text-gray-900 hover:text-blue-500;
}

/* In HTML/JSX */
<div className="bg-white hover:bg-gray-100">...</div>
```

## Common Modifiers to Watch Out For

Be especially careful with these common modifiers:

- Responsive modifiers: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- State modifiers: `hover:`, `focus:`, `active:`, `disabled:`
- Dark mode: `dark:`
- Group/peer modifiers: `group-hover:`, `peer-focus:`

## Fixing Spacing Issues

If you encounter a PostCSS error related to modifier spacing, fix it by:

1. Removing the space between the modifier and the class it affects
2. Running our fix-tailwind-spacing.js script to automatically fix spacing issues:

```bash
node scripts/fix-tailwind-spacing.js src/
```

## Using Plain CSS as a Fallback

If you continue to have issues with Tailwind modifiers in CSS files (particularly with `@apply`), consider using standard CSS for hover states:

```css
/* Instead of: */
.element {
  @apply text-gray-900 hover:text-blue-500;
}

/* Use: */
.element {
  color: #1f2937; /* text-gray-900 */
}

.element:hover {
  color: #3b82f6; /* text-blue-500 */
}
```

## For New Developers

When joining this project, make sure to:

1. Follow the syntax guidelines in this document
2. Run the spacing fix script if you encounter any issues
3. Use the minimal-contrast.css approach for critical styling that might have issues with PostCSS processing

## Troubleshooting

If you continue to have issues with Tailwind CSS processing:

1. Check that you're using consistent syntax for all Tailwind directives
2. Consider moving problematic styles to standard CSS without `@apply`
3. Check your PostCSS and Tailwind CSS versions for compatibility issues
4. Ensure your PostCSS plugins are properly configured in the build system 