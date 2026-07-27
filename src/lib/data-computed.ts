import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { applyFilters } from './filters';
import { SiteRecord } from '@/types';

export const MONTH_CODES = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const HIGH_LEVEL_STATUS_ORDER = [
  's-RFI',
  's-RFI & TRS Ready',
  'Awarded',
  'For Awarding',
  'LGU Permitting',
  'TSSR',
  'TRS Ready',
  "RTB'd",
  "RFI'd",
  'TRFS',
];

export const CW_STATUS_ORDER = [
  '18. RTB for Mobilization',
  '19. Site Clearing',
  '20. Excavation',
  '22. Rebar Installation',
  '23. Concrete Pouring',
  '24. Backfilling',
  '26. ODU Pad / Electrical',
];

export const TRS_STATUS_ORDER = [
  '(00) Not Started',
  "(01) Precon/ Eng'g Hold",
  '(02) Survey',
  '(05) Permitting',
  '(06) RTB (FOC/AN/Pending)',
];

export function useComputedData() {
  const { state } = useDashboard();
  const { rawData, filters, assumptions } = state;

  const filteredData = useMemo(() => {
    return applyFilters(rawData, filters);
  }, [rawData, filters]);

  const scorecards = useMemo(() => {
    const pipeline = rawData.length;
    const plan = rawData.filter(r => r.isInPlan).length;
    const actual = filteredData.filter(r => r.actualMonthTrfs !== null).length;
    
    const percentTrfsNum = plan > 0 ? (actual / plan) * 100 : 0;
    const percentRtbNum = pipeline > 0 ? (assumptions.rtbCount / pipeline) * 100 : 0;
    const percentRftiNum = pipeline > 0 ? (assumptions.rftiCount / pipeline) * 100 : 0;
    
    const ytdActual = assumptions.ytdActual;
    const ytdPlan = assumptions.ytdPlan;
    const ytdPercentTrfsNum = ytdPlan > 0 ? (ytdActual / ytdPlan) * 100 : 0;

    return {
      pipeline,
      plan,
      actual,
      percentTrfs: percentTrfsNum.toFixed(1) + '%',
      rtbCount: assumptions.rtbCount,
      percentRtb: percentRtbNum.toFixed(1) + '%',
      rftiCount: assumptions.rftiCount,
      percentRfti: percentRftiNum.toFixed(1) + '%',
      ytdActual,
      ytdPlan,
      ytdPercentTrfs: ytdPercentTrfsNum.toFixed(1) + '%',
    };
  }, [rawData, filteredData, assumptions]);

  const buildPlanData = useMemo(() => {
    return MONTH_CODES.map((code, idx) => {
      const plan = filteredData.filter(r => r.isInPlan && r.targetMonthTrfs === code).length;
      const actual = filteredData.filter(r => r.actualMonthTrfs === code).length;
      return {
        month: MONTH_NAMES[idx],
        monthCode: code,
        plan,
        actual,
        sprint: assumptions.q3SprintTarget,
      };
    });
  }, [filteredData, assumptions.q3SprintTarget]);

  const stageFunnelData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(r => {
      if (r.highLevelStatus) {
        counts[r.highLevelStatus] = (counts[r.highLevelStatus] || 0) + 1;
      }
    });

    return HIGH_LEVEL_STATUS_ORDER.map(stage => ({
      name: stage,
      count: counts[stage] || 0,
    }));
  }, [filteredData]);

  const rfiRallyData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(r => {
      if (r.cwStatus) {
        counts[r.cwStatus] = (counts[r.cwStatus] || 0) + 1;
      }
    });

    return CW_STATUS_ORDER.map(stage => ({
      name: stage,
      count: counts[stage] || 0,
    }));
  }, [filteredData]);

  const tcoAwardData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(r => {
      if (r.tcoBauVendor) {
        counts[r.tcoBauVendor] = (counts[r.tcoBauVendor] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [filteredData]);

  const tcoPerformanceData = useMemo(() => {
    const counts: Record<string, number> = {};
    filteredData.forEach(r => {
      if (r.trsStatus) {
        counts[r.trsStatus] = (counts[r.trsStatus] || 0) + 1;
      }
    });

    return TRS_STATUS_ORDER.map(status => ({
      name: status,
      count: counts[status] || 0,
    }));
  }, [filteredData]);

  const quarterlyData = useMemo(() => {
    const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
    return quarters.map(q => {
      const plan = filteredData.filter(r => r.isInPlan && r.targetQuarterTrfs === q).length;
      const actual = filteredData.filter(r => r.actualQuarterTrfs === q).length;
      const pct = plan > 0 ? ((actual / plan) * 100).toFixed(1) + '%' : '0.0%';
      return { quarter: q, plan, actual, pct };
    });
  }, [filteredData]);

  const provinceBreakdownData = useMemo(() => {
    const map: Record<string, { province: string; pipeline: number; plan: number; trfs: number }> = {};
    filteredData.forEach(r => {
      const p = r.province || 'Unassigned';
      if (!map[p]) {
        map[p] = { province: p, pipeline: 0, plan: 0, trfs: 0 };
      }
      map[p].pipeline += 1;
      if (r.isInPlan) map[p].plan += 1;
      if (r.actualMonthTrfs !== null) map[p].trfs += 1;
    });

    return Object.values(map).sort((a, b) => b.pipeline - a.pipeline);
  }, [filteredData]);

  const townBreakdownData = useMemo(() => {
    const map: Record<string, { town: string; pipeline: number; plan: number; rtb: number; rfi: number; trfs: number }> = {};
    filteredData.forEach(r => {
      const t = r.cityTown || 'Unassigned';
      if (!map[t]) {
        map[t] = { town: t, pipeline: 0, plan: 0, rtb: 0, rfi: 0, trfs: 0 };
      }
      map[t].pipeline += 1;
      if (r.isInPlan) map[t].plan += 1;
      if (r.highLevelStatus === "RTB'd" || r.cwStatus?.includes('RTB')) map[t].rtb += 1;
      if (r.highLevelStatus === "RFI'd") map[t].rfi += 1;
      if (r.actualMonthTrfs !== null) map[t].trfs += 1;
    });

    return Object.values(map).sort((a, b) => b.pipeline - a.pipeline);
  }, [filteredData]);

  const ongoingWirelessData = useMemo(() => {
    return filteredData.filter(r => 
      r.highLevelStatus === 'TRS Ready' || 
      r.highLevelStatus === 's-RFI & TRS Ready' ||
      r.trsStatus?.includes('TRS Ready')
    );
  }, [filteredData]);

  const ongoingTransportData = useMemo(() => {
    return filteredData.filter(r => 
      r.actualRfti !== null || 
      r.highLevelStatus === "RFI'd"
    );
  }, [filteredData]);

  return {
    filteredData,
    scorecards,
    buildPlanData,
    stageFunnelData,
    rfiRallyData,
    tcoAwardData,
    tcoPerformanceData,
    quarterlyData,
    provinceBreakdownData,
    townBreakdownData,
    ongoingWirelessData,
    ongoingTransportData,
  };
}
