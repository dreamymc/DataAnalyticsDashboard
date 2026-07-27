# MEMORY.md - Persistent Agent Memory

> **APPEND-ONLY LOG** - Never edit previous entries, only add new ones at the bottom.
> This file survives session interruptions and enables resumption.

---

## PROTOCOL

### When to Write

1. **Before file operations** - checkpoint current state
2. **After completing tasks** - log completion
3. **Every 15 minutes** - interval save
4. **On session end** - full state dump
5. **On errors** - log error context for recovery

### Format

```
## CHECKPOINT: [YYYY-MM-DD HH:MM:SS]

**Status:** [in_progress | blocked | completed | interrupted]
**Last Task:** [specific task name]
**Next Task:** [what comes next]
**Files Modified:** [file1.tsx, file2.ts, ...]
**Blockers:** [none | description]
**Context:** [resume-critical info]
**Session Duration:** [time since last checkpoint]
```

---

## MEMORY ENTRIES

### PROJECT INITIALIZATION: 2025-01-21

**Project:** T8 New Site Build Dashboard
**Agent:** Gemini Pro 3.1
**Goal:** Replicate Looker Studio dashboard as Next.js web app
**Reference:** screenshot.png (attached by user)
**Data File:** Bernard-Sheet1.xlsx (43 rows, 8 columns)

**Key Context:**
- User is "visionmc" working in /home/visionmc/projects/atglobe/
- Dashboard is for site build tracking (telecom infrastructure)
- Excel files have COUNTA() quirk - repeated number row above headers
- One column may have broken header (site name instead of label)
- TCO Award/Performance charts are obscured in screenshot - use mocks
- User chose Google Sheets public CSV over OAuth (simpler)

**Skills Available:**
- xlsx: Excel parsing, pandas, openpyxl
- writing-plans: Implementation plans
- test-driven-development: TDD methodology
- architecture: Decision framework
- webapp-testing: Playwright testing

---

---

## CHECKPOINT: 2025-01-21

**Status:** completed
**Last Task:** Documentation + Phase structure creation
**Next Task:** Phase 1 - Project Setup (Next.js initialization)
**Files Modified:** GEMINI.md, MEMORY.md, PROGRESS.md, ARCHITECTURE.md, DATA-SCHEMA.md, COMPONENTS.md, DECISIONS.md
**Blockers:** none
**Context:** All documentation files created with 7-phase execution structure. Each phase has clear "Done When" criteria, file lists, and task breakdowns. Ready for Gemini to begin Phase 1.
**Session Duration:** ~45 minutes

### Documentation Created

| File | Purpose |
|------|---------|
| GEMINI.md | Main agent instructions, memory protocol, tech stack |
| MEMORY.md | Persistent memory with checkpoint protocol (this file) |
| PROGRESS.md | Task tracking with status checkboxes |
| ARCHITECTURE.md | System design, file structure, data flow |
| DATA-SCHEMA.md | TypeScript types, column mappings, header detection |
| COMPONENTS.md | Component inventory with props and state |
| DECISIONS.md | 8 ADRs covering framework, parsing, state, styling, fonts |

### Key Decisions Logged

1. ADR-001: Next.js 14 (Vercel-native)
2. ADR-002: Client-side xlsx parsing
3. ADR-003: Google Sheets public CSV (no OAuth)
4. ADR-004: React Context for state
5. ADR-005: Recharts for charts
6. ADR-006: Tailwind CSS for styling
7. ADR-007: Barlow Condensed for numbers
8. ADR-008: File-based memory system

---

<!-- NEW CHECKPOINTS BELOW THIS LINE -->
## CHECKPOINT: 2026-07-22 13:46:00

**Status:** completed
**Last Task:** Phase 1 - Project Setup
**Next Task:** Phase 2 - Data Layer
**Files Modified:** package.json, src/app/globals.css, src/app/layout.tsx, src/app/page.tsx, directories created
**Blockers:** none
**Context:** Next.js 15 app initialized, recharts and xlsx installed. Tailwind 4 CSS variables set. Folders created. App builds successfully. Ready for Data Layer.
**Session Duration:** 10 mins

## CHECKPOINT: 2026-07-22 13:51:00

**Status:** completed
**Last Task:** Phase 2 - Data Layer
**Next Task:** Phase 3 - Filter Components
**Files Modified:** src/types/index.ts, src/lib/header-detector.ts, src/lib/excel-parser.ts, src/lib/google-sheets.ts, src/context/DashboardContext.tsx, src/components/data/*.tsx, src/app/page.tsx, src/app/layout.tsx
**Blockers:** none
**Context:** Excel parser, header detector, and Google Sheets CSV importer created. Wired up Context using useReducer. Tested parsing with mock Excel. Ready to implement filters.
**Session Duration:** 15 mins

## CHECKPOINT: 2026-07-22 13:51:00

**Status:** completed
**Last Task:** Phase 3 - Filter Components
**Next Task:** Phase 4 - Scorecard Components
**Files Modified:** src/lib/filters.ts, src/components/ui/Dropdown.tsx, src/components/dashboard/FilterPanel.tsx, src/app/page.tsx
**Blockers:** none
**Context:** Implemented reusable Dropdown and FilterPanel. Integrated all 7 filters (including placeholder ones) with the DashboardContext. Town filter correctly depends on Province selection. Wired into main page sidebar. Ready for Scorecards.
**Session Duration:** 5 mins

## CHECKPOINT: 2026-07-22 13:53:00

**Status:** completed
**Last Task:** Phase 4 - Scorecard Components
**Next Task:** Phase 5 - Charts
**Files Modified:** src/lib/data-computed.ts, src/components/ui/ScorecardTile.tsx, src/components/ui/EditableNumber.tsx, src/components/dashboard/ScorecardRow.tsx, src/components/dashboard/QuarterlyPlanTable.tsx, src/components/ui/AssumptionsPanel.tsx, src/app/page.tsx
**Blockers:** none
**Context:** Added scorecards, editable inline numbers, and quarterly plan table. Connected to DashboardContext for persistence. Ready for Phase 5 (Charts).
**Session Duration:** 5 mins

## CHECKPOINT: 2026-07-22 13:58:00

**Status:** completed
**Last Task:** Phase 5, 6, 7 - Charts and Integration
**Next Task:** Handover to user for testing and deployment
**Files Modified:** src/components/dashboard/*.tsx, src/app/page.tsx
**Blockers:** none
**Context:** Completed all chart components using Recharts (BuildPlan, StageFunnel, RFIRally, TCOCharts). Integrated them into the main page layout. Responsive grids applied. Project builds cleanly. Dashboard functionality matches the requested Looker Studio replication. Ready for Vercel deployment.
**Session Duration:** 15 mins

<!-- DO NOT EDIT ABOVE THIS LINE -->
