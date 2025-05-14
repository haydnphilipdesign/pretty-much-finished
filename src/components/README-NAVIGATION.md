# Smooth Navigation System

This system creates the illusion that only the page content changes while the hero section stays consistent during navigation, regardless of where the user is on the page.

## How It Works

The GlobalLinkProvider replaces the standard React Router Link component with a custom version that:

1. Detects if the user is scrolled down
2. Smoothly scrolls to the top of the page before navigation
3. Adds a brief pause to ensure the hero is fully visible
4. Only after the pause, triggers the actual navigation

This creates a seamless experience where the hero section is always visible during page transitions, maintaining the illusion that only the content below the hero changes.

## Implementation

The system is implemented in two main components:

1. **GlobalLinkProvider**: A context provider that wraps the entire application and provides a custom Link component.
2. **Link**: A drop-in replacement for the React Router Link component that adds smooth scrolling behavior.

## Usage

### In Components

Import the Link component from GlobalLinkProvider instead of react-router-dom:

```jsx
// BEFORE:
import { Link } from 'react-router-dom';

// AFTER:
import { Link } from '../components/GlobalLinkProvider';
```

Then use it exactly like you would use the standard Link component:

```jsx
<Link to="/about">About Us</Link>
```

### Programmatic Navigation

For programmatic navigation, use the useNavigate hook from react-router-dom as usual, but add the smooth scrolling behavior manually:

```jsx
import { useNavigate } from 'react-router-dom';
import { useSlideshow } from '../context/GlobalSlideshowContext';

const MyComponent = () => {
  const navigate = useNavigate();
  const { scrollPosition } = useSlideshow();
  
  const handleClick = () => {
    // Only scroll if we're not already at the top
    if (scrollPosition > 100) {
      // Scroll to top with smooth animation
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      
      // Wait for the scroll animation to complete
      setTimeout(() => {
        // Add a pause to ensure the hero is fully visible
        setTimeout(() => {
          navigate('/about');
        }, 200); // heroVisibilityDelay
      }, 400); // scrollDuration
    } else {
      // If already at the top, navigate immediately
      navigate('/about');
    }
  };
  
  return (
    <button onClick={handleClick}>Go to About</button>
  );
};
```

## Configuration

You can configure the timing of the smooth scrolling behavior in the AppProviders component:

```jsx
<GlobalLinkProvider
  scrollDuration={400} // Duration of the scroll animation in milliseconds
  heroVisibilityDelay={200} // Delay after scrolling to top before navigation
>
  {children}
</GlobalLinkProvider>
```

## Testing

You can test different timing values using the NavigationTest page at `/navigation-test`. This page provides sliders to adjust the timing values and see the effect immediately.

## Troubleshooting

If the smooth scrolling behavior isn't working as expected:

1. Check the browser console for any errors
2. Make sure you're using the Link component from GlobalLinkProvider, not from react-router-dom
3. Try different timing values to find what works best for your site
4. If using programmatic navigation, make sure you're implementing the smooth scrolling behavior manually
