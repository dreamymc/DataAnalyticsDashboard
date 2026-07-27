# GEMINI.md - Agent Instructions

## Project: T8 New Site Build Dashboard

**Goal:** Replicate Looker Studio dashboard as a Next.js web app deployable to Vercel. Users upload Excel files to populate the dashboard. No login required.

**Primary Reference:** `screenshot.png` (attached) - this is the visual source of truth.

---

## Memory Protocol (MANDATORY)

### Auto-Checkpoint Rules

You MUST save to `MEMORY.md` at these moments:

1. **Before any file create/edit/delete** - save current state
2. **After completing a component** - update progress
3. **Before ending a session** - full state dump
4. **After any architecture decision** - log to DECISIONS.md
5. **Every 15 minutes of active work** - interval save

### Checkpoint Format

```markdown
## CHECKPOINT: [YYYY-MM-DD HH:MM:SS]

**Status:** [in_progress | blocked | completed]
**Last Task:** [what you were just working on]
**Next Task:** [what comes next]
**Files Modified:** [list]
**Blockers:** [none | description]
**Context:** [anything needed to resume]
```

### Recovery Procedure

On session start, ALWAYS:
1. Read `MEMORY.md` - find last CHECKPOINT
2. Read `PROGRESS.md` - see task list status
3. Resume from `Next Task` in last checkpoint
4. If interrupted mid-edit, check `Files Modified` and verify integrity

---

## File Structure

```
atglobe/
├── GEMINI.md              # This file - agent instructions
├── MEMORY.md              # Persistent memory (append-only)
├── PROGRESS.md            # Task tracking
├── ARCHITECTURE.md        # System design
├── DATA-SCHEMA.md         # Field mappings
├── COMPONENTS.md          # Component inventory
├── DECISIONS.md           # Architecture Decision Records
├── screenshot.png         # Visual reference (Looker Studio)
├── Bernard-Sheet1.xlsx    # Sample data file
└── [implementation files will be created here]
```

---

## Tech Stack

| Choice | Reason |
|--------|--------|
| Next.js 14 (App Router) | Vercel-native, SSR, file routing |
| TypeScript | Type safety |
| Tailwind CSS | Dark theme styling |
| Recharts | Charts (combo, bar, line) |
| xlsx (SheetJS) | Browser-side Excel parsing |
| Vercel | Deployment |

---

## Key Requirements

### Data Input (Two Methods)

1. **Excel Upload (Primary)**
   - Parse .xlsx files in browser
   - Handle COUNTA() quirk: row of repeated numbers above real headers
   - Auto-detect header row (first row where most cells are non-numeric text)
   - Show preview, let user confirm/correct header row and data start
   - Detect broken headers (site names instead of labels), let user rename

2. **Google Sheets (Secondary)**
   - Public CSV URL method (no OAuth)
   - User publishes sheet to web, provides CSV URL
   - App polls the public URL

### Filters (Cross-filter all charts)

| Filter | Data Source |
|--------|-------------|
| Sales Area | Placeholder (mock) |
| Province | Real (from Excel) |
| Town | Real (City/Town column) |
| Access Vendor | Real (Vendor column) |
| TCO | Real (TCO/BAU Vendor column) |
| Solution Type | Real (Program column) |
| Vanguard/Prio Site | Placeholder (mock) |

### Scorecards (Editable Assumptions)

- Pipeline (default: 619) - editable, not from Excel
- Plan (default: 263) - editable
- Actual (from Excel row count)
- %TRFS = Actual / Plan
- RTB, %RTB, RFTI, %RFTI - editable
- YTD block - editable
- Quarterly Plan table - editable

### Charts

1. **Build Plan** - Combo bar+line, Jan-Dec, Plan TRFS + Actual TRFS bars, Q3 Sprint line
2. **Stage Funnel** - Horizontal bars from Lead Indicator field, sorted by stage order
3. **RFI Rally** - Horizontal bars, fully mock data (placeholder)
4. **TCO Award and Status** - Mock/unverified (reconstructed)
5. **TCO Performance** - Mock/unverified (reconstructed)

---

## Visual Style

- **Background:** `#0d1117` (dark near-black)
- **Scorecard gradient:** `linear-gradient(135deg, #6b46c1 0%, #3182ce 100%)`
- **Text:** `#e2e8f0` (light gray)
- **Font (big numbers):** Barlow Condensed 700 or Oswald 700
- **Date:** Live (today's date), not hardcoded

---

## Stage Ordering

Lead Indicator values (configurable order):
```
[01] - [04] (early stages, may have zero counts)
[05] CW DOING
[06] S-RFI
[07] S-RFI w/ TRS
[08] RFI
[09] RFI with TRS
```

Read from data, but allow zero-count stages to display.

---

## Implementation Phases

**Execute in order. Checkpoint after each phase.**

| Phase | Goal | Key Deliverable |
|-------|------|-----------------|
| 1 | Project Setup | Empty Next.js with Tailwind, `npm run dev` works |
| 2 | Data Layer | Excel parses, preview shows, headers detected |
| 3 | Filters | 7 filters in sidebar, cross-filtering logic |
| 4 | Scorecards | Gradient tiles, editable assumptions panel |
| 5 | Charts | All 5 charts render with data |
| 6 | Integration | Everything wired, filters update all |
| 7 | Polish & Deploy | Deployed to Vercel, matches screenshot |

See `PROGRESS.md` for detailed tasks within each phase.

---

## Do NOT

- Hardcode mock numbers in components (use editable assumptions)
- Skip the Excel preview step
- Assume row 1 = headers
- Assume Pipeline = record count
- Make the date static

---

## Commit Attribution

AI commits MUST include:
```
Co-Authored-By: Gemini Pro 3.1 <noreply@google.com>
```
