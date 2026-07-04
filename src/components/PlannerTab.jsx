import React from "react";
import { Sparkles, Clock, RefreshCw } from "lucide-react";
import { machineNamesMap } from "../utils/constants";

export default function PlannerTab({
  schedule,
  completeTaskLocal,
  optimizeSchedule
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-slate-900">Active Maintenance Planner</h2>
          <p className="text-slate-500 text-sm font-sans">Real-time scheduling ledger linking prescription recommendations with operational shifts.</p>
        </div>
        <button 
          onClick={optimizeSchedule}
          className="bg-[#0061FF] hover:bg-[#0052D9] active-press text-white text-xs font-bold font-display uppercase tracking-widest px-4 py-2.5 rounded-lg transition-all duration-150 flex items-center gap-1.5 shadow-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Optimize Schedule
        </button>
      </div>

      <div className="glass-panel border border-slate-200 bg-white rounded-2xl p-6">
        <h3 className="font-bold text-xs uppercase tracking-widest font-hud mb-6 flex items-center gap-1.5 text-slate-800 border-b border-slate-150 pb-3">
          <Sparkles className="w-4 h-4 text-[#0061FF] animate-pulse" /> Active Maintenance Tasks
        </h3>
        
        {schedule.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-xs font-mono uppercase tracking-widest">
            No active maintenance sessions scheduled. Telemetry is fully nominal.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {schedule.map(task => (
              <div key={task.id} className="py-4 flex justify-between items-center gap-4 text-xs transition-colors hover:bg-slate-50 px-2 rounded-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-display text-slate-800 text-sm">{machineNamesMap[task.machine_id] || task.machine_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold font-mono tracking-widest border ${task.status === "completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-normal">{task.action}</p>
                </div>
                <div className="flex items-center gap-6 font-mono text-[10px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{task.scheduled_time} (<strong className="text-slate-700 font-hud">{task.duration_hours}h</strong> duration)</span>
                  </div>
                  {task.status !== "completed" && (
                    <button
                      onClick={() => completeTaskLocal(task.id)}
                      className="bg-slate-50 border border-slate-200 hover:border-slate-350 hover:text-slate-900 text-slate-700 px-3.5 py-1.5 rounded-lg font-bold font-display uppercase tracking-widest text-[9px] transition-all duration-150 active-press"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
