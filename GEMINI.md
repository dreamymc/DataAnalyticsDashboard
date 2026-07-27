# GEMINI.md — Antigravity Agent Instructions

## Project: T8 New Site Build Dashboard

**Goal:** Replicate the Looker Studio dashboard (see `info/Dashboard.pdf`) as a production-quality Next.js web app. Users upload Excel files (`.xlsx`) or supply a public Google Sheets CSV URL to populate the dashboard. No login required.

**Visual Reference:** `info/Dashboard.pdf` — the pixel-level source of truth.
**Sample Data:** `info/T8_Master_Dataset_Populated.xlsx` — 619 rows × 33 columns. Study this before touching data logic.

---

## 🤖 Antigravity-Native Protocol

### Agent Identity & Model
- **Tool:** Google Antigravity CLI (`agy`)
- **Conversation ID:** Persisted across sessions — read `MEMORY.md` on every start.
- **Model:** Claude Sonnet 4.6 (Thinking) — use reasoning traces for architecture decisions.

### Skill Invocations (read SKILL.md before use)

| Category | Task | Skill Path |
|----------|------|------------|
| **Data & Design** | Excel analysis & parsing logic | `~/.gemini/antigravity-cli/skills/xlsx/SKILL.md` |
| | Component & page design | `~/.gemini/antigravity-cli/skills/frontend-design/SKILL.md` |
| **Planning & Execution** | Implementation planning | `~/.gemini/antigravity-cli/skills/writing-plans/SKILL.md` |
| | Executing plan tasks | `~/.gemini/antigravity-cli/skills/executing-plans/SKILL.md` |
| | Complex multi-file tasks | `~/.gemini/antigravity-cli/skills/subagent-driven-development/SKILL.md` |
| | Parallel independent tasks | `~/.gemini/antigravity-cli/skills/dispatching-parallel-agents/SKILL.md` |
| **Code Review & Quality** | Deep logic & edge-case review | `~/.gemini/antigravity-cli/skills/logic-lens/SKILL.md` |
| | Architecture & design linting | `~/.gemini/antigravity-cli/skills/brooks-lint/SKILL.md` |
| | Requesting code review | `~/.gemini/antigravity-cli/skills/requesting-code-review/SKILL.md` |
| | Receiving & acting on review | `~/.gemini/antigravity-cli/skills/receiving-code-review/SKILL.md` |
| **Testing & Debugging** | Root-cause bug investigation | `~/.gemini/antigravity-cli/skills/systematic-debugging/SKILL.md` |
| | Test-driven development | `~/.gemini/antigravity-cli/skills/test-driven-development/SKILL.md` |
| | Webapp testing (Playwright) | `~/.gemini/antigravity-cli/skills/webapp-testing/SKILL.md` |
| **Optimization & Polish** | React & compute profiling | `~/.gemini/antigravity-cli/skills/performance-optimizer/SKILL.md` |
| | Pre-push codebase audit | `~/.gemini/antigravity-cli/skills/codebase-audit-pre-push/SKILL.md` |
| | Completion verification | `~/.gemini/antigravity-cli/skills/verification-before-completion/SKILL.md` |
| | Branch completion & handoff | `~/.gemini/antigravity-cli/skills/finishing-a-development-branch/SKILL.md` |
| **Memory** | Agent memory & state | `~/.gemini/antigravity-cli/skills/agent-memory-systems/SKILL.md` |

### Subagent Dispatch Patterns
- Use `research` subagent for: reading unfamiliar Next.js 16 APIs, scanning node_modules docs
- Use `self` subagent for: large parallel file creation tasks (e.g., writing 4+ components simultaneously)
- Dispatch pattern: `invoke_subagent` → wait for completion → merge results

---

## Memory Protocol (MANDATORY)

### Auto-Checkpoint Rules
Write to `MEMORY.md` at these exact moments:

1. **Before any file create/edit/delete** — save current state
2. **After completing a phase or component group** — update progress
3. **Before ending a session** — full state dump
4. **After any architecture decision** — also log to `DECISIONS.md`
5. **On any error > 5 minutes** — log error context with exact file/line

### Checkpoint Format

```markdown
## CHECKPOINT: [YYYY-MM-DD HH:MM:SS]

**Status:** [in_progress | blocked | completed | interrupted]
**Last Task:** [specific task]
**Next Task:** [exact next step]
**Files Modified:** [file1.tsx, file2.ts ...]
**Blockers:** [none | description]
**Context:** [anything critical to resume]
**Session Duration:** [elapsed]
```

### Recovery Procedure (START OF EVERY SESSION)
1. Read `MEMORY.md` → find last CHECKPOINT
2. Read `PROGRESS.md` → verify phase status
3. Resume from `Next Task` — do NOT restart completed work
4. If interrupted mid-edit → check `Files Modified` → verify file integrity with `grep`/`cat`

---

## Tech Stack (Actual Installed Versions)

| Library | Version | Role |
|---------|---------|------|
| Next.js | 16.2.11 | App framework (App Router) |
| React | 19.2.4 | UI rendering |
| TypeScript | ^5 | Type safety |
| Tailwind CSS | ^4 (via `@import "tailwindcss"`) | Styling — uses CSS `@theme` blocks, NOT `tailwind.config.ts` |
| Recharts | ^3.10.0 | Charts |
| xlsx (SheetJS) | ^0.18.5 | Browser-side Excel parsing |

> ⚠️ **Tailwind 4 Breaking Change:** Do NOT use `tailwind.config.ts`. All theme tokens go in `globals.css` under `@theme {}`. Class names follow `bg-[--color-dashboard-bg]` pattern OR use the `@theme` aliases directly.

> ⚠️ **Next.js 16 Breaking Change:** Before editing any Next.js API or config, check `node_modules/next/dist/docs/` for updated conventions. React Server Components are the default — mark client components with `"use client"`.

---

## Key Requirements

### Data Input (Two Methods)

**1. Excel Upload (Primary)**
- Parse `.xlsx` files in browser using SheetJS
- Auto-detect header row (skip COUNTA rows of repeated numbers)
- Show scrollable preview table — user confirms/corrects header row
- Detect broken/misaligned headers — show column-mapping UI
- After confirm → parse → load to context

**2. Google Sheets CSV (Secondary)**
- User publishes sheet → provides CSV export URL
- App fetches URL, parses as CSV
- Show "Refresh" button with last-updated timestamp and polling countdown

### Real Column Mapping (from T8_Master_Dataset_Populated.xlsx)

| Dashboard Use | Excel Column | Notes |
|---------------|-------------|-------|
| Stage Funnel | `High Level Status` | 10 distinct values |
| Build Plan (Plan) | `Target Month (TRFS Plan)` + `263 List / PLAN (In-Year) == 'Yes'` | Monthly counts |
| Build Plan (Actual) | `Actual Month (TRFS)` | Monthly actual TRFS counts |
| Q3 Sprint line | `Q3 Sprint Target` (numeric: 23–33) | Use as cumulative target line |
| Province filter | `Province` | 30 distinct values |
| City/Town filter | `City/Town` | Dependent on Province |
| Sales Area filter | `Sales Area` | Real column (not mock!) |
| Access Vendor filter | `Access Vendor` | ERICSSON, HT, NOKIA |
| TCO filter | `TCO/BAU Vendor` | FRONTIER, PHILTOWER, etc. |
| Solution Type filter | `Solution Type` | AN+LEOSAT, MW, MW/FSO, Fiber Ext |
| Vanguard/Prio Site filter | `Vanguard/Prio Site` | Y / N |
| Program filter | `Program` | TowerCo, Small Cell, Self-Build etc. |
| RFI Rally | `CW Status` | 7 stages (see DATA-SCHEMA.md) |
| TCO Award chart | `TCO/BAU Vendor` + row counts | Horizontal bar |
| TCO Performance | `TRS Status` | 5 statuses |
| Actual scorecard | Count of rows where `Actual Month (TRFS) != 'N/A'` | = 101 in sample |
| Pipeline scorecard | Total row count | = 619 in sample |
| Plan scorecard | Count where `263 List / PLAN = 'Yes'` | = 263 in sample |

### Scorecards

| Scorecard | Source | Default | Editable? |
|-----------|--------|---------|-----------|
| Pipeline | `rawData.length` | — | No (computed) |
| Plan | Count of `263 List / PLAN = 'Yes'` | 263 | No (computed) |
| Actual TRFS | Count where `Actual Month != 'N/A'` | — | No (computed) |
| % TRFS | Actual / Plan × 100 | — | No (computed) |
| RTB | Editable assumption | 271 | Yes |
| % RTB | RTB / Pipeline × 100 | — | No (computed) |
| RFTI | Editable assumption | 166 | Yes |
| % RFTI | RFTI / Pipeline × 100 | — | No (computed) |
| YTD Actual | Editable assumption | 99 | Yes |
| YTD Plan | Editable assumption | 158 | Yes |
| YTD % TRFS | YTD Actual / YTD Plan × 100 | — | No (computed) |

### Filters (all cross-filter every chart)
All 7 filters come from REAL data columns — none are mocks anymore:

`Sales Area` | `Province` | `City/Town` | `Access Vendor` | `TCO/BAU Vendor` | `Solution Type` | `Vanguard/Prio Site`

### Charts

| # | Chart | Data Source | Type |
|---|-------|------------|------|
| 1 | Build Plan | `Target Month` (plan bars) + `Actual Month` (actual bars) | ComposedChart: Bar + Line |
| 2 | Stage Funnel | `High Level Status` | Horizontal BarChart |
| 3 | RFI Rally | `CW Status` (7 construction stages) | Horizontal BarChart |
| 4 | TCO Award & Status | `TCO/BAU Vendor` counts | Horizontal BarChart |
| 5 | TCO Performance | `TRS Status` counts | Horizontal BarChart |

### New Features (Added to Scope)
- **Data Preview Table** — scrollable table showing all imported records, with column sorting
- **Export CSV** — download filtered data as CSV
- **Google Sheets Refresh** — refresh button with last-updated timestamp and live countdown timer

---

## Visual Style (from Dashboard.pdf)

| Token | Value |
|-------|-------|
| Page background | `#0d1117` |
| Card background | `#161b22` |
| Border | `#30363d` |
| Text primary | `#e2e8f0` |
| Text muted | `#8b949e` |
| Accent purple | `#6b46c1` |
| Accent blue | `#3182ce` |
| Scorecard gradient | `linear-gradient(135deg, #6b46c1 0%, #3182ce 100%)` |
| Display font (numbers) | Barlow Condensed 700 |
| Body font | Inter 400/500/600 |
| Date | Live (`new Date().toLocaleDateString(...)`) |

---

## Stage Ordering for High Level Status

```
s-RFI → s-RFI & TRS Ready → Awarded → For Awarding → LGU Permitting → TSSR → TRS Ready → RTB'd → RFI'd → TRFS
```
Exact string matches (case-sensitive, from Excel):
- `s-RFI` (33 rows)
- `s-RFI & TRS Ready` (21 rows) — ampersand `&` not `&&`
- `Awarded` (58 rows)
- `For Awarding` (158 rows)
- `LGU Permitting` (97 rows)
- `TSSR` (35 rows) ← **was missing from old docs**
- `TRS Ready` (26 rows)
- `RTB'd` (51 rows) — apostrophe `'d`
- `RFI'd` (39 rows) — apostrophe `'d`
- `TRFS` (101 rows)

Show all 10 stages even if count = 0 (for filters that reduce data).

## CW Status Stage Ordering (RFI Rally)
```
18. RTB for Mobilization    (92 rows)
19. Site Clearing            (91 rows)
20. Excavation               (83 rows)
22. Rebar Installation       (80 rows)
23. Concrete Pouring         (95 rows)
24. Backfilling              (82 rows)
26. ODU Pad / Electrical     (96 rows)
```
Note: Numbers 21 and 25 do NOT exist in the data — these are the exact 7 present stages.

## Q3 Sprint Target — Build Plan Chart Line
`Q3 Sprint Target` is an **integer column** on every row with 5 possible values: `23, 24, 25, 27, 33`.
This is NOT a monthly array. Each site row carries its own target number.
**For the orange sprint line in BuildPlanChart:** display as a flat/cumulative reference line.
Implementation: use the count of filteredData rows whose Q3 Sprint Target equals each threshold value, OR simply display the maximum value (33) as a horizontal reference line. The AssumptionsPanel can expose this as a single override value.

---

## Implementation Phases

Execute in order. Checkpoint after every phase.

| Phase | Goal | Done When |
|-------|------|-----------|
| 0 | Audit & repair | `npm run dev` starts without errors |
| 1 | Data layer rewrite | Real columns map + parse correctly from `.xlsx` |
| 2 | Context & computed | All scorecards compute from real data |
| 3 | Filters (all real) | All 7 filters from real columns, cross-filter works |
| 4 | Charts (data-driven) | All 5 charts use real Excel data, no hardcoded mocks |
| 5 | AssumptionsPanel | Full editable modal for RTB, RFTI, YTD, monthly plan overrides |
| 6 | New features | Data preview table + CSV export + GSheets refresh |
| 7 | Layout & polish | Matches Dashboard.pdf pixel-level, responsive, live date |

---

## Do NOT
- Hardcode pipeline/plan/actual numbers — compute from data
- Skip the Excel preview/mapping step
- Use `tailwind.config.ts` — Tailwind 4 uses `@theme` in CSS
- Assume row 1 = headers (COUNTA quirk)
- Make the date static
- Mark a phase complete without running `npm run dev` and visually verifying


