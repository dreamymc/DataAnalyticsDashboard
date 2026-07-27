# DATA-SCHEMA.md - Field Mappings & Data Structures

## Excel Source Columns

The source Excel file has 8 columns. Headers may be in different positions or broken.

| Expected Header | Alt Names / Variants | Required | Notes |
|-----------------|---------------------|----------|-------|
| Serial Number | Serial No, ID, # | Yes | May be numeric or text |
| Lead Indicator (LOCAL) | Lead Indicator, Stage, Status | Yes | Contains "[05] CW DOING" format |
| Vendor | Access Vendor, Supplier | Yes | Site access vendor |
| Site/Barangay | Site Name, Barangay, Location | Yes | May appear as broken header |
| TCO/BAU Vendor | TCO Vendor, BAU, TCO | Yes | TCO or BAU vendor name |
| Province | Region, State | Yes | Geographic province |
| City/Town | Town, City, Municipality | Yes | City or town name |
| Program | Solution Type, Type | Yes | Program/solution type |

---

## TypeScript Types

### SiteRecord (parsed from Excel)

```typescript
interface SiteRecord {
  serialNumber: string;
  leadIndicator: string;      // "[05] CW DOING", "[06] S-RFI", etc.
  vendor: string;
  siteBarangay: string;
  tcoBauVendor: string;
  province: string;
  cityTown: string;
  program: string;
}
```

### FilterState

```typescript
interface FilterState {
  salesArea: string;          // placeholder - not in Excel
  province: string;           // from SiteRecord.province
  town: string;               // from SiteRecord.cityTown
  accessVendor: string;       // from SiteRecord.vendor
  tco: string;                // from SiteRecord.tcoBauVendor
  solutionType: string;       // from SiteRecord.program
  vanguardPrioSite: string;   // placeholder - not in Excel
}
```

### DashboardAssumptions (editable)

```typescript
interface DashboardAssumptions {
  // Scorecard numbers
  pipeline: number;           // default: 619
  planTotal: number;          // default: 263
  rtbCount: number;           // default: 271
  rftiCount: number;          // default: 166
  
  // YTD block
  ytdActual: number;          // default: 99
  ytdPlan: number;            // default: 158
  monthGap: number;           // default: 59
  
  // Quarterly Plan
  quarterlyPlan: {
    q1: number;               // default: 77
    q2: number;               // default: 56
    q3: number;               // default: 74
    q4: number;               // default: 56
  };
  quarterlyActual: {
    q1: number;               // default: 43
    q2: number;               // default: 50
    q3: number;               // default: 6
    q4: number;               // default: 0
  };
  
  // Build Plan chart (monthly)
  monthlyPlanTrfs: number[];  // 12 values, Jan-Dec
  monthlyActualTrfs: number[];// 12 values, Jan-Dec
  q3SprintLine: number[];     // 12 values, Jan-Dec
  
  // RFI Rally (fully mock)
  rfiRallyData: {
    forMob: number;
    excavation: number;
    rebarInstallation: number;
    concretePouring: number;
    backfilling: number;
    towerErection: number;
    sRfi: number;
    rfi: number;
  };
  
  // Stage ordering
  stageOrder: string[];       // configurable
}
```

---

## Lead Indicator Values

From sample data (43 rows):

| Value | Stage Order | Notes |
|-------|-------------|-------|
| [05] CW DOING | 5 | Civil works in progress |
| [06] S-RFI | 6 | Site RFI |
| [07] S-RFI w/ TRS | 7 | Site RFI with TRS |
| [08] RFI | 8 | Ready for inspection |
| [09] RFI with TRS | 9 | RFI with TRS |

**Earlier stages [01]-[04] may exist in other files - read dynamically, don't hardcode.**

---

## Header Detection Algorithm

The parser must handle the COUNTA() quirk:

```
Row 1: [43, 43, 43, 43, 43, 43, 43, 43]  ← COUNTA formula row
Row 2: [Serial Number, Lead Indicator, ...] ← Real headers
Row 3+: [data rows]
```

### Detection Logic

```typescript
function detectHeaderRow(rows: any[][]): number {
  for (let i = 0; i < Math.min(rows.length, 10); i++) {
    const row = rows[i];
    const nonNumericCount = row.filter(cell => {
      const str = String(cell).trim();
      return str.length > 0 && isNaN(Number(str));
    }).length;
    
    // Header row: most cells are non-numeric text
    if (nonNumericCount >= row.length * 0.6) {
      return i;
    }
  }
  return 0; // fallback to first row
}
```

### Broken Header Detection

Check if any header value looks like a site name (contains underscores, "Brgy", etc.):

```typescript
function isBrokenHeader(header: string): boolean {
  const patterns = [/Brgy/i, /_/i, /Davao/i, /City/i, /Province/i];
  return patterns.some(p => p.test(header));
}
```

---

## Column Mapping UI

When broken headers are detected, show mapping table:

```
Detected Header          →  Map To
─────────────────────────────────────
Brgy.Tagluno_DavaoCity   →  [Site/Barangay] (auto-detected)
Serial Number            →  Serial Number ✓
Lead Indicator (LOCAL)   →  Lead Indicator ✓
...
```

User can:
1. Accept auto-mapping
2. Override mapping
3. Skip column (don't import)

---

## Data Validation Rules

| Field | Validation | On Failure |
|-------|-----------|------------|
| serialNumber | Any value | Keep as-is |
| leadIndicator | Must contain stage pattern | Flag as warning |
| vendor | Any non-empty string | Flag as warning |
| siteBarangay | Any non-empty string | Flag as warning |
| tcoBauVendor | Any non-empty string | Flag as warning |
| province | Any non-empty string | Flag as warning |
| cityTown | Any non-empty string | Flag as warning |
| program | Any non-empty string | Flag as warning |

---

## Computed Values

### Actual (Scorecard)

```typescript
const actual = filteredData.length;
```

### %TRFS

```typescript
const percentTrfs = (actual / assumptions.planTotal) * 100;
```

### %RTB

```typescript
const percentRtb = (assumptions.rtbCount / assumptions.pipeline) * 100;
```

### %RFTI

```typescript
const percentRfti = (assumptions.rftiCount / assumptions.pipeline) * 100;
```

### Stage Counts (for charts)

```typescript
const stageCounts = filteredData.reduce((acc, record) => {
  const stage = record.leadIndicator;
  acc[stage] = (acc[stage] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
```
