# Technical Implementation Guide

## Development Standards

### Code Style
- **HTML**: Use semantic HTML5 elements, include accessibility attributes (`alt`, `aria-label`)
- **CSS**: Follow BEM-inspired naming (`.component-element-modifier`), use CSS custom properties for theming
- **JavaScript**: ES6+ syntax, modular approach, event-driven architecture
- **Indentation**: 4 spaces for HTML/CSS, 2 spaces for JavaScript
- **Comments**: Document complex animations, color variables, and interactive behaviors

### CSS Implementation Patterns
```css
/* Use CSS custom properties for consistent theming */
:root {
    --primary-color: #FB008B;
    --bg-primary: #0A090B;
    --text-primary: #ffffff;
}

/* Component-based class naming */
.hero-content-bottom { }
.work-project { }
.contact-item { }

/* State classes for interactions */
.active, .visible, .scrolled
```

### JavaScript Implementation Patterns
```javascript
// Module separation - each file handles specific functionality
// Use Intersection Observer for scroll-based interactions
const observer = new IntersectionObserver((entries) => {
    // Handle visibility changes
}, { threshold: 0.1 });

// Event-driven interactions
document.addEventListener('DOMContentLoaded', () => {
    // Initialize functionality
});
```

## Performance Guidelines
- **CSS**: Use `transform` and `opacity` for animations (GPU acceleration)
- **Images**: Optimize file sizes, use SVG for icons, appropriate formats (PNG/JPG)
- **JavaScript**: Minimize DOM queries, use event delegation, debounce scroll events
- **Loading**: Implement smooth loading states with preloader animations

## Responsive Implementation
```css
/* Mobile-first approach with specific breakpoints */
@media (max-width: 480px) { /* Small mobile */ }
@media (max-width: 640px) { /* Mobile */ }
@media (max-width: 768px) { /* Tablet */ }
@media (max-width: 1024px) { /* Small desktop */ }
@media (min-width: 1600px) { /* Large desktop */ }
```

## Animation Standards
- **Transitions**: Use `0.3s ease` for most hover effects
- **Transforms**: Prefer `translateY()` for vertical movement effects
- **Keyframes**: Name animations descriptively (`@keyframes bounce`, `@keyframes pulse`)
- **Performance**: Use `will-change` property sparingly for complex animations

## Accessibility Requirements
- Include `alt` attributes for all images
- Use semantic HTML structure (`<nav>`, `<section>`, `<main>`)
- Ensure keyboard navigation works for all interactive elements
- Maintain color contrast ratios for text readability
- Add `aria-label` for icon-only buttons

## File Modification Guidelines
- **CSS Changes**: Edit specific module files (colors.css, navigation.css, etc.)
- **Style Reuse**: Always check existing CSS classes and styles before creating new ones - reuse standard typography, spacing, component styles, containers, and page layout max-widths to maintain consistency
- **New Components**: Add styles to appropriate CSS module or create new module
- **JavaScript Features**: Create separate JS file for new functionality, import in HTML
- **Assets**: Place icons in `image/icon/`, page images in `image/index/`

## Testing Checklist
- Test responsive design across all breakpoints (480px, 640px, 768px, 1024px, 1600px)
- Verify smooth scrolling and navigation functionality
- Check preloader animation and dot pattern performance
- Validate HTML semantics and accessibility
- Test on mobile devices for touch interactions
- Ensure external links open in new tabs with proper `rel` attributes