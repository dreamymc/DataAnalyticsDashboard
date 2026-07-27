export interface SiteRecord {
  serialNumber: string;
  leadIndicator: string;
  vendor: string;
  siteBarangay: string;
  tcoBauVendor: string;
  province: string;
  cityTown: string;
  program: string;
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
  pipeline: number;
  planTotal: number;
  rtbCount: number;
  rftiCount: number;

  ytdActual: number;
  ytdPlan: number;
  monthGap: number;

  quarterlyPlan: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };
  quarterlyActual: {
    q1: number;
    q2: number;
    q3: number;
    q4: number;
  };

  monthlyPlanTrfs: number[];
  monthlyActualTrfs: number[];
  q3SprintLine: number[];

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

  stageOrder: string[];
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
  previewData: PreviewRow[] | null;
  headers: string[] | null;
}

export type DashboardAction =
  | { type: 'LOAD_STATE'; payload: { assumptions?: DashboardAssumptions; rawData?: SiteRecord[]; dataSource?: 'excel' | 'google-sheets' | null } }
  | { type: 'SET_DATA'; payload: { source: 'excel' | 'google-sheets'; data: SiteRecord[] } }
  | { type: 'SET_FILTER'; payload: { key: keyof FilterState; value: string } }
  | { type: 'RESET_FILTERS' }
  | { type: 'UPDATE_ASSUMPTION'; payload: { key: keyof DashboardAssumptions; value: any } }
  | { type: 'SET_PREVIEW'; payload: { data: PreviewRow[]; headers: string[] } }
  | { type: 'CONFIRM_IMPORT' }
  | { type: 'SET_ERROR'; payload: string }
  | { type: 'CLEAR_ERROR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'CANCEL_PREVIEW' }
  | { type: 'CLEAR_DATA' };
