# COMPONENTS.md - Component Inventory

## Layout Components

### DashboardLayout
**File:** `components/dashboard/DashboardLayout.tsx`

Main layout wrapper. Sidebar on left, content grid on right.

```
┌──────────┬────────────────────────────────────┐
│          │  Header (title + date)             │
│ Sidebar  │  ScorecardRow                      │
│ Filters  │  BuildPlanChart │ RFI Rally        │
│          │  StageFunnel    │ TCO Charts       │
│          │  QuarterlyPlanTable                 │
└──────────┴────────────────────────────────────┘
```

**Props:** `{ children: React.ReactNode }`
**State:** Reads from DashboardContext

---

## Data Input Components

### ExcelUploader
**File:** `components/data/ExcelUploader.tsx`

File input with drag-and-drop. Shows preview table after selection.

**Props:** `{ onFileSelected: (file: File) => void }`
**State:** 
- `file: File | null`
- `previewRows: any[][] | null`
- `detectedHeaderRow: number`
- `isAnalyzing: boolean`

**Features:**
- Accepts .xlsx, .xls, .csv
- Shows first 10 rows in preview table
- Highlights detected header row
- User can override header row selection
- Shows broken header warnings

### HeaderDetector
**File:** `components/data/HeaderDetector.tsx`

Preview table with row detection and column mapping.

**Props:** `{ 
  rows: any[][], 
  detectedHeaderRow: number,
  onConfirm: (headerRow: number, columnMap: Record<number, string>) => void,
  onCancel: () => void 
}`

**Features:**
- Highlights detected header row in green
- Dropdown per column to override mapping
- Detects broken headers, suggests fixes
- "Confirm & Import" button

### GoogleSheetInput
**File:** `components/data/GoogleSheetInput.tsx`

Simple URL input for public Google Sheets CSV.

**Props:** `{ onUrlSubmit: (url: string) => void }`
**State:** `url: string`

**Features:**
- Text input for CSV URL
- "Load" button
- Shows loading spinner during fetch
- Error message on failure

---

## Filter Components

### FilterPanel
**File:** `components/dashboard/FilterPanel.tsx`

Left sidebar with all filter dropdowns.

**Props:** None (reads/writes DashboardContext)
**State:** All state from context

**Contains:**
- SalesAreaFilter (placeholder)
- ProvinceFilter
- TownFilter
- AccessVendorFilter
- TCOFilter
- SolutionTypeFilter
- VanguardPrioFilter (placeholder)

### Dropdown (reusable)
**File:** `components/ui/Dropdown.tsx`

Generic dropdown filter component.

**Props:** `{ 
  label: string, 
  value: string, 
  options: string[], 
  onChange: (value: string) => void,
  allLabel?: string 
}`

---

## Scorecard Components

### ScorecardRow
**File:** `components/dashboard/ScorecardRow.tsx`

Row of scorecard tiles at top of dashboard.

**Props:** None (reads from context + computed data)

**Layout:**
```
[Pipeline] [Plan] [Actual] [%TRFS] | [RTB] [%RTB] [RFTI] [%RFTI] | [YTD] | [Quarterly Plan]
```

### ScorecardTile (reusable)
**File:** `components/ui/ScorecardTile.tsx`

Single KPI tile with gradient background.

**Props:** `{ 
  label: string, 
  value: number | string, 
  subtitle?: string,
  variant?: 'large' | 'small' | 'ytd',
  isEditable?: boolean,
  onEdit?: () => void 
}`

**Styling:**
- Gradient background (purple to blue)
- Large bold number (Barlow Condensed 700)
- Small label below
- Rounded corners
- Hover effect (subtle scale)

### QuarterlyPlanTable
**File:** `components/dashboard/QuarterlyPlanTable.tsx`

Q1-Q4 table with Plan and Actual rows.

**Props:** `{ 
  plan: { q1: number, q2: number, q3: number, q4: number },
  actual: { q1: number, q2: number, q3: number, q4: number }
}`

---

## Chart Components

### BuildPlanChart
**File:** `components/dashboard/BuildPlanChart.tsx`

Combo bar+line chart, Jan-Dec.

**Props:** `{ 
  planTrfs: number[],     // 12 values
  actualTrfs: number[],   // 12 values
  q3Sprint: number[]      // 12 values (line overlay)
}`

**Chart Type:** Recharts ComposedChart
- Plan TRFS: Blue bars
- Actual TRFS: Purple bars
- Q3 Sprint: Orange line with data labels

**Layout:** ~60% width, left side

### StageFunnelChart
**File:** `components/dashboard/StageFunnelChart.tsx`

Horizontal bar chart showing counts by Lead Indicator stage.

**Props:** `{ 
  data: Record<string, number>,  // stage -> count
  stageOrder: string[]            // sorted order
}`

**Chart Type:** Recharts BarChart (horizontal)
- Sorted by stageOrder, not by count
- Blue/purple bars

**Layout:** ~40% width, right of BuildPlanChart

### RFIRallyChart
**File:** `components/dashboard/RFIRallyChart.tsx`

Horizontal bar chart for construction stages.

**Props:** `{ 
  data: {
    forMob: number,
    excavation: number,
    rebarInstallation: number,
    concretePouring: number,
    backfilling: number,
    towerErection: number,
    sRfi: number,
    rfi: number
  }
}`

**Chart Type:** Recharts BarChart (horizontal)
- All values from editable assumptions (mock)

**Note:** No real data field maps to this chart

### TCOCharts
**File:** `components/dashboard/TCOCharts.tsx`

Two charts side by side: TCO Award and Status, TCO Performance.

**Props:** `{ /* mock data */ }`

**Note:** These charts are reconstructed from partial screenshot reference. Marked as "UNVERIFIED" in UI.

---

## UI Components

### AssumptionsPanel
**File:** `components/ui/AssumptionsPanel.tsx`

Modal/panel for editing placeholder/mock values.

**Props:** `{ 
  assumptions: DashboardAssumptions,
  onSave: (updated: DashboardAssumptions) => void,
  onClose: () => void 
}`

**Features:**
- Organized by section (Scorecard, YTD, Quarterly, Build Plan, RFI Rally)
- Number inputs for each editable value
- Save to localStorage
- Load from localStorage

### EditableNumber
**File:** `components/ui/EditableNumber.tsx`

Inline editable number with edit icon.

**Props:** `{ 
  value: number, 
  onChange: (value: number) => void,
  label?: string 
}`

---

## Context Provider

### DashboardProvider
**File:** `context/DashboardContext.tsx`

Global state management for entire dashboard.

**Provides:**
- `state: DashboardState`
- `dispatch: React.Dispatch<DashboardAction>`
- `filteredData: SiteRecord[]` (memoized)
- `computedScorecards: ScorecardData` (memoized)
- `computedChartData: ChartData` (memoized)

**localStorage Keys:**
- `atglobe-assumptions` - Saved assumptions
- `atglobe-last-data` - Last loaded data (optional)
