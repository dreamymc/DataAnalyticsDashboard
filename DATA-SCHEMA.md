# DATA-SCHEMA.md — Field Mappings & Data Structures

> **Source of truth:** `info/T8_Master_Dataset_Populated.xlsx` (619 rows × 33 columns)
> Run `python3 scripts/analyze-excel.py` to re-derive these values from the file.

---

## Excel Source Columns (All 33)

| # | Column Name | Type | Key Use |
|---|------------|------|---------|
| 1 | Serial Number | string | Unique row ID |
| 2 | SR Name | string | Site/barangay display name |
| 3 | High Level Status | string | **Stage Funnel chart** |
| 4 | Low Level Status | string | Detail filter (future) |
| 5 | Access Vendor | string | Filter, TCO chart |
| 6 | TCO/BAU Vendor | string | Filter, **TCO Award chart** |
| 7 | CW Status | string | **RFI Rally chart** |
| 8 | TRS Vendor | string | Reference |
| 9 | TRS Status | string | **TCO Performance chart** |
| 10 | TRS Sol'n | string | Reference |
| 11 | Target RFTI | date | Reference |
| 12 | Actual RFTI | date | Reference |
| 13 | Lapse (days) | number | Reference |
| 14 | TRS Plan | date | Reference |
| 15 | TRS Actual | date | Reference |
| 16 | ODC | date | Reference |
| 17 | Province | string | **Filter** |
| 18 | City/Town | string | **Filter** (dependent on Province) |
| 19 | Sales Area | string | **Filter** |
| 20 | Vanguard/Prio Site | string (Y/N) | **Filter** |
| 21 | Program | string | Reference (not a primary filter) |
| 22 | 263 List / PLAN (In-Year) | string (Yes/No) | **Plan scorecard** computation |
| 23 | Target Month (TRFS Plan) | string (JAN–DEC / N/A) | **Build Plan** plan bars |
| 24 | Target Quarter (TRFS Plan) | string (Q1–Q4 / N/A) | Quarterly table |
| 25 | Actual Month (TRFS) | string (JAN–DEC / N/A) | **Build Plan** actual bars + Actual scorecard |
| 26 | Actual Quarter (TRFS) | string (Q1–Q4 / N/A) | Quarterly table |
| 27 | Detailed Status | string | Detail filter (future) |
| 28 | Integration Remarks | string | Reference |
| 29 | TRS Remarks | string | Reference |
| 30 | Latitude | number | Future map view |
| 31 | Longitude | number | Future map view |
| 32 | Solution Type | string | **Filter** |
| 33 | Q3 Sprint Target | number (23–33) | **Build Plan** sprint line |

---

## Known Distinct Values

### High Level Status (Stage Funnel — ordered for display)
```
s-RFI                (33)
s-RFI & TRS Ready    (21)   ← ampersand &, not HTML entity
Awarded              (58)
For Awarding         (158)
LGU Permitting       (97)
TSSR                 (35)   ← ⚠️ was missing from old docs
TRS Ready            (26)
RTB'd                (51)   ← apostrophe 'd
RFI'd                (39)   ← apostrophe 'd
TRFS                 (101)
```
> **10 total stages.** Display in this order. Show even if count = 0.

### CW Status (RFI Rally — ordered for display)
```
18. RTB for Mobilization   (92)
19. Site Clearing           (91)
20. Excavation              (83)
22. Rebar Installation      (80)
23. Concrete Pouring        (95)
24. Backfilling             (82)
26. ODU Pad / Electrical    (96)
```

### TRS Status (TCO Performance)
```
(00) Not Started
(01) Precon/ Eng'g Hold
(02) Survey
(05) Permitting
(06) RTB (FOC/AN/Pending)
```

### Sales Area
```
Northern Mindanao (216)
Zamboanga Peninsula (146)
BARMM (114)
Caraga (66)
SOCCSKSARGEN (26)
Davao Region (18)
Unassigned (33)
```

### Access Vendor
```
ERICSSON (490)   HT (8)   NOKIA (121)
```

### TCO/BAU Vendor
```
FRONTIER (244)   PHILTOWER (157)   UNITY (74)   ALLIANCE (49)   LDIC (41)
EDOTCO (40)   ISON (6)   HT (4)   NOKIA (4)
```

### Solution Type
```
AN + LEOSAT (167)   MW (154)   MW/FSO (150)   Fiber Extension (148)
```

### Vanguard/Prio Site
```
Y (113)   N (506)
```

---

## TypeScript Types

### SiteRecord (parsed from Excel row)

```typescript
interface SiteRecord {
  serialNumber: string;
  srName: string;
  highLevelStatus: string;       // Stage Funnel
  lowLevelStatus: string;
  accessVendor: string;          // Filter
  tcoBauVendor: string;          // Filter + TCO Award chart
  cwStatus: string;              // RFI Rally chart
  trsVendor: string;
  trsStatus: string;             // TCO Performance chart
  trsSolution: string;
  targetRfti: string | null;
  actualRfti: string | null;
  lapseDays: number | null;
  trsPlan: string | null;
  trsActual: string | null;
  odc: string | null;
  province: string;              // Filter
  cityTown: string;              // Filter (dependent on province)
  salesArea: string;             // Filter
  vanguardPrioSite: string;      // Filter ('Y'/'N')
  program: string;
  isInPlan: boolean;             // '263 List / PLAN' === 'Yes'
  targetMonthTrfs: string | null; // 'JAN'–'DEC' or null
  targetQuarterTrfs: string | null;
  actualMonthTrfs: string | null; // 'JAN'–'DEC' or null
  actualQuarterTrfs: string | null;
  detailedStatus: string;
  integrationRemarks: string;
  trsRemarks: string;
  latitude: number | null;
  longitude: number | null;
  solutionType: string;          // Filter
  q3SprintTarget: number | null; // numeric: 23–33
}
```

### FilterState

```typescript
interface FilterState {
  salesArea: string;
  province: string;
  town: string;
  accessVendor: string;
  tco: string;
  solutionType: string;
  vanguardPrioSite: string;
}
```

### DashboardAssumptions (editable overrides only)

```typescript
interface DashboardAssumptions {
  // Manually editable scorecards
  rtbCount: number;         // default: 271
  rftiCount: number;        // default: 166
  ytdActual: number;        // default: 99
  ytdPlan: number;          // default: 158

  // Monthly plan overrides (when no Excel data is loaded)
  monthlyPlanTrfs: number[];   // 12 values, Jan-Dec
  // Note: actual TRFS bars are ALWAYS computed from Excel data
  // Note: pipeline, plan, actual scorecards are ALWAYS computed from data
}
```

### Computed Scorecards (never stored, always derived)

```typescript
interface ComputedScorecards {
  pipeline: number;     // rawData.length
  plan: number;         // rawData.filter(r => r.isInPlan).length
  actual: number;       // filteredData.filter(r => r.actualMonthTrfs !== null).length
  percentTrfs: string;  // (actual / plan * 100).toFixed(1) + '%'
  percentRtb: string;   // (rtbCount / pipeline * 100).toFixed(1) + '%'
  percentRfti: string;  // (rftiCount / pipeline * 100).toFixed(1) + '%'
  ytdPercentTrfs: string; // (ytdActual / ytdPlan * 100).toFixed(1) + '%'
}
```

### Chart Data Types

```typescript
interface BuildPlanChartData {
  month: string;        // 'Jan'–'Dec'
  plan: number;         // count of rows where isInPlan && targetMonthTrfs === month
  actual: number;       // count of rows where actualMonthTrfs === month
  sprint: number;       // for chart line: use a single editable assumption (default 33)
}

interface StageFunnelData {
  name: string;         // High Level Status value
  count: number;        // count in filteredData
}

interface RFIRallyData {
  name: string;         // CW Status label (short)
  count: number;        // count in filteredData
}

interface TCOAwardData {
  name: string;         // TCO/BAU Vendor
  count: number;
}

interface TCOPerformanceData {
  name: string;         // TRS Status
  count: number;
}
```

---

## Q3 Sprint Target — Correct Interpretation

`Q3 Sprint Target` is an **integer column** present on every row (no nulls). Values: `23, 24, 25, 27, 33`.

- This is **NOT** a 12-element monthly array (that was incorrect in the old docs)
- Each site row has its own sprint target number
- **For the BuildPlanChart orange line:** treat as a **single flat reference value** per chart
  - Implementation: display a horizontal reference line at the value from `assumptions.q3SprintTarget` (editable, default `33`)
  - Counts: `{23: 122, 24: 123, 25: 127, 27: 119, 33: 128}`

---

## Quarterly Plan Data (verified from Excel)

| Quarter | Plan Count | Actual Count |
|---------|-----------|-------------|
| Q1 | 77 | 43 |
| Q2 | 56 | 50 |
| Q3 | 74 | 8 |
| Q4 | 56 | 0 |
| **Total** | **263** | **101** |

Verified triple-ways: monthly sums == quarterly column sums == total scorecards. No discrepancy.

---

## ⚠️ Province → City/Town Is NOT Strictly Hierarchical

23 out of 49 cities appear under **multiple provinces** in the data (e.g., `ZAMBOANGA CITY` appears under 17 provinces). This is a data quality issue in the source Excel.

**Implication for Town filter:** When Province is selected, filter the Town dropdown to show towns that appear in **any row** where `province === selectedProvince`. Do NOT assume a town belongs exclusively to one province.

---


The COUNTA quirk pattern (may appear in user-uploaded files):

```
Row 1: [619, 619, 619, 619, ...]   ← COUNTA formula result row
Row 2: [Serial Number, SR Name, ...]  ← Real headers
Row 3+: data rows
```

**Detection logic:**
```typescript
function detectHeaderRowIndex(rows: any[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    const nonNumericCount = row.filter(cell => {
      const str = String(cell ?? '').trim();
      return str.length > 0 && isNaN(Number(str));
    }).length;
    if (nonNumericCount >= row.length * 0.6) return i;
  }
  return 0;
}
```

**Column mapping** — try to fuzzy-match these known headers:

```typescript
const HEADER_ALIASES: Record<string, string[]> = {
  serialNumber:      ['Serial Number', 'Serial No', 'ID'],
  srName:            ['SR Name', 'Site Name', 'Barangay', 'SR'],
  highLevelStatus:   ['High Level Status', 'Lead Indicator', 'Stage', 'Status'],
  accessVendor:      ['Access Vendor', 'Vendor', 'Supplier'],
  tcoBauVendor:      ['TCO/BAU Vendor', 'TCO Vendor', 'BAU', 'TCO'],
  cwStatus:          ['CW Status', 'Civil Works Status'],
  trsStatus:         ['TRS Status'],
  province:          ['Province', 'Region'],
  cityTown:          ['City/Town', 'Town', 'City', 'Municipality'],
  salesArea:         ['Sales Area'],
  vanguardPrioSite:  ['Vanguard/Prio Site', 'Vanguard', 'Priority'],
  program:           ['Program'],
  isInPlan:          ['263 List / PLAN (In-Year)', '263 List', 'PLAN'],
  targetMonthTrfs:   ['Target Month (TRFS Plan)', 'Target Month'],
  targetQuarterTrfs: ['Target Quarter (TRFS Plan)', 'Target Quarter'],
  actualMonthTrfs:   ['Actual Month (TRFS)', 'Actual Month'],
  actualQuarterTrfs: ['Actual Quarter (TRFS)', 'Actual Quarter'],
  solutionType:      ['Solution Type'],
  q3SprintTarget:    ['Q3 Sprint Target', 'Q3 Sprint'],
  latitude:          ['Latitude', 'Lat'],
  longitude:         ['Longitude', 'Lng', 'Long'],
};
```

---

## Month String to Index Map

```typescript
const MONTH_ORDER = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
const MONTH_DISPLAY = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
```
