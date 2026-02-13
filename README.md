# @saarbyrne/playbook Design System Template

A clean, production-ready template for building React applications with Material UI components styled using the @saarbyrne/playbook design system.

## 📁 Project Structure

```text
/
├── guidelines/
│   └── Guidelines.md          # Component usage guidelines
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── figma/         # Protected Figma components
│   │   │   ├── ui/            # shadcn/ui components (optional)
│   │   │   └── playbook.ts    # ✅ Main export file for @saarbyrne/playbook
│   │   ├── theme/
│   │   │   ├── PlaybookThemeProvider.tsx  # ✅ MUI theme provider
│   │   │   ├── index.ts
│   │   │   └── README.md
│   │   └── App.tsx            # ✅ Your application entry point
│   ├── styles/
│   │   ├── global.css         # ✅ Design system variables
│   │   ├── theme.css          # ✅ Tailwind mappings
│   │   ├── tailwind.css       # Tailwind config
│   │   ├── fonts.css          # Font imports
│   │   └── index.css          # Main CSS entry
│   └── imports/               # Figma imports (if any)
├── DESIGN_SYSTEM.md           # ✅ Complete design system documentation
├── README.md                  # ✅ This file
└── package.json

✅ = Essential files for the design system
```

## 🎨 Design System

### Core Files

1. **`/src/styles/global.css`**
   - All design tokens (colors, spacing, typography, borders, radius, shadows)
   - Synchronized with @saarbyrne/playbook v1.2380.0
   - Edit this file to update your entire app's styling

2. **`/src/app/theme/PlaybookThemeProvider.tsx`**
   - Wraps your app with MUI theme from @saarbyrne/playbook
   - Provides theme to all MUI components
   - Filters out Figma-specific props

3. **`/src/app/components/playbook.ts`**
   - Central export file for all MUI components
   - Import components from here: `import { Button } from './components/playbook'`

4. **`/guidelines/Guidelines.md`**
   - When to use each component
   - Component guidelines for AI generation
   - Best practices for MUI components

## 🚀 Quick Start

### 1. Import Components

Always import from the playbook export file:

```tsx
import {
  Button,
  TextField,
  Typography,
  Box,
  Stack,
  Container
} from './components/playbook';
```

### 2. Wrap Your App with Theme Provider

Already done in `App.tsx`:

```tsx
import { PlaybookThemeProvider } from './theme/PlaybookThemeProvider';

export default function App() {
  return (
    <PlaybookThemeProvider>
      {/* Your app */}
    </PlaybookThemeProvider>
  );
}
```

### 3. Use Components with Design System

```tsx
// Components automatically use design system
<Button variant="contained">Submit</Button>

// Use CSS variables for custom styling
<Box
  sx={{
    backgroundColor: 'var(--primary-main)',
    color: 'var(--primary-contrast)',
    padding: 'var(--spacing-4)',
    borderRadius: 'var(--radius-md)',
    fontFamily: 'var(--font-family-base)',
  }}
>
  Custom Box
</Box>
```

## 🎨 Customizing the Design System

### Change Colors

Edit `/src/styles/global.css`:

```css
/* Change primary color */
--grey-200: #1976d2;  /* New primary color */

/* Change error color */
--red-200: #d32f2f;   /* New error color */

/* Change success color */
--green-200: #2e7d32; /* New success color */
```

### Change Spacing

Edit `/src/styles/global.css`:

```css
--spacing-4: 20px;  /* Change from 16px to 20px */
```

### Change Typography

Edit `/src/styles/global.css`:

```css
/* Change font family (make sure it's imported in fonts.css) */
--font-family-base: 'Roboto', sans-serif;

/* Change font sizes */
--font-size-body1: 18px;
--font-size-h5: 26px;
```

### Change Border Radius

Edit `/src/styles/global.css`:

```css
--radius-md: 8px;  /* Change default from 4px to 8px */
```

## 📦 Available Components

Import any of these from `./components/playbook`:

### Input Components

- `Button`, `IconButton`, `Fab`, `LoadingButton`
- `TextField`, `Select`, `Autocomplete`
- `Checkbox`, `Radio`, `RadioGroup`, `Switch`
- `Slider`, `Rating`

### Data Display

- `Typography`, `Avatar`, `Badge`, `Chip`
- `Table`, `TableBody`, `TableCell`, `TableHead`, `TableRow`
- `List`, `ListItem`, `ListItemText`, `ListItemIcon`
- `Tooltip`, `Divider`
- `DataGrid` (from @mui/x-data-grid-pro)

### Feedback

- `Alert`, `Snackbar`, `Dialog`
- `CircularProgress`, `LinearProgress`
- `Skeleton`, `Backdrop`

### Surfaces

- `Card`, `Paper`, `Accordion`, `AppBar`

### Navigation

- `Tabs`, `Drawer`, `Menu`, `Breadcrumbs`
- `Stepper`, `Pagination`

### Layout

- `Box`, `Container`, `Stack`, `Grid`

### Date/Time Pickers

- `DatePicker`, `DateRangePicker`, `DateTimePicker`
- `TimePicker`
- (from @mui/x-date-pickers-pro)

See `/guidelines/Guidelines.md` for detailed component usage guidelines.

## 🎯 Design System Variables

### Colors

All colors are synchronized with @saarbyrne/playbook:

```css
/* Base Colors */
--grey-200: #3b4960;      /* Primary */
--red-200: #b11b27;       /* Error */
--green-200: #0a875a;     /* Success */
--orange-200: #e55e38;    /* Warning */
--blue-accent: #2E96FF;   /* Accent */
--white: #ffffff;
--black: #000000;

/* Semantic Colors */
--text-primary: var(--grey-200);
--text-secondary: var(--grey-300);
--background-default: var(--white);
--primary-main: var(--grey-200);
--error-main: var(--red-200);
--success-main: var(--green-200);
--warning-main: var(--orange-200);
```

### Spacing

```css
--spacing-1: 4px;
--spacing-2: 8px;
--spacing-3: 12px;
--spacing-4: 16px;
--spacing-6: 24px;
--spacing-8: 32px;
/* ... up to --spacing-24: 96px */
```

### Typography

```css
--font-family-base: 'Open Sans', sans-serif;

--font-size-h1: 96px;
--font-size-h2: 60px;
--font-size-h3: 48px;
--font-size-h4: 34px;
--font-size-h5: 24px;
--font-size-h6: 20px;
--font-size-body1: 16px;
--font-size-body2: 14px;
--font-size-caption: 12px;

--font-weight-light: 300;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### Border & Radius

```css
--border-width-thin: 1px;
--border-color-default: var(--grey-100-50);

--radius-sm: 2px;
--radius-md: 4px;    /* Default */
--radius-lg: 6px;
--radius-xl: 8px;
--radius-full: 9999px;
```

See `/DESIGN_SYSTEM.md` for the complete list of variables.

## 💡 Best Practices

### ✅ DO

```tsx
// Import from playbook export file
import { Button, Typography } from './components/playbook';

// Use CSS variables for custom styling
<Box sx={{ 
  fontFamily: 'var(--font-family-base)',
  fontSize: 'var(--font-size-body1)',
  color: 'var(--text-primary)',
  padding: 'var(--spacing-4)'
}}>
  Content
</Box>

// Let MUI components use the theme automatically
<Button variant="contained">Submit</Button>
<Typography variant="h5">Title</Typography>
```

### ❌ DON'T

```tsx
// Don't import directly from @mui
import Button from '@mui/material/Button';  // ❌

// Don't hardcode values
<Box sx={{ 
  fontFamily: 'Arial',     // ❌
  fontSize: '16px',        // ❌
  color: '#3b4960',        // ❌
  padding: '16px'          // ❌
}}>
  Content
</Box>
```

## 📚 Documentation

- **`/DESIGN_SYSTEM.md`** - Complete design system documentation
- **`/guidelines/Guidelines.md`** - Component usage guidelines
- **`/src/app/theme/README.md`** - Theme provider details

## 🔄 Syncing with @saarbyrne/playbook

The design system CSS variables are synchronized with `@saarbyrne/playbook v1.2380.0`. If the package is updated:

1. Check for new colors/tokens in the package
2. Update `/src/styles/global.css` to match
3. Test all components for visual consistency

## 🛠️ Development Workflow

1. **Start Development**

   ```bash
   npm run dev
   ```

2. **Edit Design System**

   - Open `/src/styles/global.css`
   - Change variables (colors, spacing, etc.)
   - Save and see changes instantly

3. **Add Components**
   - Import from `./components/playbook`
   - Use CSS variables for custom styling
   - Follow guidelines in `/guidelines/Guidelines.md`

4. **Build for Production**

   ```bash
   npm run build
   ```

## 📝 Template Cleanup

The current `App.tsx` contains a welcome template. To start your project:

1. Open `/src/app/App.tsx`
2. Delete the template content inside `<PlaybookThemeProvider>`
3. Build your application using playbook components

## 🤝 For Designers Copying This Template

This template is ready to use:

1. ✅ Design system integrated and documented
2. ✅ All CSS variables mapped to @saarbyrne/playbook
3. ✅ MUI theme provider configured
4. ✅ Component export file ready
5. ✅ Clean starting point with no demo components

**To use:**

1. Copy this entire project
2. Read `/DESIGN_SYSTEM.md` and `/guidelines/Guidelines.md`
3. Edit `/src/styles/global.css` to customize your design
4. Start building in `/src/app/App.tsx`

## 📦 Installed Packages

- `@saarbyrne/playbook` - Design system and MUI components
- `@mui/material` - Material UI base
- `@mui/x-data-grid-pro` - Advanced data grid
- `@mui/x-date-pickers-pro` - Date/time pickers
- `react` + `react-dom` - React framework
- `tailwindcss` v4 - Utility classes (optional)

## 🚀 Deployment

### Deploying to Vercel

This project is configured for seamless deployment to Vercel:

1. **Push to GitHub:**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com) and sign in
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect the Vite framework settings

3. **Verify Settings:**
   - **Framework:** Vite (auto-detected)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm ci`
   - **Node Version:** 18.x or higher

4. **Deploy:**
   - Click "Deploy" and Vercel will build and deploy your app
   - Your app will be live at `https://your-project.vercel.app`

### Build Locally

Test the production build before deploying:

```bash
npm run build
```

The build output will be in `dist/`.

## 🎓 Learning Resources

- [MUI Documentation](https://mui.com/)
- [Design System Variables](/DESIGN_SYSTEM.md)
- [Component Guidelines](/guidelines/Guidelines.md)

---

**Version:** Template v1.0  
**Design System:** @saarbyrne/playbook v1.2380.0  
**Last Updated:** January 2026
