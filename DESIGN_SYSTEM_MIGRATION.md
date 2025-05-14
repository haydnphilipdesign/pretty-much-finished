# Design System Migration Guide

This guide outlines the steps to migrate the project to a consistent design system with standardized components.

## Button Component Standardization

### 1. Delete Duplicate Button Files

Delete the following files as they are now replaced by the unified button component:
- `src/components/ui/button copy.tsx`
- `src/components/HeroButton.tsx` (after all usages are migrated)
- `src/components/GlassButton.tsx` (after all usages are migrated)

### 2. Migration Path for Button Components

Replace all instances of the following components with the new `UnifiedButton` component:

#### For HeroButton
```jsx
// BEFORE
<HeroButton
  to="/some-path"
  variant="inverted"
  size="lg"
  icon={<SomeIcon />}
>
  Button Text
</HeroButton>

// AFTER
<UnifiedButton
  to="/some-path"
  variant="hero"  // Use "hero" for "inverted" HeroButton
  size="lg"
  radius="full"   // HeroButtons use rounded-full
  withAnimation={true}
  icon={<SomeIcon />}
>
  Button Text
</UnifiedButton>
```

#### For GlassButton
```jsx
// BEFORE
<GlassButton
  to="/some-path"
  variant="secondary"
  size="md"
  icon={<SomeIcon />}
>
  Button Text
</GlassButton>

// AFTER
<UnifiedButton
  to="/some-path"
  variant="glass"  // All GlassButtons use the "glass" variant
  size="md"
  radius="full"    // GlassButtons use rounded-full
  withAnimation={true}
  icon={<SomeIcon />}
>
  Button Text
</UnifiedButton>
```

#### For standard Button
```jsx
// BEFORE
<Button
  variant="primary"
  size="md"
  className="some-class"
>
  Button Text
</Button>

// AFTER
<UnifiedButton
  variant="default"  // "primary" becomes "default"
  size="md"
  radius="xl"        // Standard buttons use rounded-xl
>
  Button Text
</UnifiedButton>
```

#### For shadcn Button
```jsx
// BEFORE
<Button
  variant="default"
  size="default"
  className="some-class"
>
  Button Text
</Button>

// AFTER
<UnifiedButton
  variant="default"
  size="default"
  radius="md"        // shadcn buttons use rounded-md
>
  Button Text
</UnifiedButton>
```

### 3. Variant Mapping

| Old Component | Old Variant | New UnifiedButton Variant | Radius |
|---------------|-------------|---------------------------|--------|
| HeroButton    | primary     | default                   | full   |
| HeroButton    | secondary   | secondary                 | full   |
| HeroButton    | outline     | outline                   | full   |
| HeroButton    | ghost       | glass                     | full   |
| HeroButton    | inverted    | hero                      | full   |
| GlassButton   | primary     | default                   | full   |
| GlassButton   | secondary   | glass                     | full   |
| GlassButton   | outline     | outline                   | full   |
| GlassButton   | ghost       | ghost                     | full   |
| GlassButton   | inverted    | hero                      | full   |
| Button        | primary     | secondary                 | xl     |
| Button        | secondary   | default                   | xl     |
| Button        | outline     | secondaryOutline          | xl     |
| shadcn/Button | default     | default                   | md     |
| shadcn/Button | destructive | destructive               | md     |
| shadcn/Button | outline     | outline                   | md     |
| shadcn/Button | secondary   | secondary                 | md     |
| shadcn/Button | ghost       | ghost                     | md     |
| shadcn/Button | link        | link                      | none   |

## Design Consistency Guidelines

1. **Border Radius**:
   - Use `radius="full"` for hero section buttons and CTAs
   - Use `radius="xl"` for primary action buttons in forms
   - Use `radius="md"` for secondary actions and form controls

2. **Color Usage**:
   - Primary actions: `variant="default"` (brand-blue)
   - Secondary actions: `variant="secondary"` (brand-gold)
   - Destructive actions: `variant="destructive"` (red)
   - Outline versions available for each

3. **Animation**:
   - Use `withAnimation={true}` for hero sections and CTAs
   - Standard buttons typically don't need animation

4. **Icons**:
   - Include icons for important actions
   - Use consistent icon sizes (the component handles this automatically)

5. **Sizes**:
   - Use `size="lg"` for hero and main CTA buttons
   - Use `size="default"` for standard actions
   - Use `size="sm"` for compact UIs and secondary actions

## PostCSS Configuration

The PostCSS error has been fixed by updating the `postcss.config.js` file to properly specify the module type. No further action is needed for this fix.
