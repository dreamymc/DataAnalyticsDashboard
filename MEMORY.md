# MEMORY.md — Persistent Agent Memory

> **APPEND-ONLY LOG** — Never edit previous entries. Only add new ones at the bottom.
> This file survives session interruptions and enables resumption.

---

## PROTOCOL

### When to Write
1. **Before file operations** — checkpoint current state
2. **After completing a phase** — log completion
3. **Every 15 minutes of active work** — interval save
4. **On session end** — full state dump
5. **On errors** — log error context for recovery

### Format
```markdown
## CHECKPOINT: [YYYY-MM-DD HH:MM:SS]

**Status:** [in_progress | blocked | completed | interrupted]
**Last Task:** [specific task name]
**Next Task:** [what comes next]
**Files Modified:** [file1.tsx, file2.ts ...]
**Blockers:** [none | description]
**Context:** [anything critical to resume]
**Session Duration:** [time since last checkpoint]
```

---

## MEMORY ENTRIES

### PROJECT INITIALIZATION: 2025-01-21

**Project:** T8 New Site Build Dashboard
**Agent:** Gemini Pro 3.1 (original session)
**Goal:** Replicate Looker Studio dashboard as Next.js web app
**Reference:** screenshot.png (no longer available)
**Data File:** Bernard-Sheet1.xlsx (43 rows, 8 columns — SMALL SAMPLE)

**Key Decisions from original session:**
- Next.js 14 App Router (now actually Next.js 16.2.11)
- React Context + useReducer for state
- Recharts for charts
- Tailwind CSS for styling
- Client-side SheetJS for Excel parsing

---

## CHECKPOINT: 2025-01-21

**Status:** completed
**Last Task:** Documentation + Phase structure creation (v1)
**Next Task:** Phase 1 - Project Setup
**Files Modified:** GEMINI.md, MEMORY.md, PROGRESS.md, ARCHITECTURE.md, DATA-SCHEMA.md, COMPONENTS.md, DECISIONS.md
**Blockers:** none
**Context:** Original docs written with 8-column data schema. Phases 1-7 defined.

---

## CHECKPOINT: 2026-07-22 13:46:00

**Status:** completed
**Last Task:** Phase 1 - Project Setup
**Next Task:** Phase 2 - Data Layer
**Files Modified:** package.json, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx
**Blockers:** none
**Context:** Next.js 16 app initialized with React 19, recharts and xlsx installed. Tailwind 4 CSS variables set. Folders created.

---

## CHECKPOINT: 2026-07-22 13:51:00

**Status:** completed (stub-level)
**Last Task:** Phases 2-7 skeleton
**Next Task:** Full rewrite with real data schema
**Files Modified:** src/types/index.ts, src/lib/*.ts, src/context/DashboardContext.tsx, src/components/**/*.tsx
**Blockers:** none
**Context:** All component skeletons created. Code works at stub level. Data schema was based on old 8-column sample file. TCO charts are pie charts (wrong — should be horizontal bars). AssumptionsPanel is empty stub. All chart data is hardcoded. Build Plan chart ignores real Excel data.

---

## CHECKPOINT: 2026-07-27 14:36:00

**Status:** completed
**Last Task:** Documentation v2 rewrite — full analysis of real data
**Next Task:** Phase 0 — Audit & Repair (install deps, fix errors)
**Files Modified:**
  - GEMINI.md (rewritten for Antigravity + real schema)
  - DATA-SCHEMA.md (rewritten: 33 columns, real distinct values)
  - ARCHITECTURE.md (rewritten: correct state shape, Tailwind 4)
  - COMPONENTS.md (rewritten: real data sources, new DataPreviewTable)
  - PROGRESS.md (reset: all phases to [ ], accurate tasks)
  - DECISIONS.md (appended new ADRs)
  - MEMORY.md (this entry)
  - AGENTS.md (will be written next)
**Blockers:** none
**Context:**
  Real data file: info/T8_Master_Dataset_Populated.xlsx — 619 rows × 33 columns
  Key facts:
    - Pipeline = 619 (total rows)
    - Plan = 263 (rows where '263 List / PLAN = Yes')
    - Actual TRFS = 101 (rows where 'Actual Month (TRFS)' is not 'N/A')
    - % TRFS = 101/263 = 38.4%
    - Stage Funnel uses 'High Level Status' (NOT 'Lead Indicator (LOCAL)' from old schema)
    - RFI Rally uses 'CW Status' (real data, not mock!)
    - TCO Award uses 'TCO/BAU Vendor'
    - TCO Performance uses 'TRS Status'
    - Build Plan plan bars: group 263 plan rows by 'Target Month (TRFS Plan)'
    - Build Plan actual bars: group all rows by 'Actual Month (TRFS)'
    - ALL 7 filters use real columns (Sales Area is a real column, not placeholder)
    - New features: DataPreviewTable + CSV export + GSheets refresh with countdown
    - node_modules NOT installed — run npm install first
**Session Duration:** ~45 minutes (doc analysis + rewrite session)

---

## CHECKPOINT: 2026-07-27 15:13:34

**Status:** completed
**Last Task:** Hydration Warning Fix & Looker Studio PDF Component Parity Audit
**Next Task:** Complete
**Files Modified:** src/app/layout.tsx, src/app/page.tsx, src/lib/data-computed.ts, ProvincePlanActualChart.tsx, TownPlanActualTable.tsx, OngoingWirelessTable.tsx, OngoingTransportTable.tsx, MasterSiteDetailsTable.tsx, COMPONENTS.md, MEMORY.md
**Blockers:** none
**Context:** 
  1. Resolved React hydration warning by adding `suppressHydrationWarning` to `<html>` and `<body>` in layout.tsx and mounting date string safely in page.tsx.
  2. Extracted full text & component structure from `info/Dashboard.pdf`. Added 5 missing components to reach 100% feature parity:
     - `ProvincePlanActualChart`: BarChart comparing Pipeline, Plan, and TRFS across 30 provinces.
     - `TownPlanActualTable`: Paginated table (15/page) for 49 towns showing Pipeline, Plan, RTB, RFI, TRFS.
     - `OngoingWirelessTable`: Paginated table (10/page) for 26 TRS Ready integration sites.
     - `OngoingTransportTable`: Paginated table (10/page) for 39 RFTI transport sites.
     - `MasterSiteDetailsTable`: Paginated site details table (25/page) for all 619 sites.
  3. Verified production build (`npm run build`) succeeded in 7.7s with 0 errors.

---

<!-- NEW CHECKPOINTS BELOW THIS LINE -->
