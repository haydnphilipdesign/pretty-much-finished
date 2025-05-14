# Unified Design System Documentation

## Overview

This document describes the new unified design system created to replace multiple CSS "fix files" with a single, comprehensive styling solution. The system ensures consistent styling, proper text contrast, and professional appearance throughout the website.

## Background

Previously, the project relied on 15+ separate CSS "fix files" that were patching issues across the site. This approach led to:
- Inconsistent styling and overrides
- Specificity conflicts requiring excessive use of `!important`
- Poor maintainability and difficulty tracking changes
- Potential performance issues due to multiple CSS imports

## Key Features of the New Design System

### 1. CSS Variables for Consistent Theming
- Standardized color palette with brand colors (blue, gold) and neutral tones
- Typography scale with consistent font families
- Shadow system for consistent elevation
- Border radius system for consistent shapes
- Transition timing for smooth interactions

### 2. Text Contrast Guarantees
- Dark text on light backgrounds
- White text on dark/colored backgrounds
- Text shadows for improved legibility where needed
- Consistent heading styles with proper contrast

### 3. Unified Card System
- Consistent card styling across all variants
- Proper padding, shadows, and border radius
- Hover effects for interactive feedback
- Text contrast ensured within all card variants

### 4. Section Styling Consistency
- Proper spacing between sections
- Consistent backgrounds for similar sections
- Heading and content alignment standardization
- Removal of problematic background gradients/patterns

### 5. Button System
- Consistent button styling with proper text contrast
- Hover states for interactive feedback
- Size variants that maintain proportions
- Proper spacing and alignment

## Structure of the CSS File

The unified design system CSS is organized into these main sections:

1. **Variables & Theming** - CSS variables for colors, typography, etc.
2. **Global Elements** - Base styling for typography, links, buttons
3. **Section Backgrounds & Layouts** - Consistent section styling
4. **Unified Card System** - Card components and variants
5. **Component-Specific Fixes** - Targeted fixes for specific components
6. **Utilities & Helpers** - Helper classes for common needs
7. **Responsive Adjustments** - Mobile and tablet styling changes

## Usage Guidelines

### Cards

Use the appropriate card variant based on the background:
- `card-white` - On colored backgrounds, for content that needs to stand out
- `card-navy` - Dark blue cards for primary content
- `card-blue` - Brand blue cards for secondary content
- `card-gold` - Gold accent cards for highlighting important content

### Text Contrast

The system automatically handles text contrast based on background:
- In `bg-light` sections, headings are dark and content is gray
- In `bg-dark` or `bg-brand-blue` sections, text is white with subtle shadow
- Inside cards, text color is matched to the card background

### Buttons

The button system provides multiple variants:
- `btn-primary` - Blue background with white text
- `btn-secondary` - Gold background with dark text
- `btn-outline` - Transparent with blue border
- `btn-white` - White background with blue text

## Maintenance

When making future style updates:
1. Update the unified design system CSS file directly
2. Add comments explaining the purpose of new additions
3. Follow the existing structure to maintain organization
4. Test changes across multiple components and screen sizes

## Benefits Over Previous Approach

- **Reduced CSS Size** - Elimination of duplicate rules
- **Improved Performance** - Single CSS file instead of multiple imports
- **Better Maintainability** - Organized structure with clear comments
- **Consistent Design Language** - Standardized components and styling
- **Simplified Debugging** - One place to check for styling issues

## Migration

The new CSS file completely replaces these previous files:
- contrast-variables.css
- design-system.css
- cards.css
- scrollbar-fix.css
- css-fixes.css
- glass-cards.css
- glass-cards-enhanced.css
- text-contrast-fixes.css
- enhanced-contrast.css
- hero-nav-contrast.css
- services-page-fixes.css
- critical-contrast-fixes.css
- consistent-cards.css
- transition-fixes.css
- enhanced-text-readability.css
- home-page-fixes.css
- home-page-specific-fixes.css
- ui-fixes-may2025.css

These files can be safely archived or removed once the new system is implemented.
