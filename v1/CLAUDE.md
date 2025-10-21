# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Patient Aggregate Record - A React + TypeScript + Vite application for managing patient records. The project uses shadcn/ui components (New York style) with Tailwind CSS v4 for styling.

## Development Commands

```bash
# Start development server with HMR
npm run dev

# Build for production (runs TypeScript compiler first, then Vite build)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.7
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS v4.1.14 (with Vite plugin)
- **UI Components**: shadcn/ui (New York style) with Radix UI primitives
- **Icons**: lucide-react

### Project Structure
- `src/` - Application source code
  - `components/ui/` - shadcn/ui components (button, etc.)
  - `lib/utils.ts` - Utility functions (includes `cn()` for className merging)
  - `App.tsx` - Main application component
  - `main.tsx` - Application entry point
- `public/` - Static assets
- Path alias `@` maps to `./src` (configured in vite.config.ts)

### shadcn/ui Configuration
The project uses shadcn/ui with the following settings (components.json):
- Style: "new-york"
- Base color: "neutral"
- CSS variables enabled
- Icon library: lucide
- Path aliases: `@/components`, `@/lib`, `@/hooks`, `@/ui`

Add new shadcn/ui components using: `npx shadcn@latest add [component-name]`

### TypeScript Configuration
- Uses separate tsconfig files: `tsconfig.app.json` (app code) and `tsconfig.node.json` (build tools)
- Root `tsconfig.json` references both configurations
- Strict mode enabled with path aliases configured

## Application Architecture

### Data Model
The application manages patient records with the following data structure:
- **PatientRow**: Core data type with flexible columns from CSV import
  - `age`: Optional string field for patient age
  - `diseases`: Optional array of disease categories
  - Additional fields dynamically loaded from CSV headers

- **Predefined Disease Categories**: 17 disease categories are hardcoded in `App.tsx` (DISEASES constant):
  - Blood & Blood Components, Cardiovascular, Development Anomalies, Endocrine Nutrition and Metabolic, ENT, Gastro and Digestive, Infectious, Neurology, OB, Oncology, Ortho, Pulmo, Renal, Surgery, Trauma, Urology, Psych

### Core Features
1. **CSV Import**: Upload patient CSV files - automatically parses headers and rows
2. **Age Management**: Input and edit patient ages with automatic age group categorization (0-17, 18-29, 30-39, 40-49, 50-59, 60-69, 70-79, 80+)
3. **Disease Tracking**: Multi-select disease checkboxes per patient with visual feedback (green highlight when selected)
4. **Statistical Analysis**: Generate summary reports with:
   - Age group distribution (bar charts)
   - Disease prevalence (horizontal bar charts)
   - Age breakdown per disease (individual charts per disease)
5. **Demo Mode**: Random autofill button for testing/demonstration purposes

### State Management
- Uses React's `useState` for all state management (no external state library)
- Main state: `csvData` (array of PatientRow objects) and `headers` (array of column names from CSV)
- All data processing happens in-memory; no backend or persistence

### UI/UX Patterns
- **Sticky positioning**: Name column and age column stick to left side during horizontal scroll
- **Sticky header**: Table headers remain visible during vertical scroll
- **Interactive cells**: Disease checkboxes are clickable at both cell and checkbox level
- **Dialog-based reporting**: Statistical summaries displayed in a modal overlay using shadcn Dialog component
- **Responsive charts**: Uses Recharts library with ResponsiveContainer for adaptive chart sizing
