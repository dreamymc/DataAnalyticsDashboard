# AGENTS.md — Antigravity Agent Instructions

<!-- BEGIN:antigravity-agent-rules -->

## ⚠️ This is NOT standard Next.js

This project uses **Next.js 16.2.11** with **React 19** and **Tailwind CSS 4** — all with breaking changes from previous versions. Read the relevant guide before writing any code.

### Before writing ANY Next.js code:
1. Check `node_modules/next/dist/` for updated API docs
2. Note: `tailwind.config.ts` does NOT exist and must NOT be created
3. Note: Tailwind 4 uses `@import "tailwindcss"` + `@theme {}` in CSS only
4. Note: All interactive components require `"use client"` at the top
5. Note: React 19 has new hooks — avoid deprecated APIs

### Key File Locations
| Purpose | File |
|---------|------|
| Agent instructions | `GEMINI.md` |
| Session memory | `MEMORY.md` (append-only) |
| Task tracking | `PROGRESS.md` |
| Component API | `COMPONENTS.md` |
| Data schema | `DATA-SCHEMA.md` |
| Decisions log | `DECISIONS.md` |
| Visual reference | `info/Dashboard.pdf` |
| Sample data | `info/T8_Master_Dataset_Populated.xlsx` |

### Recovery Procedure (START OF EVERY SESSION)
```
1. Read MEMORY.md → find last CHECKPOINT
2. Read PROGRESS.md → verify current phase
3. Resume from CHECKPOINT.Next Task
4. Do NOT restart completed work
```

### Skill Activation (read SKILL.md before use)
- Excel analysis & data parsing: `~/.gemini/antigravity-cli/skills/xlsx/SKILL.md`
- Frontend UI/UX design: `~/.gemini/antigravity-cli/skills/frontend-design/SKILL.md`
- Implementation planning: `~/.gemini/antigravity-cli/skills/writing-plans/SKILL.md`
- Subagent orchestrations: `~/.gemini/antigravity-cli/skills/subagent-driven-development/SKILL.md`
- Parallel tasks: `~/.gemini/antigravity-cli/skills/dispatching-parallel-agents/SKILL.md`
- Code review (Logic & edge cases): `~/.gemini/antigravity-cli/skills/logic-lens/SKILL.md`
- Code review (Architecture & design): `~/.gemini/antigravity-cli/skills/brooks-lint/SKILL.md`
- Requesting & receiving code review: `~/.gemini/antigravity-cli/skills/requesting-code-review/SKILL.md`
- Debugging & issue diagnosis: `~/.gemini/antigravity-cli/skills/systematic-debugging/SKILL.md`
- Performance profiling: `~/.gemini/antigravity-cli/skills/performance-optimizer/SKILL.md`
- Webapp E2E testing: `~/.gemini/antigravity-cli/skills/webapp-testing/SKILL.md`
- Pre-delivery audit: `~/.gemini/antigravity-cli/skills/codebase-audit-pre-push/SKILL.md`
- Completion check: `~/.gemini/antigravity-cli/skills/verification-before-completion/SKILL.md`

<!-- END:antigravity-agent-rules -->
