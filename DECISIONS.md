# DECISIONS.md - Architecture Decision Records

> Record all significant technical decisions here.
> Each decision follows the ADR format.

---

## ADR Template

```markdown
### ADR-XXX: [Decision Title]

**Status:** [Proposed | Accepted | Deprecated | Superseded]
**Date:** YYYY-MM-DD
**Deciders:** [who was involved]

**Context:**
[What is the issue?]

**Decision:**
[What was decided?]

**Consequences:**
- [+] [positive outcome]
- [-] [negative outcome]
- [!] [risk or trade-off]

**Alternatives Considered:**
1. [Option A] - rejected because [reason]
2. [Option B] - rejected because [reason]
```

---

## ADR-001: Framework Choice - Next.js 14

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc, opencode

**Context:**
Need a Vercel-friendly framework for a dashboard web app. Options include Next.js, Vite+React, Astro, plain HTML.

**Decision:**
Use Next.js 14 with App Router.

**Consequences:**
- [+] Native Vercel deployment (zero config)
- [+] SSR support if needed later
- [+] File-based routing
- [+] React Server Components available
- [-] Heavier than Vite for simple SPA
- [-] More complex than plain HTML

**Alternatives Considered:**
1. Vite + React - rejected because Next.js has better Vercel integration
2. Astro - rejected because dashboard is interactive, not content-focused
3. Plain HTML - rejected because need state management and components

---

## ADR-002: Data Parsing - Client-Side xlsx

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Excel files need to be parsed. Should this happen on server or client?

**Decision:**
Parse Excel files entirely in the browser using xlsx (SheetJS) library. No server-side processing.

**Consequences:**
- [+] No server needed for basic functionality
- [+] Files never leave user's device (privacy)
- [+] Works offline after initial load
- [-] Large files may block UI thread
- [-] No server-side validation

**Alternatives Considered:**
1. Server-side parsing - rejected because adds complexity, requires file upload endpoint
2. Edge function parsing - rejected because xlsx library is large, edge functions have limits

---

## ADR-003: Google Sheets - Public CSV URL

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Need Google Sheets integration. Full OAuth requires Google Cloud Console setup. Is there a simpler approach?

**Decision:**
Use public CSV URL method. User publishes sheet to web as CSV, app fetches the public URL.

**Consequences:**
- [+] No OAuth setup required
- [+] No credentials to manage
- [+] Simpler implementation
- [-] Sheet must be publicly accessible
- [-] No write-back capability
- [-] Data is public to anyone with URL

**Alternatives Considered:**
1. OAuth 2.0 flow - rejected because requires manual Google Cloud Console setup, client ID/secret management

---

## ADR-004: State Management - React Context

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Dashboard has multiple filters and computed values. Need shared state between components.

**Decision:**
Use React Context + useReducer for global state. No external state library (Redux, Zustand).

**Consequences:**
- [+] No additional dependencies
- [+] Built-in React feature
- [+] Simple for this use case
- [-] May cause re-renders on large state changes
- [-] No dev tools like Redux

**Alternatives Considered:**
1. Zustand - rejected because overkill for this scale
2. Redux Toolkit - rejected because too much boilerplate

---

## ADR-005: Charts - Recharts

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Need combo charts (bar+line), horizontal bars, and standard bar charts.

**Decision:**
Use Recharts library for all chart components.

**Consequences:**
- [+] Good React integration
- [+] Supports ComposedChart for combo charts
- [+] Decent documentation
- [-] Less performant than D3 for large datasets
- [-] Styling can be limiting

**Alternatives Considered:**
1. Chart.js + react-chartjs-2 - rejected because Recharts has better React component model
2. D3.js - rejected because too low-level for this project
3. Victory - rejected because Recharts more popular, better docs

---

## ADR-006: Styling - Tailwind CSS

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Need dark theme with custom gradients and responsive layout.

**Decision:**
Use Tailwind CSS for all styling. Custom theme via tailwind.config.ts.

**Consequences:**
- [+] Rapid development
- [+] Dark theme easy to configure
- [+] Responsive utilities built-in
- [-] CSS files can grow large
- [-] Learning curve for Tailwind classes

**Alternatives Considered:**
1. CSS Modules - rejected because Tailwind faster for this project
2. Styled Components - rejected because runtime overhead

---

## ADR-007: Font - Barlow Condensed

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc (from screenshot analysis)

**Context:**
Screenshot shows bold, slightly condensed numerals in scorecards. Need a font that matches.

**Decision:**
Use Barlow Condensed (weight 700) for large numbers. Use Inter or system font for body text.

**Consequences:**
- [+] Matches reference design
- [+] Free Google Font
- [+] Good readability at large sizes
- [-] Additional font download

**Alternatives Considered:**
1. Oswald - similar but slightly different aesthetic
2. Archivo Black - too heavy for this use case

---

## ADR-008: Memory System - File-Based

**Status:** Accepted
**Date:** 2025-01-21
**Deciders:** visionmc

**Context:**
Gemini Pro 3.1 needs persistent memory across sessions. Options: file-based MD files or MCP server.

**Decision:**
Use file-based memory system with append-only MEMORY.md and structured PROGRESS.md.

**Consequences:**
- [+] Zero setup (no server)
- [+] Human-readable/editable
- [+] Works in any environment
- [+] Portable
- [-] Manual checkpointing required
- [-] No programmatic search

**Alternatives Considered:**
1. MCP server (agent-memory-mcp) - rejected because requires Node.js server process

---

<!-- NEW ADRs BELOW THIS LINE -->
