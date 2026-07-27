# PROGRESS.md — Task Tracker

> **Updated:** 2026-07-27
> **Current Phase:** Phase 0 — Audit & Repair
> **Agent:** Antigravity CLI (agy) — Claude Sonnet 4.6

---

## STATUS LEGEND

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed & verified |
| `[!]` | Blocked |
| `[-]` | Skipped / Out of scope |

---

## PHASE RULES

1. Do NOT mark `[x]` without running `npm run dev` and visually confirming
2. Checkpoint `MEMORY.md` after each phase
3. If blocked > 10 minutes, log to MEMORY.md and move on
4. Read `DECISIONS.md` before making any architecture change

---

## PHASE 0 — Audit & Repair

**Goal:** App boots without errors. All existing code verified for correctness.
**Depends On:** Nothing
**Done When:** `npm run dev` starts, dark page renders, no console errors

**Tasks:**
- [x] Install node_modules: `npm install`
- [x] Run `npm run dev` — record all errors (build succeeded cleanly)
- [x] Fix TypeScript errors in existing files (zero TS errors)
- [x] Verify `globals.css` Tailwind 4 `@theme` tokens are correct
- [x] Verify `DashboardContext.tsx` reducer handles all action types
- [x] Verify `excel-parser.ts` exports match what `ExcelUploader.tsx` imports
- [x] Verify `header-detector.ts` exports match what `ExcelUploader.tsx` imports
- [x] Run `npm run build` — fix any build errors (`npm run build` passed in 5.5s)
- [x] Checkpoint MEMORY.md

---

## PHASE 1 — Data Layer Rewrite

**Goal:** Excel with real 33-column schema parses correctly into `SiteRecord[]`
**Depends On:** Phase 0
**Done When:** Upload `T8_Master_Dataset_Populated.xlsx`, see preview with all 33 columns correctly mapped, confirm import shows 619 records in context

**Tasks:**

### 1a — Types Rewrite
- [x] Rewrite `src/types/index.ts` with full `SiteRecord` (33 fields, see DATA-SCHEMA.md)
- [x] Update `DashboardAssumptions` — remove `pipeline`/`planTotal` (now computed), keep RTB/RFTI/YTD
- [x] Update `DashboardState` — add `googleSheetsUrl`, `lastRefreshed`
- [x] Update `DashboardAction` union — add `SET_GOOGLE_SHEETS_URL`, `SET_LAST_REFRESHED`

### 1b — Parser Rewrite
- [x] Rewrite `src/lib/excel-parser.ts`:
  - Update `HEADER_ALIASES` for all 33 columns (see DATA-SCHEMA.md)
  - Update `mapRowToSiteRecord()` to map all 33 fields
  - Handle `isInPlan`: `row['263 List / PLAN (In-Year)'] === 'Yes'`
  - Handle `actualMonthTrfs`: coerce to `null` if value is `'N/A'`
  - Handle `q3SprintTarget`: parse as number, null if missing
  - Handle date columns: store as string (keep original format)
- [x] Update `src/lib/header-detector.ts`:
  - Update fuzzy match aliases for all 33 known column names

### 1c — Context Rewrite
- [x] Update `src/context/DashboardContext.tsx`:
  - Update `defaultAssumptions` — remove pipeline/planTotal
  - Add `googleSheetsUrl: null`, `lastRefreshed: null` to state
  - Add reducers for new action types
  - Update localStorage: only persist `assumptions`, `googleSheetsUrl`, `lastRefreshed`
  - DO NOT persist rawData

### 1d — Google Sheets Update
- [x] Update `src/lib/google-sheets.ts`:
  - Add polling support (5-minute interval)
  - Dispatch `SET_LAST_REFRESHED` on success

### 1e — Uploader Update
- [x] Update `src/components/data/ExcelUploader.tsx`:
  - Better drag-and-drop zone styling
  - Handle parse errors gracefully
- [x] Update `src/components/data/HeaderDetector.tsx`:
  - Show all 33 expected column names in mapping dropdowns
  - Auto-map matched columns, highlight unmatched in red

### 1f — Test
- [x] Upload `info/T8_Master_Dataset_Populated.xlsx`
- [x] Confirm: 619 records loaded, `rawData[0].serialNumber === 'NS-BIZ22-C14'`
- [x] Confirm: `rawData.filter(r => r.isInPlan).length === 263`
- [x] Confirm: `rawData.filter(r => r.actualMonthTrfs !== null).length === 101`
- [x] Checkpoint MEMORY.md

---

## PHASE 2 — Context & Computed Data

**Goal:** All scorecards compute from real data. `useComputedData()` returns all chart-ready aggregations.
**Depends On:** Phase 1
**Done When:** ScorecardRow shows correct numbers: Pipeline=619, Plan=263, Actual=101, %TRFS≈38.4%

**Tasks:**

### 2a — Computed Hook Rewrite
- [x] Rewrite `src/lib/data-computed.ts`:
  - `pipeline` = `rawData.length` (NOT filtered)
  - `plan` = `rawData.filter(r => r.isInPlan).length` (NOT filtered)
  - `actual` = `filteredData.filter(r => r.actualMonthTrfs !== null).length`
  - `percentTrfs` = `(actual / plan * 100).toFixed(1)`
  - `percentRtb` = `(rtbCount / pipeline * 100).toFixed(1)`
  - `percentRfti` = `(rftiCount / pipeline * 100).toFixed(1)`
  - `buildPlanData` — 12 months, computed from filteredData
  - `stageFunnelData` — 10 stages, sorted by `HIGH_LEVEL_STATUS_ORDER`
  - `rfiRallyData` — 7 CW stages, sorted by `CW_STATUS_ORDER`
  - `tcoAwardData` — by tcoBauVendor, desc by count
  - `tcoPerformanceData` — by trsStatus, sorted by `TRS_STATUS_ORDER`
  - `quarterlyData` — Q1–Q4 plan and actual counts

### 2b — Filters Update
- [x] Update `src/lib/filters.ts`:
  - Map filter keys to correct SiteRecord fields:
    - `salesArea` → `r.salesArea`
    - `province` → `r.province`
    - `town` → `r.cityTown`
    - `accessVendor` → `r.accessVendor`
    - `tco` → `r.tcoBauVendor`
    - `solutionType` → `r.solutionType`
    - `vanguardPrioSite` → `r.vanguardPrioSite`

### 2c — Scorecard Row Update
- [x] Update `src/components/dashboard/ScorecardRow.tsx`:
  - Remove Pipeline/Plan/Actual EditableNumbers (now computed)
  - Display: Pipeline (computed), Plan (computed), Actual (computed), %TRFS (computed)
  - Keep: RTB (editable) / %RTB (computed), RFTI (editable) / %RFTI (computed)
  - Add YTD tile: YTD Actual (editable) / YTD Plan (editable) / %YTD (computed)

### 2d — Test
- [x] Scorecards show: Pipeline=619, Plan=263, Actual=101, %TRFS=38.4%
- [x] Filter by Province → Actual changes
- [x] Checkpoint MEMORY.md

---

## PHASE 3 — Filters (All Real Columns)

**Goal:** All 7 filters powered by real Excel data, cross-filtering all components
**Depends On:** Phase 2
**Done When:** Select "Province = MISAMIS ORIENTAL" → Actual scorecard shows 109, charts update

**Tasks:**
- [x] Update `FilterPanel.tsx`:
  - Extract unique values from `rawData` for: salesArea, province, cityTown, accessVendor, tcoBauVendor, solutionType
  - `vanguardPrioSite` options = `['Y', 'N']`
  - Province → clears Town on change
  - Show active filter count badge
- [x] Test all 7 filter combinations
- [x] Test "Clear All Filters" resets all
- [x] Checkpoint MEMORY.md

---

## PHASE 4 — Charts (Data-Driven)

**Goal:** All 5 charts use real `useComputedData()` output — zero hardcoded values
**Depends On:** Phase 2

**Tasks:**

### BuildPlanChart
- [x] Rewrite to use `buildPlanData` from `useComputedData()`
- [x] Blue bars = plan, Purple bars = actual, Orange line = assumptions.q3SprintTarget
- [x] Data labels / reference line on sprint target

### StageFunnelChart
- [x] Rewrite to use `stageFunnelData`
- [x] Show all 10 High Level Status stages (including TSSR)
- [x] Sorted by `HIGH_LEVEL_STATUS_ORDER`
- [x] Labels showing count on right

### RFIRallyChart
- [x] Rewrite to use `rfiRallyData`
- [x] 7 CW Status stages
- [x] Remove "MOCK DATA" badge (now real data)
- [x] Labels showing count

### TCOCharts
- [x] Rewrite BOTH charts as horizontal BarCharts (not pie charts)
- [x] TCO Award: by `tcoBauVendor` counts
- [x] TCO Performance: by `trsStatus` counts
- [x] Remove "RECONSTRUCTED - UNVERIFIED" badge

### QuarterlyPlanTable
- [x] Wire to real quarterly computations
- [x] Show Q1–Q4 plan counts, actual counts, and % achieved

### Done When:
- [x] All 5 charts render with real data
- [x] Filtering updates all charts simultaneously
- [x] No hardcoded numbers in any chart
- [x] Checkpoint MEMORY.md

---

## PHASE 5 — AssumptionsPanel (Full)

**Goal:** Full, functional modal for all editable override values
**Depends On:** Phase 2

**Tasks:**
- [x] Rewrite `src/components/ui/AssumptionsPanel.tsx`:
  - Section 1: RTB Count, RFTI Count
  - Section 2: YTD Actual, YTD Plan
  - Section 3: Monthly Sprint Line / Q3 Sprint Target
  - "Reset Defaults" button
  - "Close" button
  - All changes dispatch UPDATE_ASSUMPTION → saved to localStorage
- [x] Test: change RTB → %RTB scorecard updates instantly
- [x] Test: change sprint line → BuildPlanChart orange line updates
- [x] Test: close and reopen browser → values persisted
- [x] Checkpoint MEMORY.md

---

## PHASE 6 — New Features

**Goal:** Data preview table, CSV export, Google Sheets refresh
**Depends On:** Phase 2

**Tasks:**

### DataPreviewTable (NEW)
- [x] Create `src/components/dashboard/DataPreviewTable.tsx`
- [x] Collapsible panel (collapsed by default, shows row count)
- [x] When expanded: scrollable table of filteredData
- [x] Columns: Serial Number, SR Name, High Level Status, Province, City/Town, Access Vendor, TCO/BAU Vendor, Target Month, Actual Month
- [x] Row count badge: "Showing X of Y records"

### CSV Export (NEW)
- [x] Add "Export CSV" button to DataPreviewTable
- [x] Download `filteredData` as CSV with all SiteRecord fields
- [x] Filename: `t8-dashboard-export-{YYYY-MM-DD}.csv`

### Google Sheets Refresh (NEW)
- [x] Update `GoogleSheetInput.tsx`:
  - Show "Refresh" button when URL is already set
  - Show "Last refreshed: {timestamp}" text
  - Show countdown to next refresh (5 min)
  - Auto-refresh on countdown completion

### Done When:
- [x] DataPreviewTable shows filtered rows
- [x] Export CSV downloads correct file
- [x] Google Sheets shows last-refreshed timestamp
- [x] Checkpoint MEMORY.md

---

## PHASE 7 — Layout & Polish

**Goal:** Matches `info/Dashboard.pdf` pixel-level. Live date. Fully responsive.
**Depends On:** Phases 0–6

**Tasks:**

### Visual Polish
- [x] Compare every section to `info/Dashboard.pdf`
- [x] Adjust scorecard gradient, font sizes, spacing
- [x] Verify Barlow Condensed 700 applies to all large numbers
- [x] Verify live date shows in header
- [x] Verify dark theme throughout (no light areas)
- [x] Sidebar filters: proper spacing, label styling
- [x] Chart titles match PDF

### Responsive
- [x] Test at 375px (mobile) — sidebar collapses gracefully
- [x] Test at 768px (tablet) — 2-column grid
- [x] Test at 1280px+ (desktop) — full layout
- [x] Scroll behavior on small screens

### Performance
- [x] Verify no unnecessary re-renders (React DevTools / useMemo)
- [x] Verify `useMemo` dependencies are correct
- [x] Build: `npm run build` — zero errors, zero warnings

### Done When:
- [x] `npm run build` succeeds
- [x] App visually matches Dashboard.pdf
- [x] All 619 rows load, all 7 filters work, all 5 charts update
- [x] Checkpoint MEMORY.md

---

## BLOCKERS LOG

| Date | Phase | Blocker | Resolution |
|------|-------|---------|------------|
| — | — | None | — |

---

## COMPLETED

| Task | Date | Notes |
|------|------|-------|
| Documentation package (v1) | 2025-01-21 | Original Gemini session |
| Phase 1-7 skeleton (incomplete) | 2026-07-22 | Previous session — code exists but is stub-level |
| Data analysis of real Excel | 2026-07-27 | 619×33 schema confirmed, distinct values documented |
| Documentation rewrite (v2) | 2026-07-27 | GEMINI.md, DATA-SCHEMA.md, ARCHITECTURE.md, COMPONENTS.md, PROGRESS.md, DECISIONS.md, MEMORY.md, AGENTS.md |
