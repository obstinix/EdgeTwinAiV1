import React from "react";
import { Sparkles, Clock, RefreshCw, CheckCircle } from "lucide-react";
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
          <h2 className="text-2xl font-bold font-display tracking-tight">Active Maintenance Planner</h2>
          <p className="text-slate-400 text-sm">Real-time scheduling ledger linking prescription recommendations with operational shifts.</p>
        </div>
        <button 
          onClick={optimizeSchedule}
          className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-4 py-2 rounded-lg transition flex items-center gap-1.5 glow-emerald"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Optimize Schedule
        </button>
      </div>

      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-md font-display mb-4 flex items-center gap-1.5 text-white">
          <Sparkles className="w-4 h-4 text-emerald-400" /> Active Maintenance Tasks
        </h3>
        
        {schedule.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            No active maintenance sessions scheduled. Telemetry is fully nominal.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {schedule.map(task => (
              <div key={task.id} className="py-4 flex justify-between items-center gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{machineNamesMap[task.machine_id] || task.machine_id}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${task.status === "completed" ? "bg-emerald-500/10 text-emerald-400" : "bg-amber-500/10 text-amber-400"}`}>
                      {task.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">{task.action}</p>
                </div>
                <div className="flex items-center gap-6 font-mono text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{task.scheduled_time} ({task.duration_hours}h duration)</span>
                  </div>
                  {task.status !== "completed" && (
                    <button
                      onClick={() => completeTaskLocal(task.id)}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-600 text-slate-200 px-3 py-1 rounded font-bold transition active:scale-95 text-[10px]"
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
