import React from 'react';
import { UserProfile } from '../types';
import { BarChart3, TrendingUp, Layers, CheckCircle2, DollarSign } from 'lucide-react';

interface ProjectAnalyticsProps {
  user: UserProfile;
}

export const ProjectAnalytics: React.FC<ProjectAnalyticsProps> = ({ user }) => {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#D64062]" />
            <span>Project Execution & BOQ Analytics</span>
          </h3>
          <p className="text-xs text-slate-500">Real-time D3 analytics and site stage velocity</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-900 text-[#0F1428] dark:text-slate-300 text-[10px] font-mono font-bold">
          LIVE METRICS
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Active Sites</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">12 Projects</div>
          <div className="text-[10px] text-[#0F1428] font-semibold mt-1">↑ +2 this month</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Total BOQ Value</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">₹1.85 Cr</div>
          <div className="text-[10px] text-[#0F1428] font-semibold mt-1">18% GST Accounted</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">31-Stage Velocity</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">84% On Track</div>
          <div className="text-[10px] text-[#0F1428] font-semibold mt-1">Stage 14 active</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800">
          <div className="text-[11px] font-semibold text-slate-500">Render Efficiency</div>
          <div className="text-xl font-black text-slate-900 dark:text-white mt-1">4.2s Cloud Time</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-1">GPU Cluster Ready</div>
        </div>
      </div>
    </div>
  );
};
