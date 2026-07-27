import { useMemo } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { applyFilters } from './filters';

export function useComputedData() {
  const { state } = useDashboard();
  const { rawData, filters, assumptions } = state;

  const filteredData = useMemo(() => {
    return applyFilters(rawData, filters);
  }, [rawData, filters]);

  const scorecards = useMemo(() => {
    const actual = filteredData.length;
    const percentTrfs = assumptions.planTotal > 0 ? (actual / assumptions.planTotal) * 100 : 0;
    const percentRtb = assumptions.pipeline > 0 ? (assumptions.rtbCount / assumptions.pipeline) * 100 : 0;
    const percentRfti = assumptions.pipeline > 0 ? (assumptions.rftiCount / assumptions.pipeline) * 100 : 0;

    return {
      actual,
      percentTrfs: percentTrfs.toFixed(1),
      percentRtb: percentRtb.toFixed(1),
      percentRfti: percentRfti.toFixed(1)
    };
  }, [filteredData, assumptions]);

  const ytdData = useMemo(() => {
    const actual = assumptions.ytdActual;
    const plan = assumptions.ytdPlan;
    const percentTrfs = plan > 0 ? (actual / plan) * 100 : 0;
    return {
      actual,
      plan,
      percentTrfs: percentTrfs.toFixed(1),
      monthGap: assumptions.monthGap
    };
  }, [assumptions]);

  const stageCounts = useMemo(() => {
    const counts = filteredData.reduce((acc, record) => {
      const stage = record.leadIndicator;
      if (stage) {
        acc[stage] = (acc[stage] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    // Format for Recharts, sorted by stageOrder
    return assumptions.stageOrder.map(stage => ({
      name: stage,
      count: counts[stage] || 0
    }));
  }, [filteredData, assumptions.stageOrder]);

  return {
    filteredData,
    scorecards,
    ytdData,
    stageCounts
  };
}
