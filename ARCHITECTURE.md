# ARCHITECTURE.md — System Design

## Overview

Single-page, client-side-rendered dashboard that:
1. Accepts Excel `.xlsx` upload **or** Google Sheets public CSV URL
2. Parses all 33 columns into typed `SiteRecord[]`
3. Applies cross-filtering via sidebar dropdowns
4. Renders scorecards, 5 charts, a data preview table, and a quarterly plan table
5. Deploys to Vercel (zero-config)

**All parsing is client-side** — files never leave the browser.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          BROWSER                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────────────────────────────────┐                      │
│  │            Data Input Layer                │                      │
│  │  ExcelUploader → HeaderDetector → Parser   │                      │
│  │  GoogleSheetInput → CSV Fetch → Parser     │                      │
│  └───────────────────┬────────────────────────┘                      │
│                      │ SiteRecord[]                                  │
│                      ▼                                               │
│  ┌────────────────────────────────────────────┐                      │
│  │         DashboardContext (useReducer)       │                      │
│  │  ┌───────────┬──────────┬────────────────┐ │                      │
│  │  │ rawData   │ filters  │ assumptions    │ │                      │
│  │  │ SiteRec[] │ (7 keys) │ (RTB, RFTI...) │ │                      │
│  │  └───────────┴──────────┴────────────────┘ │                      │
│  └───────────────────┬────────────────────────┘                      │
│                      │                                               │
│                      ▼                                               │
│  ┌────────────────────────────────────────────┐                      │
│  │      useComputedData() — useMemo           │                      │
│  │  - filteredData (apply all 7 filters)      │                      │
│  │  - scorecards (pipeline, plan, actual...)  │                      │
│  │  - buildPlanData (monthly plan/actual)     │                      │
│  │  - stageFunnelData (High Level Status)     │                      │
│  │  - rfiRallyData (CW Status)               │                      │
│  │  - tcoAwardData (TCO/BAU Vendor)          │                      │
│  │  - tcoPerformanceData (TRS Status)        │                      │
│  └────────┬──────────┬──────────┬────────────┘                      │
│           │          │          │                                    │
│           ▼          ▼          ▼                                    │
│  ┌───────────┐ ┌─────────┐ ┌───────────┐                            │
│  │Scorecards │ │ Charts  │ │ DataTable │                            │
│  │(7 tiles) │ │(5 types)│ │(preview + │                            │
│  └───────────┘ └─────────┘ │ export)  │                            │
│                             └───────────┘                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## File Structure (Target)

```
DataAnalyticsDashboard/
├── info/
│   ├── Dashboard.pdf              ← Visual reference
│   ├── T8_Master_Dataset_Populated.xlsx  ← Sample data
│   └── T8_Master_Dataset_Populated.pdf
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             ← Fonts, DashboardProvider
│   │   ├── page.tsx               ← Single page: upload view OR dashboard view
│   │   └── globals.css            ← Tailwind 4 @theme tokens + base styles
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── FilterPanel.tsx         ← 7-filter sidebar (all real columns)
│   │   │   ├── ScorecardRow.tsx        ← Top KPI tiles row
│   │   │   ├── BuildPlanChart.tsx      ← ComposedChart: bar + line
│   │   │   ├── StageFunnelChart.tsx    ← Horizontal BarChart (High Level Status)
│   │   │   ├── RFIRallyChart.tsx       ← Horizontal BarChart (CW Status)
│   │   │   ├── TCOCharts.tsx           ← Two horizontal BarCharts side-by-side
│   │   │   ├── QuarterlyPlanTable.tsx  ← Q1–Q4 plan vs actual table
│   │   │   └── DataPreviewTable.tsx    ← NEW: scrollable data table + CSV export
│   │   │
│   │   ├── data/
│   │   │   ├── ExcelUploader.tsx       ← File input + drag-and-drop
│   │   │   ├── HeaderDetector.tsx      ← Preview + column mapping UI
│   │   │   └── GoogleSheetInput.tsx    ← CSV URL input + refresh button
│   │   │
│   │   └── ui/
│   │       ├── ScorecardTile.tsx       ← Single KPI tile (gradient)
│   │       ├── EditableNumber.tsx      ← Inline editable number
│   │       ├── Dropdown.tsx            ← Filter dropdown
│   │       └── AssumptionsPanel.tsx    ← Full modal: RTB, RFTI, YTD, plan overrides
│   │
│   ├── lib/
│   │   ├── excel-parser.ts            ← SheetJS → SiteRecord[]
│   │   ├── header-detector.ts         ← COUNTA skip + header fuzzy match
│   │   ├── google-sheets.ts           ← Fetch CSV + parse + polling
│   │   ├── data-computed.ts           ← useComputedData() hook (all aggregations)
│   │   └── filters.ts                 ← applyFilters(rawData, filters) → SiteRecord[]
│   │
│   ├── types/
│   │   └── index.ts                   ← All TypeScript interfaces
│   │
│   └── context/
│       └── DashboardContext.tsx        ← Global state + localStorage persistence
│
├── GEMINI.md         ← Agent instructions (this project's root doc)
├── MEMORY.md         ← Append-only session checkpoint log
├── PROGRESS.md       ← Phase/task status tracker
├── ARCHITECTURE.md   ← This file
├── DATA-SCHEMA.md    ← Column definitions, types, known values
├── COMPONENTS.md     ← Component API reference
├── DECISIONS.md      ← Architecture Decision Records
└── AGENTS.md         ← Antigravity agent rules (Next.js 16 warning)
```

---

## State Management

### DashboardContext — Full State Shape

```typescript
interface DashboardAssumptions {
  // Manually editable scorecards
  rtbCount: number;         // default: 271
  rftiCount: number;        // default: 166
  ytdActual: number;        // default: 99
  ytdPlan: number;          // default: 158

  // Build Plan sprint reference line
  q3SprintTarget: number;   // default: 33 (the max value in the Excel column)
  // Note: Q3 Sprint Target in Excel is a per-row integer (23/24/25/27/33), NOT a monthly array
  // For the chart: display as a horizontal ReferenceLine at this value
}

interface DashboardState {
  dataSource: 'excel' | 'google-sheets' | null;
  rawData: SiteRecord[];           // All loaded rows

  filters: FilterState;            // 7 active filter values

  assumptions: DashboardAssumptions; // Editable overrides (RTB, RFTI, YTD...)

  isLoading: boolean;
  error: string | null;

  // Excel preview flow
  previewData: any[][] | null;     // Raw rows before user confirms
  headers: string[] | null;        // Detected header row

  // Google Sheets
  googleSheetsUrl: string | null;
  lastRefreshed: string | null;    // ISO timestamp
}
```

### Actions

```typescript
type DashboardAction =
  | { type: 'LOAD_STATE'; payload: Partial<DashboardState> }
  | { type: 'SET_DATA'; payload: { source: 'excel'|'google-sheets'; data: SiteRecord[] } }
  | { type: 'CLEAR_DATA' }
  | { type: 'SET_FILTER'; payload: { key: keyof FilterState; value: string } }
  | { type: 'RESET_FILTERS' }
  | { type: 'UPDATE_ASSUMPTION'; payload: { key: keyof DashboardAssumptions; value: any } }
  | { type: 'SET_PREVIEW'; payload: { data: any[][]; headers: string[] } }
  | { type: 'CANCEL_PREVIEW' }
  | { type: 'CONFIRM_IMPORT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GOOGLE_SHEETS_URL'; payload: string }
  | { type: 'SET_LAST_REFRESHED'; payload: string }
```

### localStorage Keys

```
atglobe-state-v2  →  { assumptions, dataSource, googleSheetsUrl }
```
> ⚠️ Do NOT persist `rawData` to localStorage — it can be hundreds of KB. Persist only assumptions and metadata.

---

## Computed Data — useComputedData()

All aggregations happen in `src/lib/data-computed.ts` using `useMemo`. No chart component computes its own data.

```typescript
function useComputedData() {
  // filteredData = applyFilters(rawData, filters)

  // scorecards computed from filteredData:
  //   pipeline = rawData.length (unfiltered!)
  //   plan     = rawData.filter(r => r.isInPlan).length (unfiltered!)
  //   actual   = filteredData.filter(r => r.actualMonthTrfs !== null).length
  //   %TRFS    = actual / plan * 100

  // buildPlanData: 12-entry array, Jan–Dec
  //   plan[m]  = filteredData.filter(r => r.isInPlan && r.targetMonthTrfs === MONTH[m]).length
  //   actual[m]= filteredData.filter(r => r.actualMonthTrfs === MONTH[m]).length
  //   sprint   = assumptions.q3SprintTarget (single number — used as ReferenceLine in Recharts)
  //   ⚠️ Q3 Sprint Target is NOT a monthly array; it's a per-row int (23/24/25/27/33)

  // stageFunnelData: count filteredData by highLevelStatus, sorted by STAGE_ORDER
  // rfiRallyData: count filteredData by cwStatus, sorted by CW_STATUS_ORDER
  // tcoAwardData: count filteredData by tcoBauVendor, sorted by count desc
  // tcoPerformanceData: count filteredData by trsStatus, sorted by TRS_STATUS_ORDER
}
```

---

## Styling (Tailwind 4)

All tokens in `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-dashboard-bg: #0d1117;
  --color-dashboard-card: #161b22;
  --color-dashboard-border: #30363d;
  --color-dashboard-text: #e2e8f0;
  --color-dashboard-muted: #8b949e;
  --color-dashboard-accent-purple: #6b46c1;
  --color-dashboard-accent-blue: #3182ce;
  --color-dashboard-accent-orange: #dd6b20;
  --color-dashboard-accent-green: #38a169;
  --font-display: var(--font-barlow-condensed), sans-serif;
  --font-body: var(--font-inter), sans-serif;
}
```

Class usage examples:
- `bg-dashboard-bg` → page background
- `bg-dashboard-card` → card/panel background
- `text-dashboard-muted` → secondary text
- `font-display` → Barlow Condensed (large numbers)

---

## Performance Considerations

1. **Client-side parsing** — SheetJS runs in browser; no server upload needed
2. **useMemo** — all chart data recomputed only when `filteredData` or `assumptions` change
3. **No rawData in localStorage** — only assumptions/metadata persisted (keeps storage small)
4. **Lazy chart render** — charts only mount after data is loaded
5. **Virtual scrolling** — DataPreviewTable uses windowing for large datasets (future opt.)

---

## Deployment (Vercel — out of scope for current sprint)

- **Build command:** `npm run build`
- **Output directory:** `.next`
- **Node.js:** 18+
- **Env vars:** None required for basic usage
- `NEXT_PUBLIC_GOOGLE_SHEETS_CSV_URL` — optional default CSV URL

---

## Security

- Files parsed client-side, never sent to server
- Google Sheets must be publicly published to the web
- No auth, no secrets, no server-side state
