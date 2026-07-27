# ARCHITECTURE.md - System Design

## Overview

Single-page dashboard app that:
1. Accepts Excel file upload (primary) or Google Sheets CSV URL (secondary)
2. Parses and displays data in charts/scorecards
3. Supports cross-filtering across all visualizations
4. Deploys to Vercel as static/SSR Next.js app

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        BROWSER                              │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐    ┌─────────────────────────────────────┐│
│  │ File Upload │───▶│         Excel Parser                ││
│  │ or CSV URL  │    │    (xlsx library, browser-side)     ││
│  └─────────────┘    └──────────────┬──────────────────────┘│
│                                    │                        │
│                                    ▼                        │
│  ┌─────────────────────────────────────────────────────────┤
│  │              DashboardContext (React)                    │
│  │  ┌─────────────┬─────────────┬─────────────────────┐   │
│  │  │ FilterState │ RawData[]   │ Assumptions         │   │
│  │  │ (7 filters) │ (parsed)    │ (editable numbers)  │   │
│  │  └─────────────┴─────────────┴─────────────────────┘   │
│  └────────────────────────┬────────────────────────────────┘
│                           │                                 │
│                           ▼                                 │
│  ┌─────────────────────────────────────────────────────────┐
│  │              Computed Data (useMemo)                     │
│  │  - filteredData (by all active filters)                 │
│  │  - scorecards (Actual count, %TRFS, etc.)               │
│  │  - chartData (grouped by month, stage, etc.)            │
│  └────────────────────────┬────────────────────────────────┘
│                           │                                 │
│              ┌────────────┼────────────┐                   │
│              ▼            ▼            ▼                   │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  Scorecards  │ │    Charts    │ │   Filters    │       │
│  │  (4 tiles)   │ │ (5 charts)  │ │  (7 dropdowns│       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
Excel File / CSV URL
        │
        ▼
┌───────────────┐
│  Parse & Clean│  - Detect header row (skip COUNTA rows)
│               │  - Map columns to schema
│               │  - Handle missing/broken headers
└───────┬───────┘
        │
        ▼
┌───────────────┐
│  SiteRecord[] │  - Normalized data array
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Filters     │  - Province, Town, Vendor, TCO, Program
│   (applied)   │  - Placeholder filters ignored
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Compute     │  - Scorecard values
│   Aggregates  │  - Chart data (group by month, stage)
│   + Merge     │  - Merge with editable Assumptions
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Render      │  - Scorecards, Charts, Tables
│   Components  │  - All receive computed data as props
└───────────────┘
```

---

## File Structure

```
atglobe/
├── app/
│   ├── layout.tsx          # Root layout, fonts, providers
│   ├── page.tsx            # Main dashboard page
│   └── globals.css         # Tailwind + custom tokens
│
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx    # Main layout (sidebar + grid)
│   │   ├── FilterPanel.tsx        # Left sidebar filters
│   │   ├── ScorecardRow.tsx       # Top scorecard tiles
│   │   ├── BuildPlanChart.tsx     # Combo bar+line chart
│   │   ├── StageFunnelChart.tsx   # Horizontal bar chart
│   │   ├── RFIRallyChart.tsx      # Mock horizontal bars
│   │   ├── TCOCharts.tsx          # TCO Award + Performance (mock)
│   │   └── QuarterlyPlanTable.tsx # Q1-Q4 table
│   │
│   ├── data/
│   │   ├── ExcelUploader.tsx      # File upload + preview
│   │   ├── GoogleSheetInput.tsx   # CSV URL input
│   │   └── HeaderDetector.tsx     # Auto-detect header row
│   │
│   └── ui/
│       ├── ScorecardTile.tsx      # Reusable KPI tile
│       ├── Dropdown.tsx           # Filter dropdown
│       └── AssumptionsPanel.tsx   # Editable assumptions modal
│
├── lib/
│   ├── excel-parser.ts            # xlsx parsing logic
│   ├── header-detector.ts         # COUNTA row detection
│   ├── google-sheets.ts           # CSV fetch + parse
│   ├── data-computed.ts           # useMemo hooks for aggregation
│   └── filters.ts                 # Filter logic
│
├── types/
│   └── index.ts                   # All TypeScript types
│
├── context/
│   └── DashboardContext.tsx        # Global state provider
│
├── public/
│   └── screenshot.png             # Reference image
│
├── GEMINI.md
├── MEMORY.md
├── PROGRESS.md
├── ARCHITECTURE.md
├── DATA-SCHEMA.md
├── COMPONENTS.md
├── DECISIONS.md
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## State Management

### DashboardContext

```typescript
interface DashboardState {
  // Data source
  dataSource: 'excel' | 'google-sheets' | null;
  rawData: SiteRecord[];
  
  // Filters
  filters: FilterState;
  
  // Editable assumptions
  assumptions: DashboardAssumptions;
  
  // UI state
  isLoading: boolean;
  error: string | null;
  previewData: PreviewRow[] | null;  // For Excel preview step
}
```

### Actions

- `SET_DATA` - Load parsed Excel/CSV data
- `SET_FILTER` - Update single filter
- `RESET_FILTERS` - Clear all filters
- `UPDATE_ASSUMPTION` - Edit a mock/placeholder value
- `SET_PREVIEW` - Set Excel preview data
- `CONFIRM_IMPORT` - Commit preview to rawData
- `SET_ERROR` - Set error message
- `CLEAR_ERROR` - Clear error

---

## Styling Approach

### Tailwind Config

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      dashboard: {
        bg: '#0d1117',
        card: '#161b22',
        border: '#30363d',
        text: '#e2e8f0',
        muted: '#8b949e',
        accent: {
          purple: '#6b46c1',
          blue: '#3182ce',
        }
      }
    },
    fontFamily: {
      display: ['var(--font-barlow-condensed)', 'sans-serif'],
      body: ['var(--font-inter)', 'sans-serif'],
    }
  }
}
```

### Scorecard Gradient

```css
.scorecard-gradient {
  background: linear-gradient(135deg, #6b46c1 0%, #3182ce 100%);
}
```

---

## Deployment

### Vercel Configuration

- **Build Command:** `npm run build`
- **Output Directory:** `.next`
- **Node.js Version:** 18+
- **Environment Variables:** None required for basic usage

### Google Sheets (if enabled)

- `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` - Default CSV URL (optional)

---

## Performance Considerations

1. **Client-side parsing** - xlsx runs in browser, no server needed
2. **Memoized computations** - All chart data computed via useMemo
3. **Lazy loading** - Charts rendered only when visible (future optimization)
4. **No auth** - Zero server-side logic for basic path

---

## Security Notes

- No user authentication required
- Excel files parsed client-side (never sent to server)
- Google Sheets must be public (published to web)
- No secrets in client bundle
