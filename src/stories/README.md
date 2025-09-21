# Dragon Ball Table Storybook

This directory contains Storybook stories for all the components in the Dragon Ball Table application.

## Available Stories

### Core Components

1. **FilterPanel** - Interactive filter panel with search, dropdowns, and range slider
2. **TableHeader** - Sortable table header with selection controls
3. **TableRow** - Individual character row with selection and responsive design
4. **LoadingRow** - Skeleton loading state for individual rows
5. **TableSkeleton** - Full table loading skeleton
6. **DragonBallTable** - Complete table component with all features

## Running Storybook

```bash
npm run storybook
```

This will start Storybook on `http://localhost:6006`

## Building Storybook

```bash
npm run build-storybook
```

## Features Demonstrated

### FilterPanel Stories
- Default empty state
- Active filters with various combinations
- Long text handling
- Mobile responsive design
- All filter types active

### TableRow Stories
- Default character display
- Selected state styling
- Different health states (Healthy, Injured, Critical)
- Power level formatting (K, M, B)
- Long character names
- Mobile layout

### TableHeader Stories
- Sorting states (ascending, descending, none)
- Selection states (none, all, partial)
- Combined sorting and selection
- Mobile responsive header

### Loading States
- Individual row loading skeleton
- Multiple loading rows
- Full table skeleton

### Complete Table
- Different page sizes
- Virtualization on/off
- Mobile and tablet views
- Full functionality integration

## Accessibility Testing

All stories include accessibility testing via the `@storybook/addon-a11y` addon. Check the Accessibility panel in Storybook to see any violations or improvements.

## Visual Testing

Stories are configured for visual regression testing and can be used with Chromatic or other visual testing tools.

## Development Notes

- All stories use proper TypeScript typing
- Stories include comprehensive documentation
- Mobile viewports are configured for responsive testing
- Stories use realistic data that matches the application
- Proper decorators are used to provide necessary context (QueryClient, styling, etc.)