"use client";

import React, { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import { fetchGoogleSheetCsv } from '@/lib/google-sheets';

export function GoogleSheetInput() {
  const { state, dispatch } = useDashboard();
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await fetchGoogleSheetCsv(url);
      if (data.length === 0) {
        throw new Error("No data found in the CSV or headers could not be mapped.");
      }

      dispatch({
        type: 'SET_DATA',
        payload: { source: 'google-sheets', data }
      });
      setUrl('');
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to load Google Sheet.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-dashboard-card border border-dashboard-border rounded-lg p-6 mt-4">
      <h2 className="text-lg font-display font-bold mb-4">Or use Google Sheets (CSV)</h2>
      
      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded mb-4 text-sm">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex gap-4">
        <input 
          type="url"
          placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
          className="flex-1 bg-dashboard-bg border border-dashboard-border rounded px-4 py-2 text-dashboard-text focus:outline-none focus:border-dashboard-accent-blue"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
        />
        <button 
          type="submit"
          disabled={loading || !url}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            loading || !url 
              ? 'bg-dashboard-border text-dashboard-muted' 
              : 'bg-dashboard-accent-blue text-white hover:bg-blue-600 shadow-lg shadow-dashboard-accent-blue/20'
          }`}
        >
          {loading ? 'Loading...' : 'Load CSV'}
        </button>
      </form>

      {state.dataSource === 'google-sheets' && state.rawData.length > 0 && (
        <div className="text-sm text-green-400 mt-4">
          ✓ Loaded {state.rawData.length} records from Google Sheets
        </div>
      )}
    </div>
  );
}
