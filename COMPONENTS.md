# COMPONENTS.md — Component API Reference

> Every component reads data from `DashboardContext` or `useComputedData()` — no prop-drilling except where noted.

---

## Layout & Page

### `app/page.tsx` — Main Page

Single-page app. Two views:
- **Upload View:** shown when `rawData.length === 0` — ExcelUploader + GoogleSheetInput
- **Dashboard View:** shown when `rawData.length > 0`

**Dashboard View Layout:**
```
┌────────────┬──────────────────────────────────────────────────────┐
│  Sidebar   │  Header (title + live date)                          │
│            │  ScorecardRow (7 tiles)                              │
│  Filter-   │  BuildPlanChart (full width)                         │
│  Panel     │  ┌─────────────────┬──────────────────────────────┐  │
│            │  │ StageFunnelChart│ RFIRallyChart                │  │
│            │  └─────────────────┴──────────────────────────────┘  │
│            │  TCOCharts (two side-by-side)                        │
│            │  QuarterlyPlanTable                                  │
│            │  DataPreviewTable (collapsible)                      │
└────────────┴──────────────────────────────────────────────────────┘
```

---

## Data Input Components

### `ExcelUploader`
**File:** `src/components/data/ExcelUploader.tsx`

**Props:** none (reads/writes DashboardContext)

**Features:**
- Click-to-upload OR drag-and-drop file zone
- Accepts `.xlsx`, `.xls`, `.csv`
- Shows loading spinner during parse
- Passes raw rows to `HeaderDetector` for mapping step
- Error banner on parse failure

**Flow:**
```
File selected → parseExcelFile() → detectHeaderRowIndex()
             → show HeaderDetector → user confirms
             → mapRowToSiteRecord() × N → dispatch SET_DATA
```

---

### `HeaderDetector`
**File:** `src/components/data/HeaderDetector.tsx`

**Props:**
```typescript
{
  previewData: any[][];          // First 10+ raw rows
  headerRowIndex: number;        // Auto-detected header row
  onConfirm: (columnMap: Record<string, string>) => void;
  onCancel: () => void;
}
```

**Features:**
- Scrollable table showing first 10 rows
- Detected header row highlighted in green
- Dropdown per column to map → `SiteRecord` field key
- Warns on broken headers (site names, empty cells)
- "Confirm & Import" button
- "Cancel" button

---

### `GoogleSheetInput`
**File:** `src/components/data/GoogleSheetInput.tsx`

**Props:** none (reads/writes DashboardContext)

**Features:**
- Text input for public CSV URL
- "Load" button → fetch → parse CSV → dispatch SET_DATA
- Loading spinner
- "Refresh" button (when URL is already set) with:
  - Last refreshed timestamp
  - Countdown to next auto-refresh (optional: 5-min interval)
- Error banner on fetch failure

---

## Filter Components

### `FilterPanel`
**File:** `src/components/dashboard/FilterPanel.tsx`

**Props:** none

**Contains 7 Dropdown filters:**
| Filter Label | Context Key | Data Source |
|-------------|------------|------------|
| Sales Area | `salesArea` | Unique values from `rawData.salesArea` |
| Province | `province` | Unique values from `rawData.province` |
| Town / City | `town` | Filtered by Province selection (note: not strictly hierarchical — see DATA-SCHEMA.md) |
| Access Vendor | `accessVendor` | Unique from `rawData.accessVendor` |
| TCO/BAU Vendor | `tco` | Unique from `rawData.tcoBauVendor` |
| Solution Type | `solutionType` | Unique from `rawData.solutionType` (**NOT** `rawData.program`) |
| Vanguard / Prio Site | `vanguardPrioSite` | `['Y', 'N']` |

**Features:**
- Province selection auto-clears Town filter
- "Clear All Filters" button at bottom
- Filter count badge (e.g., "3 active")

---

### `Dropdown` (reusable)
**File:** `src/components/ui/Dropdown.tsx`

**Props:**
```typescript
{
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  allLabel?: string;    // default: "All"
  disabled?: boolean;
}
```

---

## Scorecard Components

### `ScorecardRow`
**File:** `src/components/dashboard/ScorecardRow.tsx`

**Props:** none

**Renders 7 tiles:**
```
[Pipeline] [Plan] [Actual] [% TRFS] [RTB / %RTB] [RFTI / %RFTI] [YTD % TRFS]
```

- `Pipeline`, `Plan`, `Actual`, `% TRFS` → computed, not editable
- `RTB / %RTB` → RTB count is EditableNumber; %RTB computed
- `RFTI / %RFTI` → RFTI count is EditableNumber; %RFTI computed
- `YTD % TRFS` → has sub-tile showing YTD Actual / YTD Plan

---

### `ScorecardTile` (reusable)
**File:** `src/components/ui/ScorecardTile.tsx`

**Props:**
```typescript
{
  title: string;
  value: React.ReactNode;   // number, string, or JSX (for EditableNumber)
  subtitle?: string;
  gradient?: boolean;        // applies scorecard-gradient
  size?: 'default' | 'large';
}
```

**Styling:**
- `gradient=true` → `linear-gradient(135deg, #6b46c1, #3182ce)`
- `gradient=false` → `bg-dashboard-card border-dashboard-border`
- Title: small muted label, 11px
- Value: Barlow Condensed 700, 2xl–3xl

---

### `EditableNumber`
**File:** `src/components/ui/EditableNumber.tsx`

**Props:**
```typescript
{
  value: number;
  onChange: (value: number) => void;
  className?: string;
}
```

**Behavior:** Click to activate → shows `<input type="number">` → blur/Enter saves

---

## Chart Components

> All charts use `useComputedData()` — they do NOT receive chart data as props.

### `BuildPlanChart`
**File:** `src/components/dashboard/BuildPlanChart.tsx`

**Data source:** `useComputedData().buildPlanData`

**Chart:** Recharts `ComposedChart`
- Blue bars: `plan` (Target Month counts for `263 List = 'Yes'` rows, monthly)
- Purple bars: `actual` (Actual Month TRFS counts, monthly)
- Orange line: flat reference line from `assumptions.q3SprintTarget` (single int, default 33)
  - ⚠️ NOT a 12-element monthly array — the Q3 Sprint Target column is a per-row integer (23/24/25/27/33)
  - Show as a horizontal `ReferenceLine` in Recharts at `y = assumptions.q3SprintTarget`
- X-axis: Jan–Dec

**Width:** Full-width card

---

### `StageFunnelChart`
**File:** `src/components/dashboard/StageFunnelChart.tsx`

**Data source:** `useComputedData().stageFunnelData`

**Chart:** Recharts horizontal `BarChart`
- Sorted by `HIGH_LEVEL_STATUS_ORDER` (10 stages, NOT 9 — TSSR was previously missing)
- Shows all 10 stages, even if count = 0
- Blue/purple bars
- Count labels on right of each bar

**Stage order array (exact strings):**
```typescript
const HIGH_LEVEL_STATUS_ORDER = [
  's-RFI', 's-RFI & TRS Ready', 'Awarded', 'For Awarding',
  'LGU Permitting', 'TSSR', 'TRS Ready', "RTB'd", "RFI'd", 'TRFS'
];
```

**Width:** ~50% (left of RFI Rally)

---

### `RFIRallyChart`
**File:** `src/components/dashboard/RFIRallyChart.tsx`

**Data source:** `useComputedData().rfiRallyData`

**Chart:** Recharts horizontal `BarChart`
- Sorted by `CW_STATUS_ORDER`
- 7 CW stages (18–26, excluding 21 and 25)
- Blue bars
- Count labels on right

**Width:** ~50% (right of Stage Funnel)

---

### `TCOCharts`
**File:** `src/components/dashboard/TCOCharts.tsx`

**Data source:** `useComputedData().tcoAwardData` + `useComputedData().tcoPerformanceData`

**Two charts side-by-side:**

**TCO Award & Status:**
- Horizontal BarChart by `TCO/BAU Vendor`
- Sorted by count descending

**TCO Performance:**
- Horizontal BarChart by `TRS Status`
- Sorted by `TRS_STATUS_ORDER`

> ✅ No longer uses pie charts or hardcoded mock data — 100% data-driven.

---

### `QuarterlyPlanTable`
**File:** `src/components/dashboard/QuarterlyPlanTable.tsx`

**Data source:** `useComputedData().quarterlyData` + `state.assumptions`

**Table layout:**
| | Q1 | Q2 | Q3 | Q4 | Total |
|--|----|----|----|----|-------|
| Plan | X | X | X | X | Σ |
| Actual | X | X | X | X | Σ |
| % | % | % | % | % | % |

- Plan = count of `263 List = 'Yes'` rows where `targetQuarterTrfs` = Qn
- Actual = count of rows where `actualQuarterTrfs` = Qn

---

### `DataPreviewTable` ← NEW
**File:** `src/components/dashboard/DataPreviewTable.tsx`

**Data source:** `useComputedData().filteredData`

**Features:**
- Collapsible panel (collapsed by default)
- Shows all filtered rows in a scrollable table
- Key columns displayed: Serial Number, SR Name, High Level Status, Province, City/Town, Access Vendor, TCO/BAU Vendor, Target Month, Actual Month
- Row count badge: `Showing X of Y records`
- "Export CSV" button → downloads `filteredData` as CSV

---

### `ProvincePlanActualChart`
**File:** `src/components/dashboard/ProvincePlanActualChart.tsx`

**Data source:** `useComputedData().provinceBreakdownData`

**Chart:** Recharts horizontal `BarChart` comparing Pipeline, PLAN (In-Year), and Actual TRFS across top provinces (Bukidnon, Lanao del Norte, Zamboanga del Sur, Misamis Oriental, etc.).

---

### `TownPlanActualTable`
**File:** `src/components/dashboard/TownPlanActualTable.tsx`

**Data source:** `useComputedData().townBreakdownData`

**Table:** Paginated breakdown table (15 rows/page) showing `Town`, `Pipeline`, `PLAN (In-Year)`, `RTB`, `RFI`, `TRFS` for all 49 towns.

---

### `OngoingWirelessTable`
**File:** `src/components/dashboard/OngoingWirelessTable.tsx`

**Data source:** `useComputedData().ongoingWirelessData`

**Table:** Paginated table (10 rows/page) filtering sites at `TRS Ready` status (`SN`, `SR Name`, `TCO`, `TRS Sol'n`, `TRS Vendor`, `TRS Actual`, `Integration Remarks`).

---

### `OngoingTransportTable`
**File:** `src/components/dashboard/OngoingTransportTable.tsx`

**Data source:** `useComputedData().ongoingTransportData`

**Table:** Paginated table (10 rows/page) filtering sites with active `RFTI` milestones (`SN`, `SR Name`, `Actual RFTI`, `Lapse (Days)`, `TCO`, `Access Vendor`, `ODC`, `TRS Plan`, `TRS Sol'n`, `TRS Vendor`).

---

### `MasterSiteDetailsTable`
**File:** `src/components/dashboard/MasterSiteDetailsTable.tsx`

**Data source:** `useComputedData().filteredData`

**Table:** Master site details table with live search & pagination (25 rows/page) (`SN`, `SR Name`, `High Level Status`, `Target RFTI`, `TCO Vendor`, `CW Status Stage`, `TRS Vendor`, `TRS Status`, `TRS Remarks`).

---

## UI Components

### `AssumptionsPanel`
**File:** `src/components/ui/AssumptionsPanel.tsx`

**Props:** none (reads/writes DashboardContext)

**Modal sections:**

**Section 1 — Scorecard Overrides**
| Field | Input | Description |
|-------|-------|-------------|
| RTB Count | number input | Right-to-Build count |
| RFTI Count | number input | Ready-For-TRS-Integration count |
| YTD Actual | number input | Year-to-date actual |
| YTD Plan | number input | Year-to-date plan |

**Section 2 — Build Plan Sprint Line (Monthly)**
- 12 number inputs (Jan–Dec) for the orange Q3 Sprint target line
- Labeled: "Jan Plan Override", "Feb Plan Override", etc.

**Behavior:**
- Opens via "Edit Assumptions" button in sidebar
- Changes dispatch `UPDATE_ASSUMPTION` → persist to localStorage
- "Reset to Defaults" button restores default values
- "Close" button

---

## Context Provider

### `DashboardProvider`
**File:** `src/context/DashboardContext.tsx`

**Provides:**
- `state: DashboardState`
- `dispatch: React.Dispatch<DashboardAction>`

**localStorage:**
- Saves on every `assumptions` change
- Saves `googleSheetsUrl` and `lastRefreshed`
- Does NOT save `rawData` (too large)
- Loads on mount

**Exports:**
- `DashboardProvider` — wrap in `app/layout.tsx`
- `useDashboard()` — hook for any client component
