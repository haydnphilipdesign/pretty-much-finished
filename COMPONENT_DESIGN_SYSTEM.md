# Component-Driven Unified Design System

## Overview

This document describes the component-driven unified design system created to ensure consistent styling across all pages of the website. Rather than applying styling on a page-by-page basis, this system focuses on maintaining consistency for each component type regardless of which page it appears on.

## The Problem

Previously, the project had two major issues:
1. It relied on 15+ separate CSS "fix files" that created maintenance challenges
2. There were significant inconsistencies between pages - the same component types (cards, sections, etc.) looked different depending on which page they appeared on

Key issues included:
- Text on the Services page with the same color as backgrounds, making it unreadable
- Inconsistent card styling between Home and Services pages
- Different background treatments for similar section types

## The Component-Driven Solution

The new design system focuses on components rather than pages, ensuring that:
- Each component type looks the same regardless of which page it appears on
- Text always has proper contrast against its background
- Cards follow consistent styling rules throughout the site
- Section backgrounds are handled uniformly

## Key Features

### 1. Component-Based Selectors
- Styling targets component class patterns rather than page-specific elements
- Uses attribute selectors to capture component variants
- Ensures components are styled consistently regardless of location

### 2. Guaranteed Text Contrast
- Text contrast is determined by its background, not by page location
- Dark backgrounds always have light text (with proper shadow)
- Light backgrounds always have dark text
- Cards always have content that contrasts with their background color

### 3. Unified Component Types
- **Cards**: All cards follow the same styling pattern with appropriate variants
- **Sections**: Section backgrounds are consistent by type (dark, light, etc.)
- **Typography**: Text styles are consistent by element type and background
- **UI Elements**: Buttons, form elements, and other UI components maintain consistency

### 4. Critical Services Page Fixes
- Glass-card-light components now have proper background and text colors
- Process Steps component has consistent styling
- Feature list bullets are visible and consistent
- Card content is properly contrasted across all cards

## Implementation Details

The system is organized into these key sections:

1. **Variables & Theming**: CSS variables for consistent colors, typography, etc.
2. **Global Elements**: Base styling for typography, links, buttons
3. **Section Backgrounds & Layouts**: Component-based section styling
4. **Unified Card System**: Consistent card system across all pages
5. **Page-Specific Fixes**: Targeted fixes for page-specific components
6. **Utilities & Helpers**: Helper classes for common needs
7. **Responsive Adjustments**: Mobile and tablet styling changes

## Usage Guidelines

### Component Styling
- Components should be styled based on their type, not their page location
- Each component type has consistent styling with appropriate variants
- Content within components should always have proper contrast

### Text Contrast Rules
- Text on dark backgrounds (brand-blue, navy-gradient): Always white
- Text on light backgrounds: Always dark (brand-blue-dark or neutral-800)
- Text in dark cards: Always white with proper opacity
- Text in light cards: Always dark with proper contrast

## Maintenance

When making future style updates:
1. Focus on the component type rather than the page
2. Ensure changes are applied consistently across all instances of that component
3. Test changes across multiple pages to ensure consistency
4. Keep text contrast as a top priority

## Benefits Over Previous Approach

- **Consistent Experience**: Users experience the same component styling across all pages
- **Improved Readability**: All text is guaranteed to be visible against its background
- **Simplified Maintenance**: Component changes automatically apply to all pages
- **Better Scalability**: New pages automatically inherit the consistent styling
- **Easier Debugging**: Component issues can be fixed once and apply everywhere

---

This component-driven approach ensures that the website maintains a consistent, professional appearance across all pages with text that is always readable against its background.
