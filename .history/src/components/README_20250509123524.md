# Smooth Navigation System

This system creates the illusion that only the page content changes while the hero section stays consistent during navigation, regardless of where the user is on the page.

## How It Works

1. **Global Slideshow Context**: Maintains a synchronized slideshow across all pages.

2. **SmoothLink Component**: Replaces the standard React Router Link component.
   - Detects if the user is scrolled down
   - Smoothly scrolls to the top of the page before navigation
   - Only after reaching the top, triggers the actual navigation

3. **SmoothNavigationProvider**: Provides the SmoothLink component to the entire application.

4. **ScrollRestoration**: Works with the global slideshow to maintain the illusion.

## Usage

### Basic Usage

The SmoothNavigationProvider is already set up in the AppProviders component, so all Link components in the application will automatically use the smooth navigation behavior.

```jsx
// In your component
import { useNavigation } from '../providers/SmoothNavigationProvider';

const MyComponent = () => {
  const { Link } = useNavigation();

  return (
    <Link to="/about">About Us</Link>
  );
};
```

### Programmatic Navigation

If you need to navigate programmatically, use the `useSmoothNavigation` hook:

```jsx
import useSmoothNavigation from '../hooks/useSmoothNavigation';

const MyComponent = () => {
  const { smoothNavigate } = useSmoothNavigation();

  const handleClick = () => {
    smoothNavigate('/about');
  };

  return (
    <button onClick={handleClick}>Go to About</button>
  );
};
```

### Configuration

You can configure the smooth navigation behavior in the AppProviders component:

```jsx
<SmoothNavigationProvider
  scrollDuration={500} // Duration of the scroll animation in milliseconds
  scrollThreshold={100} // Threshold in pixels to determine if user is "scrolled down"
  alwaysScrollToTop={false} // Whether to always scroll to top before navigation
  heroVisibilityDelay={400} // Delay after scrolling to top before navigation (ms)
>
  {children}
</SmoothNavigationProvider>
```

#### Timing Configuration

The timing of the navigation process can be fine-tuned with two parameters:

1. `scrollDuration`: How long the scroll-to-top animation takes
2. `heroVisibilityDelay`: How long to pause at the top before navigating

The total delay before navigation = scrollDuration + heroVisibilityDelay

For the best experience:
- If the user is already at the top, navigation happens immediately
- If the user is scrolled down, they'll smoothly scroll to the top, see the hero briefly, then navigate
