import React from "react";
import { AlertCircle, Clock } from "lucide-react";
import { machineNamesMap } from "../utils/constants";

export default function TimelineTab({
  incidents
}) {
  return (
    <div className="space-y-6 animate-[fadeIn_0.3s_ease-out_forwards]">
      <div>
        <h2 className="text-2xl font-bold font-display tracking-tight">Factory Incident & Event Log</h2>
        <p className="text-slate-400 text-sm">Chronological registry of anomalies, model triggers, and maintenance event audits.</p>
      </div>

      <div className="glass-panel border border-slate-800 rounded-2xl p-6">
        <h3 className="font-bold text-md font-display mb-4 text-white">Edge Logger Events</h3>
        {incidents.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs font-mono">
            No incidents recorded. Edge twin system tracking running normally.
          </div>
        ) : (
          <div className="relative border-l border-slate-800 ml-3 pl-6 space-y-6 font-mono text-[11px]">
            {incidents.map((incident, i) => (
              <div key={i} className="relative">
                <div className="absolute -left-[30px] top-0.5 w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                <div className="flex justify-between items-start gap-4 flex-wrap text-slate-400">
                  <div className="space-y-1">
                    <span className="text-rose-400 font-bold block">{incident.type.toUpperCase()}</span>
                    <p className="text-slate-300 font-sans text-xs">{incident.event}</p>
                    <span className="text-slate-500 text-[10px] block">Asset: {machineNamesMap[incident.machine_id] || incident.machine_id}</span>
                  </div>
                  <span className="text-slate-500 shrink-0">{incident.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
