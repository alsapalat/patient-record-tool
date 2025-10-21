# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based patient aggregation record application that allows medical professionals to upload CSV files containing patient data, annotate records with age and disease information, and generate statistical summaries.

## Commands

### Development
```bash
npm run dev        # Start development server on port 4400
npm run build      # Type-check with TypeScript and build for production
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

## Architecture

### State Management Strategy

This app uses a **dual-state pattern** for optimal performance:

1. **Local State (`useState` in App.tsx)**: Primary source of truth for UI rendering. All user interactions update local state first for instant UI feedback.

2. **Zustand Store (`src/store/patientStore.ts`)**: Persistent background store with sessionStorage. Components do NOT subscribe to it directly. Instead:
   - Initial data is loaded from store once: `useState(() => usePatientStore.getState().csvData)`
   - Updates sync to store via `usePatientStore.setState()` without subscriptions
   - This prevents unnecessary re-renders while maintaining persistence

**Critical**: When modifying state logic, always update both local state AND sync to Zustand store using `setState()`. Never use Zustand hooks that create subscriptions (like `usePatientStore(state => state.csvData)`).

### Core Data Flow

1. **CSV Upload** (`App.tsx:14-53`): FileReader parses CSV → Updates local state + Zustand store
2. **Data Editing**: User interactions (age, date, disease toggles) → Update local state → Sync to store
3. **Persistence**: Zustand persist middleware saves to sessionStorage automatically
4. **Statistics**: Calculated on-demand from current local state in `SummaryDialog`

### Key Components

- **App.tsx**: Main container managing CSV data state and coordinating all data mutations
- **PatientGrid.tsx**: Renders grid layout with sticky headers (Name, Age columns) using CSS Grid
- **PatientRow.tsx**: Individual patient row with editable age/date fields and disease checkboxes
- **SummaryDialog.tsx**: Modal with Recharts visualizations showing age groups and disease statistics
- **FileUploadSection.tsx**: Header with upload, autofill, clear, and summary generation buttons

### Data Types

**PatientRow** (`src/store/patientStore.ts:4-9`):
- Flexible structure: `{ [key: string]: string | string[] | undefined }`
- Special fields: `age?: string`, `date?: string`, `diseases?: string[]`
- Preserves all original CSV columns while adding computed fields

### Disease Constants

17 medical categories defined in `src/constants/diseases.ts` with shorthand mappings for compact grid display (e.g., "Cardiovascular" → "Cardio").

### Utilities

- **dateParser.ts**: Handles various CSV date formats (Excel serials, ISO strings, MM/DD/YYYY)
- **statistics.ts**: Computes age group distributions and disease prevalence with age breakdowns

### Styling

- Tailwind CSS v4 with custom CSS Grid layouts
- Custom scrolling behavior with sticky columns (Name, Age)
- React Compiler enabled for automatic performance optimization

### Path Aliases

Use `@/` to reference `./src` (configured in vite.config.ts and tsconfig)
