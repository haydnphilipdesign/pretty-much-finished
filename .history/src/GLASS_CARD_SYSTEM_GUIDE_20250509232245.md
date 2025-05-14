# Glass Card System Implementation Guide

This guide explains how to use the new glass card styling system throughout the website for consistent, elegant styling.

## Available Glass Card Styles

The system provides several glass card variants for different contexts:

1. **Standard Glass Card** (`glass-card`)
   - Clean, white background with subtle glass effect
   - Ideal for general content throughout the site
   - Use in light sections where readability is important

2. **Navy Glass Card** (`glass-card-navy`)
   - Rich dark blue backdrop
   - Perfect for highlighting important information
   - Great for "How We'll Work Together" sections

3. **Blue Glass Card** (`glass-card-blue`)
   - Vibrant blue effect
   - Creates a bold statement while maintaining elegance
   - Use for call-to-action areas

4. **Dark Glass Card** (`glass-card-dark`)
   - Sophisticated dark appearance
   - Good for nighttime viewing or dark mode
   - Creates dramatic contrast against light backgrounds

5. **Gold Glass Card** (`glass-card-gold`)
   - Warm premium appearance
   - Conveys luxury and high-end service
   - Use for premium features or special offerings

6. **Frost Glass Card** (`glass-card-frost`)
   - Very light, subtle frost effect
   - Creates light, airy feeling
   - Good for secondary information or supporting content

7. **Login-specific Card** (`glass-card-login`)
   - Used for the agent portal login
   - Extra refined appearance for credential entry
   - Higher opacity for better readability

## Adding Content Inside Glass Cards

The system includes helper classes for consistent text styling:

- `glass-card-title`: Use for card headings
- `glass-card-subtitle`: Use for secondary text below the heading
- `glass-card-content`: Use for main content text

The text colors are automatically adjusted for each card style to ensure proper contrast and readability.

## Implementation Methods

### Method 1: Direct Class Application

Apply glass card classes directly to container elements:

```jsx
<div className="glass-card">
  <h3 className="glass-card-title">Card Title</h3>
  <p className="glass-card-subtitle">Card subtitle text</p>
  <p className="glass-card-content">Main content goes here...</p>
</div>
```

### Method 2: Using ContentCard Component

Use the enhanced `ContentCard` component which supports all glass card styles:

```jsx
import ContentCard from './components/ContentCard';

<ContentCard
  cardStyle="glass-navy"
  title="Optional Title"
  subtitle="Optional Subtitle"
>
  <p>Your content here</p>
</ContentCard>
```

The ContentCard component accepts the following cardStyle options:
- `"default"` (standard styling)
- `"glass"` (standard glass card)
- `"glass-navy"`
- `"glass-blue"`
- `"glass-dark"`
- `"glass-gold"`
- `"glass-frost"`
- `"glass-login"`

## Styling Adjustments

### Background Considerations

Glass cards work best when placed on:
- Gradient backgrounds
- Subtle pattern backgrounds
- Image backgrounds (ensure sufficient contrast)
- Solid color backgrounds

Make sure the background has enough contrast with the card to create the glass effect.

### Opacity Control

Adjust the opacity of glass cards using helper classes:
- `glass-opacity-light` (70% opacity)
- `glass-opacity-medium` (85% opacity) 
- `glass-opacity-heavy` (95% opacity)

Example:
```jsx
<div className="glass-card glass-opacity-light">
  <!-- Content -->
</div>
```

## Best Practices

1. **Consistency**: Use the same card style for similar content types across the site
2. **Contrast**: Ensure sufficient contrast between card backgrounds and text
3. **Context**: Choose card styles that complement the section's purpose and content
4. **Composition**: Don't overcomplicate - let the glass effect enhance, not overwhelm

## Example Usage Scenarios

- Use `glass-card-navy` for "How We'll Work Together" sections
- Use `glass-card` for general informational content
- Use `glass-card-gold` for premium services or special offers
- Use `glass-card-login` for credential entry forms
- Use `glass-card-frost` for supporting information or secondary content

By following this system, we maintain a consistent, elegant appearance throughout the site while allowing for appropriate visual distinction between different types of content. 