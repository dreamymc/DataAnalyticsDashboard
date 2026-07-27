export interface SiteRecord {
  serialNumber: string;
  srName: string;
  highLevelStatus: string;       // Stage Funnel (10 stages)
  lowLevelStatus: string;
  accessVendor: string;          // Filter
  tcoBauVendor: string;          // Filter + TCO Award chart
  cwStatus: string;              // RFI Rally chart (7 stages)
  trsVendor: string;
  trsStatus: string;             // TCO Performance chart (5 stages)
  trsSolution: string;
  targetRfti: string | null;
  actualRfti: string | null;
  lapseDays: number | null;
  trsPlan: string | null;
  trsActual: string | null;
  odc: string | null;
  province: string;              // Filter (30 provinces)
  cityTown: string;              // Filter (49 towns)
  salesArea: string;             // Filter (7 areas)
  vanguardPrioSite: string;      // Filter ('Y' / 'N')
  program: string;               // e.g. TowerCo (Macro) - BTS
  isInPlan: boolean;             // '263 List / PLAN (In-Year)' === 'Yes'
  targetMonthTrfs: string | null; // 'JAN'–'DEC' or null
  targetQuarterTrfs: string | null; // 'Q1'–'Q4' or null
  actualMonthTrfs: string | null; // 'JAN'–'DEC' or null (coerced from 'N/A')
  actualQuarterTrfs: string | null; // 'Q1'–'Q4' or null
  detailedStatus: string;
  integrationRemarks: string;
  trsRemarks: string;
  latitude: number | null;
  longitude: number | null;
  solutionType: string;          // Filter (AN + LEOSAT, MW, MW/FSO, Fiber Extension)
  q3SprintTarget: number | null; // numeric: 23, 24, 25, 27, 33
}

export interface FilterState {
  salesArea: string;
  province: string;
  town: string;
  accessVendor: string;
  tco: string;
  solutionType: string;
  vanguardPrioSite: string;
}

export interface DashboardAssumptions {
  // Manually editable scorecards
  rtbCount: number;         // default: 271
  rftiCount: number;        // default: 166
  ytdActual: number;        // default: 99
  ytdPlan: number;          // default: 158

  // Build Plan sprint reference line
  q3SprintTarget: number;   // default: 33 (max value in dataset)
}

export interface PreviewRow {
  [key: string]: any;
}

export interface DashboardState {
  dataSource: 'excel' | 'google-sheets' | null;
  rawData: SiteRecord[];
  filters: FilterState;
  assumptions: DashboardAssumptions;
  isLoading: boolean;
  error: string | null;
  previewData: any[][] | null;
  headers: string[] | null;
  googleSheetsUrl: string | null;
  lastRefreshed: string | null;
}

export type DashboardAction =
  | { type: 'LOAD_STATE'; payload: Partial<DashboardState> }
  | { type: 'SET_DATA'; payload: { source: 'excel' | 'google-sheets'; data: SiteRecord[] } }
  | { type: 'CLEAR_DATA' }
  | { type: 'SET_FILTER'; payload: { key: keyof FilterState; value: string } }
  | { type: 'RESET_FILTERS' }
  | { type: 'UPDATE_ASSUMPTION'; payload: { key: keyof DashboardAssumptions; value: any } }
  | { type: 'SET_PREVIEW'; payload: { data: any[][]; headers: string[] } }
  | { type: 'CANCEL_PREVIEW' }
  | { type: 'CONFIRM_IMPORT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_GOOGLE_SHEETS_URL'; payload: string }
  | { type: 'SET_LAST_REFRESHED'; payload: string };
