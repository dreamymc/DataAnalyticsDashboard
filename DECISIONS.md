# DECISIONS.md — Architecture Decision Records

> Record all significant technical decisions here.
> Each decision follows the ADR format: Context → Decision → Consequences.

---

## ADR-001: Framework — Next.js App Router

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Use Next.js with App Router for all routing and layout.

**Consequences:**
- [+] Native Vercel deployment
- [+] File-based routing + layouts
- [+] RSC available if needed later
- [-] All dashboard components must be `"use client"` (heavy interactivity)
- [!] Installed version is 16.2.11, not 14 — check `node_modules/next/dist/docs/` for breaking changes

---

## ADR-002: Excel Parsing — Client-Side SheetJS

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Parse Excel files entirely in the browser using `xlsx` (SheetJS) v0.18.5.

**Consequences:**
- [+] No server upload needed — files stay on device
- [+] Works offline after initial page load
- [-] Large files may block UI thread (future: use Web Worker)
- [-] No server-side validation

---

## ADR-003: Google Sheets — Public CSV URL

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Use "publish to web → CSV" method. No OAuth.

**Consequences:**
- [+] Zero auth setup, zero credentials
- [-] Sheet must be publicly accessible
- [!] Added: 5-min polling with countdown timer (added 2026-07-27)

---

## ADR-004: State Management — React Context + useReducer

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Global state via React Context with `useReducer`. No Zustand or Redux.

**Consequences:**
- [+] Zero dependencies added
- [+] Simple for this scale
- [-] May cause excessive re-renders on large filter changes (mitigate with useMemo)
- [!] localStorage persistence: only assumptions + metadata, NOT rawData

---

## ADR-005: Charts — Recharts

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Use Recharts for all 5 chart types (ComposedChart, BarChart).

**Consequences:**
- [+] Native React component model
- [+] Supports ComposedChart (bar + line combo)
- [-] Less customizable than D3 for edge cases

---

## ADR-006: Styling — Tailwind CSS v4

**Status:** Accepted
**Date:** 2025-01-21 (updated 2026-07-22)

**Decision:** Use Tailwind CSS v4 (`^4`) with the `@import "tailwindcss"` / `@theme {}` pattern.

**Consequences:**
- [+] No `tailwind.config.ts` needed — simpler setup
- [+] Dark theme tokens defined once in `globals.css`
- [!] Breaking change from v3: `tailwind.config.ts` is NOT used. `@theme {}` in CSS is the new API.
- [!] Class names: `bg-dashboard-bg` works because of `@theme { --color-dashboard-bg: ... }`

---

## ADR-007: Fonts — Barlow Condensed + Inter

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Barlow Condensed 700 for large scorecard numbers, Inter 400/500/600 for body text.

**Consequences:**
- [+] Matches reference Dashboard.pdf
- [+] Free Google Fonts, loaded via `next/font/google`
- [+] CSS variables: `--font-display`, `--font-body`

---

## ADR-008: Memory System — File-Based Markdown

**Status:** Accepted
**Date:** 2025-01-21

**Decision:** Use `MEMORY.md` (append-only), `PROGRESS.md` (status tracker), `DECISIONS.md` (this file).

**Consequences:**
- [+] Zero setup, human-readable, portable
- [-] Manual checkpointing discipline required

---

## ADR-009: Data Scope — Real 33-Column Schema

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** visionmc

**Context:**
Original docs assumed an 8-column schema based on a small sample file (`Bernard-Sheet1.xlsx`, 43 rows). The real production file (`T8_Master_Dataset_Populated.xlsx`) has 619 rows × 33 columns with a completely different column set.

**Decision:**
Rewrite all data layer code to target the 33-column schema. The 8-column schema is abandoned.

**Key schema changes:**
- `Lead Indicator (LOCAL)` → replaced by `High Level Status` (Stage Funnel)
- New: `CW Status` (RFI Rally), `TRS Status` (TCO Performance), `TCO/BAU Vendor` (TCO Award)
- New: `Target Month (TRFS Plan)`, `Actual Month (TRFS)` (Build Plan chart)
- New: `Sales Area`, `Vanguard/Prio Site`, `Solution Type` are REAL columns (not placeholders)
- New: `263 List / PLAN (In-Year)` = 'Yes' defines the 263-row plan subset

**Consequences:**
- [+] Dashboard will be 100% data-driven from real Excel
- [+] All 7 filters use real column values
- [!] All existing data layer code must be rewritten (Phases 0–2)

---

## ADR-010: Charts — Horizontal Bars for TCO (Not Pie)

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** visionmc

**Context:**
TCOCharts.tsx currently renders two donut pie charts with hardcoded mock data. The Dashboard.pdf shows horizontal bar charts.

**Decision:**
Replace both pie charts with horizontal `BarChart` components powered by real data:
- TCO Award & Status → `tcoBauVendor` counts
- TCO Performance → `trsStatus` counts

**Consequences:**
- [+] Matches visual reference
- [+] Data-driven (no mocks)
- [+] Remove "RECONSTRUCTED - UNVERIFIED" banner

---

## ADR-011: Scorecard Computation — Pipeline & Plan Are NOT Editable

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** visionmc

**Context:**
Original docs made Pipeline (619) and Plan (263) editable assumptions. But both derive directly from Excel:
- Pipeline = `rawData.length` (619)
- Plan = `rawData.filter(r => r.isInPlan).length` (263)

**Decision:**
Remove Pipeline and Plan from `DashboardAssumptions`. They are always computed. Only RTB, RFTI, and YTD values remain editable.

**Consequences:**
- [+] Single source of truth — numbers always match the data
- [+] Simpler assumptions panel
- [-] Users cannot manually override if they want different targets

---

## ADR-012: localStorage — Do NOT Persist rawData

**Status:** Accepted
**Date:** 2026-07-27

**Context:**
619 rows × 33 columns of data can be ~500KB–1MB as JSON. Storing this in localStorage risks hitting the 5–10MB browser limit and causing quota errors.

**Decision:**
Only persist `assumptions`, `googleSheetsUrl`, and `lastRefreshed` to localStorage. Users must re-upload Excel or re-fetch Google Sheets on each page load.

**Consequences:**
- [+] No localStorage quota errors
- [+] Always uses fresh data
- [-] Users must re-upload on page refresh

---

## ADR-013: New Features — DataPreviewTable + CSV Export + GSheets Refresh

**Status:** Accepted
**Date:** 2026-07-27
**Deciders:** visionmc

**Decision:**
Add three new features to the dashboard:
1. `DataPreviewTable` — collapsible table of filtered rows with count badge
2. CSV Export — download filteredData as CSV
3. Google Sheets Refresh — refresh button with last-updated timestamp and 5-min countdown

**Consequences:**
- [+] Users can validate what was imported
- [+] Export enables downstream use of filtered data
- [+] GSheets users can see data freshness
- [-] Adds 1 new component file and updates to GoogleSheetInput

<!-- NEW ADRs BELOW THIS LINE -->
